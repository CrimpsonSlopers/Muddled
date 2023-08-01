import React from "react";
import { useNavigate } from "react-router-dom";

import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';

import WifiOffIcon from '@mui/icons-material/WifiOff';
import WifiIcon from '@mui/icons-material/Wifi';


export default function Sidenav({ connectionStatus, connectionStatusText }) {

    const WebsocketUI = () => {
        let connected = (connectionStatus == "Connected!")

        return (
            <Card>
                <CardHeader
                    avatar={connected ? <WifiIcon color="success" /> : <WifiOffIcon />}
                    title={connectionStatus}
                    subheader={connectionStatusText}
                />
            </Card>
        )
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
            <Box
                display="flex"
                alignItems="center"
                textAlign="center"
                justifyContent="center"
                pt={3}
                pb={1}
            >
                <Typography
                    variant="h2"
                    fontWeight="bold"
                    textTransform="uppercase"
                    color="#7222C2"
                    letterSpacing="5px"
                >
                    Atrioc
                </Typography>
            </Box>
            <Box mt="auto" p={1}>
                <WebsocketUI />
            </Box>
        </Drawer>
    )
}