import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";

import Typography from "@mui/material/Typography";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import WifiIcon from "@mui/icons-material/Wifi";

export default function ClientStatusCard({ connected, handleConnect, user }) {

    return (
        <Card width="100%" variant="outlined">
            <CardContent>
                <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={1}
                    pb={3}
                >
                    {connected ? (
                        <WifiIcon
                            sx={{ color: "action.active", mr: 1, my: 0.5 }}
                        />
                    ) : (
                        <WifiOffIcon
                            sx={{ color: "action.active", mr: 1, my: 0.5 }}
                        />
                    )}
                    <Typography variant="subheader1" fontWeight={"bold"}>
                        {user.username}
                    </Typography>
                </Stack>
                <Box
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    display="flex"
                >
                    <Button
                        size="small"
                        onClick={handleConnect}
                        variant="contained"
                    >
                        {connected ? "Disconnect" : "Connect"}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}
