export interface Bid {
    id: number;
    amount: number;
    createdAt: Date;
    bidderId: number;
    auctionId: number;
}

export interface PlaceBidArgs {
    amount: number;
    bidderId: number;
    auctionId: number;
}
