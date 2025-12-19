export const UPDATE_USER = `
    mutation UpdateUser($id: ID!, $data: UpdateUserInput!) {
    updateUser(id: $id, data: $data) {
        id
        name
        email
        avatarPicture
        bannerPicture
        description
    }
    }
`;

export const REGISTER_USER = `
            mutation RegisterUser($data: CreateUserInput!) {
              register(data: $data) {
                id
                name
                email
                role
              }
            }
          `;

export const ADD_FUNDS_MUTATION = `
            mutation AddFunds($userId: Int!, $amount: Float!) {
              addFunds(userId: $userId, amount: $amount) {
                id
                name
                email
                role
                walletBalance
                bidsTotal
                avatarPicture
                bannerPicture
                description
              }
            }
          `;
