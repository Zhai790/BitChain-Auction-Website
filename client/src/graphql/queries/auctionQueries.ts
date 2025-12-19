import { Auction } from '../../types/auction';
const API_URL = 'http://localhost:8080/';

export const auctionQueries = {
    async getAuctionByNftId(nftId: string): Promise<Auction> {
        const query = `
        query GetAuctionByNftId($nftId: Int!) {
            auctionByNftId(nftId: $nftId) {
                id
                nftId
                startPrice
                currentPrice
                startTime
                endTime
                isActive
                }
            }
        `;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query,
                variables: { nftId: Number.parseInt(nftId) },
            }),
        });

        const json = await response.json();
        if (!response.ok) {
            throw new Error(`Network error: ${response.status}`);
        }

        if (json.errors && json.errors.length > 0) {
            console.error('GraphQL errors:', json.errors);
            throw new Error('GraphQL responded with errors');
        }

        if (!json.data?.auctionByNftId) {
            console.error('No auction field in GraphQL response data');
            throw new Error('GraphQL could not find auction');
        }

        return json.data.auctionByNftId;
    },
};
