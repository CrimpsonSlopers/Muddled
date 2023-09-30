import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import moment, { duration } from 'moment';
import Cookies from "js-cookie";

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
import TextField from '@mui/material/TextField';
import Typography from "@mui/material/Typography";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import WifiIcon from "@mui/icons-material/Wifi";

import VideoGrid from "components/VideoGrid";
import parseMessage from "utils/irc_message_parser";


const YOUTUBE_API_KEY = "AIzaSyBDR0OdMSLxUC8H_8wtkOJLakfoUrdBwXA";
const CLIENT_ID = "fgj0gbae5f6keu4ivcyip71mi8y2xe";
const MUDDLED_ACCOUNT = "crimpsonslopers";
const youtubeRegex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;

const vid_id = [
    "qbnFp80VSMU",
    "fax3T1B",
    "fMPTSiOuNpA",
    "Bkq0Vhm4TK4",
    "cfc97iswJIc",
    "EAgnVFX2pl8",
    "HsLLm2CBDUY",
]


export const GetSmarterPage = () => {
    const { user } = useAuth();
    const [client, setClient] = useState(null);
    const [ready, setReady] = useState(false);
    const [connected, setConnected] = useState(false);
    const [videos, setVideos] = useState([]);
    const [filteredVideos, setFilteredVideos] = useState([]);
    const [durationFilter, setDurationFilter] = useState(0);
    const [checked, setChecked] = useState([true, false, false, false]);
    let vidIds = [];

    useEffect(() => {
        setClient(new WebSocket("wss://irc-ws.chat.twitch.tv"));
    }, []);

    useEffect(() => {
        if (client) {
            client.onopen = () => {
                client.send(`PASS oauth:${CLIENT_ID}`);
                client.send(`NICK ${MUDDLED_ACCOUNT}`);
            };

            client.onerror = (error) => {
                console.log("Connect Error: " + error.toString());
            };

            client.onclose = () => {
                console.log("The connection has been closed successfully.");
            };

            client.onmessage = (event) => handleMessage(event.data);
        }
    }, [client]);

    const handleMessage = (data) => {
        let rawIrcMessage = data.trimEnd();
        let messages = rawIrcMessage.split("\r\n");

        messages.forEach((message) => {
            let parsedMessage = parseMessage(message);
            if (parsedMessage) {
                switch (parsedMessage.command.command) {
                    case "PRIVMSG":
                        console.log(parsedMessage)
                        const match = parsedMessage.parameters.match(youtubeRegex);
                        const id = match && match[7].length == 11 ? match[7] : [];

                        if (id.length > 0 && !vidIds.includes(id)) {
                            vidIds.push(id);
                            fetchVideoData(id, parsedMessage.source["nick"]);
                        }
                        break;

                    case "JOIN":
                        console.log(`Joining ${user.username}'s channel`);
                        break;

                    case "PART":
                        console.log(`Leaving ${user.username}'s channel`);
                        break;

                    case "PING":
                        console.log("Responding to client with: PONG ", parsedMessage.parameters);
                        client.send(`PONG ${parsedMessage.parameters}`);
                        break;

                    case "001":
                        console.log("Connected and ready to join channel");
                        setReady(true);
                        break;
                }
            }
        });
    };

    const fetchVideoData = async (videoId, chatter) => {
        try {
            const response = await fetch(
                `https://youtube.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails,statistics&key=${YOUTUBE_API_KEY}`
            );
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data)
            if (data.pageInfo.totalResults == 1) {
                let video = data.items[0];
                if (video.kind == "youtube#video") {
                    let newVideo = {
                        id: videoId,
                        chatter: chatter,
                        duration: moment.duration(video.contentDetails.duration).asSeconds(),
                        viewCount: video.statistics.viewCount,
                        likeCount: video.statistics.likeCount,
                        thumbnailUrl: video.snippet.thumbnails.medium.url,
                        channelId: video.snippet.channelId,
                        channelTitle: video.snippet.channelTitle,
                        publishedAt: video.snippet.publishedAt,
                        title: video.snippet.title,
                        submittedAt: Date.now()
                    }
                    setVideos(oldState => [...oldState, newVideo]);

                    if (durationFilter == 0) {
                        setFilteredVideos(oldState => [...oldState, newVideo]);
                    } else if (durationFilter == 1 && newVideo.duration < 240) {
                        setFilteredVideos(oldState => [...oldState, newVideo]);
                    } else if (durationFilter == 2 && newVideo.duration >= 240 && newVideo.duration < 1200) {
                        setFilteredVideos(oldState => [...oldState, newVideo]);
                    } else if (durationFilter == 3 && newVideo.duration >= 1200) {
                        setFilteredVideos(oldState => [...oldState, newVideo]);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleConnect = () => {
        if (connected) {
            client.send(`PART #${user.username}`);
        } else {
            client.send(`JOIN #${user.username}`);
        }
        setConnected(!connected);
    };

    const handleDurationFilterChange = (event) => {
        setDurationFilter(event.target.value);
        switch (event.target.value) {
            case 0:
                setFilteredVideos(videos);
                break;

            case 1:
                setFilteredVideos(videos.filter(video => video.duration < 240));
                break;

            case 2:
                setFilteredVideos(videos.filter(video => video.duration >= 240 && video.duration < 1200));
                break;

            case 3:
                setFilteredVideos(videos.filter(video => video.duration >= 1200));
                break;
        }

    };

    const saveVideo = async (index) => {
        try {
            const video = { ...videos[index] };
            const response = await fetch(`/api/video/${video.id}`, {
                method: "PATCH",
                headers: {
                    "X-CSRFToken": Cookies.get("csrftoken"),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ watch_later: !video.watch_later }),
            });

            if (response.status === 200) {
                const data = await response.json();
                const newVideos = videos.map((video) => {
                    if (video.id === data.results.id) {
                        const updatedVideo = {
                            ...video,
                            watch_later: data.results.watch_later,
                        };
                        return updatedVideo;
                    }
                    return video;
                });
                setVideos(newVideos);
            } else {
                throw new Error(
                    `Unexpected response status: ${response.status}`
                );
            }
        } catch (err) {
            console.error(err);
        }
    };

    const muteViewer = async (index) => {
        try {
            const viewer = { ...videos[index].viewer };
            const response = await fetch(`/api/viewer/${viewer.username}`, {
                method: "PUT",
                headers: {
                    "X-CSRFToken": Cookies.get("csrftoken"),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...viewer,
                    muted: !viewer.muted,
                }),
            });

            if (response.status === 200) {
                const data = await response.json();
                const newVideos = videos.map((video) => {
                    if (video.viewer.username === data.results.username) {
                        const updatedVideo = {
                            ...video,
                            viewer: data.results,
                        };

                        return updatedVideo;
                    }

                    return video;
                });

                setVideos(newVideos);
            } else {
                throw new Error(
                    `Unexpected response status: ${response.status}`
                );
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange1 = (event) => {
        setChecked([event.target.checked, false, false, false]);
        const sorted = [...filteredVideos].sort((a, b) => {
            return a.submittedAt - b.submittedAt;
        });
        setFilteredVideos(sorted);
    };

    const handleChange2 = (event) => {
        setChecked([false, event.target.checked, false, false]);
        const sorted = [...filteredVideos].sort((a, b) => {
            return a.duration - b.duration;
        });
        setFilteredVideos(sorted);
    };

    const handleChange3 = (event) => {
        setChecked([false, false, event.target.checked, false]);
        const sorted = [...filteredVideos].sort((a, b) => {
            return b.viewCount - a.viewCount;
        });
        setFilteredVideos(sorted);
    };

    const handleChange4 = (event) => {
        setChecked([false, false, false, event.target.checked]);
        const sorted = [...filteredVideos].sort((a, b) => {
            return b.likeCount - a.likeCount;
        });
        setFilteredVideos(sorted);
    };

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
                    spacing={2}
                >
                    <VideoGrid
                        videos={filteredVideos}
                        onSaveVideo={saveVideo}
                        onMuteViewer={muteViewer}
                    />
                </Grid>
            </Box>
            <Drawer
                sx={{
                    width: "320px",
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: "320px",
                        boxSizing: "border-box",
                        border: "none",
                        backgroundColor: "transparent",
                        p: 2,
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
                        <CardContent>
                            <Stack direction={"column"} spacing={2}>
                                <Typography variant="body1" fontWeight={"bold"}>
                                    sort by
                                </Typography>
                                <Stack direction={"row"} spacing={2}>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={checked[0]} onChange={handleChange1} />} label="default" />
                                        <FormControlLabel control={<Checkbox checked={checked[1]} onChange={handleChange2} />} label="duration" />
                                    </FormGroup>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={checked[2]} onChange={handleChange3} />} label="views" />
                                        <FormControlLabel control={<Checkbox checked={checked[3]} onChange={handleChange4} />} label="likes" />
                                    </FormGroup>
                                </Stack>
                                <Typography variant="body1" fontWeight={"bold"}>
                                    filter
                                </Typography>
                                <FormControl size="small">
                                    <InputLabel id="duration-select-label">Filter</InputLabel>
                                    <Select
                                        labelId="duration-select-label"
                                        id="duration-select"
                                        value={durationFilter}
                                        label="Filter"
                                        onChange={handleDurationFilterChange}
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
                                spacing={1}
                                pb={3}
                            >
                                {connected ? (
                                    <WifiIcon
                                        sx={{ color: "action.active", mr: 1, my: 0.5 }}
                                    />
                                ) : (
                                    <WifiOffIcon
                                        sx={{ color: "action.active", mr: 1, my: 0.5 }}
                                    />
                                )}
                                <Typography variant="body1" fontWeight={"bold"}>
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
                                    size="small"
                                    onClick={handleConnect}
                                    variant="contained"
                                    disabled={!ready}
                                >
                                    {connected ? "Disconnect" : "Connect"}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Stack>
            </Drawer>
        </Box>
    );
}
