import React, { useState, JSX, useEffect } from 'react';
import { Box, Typography, Button, Avatar, Tabs, Tab, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { NFTCard } from '../components/NFTCard';
import type { NFT } from '../types/nft';
import AddIcon from '@mui/icons-material/Add';
import './ArtistPage.css';
import { useAuth } from '../context/AuthContext';
import { GRAPHQL_ENDPOINT } from '../config/env';
import { Email } from '@mui/icons-material';
import { FETCH_USER } from '../graphql/queries/userQueries';
import { useOwnedNfts } from '../hooks/useOwnedNfts';
import { useBidNfts } from '../hooks/useWatchingNfts';
import { useCreatedNfts } from '../hooks/useCreatedNfts';

export function ArtistPage(): JSX.Element {
    const { user } = useAuth(); 
    const [activeTab, setActiveTab] = useState(0);
    const [userInfo, setUserInfo] = useState<any>(null);
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await fetch(GRAPHQL_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: FETCH_USER,
                        variables: {
                            id: Number(user?.id),
                        },
                    }),
                });
                const result = await response.json();
                setUserInfo(result.data.user);
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        }
        if (user?.email) fetchUser();
    }, [user]);   

    const { nfts: ownedNfts, loading: ownedLoading} = useOwnedNfts(Number(user?.id));
    const { nfts: watchingNfts,loading: watchingLoading} = useBidNfts(Number(user?.id));
    const { nfts: createdNfts,loading: createdLoading} = useCreatedNfts(Number(user?.id));



    return (
        <Box className="artist-page">
            {/* Profile Section */}
            <Box className="artist-header">
                <Box
                    className="artist-banner"
                    sx={{
                        backgroundImage: `url(${userInfo?.bannerPicture})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />

                <Box className="artist-info-container">
                    <Avatar
                        src={userInfo?.avatarPicture}
                        alt="TheArtist"
                        className="artist-avatar"
                        sx={{ 
                            width: 120, 
                            height: 120 ,
                            border: "4px solid #1a1a1a",
                            borderRadius: "12px",
                            flexShrink:0
                        }}
                    />

                    <Box className="artist-details">
                        <Typography variant="h3" className="artist-name">
                            {userInfo?.name || 'Artist Name'}
                        </Typography>

                        <Typography variant="body2" className="artist-bio">
                            <strong>Bio</strong>
                            <br />
                            {userInfo?.description || ''}
                        </Typography>
                    </Box>

                    <Box className="artist-actions">
                        <Button
                            component={Link}
                            to="/createNft"
                            variant="contained"
                            startIcon={<AddIcon />}
                            className="plus-button"
                            sx={{
                                backgroundColor:" #a259ff",
                                color: "#ffffff",
                                borderRadius: "999px",
                                padding: "10px 16px",
                                minWidth: "auto",
                                ":hover": " #8f45e3"
                            }}  
                        >
                            Create
                        </Button>
                        <Button
                            component={Link}
                            to="/editprofile"
                            variant="contained"
                            className="edit-button"
                            sx={{
                                backgroundColor:" #a259ff",
                                color: "#ffffff",
                                borderRadius: "999px",
                                padding: "10px 20px",
                                fontWeight: "500",
                                ":hover": " #8f45e3"
                            }}  
                        >
                            Edit Profile
                        </Button>
                    </Box>
                </Box>
            </Box>

            <Box className="artist-tabs-container">
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    className="artist-tabs"
                    sx={{
                        minHeight: "auto",
                        color:"#aaa",
                        fontWeight:500,
                        padding: "16px 24px",
                        textTransform: "capitalize",
                        "& .MuiTab-root": {
                        color: "#aaa",
                        fontWeight: 500,
                        padding: "16px 24px",
                        textTransform: "capitalize",
                        minHeight: "auto",
                        },
                        "& .MuiTab-root.Mui-selected": {
                            color: "#ffffff",
                        },
                        "& .MuiTabs-indicator": {
                            backgroundColor: "#a259ff",
                            height: 3,
                        },
                        "@media (max-width: 480px)": {
                            height: "75px",
                        },
                    }}
                >
                    <Tab label="Created" />
                    <Tab label="Owned" />
                    <Tab label="Watching" />
                </Tabs>
            </Box>

            <Box className="collector-nfts">
                {activeTab === 0 && (
                <Box>
                    {createdLoading ? (
                    <Box className="collector-loading">
                        <CircularProgress />
                    </Box>
                    ) : createdNfts.length === 0 ? (
                    <Typography sx={{color:"#fff"}}>
                        You havent created any NFTS yet.
                    </Typography>
                    ) : (
                    <Box className="nft-grid">
                        {createdNfts.map((nft: NFT) => (
                        <Box key={nft.id} className="nft-grid-item">
                            <NFTCard nft={nft} />
                        </Box>
                        ))}
                    </Box>
                    )}
                </Box>
                )}

                {activeTab === 1 && (
                <Box>
                    {ownedLoading ? (
                    <Box className="collector-loading">
                        <CircularProgress />
                    </Box>
                    ) : ownedNfts.length === 0 ? (
                    <Typography sx={{color:"#fff"}}>
                        You don’t own any NFTs yet.
                    </Typography>
                    ) : (
                    <Box className="nft-grid">
                        {ownedNfts.map((nft: NFT) => (
                        <Box key={nft.id} className="nft-grid-item">
                            <NFTCard nft={nft} />
                        </Box>
                        ))}
                    </Box>
                    )}
                </Box>
                )}

                {activeTab === 2 && (
                <Box>
                    {watchingLoading ? (
                    <Box className="collector-loading">
                        <CircularProgress />
                    </Box>
                    ) : watchingNfts.length === 0 ? (
                    <Typography sx={{color:"#fff"}}>
                        You’re not watching any auctions yet. Place a bid to start watching.
                    </Typography>
                    ) : (
                    <Box className="nft-grid">
                        {watchingNfts.map((nft: NFT) => (
                        <Box key={nft.id} className="nft-grid-item">
                            <NFTCard nft={nft} />
                        </Box>
                        ))}
                    </Box>
                    )}
                </Box>
                )}
            </Box>

                                
        </Box>
    );
}
