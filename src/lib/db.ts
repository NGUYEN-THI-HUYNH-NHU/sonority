import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env";

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const TRANSIENT_PRISMA_ERROR_PATTERNS = [
  "Client network socket disconnected before secure TLS connection was established",
  "P1001",
  "P1017",
  "ECONNRESET",
  "ETIMEDOUT",
  "fetch failed",
];

function isTransientPrismaError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  return TRANSIENT_PRISMA_ERROR_PATTERNS.some((pattern) =>
    error.message.includes(pattern),
  );
}

async function reconnectPrisma() {
  try {
    await prisma.$disconnect();
  } catch {
    // Ignore disconnect errors and continue with a fresh connection attempt.
  }

  await prisma.$connect();
}

export async function withPrismaRetry<T>(
  operation: () => Promise<T>,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (!isTransientPrismaError(error)) {
      throw error;
    }

    await reconnectPrisma();
    return operation();
  }
}

export { prisma };
