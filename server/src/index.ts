import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { gqlSchema } from './graphql/gqlSchema';
import { createResolvers } from './resolvers/resolvers';
import { createUserModel } from './models/userModel';
import { createDbClient } from './db/dbClient';
import { createNFTModel } from './models/nftModel';
import { createAuctionModel } from './models/auctionModel';
import { createBidModel } from './models/bidModel';
import { Server as SocketIOServer } from 'socket.io';

dotenv.config();

const DEV_FALLBACK_PORT = 4000;
const SOCKET_DEV_FALLBACK_PORT = 4001;
const PORT = Number(process.env.PORT) || DEV_FALLBACK_PORT;
const SOCKET_PORT = Number(process.env.SOCKET_PORT) || SOCKET_DEV_FALLBACK_PORT;
const PG_DB_URL = `postgresql://postgres:${process.env.POSTGRES_PASSWORD}@db:5432/bidchain-db?schema=public`;
const CLIENT_ENDPOINT = process.env.CLIENT_ENDPOINT || 'http://localhost:5174';

const dbClient = createDbClient(PG_DB_URL);
const userModel = createUserModel(dbClient);
const nftModel = createNFTModel(dbClient);
const auctionModel = createAuctionModel(dbClient);
const bidModel = createBidModel(dbClient);

async function main() {
    const app: Application = express();
    const httpServer = http.createServer(app);

    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: [CLIENT_ENDPOINT],
            methods: ['GET', 'POST'],
      credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log('client connected:', socket.id);

        socket.on('joinAuction', (auctionId: number) => {
            socket.join(`auction:${auctionId}`);
            console.log(`socket ${socket.id} joined room auction:${auctionId}`);
        });

        socket.on('disconnect', () => {
            console.log('client disconnected:', socket.id);
        });
    });

    httpServer.listen(SOCKET_PORT, () => {
        console.log(
            `🔊 Socket.IO server ready at ws://localhost:${SOCKET_PORT}`
        );
    });

    setInterval(() => {
        auctionModel
            .closeExpiredAuctions(io)
            .catch((err) => console.error('Polling error:', err));
    }, 5_000);

    const server: ApolloServer = new ApolloServer({
        typeDefs: gqlSchema,
        resolvers: createResolvers({
            userModel,
            nftModel,
            auctionModel,
            bidModel,
            io,
        }),
    });

  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT },
  });

  console.log(`🚀 Server ready at ${url}`);
}

main();
