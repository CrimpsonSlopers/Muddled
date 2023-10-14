import React, { useState, useEffect } from "react";
import { MaterialDesignContent, SnackbarProvider, useSnackbar } from 'notistack';
import { useAuth } from "../hooks/useAuth";
import { styled } from '@mui/system';
import moment from 'moment';

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormGroup from '@mui/material/FormGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import WifiIcon from "@mui/icons-material/Wifi";

import VideoGrid from "./VideoGrid";
import parseMessage from "utils/IRCMessageParser";

const CLIENT_ID = "2y515k4edhradk25bd9gzuutnalcw1";
const YT_API_KEY = "AIzaSyBDR0OdMSLxUC8H_8wtkOJLakfoUrdBwXA";
const youtubeRegex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;

const urls = [
    "t4y4mhVe2r0",
    "PAHJUDbbT9k",
    "jBquj9KLgII"
]

const DURATION_FILTERS = [
    { min: 0, max: 86400 },
    { min: 0, max: 239 },
    { min: 240, max: 1199 },
    { min: 1200, max: 86400 }
]

const GetSmarterApp = () => {
    const { user } = useAuth();
    const idList = [];

    const [client, setClient] = useState(null);
    const [readyToConnect, setReadyToConnect] = useState(false);
    const [connected, setConnected] = useState(false);
    const [videos, setVideos] = useState([]);
    const [filteredVideos, setFilteredVideos] = useState([]);
    const [durationFilter, setDurationFilter] = useState(0);
    const [checked, setChecked] = useState([true, false, false, false]);
    const [lastMessage, setLastMessage] = useState(null);

    const { enqueueSnackbar } = useSnackbar();


    useEffect(() => {
        urls.forEach((u) => fetchVidData(u, "crimps"))
        const connectWebSocket = () => {
            const client = new WebSocket("wss://irc-ws.chat.twitch.tv");

            client.onopen = () => {
                client.send(`PASS oauth:${CLIENT_ID}`);
                client.send(`NICK muddled`);
            };

            client.onerror = (error) => {
                handleAddVariant("Unexpected disconnect. Attempting to reconnect", 'error');
            };

            client.onclose = () => {
                handleAddVariant("The connection has been closed.", 'info');
            };

            client.onmessage = (event) => {
                setLastMessage(event.data);
            };

            setClient(client);
        }

        connectWebSocket();

        return () => { if (client) client.close() };
    }, []);


    const handleAddVariant = (message, variant) => {
        enqueueSnackbar(message, { variant });
    };


    useEffect(() => {
        if (lastMessage) { handleMessage(lastMessage) }
    }, [lastMessage]);


    const handleMessage = (data) => {
        let rawIrcMessage = data.trimEnd();
        let messages = rawIrcMessage.split("\r\n");

        messages.forEach((message) => {
            try {
                let parsedMessage = parseMessage(message);
                if (parsedMessage) {
                    switch (parsedMessage.command.command) {
                        case "PRIVMSG":
                            const match = parsedMessage.parameters.match(youtubeRegex);
                            const id = match && match[7].length == 11 ? match[7] : [];

                            if (id.length > 0 && !idList.includes(id)) {
                                idList.push(id);
                                fetchVidData(id, parsedMessage.source["nick"]);
                            }
                            break;

                        case "JOIN":
                            handleAddVariant(`Successfully joined ${user.username}'s chat.`, 'success');
                            setConnected(true);
                            break;

                        case "PART":
                            handleAddVariant("The connection was forcefully closed.", 'warning');
                            setConnected(false);
                            break;

                        case "PING":
                            client.send(`PONG ${parsedMessage.parameters}`);
                            handleAddVariant("Playing PING PONG with a websocket.", "info");
                            break;

                        case "001":
                            setReadyToConnect(true);
                            handleAddVariant("Connected to Twitch's server.", "info");
                            break;
                    }
                }
            } catch (err) {
                console.log("ERROR PARSING MESSAGE: ", err);
            }
        });
    };

    const fetchVidData = async (videoId, submittedBy) => {
        try {
            const response = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails,statistics&key=${YT_API_KEY}`);

            if (response.ok) {
                const data = await response.json();
                const { items, pageInfo } = data;

                if (pageInfo.totalResults === 1 && items[0].kind == "youtube#video") {
                    const { contentDetails, statistics, snippet } = items[0];
                    const newVideo = {
                        id: videoId,
                        duration: moment.duration(contentDetails.duration).asSeconds(),
                        viewCount: statistics.viewCount,
                        likeCount: statistics.likeCount,
                        thumbnailUrl: snippet.thumbnails.medium.url,
                        channelId: snippet.channelId,
                        channelTitle: snippet.channelTitle,
                        publishedAt: snippet.publishedAt,
                        title: snippet.title,
                        submittedAt: Date.now(),
                        submittedBy: submittedBy,
                    }

                    let filter = DURATION_FILTERS[durationFilter];
                    if (newVideo.duration > filter.min && newVideo.duration <= filter.max) {
                        setFilteredVideos(vids => [...vids, newVideo]);
                    } else {
                        setVideos(vids => [...vids, newVideo])
                    }
                }
            }
        } catch (error) {
            switch (error.code) {
                case 403:
                    handleAddVariant(`${error.code}: ${error.message}`, "error");
                    break;

                case 400:
                    handleAddVariant(`${error.code}: ${error.message}`, "warning");
                    break;
            }
        }

    };

    const handleFilterChange = (event) => {
        setDurationFilter(event.target.value);
        let tempVidList = [...videos, ...filteredVideos];
        switch (event.target.value) {
            case 0:
                setFilteredVideos(tempVidList);
                setVideos([])
                break;

            case 1:
                setFilteredVideos(tempVidList.filter(video => video.duration < 240));
                setVideos(tempVidList.filter(video => video.duration >= 240))
                break;

            case 2:
                setFilteredVideos(tempVidList.filter(video => video.duration >= 240 && video.duration < 1200));
                setVideos(tempVidList.filter(video => video.duration < 240 && video.duration >= 1200))
                break;

            case 3:
                setFilteredVideos(tempVidList.filter(video => video.duration >= 1200));
                setVideos(tempVidList.filter(video => video.duration < 1200));
                break;
        }
        setChecked([true, false, false, false]);
        setFilteredVideos([...filteredVideos].sort((a, b) => a.submittedAt - b.submittedAt))
    };

    const handleConnect = () => {
        if (connected) {
            client.send(`PART #${user.username}`);
        } else {
            client.send(`JOIN #${user.username}`);
        }
    };


    const handleSort = (event, sortBy) => {
        const newChecked = [false, false, false, false];
        newChecked[sortBy] = event.target.checked;
        setChecked(newChecked);

        let sorted;
        switch (sortBy) {
            case 0:
                sorted = [...filteredVideos].sort((a, b) => a.submittedAt - b.submittedAt);
                break;
            case 1:
                sorted = [...filteredVideos].sort((a, b) => a.duration - b.duration);
                break;
            case 2:
                sorted = [...filteredVideos].sort((a, b) => b.viewCount - a.viewCount);
                break;
            case 3:
                sorted = [...filteredVideos].sort((a, b) => b.likeCount - a.likeCount);
                break;
            default:
                sorted = [...filteredVideos];
        }
        setFilteredVideos(sorted);
    }

    return (
        <Box sx={{ display: "flex" }}>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    padding: 3,
                    overflow: "auto",
                    height: "100vh",
                }}
            >
                <Grid
                    container
                    justifyContent={"center"}
                    overflow={"auto"}
                    spacing={3}
                >
                    <VideoGrid videos={filteredVideos} />
                </Grid>
            </Box>
            <Drawer
                sx={{
                    width: "25vw",
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: "25vw",
                        boxSizing: "border-box",
                        border: "none",
                        backgroundColor: "transparent",
                        padding: 2,
                    },
                }}
                variant="permanent"
                anchor="right"
            >
                <Stack
                    direction="column"
                    justifyContent="flex-end"
                    spacing={2}
                    height={"100%"}
                >
                    <Card width="100%" variant="outlined">
                        <CardContent >
                            <Stack
                                direction={"column"}
                                spacing={2}
                                justifyContent="center"
                                alignItems="stretch"
                            >
                                <Typography variant="subtitle1" fontWeight={"bold"} color="#0E212E">
                                    sort by
                                </Typography>
                                <Stack
                                    direction={"row"}
                                    width="100%"
                                    justifyContent="space-around"
                                    alignItems="center"
                                >
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    size="large"
                                                    checked={checked[0]}
                                                    onChange={(e) => handleSort(e, 0)}
                                                />
                                            }
                                            label={<Typography color="#000000">default</Typography>}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    size="large"
                                                    checked={checked[1]}
                                                    onChange={(e) => handleSort(e, 1)}
                                                />
                                            }
                                            label={<Typography color="#000000">duration</Typography>}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    size="large"
                                                    checked={checked[2]}
                                                    onChange={(e) => handleSort(e, 2)}
                                                />
                                            }
                                            label={<Typography color="#000000">view count</Typography>}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    size="large"
                                                    checked={checked[3]}
                                                    onChange={(e) => handleSort(e, 3)}
                                                />
                                            }
                                            label={<Typography color="#000000">like count</Typography>}
                                        />
                                    </FormGroup>
                                </Stack>
                                <Typography variant="subtitle1" fontWeight={"bold"} color="#0E212E">
                                    filter
                                </Typography>
                                <FormControl>
                                    <InputLabel id="duration-select-label" sx={{ color: "#0E212E" }}>Filter</InputLabel>
                                    <Select
                                        labelId="duration-select-label"
                                        id="duration-select"
                                        value={durationFilter}
                                        label="Filter"
                                        onChange={handleFilterChange}
                                        size="large"
                                    >
                                        <MenuItem value={0}><em>All</em></MenuItem>
                                        <MenuItem value={1}>under 4 minutes</MenuItem>
                                        <MenuItem value={2}>4 - 20 minutes</MenuItem>
                                        <MenuItem value={3}>over 20 minutes</MenuItem>
                                    </Select>
                                </FormControl>
                            </Stack>
                        </CardContent>
                    </Card>
                    <Card width="100%" variant="outlined">
                        <CardContent>
                            <Stack
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="center"
                                spacing={2}
                                marginBottom={"32px"}
                            >
                                {!readyToConnect ? (
                                    <WifiOffIcon sx={{
                                        color: "#96a2b8",
                                        mr: 1, my: 0.5,
                                        fontSize: "40px"
                                    }} />
                                ) : (
                                    <WifiIcon sx={{
                                        color: !connected ? "#96a2b8" : "#2152ff",
                                        mr: 1, my: 0.5,
                                        fontSize: "40px"
                                    }} />
                                )}
                                <Typography variant="h4" fontWeight={"bold"} color={"#0E212E"}>
                                    {user.username}
                                </Typography>
                            </Stack>
                            <Box
                                direction="row"
                                justifyContent="flex-end"
                                alignItems="center"
                                display="flex"
                            >
                                <Button
                                    fullWidth
                                    size="large"
                                    onClick={handleConnect}
                                    variant="contained"
                                    disabled={!readyToConnect}
                                >
                                    {connected ? "Disconnect" : "Connect"}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Stack>
            </Drawer>
        </Box >
    );
}


const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
    fontSize: "16px",
    fontFamily: "Lexend",
    '&.notistack-MuiContent-default': {
        backgroundColor: '#313131',
    },
    '&.notistack-MuiContent-success': {
        backgroundColor: '#2D7738',
    },
    '&.notistack-MuiContent-error': {
        backgroundColor: '#970C0C',
    },
    '&.notistack-MuiContent-warning': {
        backgroundColor: '#ff9800',
    },
    '&.notistack-MuiContent-info': {
        backgroundColor: '#2196f3',
    },
}));


const GetSmarterPage = () => {
    return (
        <SnackbarProvider
            maxSnack={3}
            Components={{
                default: StyledMaterialDesignContent,
                success: StyledMaterialDesignContent,
                error: StyledMaterialDesignContent,
                warning: StyledMaterialDesignContent,
                info: StyledMaterialDesignContent
            }}
            autoHideDuration={5000}
        >
            <GetSmarterApp />
        </SnackbarProvider>
    );
}

export default GetSmarterPage;
