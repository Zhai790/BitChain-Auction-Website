import React, { useState, useRef, ChangeEvent, JSX, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Avatar,
    TextField,
    IconButton,
    CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import './EditProfilePage.css';

import { useUploadImage } from '../hooks/useUploadImage';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { GRAPHQL_ENDPOINT } from '../config/env';
import { UPDATE_USER } from '../graphql/mutations/userMutation';
import { FETCH_USER } from '../graphql/queries/userQueries';


async function updateUserRequest(id: string, data: any) {
    const res = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: UPDATE_USER,
            variables: { id, data },
        }),
    });

    const json = await res.json();
    if (json.errors) {
        throw new Error(json.errors[0].message);
    }

    return json.data.updateUser;
}

export function EditProfilePage(): JSX.Element {
    const { user, login } = useAuth();
    const role = user?.role;
    const [username, setUsername] = useState(user?.name);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [email, setEmail] = useState(user?.email);
    const [biography, setBiography] = useState(user?.description ?? '');
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    // Stored URLs from backend
    const [avatarUrl, setAvatarUrl] = useState<string | null>(
        user?.avatarPicture ?? null
    );
    const [bannerUrl, setBannerUrl] = useState<string | null>(
        user?.bannerPicture ?? null
    );

    const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(
        null
    );
    const [pendingBannerFile, setPendingBannerFile] = useState<File | null>(
        null
    );
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);

    const { uploadImage, uploading, error, resetError } = useUploadImage();

    const avatarInputRef = useRef<HTMLInputElement | null>(null);
    const bannerInputRef = useRef<HTMLInputElement | null>(null);

    const bannerImage = bannerPreview || bannerUrl || '/banner-placeholder.png';

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
                        // console.log(result);
                        setUserInfo(result.data.user);
                    } catch (error) {
                        console.error('Failed to fetch user:', error);
                    }
                }
                if (user?.email) fetchUser();
    }, [user]);   


    async function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        resetError();
        setPendingAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));

        e.target.value = '';
    }

    async function handleBannerChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        resetError();
        setPendingBannerFile(file);
        setBannerPreview(URL.createObjectURL(file));

        e.target.value = '';
    }

    const handleSave = async () => {
        if (!user) return;

        setSaving(true);
        resetError();

        try {
            let newAvatarUrl = avatarUrl;
            let newBannerUrl = bannerUrl;

            // Upload pending avatar if any
            if (pendingAvatarFile) {
                const uploadedAvatarUrl = await uploadImage(
                    pendingAvatarFile,
                    'avatar',
                    String(user.id)
                );
                console.log('Uploaded avatar URL:', uploadedAvatarUrl);
                newAvatarUrl = uploadedAvatarUrl;
                setAvatarUrl(uploadedAvatarUrl);
            }

            // Upload pending banner if any
            if (pendingBannerFile) {
                const uploadedBannerUrl = await uploadImage(
                    pendingBannerFile,
                    'banner',
                    String(user.id)
                );
                console.log('Uploaded banner URL:', uploadedBannerUrl);
                newBannerUrl = uploadedBannerUrl;
                setBannerUrl(uploadedBannerUrl);
            }

            const updatePayload = {
                name: username !== user.name ? username : undefined,
                email: email !== user.email ? email : undefined,
                avatarPicture:
                    newAvatarUrl !== user.avatarPicture
                        ? newAvatarUrl
                        : undefined,
                bannerPicture:
                    newBannerUrl !== user.bannerPicture
                        ? newBannerUrl
                        : undefined,
                description:
                    biography !== user.description ? biography : undefined,
            };
            const updatedUser = await updateUserRequest(String(user.id), updatePayload);
            updatedUser.role = role;
            login(updatedUser);

            setPendingAvatarFile(null);
            setPendingBannerFile(null);
            setAvatarPreview(null);
            setBannerPreview(null);

            toast.success('Profile updated!');
            setIsEditing(false);
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || 'Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    const isBusy = uploading || saving;

    return (
        <Box className="edit-profile-page">
            <input
                type="file"
                accept="image/*"
                ref={avatarInputRef}
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
            />
            <input
                type="file"
                accept="image/*"
                ref={bannerInputRef}
                style={{ display: 'none' }}
                onChange={handleBannerChange}
            />

            <Box className="edit-profile-banner-container">
                <Box
                    className="edit-profile-banner"
                    sx={{
                        backgroundImage: `url(${bannerImage}`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                    }}
                >
                    <Button
                        variant="contained"
                        className="edit-banner-button"
                        startIcon={<EditIcon />}
                        onClick={() => bannerInputRef.current?.click()}
                        sx={{
                            position: "absolute",
                            bottom: 16,
                            right: 16,

                            backgroundColor: "#a259ff",
                            color: "#ffffff",
                            padding: "10px 24px",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: 500,
                            textTransform: "none",
                            transition: "all 200ms ease",

                            "&:hover": {
                            backgroundColor: "#8f45e3",
                            transform: "translateY(-2px)",
                            }
                        }}
                    >
                        Edit Banner
                    </Button>
                </Box>
            </Box>

            <Box className="edit-profile-content">
                <Box className="edit-profile-avatar-section">
                    <Box sx={{ position: 'relative' }}>
                        <Avatar
                            src={
                                avatarPreview ||
                                avatarUrl ||
                                undefined
                            }
                            alt={username || ''}
                            className="edit-profile-avatar"
                            sx={{
                                width: 120,
                                height: 120,
                                border: "4px solid #1a1a1a",
                                borderRadius: "12px",
                                flexShrink: 0,
                                "@media (max-width: 480px)": {
                                    width: "100px",
                                    height: "100px",
                                }
                            }}
                        />
                        <IconButton
                            className="avatar-edit-button"
                            onClick={() => avatarInputRef.current?.click()}
                            sx={{
                                position: "absolute",
                                bottom: 0,
                                right: 0,

                                backgroundColor: "rgba(255,255,255,0.9)",
                                color: "#1a1a1a",

                                width: "44px",
                                height: "44px",
                                borderRadius: "8px",

                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",

                                flexShrink: 0,
                                transition: "all 200ms ease",

                                "&:hover": {
                                backgroundColor: "#ffffff",
                                transform: "scale(1.05)",
                                    },
                            }}  
                        >
                            <EditIcon />
                        </IconButton>
                    </Box>
                </Box>

                <Box sx={{ mt: 1, mb: 2 }}>
                    {isBusy && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                            }}
                        >
                            <CircularProgress size={18} />
                            <Typography variant="body2">
                                {uploading
                                    ? 'Uploading image...'
                                    : 'Saving changes...'}
                            </Typography>
                        </Box>
                    )}
                    {error && (
                        <Typography
                            variant="body2"
                            color="error"
                            sx={{ mt: 0.5 }}
                        >
                            {error}
                        </Typography>
                    )}
                </Box>

                <Box className="edit-profile-form">
                    {/* Username */}
                    <Box className="form-group">
                        <Typography 
                            variant="body1"
                            className="form-label"
                            sx = {{
                                color:"#ffffff",
                                fontWeight:600,
                                fontSize:"16px",
                                "@media (max-width: 480px)": {
                                    fontSize:"14px"
                                }
                            }}
                        >
                            Username
                        </Typography>
                        <Box className="form-field-wrapper">
                            <TextField
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={!isEditing}
                                variant="outlined"
                                fullWidth
                                className="profile-input"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                    backgroundColor: "#1a1a1a",
                                    borderRadius: "8px",
                                    color: "#ffffff",
                                    "& fieldset": {
                                        borderColor: "#444",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#a259ff",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#a259ff",
                                    },
                                    "&.Mui-disabled": {
                                        backgroundColor: "#1a1a1a",
                                    },
                                    },
                                    "& .MuiInputBase-input": {
                                    color: "#ffffff",
                                    padding: "12px 16px",
                                    },
                                    "& .MuiInputBase-input.Mui-disabled": {
                                    color: "#ccc",
                                    WebkitTextFillColor: "#ccc",
                                    },
                                    "& .MuiInputBase-input::placeholder": {
                                    color: "#888",
                                    opacity: 1,
                                    },
                                }}
                            />
                            <IconButton
                                className="field-edit-button"
                                onClick={() => setIsEditing(!isEditing)}
                                sx={{
                                    color: "#a259ff",
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "all 200ms ease",
                                    flexShrink: 0,
                                    "&:hover": {
                                        backgroundColor: "rgba(162, 89, 255, 0.1)",
                                        transform: "scale(1.05)",
                                    },
                                    "@media (max-width: 768px)": {
                                        width: "100%",
                                        alignSelf: "flex-end",
                                        marginTop: "8px",
                                    }
                                }}

                            >
                                <EditIcon />
                            </IconButton>
                        </Box>
                    </Box>

                    <Box className="form-group">
                        <Typography 
                            variant="body1" 
                            className="form-label"
                            sx = {{
                                color:"#ffffff",
                                fontWeight:600,
                                fontSize:"16px",
                                "@media (max-width: 480px)": {
                                    fontSize:"14px"
                                }
                            }}
                        >
                            Email
                        </Typography>
                        <Box className="form-field-wrapper">
                            <TextField
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={!isEditing}
                                variant="outlined"
                                fullWidth
                                type="email"
                                className="profile-input"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                    backgroundColor: "#1a1a1a",
                                    borderRadius: "8px",
                                    color: "#ffffff",
                                    "& fieldset": {
                                        borderColor: "#444",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#a259ff",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#a259ff",
                                    },
                                    "&.Mui-disabled": {
                                        backgroundColor: "#1a1a1a",
                                    },
                                    },
                                    "& .MuiInputBase-input": {
                                    color: "#ffffff",
                                    padding: "12px 16px",
                                    },
                                    "& .MuiInputBase-input.Mui-disabled": {
                                    color: "#ccc",
                                    WebkitTextFillColor: "#ccc",
                                    },
                                    "& .MuiInputBase-input::placeholder": {
                                    color: "#888",
                                    opacity: 1,
                                    },
                                }}
                            />
                            <IconButton
                                className="field-edit-button"
                                onClick={() => setIsEditing(!isEditing)}
                                sx={{
                                    color: "#a259ff",
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "all 200ms ease",
                                    flexShrink: 0,
                                    "&:hover": {
                                        backgroundColor: "rgba(162, 89, 255, 0.1)",
                                        transform: "scale(1.05)",
                                    },
                                    "@media (max-width: 768px)": {
                                        width: "100%",
                                        alignSelf: "flex-end",
                                        marginTop: "8px",
                                    }
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                        </Box>
                    </Box>

                    <Box className="form-group">
                        <Typography 
                            variant="body1" 
                            className="form-label"
                            sx = {{
                                color:"#ffffff",
                                fontWeight:600,
                                fontSize:"16px",
                                "@media (max-width: 480px)": {
                                    fontSize:"14px"
                                }
                            }}
                        >
                            Biography
                        </Typography>
                        <Box className="form-field-wrapper biography">
                            <TextField
                                value={biography}
                                onChange={(e) => setBiography(e.target.value)}
                                disabled={!isEditing}
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                className="profile-input"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                    backgroundColor: "#1a1a1a",
                                    borderRadius: "8px",
                                    color: "#ffffff",
                                    "& fieldset": {
                                        borderColor: "#444",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#a259ff",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#a259ff",
                                    },
                                    "&.Mui-disabled": {
                                        backgroundColor: "#1a1a1a",
                                    },
                                    },
                                    "& .MuiInputBase-input": {
                                    color: "#ffffff",
                                    padding: "12px 16px",
                                    },
                                    "& .MuiInputBase-input.Mui-disabled": {
                                    color: "#ccc",
                                    WebkitTextFillColor: "#ccc",
                                    },
                                    "& .MuiInputBase-input::placeholder": {
                                    color: "#888",
                                    opacity: 1,
                                    },
                                }}
                                
                            />
                            <IconButton
                                className="field-edit-button biography-button"
                                onClick={() => setIsEditing(!isEditing)}
                                sx={{
                                    color: "#a259ff",
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "all 200ms ease",
                                    flexShrink: 0,
                                    "&:hover": {
                                        backgroundColor: "rgba(162, 89, 255, 0.1)",
                                        transform: "scale(1.05)",
                                    },
                                    "@media (max-width: 768px)": {
                                        width: "100%",
                                        alignSelf: "flex-end",
                                        marginTop: "8px",
                                    }
                                }}
                                
                            >
                                <EditIcon />
                            </IconButton>
                        </Box>
                    </Box>

                    {isEditing && (
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            className="save-button"
                            onClick={handleSave}
                            disabled={isBusy}
                            sx={{
                                backgroundColor: "#a259ff",
                                color: "#ffffff",
                                borderRadius: "999px",
                                padding: "12px 32px",
                                fontWeight: 600,
                                width: "fit-content",
                                marginTop: "16px",
                                transition: "all 200ms ease",

                                "&:hover": {
                                    backgroundColor: "#8f45e3",
                                    transform: "scale(1.02)",
                                },
                                "@media (max-width: 480px)": {
                                    width: "100%",
                                }
                            }}

                        >
                            Save
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
