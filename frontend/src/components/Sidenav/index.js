import React from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import WifiOffIcon from '@mui/icons-material/WifiOff';
import WifiIcon from '@mui/icons-material/Wifi';
import Switch from '@mui/material/Switch';
import AddIcon from '@mui/icons-material/Add';
import { Button } from "@mui/material";


export default function Sidenav({ sessions, connectionStatus }) {

    const renderSession = sessions.map(session => {
        let returnValue;
        let active = (session.id === parseInt(streamSession));

        returnValue = (
            <NavLink key={session.id} to={`${session.id}`}>
                <ListItem component="li" sx={{ padding: "0" }}>
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
                            primary={formatDate(session.created_at)}
                            sx={{
                                "& span": {
                                    fontWeight: active ? 500 : 300,
                                },
                            }}
                        />
                    </Box>
                </ListItem>
            </NavLink>
        )
        return returnValue
    })

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    const handleClickSavedVideos = (e) => {
        console.log(e)
    }

    const handleConnectButtonClicked = (e) => {
        console.log(e)
    }

    return (
        <Drawer
            sx={{
                width: '300px',
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: '300px',
                    boxSizing: 'border-box',
                    border: "none",
                    backgroundColor: "transparent"
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <Box display="flex" alignItems="center" textAlign="center" justifyContent="center" py={1} >
                <Typography variant="h2" fontWeight="bold" textTransform="uppercase" color="#7222C2" letterSpacing="2px" >
                    ATRIOC
                </Typography>
            </Box >

            <Box overflow={"auto"}>
                <List>
                    {renderSession}
                </List>
            </Box>
            <Box mt="auto" ml="auto" p={3} width="250px">
                <ConnectionStatusCard connectionStatus={connectionStatus} onConnectButtonClicked={handleConnectButtonClicked} />
            </Box>
        </Drawer>
    )
}