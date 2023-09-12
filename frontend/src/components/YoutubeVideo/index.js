import React from "react";

export default function YouTubeVideo({ video }) {

    return (
        <iframe
            width={'320px'}
            height={'180px'}
            src={`https://www.youtube.com/embed/${video.video_id}?&rel=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share"
            frameborder="0"
            allowfullscreen
        ></iframe>
    )
}