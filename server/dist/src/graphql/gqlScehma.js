export const gqlSchema = `#graphql
  enum UserRole {
    COLLECTOR
    ARTIST
    ADMIN
  }

  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    role: UserRole!
    createdAt: String!
    updatedAt: String!
    bids: [Bid!]
    nfts: [NFT!]
  }

  type NFT {
    id: ID!
    title: String!
    description: String
    imageUrl: String!
    creatorId: Int!
    createdAt: String!
    auction: Auction
    creator: User!
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
    role: UserRole
  }

  input UpdateUserInput {
    name: String
    email: String
    password: String
    
  }

  input CreateNFTInput {
    title: String!
    description: String
    imageUrl: String!
    creatorId: Int!
  }

  input CreateAuctionInput {
    nftId: Int!
    startPrice: Float!
    startTime: String!
    endTime: String!
  }

  input PlaceBidInput {
    auctionId: Int!
    bidderId: Int!
    amount: Float!
  }

  input LoginInput{
    name: String!
    email: String!
    password: String!
  }

  # Root Types

  type Query {
    users: [User!]
    user(id: ID!): User
    nfts: [NFT!]
    nft(id: ID!): NFT
    auctions: [Auction!]
    auction(id: ID!): Auction
    bids: [Bid!]
  }

  type Mutation {

    #auth
    login(data: LoginInput!): Boolean!
    register(data: CreateUserInput!): User!

    #users
    updateUser(id: ID!, data: UpdateUserInput!): User!

    #NFTS
    createNFT(data: CreateNFTInput!): NFT!

    #Auctions
    createAuction(data: CreateAuctionInput!): Auction!

    #Bids
    placeBid(data: PlaceBidInput!): Bid!
  }
`;
