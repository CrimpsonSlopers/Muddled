import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import ClientStatusCard from "components/ClientStatusCard";
import VideoGrid from "components/VideoGrid";
import parseMessage from "utils/irc_message_parser";

const CLIENT_ID = "fgj0gbae5f6keu4ivcyip71mi8y2xe";
const MUDDLED_ACCOUNT = 'crimpsonslopers';
const youtubeRegex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;


export default function GetSmarterPage() {
    const [client, setClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [videos, setVideos] = useState([]);
    const [session, setSession] = useState(0);
    const [channel, setChannel] = useState('atrioc');

    useEffect(() => {
        setClient(new WebSocket('ws://irc-ws.chat.twitch.tv:80'));
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

            client.onmessage = (event) => handleMessage(event.data)
        }
    }, [client]);

    useEffect(() => {
        if (session > 0) {
            client.onmessage = (event) => handleMessage(event.data)
        }
    }, [session])

    const handleMessage = (data) => {
        let rawIrcMessage = data.trimEnd();
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
    }

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
            } else {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const newSession = async () => {
        try {
            const response = await fetch(`/api/session`, {
                method: "POST",
                headers: {
                    "X-CSRFToken": Cookies.get('csrftoken'),
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 200) {
                const data = await response.json();
                client.send(`JOIN #${channel}`);
                setSession(data.results.id);
                setConnected(true)
            } else {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
        } catch (err) {
            console.error(err);
        }
    }

    const handleConnect = () => {
        if (connected) {
            client.send(`PART #${channel}`);
            setConnected(false)
        } else {
            if (session == 0) {
                newSession();
            } else {
                client.send(`JOIN #${channel}`);
                setConnected(true)
            }
        }
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
                        <ListItem key={1} component="li" sx={{ padding: "0" }} onClick={handleSortByViews}>
                            <Box
                                sx={{
                                    background: "transparent",
                                    color: "rgba(0, 0, 0, 0.6)",
                                    display: "flex",
                                    alignItems: "center",
                                    width: '100%',
                                    padding: '8px 16px',
                                    margin: '2px 12px',
                                    borderRadius: '4px',
                                    cursor: "pointer",
                                    userSelect: "none",
                                    whiteSpace: "nowrap",
                                    boxShadow: "none",
                                    transition: 'all 0.35s ease-in-out',
                                    "&:hover, &:focus": {
                                        backgroundColor: "white",
                                        boxShadow: 'rgba(33, 35, 38, 0.1) 0px 10px 10px -10px;',
                                    },
                                }}
                            >
                                <ListItemText
                                    primary={"Sort By Views"}
                                    sx={{
                                        "& span": {
                                            fontWeight: 300,
                                        },
                                    }}
                                />
                            </Box>
                        </ListItem>
                        <ListItem key={2} component="li" sx={{ padding: "0" }} onClick={handleSortByDuration}>
                            <Box
                                sx={{
                                    background: "transparent",
                                    color: "rgba(0, 0, 0, 0.6)",
                                    display: "flex",
                                    alignItems: "center",
                                    width: '100%',
                                    padding: '8px 16px',
                                    margin: '2px 12px',
                                    borderRadius: '4px',
                                    cursor: "pointer",
                                    userSelect: "none",
                                    whiteSpace: "nowrap",
                                    boxShadow: "none",
                                    transition: 'all 0.35s ease-in-out',
                                    "&:hover, &:focus": {
                                        backgroundColor: "white",
                                        boxShadow: 'rgba(33, 35, 38, 0.1) 0px 10px 10px -10px;',
                                    },
                                }}
                            >
                                <ListItemText
                                    primary={"Sort By Duration"}
                                    sx={{
                                        "& span": {
                                            fontWeight: 300,
                                        },
                                    }}
                                />
                            </Box>
                        </ListItem>

                    </List>
                </Box>
                <Box p={3} mt="auto">
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
                    <VideoGrid session={session} videos={videos} onUpdateVideo={handleUpdateVideo} />
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
