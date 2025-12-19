import React, { useState, JSX, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  ThemeProvider,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Chip,
  Modal,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useParams } from 'react-router-dom';
import { NFTCard } from '../components/NFTCard';
import type { NFT } from '../types/nft';
import type { Auction } from '../types/auction';
import { createTheme } from '@mui/material/styles';
import './NFTPage.css';
import { ArtistLink } from '../components/artistLink';
import { nftQueries } from '../graphql/queries/nftQueries';
import { auctionQueries } from '../graphql/queries/auctionQueries';
import { useAuctionSocket } from '../hooks/useAuctionSocket';
import { useCountdown } from '../hooks/useCountdown';
import { useAuth } from '../context/AuthContext';
import { bidMutations } from '../graphql/mutations/bidMutations';
import { toast } from 'react-toastify';

export function NFTPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [nft, setNft] = useState<NFT | null>(null);
  const [nftList, setNftList] = useState<NFT[]>([]);
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [placingBid, setPlacingBid] = useState(false);

  // Socket.IO for real-time updates - convert auction.id to number
  const { currentPrice } = useAuctionSocket(
    auction ? Number(auction.id) : null
  );

  // Countdown timer
  const timeRemaining = useCountdown(auction?.endTime ?? null);

  useEffect(() => {
    async function loadNFTPageData() {
      if (!id) return;

      try {
        setLoading(true);

        const nftData = await nftQueries.getNFTById(id);
        setNft(nftData);

        try {
          const auctionData = await auctionQueries.getAuctionByNftId(id);
          setAuction(auctionData);
        } catch (auctionErr) {
          setAuction(null);
        }

        try {
          const creatorNftList = await nftQueries.getNFTsByCreatorId(
            nftData.creator.id
          );
          const filteredList = creatorNftList.filter((n) => n.id !== id);
          setNftList(filteredList);
        } catch (nftErr) {
          setNftList([]);
        }
      } catch (e) {
        setError(
          e instanceof Error ? e.message : 'Failed to load NFT & Auction data'
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadNFTPageData();
    }
  }, [id]);

  // Update current price when socket emits new bid
  useEffect(() => {
    if (currentPrice !== null && auction) {
      setAuction((prev) => (prev ? { ...prev, currentPrice } : null));
    }
  }, [currentPrice, auction?.id]);

  const handlePlaceBid = async () => {
    if (!auction || !user || !bidAmount) {
      toast.error('Please enter a valid bid amount');
      return;
    }

    const amount = parseFloat(bidAmount);

    if (isNaN(amount) || amount <= auction.currentPrice) {
      toast.error(
        `Bid must be higher than current price of ${auction.currentPrice} ETH`
      );
      return;
    }

    try {
      setPlacingBid(true);

      await bidMutations.placeBid({
        auctionId: Number(auction.id),
        bidderId: Number(user.id),
        amount,
      });

      setBidAmount('');
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'Failed to place bid. Please try again.'
      );
    } finally {
      setPlacingBid(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !nft) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="error">{error || 'NFT not found'}</Typography>
      </Box>
    );
  }

  const theme = createTheme({
    typography: {
      fontFamily: '"Work Sans", "Space Mono", sans-serif',
    },
  });

  const timeUnits = [
    { value: timeRemaining.hours, label: 'Hours' },
    { value: timeRemaining.minutes, label: 'Minutes' },
    { value: timeRemaining.seconds, label: 'Seconds' },
  ];

  const handleImageClick = () => {
    setImageModalOpen(true);
  };

  const handleCloseModal = () => {
    setImageModalOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className="nft-page" sx={{ fontFamily: 'Work Sans' }}>
        <Box
          className="nft-banner"
          onClick={handleImageClick}
          sx={{
            backgroundImage: `url(${nft.imageUrl || '/nft-placeholder.png'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            cursor: 'pointer',
            position: 'relative',
            '&:hover::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
          }}
        />

        {/* Image Modal */}
        <Modal
          open={imageModalOpen}
          onClose={handleCloseModal}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              outline: 'none',
            }}
          >
            <IconButton
              onClick={handleCloseModal}
              sx={{
                position: 'absolute',
                top: -50,
                right: 0,
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box
              component="img"
              src={nft.imageUrl || '/nft-placeholder.png'}
              alt={nft.name}
              sx={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                borderRadius: '8px',
              }}
            />
          </Box>
        </Modal>

        <Box className="info-and-bid-container">
          <Box className="info-container">
            <Typography variant="h3" className="nft-title" fontWeight="600">
              {nft.name}
            </Typography>
            <Box className="artist-info">
              <Typography
                variant="body1"
                className="artist-label"
                fontWeight="600"
                fontFamily="Space Mono"
                color="#3b3b3b"
                paddingBottom="8px"
              >
                Created By
              </Typography>
              <ArtistLink
                artistName={nft.creatorName}
                artistId={nft.creator.id}
                avatarUrl={nft.creatorAvatarUrl}
              />
            </Box>
            <Box className="description-container">
              <Typography
                className="description-label"
                sx={{
                  color: '#3b3b3b',
                  fontFamily: 'Space Mono',
                  fontWeight: '600',
                  paddingBottom: '8px',
                }}
              >
                Description
              </Typography>
              <Typography className="nft-description">
                {nft.description || 'No description provided'}
              </Typography>
            </Box>
            <Typography
              className="tags-label"
              sx={{
                color: '#3b3b3b',
                fontFamily: 'Space Mono',
                fontWeight: '600',
              }}
            >
              Tags
            </Typography>
            <Box
              className="tags-container"
              sx={{
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap',
                mt: 1,
              }}
            >
              {nft.tags && nft.tags.length > 0 ? (
                nft.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    sx={{
                      backgroundColor: '#3b3b3b',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                ))
              ) : (
                <Typography>No tags</Typography>
              )}
            </Box>
          </Box>

          {auction && (
            <Box className="bid-container">
              <Card
                className="bid-card"
                sx={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  backgroundColor: '#3b3b3b',
                }}
              >
                <CardContent 
                  className="card-content"
                  sx={{
                    padding:"30px",
                    "@media (max-width: 480px)": {
                      padding: "20px",
                    }
                  }}
                >
                  <Box className="countdown-container">
                    <Typography className="countdown-label">
                      {timeRemaining.isExpired
                        ? 'Auction ended'
                        : 'Auction ends in:'}
                    </Typography>
                    {!timeRemaining.isExpired && (
                      <Box className="timer-container">
                        {timeUnits.map((unit, index) => (
                          <React.Fragment key={unit.label}>
                            <Box
                              className={`${unit.label.toLowerCase()}-container`}
                            >
                              <Typography
                                className={`${unit.label.toLowerCase()}-number`}
                              >
                                {String(unit.value).padStart(2, '0')}
                              </Typography>
                              <Typography
                                sx={{
                                  fontFamily: 'Space Mono',
                                  fontSize: '12px',
                                  color: '#ffffff',
                                  textTransform: 'capitalize',
                                }}
                              >
                                {unit.label}
                              </Typography>
                            </Box>
                            {index < timeUnits.length - 1 && (
                              <Typography className="time-separator">
                                :
                              </Typography>
                            )}
                          </React.Fragment>
                        ))}
                      </Box>
                    )}
                  </Box>
                  <Typography className="current-bid">
                    Current Bid : {auction.currentPrice.toFixed(2)} ETH
                  </Typography>
                  <CardActions 
                    className="bid-input-container"
                    sx={{
                      padding:0
                    }}
                  >
                    <Box className="input-box-container">
                      <input
                        placeholder="Bid Amount"
                        type="number"
                        step="0.01"
                        min={auction.currentPrice + 0.01}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        disabled={timeRemaining.isExpired || !user}
                      />
                      <Typography className="bid-currency">ETH</Typography>
                    </Box>
                    <Button
                      className="place-bid-button"
                      sx={{
                        backgroundColor: "#a259ff",
                        color: "#ffffff",
                        borderRadius: "20px",
                        padding: "16px 50px",
                        fontFamily: "'Work Sans', sans-serif",
                        fontSize: "16px",
                        fontWeight: 600,
                        textTransform: "none",
                        width: "100%",

                        "&:hover": {
                          backgroundColor: "#8a3fff",
                        },
                        "@media (max-width: 480px)": {
                          padding: "14px 40px",
                          fontSize: "14px"
                        }
                      }}
                      onClick={handlePlaceBid}
                      disabled={
                        timeRemaining.isExpired ||
                        !user ||
                        placingBid ||
                        !bidAmount
                      }
                    >
                      {placingBid
                        ? 'Placing Bid...'
                        : timeRemaining.isExpired
                          ? 'Auction Ended'
                          : !user
                            ? 'Login to Bid'
                            : 'Place Bid'}
                    </Button>
                  </CardActions>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>

        <Box className="more-nfts-container" sx={{ mt: 4 }}>
          <Typography
            variant="h4"
            sx={{
              mb: 3,
              fontWeight: 600,
              fontSize: { xs: '24px', sm: '28px', md: '34px' },
              color: '#ffffff',
            }}
          >
            More from {nft.creatorName}
          </Typography>
          {nftList.length > 0 ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(auto-fill, minmax(250px, 1fr))',
                  sm: 'repeat(auto-fill, minmax(280px, 1fr))',
                  md: 'repeat(auto-fill, minmax(300px, 1fr))',
                },
                gap: { xs: 2, sm: 2.5, md: 3 },
              }}
            >
              {nftList.map((nftItem) => (
                <NFTCard key={nftItem.id} nft={nftItem} />
              ))}
            </Box>
          ) : (
            <Typography
              sx={{
                color: '#858584',
                textAlign: 'center',
                py: 4,
              }}
            >
              No other NFTs from this artist yet.
            </Typography>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
