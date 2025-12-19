import { createQueryResolvers } from './queryResolvers';
export function createResolvers(deps) {
    return {
        Query: createQueryResolvers(deps),
    };
}
