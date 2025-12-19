import { graphql, GraphQLError } from 'graphql';
import { UserModel } from '../models/userModel';
import { HTTP_CODES } from '../httpCodes';
import { CreateUserArgs, UpdateUserInput, User } from '../types/userTypes';
import { __param } from 'tslib';
import { AuctionModel } from '../models/auctionModel';

type LoginArgs = {
    data: {
        email: string;
        password: string;
    };
};


type UpdateUserArgs = {
    id: string;
    data: UpdateUserInput;
}
export function createUserResolver({
    userModel,
    auctionModel,
}: {
    userModel: UserModel;
    auctionModel: AuctionModel;
}) {
    async function login(
        _parent: unknown,
        { data }: LoginArgs
    ): Promise<User | GraphQLError> {
        const { email, password } = data;

        const emailSearch = await userModel.getUserByEmail(email);

        if (!emailSearch) {
            throw new GraphQLError('User not found.', {
                extensions: { code: HTTP_CODES.NOT_FOUND },
            });
        }

        if (password == emailSearch.password) {
            return emailSearch;
        }

        throw new GraphQLError('Password is Incorrect.', {
            extensions: { code: HTTP_CODES.UNAUTHORIZED },
        });
    }

    async function register(
        _parent: unknown,
        { data }: { data: CreateUserArgs }
    ): Promise<User | GraphQLError> {
        const { name, email, password, role } = data;

        if (name.length == 0 || email.length == 0 || password.length == 0) {
            throw new GraphQLError('Input Parameters are missing', {
                extensions: { code: HTTP_CODES.BAD_REQUEST },
            });
        }

        const existing = await userModel.getUserByEmail(email);
        if (existing) {
            throw new GraphQLError('Email already in use.', {
                extensions: { code: HTTP_CODES.UNAUTHORIZED },
            });
        }
        const created = await userModel.createUser({
            name,
            email,
            password,
            role,
        });

        return created;
    }

    async function updateUser(
        _parent: unknown,
        { id, data }: UpdateUserArgs
    ): Promise<User> {
        const userID = Number(id);

        if (!userID) {
            throw new GraphQLError('User not found.', {
                extensions: { code: HTTP_CODES.NOT_FOUND },
            });
        }

        try {
            const updated = await userModel.updateUser(userID, data);
            if (!updated) {
                throw new GraphQLError('Failed to update user.', {
                    extensions: { code: HTTP_CODES.SERVER_ERROR },
                });
            }

            return updated;
        } catch (e) {
            throw new GraphQLError('Failed to update user.', {
                extensions: { code: HTTP_CODES.SERVER_ERROR },
            });
        }
    }

    async function addFunds(
        _parent: unknown,
        { userId, amount }: { userId: number; amount: number }
    ): Promise<User> {
        if (amount <= 0) {
            throw new GraphQLError('Amount must be positive.', {
                extensions: { code: HTTP_CODES.BAD_REQUEST },
            });
        }

        const user = await userModel.getUserById(userId);
        if (!user) {
            throw new GraphQLError('User not found.', {
                extensions: { code: HTTP_CODES.NOT_FOUND },
            });
        }
        return await userModel.updateUser(userId, {
            walletBalance: user.walletBalance + amount,
            id: userId,
        });
    }

    async function addBidAmount(
        _parent: unknown,
        { userId, amount }: { userId: number; amount: number }
    ): Promise<User> {
        const user = await userModel.getUserById(userId);
        if (!user) {
            throw new GraphQLError('User not found.', {
                extensions: { code: HTTP_CODES.NOT_FOUND },
            });
        }

        return await userModel.updateUser(userId, {
            bidsTotal: user.bidsTotal + amount,
            id: userId,
        });
    }

    return {
        login,
        register,
        updateUser,
        addFunds,
    };
}
