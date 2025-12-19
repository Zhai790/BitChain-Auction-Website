import { NFT } from '../../types/nft';

const API_URL = 'http://localhost:8080/';

export const nftQueries = {
  async getNFTById(id: string): Promise<NFT> {
    const query = `
        query GetNFTById($id: Int!) {
            nft(id: $id) {
                id
                title
                description
                imageUrl
                tags
                creator {
                    id
                    name
                    avatarPicture
                }
                auction {
                  currentPrice
                  isActive
                }
            }
        }
    `;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        variables: { id: Number.parseInt(id) },
      }),
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`);
    }

    if (json.errors && json.errors.length > 0) {
      console.error('GraphQL errors:', json.errors);
      throw new Error(json.errors[0].message || 'GraphQL error');
    }

    if (!json.data?.nft) {
      throw new Error('NFT not found');
    }

    const nftData = json.data.nft;
    
    return {
      id: String(nftData.id),
      name: nftData.title,
      imageUrl: nftData.imageUrl || '/nft-placeholder.png',
      creatorName: nftData.creator?.name ?? 'Unknown Creator',
      creatorAvatarUrl: nftData.creator?.avatarPicture ?? '/avatar.png',
      description: nftData.description,
      tags: nftData.tags || [],
      price: nftData.auction
        ? `${nftData.auction.currentPrice.toFixed(2)} ETH`
        : 'Not for sale',
      creator: {
        id: String(nftData.creator.id),
        name: nftData.creator.name,
      },
      isActive:!!(nftData.auction && nftData.auction.isActive)
    };
  },

  async getAllNFTs(): Promise<NFT[]> {
    const query = `
          query {
            nfts {
              id
              title
              imageUrl
              tags
              creator {
                id
                name
                avatarPicture
              }
              auction {
                currentPrice
                isActive
              }
            }
          }
          `;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`);
    }

    if (json.errors && json.errors.length > 0) {
      throw new Error(json.errors[0].message);
    }

    if (!json.data?.nfts) {
      return [];
    }
    
    return json.data.nfts.map((nft: any) => ({
      id: String(nft.id),
      name: nft.title,
      imageUrl: nft.imageUrl || '/nft-placeholder.png',
      creatorName: nft.creator?.name ?? 'Unknown Creator',
      creatorAvatarUrl: nft.creator?.avatarPicture ?? '/avatar.png',
      price: nft.auction
        ? `${nft.auction.currentPrice.toFixed(2)} ETH`
        : 'Not for sale',
      creator: {
        id: String(nft.creator?.id ?? '0'),
        name: nft.creator?.name ?? 'Unknown Creator',
      },
      tags: nft.tags,
      isActive:!!(nft.auction && nft.auction.isActive)
    }));
  },

  async getNFTsByCreatorId(creatorId: string): Promise<NFT[]> {
    const query = `
      query GetNFTsByCreatorId($id: Int!) {
        nftsByCreatorId(id: $id) {
          id
          title
          imageUrl
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

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        variables: { id: Number.parseInt(creatorId) },
      }),
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`);
    }

    if (json.errors && json.errors.length > 0) {
      console.error('GraphQL errors:', json.errors);
      throw new Error(json.errors[0].message);
    }

    if (!json.data?.nftsByCreatorId) {
      return [];
    }

    return json.data.nftsByCreatorId.map((nft: any) => ({
      id: String(nft.id),
      name: nft.title,
      imageUrl: nft.imageUrl || '/nft-placeholder.png',
      creatorName: nft.creator?.name ?? 'Unknown Creator',
      creatorAvatarUrl: nft.creator?.avatarPicture ?? '/avatar.png',
      price: nft.auction
        ? `${nft.auction.currentPrice.toFixed(2)} ETH`
        : 'Not for sale',
      creator: {
        id: String(nft.creator.id),
        name: nft.creator.name,
      },
    }));
  },
};
