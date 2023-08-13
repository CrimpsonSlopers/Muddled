import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const client_id = 'bs99mqyazrfa7tut83c2wa108xasmz';

export default function Landing() {

    useEffect(() => {
        const getQueryParam = (param) => {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(param);
        };

        const accessToken = getQueryParam('access_token');
        const refreshToken = getQueryParam('refresh_token');

        if (accessToken && refreshToken) {
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);

            window.history.replaceState({}, document.title, '/');
        }
    }, []);

    const convertToken = () => {
        fetch('/auth/convert-token/', {
            method: "POST",
            headers: {
                "X-CSRFToken": Cookies.get('csrftoken'),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: accessToken,
                refresh_token: refreshToken,
                backend: 'twitch',
                grant_type: 'convert_token',
                client_id: 'L9ocwmSbNuW0fSgc4IduFrSqRL2EoHYvOyZ2rV8V',
                client_secret: 'zXLY0HgYOOyeVewko0RRIlQQ3wUR1rkfoeNs4esVboSrrsWycrruXZwCmi0kMC2Vx8kUKo5elJ1vWxupGYy9jrIMf4exrvQAiF5OQbfQB487OCcSMhl2T9BVBwrxTc1B'
            })
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(`Unexpected response status: ${response.status}`);
                }
            })
            .then(data => console.log(data))
            .catch(err => console.error(err));
    }

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
                            href={`https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${client_id}&redirect_uri=http://localhost:8000/api/get-access-token&scope=user:read:email&state=${Cookies.get('csrftoken')}`}
                            style={{ color: 'white', textDecoration: 'none', fontWeight: 'light' }}
                        >
                            Sign In
                        </a>
                    </Typography>
                    <a href={"http://localhost:8000/auth/login/twitch/"}>Login with Facebook</a>
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