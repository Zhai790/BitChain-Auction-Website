export const FETCH_USER = `
    query user($id: Int!) {
        user(id: $id) {
        id
        name
        email
        description
        avatarPicture
        bannerPicture
        }
    }
    `
;

export const OWNED_NFTS_QUERY = `
  query OwnedNfts($userId: Int!) {
    ownedNfts(userId: $userId) {
      id
      title
      imageUrl
      creator {
        id
        name
        avatarPicture
      }
      auction {
        currentPrice
      }
    }
  }
`;

export const BID_NFTS_QUERY = `
  query BidNfts($userId: Int!) {
    bidNfts(userId: $userId) {
      id
      title
      imageUrl
      creator {
        id
        name
        avatarPicture
      }
      auction {
        currentPrice
      }
    }
  } 
`;

export const CREATED_NFTS_QUERY = `
  query CreatedNFTs($creatorId: Int!) {
    createdNfts(creatorId: $creatorId) {
      id
      title
      description
      imageUrl
      createdAt
      tags
      creator {
        id
        name
        avatarPicture
      }
      auction {
        currentPrice
      }
    }
  }
`;
