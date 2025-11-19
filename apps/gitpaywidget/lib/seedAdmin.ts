import { createServerClient } from './supabaseServer';

/**
 * Seeds the admin user (team@manic.agency) on first boot if enabled via env.
 *
 * Call this from app initialization or a dedicated seed script.
 * Safe to run multiple times (idempotent).
 */
export async function seedAdminUser() {
  if (process.env.ADMIN_SEED_ON_BOOT !== 'true') {
    console.log('[seed] ADMIN_SEED_ON_BOOT not enabled, skipping');
    return;
  }

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn('[seed] ADMIN_EMAIL or ADMIN_PASSWORD missing, cannot seed admin');
    return;
  }

  const supabase = createServerClient();

  // Check if admin already exists
  const { data: existingUser } = await supabase.auth.admin.listUsers();
  const exists = existingUser?.users.some(u => u.email === email);

  if (exists) {
    console.log(`[seed] Admin user ${email} already exists, skipping`);
    return;
  }

  // Create admin user
  const { data: newUser, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirm so they can login immediately
  });

  if (error) {
    console.error('[seed] Failed to create admin user:', error.message);
    return;
  }

  console.log(`✅ [seed] Created admin user: ${email} (id: ${newUser.user?.id})`);

  // Create a default demo project for the admin
  const { error: projectError } = await supabase.from('projects').insert({
    slug: 'manic/demo',
    name: 'Demo Project',
    owner_id: newUser.user?.id,
  });

  if (!projectError) {
    console.log('✅ [seed] Created demo project: manic/demo');
  }
}
