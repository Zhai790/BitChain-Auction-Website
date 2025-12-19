export const gqlSchema = `#graphql
  enum UserRole {
    COLLECTOR
    ARTIST
    ADMIN
  }

  enum Categories{
    ART
    GAMING
    MUSIC
    PHOTOGRAPHY
    VIDEO
    SPORT
  }

  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    role: UserRole!
    createdAt: String!
    updatedAt: String!
    walletBalance: Float!
    walletAddress: String!
    bidsTotal: Float!
    avatarPicture: String
    bannerPicture: String
    description: String
    bids: [Bid!]
    nfts: [NFT!]
  }

  type NFT {
    id: ID!
    title: String!
    description: String
    imageUrl: String!
    creatorId: Int!
    ownerId: Int!
    createdAt: String!
    auction: Auction
    creator: User!
    owner: User!
    tags: [Categories!]

  }

  type Auction {
    id: ID!
    nftId: Int!
    startPrice: Float!
    currentPrice: Float!
    startTime: String!
    endTime: String!
    isActive: Boolean!
    nft: NFT!
    bids: [Bid!]
  }

  type Bid {
    id: ID!
    amount: Float!
    createdAt: String!
    bidderId: Int!
    auctionId: Int!
    auction: Auction!
    bidder: User!
  }

  # ----------------------------
  # Input Types
  # ----------------------------

  input CreateUserInput {
    name: String!
    email: String!
    password: String!
    avatarPicture: String!
    bannerPicture: String!
    role: UserRole
  }

  input UpdateUserInput {
    name: String
    email: String
    walletBalance: Float
    bidsTotal: Float
    avatarPicture: String
    bannerPicture: String
    description: String
    password: String
  }

  input CreateNFTInput {
    title: String!
    description: String
    imageUrl: String!
    creatorId: Int!
    tags: [String!]! 
  }

  input CreateAuctionInput {
    nftId: Int!
    startPrice: Float!
    startTime: String!
    endTime: String!
  }

  input UpdateAuctionInput {
    id: Int!
    currentPrice: Float
    endTime: String
    isActive: Boolean
  }

  input placeBidArgs {
    auctionId: Int!
    bidderId: Int!
    amount: Float!
  }

  input LoginInput{
    email: String!
    password: String!
  }

  # Root Types

  type Query {
    users: [User!]
    user(id: Int!): User
    nfts: [NFT!]
    nft(id: Int!): NFT
    nftsByCreatorId(id: Int!): [NFT!]
    auctions: [Auction!]
    auction(id: ID!): Auction
    auctionByNftId(nftId: Int!): Auction
    bids: [Bid!]
    bid(id: ID!): Bid
    ownedNfts(userId: Int!): [NFT!]
    bidNfts(userId: Int!): [NFT!]
    createdNfts(creatorId: Int!): [NFT!]
  }

  type Mutation {
    #auth
    login(data: LoginInput!): User!
    register(data: CreateUserInput!): User!

    #users
    updateUser(id: ID!, data: UpdateUserInput!): User!

    #Wallet operations
    addFunds(userId: Int!, amount: Float!): User!

    #NFTS
    createNFT(data: CreateNFTInput!): NFT!
    getNFTByCategories(data: [Categories!]): [NFT!]
    getNFTsByCreatorId(id: Int!): [NFT!]

    #Auctions
    createAuction(data: CreateAuctionInput!): Auction!
    updateAuction(data: UpdateAuctionInput!): Auction!
    highestBid(auctionId: Int!): Float!

    #Bids
    placeBid(data: placeBidArgs!): Bid!
  }
`;
