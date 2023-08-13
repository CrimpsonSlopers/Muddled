import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

import { Grid, Box, CardContent, Typography, CardActions, Chip, IconButton } from '@mui/material';

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import YouTubeVideo from './YoutubeVideo';
import YouTubeThumbnail from './YoutubeThumbnail';
import BulletPoint from 'components/BulletPoint';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

import { formatPublished, formatViewsLikes } from '../helpers';


export default function VideoGrid({ videos, onUpdateVideo }) {
    const [selectedVideo, setSelectedVideo] = useState(null);

    const saveVideo = async (index) => {
        try {
            const updatedVideo = { ...videos[index] };
            updatedVideo.watch_later = !updatedVideo.watch_later;

            const response = await fetch(`/api/video/${updatedVideo.id}`, {
                method: "PUT",
                headers: {
                    "X-CSRFToken": Cookies.get('csrftoken'),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedVideo)
            });

            if (response.status === 200) {
                const data = await response.json();
                const updatedVideos = [...videos];
                updatedVideos[index] = data.results;
                onUpdateVideo(updatedVideos);
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
            viewer.muted = true;

            const response = await fetch(`/api/viewer/${viewer.login}`, {
                method: "PUT",
                headers: {
                    "X-CSRFToken": Cookies.get('csrftoken'),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(viewer)
            });

            if (response.status === 200) {
                const data = await response.json();
                const updatedVideos = [...videos];
                updatedVideos[index].viewer.muted = true;
                onUpdateVideo(updatedVideos);
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
                            ? <YouTubeVideo id={video.video_id} />
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
                        <IconButton aria-label="delete" size="large" onClick={() => muteViewer(index)}>
                            <VolumeOffIcon />
                        </IconButton>
                        <IconButton aria-label="delete" size="large" onClick={() => saveVideo(index)}>
                            {video.watch_later ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        </IconButton>
                    </Box>
                </Box>
            </Grid>
        );
    });
}
