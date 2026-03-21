/**
 * @file email-thread.service.ts
 * @description Reconstructs true parent->child email thread hierarchies from
 *              RFC 2822 headers (In-Reply-To, References). Gmail groups messages
 *              by subject similarity which creates false groupings. This service
 *              uses the actual reply chain headers to build a correct tree.
 */

import { Injectable, Inject } from '@nestjs/common';
import { DatabaseService } from '../../../../database/database.service.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ThreadHierarchy {
  threadId: string;
  accountId: string;
  subject: string;
  messageCount: number;
  participantCount: number;
  participants: Array<{ email: string; name: string | null }>;
  dateRange: { earliest: number; latest: number };
  rootMessages: ThreadNode[];
  flatTimeline: ThreadTimelineEntry[];
}

export interface ThreadNode {
  messageId: string;
  from: { email: string; name: string | null };
  subject: string;
  snippet: string;
  date: number;
  depth: number;
  attachmentCount: number;
  children: ThreadNode[];
}

export interface ThreadTimelineEntry {
  messageId: string;
  from: { email: string; name: string | null };
  date: number;
  action: 'sent' | 'replied' | 'forwarded';
  snippet: string;
}

// ---------------------------------------------------------------------------
// Internal row shape from wunderland_email_synced_messages
// ---------------------------------------------------------------------------

interface MessageRow {
  id: string;
  provider_message_id: string;
  account_id: string;
  thread_id: string;
  message_id_header: string | null;
  subject: string | null;
  from_address: string;
  from_name: string | null;
  snippet: string | null;
  internal_date: number;
  in_reply_to: string | null;
  references_header: string | null; // JSON array string
  parent_message_id: string | null;
  thread_depth: number | null;
  thread_position: number | null;
  has_attachments: number | null;
  attachment_count: number | null;
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

@Injectable()
export class EmailThreadService {
  constructor(@Inject(DatabaseService) private readonly db: DatabaseService) {}

  /**
   * Reconstructs the true RFC 2822 thread hierarchy for a given Gmail thread.
   *
   * Algorithm:
   * 1. Load all messages in thread ordered by internal_date ASC
   * 2. Build lookup: message_id_header -> message row
   * 3. For each message resolve parent via In-Reply-To or References fallback
   * 4. Guard against cycles via ancestor-set tracking
   * 5. Compute thread_position (chronological index)
   * 6. Persist parent_message_id, thread_depth, thread_position
   * 7. Return ThreadHierarchy
   */
  async reconstructThread(accountId: string, threadId: string): Promise<ThreadHierarchy> {
    // 1. Load all messages
    const messages = await this.db.all<MessageRow>(
      `SELECT * FROM wunderland_email_synced_messages
       WHERE account_id = ? AND thread_id = ?
       ORDER BY internal_date ASC`,
      [accountId, threadId]
    );

    if (messages.length === 0) {
      return this.emptyHierarchy(accountId, threadId);
    }

    // 2. Build lookup: message_id_header -> message row
    const headerLookup = new Map<string, MessageRow>();
    for (const msg of messages) {
      if (msg.message_id_header) {
        headerLookup.set(msg.message_id_header, msg);
      }
    }

    // 3. Resolve parents for each message
    const parentMap = new Map<string, string | null>(); // msg.id -> parent msg.id
    const depthMap = new Map<string, number>(); // msg.id -> depth

    for (const msg of messages) {
      const parentId = this.resolveParent(msg, headerLookup);
      parentMap.set(msg.id, parentId);
    }

    // 4. Compute depths with cycle detection
    for (const msg of messages) {
      this.computeDepth(msg.id, parentMap, depthMap, messages);
    }

    // 5. Compute thread_position (chronological index)
    const positionMap = new Map<string, number>();
    for (let i = 0; i < messages.length; i++) {
      positionMap.set(messages[i].id, i);
    }

    // 6. Persist to DB
    for (const msg of messages) {
      const parentId = parentMap.get(msg.id) ?? null;
      const depth = depthMap.get(msg.id) ?? 0;
      const position = positionMap.get(msg.id) ?? 0;

      await this.db.run(
        `UPDATE wunderland_email_synced_messages
         SET parent_message_id = ?, thread_depth = ?, thread_position = ?
         WHERE id = ?`,
        [parentId, depth, position, msg.id]
      );
    }

    // 7. Build and return ThreadHierarchy
    return this.buildHierarchy(accountId, threadId, messages, parentMap, depthMap, positionMap);
  }

  // -------------------------------------------------------------------------
  // Parent resolution
  // -------------------------------------------------------------------------

  private resolveParent(msg: MessageRow, headerLookup: Map<string, MessageRow>): string | null {
    // a. Try In-Reply-To first
    if (msg.in_reply_to) {
      const parent = headerLookup.get(msg.in_reply_to);
      if (parent) return parent.id;
    }

    // b. References fallback: walk from END to START
    if (msg.references_header) {
      let refs: string[];
      try {
        refs = JSON.parse(msg.references_header);
      } catch {
        refs = [];
      }

      if (Array.isArray(refs)) {
        for (let i = refs.length - 1; i >= 0; i--) {
          const parent = headerLookup.get(refs[i]);
          if (parent && parent.id !== msg.id) {
            return parent.id;
          }
        }
      }
    }

    // c. No parent found — this is a root
    return null;
  }

  // -------------------------------------------------------------------------
  // Depth computation with cycle guard
  // -------------------------------------------------------------------------

  private computeDepth(
    msgId: string,
    parentMap: Map<string, string | null>,
    depthMap: Map<string, number>,
    messages: MessageRow[]
  ): number {
    if (depthMap.has(msgId)) return depthMap.get(msgId)!;

    // Track ancestors to detect cycles
    const visited = new Set<string>();
    let current: string | null = msgId;
    const chain: string[] = [];

    while (current !== null) {
      if (visited.has(current)) {
        // Cycle detected — break the cycle by making this node a root
        parentMap.set(current, null);
        break;
      }
      visited.add(current);
      chain.push(current);
      current = parentMap.get(current) ?? null;
    }

    // Now compute depths bottom-up from the chain
    // The last item in the chain is either a root or where cycle was broken
    for (let i = chain.length - 1; i >= 0; i--) {
      const id = chain[i];
      const parentId = parentMap.get(id) ?? null;
      if (parentId === null || !depthMap.has(parentId)) {
        if (parentId === null) {
          depthMap.set(id, 0);
        } else {
          // Parent not yet computed — shouldn't happen in chain but guard
          depthMap.set(id, 0);
        }
      } else {
        depthMap.set(id, depthMap.get(parentId)! + 1);
      }
    }

    return depthMap.get(msgId) ?? 0;
  }

  // -------------------------------------------------------------------------
  // Build ThreadHierarchy from computed maps
  // -------------------------------------------------------------------------

  private buildHierarchy(
    accountId: string,
    threadId: string,
    messages: MessageRow[],
    parentMap: Map<string, string | null>,
    depthMap: Map<string, number>,
    positionMap: Map<string, number>
  ): ThreadHierarchy {
    // Collect participants (deduplicated by email)
    const participantMap = new Map<string, { email: string; name: string | null }>();
    for (const msg of messages) {
      const email = msg.from_address.toLowerCase();
      if (!participantMap.has(email)) {
        participantMap.set(email, { email: msg.from_address, name: msg.from_name });
      }
    }
    const participants = Array.from(participantMap.values());

    // Date range
    const dates = messages.map((m) => m.internal_date);
    const earliest = Math.min(...dates);
    const latest = Math.max(...dates);

    // Build tree nodes
    const nodeMap = new Map<string, ThreadNode>();
    for (const msg of messages) {
      nodeMap.set(msg.id, {
        messageId: msg.id,
        from: { email: msg.from_address, name: msg.from_name },
        subject: msg.subject ?? '',
        snippet: msg.snippet ?? '',
        date: msg.internal_date,
        depth: depthMap.get(msg.id) ?? 0,
        attachmentCount: msg.attachment_count ?? 0,
        children: [],
      });
    }

    // Wire children
    const rootMessages: ThreadNode[] = [];
    for (const msg of messages) {
      const parentId = parentMap.get(msg.id) ?? null;
      const node = nodeMap.get(msg.id)!;
      if (parentId && nodeMap.has(parentId)) {
        nodeMap.get(parentId)!.children.push(node);
      } else {
        rootMessages.push(node);
      }
    }

    // Build flat timeline sorted by date
    const flatTimeline: ThreadTimelineEntry[] = messages.map((msg) => ({
      messageId: msg.id,
      from: { email: msg.from_address, name: msg.from_name },
      date: msg.internal_date,
      action: this.inferAction(msg, parentMap),
      snippet: msg.snippet ?? '',
    }));

    // Subject from first message
    const subject = messages[0]?.subject ?? '';

    return {
      threadId,
      accountId,
      subject,
      messageCount: messages.length,
      participantCount: participants.length,
      participants,
      dateRange: { earliest, latest },
      rootMessages,
      flatTimeline,
    };
  }

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------

  private inferAction(
    msg: MessageRow,
    parentMap: Map<string, string | null>
  ): 'sent' | 'replied' | 'forwarded' {
    const subj = (msg.subject ?? '').toLowerCase();
    if (subj.startsWith('fwd:') || subj.startsWith('fw:')) {
      return 'forwarded';
    }
    if (parentMap.get(msg.id) !== null) {
      return 'replied';
    }
    return 'sent';
  }

  private emptyHierarchy(accountId: string, threadId: string): ThreadHierarchy {
    return {
      threadId,
      accountId,
      subject: '',
      messageCount: 0,
      participantCount: 0,
      participants: [],
      dateRange: { earliest: 0, latest: 0 },
      rootMessages: [],
      flatTimeline: [],
    };
  }
}
