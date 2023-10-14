import React, { useEffect, useState } from "react";

import {
    Grid,
    Box,
    CardContent,
    Typography,
    Chip,
    IconButton,
    Stack,
} from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";

import {
    formatPublished,
    formatViewsLikes,
    formatDuration,
} from "utils/video_formatters";

import BulletPoint from "components/BulletPoint";

import "components/VideoGrid/styles/VideoGrid.css"


export default function VideoGrid({ videos }) {
    const [selectedVideo, setSelectedVideo] = useState(null);

    return videos.map((video, index) => {
        let active = selectedVideo === index;

        return (
            <Grid item key={index} xs={12} sm={6} lg={4}>
                <Box display={"flex"} flexDirection={"column"}>
                    <Box position="relative">
                        {active ? (
                            <div id="video">
                                <iframe
                                    width={"100%"}
                                    height={"100%"}
                                    src={`https://www.youtube.com/embed/${video.id}?&rel=0`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share"
                                    frameborder="0"
                                    allowfullscreen="allowfullscreen"
                                ></iframe>
                            </div>
                        ) : (
                            <Box onClick={() => setSelectedVideo(index)}>
                                <Box
                                    component="img"
                                    src={video.thumbnailUrl}
                                    sx={{
                                        cursor: "pointer",
                                        width: "100%",
                                        borderRadius: "8px",
                                    }}
                                />
                                <Chip
                                    sx={{
                                        position: "absolute",
                                        bottom: "12px",
                                        right: "8px",
                                        backgroundColor: "black",
                                        color: "white",
                                    }}
                                    label={formatDuration(video.duration)}
                                />
                            </Box>
                        )}
                    </Box>
                    <Box>
                        <Typography
                            variant="body1"
                            gutterBottom
                            fontWeight={600}
                            fontSize={"20px"}
                            lineHeight={"1.5"}
                            margin={0}
                            sx={{ color: "#0f0f0f" }}
                        >
                            {video.title}
                        </Typography>
                        <Typography
                            fontSize={"18px"}
                            lineHeight="2.5"
                            fontWeight={500}
                        >
                            <a
                                style={{
                                    color: "#606060",
                                    textDecoration: "none",
                                }}
                                href={`https://www.youtube.com/channel/${video.channelId}`}
                                target="_blank"
                            >
                                {video.channelTitle}
                            </a>
                        </Typography>
                        <Stack direction={"row"} alignContent={"center"} spacing={1} color="#606060" marginBottom={"16px"}>
                            <Typography variant="overline" fontSize="16px" lineHeight="1.5" fontWeight={500}>
                                {formatViewsLikes(video.viewCount)} views
                            </Typography>
                            <BulletPoint />
                            <Typography variant="overline" fontSize="16px" fontWeight={500} lineHeight="1.5">
                                {formatViewsLikes(video.likeCount)} likes
                            </Typography>
                            <BulletPoint />
                            <Typography variant="overline" fontSize="16px" fontWeight={500} lineHeight="1.5">
                                {formatPublished(video.publishedAt)} ago
                            </Typography>
                        </Stack>
                        <Box
                            display="flex"
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Chip label={video.submittedBy} />
                            <IconButton onClick={(event) => onSaveVideo(index)}>
                                {video.chatter ? (
                                    <FavoriteIcon />
                                ) : (
                                    <FavoriteBorderIcon />
                                )}
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            </Grid >
        );
    });
}
