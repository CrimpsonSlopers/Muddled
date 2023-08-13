import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';

import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Card from '@mui/material/Card';
import CardActions from "@mui/material/CardActions";
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { formatStreamDate } from "../helpers";


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
                        primary={formatStreamDate(sess.created_at)}
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