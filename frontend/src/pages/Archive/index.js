import React, { useState, useEffect } from "react";

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import VideoGrid from "components/VideoGrid";
import NavItems from "components/NavItems";


export default function Archives() {
    const [sessions, setSessions] = useState([]);
    const [videos, setVideos] = useState([]);
    const [session, setSession] = useState(0);
    const [channel, setChannel] = useState('atrioc');

    useEffect(() => {
        getSessions();
    }, [])

    const getSavedVideos = async () => {
        try {
            const response = await fetch(`/api/saved-videos`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 200) {
                const data = await response.json();
                setVideos(data);
                setSession(-1);
            } else {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const getSessions = async () => {
        try {
            const response = await fetch(`/api/session`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (response.status === 200) {
                const data = await response.json();
                setSessions(data.results);
            } else {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleNavClick = (session) => {
        setSession(session.id);
        setVideos(session.videos);
    }

    const handleUpdateVideo = (videos) => {
        setVideos(videos)
    }

    const handleSortByViews = () => {
        const sorted = [...videos].sort((a, b) => {
            return b.view_count - a.view_count;
        });
        setVideos(sorted)
    }

    const handleSortByDuration = () => {
        const sorted = [...videos].sort((a, b) => {
            return a.duration - b.duration;
        });
        setVideos(sorted)
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                sx={{
                    width: '280px',
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: '280px',
                        boxSizing: 'border-box',
                        border: "none",
                        backgroundColor: "transparent"
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Box display="flex" alignItems="center" textAlign="center" justifyContent="center" py={1} >
                    <Typography variant="h2" fontWeight="bold" textTransform="uppercase" color="#7222C2" letterSpacing="2px" >
                        ATRIOC
                    </Typography>
                </Box >
                <Box overflow={"auto"}>
                    <List>
                        <ListItem key={-1} component="li" sx={{ padding: "0" }} onClick={getSavedVideos}>
                            <Box
                                sx={{
                                    background: session == -1 ? "white" : "transparent",
                                    color: session == -1 ? "#7222C2" : "rgba(0, 0, 0, 0.6)",
                                    display: "flex",
                                    alignItems: "center",
                                    width: '100%',
                                    padding: '8px 16px',
                                    margin: '2px 12px',
                                    borderRadius: '4px',
                                    cursor: "pointer",
                                    userSelect: "none",
                                    whiteSpace: "nowrap",
                                    boxShadow: session == -1 ? 'rgba(33, 35, 38, 0.1) 0px 10px 10px -10px;' : "none",
                                    transition: 'all 0.35s ease-in-out',
                                    "&:hover, &:focus": {
                                        backgroundColor: session == -1 ? null : "white",
                                        boxShadow: 'rgba(33, 35, 38, 0.1) 0px 10px 10px -10px;',
                                    },
                                }}
                            >
                                <ListItemText
                                    primary={"Saved Videos"}
                                    sx={{
                                        "& span": {
                                            fontWeight: session == -1 ? 500 : 300,
                                        },
                                    }}
                                />
                            </Box>
                        </ListItem>
                        <Divider variant="middle" />
                        <NavItems sessions={sessions} session={session} onNavClick={handleNavClick} />

                    </List>
                </Box>
            </Drawer >
            <Box component="main" sx={{ flexGrow: 1, padding: 3, overflow: "auto", height: "100vh" }}>
                <Grid container spacing={3} justifyContent={"center"}>
                    <VideoGrid session={session} videos={videos} onUpdateVideo={handleUpdateVideo} />
                </Grid>
            </Box>
        </Box >
    )
}
