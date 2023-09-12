import React from "react";

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

import { formatDuration } from "utils/video_formatters.js";


export default function YouTubeThumbnail({ video }) {
    console.log(video)
    return (
        <>
            <Box
                component="img"
                src={video.thumbnail_url}
                sx={{ cursor: "pointer", height: "180", width: "320", borderRadius: '8px' }}
            />
            <Chip
                sx={{ position: "absolute", bottom: "12px", right: "8px", backgroundColor: "black", color: "white" }}
                size="small"
                label={formatDuration(video.duration)}
            />
        </>
    )

}