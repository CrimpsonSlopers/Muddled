import React from "react";
import Box from '@mui/material/Box';

export default function BulletPoint({ color = "black" }) {
    return (
        <Box
            component="span"
            sx={{
                display: 'inline-block',
                transform: 'scale(0.8)',
                color: color,
                pt: "6px"
            }}
        >
            •
        </Box>
    );
}