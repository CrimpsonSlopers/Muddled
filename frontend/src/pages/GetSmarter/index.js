import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import ClientStatusCard from "components/ClientStatusCard";
import VideoGrid from "components/VideoGrid";
import { AuthConsumer } from "utils/auth";
import parseMessage from "utils/irc_message_parser";
import { Button, CardContent, Stack } from "@mui/material";

const CLIENT_ID = "fgj0gbae5f6keu4ivcyip71mi8y2xe";
const MUDDLED_ACCOUNT = "crimpsonslopers";
const youtubeRegex =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;

export default function GetSmarterPage() {
    const { user } = AuthConsumer();
    const [client, setClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [videos, setVideos] = useState([]);
    const [session, setSession] = useState(0);

    useEffect(() => {
        setClient(new WebSocket("ws://irc-ws.chat.twitch.tv:80"));
    }, []);

    useEffect(() => {
        if (session > 0) {
            client.onmessage = (event) => handleMessage(event.data);
        }
    }, [session]);

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
                        const match =
                            parsedMessage.parameters.match(youtubeRegex);
                        const id =
                            match && match[7].length == 11 ? match[7] : [];

                        if (id.length > 0) {
                            addVideo(id, parsedMessage.source["nick"]);
                        }
                        break;

                    case "JOIN":
                        console.log(`Joining ${user.username}'s channel`);
                        break;

                    case "PART":
                        console.log(`Leaving ${user.username}'s channel`);
                        break;

                    case "PING":
                        console.log(
                            "Responding to client with: PONG ",
                            parsedMessage.parameters
                        );
                        client.send(`PONG ${parsedMessage.parameters}`);
                        break;

                    case "001":
                        console.log("Connected and ready to join channel");
                        break;
                }
            }
        });
    };

    const addVideo = async (id, login) => {
        try {
            const response = await fetch("/api/video-submitted", {
                method: "POST",
                headers: {
                    "X-CSRFToken": Cookies.get("csrftoken"),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    session_id: session,
                    video_id: id,
                    login: login,
                }),
            });

            if (response.status === 200) {
                const data = await response.json();
                setVideos((oldArray) => [...oldArray, data.results]);
            } else {
                throw new Error(
                    `Unexpected response status: ${response.status}`
                );
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
                    "X-CSRFToken": Cookies.get("csrftoken"),
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                client.send(`JOIN #${user.username}`);
                setSession(data.id);
                setConnected(true);
            } else {
                throw new Error(
                    `Unexpected response status: ${response.status}`
                );
            }
        } catch (err) {
            console.debug(err);
        }
    };

    const handleConnect = () => {
        if (connected) {
            client.send(`PART #${user.username}`);
            setConnected(false);
        } else {
            newSession();
        }
    };

    const handleUpdateVideo = (videos) => {
        setVideos(videos);
    };

    const handleSortByViews = () => {
        const sorted = [...videos].sort((a, b) => {
            return b.view_count - a.view_count;
        });
        setVideos(sorted);
    };

    const handleSortByDuration = () => {
        const sorted = [...videos].sort((a, b) => {
            return a.duration - b.duration;
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
                        session={session}
                        videos={videos}
                        onSaveVideo={saveVideo}
                        onMuteViewer={muteViewer}
                    />
                </Grid>
            </Box>
            <Drawer
                sx={{
                    width: "20vw",
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: "20vw",
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
                                <Button onClick={handleSortByDuration}>
                                    Sort By Likes
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                    <ClientStatusCard
                        connected={connected}
                        handleConnect={handleConnect}
                    />
                </Stack>
            </Drawer>
        </Box>
    );
}
