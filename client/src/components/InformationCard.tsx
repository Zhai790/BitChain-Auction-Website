import React from "react";
import { Card, CardContent, Box, Typography } from "@mui/material";
import "./InformationCard.css";
import { InformationCardData } from "../data/information";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type InformationCardProps = {
  data: InformationCardData;
  className?: string;
};

export const InformationCard: React.FC<InformationCardProps> = ({
  data,
  className,
}) => {
    const { title, description, imageUrl } = data;
    const {user} = useAuth();
    const navigate = useNavigate();

    if(user){
        data.navigateTo = "/marketplace";
    }

    return (
    <Card
        className={`info-card ${className ?? ''}`}
        sx={{
            borderRadius: '20px',
            overflow: 'hidden',
            backgroundColor: '#2b2b2b',
        }}
        onClick={() => navigate(data.navigateTo)}
    >
        <Box className="info-card-top">
        <img src={imageUrl} alt={title}/>
        </Box>

        <CardContent className="info-card-footer">
        <Typography
            variant="h6"
            className="info-card-title"
            sx={{
            fontFamily: "'Work Sans', sans-serif",
            fontWeight: 700,
            color: '#fff',
            }}
        >
            {title}
        </Typography>
        <Typography
            className="info-card-desc"
            sx={{
            marginTop: '10px',
            fontSize: '1rem',
            color: '#cfcfcf',
            }}
        >
            {description}
        </Typography>
        </CardContent>
    </Card>
    );
};
