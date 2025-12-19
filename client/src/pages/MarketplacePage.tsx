import React, { JSX, useEffect } from 'react';
import './MarketplacePage.css';
import { TextField, InputAdornment, IconButton, MenuItem, FormControl, InputLabel, Select, Switch, FormControlLabel } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { NFTCard } from '../components/NFTCard';
import type { NFT } from '../types/nft';
import { useState } from 'react';
import { nftQueries } from '../graphql/queries/nftQueries';
import { CATEGORIES } from '../data/category';


export function MarketplacePage(): JSX.Element {
    const [searchText, setSearchText] = useState('');
    const [nfts, setNfts] = useState<NFT[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const searchParams = new URLSearchParams(location.search); 
    const initialCategory = searchParams.get('category') || '';
    const [category, setCategory] = useState(initialCategory);
    const [isAlive, setIsAlive] = useState(true);

    useEffect(() => {
        async function loadNFTs() {
            try {
                setLoading(true);
                setError(null);
                const fetched = await nftQueries.getAllNFTs();
                // console.log(fetched);   
                setNfts(fetched);
            } catch (e) {
                console.error(e);
                setError('Failed to load NFTs');
            } finally {
                setLoading(false);
            }
        }

        loadNFTs();
    }, []);

    const filteredNFTs = nfts.filter((nft) =>{
        const matchesSearch = nft.name.toLowerCase().includes(searchText.toLowerCase());
        const matchesCategory =category === '' || nft.tags?.some((tag) => tag.toUpperCase() === category.toUpperCase());
        const mathchesIsLive = !isAlive || nft.isActive;
        return matchesSearch && matchesCategory && mathchesIsLive;
    }
    );

    return (
        <main className="marketplace-page">
            <section className="hero-marketplace">
                <div className="hero-top-marketplace">
                    <h1 className="hero-title-marketplace">
                        Browse Marketplace
                    </h1>
                    <p className="hero-sub-marketplace">
                        Browse through more than 50k NFTs on the NFT
                        Marketplace.
                    </p>
                    <div className='wrap-search-filter'>
                    <div className="search-bar" style={{ flexGrow: 1 }}>
                        <TextField
                            placeholder="Search your favourite NFTs"
                            variant="outlined"
                            fullWidth
                            className="search-field"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#2f2f2f',
                                    color: '#fff',
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#a259ff',
                                    },
                                },
                                '& .MuiSvgIcon-root': {
                                    color: '#cccccc',
                                },
                            }}
                            onChange={(e) => setSearchText(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton aria-label="search">
                                            <SearchIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                        <div className='filter-menu'>
                            <FormControl fullWidth className="form-control">
                            <InputLabel>Category</InputLabel>
                            <Select
                                label="Category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <MenuItem value="">All</MenuItem>

                                {CATEGORIES.map((cat) => (
                                    <MenuItem key={cat.title} value={cat.title}>
                                        {cat.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        </div>
                    </div>
                </div>
                <FormControlLabel
                    control={
                    <Switch
                        checked={isAlive}
                        onChange={(e) => setIsAlive(e.target.checked)}
                        color="primary"
                    />
                    }
                    label="Live auctions only"
                    sx={{ color: '#fff', marginLeft: 2 }}
                />
            </section>
            <section className="nft-items">
                {filteredNFTs.map((nft) => (
                    <NFTCard key={nft.id} nft={nft} />
                ))}
            </section>
        </main>
    );
}
