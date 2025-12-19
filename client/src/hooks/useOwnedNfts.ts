import { useEffect, useState } from 'react';
import { GRAPHQL_ENDPOINT } from '../config/env';
import type { NFT } from '../types/nft';
import { OWNED_NFTS_QUERY } from '../graphql/queries/userQueries';

type InputNFT = {
  id: number;
  title: string;
  imageUrl: string;
  creator: {
    id: number;
    name: string;
    avatarPicture?: string | null;
  };
  auction?: {
    currentPrice: number | null;
  } | null;
};

function mapApiNftToCardNft(apiNft: InputNFT): NFT {
  return {
    id: String(apiNft.id),
    name: apiNft.title,
    imageUrl: apiNft.imageUrl,
    creatorName: apiNft.creator?.name ?? 'Unknown',
    creatorAvatarUrl: apiNft.creator?.avatarPicture ?? '/avatar.png',
    price: apiNft.auction?.currentPrice != null? `${apiNft.auction.currentPrice.toFixed(2)} ETH`: '--',
    creator: {
        id:"",
        name: ""
    },
    isActive: false
  };
}

export function useOwnedNfts(userId: number | null) {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchOwned() {
    if (!userId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: OWNED_NFTS_QUERY,
          variables: { userId },
        }),
      });

      const json = await res.json();
      if (json.errors?.length) {
        throw new Error(json.errors[0].message);
      }

      const apiNfts: InputNFT[] = json.data?.ownedNfts ?? [];
      setNfts(apiNfts.map(mapApiNftToCardNft));
    } catch (err: any) {
      console.error('Failed to fetch owned NFTs:', err);
      setError(err.message || 'Failed to fetch owned NFTs');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOwned();
  }, [userId]);

  return { nfts, loading, error, refetch: fetchOwned };
}
