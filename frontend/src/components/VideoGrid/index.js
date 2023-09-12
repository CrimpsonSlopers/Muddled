import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

import { Grid, Box, CardContent, Typography, Chip, IconButton } from '@mui/material';

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';


import { formatPublished, formatViewsLikes } from 'utils/video_formatters';

import BulletPoint from 'components/BulletPoint';
import YouTubeVideo from 'components/YoutubeVideo';
import YouTubeThumbnail from 'components/YoutubeThumbnail';


export default function VideoGrid({ videos, onUpdateVideo }) {
    const [selectedVideo, setSelectedVideo] = useState(null);

    const saveVideo = async (index) => {
        try {
            const video = { ...videos[index] };
            const response = await fetch(`/api/video/${video.id}`, {
                method: "PATCH",
                headers: {
                    "X-CSRFToken": Cookies.get('csrftoken'),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ watch_later: !video.watch_later })
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

                onUpdateVideo(newVideos);
            } else {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const muteViewer = async (index) => {
        try {
            const viewer = { ...videos[index].viewer };
            const response = await fetch(`/api/viewer/${viewer.login}`, {
                method: "PUT",
                headers: {
                    "X-CSRFToken": Cookies.get('csrftoken'),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...viewer,
                    muted: !viewer.muted,
                })
            });

            if (response.status === 200) {
                const data = await response.json();
                const newVideos = videos.map((video) => {
                    if (video.viewer.login === data.results.login) {
                        const updatedVideo = {
                            ...video,
                            viewer: data.results,
                        };

                        return updatedVideo;
                    }

                    return video;
                });

                onUpdateVideo(newVideos);
            } else {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return videos.map((video, index) => {
        let active = (selectedVideo === index);

        return (
            <Grid item key={index} xs="auto">
                <Box display={"flex"} flexDirection={"column"} width={"320px"}>
                    <Box position="relative" onClick={() => setSelectedVideo(index)}>
                        {active
                            ? <YouTubeVideo video={video} />
                            : <YouTubeThumbnail video={video} />
                        }
                    </Box>
                    <CardContent sx={{ padding: '.25rem', color: 'rgba(0,0,0,0.7)' }}>
                        <Typography variant="body1" gutterBottom sx={{ color: "black" }}>{video.title}</Typography>
                        <Typography variant="subtitle2">{video.channel_name}</Typography>
                        <Typography variant="overline">
                            {formatViewsLikes(video.view_count)} views {<BulletPoint />} {formatViewsLikes(video.like_count)} likes {<BulletPoint />} {formatPublished(video.published_at)} ago
                        </Typography>
                    </CardContent>
                    <Box
                        display="flex"
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Chip size="small" label={`submitted by: ${video.viewer.login}`} />
                        <IconButton size="large" onClick={() => muteViewer(index)}>
                            {video.viewer.muted ? <VolumeUpIcon /> : <VolumeOffIcon />}
                        </IconButton>
                        <IconButton size="large" onClick={() => saveVideo(index)}>
                            {video.watch_later ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        </IconButton>
                    </Box>
                </Box>
            </Grid>
        );
    });
}
