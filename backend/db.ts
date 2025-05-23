// backend/db.ts
import { PrismaClient } from '@prisma/client';

/**
 * Global Prisma Client instance.
 * @type {PrismaClient}
 */
const prisma = new PrismaClient();

/**
 * Initializes the Prisma client by connecting to the database.
 * This should be called once at application startup.
 * @returns {Promise<void>} A promise that resolves when the connection is established.
 */
export async function connectToDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('✅ Connected to the database.');
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error);
    process.exit(1); // Exit process if database connection fails
  }
}

/**
 * Disconnects the Prisma client from the database.
 * This should be called on application shutdown.
 * @returns {Promise<void>} A promise that resolves when the connection is closed.
 */
export async function disconnectFromDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    console.log('🔌 Disconnected from the database.');
  } catch (error) {
    console.error('❌ Error disconnecting from the database:', error);
  }
}

export default prisma;