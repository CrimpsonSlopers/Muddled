import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import VideoGrid from "components/VideoGrid";
import NavItems from "components/NavItems";

export default function Archives() {
    const [sessions, setSessions] = useState([]);
    const [videos, setVideos] = useState([]);
    const [session, setSession] = useState();

    useEffect(() => {
        getSessionIds();
        vids();
    }, []);

    const vids = async () => {
        try {
            const response = await fetch(`/api/video`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                const data = await response.json();
                setVideos(data);
            } else {
                throw new Error(
                    `Unexpected response status: ${response.status}`
                );
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
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                const data = await response.json();
                setSession(0);
                setVideos(data);
            } else {
                throw new Error(
                    `Unexpected response status: ${response.status}`
                );
            }
        } catch (err) {
            console.error(err);
        }
    };

    const getSessionIds = async () => {
        try {
            const response = await fetch(`/api/archive-ids`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                const data = await response.json();
                setSessions(data);
            } else {
                throw new Error(
                    `Unexpected response status: ${response.status}`
                );
            }
        } catch (err) {
            console.error(err);
        }
    };

    const getVideosBySession = async (session_id) => {
        try {
            const response = await fetch(`/api/archives/${session_id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                const data = await response.json();
                setVideos(data);
            } else {
                throw new Error(
                    `Unexpected response status: ${response.status}`
                );
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleNavClick = (session) => {
        setSession(session.id);
        getVideosBySession(session.id);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <Drawer
                sx={{
                    width: "220px",
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: "220px",
                        boxSizing: "border-box",
                        border: "none",
                        backgroundColor: "transparent",
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
                    pt={1}
                >
                    <Typography
                        variant="h3"
                        fontWeight="bold"
                        textTransform="uppercase"
                        color="#7222C2"
                    >
                        ATRIOC
                    </Typography>
                </Box>
                <Box overflow={"auto"}>
                    <List>
                        <ListItem
                            key={0}
                            component="li"
                            sx={{ padding: "0" }}
                            onClick={getSavedVideos}
                        >
                            <Box
                                sx={{
                                    background:
                                        session == 0 ? "white" : "transparent",
                                    color:
                                        session == 0
                                            ? "#7222C2"
                                            : "rgba(0, 0, 0, 0.6)",
                                    display: "flex",
                                    alignItems: "center",
                                    width: "100%",
                                    padding: "8px 16px",
                                    margin: "2px 12px",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    userSelect: "none",
                                    whiteSpace: "nowrap",
                                    boxShadow:
                                        session == 0
                                            ? "rgba(33, 35, 38, 0.1) 0px 10px 10px -10px;"
                                            : "none",
                                    transition: "all 0.35s ease-in-out",
                                    "&:hover, &:focus": {
                                        backgroundColor:
                                            session == 0 ? null : "white",
                                        boxShadow:
                                            "rgba(33, 35, 38, 0.1) 0px 10px 10px -10px;",
                                    },
                                }}
                            >
                                <ListItemText
                                    primary={"Saved Videos"}
                                    sx={{
                                        "& span": {
                                            fontWeight:
                                                session == -1 ? 500 : 300,
                                        },
                                    }}
                                />
                            </Box>
                        </ListItem>
                        <Divider variant="middle" />
                        <NavItems
                            sessions={sessions}
                            session={session}
                            onNavClick={handleNavClick}
                        />
                    </List>
                </Box>
            </Drawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    padding: 2,
                    overflow: "auto",
                    height: "100vh",
                }}
            >
                <Grid container spacing={2} justifyContent={"center"}>
                    <VideoGrid archive={true} videos={videos} />
                </Grid>
            </Box>
        </Box>
    );
}
