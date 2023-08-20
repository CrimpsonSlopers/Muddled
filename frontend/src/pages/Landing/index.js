import React from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';


export default function Landing() {

    return (
        <div>
            <AppBar sx={{ background: 'transparent', boxShadow: 'none' }}>
                <Toolbar>
                    <Typography variant='h4' component='div' sx={{ flexGrow: 1 }}>
                        Muddled
                    </Typography>
                    <Typography variant='body2' component='div' sx={{ marginRight: '20px' }}>
                        <a href='/get-smarter' style={{ color: 'white', textDecoration: 'none', fontWeight: 'light' }}>Get Smarter</a>
                    </Typography>
                    <Typography variant='body2' component='div' sx={{ marginRight: '20px' }}>
                        <a
                            href={'/auth/login/twitch/'}
                            style={{ color: 'white', textDecoration: 'none', fontWeight: 'light' }}
                        >
                            Sign In
                        </a>
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box sx={{
                background: 'radial-gradient(ellipse at 15% 20%, #7222C2 0%, #2D0841 100%);',
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
            }}>
                <Typography sx={{
                    fontSize: '6.0vw !important',
                    lineHeight: '1',
                    color: 'white',
                    fontWeight: '900'
                }}>
                    MUDDLED
                </Typography>
                <Typography sx={{
                    letterSpacing: '3px',
                    color: 'white'
                }}>
                    a site for ATRIOC
                </Typography>
            </Box>
        </div>
    )
}