// src/resolvers/bidResolvers.ts
import { GraphQLError } from 'graphql';
import type { BidModel } from '../models/bidModel';
import type { AuctionModel } from '../models/auctionModel';
import { HTTP_CODES } from '../httpCodes';
import type { Server as SocketIOServer } from 'socket.io';
import type { PlaceBidArgs, Bid } from '../types/bidType';
import { UserModel } from '../models/userModel';

export function createBidResolver({
  bidModel,
  userModel,
  auctionModel,
  io,
}: {
  bidModel: BidModel;
  userModel: UserModel;
  auctionModel: AuctionModel;
  io: SocketIOServer;
}) {
  async function placeBid(
    _parent: unknown,
    { data }: { data: PlaceBidArgs }
  ): Promise<Bid> {
    const { amount, auctionId, bidderId } = data;

    if (!amount || !auctionId || !bidderId) {
      throw new GraphQLError('Missing bid fields.', {
        extensions: { code: HTTP_CODES.BAD_REQUEST },
      });
    }

    try {
      const auction = await auctionModel.getAuctionById(auctionId);

      if (!auction || !auction.isActive) {
        throw new GraphQLError('Auction not found or not active.', {
          extensions: { code: HTTP_CODES.BAD_REQUEST },
        });
      }

      const user = await userModel.getUserById(bidderId);

      if (!user) {
        throw new GraphQLError(
          'User not found while attempting to place bid.',
          { extensions: { code: HTTP_CODES.NOT_FOUND } }
        );
      }

      if (user.walletBalance - user.bidsTotal < amount) {
        throw new GraphQLError('Insufficient wallet balance.', {
          extensions: { code: HTTP_CODES.BAD_REQUEST },
        });
      }

      const highestBid = await auctionModel.getHighestBid(auctionId);
      const minBidAmount = highestBid ? highestBid.amount : auction.startPrice;

      if (amount <= minBidAmount) {
        throw new GraphQLError(
          `Bid amount must be higher than ${minBidAmount} ETH`,
          {
            extensions: { code: HTTP_CODES.BAD_REQUEST },
          }
        );
      }

      const createdBid = await bidModel.placeBid(data);

      await auctionModel.updateAuction(auctionId, {
        id: auctionId,
        currentPrice: amount,
      });

      io.to(`auction:${auctionId}`).emit('bid:placed', {
        auctionId,
        bid: createdBid,
      });

      return createdBid;
    } catch (error: any) {
      throw new GraphQLError(
        `Failed to create bid. ${error.message || error}`,
        {
          extensions: { code: HTTP_CODES.SERVER_ERROR },
        }
      );
    }
  }

  return {
    placeBid,
  };
}
