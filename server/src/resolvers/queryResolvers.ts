import type { User } from '../types/userTypes';
import type { UserModel } from '../models/userModel';
import type { AuctionModel } from '../models/auctionModel';
import type { NFTModel } from '../models/nftModel';
import type { Auction } from '../types/auctionType';
import type { Bid } from '../types/bidType';
import type { BidModel } from '../models/bidModel';
import { HTTP_CODES } from '../httpCodes';
import { GraphQLError } from 'graphql';
import type { NFT } from '../types/nftType';

export function createQueryResolvers({
  userModel,
  auctionModel,
  bidModel,
  nftModel,
}: {
  userModel: UserModel;
  auctionModel: AuctionModel;
  bidModel: BidModel;
  nftModel: NFTModel;
}) {
  async function user(
    _parent: unknown,
    { id }: { id: number }
  ): Promise<User> {
    const userData = await userModel.getUserById(id);

    if (!userData) {
      throw new GraphQLError('User not found.', {
        extensions: { code: HTTP_CODES.NOT_FOUND },
      });
    }

    return userData;
  }

  async function nfts(): Promise<NFT[]> {
    try {
      const nftList = await nftModel.getNFTs();
      return nftList ?? [];
    } catch (error: any) {
      console.error(error);
      throw new GraphQLError(`Failed to fetch NFTs. ${error}`, {
        extensions: { code: HTTP_CODES.SERVER_ERROR },
      });
    }
  }

  async function nft(_parent: unknown, { id }: { id: number }): Promise<NFT> {
    try {
      const nftData = await nftModel.getNFTById(id);
      if (!nftData) {
        throw new GraphQLError('NFT not found.', {
          extensions: { code: HTTP_CODES.NOT_FOUND },
        });
      }
      return nftData;
    } catch (error: any) {
      console.error(error);
      throw new GraphQLError(`Failed to fetch NFT by id. ${error}`, {
        extensions: { code: HTTP_CODES.SERVER_ERROR },
      });
    }
  }

  async function nftsByCreatorId(
    _parent: unknown,
    { id }: { id: number }
  ): Promise<NFT[]> {
    try {
      const nftList = await nftModel.getNFTByCreatorId(id);
      if (!nftList) {
        return [];
      }
      return nftList;
    } catch (error: any) {
      console.error(error);
      throw new GraphQLError(`Failed to fetch NFTs by creator id. ${error}`, {
        extensions: { code: HTTP_CODES.SERVER_ERROR },
      });
    }
  }

  async function ownedNfts(
    _parent: unknown,
    { userId }: { userId: number }
  ): Promise<NFT[]> {
    try {
      const nfts = await userModel.getOwnedNFTs(userId);
      return nfts;
    } catch (error: any) {
      console.error(error);
      throw new GraphQLError(`Failed to fetch owned NFTs. ${error}`, {
        extensions: { code: HTTP_CODES.SERVER_ERROR },
      });
    }
  }

  async function bidNfts(
    _parent: unknown,
    { userId }: { userId: number }
  ): Promise<NFT[]> {
    try {
      const nfts = await userModel.getBidNfts(userId);
      return nfts;
    } catch (error: any) {
      console.error(error);
      throw new GraphQLError(
        `Failed to fetch NFTs user has bid on. ${error}`,
        {
          extensions: { code: HTTP_CODES.SERVER_ERROR },
        }
      );
    }
  }

  async function createdNfts(
    _parent: unknown,
    { creatorId }: { creatorId: number }
  ): Promise<NFT[]> {
    try {
      const nfts = await userModel.getCreatedNFTs(creatorId);
      return nfts;
    } catch (error: any) {
      console.error(error);
      throw new GraphQLError(`Failed to fetch created NFTs. ${error}`, {
        extensions: { code: HTTP_CODES.SERVER_ERROR },
      });
    }
  }

  async function auction(
    _parent: unknown,
    { id }: { id: number }
  ): Promise<Auction> {
    try {
      const auctionSearch = await auctionModel.getAuctionById(id);
      if (!auctionSearch) {
        throw new GraphQLError('Auction not found.', {
          extensions: { code: HTTP_CODES.NOT_FOUND },
        });
      }
      return auctionSearch;
    } catch (error: any) {
      console.error(error);
      throw new GraphQLError(`Failed to fetch auction by id. ${error}`, {
        extensions: { code: HTTP_CODES.SERVER_ERROR },
      });
    }
  }

  async function auctionByNftId(
    _parent: unknown,
    { nftId }: { nftId: number }
  ): Promise<Auction> {
    try {
      const auctionSearch = await auctionModel.getAuctionByNftId(nftId);
      if (!auctionSearch) {
        throw new GraphQLError('Auction not found.', {
          extensions: { code: HTTP_CODES.NOT_FOUND },
        });
      }
      return auctionSearch;
    } catch (error: any) {
      console.error(error);
      throw new GraphQLError(`Failed to fetch auction by NFT id. ${error}`, {
        extensions: { code: HTTP_CODES.SERVER_ERROR },
      });
    }
  }

  async function bid(_parent: unknown, { id }: { id: number }): Promise<Bid> {
    try {
      const bidSearch = await bidModel.getBidById(id);

      if (!bidSearch) {
        throw new GraphQLError('Bid not found.', {
          extensions: { code: HTTP_CODES.NOT_FOUND },
        });
      }

      return bidSearch;
    } catch (error: any) {
      console.error(error);
      throw new GraphQLError(`Failed to fetch bid by id. ${error}`, {
        extensions: { code: HTTP_CODES.SERVER_ERROR },
      });
    }
  }

  return {
    user,
    nft,
    nfts,
    nftsByCreatorId,
    ownedNfts,     
    bidNfts,        
    createdNfts,    
    auction,
    auctionByNftId,
    bid,
  };
}
