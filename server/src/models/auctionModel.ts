// src/models/auctionModel.ts
import { DbClient } from '../db/dbClient';
import type {
  Auction,
  CreateAuctionArgs,
  UpdateAuctionInput,
} from '../types/auctionType';

import type { Server as SocketIOServer } from 'socket.io';
import { Bid } from '../types/bidType';

export interface AuctionModel {
    readonly getAuctionById: (id: number) => Promise<Auction | undefined>;
    readonly getAuctionByNftId: (id: number) => Promise<Auction | undefined>;
    readonly createAuction: (data: CreateAuctionArgs) => Promise<Auction>;
    readonly updateAuction: (id: number, data: any) => Promise<Auction>;
    readonly getHighestBid: (auctionId: number) => Promise<Bid | null>;
    readonly closeExpiredAuctions: (io: SocketIOServer) => Promise<void>;
}

export function createAuctionModel(db: DbClient): AuctionModel {
  async function getAuctionById(id: number) {
    return (
      (await db.auction.findUnique({
        where: { id },
        include: { nft: true },
      })) ?? undefined
    );
  }

  async function getAuctionByNftId(id: number) {
    return (
      (await db.auction.findUnique({
        where: { nftId: id },
      })) ?? undefined
    );
  }

  async function createAuction(data: CreateAuctionArgs) {
    return db.auction.create({
      data: {
        nftId: data.nftId,
        startPrice: data.startPrice,
        currentPrice: data.startPrice, // Set currentPrice to startPrice by default
        startTime: data.startTime,
        endTime: data.endTime,
        isActive: data.isActive ?? true,
      },
      include: { nft: true },
    });
  }

  async function updateAuction(id: number, data: UpdateAuctionInput) {
    return db.auction.update({
      where: { id },
      data: {
        id: data.id,
        currentPrice: data.currentPrice ?? undefined,
        endTime: data.endTime ?? undefined,
        isActive: data.isActive ?? undefined,
      },
      include: { nft: true },
    });
  }

    async function getHighestBid(auctionId: number) {
        const highest = await db.bid.findFirst({
            where: { auctionId },
            orderBy: { amount: 'desc' },
        });

        return highest ?? null;
    }

    async function closeExpiredAuctions(io: SocketIOServer) {
        const now = new Date();

        try {
            const expiredAuctions = await db.auction.findMany({
                where: {
                    isActive: true,
                    endTime: {
                        lte: now,
                    },
                },
                include: {
                    bids: true,
                    nft: true,
                },
            });

            if (expiredAuctions.length === 0) return;

            for (const auction of expiredAuctions) {
                console.log(auction);
                const highestBid = await getHighestBid(Number(auction.id));

                const winnerId = highestBid?.bidderId;
                const sellerId = auction.nft.creatorId;

                console.log(highestBid);
                console.log(winnerId);
                console.log(sellerId);

                await db.auction.update({
                    where: { id: auction.id },
                    data: {
                        isActive: false,
                    },
                });

                if (!winnerId || !sellerId) return;

                await db.user.update({
                    where: { id: winnerId },
                    data: {
                        walletBalance: { decrement: highestBid?.amount },
                    },
                });

                await db.user.update({
                    where: { id: sellerId },
                    data: {
                        walletBalance: { increment: highestBid?.amount },
                    },
                });

                await db.nFT.update({
                    where: { id: auction.nftId },
                    data: {
                        ownerId: winnerId,
                    },
                });

                console.log(
                    `Auction ${auction.id} closed. Winner: ${winnerId}. Final price: ${highestBid?.amount}`
                );
            }
        } catch (err) {
            console.error('Error in closeExpiredAuctions:', err);
        }
    }

    return Object.freeze({
        getAuctionById,
        getAuctionByNftId,
        createAuction,
        updateAuction,
        getHighestBid,
        closeExpiredAuctions,
    });
}
