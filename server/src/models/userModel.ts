// src/models/userModel.ts
import { read } from 'fs';
import { DbClient } from '../db/dbClient';
import type { CreateUserArgs, UpdateUserInput, User } from '../types/userTypes';
import { NFT } from '../types/nftType';

export interface UserModel {
    readonly getUserById: (id: number) => Promise<User | undefined>;
    readonly getUserByEmail: (email: string) => Promise<User | undefined>;
    readonly createUser: (data: CreateUserArgs) => Promise<User>;
    readonly updateUser: (id: number, data: UpdateUserInput) => Promise<User>;
    readonly addFunds: (id: number, amount: number) => Promise<void>;
    readonly deductFunds: (id: number, amount: number) => Promise<void>;
    readonly getOwnedNFTs:(userId: number)=> Promise<NFT[]>;
    readonly getCreatedNFTs:(userId: number)=> Promise<NFT[]>;
    readonly getBidNfts:(userId: number)=> Promise<NFT[]>;
}

export function createUserModel(db: DbClient): UserModel {
    async function getUserById(id: number) {
        return (
            (await db.user.findUnique({
                where: { id },
                include: { bids: true, nfts: true },
            })) ?? undefined
        );
    }

    async function getUserByEmail(email: string) {
        return (
            (await db.user.findUnique({
                where: { email },
                include: { bids: true, nfts: true },
            })) ?? undefined
        );
    }

    async function createUser(data: CreateUserArgs) {
        return db.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password,
                role: data.role ?? 'COLLECTOR',
            },
            include: { bids: true, nfts: true },
        });
    }

    async function updateUser(id: number, data: UpdateUserInput) {
        return db.user.update({
            where: { id },
            data: {
                name: data.name ?? undefined,
                email: data.email ?? undefined,
                password: data.password ?? undefined,
                walletBalance: data.walletBalance ?? undefined,
                bidsTotal: data.bidsTotal ?? undefined,
                avatarPicture: data.avatarPicture ?? undefined,
                bannerPicture: data.bannerPicture ?? undefined,
                description: data.description ?? undefined,
            },
            include: { bids: true, nfts: true },
        });
    }

    async function addFunds(id: number, amount: number): Promise<void> {
        await db.user.update({
            where: { id },
            data: {
                walletBalance: { increment: amount },
            },
        });
    }

    async function deductFunds(id: number, amount: number): Promise<void> {
        await db.user.update({
            where: { id },
            data: {
                walletBalance: { decrement: amount },
            },
        });
    }

    async function getOwnedNFTs(userId: number): Promise<NFT[]> {
        console.log(userId);
        return await db.nFT.findMany({
            where: { ownerId: userId },
            include: {
                auction: true,
                creator: true,
                owner: true
            },
        });

    }


    async function getCreatedNFTs(userId: number): Promise<NFT[]> {
        return await db.nFT.findMany({
            where: { creatorId: userId },
            include: {
                auction: true,
                creator: true,
            },
        });

    }


    async function getBidNfts(userId: number): Promise<NFT[]> {
        const bids = await db.bid.findMany({
            where: { bidderId: userId },
            include: {
                auction: {
                    include: {
                        nft: {
                            include: {
                                auction: true,
                                creator: true,
                            },
                        },
                    },
                },
            },
        });

        const nftMap = new Map<number, NFT>();

        for (const bid of bids) {
            const nft = bid.auction?.nft;
            if (nft && !nftMap.has(nft.id)) {
                nftMap.set(nft.id, nft as unknown as NFT);
            }
        }

        return Array.from(nftMap.values());
    }

    return Object.freeze({
        getUserById,
        getUserByEmail,
        createUser,
        updateUser,
        addFunds,
        deductFunds,
        getOwnedNFTs,
        getCreatedNFTs,
        getBidNfts
    });
}
