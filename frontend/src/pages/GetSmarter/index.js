import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';

import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Card from '@mui/material/Card';
import CardActions from "@mui/material/CardActions";
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import BulletPoint from "components/BulletPoint";

import WifiOffIcon from '@mui/icons-material/WifiOff';
import WifiIcon from '@mui/icons-material/Wifi';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import parseMessage from "utils/irc_message_parser";
import {
    formatPublishedAt,
    formatNumber,
    formatDuration
} from 'utils/video_utils';
import TickerHeader from "components/TickerHeader";

const password = "oauth:midf6aaz8hgc14usszu0dgmmo2gqdd";
const account = 'muddle';
const channel = '#crimpsonsloper';
const youtubeRegex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;


function ConnectionStatusCard({ connectionStatus, onConnectButtonClicked }) {
    let connected = (connectionStatus == 2);
    let subheader;
    let title;
    let buttonText;

    switch (connectionStatus) {

        case 1:
            title = "Connected";
            subheader = `Ready to join`;
            buttonText = 'join channel';
            break;

        case 2:
            title = "Connected, Watching";
            subheader = `Joined channel`;
            buttonText = 'leave channel';
            break;

        case 3:
            title = "Connected";
            subheader = `Start new session`;
            buttonText = 'New Session';
            break;

        default:
            title = "Connecting";
            subheader = "Not Secure";
            buttonText = 'hold up';

    }

    return (
        <Card>
            <CardHeader
                avatar={connected ? <WifiIcon color="success" /> : <WifiOffIcon />}
                title={title}
                subheader={subheader}
            />
            <CardActions>
                <Button ml="auto" onClick={(event) => onConnectButtonClicked(event)} disabled={connectionStatus < 1}>{buttonText}</Button>
            </CardActions>
        </Card>
    )
}


export default function GetSmarterPage() {
    const [client, setClient] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState(0);

    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [activeSession, setActiveSession] = useState(null);

    useEffect(() => {
        let ws = new WebSocket('ws://irc-ws.chat.twitch.tv:80');
        setClient(ws);
        fetchSessions();
    }, [])

    useEffect(() => {
        if (client) {
            client.onopen = () => {
                client.send(`PASS ${password}`);
                client.send(`NICK ${account}`);
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
                                const newVidID = (match && match[7].length == 11) ? match[7] : [];

                                if (newVidID) addVideo(newVidID, rawIrcMessage, parsedMessage.source['nick']);
                                break

                            case 'JOIN':
                                console.log(`Joining ${channel}'s channel.`);
                                setConnectionStatus(2);
                                break;

                            case 'PART':
                                console.log(`Leaving ${channel}'s channel.`);
                                setConnectionStatus(1);
                                break;

                            case 'PING':
                                console.log("Client checking if bot is still alive.");
                                client.send(`PONG ${parsedMessage.parameters}`);
                                break;

                            case '001':
                                console.log("Connected and ready to join channel.");
                                setConnectionStatus(1);
                                break

                        }
                    }
                })
            };
        }
    }, [client]);

    const fetchSessions = () => {
        fetch('/api/stream-session', {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(`Unexpected response status: ${response.status}`);
                }
            })
            .then(data => setSessions(data['results']))
            .catch(err => console.error(err));
    }

    const addVideo = (videoID, rawIrcMessage, submittedBy) => {
        fetch('/api/video-submitted', {
            method: "POST",
            headers: {
                "X-CSRFToken": Cookies.get('csrftoken'),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                session_id: activeSession,
                video_id: videoID,
                raw_message: rawIrcMessage,
                submitted_by: submittedBy
            })
        })
            .then(response => {
                if (response.status === 201) {
                    return response.json();
                } else {
                    throw new Error(`Unexpected response status: ${response.status}`);
                }
            })
            .then(data => {
                setVideos(oldArray => [...oldArray, data['results']])
            })
            .catch(err => console.error(err));
    }

    const handleConnectButtonClicked = () => {
        if (connectionStatus == 2) {
            client.send(`PART ${channel}`);
        } else {
            client.send(`JOIN ${channel}`);
        }
    }

    function YouTubeVideo({ video }) {
        return (
            <iframe
                width={'320px'}
                height={'180px'}
                src={`https://www.youtube.com/embed/${video.video_id}?start=1&rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                frameborder="0"
                allowfullscreen
            ></iframe>
        )

    }

    function YouTubeThumbnail({ video }) {
        const { thumbnail_url, duration } = video;
        return (
            <>
                <Box
                    component="img"
                    src={thumbnail_url}
                    sx={{ cursor: "pointer", height: "180", width: "320", borderRadius: '8px' }}
                />
                <Chip
                    sx={{ position: "absolute", bottom: "12px", right: "8px", backgroundColor: "black", color: "white" }}
                    size="small"
                    label={formatDuration(duration)}
                />
            </>
        )

    }

    const handleClickSaveVideo = (video) => {
        let newVid = video;
        newVid.watch_later = !newVid.watch_later;

        fetch(`/api/video/${video.id}`, {
            method: "PUT",
            headers: {
                "X-CSRFToken": Cookies.get('csrftoken'),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(video)
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(`Unexpected response status: ${response.status}`);
                }
            })
            .then(data => {
                const updatedVideos = videos.map(vid => {
                    if (vid.id === data.id) {
                        return data;
                    }
                    return vid;
                });
                setVideos(updatedVideos);
            })
            .catch(err => console.error(err));
    }

    const renderVideos = videos.map((video, index) => {
        let returnValue;
        let active = (selectedVideo === index);

        returnValue = (
            <Grid item key={index} xs="auto">
                <Box display={"flex"} flexDirection={"column"} width={"320px"}>
                    <Box position="relative" onClick={() => setSelectedVideo(index)}>
                        {active
                            ? <YouTubeVideo video={video} />
                            : <YouTubeThumbnail video={video} />
                        }
                    </Box>
                    <CardContent sx={{ padding: '.25rem', color: 'rgba(0,0,0,0.7)' }}>
                        <Typography variant="body1" gutterBottom sx={{ color: "black" }}>{video.title}</Typography>
                        <Typography variant="subtitle2">{video.channel_name}</Typography>
                        <Typography variant="overline">
                            {formatNumber(video.view_count)} views {<BulletPoint />} {formatNumber(video.like_count)} likes {<BulletPoint />} {formatPublishedAt(video.published_at)} ago
                        </Typography>
                        <Chip size="small" label={`submitted by: ${video.submitted_by}`} />
                    </CardContent>
                    <CardActions >
                        {video.watch_later
                            ? <FavoriteIcon onClick={() => handleClickSaveVideo(video)} />
                            : <FavoriteBorderIcon onClick={() => handleClickSaveVideo(video)} />
                        }
                    </CardActions>
                </Box>
            </Grid>
        )

        return returnValue;
    })

    const onChangeActiveSession = (session) => {
        fetch(`/api/stream-session/${session.id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(`Unexpected response: ${response.status}`);
                }
            })
            .then(data => {
                setActiveSession(data['results']['id'])
                setVideos(data['results']['videos'])
            })
            .catch(err => console.error(err));
    }

    const renderSessions = sessions.map(session => {
        let returnValue;
        let active = (session.id == activeSession);

        returnValue = (
            <ListItem key={session.id} component="li" sx={{ padding: "0" }} onClick={() => onChangeActiveSession(session)}>
                <Box
                    sx={{
                        background: active ? "white" : "transparent",
                        color: active ? "#7222C2" : "rgba(0, 0, 0, 0.6)",
                        display: "flex",
                        alignItems: "center",
                        width: '100%',
                        padding: '8px 16px',
                        margin: '2px 12px',
                        borderRadius: '4px',
                        cursor: "pointer",
                        userSelect: "none",
                        whiteSpace: "nowrap",
                        boxShadow: active ? 'rgba(33, 35, 38, 0.1) 0px 10px 10px -10px;' : "none",
                        transition: 'all 0.35s ease-in-out',
                        "&:hover, &:focus": {
                            backgroundColor: active ? null : "white",
                            boxShadow: 'rgba(33, 35, 38, 0.1) 0px 10px 10px -10px;',
                        },
                    }}
                >
                    <ListItemText
                        primary={session.created_at}
                        sx={{
                            "& span": {
                                fontWeight: active ? 500 : 300,
                            },
                        }}
                    />
                </Box>
            </ListItem>
        )
        return returnValue
    })

    const handleClickSavedVideos = () => {
        setConnectionStatus(3);
        fetch('/api/saved-videos', {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(`Unexpected response status: ${response.status}`);
                }
            })
            .then(data => setVideos(data))
            .catch(err => console.error(err));
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
                        {renderSessions}
                    </List>
                </Box>
                <Box p={3} mt="auto">
                    <Button variant="outlined" fullWidth onClick={handleClickSavedVideos}>Saved Videos</Button>
                    <ConnectionStatusCard connectionStatus={connectionStatus} onConnectButtonClicked={handleConnectButtonClicked} />
                </Box>
            </Drawer >
            <Box component="main" sx={{ flexGrow: 1, padding: 3, overflow: "auto", height: "100vh" }}>
                <Grid container spacing={3} justifyContent={"center"}>
                    <Grid container direction="row" justifyContent="center" alignItems="flex-start" py={3} >
                        <TickerHeader />
                    </Grid>
                    {renderVideos}
                </Grid>
            </Box>
            <Drawer
                sx={{
                    width: '25vw',
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: '25vw',
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
