import type { UserModel } from '../models/userModel';
import { createUserResolver } from './userResolvers';
import { createQueryResolvers } from './queryResolvers';
import { createNFTResolver } from './nftResolvers';
import { createAuctionResolver } from './auctionResolver';
import { createBidResolver } from './bidResolver';
import { NFTModel } from '../models/nftModel';
import { AuctionModel } from '../models/auctionModel';
import { BidModel } from '../models/bidModel';
import type { Server as SocketIOServer } from 'socket.io';

type Models = {
    userModel: UserModel;
    nftModel: NFTModel;
    auctionModel: AuctionModel;
    bidModel: BidModel;
    io: SocketIOServer;
};

export function createResolvers(models: Models) {
    return {
        Query: createQueryResolvers(models),
        Mutation: {
            ...createUserResolver(models),
            ...createNFTResolver(models),
            ...createAuctionResolver(models),
            ...createBidResolver(models),
        },
    };
}
