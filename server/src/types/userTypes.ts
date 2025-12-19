import { Bid } from './bidType';
import { NFT } from './nftType';

export const UserRole = {
    COLLECTOR: 'COLLECTOR',
    ARTIST: 'ARTIST',
    ADMIN: 'ADMIN',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
    readonly id: number;
    readonly role: UserRole;
    readonly name: string;
    readonly email: string;
    readonly password: string;
    readonly bids: Bid[];
    readonly nfts: NFT[];
    readonly walletBalance: number;
    readonly walletAddress: string;
    readonly bidsTotal: number;
    readonly avatarPicture: string | null;
    readonly bannerPicture: string | null;
}

export interface CreateUserArgs {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
}

export interface UpdateUserInput {
    id: number;
    name?: string;
    email?: string;
    password?: string;
    walletBalance?: number;
    bidsTotal?: number;
    avatarPicture?: string;
    bannerPicture?: string;
    description?: string;
}
