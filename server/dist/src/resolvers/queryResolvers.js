import { GraphQLError } from 'graphql';
import { HTTP_CODES } from '../httpCodes';
export function createQueryResolvers({ userModel }) {
    async function user(_parent, { userId }) {
        const u = await userModel.getUserById(userId);
        if (!u) {
            throw new GraphQLError('User not found.', {
                extensions: { code: HTTP_CODES.NOT_FOUND },
            });
        }
        return u;
    }
    return { user };
}
