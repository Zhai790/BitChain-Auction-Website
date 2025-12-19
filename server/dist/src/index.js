import express from 'express';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { gqlSchema } from './graphql/gqlSchema';
import { createResolvers } from './resolvers/resolvers';
import { createUserModel } from './models/UserModel';
import { PrismaClient } from '@prisma/client';
dotenv.config();
const DEV_FALLBACK_PORT = 4000;
const PORT = Number(process.env.PORT) || DEV_FALLBACK_PORT;
const app = express();
const dbClient = new PrismaClient();
const userModel = createUserModel(dbClient);
const server = new ApolloServer({
    typeDefs: gqlSchema,
    resolvers: createResolvers({ userModel }),
});
const { url } = await startStandaloneServer(server, {
    listen: { port: PORT },
});
console.log(`🚀 Server ready at ${url}`);
// Enable CORS
// app.use(cors());
// app.get('/', (_req: Request, res: Response) => {
//     res.redirect('/health');
// });
// app.listen(PORT, () => {
//     console.log(`💰 Server is running on http://localhost:${PORT}`);
// });
