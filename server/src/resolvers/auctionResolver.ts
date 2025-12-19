// src/resolvers/auctionResolvers.ts
import { GraphQLError } from 'graphql';
import { AuctionModel } from '../models/auctionModel';
import { HTTP_CODES } from '../httpCodes';
import {
    Auction,
    CreateAuctionArgs,
    UpdateAuctionInput,
} from '../types/auctionType';
import type { Server as SocketIOServer } from 'socket.io';

/**
 * TODO
 * Add check to only create auction if start and endtime are after current time
 */
export function createAuctionResolver({
    auctionModel,
    io,
}: {
    auctionModel: AuctionModel;
    io: SocketIOServer;
}) {
    async function createAuction(
        _parent: unknown,
        { data }: { data: CreateAuctionArgs }
    ): Promise<Auction> {
        const { nftId, startPrice, startTime, endTime } = data;

        if (!nftId || !startPrice || !startTime || !endTime) {
            throw new GraphQLError('Missing required auction fields.', {
                extensions: { code: HTTP_CODES.BAD_REQUEST },
            });
        }

        try {
            const created = await auctionModel.createAuction(data);

            io.emit('auction:created', created);

            return created;
        } catch (error: any) {
            console.error(error);
            throw new GraphQLError(`Failed to create Auction. ${error}`, {
                extensions: { code: HTTP_CODES.SERVER_ERROR },
            });
        }
    }

    async function updateAuction(
        _parent: unknown,
        { data }: { data: UpdateAuctionInput }
    ): Promise<Auction> {
        const { id, currentPrice, endTime, isActive } = data;

        if (!id) {
            throw new GraphQLError('Missing required id field.', {
                extensions: { code: HTTP_CODES.BAD_REQUEST },
            });
        }

        try {
            const auctionSearch = await auctionModel.getAuctionById(id);
            if (!auctionSearch) {
                throw new GraphQLError('Auction not found.', {
                    extensions: { code: HTTP_CODES.NOT_FOUND },
                });
            }

            if (!currentPrice && !endTime && isActive === undefined) {
                throw new GraphQLError(
                    'At least one field must be provided to update.',
                    {
                        extensions: { code: HTTP_CODES.BAD_REQUEST },
                    }
                );
            }

            const updated = await auctionModel.updateAuction(
                auctionSearch.id,
                data
            );

            io.to(`auction:${updated.id}`).emit('auction:updated', updated);

            return updated;
        } catch (error: any) {
            console.error(error);
            throw new GraphQLError(`Failed to update auction. ${error}`, {
                extensions: { code: HTTP_CODES.SERVER_ERROR },
            });
        }
    }

    async function highestBid(
        _parent: unknown,
        { auctionId }: { auctionId: number }
    ) {
        return auctionModel.getHighestBid(auctionId);
    }

    return {
        createAuction,
        updateAuction,
        highestBid,
    };
}
