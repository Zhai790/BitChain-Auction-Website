import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:8081';

export function useAuctionSocket(auctionId: number | null) {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  useEffect(() => {
    if (auctionId == null) return;

    const socket: Socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('[socket] connected:', socket.id);
      socket.emit('joinAuction', auctionId);
      console.log('[socket] joined room', `auction:${auctionId}`);
    });

    socket.on('auction:updated', (updatedAuction: any) => {
      console.log('[socket] auction:updated received:', updatedAuction);
      if (updatedAuction?.currentPrice != null) {
      setCurrentPrice(updatedAuction.currentPrice);
      }
    });

    socket.on('bid:placed', (data: any) => {
      console.log('[socket] bid:placed received:', data);
      if (data.auctionId === auctionId && data.bid?.amount != null) {
        setCurrentPrice(data.bid.amount);
      }
    });

    socket.on('disconnect', () => {
      console.log('[socket] disconnected');
    });

    socket.on('connect_error', (err) => {
      console.error('[socket] connect_error', err);
    });

    return () => {
      console.log('[socket] disconnecting for auction', auctionId);
      socket.disconnect();
    };
  }, [auctionId]);

  return { currentPrice };
}
