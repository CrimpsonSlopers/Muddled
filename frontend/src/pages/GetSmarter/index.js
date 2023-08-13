import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';

import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Grid from '@mui/material/Grid';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';

import TickerHeader from "components/TickerHeader";
import ClientStatusCard from "./components/ClientStatusCard";
import VideoGrid from "./components/VideoGrid";
import NavItems from "./components/NavItems";

import parseMessage from "utils/irc_message_parser";

const CLIENT_ID = "midf6aaz8hgc14usszu0dgmmo2gqdd";
const MUDDLED_ACCOUNT = 'Muddled';
const youtubeRegex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;


export default function GetSmarterPage() {
    const [client, setClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [videos, setVideos] = useState([]);
    const [session, setSession] = useState(0);
    const [channel, setChannel] = useState('crimpsonsloper');

    useEffect(() => {
        setClient(new WebSocket('ws://irc-ws.chat.twitch.tv:80'));
        getSessions();
    }, [])

    useEffect(() => {
        if (client) {
            client.onopen = () => {
                client.send(`PASS oauth:${CLIENT_ID}`);
                client.send(`NICK ${MUDDLED_ACCOUNT}`);
            };

            client.onerror = (error) => {
                console.log('Connect Error: ' + error.toString());
            };

            client.onclose = () => {
                console.log("The connection has been closed successfully.");
            };

            client.onmessage = (event) => {
                let rawIrcMessage = event.data.trimEnd();
                let messages = rawIrcMessage.split('\r\n');

                messages.forEach(message => {
                    let parsedMessage = parseMessage(message);
                    if (parsedMessage) {
                        switch (parsedMessage.command.command) {
                            case 'PRIVMSG':
                                const match = parsedMessage.parameters.match(youtubeRegex);
                                const id = (match && match[7].length == 11) ? match[7] : [];

                                if (id.length > 0) {
                                    addVideo(id, parsedMessage.source['nick']);
                                }
                                break

                            case 'JOIN':
                                console.log(`Joining ${channel}'s channel`);
                                break;

                            case 'PART':
                                console.log(`Leaving ${channel}'s channel`);
                                break;

                            case 'PING':
                                console.log("Responding to client with: PONG ", parsedMessage.parameters);
                                client.send(`PONG ${parsedMessage.parameters}`);
                                break;

                            case '001':
                                console.log("Connected and ready to join channel");
                                break

                        }
                    }
                })
            };
        }
    }, [client]);

    const addVideo = async (id, login) => {
        try {
            const response = await fetch('/api/video-submitted', {
                method: "POST",
                headers: {
                    "X-CSRFToken": Cookies.get('csrftoken'),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    session_id: session,
                    video_id: id,
                    login: login
                })
            });

            if (response.status === 200) {
                const data = await response.json();
                setVideos(oldArray => [...oldArray, data.results]);
                if (data.results.session != session) {
                    setSession(data.results.session)
                }
            } else {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const getVideos = async (session) => {
        try {
            const response = await fetch(`/api/session/${session}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });

            if (response.status === 200) {
                const data = await response.json();
                setVideos(data.results.videos);
            } else {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

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
                    "Content-Type": "application/json"
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

    const handleConnect = () => {
        if (connected) {
            client.send(`PART #${channel}`);
            setConnected(false)
        } else {
            client.send(`JOIN #${channel}`);
            setConnected(true)
        }
    }

    const handleNavClick = (session) => {
        setSession(session.id)
        setVideos(session.videos);
    }

    const handleUpdateVideo = (videos) => {
        setVideos(videos)
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
                        <NavItems sessions={sessions} session={session} onNavClick={handleNavClick} />
                    </List>
                </Box>
                <Box p={3} mt="auto">
                    <Button variant="outlined" fullWidth onClick={getSavedVideos}>Saved Videos</Button>
                    <ClientStatusCard
                        connected={connected}
                        handleConnect={handleConnect}
                        channel={channel}
                        updateChannel={value => setChannel(value)}
                    />
                </Box>
            </Drawer >
            <Box component="main" sx={{ flexGrow: 1, padding: 3, overflow: "auto", height: "100vh" }}>
                <Grid container spacing={3} justifyContent={"center"}>
                    <Grid container direction="row" justifyContent="center" alignItems="flex-start" py={3} >
                        <TickerHeader />
                    </Grid>
                    <VideoGrid session={session} videos={videos} onUpdateVideo={handleUpdateVideo}/>
                </Grid>
            </Box>
            <Drawer
                sx={{
                    width: '20vw',
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: '20vw',
                        boxSizing: 'border-box',
                        border: "none",
                        backgroundColor: "transparent"
                    },
                }}
                variant="permanent"
                anchor="right"
            >
            </Drawer>
        </Box >
    )
}
