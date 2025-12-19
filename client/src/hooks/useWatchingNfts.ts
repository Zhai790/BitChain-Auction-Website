import { useEffect, useState } from 'react';
import { GRAPHQL_ENDPOINT } from '../config/env';
import type { NFT } from '../types/nft';
import { BID_NFTS_QUERY } from '../graphql/queries/userQueries';
import { toast } from 'react-toastify';

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
    creatorAvatarUrl: apiNft.creator?.avatarPicture ?? '/avatar-placeholder.png',
    price: apiNft.auction?.currentPrice != null ? `${apiNft.auction.currentPrice.toFixed(2)} ETH`: '--',
    creator: {
        id:"",
        name: ""
    },
    isActive: false
  };
}

export function useBidNfts(userId: number | null) {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchBidNfts() {
    if (!userId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: BID_NFTS_QUERY,
          variables: { userId },
        }),
      });

      const json = await res.json();
      if (json.errors?.length) {
        throw new Error(json.errors[0].message);
      }

      const apiNfts: InputNFT[] = json.data?.bidNfts ?? [];
      setNfts(apiNfts.map(mapApiNftToCardNft));
    } catch (err: any) {
      toast.error('Failed to fetch bid NFTs:', err);
      setError(err.message || 'Failed to fetch bid NFTs');
    } finally { 
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBidNfts();
  }, [userId]);

  return { nfts, loading, error, refetch: fetchBidNfts };
}
