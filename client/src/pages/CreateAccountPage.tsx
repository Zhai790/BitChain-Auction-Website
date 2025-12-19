import React, { useState, JSX } from 'react';
import {
    TextField,
    Button,
    Box,
    Typography,
    InputAdornment,
    Select,
    MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { NFTCard } from '../components/NFTCard';
import type { NFT } from '../types/nft';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '../context/AuthContext';
import { GRAPHQL_ENDPOINT } from '../config/env';
import { REGISTER_USER } from '../graphql/mutations/userMutation';

export function CreateAccountPage(): JSX.Element {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!username || !email || !password || !confirmPassword || !userType) {
            setError('All fields are required');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(GRAPHQL_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: REGISTER_USER,
                    variables: {
                        data: {
                            name: username,
                            email: email,
                            password: password,
                            role:
                                userType.toUpperCase() === 'COLLECTOR'
                                    ? 'COLLECTOR'
                                    : 'ARTIST',
                            avatarPicture: '',
                            bannerPicture: '',
                        },
                    },
                }),
            });

            const result = await response.json();

            if (result.errors) {
                setError(
                    result.errors[0].message || 'Failed to create account'
                );
                setLoading(false);
                return;
            }

            if (result.data?.register) {
                console.log(
                    'Account created successfully:',
                    result.data.register
                );
                const user = result.data.register;

                // Use auth context to login
                login(user);

                // Reset form
                setUsername('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setUserType('');

                // Redirect based on role
                if (user.role === 'ARTIST') {
                    navigate('/artist');
                } else if (user.role === 'COLLECTOR') {
                    navigate('/collector');
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="login-page">
            {/* Left: NFT showcase */}
            <Box className="login-art">
                <NFTCard
                    nft={
                        {
                            id: 'sample-1',
                            name: 'Featured NFT',
                            imageUrl: '/bored-ape.png',
                            creatorAvatarUrl: '/avatar.png',
                            creatorName: 'Creator',
                            price: '1.2 ETH',
                        } as unknown as NFT
                    }
                />
            </Box>

            {/* Right: create account form */}
            <Box
                component="form"
                className="login-form"
                onSubmit={handleCreate}
            >
                <Typography
                    variant="h2"
                    component="h1"
                    gutterBottom
                    sx={{ fontWeight: 700 }}
                >
                    Create Account
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Welcome! Enter your details and start creating, collecting
                    and selling NFTs.
                </Typography>

                {error && (
                    <Box
                        sx={{
                            color: '#ff6b6b',
                            marginBottom: '16px',
                            padding: '10px',
                            backgroundColor: 'rgba(255, 107, 107, 0.1)',
                            borderRadius: '4px',
                        }}
                    >
                        {error}
                    </Box>
                )}

                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonOutlineIcon />
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailOutlinedIcon />
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockOutlinedIcon />
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                <TextField
                    label="Confirm Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockOutlinedIcon />
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                <Select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    displayEmpty
                    fullWidth
                    variant="outlined"
                    sx={{
                        borderRadius: '999px',
                        backgroundColor: 'transparent',
                        color: '#fff',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#555',
                            borderRadius: '999px',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#a259ff',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#a259ff',
                        },
                        '& .MuiSvgIcon-root': {
                            color: '#aaa',
                        },
                    }}
                >
                    <MenuItem value="" disabled>
                        Choose Collector/Artist
                    </MenuItem>
                    <MenuItem value="collector">Collector</MenuItem>
                    <MenuItem value="artist">Artist</MenuItem>
                </Select>

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
            </Box>
        </Box>
    );
}
