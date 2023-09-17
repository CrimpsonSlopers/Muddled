import React, { useEffect, useState } from "react";
import LazyLoad from "react-lazy-load";

import {
    Grid,
    Box,
    CardContent,
    Typography,
    Chip,
    IconButton,
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



export default function VideoGrid({
    videos,
    archive,
    onSaveVideo = () => { },
    onMuteViewer = () => { },
}) {
    const [selectedVideo, setSelectedVideo] = useState(null);

    return videos.map((video, index) => {
        let active = selectedVideo === index;

        return (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3} xxl={12 / 5}>
                <LazyLoad height={350} >
                    <Box display={"flex"} flexDirection={"column"}>
                        <Box position="relative">
                            {active ? (
                                <iframe
                                    width={"320px"}
                                    height={"180px"}
                                    src={`https://www.youtube.com/embed/${video.video_id}?&rel=0`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share"
                                    frameborder="0"
                                    allowfullscreen
                                ></iframe>
                            ) : (
                                <Box onClick={() => setSelectedVideo(index)}>
                                    <Box
                                        component="img"
                                        src={video.thumbnail_url}
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
                                        size="small"
                                        label={formatDuration(video.duration)}
                                    />
                                </Box>
                            )}
                        </Box>
                        <CardContent sx={{ padding: ".25rem" }}>
                            <Typography
                                variant="body1"
                                gutterBottom
                                sx={{ color: "black" }}
                            >
                                {video.title}
                            </Typography>
                            <Typography variant="subtitle2">
                                {video.channel_name}
                            </Typography>
                            <Typography variant="overline">
                                {formatViewsLikes(video.view_count)} views{" "}
                                {<BulletPoint />}{" "}
                                {formatViewsLikes(video.like_count)} likes{" "}
                                {<BulletPoint />}{" "}
                                {formatPublished(video.published_at)} ago
                            </Typography>

                            {archive ? (
                                <Box
                                    display="flex"
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Chip
                                        size="small"
                                        label={`submitted by: ${video.viewer.username}`}
                                    />
                                </Box>
                            ) : (
                                <Box
                                    display="flex"
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Chip
                                        size="small"
                                        label={video.viewer.username}
                                    />
                                    <IconButton
                                        sx={{ ml: "auto" }}
                                        onClick={onMuteViewer(index)}
                                    >
                                        {video.viewer.muted ? (
                                            <VolumeUpIcon />
                                        ) : (
                                            <VolumeOffIcon />
                                        )}
                                    </IconButton>
                                    <IconButton onClick={onSaveVideo(index)}>
                                        {video.watch_later ? (
                                            <FavoriteIcon />
                                        ) : (
                                            <FavoriteBorderIcon />
                                        )}
                                    </IconButton>
                                </Box>
                            )}
                        </CardContent>
                    </Box>
                </LazyLoad>
            </Grid>
        );
    });
}
