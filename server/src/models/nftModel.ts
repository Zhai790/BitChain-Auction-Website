import { CreateNFTArgs, NFT } from '../types/nftType';
import { DbClient } from '../db/dbClient';
import { Categories } from '@prisma/client';

export interface NFTModel {
  readonly getNFTById: (id: number) => Promise<NFT | undefined>;
  readonly getNFTByCreatorId: (id: number) => Promise<NFT[] | undefined>;
  readonly getNFTs: () => Promise<NFT[]>;
  readonly createNFT: (data: CreateNFTArgs) => Promise<NFT>;
  readonly getNFTCategories: (tags: Categories[]) => Promise<NFT[]>;
}

export function createNFTModel(db: DbClient): NFTModel {
  async function getNFTById(id: number) {
    return (
      (await db.nFT.findUnique({
        where: { id },
        include: { creator: true },
      })) ?? undefined
    );
  }

  async function getNFTByCreatorId(id: number) {
    return (
      (await db.nFT.findMany({
        where: { creatorId: id },
        include: {
          creator: true,
          auction: true, // Include auction for pricing
        },
      })) ?? undefined
    );
  }

  async function createNFT(data: CreateNFTArgs) {
    return await db.nFT.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        creatorId: data.creatorId,
        tags: data.tags,
      },
      include: {
        creator: true, // Include the creator relation
      },
    });
  }

  async function getNFTCategories(tags: Categories[]): Promise<NFT[]> {
    return db.nFT.findMany({
      where: {
        tags: {
          hasSome: tags,
        },
      },
    });
  }

  async function getNFTs(): Promise<NFT[]> {
    return db.nFT.findMany({
      include: {
        auction: true,
        creator: true,
      },
    });
  }

  return Object.freeze({
    getNFTById,
    getNFTByCreatorId,
    createNFT,
    getNFTCategories,
    getNFTs,
  });
}
