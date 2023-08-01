import React from 'react';

import { Box, Typography } from '@mui/material';

function getDayOfWeek(date) {
    const dayOfWeek = new Date(date).getDay();
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek].toUpperCase();
}

const renderLetters = (tickerString) => {
    return tickerString.split("").map((character, index) => {
        if (character == " ") {
            return (
                <Box
                    key={index}
                    sx={{
                        border: '0',
                        display: 'inline-block',
                        margin: '4px',
                        width: '80px'
                    }}
                />
            )
        }
        return (
            <Box
                key={index}
                sx={{
                    border: '1px dashed rgba(0,0,0,0.25)',
                    display: 'inline-block',
                    margin: '4px',
                    width: '80px',
                    textAlign: 'center',
                }}
            >
                <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>{character}</span>
            </Box>
        );
    });
};

export default function TickerHeader () {
    let today = new Date();
    let dayToRender = getDayOfWeek(today)

    return (
        <Box>
            <Typography sx={{ textTransform: 'uppercase', letterSpacing: '2px', color: "#7222C2" }}>
                WELCOME TO
            </Typography>
            <Typography variant="h1" m={0} p={0} sx={{ fontSize: '4.0vw !important', lineHeight: "1" }}>
                {renderLetters("GET SMARTER")}
            </Typography>
            <Typography variant="h1" m={0} p={0} sx={{ fontSize: '4.0vw !important', lineHeight: "1" }}>
                {renderLetters(`${dayToRender}S`)}
            </Typography>
        </Box>
    );
};