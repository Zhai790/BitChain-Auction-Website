const API_URL = 'http://localhost:8080/';

export const bidMutations = {
  async placeBid(data: {
    auctionId: number;
    bidderId: number;
    amount: number;
  }): Promise<{ id: string; amount: number }> {
    const mutation = `
      mutation PlaceBid($data: placeBidArgs!) {
        placeBid(data: $data) {
          id
          amount
          createdAt
          auction {
            id
            currentPrice
          }
          bidder {
            id
            name
          }
        }
      }
    `;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: mutation,
        variables: { data },
      }),
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`);
    }

    if (json.errors && json.errors.length > 0) {
      throw new Error(json.errors[0].message);
    }

    if (!json.data?.placeBid) {
      throw new Error('Failed to place bid - no data returned');
    }

    const bidData = json.data.placeBid;

    if (!bidData.amount) {
      throw new Error('Invalid bid data received from server');
    }

    return {
      id: String(bidData.id),
      amount: bidData.amount,
    };
  },
};
