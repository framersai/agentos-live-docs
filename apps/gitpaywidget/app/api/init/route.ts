import { NextResponse } from 'next/server';
import { seedAdminUser } from '@/lib/seedAdmin';

/**
 * Initialization endpoint - seeds admin user on first deployment.
 *
 * Hit this once after deploying: GET /api/init
 * Safe to call multiple times (idempotent).
 */
export async function GET() {
  try {
    await seedAdminUser();
    return NextResponse.json({ success: true, message: 'Admin user seeded (if needed)' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
