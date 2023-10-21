import React, { useState, useEffect, useContext } from "react";
import { MaterialDesignContent, SnackbarProvider, useSnackbar } from 'notistack';
import { AuthContext, useAuth } from "../hooks/useAuth";
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
import { useRouteLoaderData } from "react-router-dom";
import { CardHeader } from "@mui/material";

const CLIENT_ID = "hy7yxwyq9rne4k6jd83k50r9rerc2p";
const YT_API_KEY = "AIzaSyB_QdcttdchWoUbu2087r02Bhm3RxcN0DU";
const youtubeRegex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;

const DEFAULT_URLS = [
    "https://youtu.be/y8K6QazBqrY",
    "https://www.youtube.com/watch?v=YQ_xWvX1n9g",
    "https://www.youtube.com/watch?v=jJbIEMGYg-Y",
    "https://www.youtube.com/watch?v=xfedmnemZEQ",
    "https://www.youtube.com/watch?v=13X3054PSvk",
    "https://www.youtube.com/watch?v=UtMoMwohf0k",
    "https://www.youtube.com/watch?v=5pYeoZaoWrA&t=5277s",
    "https://www.youtube.com/watch?v=jBquj9KLgII",
    "https://www.youtube.com/watch?v=Zr3ZOEAzewE&t=3388s",
    "https://www.youtube.com/watch?v=jBquj9KLgII",
    "https://youtu.be/ARa-OiWpTyw",
    "https://youtu.be/Lcr76E28Mdg"

]

const DEFAULT_MSG = ":crimpsonsloper!crimpsonsloper@crimpsonsloper.tmi.twitch.tv PRIVMSG #crimpsonsloper :"

const DURATION_FILTERS = [
    { min: 0, max: 86400 },
    { min: 0, max: 239 },
    { min: 240, max: 1199 },
    { min: 1200, max: 86400 }
]

const SortByUI = ({ checked, handleSort }) => {
    const sortedList = [0, 1, 2, 3].map(i =>
        <Grid item xs={6}>
            <FormControlLabel
                control={
                    <Checkbox
                        size="small"
                        checked={checked[i]}
                        onChange={(e) => handleSort(e, i)}
                    />
                }
                label={<Typography variant="subtitle2" color="#000000">view count</Typography>}
            />
        </Grid>
    )

    return <Grid container>{sortedList}</Grid>
}

const FilterByUI = ({ checked, handleSort }) => {


    return (
        <FormControl size="small">
            <InputLabel size="small" id="duration-select-label" sx={{ color: "#0E212E" }}>Filter</InputLabel>
            <Select
                labelId="duration-select-label"
                id="duration-select"
                value={durationFilter}
                label="Filter"
                onChange={handleFilterChange}
                size="small"
            >
                <MenuItem value={0}><em>All</em></MenuItem>
                <MenuItem value={1}>under 4 minutes</MenuItem>
                <MenuItem value={2}>4 - 20 minutes</MenuItem>
                <MenuItem value={3}>over 20 minutes</MenuItem>
            </Select>
        </FormControl>
    )
}

const GetSmarterApp = () => {
    const user = { username: 'crimpsonsloper' }
    const idList = [];

    const [client, setClient] = useState(null);
    const [readyToConnect, setReadyToConnect] = useState(false);
    const [connected, setConnected] = useState(false);
    const [videos, setVideos] = useState([]);
    const [filteredVideos, setFilteredVideos] = useState([]);
    const [durationFilter, setDurationFilter] = useState(0);
    const [checked, setChecked] = useState([true, false, false, false]);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        setClient(new WebSocket('wss://irc-ws.chat.twitch.tv'))
    }, [])

    useEffect(() => {
        if (client) {
            client.onopen = () => {
                client.send(`PASS oauth:${CLIENT_ID}`);
                client.send(`NICK muddled`);
            };

            client.onerror = (error) => {
                handleAddVariant("Unexpected disconnect. Attempting to reconnect", 'error');
            };

            client.onclose = (event) => {
                console.log(event)
                handleAddVariant(`The connection has been closed.`, 'info');
            };

            client.onmessage = (event) => handleMessage(event)
        }
    }, [client])


    const handleAddVariant = (message, variant) => {
        enqueueSnackbar(message, { variant });
    };

    useEffect(() => {
        runFunctionWithRandomDelay();
    }, [connected])

    const runFunctionWithRandomDelay = () => {
        if (connected) {
            let u = Math.floor(Math.random() * 12);
            let data = DEFAULT_MSG + DEFAULT_URLS[u]
            let rawIrcMessage = data.trimEnd();
            let messages = rawIrcMessage.split("\r\n");

            messages.forEach((message) => {
                let parsedMessage = parseMessage(message);
                const match = parsedMessage.parameters.match(youtubeRegex);
                const id = match && match[7].length == 11 ? match[7] : [];

                if (id.length > 0) {
                    fetchVidData(id, parsedMessage.source['nick'])
                }
            })

            const delay = Math.random() * (3000 - 500) + 500;
            setTimeout(runFunctionWithRandomDelay, delay);
        }

    }

    const handleMessage = (event) => {
        let rawIrcMessage = event.data.trimEnd();
        let messages = rawIrcMessage.split("\r\n");

        messages.forEach((message) => {
            try {
                let parsedMessage = parseMessage(message);
                if (parsedMessage) {
                    console.log(parsedMessage)
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
    }

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

    useEffect(() => {
        console.log(videos, filteredVideos)
    }, [videos, filteredVideos])

    const handleFilterChange = (event) => {
        setDurationFilter(event.target.value);
        let tempVidList = videos.concat(filteredVideos);
        switch (event.target.value) {
            case 0:
                setFilteredVideos([...tempVidList]);
                setVideos([])
                break;

            case 1:
                setFilteredVideos([...tempVidList].filter(video => video.duration < 240));
                setVideos([...tempVidList].filter(video => video.duration >= 240));
                break;

            case 2:
                setFilteredVideos([...tempVidList].filter(video => video.duration >= 240 && video.duration < 1200));
                setVideos([...tempVidList].filter(video => video.duration < 240 && video.duration >= 1200))
                break;

            case 3:
                setFilteredVideos([...tempVidList].filter(video => video.duration >= 1200));
                setVideos([...tempVidList].filter(video => video.duration < 1200));
                break;
        }
        setChecked([true, false, false, false]);
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
                        <CardHeader title="sort by" />
                        <CardContent >
                            <SortByUI handleSort={handleSort} checked={checked} />
                        </CardContent>
                        <CardHeader title="filter by" />
                        <CardContent >

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
                                        fontSize: "30px"
                                    }} />
                                ) : (
                                    <WifiIcon sx={{
                                        color: !connected ? "#96a2b8" : "#2152ff",
                                        mr: 1, my: 0.5,
                                        fontSize: "30px"
                                    }} />
                                )}
                                <Typography variant="h6" fontWeight={"bold"} color={"#0E212E"}>
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
    fontSize: "14px",
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


export const GetSmarterPage = () => {

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
            autoHideDuration={3000}
        >
            <GetSmarterApp />
        </SnackbarProvider>
    );
}
