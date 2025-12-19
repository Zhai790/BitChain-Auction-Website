export type Auction = {
    id: number;
    nftId: number;
    startPrice: number;
    currentPrice: number;
    startTime: Date;
    endTime: Date;
    isActive: boolean;
};
