import React from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    Avatar,
    Typography,
    Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { NFT } from '../types/nft';
import './NFTCard.css';

interface NFTCardProps {
    nft: NFT;
    onClick?: (id: string) => void;
}

export function NFTCard({ nft, onClick }: Readonly<NFTCardProps>) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick(nft.id);
        } else {
            navigate(`/nft/${nft.id}`);
        }
    };

    return (
        <Card
            className="nft-card"
            onClick={handleClick}
            sx={{
                borderRadius: '20px',
                overflow: 'hidden',
                backgroundColor: '#2b2b2b',
            }}
        >
            <CardMedia
                component="img"
                image={nft.imageUrl || '/bored-ape.png'}
                alt={nft.name}
                className="nft-image"
            />

            <CardContent className="nft-card-content">
                <Typography
                    variant="h5"
                    className="nft-name"
                    fontFamily="Work Sans"
                    fontWeight="600"
                >
                    {nft.name}
                </Typography>

                <Box className="nft-creator">
                    <Avatar
                        src={nft.creatorAvatarUrl}
                        alt={nft.creatorName}
                        className="nft-avatar"
                    />
                    <Typography
                        variant="body2"
                        className="nft-creator-name"
                        fontFamily="Space Mono"
                    >
                        {nft.creatorName}
                    </Typography>
                </Box>

                <Box className="nft-price">
                    <Typography
                        variant="body2"
                        className="nft-price-label"
                        fontFamily="Space Mono"
                    >
                        Value
                    </Typography>
                    <Typography
                        variant="body1"
                        className="nft-price-value"
                        fontFamily="Space Mono"
                    >
                        {nft.price}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}
