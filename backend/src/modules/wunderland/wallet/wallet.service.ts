/**
 * @file wallet.service.ts
 * @description Business logic for agent wallet and card management.
 * Reads from agent_wallets, wallet_transactions, agent_cards, card_transactions,
 * and spending_ledger tables.
 */

import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service.js';
import type {
  IssueCardDto,
  UpdateSpendingPolicyDto,
  ListWalletTransactionsQueryDto,
} from '../dto/wallet.dto.js';

// ── Response types ──

export interface WalletCryptoEntry {
  chain: string;
  address: string;
  balanceUsd: number;
  balanceNative: number;
}

export interface WalletCardInfo {
  last4: string;
  state: string;
  spendLimitUsd: number;
  network: string;
  cardType: string;
  memo: string | null;
  createdAt: number;
}

export interface SpendingPolicy {
  dailyLimitUsd: number;
  perTransactionLimitUsd: number;
  monthlyLimitUsd: number;
  blockedCategories: string[];
}

export interface WalletState {
  crypto: WalletCryptoEntry[];
  card: WalletCardInfo | null;
  policy: SpendingPolicy;
}

export interface WalletTransaction {
  id: string;
  type: 'crypto' | 'card';
  amountUsd: number;
  category: string;
  description: string;
  status: string;
  createdAt: number;
}

export interface CardSpending {
  totalUsd: number;
  byCategory: Record<string, number>;
  period: string;
}

// Default spending policy (matches SpendingPolicyEnforcer defaults)
const DEFAULT_POLICY: SpendingPolicy = {
  dailyLimitUsd: 100,
  perTransactionLimitUsd: 20,
  monthlyLimitUsd: 500,
  blockedCategories: ['gambling'],
};

@Injectable()
export class WalletService {
  constructor(@Inject(DatabaseService) private readonly db: DatabaseService) {}

  // ── Ownership verification ──

  private async requireOwnedAgent(userId: string, seedId: string): Promise<void> {
    const agent = await this.db.get<{ seed_id: string }>(
      `SELECT seed_id FROM wunderbots WHERE seed_id = ? AND owner_user_id = ? AND status != 'archived'`,
      [seedId, userId]
    );
    if (!agent) {
      throw new NotFoundException(`Agent ${seedId} not found or not owned by user.`);
    }
  }

  // ── Wallet state ──

  async getWalletState(userId: string, seedId: string): Promise<WalletState> {
    await this.requireOwnedAgent(userId, seedId);

    // Crypto wallets
    const walletRows = await this.db.all<any>(
      `SELECT chain, address, balance_native, balance_usd FROM agent_wallets WHERE agent_id = ?`,
      [seedId]
    );
    const crypto: WalletCryptoEntry[] = walletRows.map((r: any) => ({
      chain: String(r.chain),
      address: String(r.address),
      balanceUsd: Number(r.balance_usd ?? 0),
      balanceNative: Number(r.balance_native ?? 0),
    }));

    // Card
    const cardRow = await this.db.get<any>(
      `SELECT last4, state, spend_limit_usd, network, card_type, memo, created_at FROM agent_cards WHERE agent_id = ?`,
      [seedId]
    );
    const card: WalletCardInfo | null = cardRow
      ? {
          last4: String(cardRow.last4),
          state: String(cardRow.state),
          spendLimitUsd: Number(cardRow.spend_limit_usd ?? 0),
          network: String(cardRow.network ?? 'VISA'),
          cardType: String(cardRow.card_type ?? 'VIRTUAL'),
          memo: cardRow.memo ? String(cardRow.memo) : null,
          createdAt: Number(cardRow.created_at),
        }
      : null;

    // Policy — stored in spending_policy table or default
    const policy = await this.getPolicy(userId, seedId);

    return { crypto, card, policy };
  }

  // ── Transactions ──

  async getTransactions(
    userId: string,
    seedId: string,
    query: ListWalletTransactionsQueryDto = {}
  ): Promise<{ items: WalletTransaction[]; total: number }> {
    await this.requireOwnedAgent(userId, seedId);

    const limit = query.limit ?? 20;
    const offset = query.offset ?? 0;
    const results: WalletTransaction[] = [];

    if (!query.type || query.type === 'crypto') {
      const cryptoRows = await this.db.all<any>(
        `SELECT wt.id, wt.direction, wt.amount_raw, wt.status, wt.description, wt.created_at
         FROM wallet_transactions wt
         INNER JOIN agent_wallets aw ON wt.wallet_id = aw.id
         WHERE aw.agent_id = ?
         ORDER BY wt.created_at DESC`,
        [seedId]
      );
      for (const r of cryptoRows) {
        results.push({
          id: String(r.id),
          type: 'crypto',
          amountUsd: Number(r.amount_raw ?? 0),
          category: 'transfers',
          description: r.description ? String(r.description) : `${r.direction} crypto`,
          status: String(r.status ?? 'confirmed'),
          createdAt: Number(r.created_at),
        });
      }
    }

    if (!query.type || query.type === 'card') {
      const cardRows = await this.db.all<any>(
        `SELECT ct.id, ct.merchant_name, ct.category, ct.amount_usd, ct.status, ct.created_at
         FROM card_transactions ct
         INNER JOIN agent_cards ac ON ct.card_id = ac.id
         WHERE ac.agent_id = ?
         ORDER BY ct.created_at DESC`,
        [seedId]
      );
      for (const r of cardRows) {
        results.push({
          id: String(r.id),
          type: 'card',
          amountUsd: Number(r.amount_usd ?? 0),
          category: String(r.category ?? 'other'),
          description: r.merchant_name ? String(r.merchant_name) : 'Card transaction',
          status: String(r.status ?? 'PENDING'),
          createdAt: Number(r.created_at),
        });
      }
    }

    // Sort by createdAt descending, apply pagination
    results.sort((a, b) => b.createdAt - a.createdAt);
    const total = results.length;
    const paged = results.slice(offset, offset + limit);

    return { items: paged, total };
  }

  // ── Card operations ──

  async issueCard(userId: string, seedId: string, dto: IssueCardDto = {}): Promise<WalletCardInfo> {
    await this.requireOwnedAgent(userId, seedId);

    // Check if card already exists
    const existing = await this.db.get<any>(`SELECT id FROM agent_cards WHERE agent_id = ?`, [
      seedId,
    ]);
    if (existing) {
      throw new BadRequestException('Agent already has a virtual card.');
    }

    const id = this.db.generateId();
    const spendLimit = dto.spendLimitUsd ?? 500;
    const now = Math.floor(Date.now() / 1000);

    // Create a placeholder card record (actual Lithic creation happens via the extension pack tool)
    await this.db.run(
      `INSERT INTO agent_cards (id, agent_id, lithic_card_token, last4, card_type, state, spend_limit_usd, spend_limit_duration, network, memo, created_at)
       VALUES (?, ?, ?, ?, 'VIRTUAL', 'OPEN', ?, 'MONTHLY', 'VISA', ?, ?)`,
      [id, seedId, `pending-${id}`, '0000', spendLimit, dto.memo ?? null, now]
    );

    return {
      last4: '0000',
      state: 'OPEN',
      spendLimitUsd: spendLimit,
      network: 'VISA',
      cardType: 'VIRTUAL',
      memo: dto.memo ?? null,
      createdAt: now,
    };
  }

  async freezeCard(userId: string, seedId: string): Promise<{ state: string }> {
    await this.requireOwnedAgent(userId, seedId);
    const card = await this.db.get<any>(`SELECT id, state FROM agent_cards WHERE agent_id = ?`, [
      seedId,
    ]);
    if (!card) throw new NotFoundException('No card found for this agent.');
    if (card.state === 'CLOSED') throw new BadRequestException('Cannot freeze a closed card.');

    await this.db.run(`UPDATE agent_cards SET state = 'PAUSED' WHERE id = ?`, [card.id]);
    return { state: 'PAUSED' };
  }

  async unfreezeCard(userId: string, seedId: string): Promise<{ state: string }> {
    await this.requireOwnedAgent(userId, seedId);
    const card = await this.db.get<any>(`SELECT id, state FROM agent_cards WHERE agent_id = ?`, [
      seedId,
    ]);
    if (!card) throw new NotFoundException('No card found for this agent.');
    if (card.state !== 'PAUSED') throw new BadRequestException('Card is not frozen.');

    await this.db.run(`UPDATE agent_cards SET state = 'OPEN' WHERE id = ?`, [card.id]);
    return { state: 'OPEN' };
  }

  async closeCard(userId: string, seedId: string): Promise<{ state: string }> {
    await this.requireOwnedAgent(userId, seedId);
    const card = await this.db.get<any>(`SELECT id FROM agent_cards WHERE agent_id = ?`, [seedId]);
    if (!card) throw new NotFoundException('No card found for this agent.');

    await this.db.run(`UPDATE agent_cards SET state = 'CLOSED' WHERE id = ?`, [card.id]);
    return { state: 'CLOSED' };
  }

  // ── Card spending ──

  async getCardSpending(userId: string, seedId: string): Promise<CardSpending> {
    await this.requireOwnedAgent(userId, seedId);

    const card = await this.db.get<any>(`SELECT id FROM agent_cards WHERE agent_id = ?`, [seedId]);
    if (!card) {
      return { totalUsd: 0, byCategory: {}, period: 'month' };
    }

    // Get current month's start timestamp
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthStartEpoch = Math.floor(monthStart.getTime() / 1000);

    const rows = await this.db.all<any>(
      `SELECT category, SUM(amount_usd) as total
       FROM card_transactions
       WHERE card_id = ? AND created_at >= ? AND status IN ('PENDING', 'SETTLED')
       GROUP BY category`,
      [card.id, monthStartEpoch]
    );

    const byCategory: Record<string, number> = {};
    let totalUsd = 0;
    for (const r of rows) {
      const cat = String(r.category ?? 'other');
      const amount = Number(r.total ?? 0);
      byCategory[cat] = amount;
      totalUsd += amount;
    }

    return { totalUsd, byCategory, period: 'month' };
  }

  // ── Spending policy ──

  async getPolicy(userId: string, seedId: string): Promise<SpendingPolicy> {
    await this.requireOwnedAgent(userId, seedId);

    const row = await this.db.get<any>(
      `SELECT daily_limit_usd, per_transaction_limit_usd, monthly_limit_usd, blocked_categories
       FROM spending_policies WHERE agent_id = ?`,
      [seedId]
    );

    if (!row) return { ...DEFAULT_POLICY };

    return {
      dailyLimitUsd: Number(row.daily_limit_usd ?? DEFAULT_POLICY.dailyLimitUsd),
      perTransactionLimitUsd: Number(
        row.per_transaction_limit_usd ?? DEFAULT_POLICY.perTransactionLimitUsd
      ),
      monthlyLimitUsd: Number(row.monthly_limit_usd ?? DEFAULT_POLICY.monthlyLimitUsd),
      blockedCategories: row.blocked_categories
        ? JSON.parse(String(row.blocked_categories))
        : [...DEFAULT_POLICY.blockedCategories],
    };
  }

  async updatePolicy(
    userId: string,
    seedId: string,
    dto: UpdateSpendingPolicyDto
  ): Promise<SpendingPolicy> {
    await this.requireOwnedAgent(userId, seedId);

    const current = await this.getPolicy(userId, seedId);
    const updated: SpendingPolicy = {
      dailyLimitUsd: dto.dailyLimitUsd ?? current.dailyLimitUsd,
      perTransactionLimitUsd: dto.perTransactionLimitUsd ?? current.perTransactionLimitUsd,
      monthlyLimitUsd: dto.monthlyLimitUsd ?? current.monthlyLimitUsd,
      blockedCategories: dto.blockedCategories ?? current.blockedCategories,
    };

    // Upsert into spending_policies
    const existing = await this.db.get<any>(
      `SELECT agent_id FROM spending_policies WHERE agent_id = ?`,
      [seedId]
    );

    if (existing) {
      await this.db.run(
        `UPDATE spending_policies
         SET daily_limit_usd = ?, per_transaction_limit_usd = ?, monthly_limit_usd = ?, blocked_categories = ?
         WHERE agent_id = ?`,
        [
          updated.dailyLimitUsd,
          updated.perTransactionLimitUsd,
          updated.monthlyLimitUsd,
          JSON.stringify(updated.blockedCategories),
          seedId,
        ]
      );
    } else {
      const id = this.db.generateId();
      await this.db.run(
        `INSERT INTO spending_policies (id, agent_id, daily_limit_usd, per_transaction_limit_usd, monthly_limit_usd, blocked_categories)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          id,
          seedId,
          updated.dailyLimitUsd,
          updated.perTransactionLimitUsd,
          updated.monthlyLimitUsd,
          JSON.stringify(updated.blockedCategories),
        ]
      );
    }

    return updated;
  }
}
