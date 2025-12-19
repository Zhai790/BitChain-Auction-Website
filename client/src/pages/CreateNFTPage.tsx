import React, { useState, JSX } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Chip,
  FormControl,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import './CreateNFTPage.css';
import { nftMutations } from '../graphql/mutations/nftMutations';
import { auctionMutations } from '../graphql/mutations/auctionMutations';
import { useUploadImage } from '../hooks/useUploadImage';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Define the valid categories from your backend enum
const VALID_CATEGORIES = [
  'ART',
  'GAMING',
  'MUSIC',
  'PHOTOGRAPHY',
  'VIDEO',
  'SPORT',
] as const;
type CategoryType = (typeof VALID_CATEGORIES)[number];

export function CreateNFTPage(): JSX.Element {
  const [nftName, setNftName] = useState('');
  const [price, setPrice] = useState('');
  const [auctionDuration, setAuctionDuration] = useState('1 hour');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tags, setTags] = useState<CategoryType[]>([]);
  const [creating, setCreating] = useState(false);

  const { uploadImage, uploading } = useUploadImage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategorySelect = (category: CategoryType) => {
    if (!tags.includes(category)) {
      setTags([...tags, category]);
    }
  };

  const handleDeleteTag = (tagToDelete: CategoryType) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleCreate = async () => {
    console.log(
      `user: ${user}, img: ${imageFile}, name: ${nftName}, tags: ${tags}`
    );
    if (
      !imageFile ||
      !user ||
      !nftName ||
      tags.length === 0 ||
      !price ||
      !auctionDuration
    ) {
      console.error('Missing required fields');
      toast.error('Please provide all required fields');
      return;
    }

    try {
      setCreating(true);

      // Upload image to Supabase
      const imageUrl = await uploadImage(imageFile, 'nft', String(user.id));

      // Create NFT in database
      const newNFT = await nftMutations.createNFT({
        title: nftName,
        description,
        imageUrl,
        creatorId: String(user.id),
        tags: tags,
      });

      console.log('NFT created successfully:', newNFT);

      // Calculate auction duration in milliseconds
      const durationMap: { [key: string]: number } = {
        '1 hour': 1,
        '4 hours': 4,
        '8 hours': 8,
        '12 hours': 12,
      };

      const hours = durationMap[auctionDuration] || 1;
      const now = new Date();
      const endTime = new Date(now.getTime() + hours * 60 * 60 * 1000);

      // Create auction for the NFT
      await auctionMutations.createAuction({
        nftId: newNFT.id,
        startPrice: parseFloat(price),
        startTime: now,
        endTime: endTime,
      });

      console.log('Auction created successfully');

      // Navigate to the new NFT page
      navigate(`/nft/${newNFT.id}`);
    } catch (err) {
      console.error('Failed to create NFT or Auction:', err);
      toast.error('Failed to create NFT. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleCancel = () => {
    setNftName('');
    setPrice('');
    setAuctionDuration('1 day');
    setDescription('');
    setImageFile(null);
    setImagePreview(null);
    setTags([]);
  };

  return (
    <Box className="create-nft-page">
      {/* Banner Section */}
      <Box
        className="create-nft-banner"
        sx={{
          backgroundImage: 'url(/bored-ape.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Content Section */}
      <Box className="create-nft-content">
        <Typography 
          variant="h2" 
          className="create-nft-title"
          sx ={{
            "@media (max-width: 768px)": {
            fontSize: "24px",
            marginBottom: "24px",
          },
          }}
        >
          List Your NFT
        </Typography>

        {/* NFT Image Upload */}
        <Box className="nft-upload-section">
          <label htmlFor="nft-image-input" className="nft-upload-box">
            {imagePreview ? (
              <Box
                className="nft-image-preview"
                sx={{
                  backgroundImage: `url(${imagePreview})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  fontSize: "32px",
                  fontWeight:700,
                  marginBottom:"32px"
                }}
              />
            ) : (
              <Box className="upload-placeholder">
                <AddIcon sx={{ fontSize: 40, color: '#a259ff' }} />
              </Box>
            )}
          </label>
          <input
            id="nft-image-input"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </Box>

        {/* Form Fields */}
        <Box className="form-fields">
          {/* Item Name */}
          <Box className="form-group">
            <Typography variant="body1" className="form-label">
              Item Name<span className="required">*</span>
            </Typography>
            <Box className="form-field-wrapper">
              <TextField
                placeholder="NFT Name"
                value={nftName}
                onChange={(e) => setNftName(e.target.value)}
                variant="outlined"
                fullWidth
                className="form-input"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#1a1a1a",
                    color: "#ffffff",
                    borderRadius: "6px",
                    fontSize: "14px",
                    padding: "0", 
                    "& fieldset": {
                      borderColor: "#555",
                    },
                    "&:hover fieldset": {
                      borderColor: "#a259ff",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#a259ff",
                    },
                  },
                  "& .MuiInputBase-input": {
                    padding: "12px 16px",
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "#888",
                    opacity: 1,
                  },
                }}

              />
            </Box>
          </Box>

          {/* Price */}
          <Box className="form-group">
            <Typography variant="body1" className="form-label">
              Price<span className="required">*</span>
            </Typography>
            <Box className="form-field-wrapper">
              <TextField
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                variant="outlined"
                fullWidth
                type="number"
                className="form-input"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#1a1a1a",
                    color: "#ffffff",
                    borderRadius: "6px",
                    fontSize: "14px",
                    "& fieldset": { borderColor: "#555" },
                    "&:hover fieldset": { borderColor: "#a259ff" },
                    "&.Mui-focused fieldset": { borderColor: "#a259ff" },
                  },
                  "& .MuiInputBase-input": {
                    padding: "12px 16px",
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "#888",
                    opacity: 1,
                  },
                }}
              />
            </Box>
          </Box>

          {/* Auction Duration */}
          <Box className="form-group">
            <Typography variant="body1" className="form-label">
              Auction Duration<span className="required">*</span>
            </Typography>
            <Select
              value={auctionDuration}
              onChange={(e) => setAuctionDuration(e.target.value)}
              className="form-select"
              sx ={{
                backgroundColor: "#1a1a1a",
                color: "#ffffff",
                borderRadius: "6px",
                padding: "12px 16px",
                fontSize: "14px",
                border: "1px solid #555",

                "&:hover": {
                  borderColor: "#a259ff",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "& .MuiSvgIcon-root": {
                  color: "#888",
                },
                "& .MuiMenuItem-root": {
                  backgroundColor: "#2f2f2f",
                  color: "#ffffff",
                  fontSize: "14px",

                  "&:hover": {
                    backgroundColor: "#3f3f3f",
                  },

                  "&.Mui-selected": {
                    backgroundColor: "#a259ff",
                  },
                },
              }}
            >
              <MenuItem value="1 hour">1 hour</MenuItem>
              <MenuItem value="4 hours">4 hours</MenuItem>
              <MenuItem value="8 hours">8 hours</MenuItem>
              <MenuItem value="12 hours">12 hours</MenuItem>
            </Select>
          </Box>

          <Box className="form-group">
            <Typography variant="body1" className="form-label">
              Categories<span className="required">*</span>
            </Typography>
            <FormControl fullWidth>
              <Select
                value=""
                displayEmpty
                renderValue={() => 'Select categories'}
                className="form-input"
                sx={{
                  backgroundColor: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#a259ff',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#a259ff',
                  },
                }}
              >
                <MenuItem value="" disabled>
                  Select categories
                </MenuItem>
                {VALID_CATEGORIES.map((category) => (
                  <MenuItem
                    key={category}
                    value={category}
                    disabled={tags.includes(category)}
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleDeleteTag(tag)}
                  color="primary"
                  sx={{ backgroundColor: '#a259ff' }}
                />
              ))}
            </Box>
          </Box>

          <Box className="form-group">
            <Typography variant="body1" className="form-label">
              Description
            </Typography>
            <Box className="form-field-wrapper description">
              <TextField
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                className="form-input"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#1a1a1a",
                    color: "#ffffff",
                    borderRadius: "6px",
                    fontSize: "14px",
                    "& fieldset": { borderColor: "#555" },
                    "&:hover fieldset": { borderColor: "#a259ff" },
                    "&.Mui-focused fieldset": { borderColor: "#a259ff" },
                  },
                  "& .MuiInputBase-input": {
                    padding: "12px 16px",
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "#888",
                    opacity: 1,
                  },
                }}  
              />
            </Box>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box className="form-actions">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            className="create-button"
            onClick={handleCreate}
            disabled={uploading || creating}
            sx ={{
              backgroundColor: "#a259ff",
              color: "#ffffff",
              padding: "10px 28px",
              borderRadius: "999px",
              fontSize: "14px",
              fontWeight: 500,
              textTransform: "none",
              transition: "all 200ms ease",
              "&:hover": {
                backgroundColor: "#8f45e3",
                transform: "translateY(-2px)",
              },
              "&.Mui-disabled": {
                backgroundColor: "#a259ff55",
                color: "#ffffffaa",
                transform: "none",
              }
            }}
          >
            {uploading || creating ? 'Creating...' : 'Create'}
          </Button>
          <Button
            variant="contained"
            className="cancel-button"
            onClick={handleCancel}
            sx = {{
              backgroundColor: "#a259ff",
              color: "#ffffff",
              padding: "10px 28px",
              borderRadius: "999px",
              fontSize: "14px",
              fontWeight: 500,
              textTransform: "none",
              transition: "all 200ms ease",
              "&:hover": {
                backgroundColor: "#8f45e3",
                transform: "translateY(-2px)",
              },
              "&.Mui-disabled": {
                backgroundColor: "#a259ff55",
                color: "#ffffffaa",
                transform: "none",
              },
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
