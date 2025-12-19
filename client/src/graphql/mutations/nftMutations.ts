const API_URL = 'http://localhost:8080/';

export const nftMutations = {
  async createNFT(data: {
    title: string;
    description?: string;
    imageUrl: string;
    creatorId: string;
    tags: string[];
  }): Promise<{ id: string; title: string; imageUrl: string }> {
    const mutation = `
            mutation CreateNFT($data: CreateNFTInput!) {
                createNFT(data: $data) {
                    id
                    title
                    description
                    imageUrl
                    tags
                    creator {
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
        variables: {
          data: {
            title: data.title,
            description: data.description || '',
            imageUrl: data.imageUrl,
            creatorId: Number.parseInt(data.creatorId),
            tags: data.tags,
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

    if (!json.data?.createNFT) {
      throw new Error('Failed to create NFT');
    }

    return {
      id: String(json.data.createNFT.id),
      title: json.data.createNFT.title,
      imageUrl: json.data.createNFT.imageUrl,
    };
  },
};
