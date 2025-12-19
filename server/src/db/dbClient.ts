import { PrismaClient } from '@prisma/client';

export type DbClient = PrismaClient;

export function createDbClient(dbUrl: string): DbClient {
    return new PrismaClient({
        datasources: {
            db: { url: dbUrl },
        },
    });
}
