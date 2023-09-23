import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import moment from 'moment';
import Cookies from "js-cookie";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";

import ClientStatusCard from "components/ClientStatusCard";
import VideoGrid from "components/VideoGrid";
import parseMessage from "utils/irc_message_parser";
import { Button, CardContent, Stack } from "@mui/material";

const YOUTUBE_API_KEY = "AIzaSyBDR0OdMSLxUC8H_8wtkOJLakfoUrdBwXA";
const CLIENT_ID = "fgj0gbae5f6keu4ivcyip71mi8y2xe";
const MUDDLED_ACCOUNT = "crimpsonslopers";
const youtubeRegex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;


export const GetSmarterPage = () => {
    const { user } = useAuth();
    const [client, setClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [videos, setVideos] = useState([]);
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
                        channelTitle: video.snippet.channelTitle,
                        publishedAt: video.snippet.publishedAt,
                        title: video.snippet.title,
                    }
                    setVideos(oldState => [...oldState, newVideo]);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleConnect = () => {
        if (connected) {
            client.send(`PART #${user.username}`);
            setConnected(false);
        } else {
            client.send(`JOIN #${user.username}`);
            setConnected(true);
        }
    };

    const handleSortByDuration = () => {
        const sorted = [...videos].sort((a, b) => {
            return a.duration - b.duration;
        });
        setVideos(sorted);
    };

    const handleSortByViews = () => {
        const sorted = [...videos].sort((a, b) => {
            return b.viewCount - a.viewCount;
        });
        setVideos(sorted);
    };

    const handleSortByLikes = () => {
        const sorted = [...videos].sort((a, b) => {
            return b.likeCount - a.likeCount;
        });
        setVideos(sorted);
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
                        videos={videos}
                        onSaveVideo={saveVideo}
                        onMuteViewer={muteViewer}
                    />
                </Grid>
            </Box>
            <Drawer
                sx={{
                    width: "300px",
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: "300px",
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
                                <Button onClick={handleSortByDuration}>
                                    Sort By Duration
                                </Button>
                                <Button onClick={handleSortByViews}>
                                    Sort By Views
                                </Button>
                                <Button onClick={handleSortByLikes}>
                                    Sort By Likes
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                    <ClientStatusCard
                        connected={connected}
                        handleConnect={handleConnect}
                        user={user}
                    />
                </Stack>
            </Drawer>
        </Box>
    );
}
