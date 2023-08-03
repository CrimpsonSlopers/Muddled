import React, { useState, useEffect } from "react";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';


export default function Landing() {
    const [sequence, setSequence] = useState('');

    const checkLoginSequence = (event) => {
        const key = event.key.toLowerCase();
        setSequence((prevSequence) => prevSequence + key);
    };

    useEffect(() => {
        document.addEventListener('keydown', checkLoginSequence);

        return () => {
            document.removeEventListener('keydown', checkLoginSequence);
        };
    }, []);

    useEffect(() => {
        if (sequence.includes('atrioc')) {
            window.location.href = '/admin/';
        }
    }, [sequence]);

    return (
        <div>
            {/* Transparent Toolbar */}
            <AppBar sx={{ background: 'transparent', boxShadow: 'none' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Muddled
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ marginRight: '20px' }}>
                        <a href="https://www.twitch.tv/atrioc" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none' }}>Twitch</a>
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ marginRight: '20px' }}>
                        <a href="https://www.youtube.com/@atrioc" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none' }}>YouTube</a>
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ marginRight: '20px' }}>
                        <a href="https://twitter.com/atrioc" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none' }}>Twitter</a>
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ marginRight: '20px' }}>
                        <a href="https://discord.com/invite/Dar3UDx" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none' }}>Discord</a>
                    </Typography>
                    <Typography variant="h6" component="div">
                        <a href="https://reddit.com/r/Atrioc/" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none' }}>Reddit</a>
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box sx={{
                background: 'radial-gradient(ellipse at 15% 20%, #7222C2 0%, #2D0841 100%);',
                width: '100vw',
                height: '100vh',
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
            }}>
                <Typography sx={{ letterSpacing: '2px', color: "white" , fontWeight: '200'}}>
                    welcome to
                </Typography>
                <Typography sx={{ fontSize: '6.0vw !important', lineHeight: "1", color: "white", textShadow: '0 0 10px rgba(0, 0, 0, 0.5)', fontWeight: '900'}}>
                    MUDDLED
                </Typography>
                <Typography sx={{ letterSpacing: '3px', color: "white" }}>
                    a site designed for ATRIOC
                </Typography>
            </Box>
        </div>
    )
}