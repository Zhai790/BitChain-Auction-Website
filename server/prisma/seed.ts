import { PrismaClient, UserRole, Categories, type NFT, type Auction } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    const avatarUrls = [
        'https://nkxzkkeflihiwqdnydxw.supabase.co/storage/v1/object/public/seng513-bidchain/avatar/avatar-1.png',
        'https://nkxzkkeflihiwqdnydxw.supabase.co/storage/v1/object/public/seng513-bidchain/avatar/avatar-2.png',
        'https://nkxzkkeflihiwqdnydxw.supabase.co/storage/v1/object/public/seng513-bidchain/avatar/avatar-3.png',
        'https://nkxzkkeflihiwqdnydxw.supabase.co/storage/v1/object/public/seng513-bidchain/avatar/avatar-4.png',
        'https://nkxzkkeflihiwqdnydxw.supabase.co/storage/v1/object/public/seng513-bidchain/avatar/avatar-5.png',
        'https://nkxzkkeflihiwqdnydxw.supabase.co/storage/v1/object/public/seng513-bidchain/avatar/avatar-6.png',
        'https://nkxzkkeflihiwqdnydxw.supabase.co/storage/v1/object/public/seng513-bidchain/avatar/avatar-7.png',
        'https://nkxzkkeflihiwqdnydxw.supabase.co/storage/v1/object/public/seng513-bidchain/avatar/avatar-8.png',
    ];

    const bannerUrl =
        'https://nkxzkkeflihiwqdnydxw.supabase.co/storage/v1/object/public/seng513-bidchain/banner/banner-1.png';

    await prisma.user.createMany({
        data: [
            {
                name: 'Collector One',
                email: 'collector1@example.com',
                password: 'password123',
                role: UserRole.COLLECTOR,
                avatarPicture: avatarUrls[0],
                bannerPicture: bannerUrl,
                walletBalance: 200,
                description:
                    'A passionate digital art collector who loves discovering new creators. Always on the lookout for unique and rare pieces. Enjoys participating in live auctions and supporting emerging artists.',
            },
            {
                name: 'Collector Two',
                email: 'collector2@example.com',
                password: 'password123',
                role: UserRole.COLLECTOR,
                avatarPicture: avatarUrls[1],
                bannerPicture: bannerUrl,
                walletBalance: 350,
                description:
                    'An experienced crypto collector with a curated collection of NFTs from top creators. Loves exploring generative art and futuristic designs. Advocates for fair creator royalties in the NFT space.',
            },
            {
                name: 'Artist One',
                email: 'artist1@example.com',
                password: 'password123',
                role: UserRole.ARTIST,
                avatarPicture: avatarUrls[2],
                bannerPicture: bannerUrl,
                description:
                    'A digital artist blending surrealism with vibrant color palettes. Their work explores emotion, abstraction, and hidden symbolism. Known for pushing creative boundaries with each new release.',
            },
            {
                name: 'Artist Two',
                email: 'artist2@example.com',
                password: 'password123',
                role: UserRole.ARTIST,
                avatarPicture: avatarUrls[3],
                bannerPicture: bannerUrl,
                description:
                    'A multidisciplinary creator working across 3D modeling and digital illustration. Inspired by nature, sci-fi, and human expression. Their NFTs often feature bold compositions and dynamic visual storytelling.',
            },
        ],
        skipDuplicates: true,
    });

    console.log('✅ Users created');

    const artists = await prisma.user.findMany({
        where: { role: UserRole.ARTIST },
    });

    const collectors = await prisma.user.findMany({
        where: { role: UserRole.COLLECTOR },
    });

    const nftImages = [
        {
            title: "Retro Punk",
            imageUrl:
                "https://nkxzkkeflihiwqdnydxw.supabase.co/storage/v1/object/public/seng513-bidchain/nft/nft-1.png",
            description:
                "A bold throwback to classic pixel-era rebellion. Retro Punk blends neon grit with futuristic attitude. Perfect for collectors who appreciate cyber-nostalgia.",
            tags: [Categories.ART, Categories.PHOTOGRAPHY],
        },
        {
            title: "Hello Kitty",
            imageUrl:
                "https://nkxzkkeflihiwqdnydxw.supabase.co/storage/v1/object/public/seng513-bidchain/nft/nft-2.png",
            description:
                "A playful and energetic reimagining of an iconic character. Bright colors and soft textures bring this digital mascot to life. A charming mix of cute culture and modern artistry.",
            tags: [Categories.ART, Categories.PHOTOGRAPHY, Categories.VIDEO, Categories.GAMING],
        },
        {
            title: "Green Goblin",
            imageUrl:
                "https://nkxzkkeflihiwqdnydxw.supabase.co/storage/v1/object/public/seng513-bidchain/nft/nft-3.png",
            description:
                "An eerie creature lurking in a world of shadows and strange light. Green Goblin captures the balance between mischief and menace. A must-have for fans of dark fantasy imagery.",
            tags: [Categories.ART, Categories.PHOTOGRAPHY, Categories.SPORT],
        },
        {
            title: "Princess Zelda",
            imageUrl:
                "https://nkxzkkeflihiwqdnydxw.supabase.co/storage/v1/object/public/seng513-bidchain/nft/nft-4.png",
            description:
                "A royal figure bathed in magical glow and heroic charm. Princess Zelda stands as a symbol of courage and wisdom across realms. This piece blends fantasy, elegance, and adventure.",
            tags: [Categories.SPORT, Categories.PHOTOGRAPHY, Categories.ART, Categories.MUSIC],
        },
        {
            title: "Cyber Robot",
            imageUrl:
                "https://nkxzkkeflihiwqdnydxw.supabase.co/storage/v1/object/public/seng513-bidchain/nft/nft-5.png",
            description:
                "A futuristic guardian forged from chrome and neon circuitry. Cyber Robot showcases a seamless fusion of technology and artistry. A striking piece for sci-fi enthusiasts.",
            tags: [Categories.ART, Categories.PHOTOGRAPHY],
        },
        {
            title: "Astroworld",
            imageUrl:
                "https://nkxzkkeflihiwqdnydxw.supabase.co/storage/v1/object/public/seng513-bidchain/nft/nft-6.png",
            description:
                "A cosmic visual experience inspired by sound, color, and outer-space imagination. Astroworld pulls viewers into an otherworldly dreamscape. A celebration of creativity across galaxies.",
            tags: [Categories.MUSIC, Categories.GAMING],
        },
        {
            title: "Slim Reaper",
            imageUrl:
                "https://nkxzkkeflihiwqdnydxw.supabase.co/storage/v1/object/public/seng513-bidchain/nft/nft-7.png",
            description:
                "A haunting warrior drifting between dimensions. Slim Reaper blends ethereal style with intense character design. A chilling yet captivating addition to any digital collection.",
            tags: [Categories.GAMING, Categories.PHOTOGRAPHY],
        },
        {
            title: "Slim Shady",
            imageUrl:
                "https://nkxzkkeflihiwqdnydxw.supabase.co/storage/v1/object/public/seng513-bidchain/nft/nft-8.png",
            description:
                "A fierce attitude wrapped in bold color and raw expression. Slim Shady embodies rebellion, rhythm, and unapologetic style. Perfect for collectors who vibe with iconic energy.",
            tags: [Categories.SPORT, Categories.VIDEO],
        },
        {
            title: "Donald the Pigeon",
            imageUrl:
                "https://nkxzkkeflihiwqdnydxw.supabase.co/storage/v1/object/public/seng513-bidchain/nft/nft-9.png",
            description:
                "A surprisingly majestic pigeon with a personality larger than life. Donald blends humor, charm, and urban storytelling. A quirky masterpiece for collectors who appreciate character-driven art.",
            tags: [Categories.MUSIC, Categories.PHOTOGRAPHY],
        },
    ];



    const createdNFTs: NFT[] = [];
    let imageIndex = 0;

    for (const artist of artists) {
        for (let i = 0; i < 5; i++) {
            const nft = await prisma.nFT.create({
                data: {
                    title: nftImages[i].title,
                    description: nftImages[i].description,
                    imageUrl: nftImages[i].imageUrl,
                    creatorId: artist.id,
                    tags: nftImages[i].tags,
                },
            });

            createdNFTs.push(nft);
            imageIndex++;
        }
    }

    console.log(`✅ Created ${createdNFTs.length} NFTs`);

    const auctions: Auction[] = [];

    for (let i = 0; i < createdNFTs.length; i++) {
        const nft = createdNFTs[i];
        const isActive = i % 2 === 0;

        const auction = await prisma.auction.create({
            data: {
                nftId: nft.id,
                startPrice: 1 + i * 0.25,
                currentPrice: 1 + i * 0.25,
                startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
                endTime: isActive
                    ? new Date(Date.now() + 2 * 60 * 60 * 1000)
                    : new Date(Date.now() - 1 * 60 * 60 * 1000),
                isActive,
            },
        });

        auctions.push(auction);
    }

    console.log(`✅ Created ${auctions.length} auctions`);

    for (const auction of auctions) {
        if (collectors.length === 0) break;

        const randomCollector =
            collectors[Math.floor(Math.random() * collectors.length)];

        await prisma.bid.createMany({
            data: [
                {
                    amount: auction.startPrice + 0.5,
                    auctionId: auction.id,
                    bidderId: randomCollector.id,
                },
                {
                    amount: auction.startPrice + 1.0,
                    auctionId: auction.id,
                    bidderId: randomCollector.id,
                },
            ],
        });
    }

    console.log('✅ Bids created');
    console.log('🌱 Database seeded successfully!');
}

main()
    .catch(async (e) => {
        console.error('❌ Seed error:', e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
