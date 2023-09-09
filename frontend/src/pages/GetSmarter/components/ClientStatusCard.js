import React from "react";

import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Card from '@mui/material/Card';

import TextField from '@mui/material/TextField';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import WifiIcon from '@mui/icons-material/Wifi';


export default function ClientStatusCard({ connected, handleConnect, channel, updateChannel }) {

    return (
        <Card sx={{
            'padding': '1rem',
            'width': '100%'
        }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', pb: "1rem" }}>
                {connected
                    ? <WifiIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                    : <WifiOffIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                }
                <TextField
                    id="standard-basic"
                    value={channel}
                    variant="standard"
                    onChange={event => {
                        updateChannel(event.target.value)
                    }}
                    onFocus={event => {
                        event.target.select();
                    }}
                />
            </Box>
            <Box
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                display="flex"
            >
                <Button size="small" onClick={handleConnect} variant="contained">{connected ? "Disconnect" : "Connect"}</Button>
            </Box>
        </Card>
    )
}