import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const users = await prisma.user.createMany({
        data: [
            {
                name: 'Collector One',
                email: 'collector1@example.com',
                password: 'password123',
            },
            {
                name: 'Artist One',
                email: 'artist1@example.com',
                password: 'password123',
            },
            {
                name: 'Artist Two',
                email: 'artist2@example.com',
                password: 'password123',
            },
        ],
        skipDuplicates: true,
    });
    console.log('✅ Users created:', users);
    const artist = await prisma.user.findFirst({ where: { name: 'Artist One' } });
    if (!artist) {
        console.error('❌ Artist not found.');
        return;
    }
    const nft1 = await prisma.nFT.create({
        data: {
            title: 'Digital Dreams',
            description: 'A surreal digital art piece exploring imagination and color.',
            imageUrl: 'SUPABASE_LINK',
            creatorId: artist.id,
        },
    });
    const nft2 = await prisma.nFT.create({
        data: {
            title: 'Future Relic',
            description: 'Abstract NFT depicting humanity’s interaction with technology.',
            imageUrl: 'SUPABASE_LINK',
            creatorId: artist.id,
        },
    });
    console.log('✅ NFTs created:', [nft1.title, nft2.title]);
    const auction1 = await prisma.auction.create({
        data: {
            nftId: nft1.id,
            startPrice: 1.5,
            currentPrice: 1.5,
            startTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // started 2h ago
            endTime: new Date(Date.now() + 1000 * 60 * 60 * 2), // ends in 2h
            isActive: true,
        },
    });
    const auction2 = await prisma.auction.create({
        data: {
            nftId: nft2.id,
            startPrice: 2.0,
            currentPrice: 2.0,
            startTime: new Date(Date.now() - 1000 * 60 * 60 * 4),
            endTime: new Date(Date.now() - 1000 * 60 * 60 * 1), // already ended
            isActive: false,
        },
    });
    console.log('✅ Auctions created:', [auction1.id, auction2.id]);
    const bidder = await prisma.user.findFirst({ where: { name: 'collector1' } });
    if (bidder) {
        await prisma.bid.createMany({
            data: [
                { amount: 1.7, auctionId: auction1.id, bidderId: bidder.id },
                { amount: 1.9, auctionId: auction1.id, bidderId: bidder.id },
            ],
        });
    }
    console.log('✅ Bids created for auction 1');
}
main()
    .then(async () => {
    console.log('🌱 Database seeded successfully!');
    await prisma.$disconnect();
})
    .catch(async (e) => {
    console.error('❌ Seed error:', e);
    await prisma.$disconnect();
    process.exit(1);
});
