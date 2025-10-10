// File: backend/src/core/memory/SqliteMemoryAdapter.ts
/**
 * @file SqliteMemoryAdapter.ts
 * @version 1.2.0
 * @description SQLite implementation of the IMemoryAdapter for storing conversation history.
 * V1.2.0: Made SQLite persistence conditional via ENABLE_SQLITE_MEMORY env var.
 * Corrected insertion order to prevent FOREIGN KEY constraint errors when enabled.
 * V1.1.0: Added tool_calls and tool_call_id columns. Handled JSON stringification/parsing.
 */

import Database, { type Database as DB } from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import type {
  IMemoryAdapter,
  IStoredConversationTurn,
  IMemoryRetrievalOptions,
} from './IMemoryAdapter.js';

const DB_DIR = path.join(process.cwd(), 'db_data');
const DB_PATH = path.join(DB_DIR, 'vca_memory.sqlite3');

// Check environment variable to enable/disable SQLite persistence
const SQLITE_MEMORY_ENABLED = process.env.ENABLE_SQLITE_MEMORY === 'true';

export class SqliteMemoryAdapter implements IMemoryAdapter {
  private db: DB | null = null;
  private isEnabled: boolean = SQLITE_MEMORY_ENABLED;

  private ensureConversationPersonaColumn(): void {
    if (!this.db) {
      return;
    }

    try {
      const columns = this.db.prepare('PRAGMA table_info(conversations);').all() as Array<{ name: string }>;
      const hasPersonaColumn = columns.some(column => column.name === 'persona');
      if (!hasPersonaColumn) {
        console.log('[SqliteMemoryAdapter] Adding missing persona column to conversations table.');
        this.db.exec('ALTER TABLE conversations ADD COLUMN persona TEXT;');
      }
    } catch (error) {
      console.error('[SqliteMemoryAdapter] Failed to ensure persona column exists:', error);
      throw error;
    }
  }

  public async initialize(): Promise<void> {
    if (!this.isEnabled) {
      console.log('[SqliteMemoryAdapter] SQLite memory is DISABLED via ENABLE_SQLITE_MEMORY environment variable.');
      return;
    }

    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
        console.log(`[SqliteMemoryAdapter] Created database directory: ${DB_DIR}`);
      }

      this.db = new Database(DB_PATH, { verbose: process.env.NODE_ENV === 'development' ? console.log : undefined });
      console.log(`[SqliteMemoryAdapter] Connected to SQLite database: ${DB_PATH}`);
      
      // Optional: Conversations table for meta-info about each conversation session
            this.db.exec(`
        CREATE TABLE IF NOT EXISTS conversations (
          conversationId TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          agentId TEXT, 
          createdAt INTEGER NOT NULL,
          lastActivity INTEGER NOT NULL,
          summary TEXT,
          title TEXT,
          persona TEXT
        );
      `);
      this.db.exec('CREATE INDEX IF NOT EXISTS idx_conversations_user_activity ON conversations (userId, lastActivity);');
      this.db.exec('CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations (userId);');

      this.ensureConversationPersonaColumn();


      this.db.exec(`
        CREATE TABLE IF NOT EXISTS conversation_turns (
          storageId TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          conversationId TEXT NOT NULL,
          agentId TEXT NOT NULL,
          role TEXT NOT NULL CHECK(role IN ('user', 'assistant', 'system', 'tool')),
          content TEXT,
          timestamp INTEGER NOT NULL,
          model TEXT,
          prompt_tokens INTEGER,
          completion_tokens INTEGER,
          total_tokens INTEGER,
          tool_calls TEXT,
          tool_call_id TEXT,
          metadata TEXT,
          summary TEXT,
          FOREIGN KEY (conversationId) REFERENCES conversations(conversationId) ON DELETE CASCADE ON UPDATE CASCADE 
        );
      `);
      this.db.exec('CREATE INDEX IF NOT EXISTS idx_conversation_turns_user_conv_time ON conversation_turns (userId, conversationId, timestamp DESC);'); // Changed to DESC for recency
      this.db.exec('CREATE INDEX IF NOT EXISTS idx_conversation_turns_agent ON conversation_turns (agentId);');

      console.log('[SqliteMemoryAdapter] Database schema initialized (conversations, conversation_turns tables).');
    } catch (error) {
      console.error('[SqliteMemoryAdapter] Failed to initialize SQLite database:', error);
      this.isEnabled = false; // Disable if initialization fails
      throw error;
    }
  }

  public async storeConversationTurn(
    userId: string,
    conversationId: string,
    turnData: Omit<IStoredConversationTurn, 'storageId' | 'conversationId'>
  ): Promise<string> {
    if (!this.isEnabled || !this.db) {
      // console.log('[SqliteMemoryAdapter] Storing turn is skipped (SQLite disabled or DB not initialized).');
      return uuidv4(); // Return a dummy storageId
    }

    const storageId = uuidv4();
    const {
      agentId, role, content, timestamp, model,
      usage, tool_calls, tool_call_id, metadata, summary,
    } = turnData;

    try {
      // **FIXED ORDER: Ensure conversation record exists first**
      const upsertConversationStmt = this.db.prepare(`
        INSERT INTO conversations (conversationId, userId, agentId, createdAt, lastActivity)
        VALUES (@conversationId, @userId, @agentId, @timestamp, @timestamp)
        ON CONFLICT(conversationId) DO UPDATE SET
          lastActivity = excluded.lastActivity,
          -- Update agentId only if the new turn provides one and it's different,
          -- or if the existing one is null. This helps preserve the initial agent.
          agentId = CASE 
                       WHEN excluded.agentId IS NOT NULL AND conversations.agentId IS NULL THEN excluded.agentId
                       WHEN excluded.agentId IS NOT NULL AND conversations.agentId != excluded.agentId THEN excluded.agentId -- Or some other logic for agent change
                       ELSE conversations.agentId 
                     END
      `);
      upsertConversationStmt.run({ conversationId, userId, agentId, timestamp });

      const stmt = this.db.prepare(`
        INSERT INTO conversation_turns (
          storageId, userId, conversationId, agentId, role, content, timestamp,
          model, prompt_tokens, completion_tokens, total_tokens,
          tool_calls, tool_call_id, metadata, summary
        ) VALUES (@storageId, @userId, @conversationId, @agentId, @role, @content, @timestamp, 
                 @model, @prompt_tokens, @completion_tokens, @total_tokens,
                 @tool_calls, @tool_call_id, @metadata, @summary)
      `);
      stmt.run({
        storageId, userId, conversationId, agentId, role, content, timestamp,
        model,
        prompt_tokens: usage?.prompt_tokens ?? null,
        completion_tokens: usage?.completion_tokens ?? null,
        total_tokens: usage?.total_tokens ?? null,
        tool_calls: tool_calls ? JSON.stringify(tool_calls) : null,
        tool_call_id,
        metadata: metadata ? JSON.stringify(metadata) : null,
        summary
      });

      console.log(`[SqliteMemoryAdapter] Stored turn ${storageId} for conv ${conversationId}`);
      return storageId;
    } catch (error) {
      console.error(`[SqliteMemoryAdapter] Error storing turn for conv ${conversationId}:`, error);
      throw error;
    }
  }

  public async retrieveConversationTurns(
    userId: string,
    conversationId: string,
    options?: IMemoryRetrievalOptions
  ): Promise<IStoredConversationTurn[]> {
    if (!this.isEnabled || !this.db) {
      // console.log('[SqliteMemoryAdapter] Retrieving turns is skipped (SQLite disabled or DB not initialized).');
      return [];
    }
    // ... (rest of the method remains the same)
    let query = 'SELECT * FROM conversation_turns WHERE userId = ? AND conversationId = ?';
    const params: any[] = [userId, conversationId];

    if (options?.agentId) {
      query += ' AND agentId = ?';
      params.push(options.agentId);
    }
    if (options?.afterTimestamp) {
      query += ' AND timestamp > ?';
      params.push(options.afterTimestamp);
    }
    if (options?.beforeTimestamp) {
      query += ' AND timestamp < ?';
      params.push(options.beforeTimestamp);
    }

    // If a limit is provided, we usually want the MOST RECENT 'limit' messages.
    // So we sort by timestamp DESC, take the limit, then reverse to get chronological for return.
    if (options?.limit) {
      query += ' ORDER BY timestamp DESC LIMIT ?';
      params.push(options.limit);
    } else {
      query += ' ORDER BY timestamp ASC';
    }

    try {
      const stmt = this.db.prepare(query);
      const rows = stmt.all(...params) as any[];

      // If we limited and sorted by DESC, we need to reverse for chronological order.
      const orderedRows = options?.limit ? rows.reverse() : rows;

      return orderedRows.map(row => ({
        storageId: row.storageId,
        userId: row.userId,
        conversationId: row.conversationId,
        agentId: row.agentId,
        role: row.role,
        content: row.content,
        timestamp: row.timestamp,
        model: row.model,
        usage: (row.prompt_tokens !== null || row.completion_tokens !== null || row.total_tokens !== null)
          ? {
              prompt_tokens: row.prompt_tokens,
              completion_tokens: row.completion_tokens,
              total_tokens: row.total_tokens,
            }
          : undefined,
        tool_calls: row.tool_calls ? JSON.parse(row.tool_calls) : undefined,
        tool_call_id: row.tool_call_id,
        metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
        summary: row.summary,
      }));
    } catch (error) {
      console.error(`[SqliteMemoryAdapter] Error retrieving turns for conv ${conversationId}:`, error);
      throw error;
    }
  }

  public async listUserConversations(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<Array<{ conversationId: string; lastActivity: number; agentId?: string; summary?: string; title?: string; turnCount?: number; persona?: string | null }>> {
    if (!this.isEnabled || !this.db) {
      // console.log('[SqliteMemoryAdapter] Listing conversations is skipped (SQLite disabled or DB not initialized).');
      return [];
    }
    // ... (rest of the method remains the same)
    const query = `
      SELECT 
        c.conversationId, 
        c.lastActivity, 
        c.agentId, 
        c.summary, 
        c.title,
      c.persona,
        (SELECT COUNT(*) FROM conversation_turns ct WHERE ct.conversationId = c.conversationId) as turnCount
      FROM conversations c
      WHERE c.userId = ?
      ORDER BY c.lastActivity DESC
      LIMIT ? OFFSET ?;
    `;
    try {
      const stmt = this.db.prepare(query);
      const rows = stmt.all(userId, limit, offset) as any[];
    return rows.map(row => ({
      conversationId: row.conversationId,
      lastActivity: row.lastActivity,
      agentId: row.agentId,
      summary: row.summary,
      title: row.title,
      turnCount: row.turnCount,
      persona: row.persona ?? null,
    }));
    } catch (error) {
      console.error(`[SqliteMemoryAdapter] Error listing conversations for user ${userId}:`, error);
      throw error;
    }
  }

  public async setConversationPersona(
    userId: string,
    conversationId: string,
    agentId: string,
    persona: string | null,
    timestamp: number = Date.now(),
  ): Promise<void> {
    if (!this.isEnabled || !this.db) {
      return;
    }

    const effectiveTimestamp = Number.isFinite(timestamp) ? timestamp : Date.now();

    try {
      const upsertPersonaStmt = this.db.prepare(`
        INSERT INTO conversations (conversationId, userId, agentId, createdAt, lastActivity, persona)
        VALUES (@conversationId, @userId, @agentId, @createdAt, @lastActivity, @persona)
        ON CONFLICT(conversationId) DO UPDATE SET
          lastActivity = CASE
            WHEN excluded.lastActivity > COALESCE(conversations.lastActivity, 0) THEN excluded.lastActivity
            ELSE conversations.lastActivity
          END,
          agentId = CASE
            WHEN excluded.agentId IS NOT NULL AND (conversations.agentId IS NULL OR conversations.agentId != excluded.agentId) THEN excluded.agentId
            ELSE conversations.agentId
          END,
          persona = excluded.persona;
      `);

      upsertPersonaStmt.run({
        conversationId,
        userId,
        agentId,
        createdAt: effectiveTimestamp,
        lastActivity: effectiveTimestamp,
        persona,
      });
    } catch (error) {
      console.error(`[SqliteMemoryAdapter] Error setting persona for conversation ${conversationId}:`, error);
      throw error;
    }
  }

  public async getConversationPersona(userId: string, conversationId: string): Promise<string | null> {
    if (!this.isEnabled || !this.db) {
      return null;
    }

    try {
      const stmt = this.db.prepare('SELECT persona FROM conversations WHERE userId = ? AND conversationId = ? LIMIT 1;');
      const row = stmt.get(userId, conversationId) as { persona: string | null } | undefined;
      return row?.persona ?? null;
    } catch (error) {
      console.error(`[SqliteMemoryAdapter] Error retrieving persona for conversation ${conversationId}:`, error);
      throw error;
    }
  }

  public async pruneHistory(
    userId: string,
    criteria?: Record<string, any>
  ): Promise<{ prunedTurnsCount: number; remainingTurnsCount: number }> {
    if (!this.isEnabled || !this.db) {
      // console.log('[SqliteMemoryAdapter] Pruning history is skipped (SQLite disabled or DB not initialized).');
      return { prunedTurnsCount: 0, remainingTurnsCount: 0 };
    }
    // ... (rest of the method remains the same)
    console.warn(`[SqliteMemoryAdapter] pruneHistory for user ${userId} called with criteria ${JSON.stringify(criteria)}. Not fully implemented for criteria beyond olderThanTimestamp.`);
    
    let prunedTurnsCount = 0;
    if (criteria?.olderThanTimestamp) {
      try {
        const stmtDelTurns = this.db.prepare('DELETE FROM conversation_turns WHERE userId = ? AND timestamp < ?');
        const resultTurns = stmtDelTurns.run(userId, criteria.olderThanTimestamp);
        prunedTurnsCount = resultTurns.changes;
        console.log(`[SqliteMemoryAdapter] Pruned ${prunedTurnsCount} old turns for user ${userId}.`);
        
        const stmtDelConvos = this.db.prepare(`
          DELETE FROM conversations 
          WHERE userId = ? AND conversationId NOT IN (SELECT DISTINCT conversationId FROM conversation_turns WHERE userId = ?)
        `);
        const resultConvos = stmtDelConvos.run(userId, userId);
        console.log(`[SqliteMemoryAdapter] Pruned ${resultConvos.changes} orphaned conversations for user ${userId}.`);

      } catch (error) {
        console.error(`[SqliteMemoryAdapter] Error pruning history for user ${userId}:`, error);
      }
    }

    const remainingTurnsStmt = this.db.prepare('SELECT COUNT(*) as count FROM conversation_turns WHERE userId = ?');
    const remaining = remainingTurnsStmt.get(userId) as { count: number };
    
    return { prunedTurnsCount, remainingTurnsCount: remaining?.count || 0 };
  }

  public async disconnect(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
      console.log('[SqliteMemoryAdapter] SQLite database connection closed.');
    }
  }
}

export const sqliteMemoryAdapter = new SqliteMemoryAdapter();