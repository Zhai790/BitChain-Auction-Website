import { useEffect, useState } from 'react';
import { GRAPHQL_ENDPOINT } from '../config/env';
import type { NFT } from '../types/nft';
import { CREATED_NFTS_QUERY } from '../graphql/queries/userQueries';
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
  // console.log(apiNft);s
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

export function useCreatedNfts(userId: number | null) {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchCreated() {
    if (!userId) return;
    setLoading(true);

    // console.log(userId);

    try {
      const res = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: CREATED_NFTS_QUERY,
          variables: { creatorId: userId },
        }),
      });

      const json = await res.json();
      // console.log(json);
      if (json.errors?.length) {
        throw new Error(json.errors[0].message);
      }

      const apiNfts: InputNFT[] = json.data?.createdNfts ?? [];
      setNfts(apiNfts.map(mapApiNftToCardNft));
    } catch (err: any) {
      toast.error('Failed to fetch owned NFTs:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCreated();
  }, [userId]);

  return { nfts, loading, refetch: fetchCreated };
}
