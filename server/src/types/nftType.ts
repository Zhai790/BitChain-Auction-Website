import { Categories } from '@prisma/client';
import { Auction } from './auctionType';

export interface NFT {
  readonly id: number;
  readonly title: string;
  readonly description?: string | null;
  readonly imageUrl: string;
  readonly creatorId: number;
  readonly createdAt: Date;
  readonly auction?: Auction | null;
  readonly tags?: Categories[];
}

export interface CreateNFTArgs {
  title: string;
  description?: string | null;
  imageUrl: string;
  creatorId: number;
  tags?: Categories[];
}
