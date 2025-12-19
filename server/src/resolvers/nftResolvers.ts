import { GraphQLError } from 'graphql';
import { NFTModel } from '../models/nftModel';
import { HTTP_CODES } from '../httpCodes';
import { CreateNFTArgs, NFT } from '../types/nftType';
import { Categories } from '@prisma/client';

type GetNFTByCategoriesArgs = {
  data?: Categories[] | null;
};

export function createNFTResolver({ nftModel }: { nftModel: NFTModel }) {
  async function createNFT(
    _parent: unknown,
    { data }: { data: CreateNFTArgs }
  ): Promise<NFT> {
    const { title, imageUrl, creatorId, tags } = data;

    if (!title || !imageUrl || !creatorId || !tags || tags.length === 0) {
      throw new GraphQLError('Missing required NFT fields.', {
        extensions: { code: HTTP_CODES.BAD_REQUEST },
      });
    }

    try {
      const created = await nftModel.createNFT(data);
      return created;
    } catch (e: any) {
      console.error(e);
      throw new GraphQLError(`Failed to create NFT. ${e}`, {
        extensions: { code: HTTP_CODES.SERVER_ERROR },
      });
    }
  }

  async function getNFTByCategories(
    _parent: unknown,
    { data }: GetNFTByCategoriesArgs
  ): Promise<NFT[]> {
    if (!data || data.length === 0) {
      throw new GraphQLError('At least one category must be provided.', {
        extensions: { code: HTTP_CODES.BAD_REQUEST },
      });
    }

    try {
      const nfts = await nftModel.getNFTCategories(data);
      return nfts;
    } catch (e) {
      throw new GraphQLError('Failed to fetch NFTs by categories.', {
        extensions: { code: HTTP_CODES.SERVER_ERROR },
      });
    }
  }

  return {
    createNFT,
    getNFTByCategories,
  };
}
