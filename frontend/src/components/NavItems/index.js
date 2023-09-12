import React from "react";

import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';


export default function NavItems({ sessions, session, onNavClick }) {
    return sessions.map((sess, index) => {
        let active = (session === sess.id);

        return (
            <ListItem key={index} component="li" sx={{ padding: "0" }} onClick={(index) => onNavClick(sess)}>
                <Box
                    sx={{
                        background: active ? "white" : "transparent",
                        color: active ? "#7222C2" : "rgba(0, 0, 0, 0.6)",
                        display: "flex",
                        alignItems: "center",
                        width: '100%',
                        padding: '8px 16px',
                        margin: '2px 12px',
                        borderRadius: '4px',
                        cursor: "pointer",
                        userSelect: "none",
                        whiteSpace: "nowrap",
                        boxShadow: active ? 'rgba(33, 35, 38, 0.1) 0px 10px 10px -10px;' : "none",
                        transition: 'all 0.35s ease-in-out',
                        "&:hover, &:focus": {
                            backgroundColor: active ? null : "white",
                            boxShadow: 'rgba(33, 35, 38, 0.1) 0px 10px 10px -10px;',
                        },
                    }}
                >
                    <ListItemText
                        primary={(sess.created_at)}
                        sx={{
                            "& span": {
                                fontWeight: active ? 500 : 300,
                            },
                        }}
                    />
                </Box>
            </ListItem>
        )
    })
}