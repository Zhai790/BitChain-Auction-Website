export function createUserModel(dbClient) {
    async function getUserById(id) {
        const user = await dbClient.user.findUnique({
            where: { id },
            include: { bids: true, nfts: true },
        });
        if (!user)
            return undefined;
        return user;
    }
    return Object.freeze({
        getUserById,
    });
}
