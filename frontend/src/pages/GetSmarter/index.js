import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';


import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';

import WifiOffIcon from '@mui/icons-material/WifiOff';
import WifiIcon from '@mui/icons-material/Wifi';

import parseMessage from "../../utils/irc_message_parser";
import { formatPublishedAt, formatNumber, formatDuration } from 'utils/video_utils';
import TickerHeader from "../../components/TickerHeader";

const password = "midf6aaz8hgc14usszu0dgmmo2gqdd";
const user_account = 'crimpsonsloper';
const join_account = 'atrioc';
const youtubeRegex = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?=]*)?/g;

const bull = (
    <Box
        component="span"
        sx={{ display: 'inline-block', mx: '3px', transform: 'scale(0.8)' }}
    >
        •
    </Box>
);

function YouTubeVideo({ video }) {
    const { video_id } = video;
    return (
        <iframe
            width={'320px'}
            height={'180px'}
            src={`https://www.youtube.com/embed/${video_id}?start=18&rel=0`}
            allow="accelerometer; clipboard-write; encrypted-media; fullscreen"
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
                sx={{
                    cursor: "pointer",
                    height: "180",
                    width: "320",
                    borderRadius: '8px'
                }}
            />
            <Chip
                sx={{ position: "absolute", bottom: "12px", right: "8px", backgroundColor: "black", color: "white" }}
                size="small"
                label={formatDuration(duration)}
            />
        </>
    )

}

export default function GetSmarterPage() {
    const [connected, setConnected] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState("Connecting");
    const [client, setClient] = useState(null);
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);

    useEffect(() => {
        const newClient = new WebSocket('ws://irc-ws.chat.twitch.tv:80');
        setClient(newClient);
    }, []);

    useEffect(() => {
        if (client) {
            client.onopen = () => {
                client.send(`PASS oauth:${password}`);
                client.send(`NICK ${user_account}`);
                client.send(`JOIN #${join_account}`);
            };

            client.onerror = (error) => {
                console.log('Connect Error: ' + error.toString());
            };

            client.onmessage = (event) => {
                setConnected(true);
                setConnectionStatus("Connected!")
                let rawIrcMessage = event.data.trimEnd();
                console.log(`Message received (${new Date().toISOString()}): '${rawIrcMessage}'\n`);

                let messages = rawIrcMessage.split('\r\n');
                messages.forEach(message => {
                    let parsedMessage = parseMessage(message);
                    if (parsedMessage) {
                        // console.log(`Message command: ${parsedMessage.command.command}`);
                        // console.log(`\n${JSON.stringify(parsedMessage, null, 3)}`)

                        switch (parsedMessage.command.command) {
                            case 'PRIVMSG':
                                // console.log(`Message received: ${parsedMessage.parameters} from ${parsedMessage.source['nick']}`)
                                const matches = parsedMessage.parameters.match(youtubeRegex);

                                if (matches) {
                                    matches.forEach(match => {
                                        let id = youtube_parser(match)

                                        if (id) {
                                            fetch('/api/parse_irc_message', {
                                                method: "POST",
                                                headers: {
                                                    "X-CSRFToken": Cookies.get('csrftoken'),
                                                    "Content-Type": "application/json"
                                                },
                                                body: JSON.stringify({
                                                    video_id: id,
                                                    submitted_by: parsedMessage.source['nick']
                                                })
                                            })
                                                .then(response => response.json())
                                                .then(data => {
                                                    console.log(data)
                                                    setVideos(oldArray => [...oldArray, data['results']])
                                                })
                                                .catch(err => console.error(err));

                                        }

                                        console.log(id)
                                    })

                                }
                            
                        }
                    }
                })
            };
        }
    }, [client]);

    function youtube_parser(url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);

        console.log(match)
        return (match && match[7].length == 11) ? match[7] : false;
    }

    const handleSelectVideo = (index) => {
        setSelectedVideo(index);
    };

    const renderVideos = videos.map((video, index) => {
        let returnValue;
        let active = (selectedVideo === index);

        returnValue = (
            <Grid item key={index} xs="auto">
                <Box display={"flex"} flexDirection={"column"} width={"320px"}>
                    <Box position="relative" onClick={(event) => handleSelectVideo(index)}>
                        {active
                            ? <YouTubeVideo video={video} />
                            : <YouTubeThumbnail video={video} />
                        }
                    </Box>
                    <CardContent sx={{ padding: '.25rem', color: 'rgba(0,0,0,0.7)' }}>
                        <Typography variant="body1" gutterBottom sx={{ color: "black" }}>{video.title}</Typography>
                        <Typography variant="subtitle2">{video.channel_name}</Typography>
                        <Typography variant="overline">
                            {video.view_count} views {bull} {formatNumber(video.like_count)} likes {bull} {formatPublishedAt(video.published_at)} ago
                        </Typography>
                        <Chip size="small" label={`submitted by: ${video.submitted_by}`} />
                    </CardContent>
                </Box>
            </Grid>
        )

        return returnValue;
    })

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                sx={{
                    width: '300px',
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: '300px',
                        boxSizing: 'border-box',
                        border: "none",
                        backgroundColor: "transparent"
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Box
                    display="flex"
                    alignItems="center"
                    textAlign="center"
                    justifyContent="center"
                    pt={3}
                    pb={1}
                >
                    <Typography
                        variant="h3"
                        fontWeight="bold"
                        textTransform="uppercase"
                        color="#7222C2"
                        letterSpacing="2px"
                    >
                        Muddled
                    </Typography>
                </Box>
                <Box mt="auto" p={1}>
                    <Card>
                        <CardHeader
                            avatar={connected ? <WifiIcon color="success" /> : <WifiOffIcon />}
                            title={connectionStatus}
                        />
                    </Card>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, padding: 3, overflow: "auto", height: "100vh" }}>
                <Grid container spacing={3} justifyContent={"center"}>
                    <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="flex-start"
                        py={3}
                    >
                        <TickerHeader />
                    </Grid>
                    {renderVideos}
                </Grid>
            </Box>
        </Box>
    )
}
