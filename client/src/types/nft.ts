export interface NFT {
  id: string;
  name: string;
  imageUrl: string;
  creatorName: string;
  creatorAvatarUrl: string;
  price?: string;
  description?: string;
  tags?: string[];
  creator: {
    id: string;
    name: string;
  };
  isActive:boolean;
}
