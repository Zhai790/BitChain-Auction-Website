const API_URL = 'http://localhost:8080/';

export const auctionMutations = {
  async createAuction(data: {
    nftId: string;
    startPrice: number;
    startTime: Date;
    endTime: Date;
  }): Promise<{ id: string; nftId: string; currentPrice: number }> {
    const mutation = `
            mutation CreateAuction($data: CreateAuctionInput!) {
                createAuction(data: $data) {
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
        query: mutation,
        variables: {
          data: {
            nftId: Number.parseInt(data.nftId),
            startPrice: data.startPrice,
            startTime: data.startTime.toISOString(),
            endTime: data.endTime.toISOString(),
          },
        },
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

    if (!json.data?.createAuction) {
      throw new Error('Failed to create auction');
    }

    return {
      id: String(json.data.createAuction.id),
      nftId: String(json.data.createAuction.nftId),
      currentPrice: json.data.createAuction.currentPrice,
    };
  },
};
