export interface Auction {
  id: number;
  nftId: number;
  startPrice: number;
  currentPrice: number;
  startTime: Date;
  endTime: Date;
  isActive: boolean;
}

export interface CreateAuctionArgs {
  nftId: number;
  startPrice: number;
  startTime: Date;
  endTime: Date;
  isActive?: boolean;
}

export interface UpdateAuctionInput {
  id: number;
  currentPrice?: number;
  endTime?: Date;
  isActive?: boolean;
}
