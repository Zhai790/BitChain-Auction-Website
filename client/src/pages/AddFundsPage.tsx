import React, { useState, JSX } from 'react';
import './AddFundsPage.css';
import {
    Box,
    Typography,
    TextField,
    Button,
    ToggleButtonGroup,
    ToggleButton,
    CircularProgress,
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import { toast } from 'react-toastify';
import { useAddFunds } from '../hooks/useAddFunds';
import { useAuth } from '../context/AuthContext';


export function AddFundsPage(): JSX.Element {
    const { user, login,logout } = useAuth();
    const { addFunds, loading: addFundsLoading, error: addFundsError } = useAddFunds();
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'crypto'>('card');

    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    if (!user) {
        return (
            <Box className="addfunds-container center-message">
                <Typography color="#fff">
                    Please log in to access your wallet.
                </Typography>
            </Box>
        );
    }

    const currentBalance = user.walletBalance ?? 0;

    const darkInput = {
        '& .MuiOutlinedInput-root': {
            backgroundColor: '#1b1b1b',
            color: '#fff',
            borderRadius: 2,
            '& fieldset': { borderColor: '#444' },
            '&:hover fieldset': { borderColor: '#666' },
            '&.Mui-focused fieldset': { borderColor: '#a259ff' },
        },
        '& .MuiInputLabel-root': {
            color: '#bdbdbd',
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: '#e0e0e0',
        },
    };

   async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!user) {
            toast.error('User not logged in');
            return;
        }
        const reqAmount = Number(amount);
        if (Number.isNaN(reqAmount) || reqAmount <= 0) {
            toast.error('Enter a valid amount.');
            return;
        }
        if (paymentMethod === 'card') {
            const trimmedCard = cardNumber.replace(/\s+/g, '');

            if (trimmedCard.length > 16 || trimmedCard.length < 8) {
                toast.error('Card number must be 8-16 digits.');
                return;
            }

            if (!/^\d{2}\/\d{2}$/.test(expiry)) {
                toast.error('Expiry must be in MM/YY format.');
                return;
            }

            if (cvc.length < 3 || cvc.length > 4) {
                toast.error('CVC must be 3 or 4 digits.');
                return;
        }
    }

        const numericUserId = Number(user.id);

        try {
            const updatedUser = await addFunds(numericUserId, reqAmount);
            updatedUser.role = user.role;
            login(updatedUser);

            toast.success(`Added ${reqAmount.toFixed(2)} ETH to wallet.`);
            setAmount('');
        } catch (err: any) {
            console.error('Add funds error:', err);

            if (err.message?.includes('User not found')) {
                toast.error('Your account no longer exists. Please log in again.');
                logout();
            } else {
                toast.error(err.message || 'Failed to add funds.');
            }
        }
    }

    return (
        <Box className="addfunds-container">
            <Box className="addfunds-card">
                <Typography
                    sx={{
                        fontSize: '1.8rem',
                        fontWeight: 700,
                        mb: 1,
                        color: '#fff',
                    }}
                >
                    Add Funds
                </Typography>

                <Typography sx={{ color: '#cfcfcf', mb: 3 }}>
                    Top up your BidChain wallet to place bids on auctions.
                </Typography>
                <Typography
                    sx={{
                        color: '#b3b3b3',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                    }}
                >
                    Current Wallet Balance
                </Typography>

                <Typography
                    sx={{
                        fontSize: '2.2rem',
                        fontWeight: 700,
                        mt: 0.3,
                        mb: 3,
                        color: '#fff',
                    }}
                >
                    {currentBalance.toFixed(2)} ETH
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        type="number"
                        fullWidth
                        sx={{ mb: 2, ...darkInput }}
                    />

                    <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                        {[10, 25, 50, 100].map((v) => (
                            <Button
                                key={v}
                                onClick={() => setAmount(String(v))}
                                sx={{
                                    textTransform: 'none',
                                    borderRadius: 999,
                                    px: 2,
                                    color: '#fff',
                                    border: '1px solid #555',
                                    fontSize: '0.8rem',
                                    '&:hover': {
                                        backgroundColor:
                                            'rgba(162,89,255,0.15)',
                                        borderColor: '#a259ff',
                                    },
                                }}
                                variant="outlined"
                            >
                                +{v}
                            </Button>
                        ))}
                    </Box>
                    <ToggleButtonGroup
                        value={paymentMethod}
                        exclusive
                        onChange={(_, val) => val && setPaymentMethod(val)}
                        sx={{ mb: 3 }}
                    >
                        <ToggleButton
                            value="card"
                            sx={{
                                color: '#fff',
                                textTransform: 'none',
                                '&.Mui-selected': {
                                    backgroundColor: '#a259ff',
                                    color: '#fff',
                                },
                            }}
                        >
                            <CreditCardIcon sx={{ mr: 0.5 }} /> Card
                        </ToggleButton>

                        <ToggleButton
                            value="bank"
                            sx={{
                                color: '#fff',
                                '&.Mui-selected': {
                                    backgroundColor: '#a259ff',
                                },
                            }}
                        >
                            <AccountBalanceIcon sx={{ mr: 0.5 }} /> Bank
                            Transfer
                        </ToggleButton>

                        <ToggleButton
                            value="crypto"
                            sx={{
                                color: '#fff',
                                '&.Mui-selected': {
                                    backgroundColor: '#a259ff',
                                },
                            }}
                        >
                            <CurrencyBitcoinIcon sx={{ mr: 0.5 }} /> Crypto
                        </ToggleButton>
                    </ToggleButtonGroup>

                    {/* Card Fields (visible only when card selected) */}
                    {paymentMethod === 'card' && (
                        <Box sx={{ mb: 3 }}>
                            <TextField
                                fullWidth
                                label="Card number"
                                value={cardNumber}
                                onChange={(e) =>
                                    setCardNumber(e.target.value)
                                }
                                sx={{ mb: 2, ...darkInput }}
                            />
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    label="Expiry (MM/YY)"
                                    value={expiry}
                                    onChange={(e) =>
                                        setExpiry(e.target.value)
                                    }
                                    sx={{ flex: 1, ...darkInput }}
                                />
                                <TextField
                                    label="CVC"
                                    value={cvc}
                                    onChange={(e) => setCvc(e.target.value)}
                                    sx={{ width: 140, ...darkInput }}
                                />
                            </Box>
                        </Box>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        disabled={addFundsLoading}
                        sx={{
                            backgroundColor: '#a259ff',
                            color: '#fff',
                            py: 1.4,
                            fontSize: '1rem',
                            fontWeight: 600,
                            borderRadius: 999,
                            boxShadow: '0px 10px 30px rgba(162,89,255,0.5)',
                            '&:hover': {
                                backgroundColor: '#8c45e6',
                            },
                            mt: 3,
                        }}
                    >
                        {addFundsLoading ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : (
                            'Add funds'
                        )}
                    </Button>

                    <Typography
                        variant="caption"
                        sx={{ color: '#b3b3b3', display: 'block', mt: 2 }}
                    >
                        This is a simulated payment flow. No real card charges are made.
                    </Typography>
                </form>
            </Box>
        </Box>
    );
}
