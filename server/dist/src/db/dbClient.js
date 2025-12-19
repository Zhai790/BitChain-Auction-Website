import { PrismaClient } from '@prisma/client';
export function createDbClient(dbUrl) {
    return new PrismaClient({
        datasources: {
            db: { url: dbUrl },
        },
    });
}
