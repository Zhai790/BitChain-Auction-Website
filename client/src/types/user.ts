export interface User {
    walletBalance: number;
    id: number;
    name: string;
    email: string;
    description: string;
    avatarPicture?: string | null;
    bannerPicture?: string | null;
    role: 'ARTIST' | 'COLLECTOR';
}