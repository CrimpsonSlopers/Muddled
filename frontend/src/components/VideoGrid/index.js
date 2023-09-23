import React, { useEffect, useState } from "react";
import moment from 'moment';
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
    onSaveVideo,
    onMuteViewer,
}) {
    const [selectedVideo, setSelectedVideo] = useState(null);

    return videos.map((video, index) => {
        let active = selectedVideo === index;

        return (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                <Box display={"flex"} flexDirection={"column"}>
                    <Box position="relative">
                        {active ? (
                            <iframe
                                width={"100%"}
                                src={`https://www.youtube.com/embed/${video.id}?&rel=0`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share"
                                frameborder="0"
                                allowfullscreen
                            ></iframe>
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
                            {video.channelName}
                        </Typography>
                        <Typography variant="overline">
                            {formatViewsLikes(video.viewCount)} views{" "}
                            {<BulletPoint />}{" "}
                            {formatViewsLikes(video.likeCount)} likes{" "}
                            {<BulletPoint />}{" "}
                            {formatPublished(video.publishedAt)} ago
                        </Typography>
                        <Box
                            display="flex"
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Chip
                                size="small"
                                label={video.chatter}
                            />
                            <IconButton
                                sx={{ ml: "auto" }}
                                onClick={(event) => onMuteViewer(index)}
                            >
                                {video.chatter ? (
                                    <VolumeUpIcon />
                                ) : (
                                    <VolumeOffIcon />
                                )}
                            </IconButton>
                            <IconButton onClick={(event) => onSaveVideo(index)}>
                                {video.chatter ? (
                                    <FavoriteIcon />
                                ) : (
                                    <FavoriteBorderIcon />
                                )}
                            </IconButton>
                        </Box>
                    </CardContent>
                </Box>
            </Grid>
        );
    });
}
