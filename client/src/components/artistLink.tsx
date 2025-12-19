import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

interface ArtistLinkProps {
  artistName: string;
  artistId: string;
  avatarUrl?: string;
}

export function ArtistLink({
  artistName,
  artistId,
  avatarUrl,
}: Readonly<ArtistLinkProps>) {
  return (
    <Box
      component={Link}
      to={`/artist/${artistId}`}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        textDecoration: 'none',
        color: 'inherit',
        '&:hover': {
          opacity: 0.8,
        },
      }}
    >
      <Avatar src={avatarUrl} alt={artistName} sx={{ width: 24, height: 24 }}>
        {artistName[0]}
      </Avatar>
      <Typography variant="body2">{artistName}</Typography>
    </Box>
  );
}
