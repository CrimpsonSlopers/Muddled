import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';


import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';

import WifiOffIcon from '@mui/icons-material/WifiOff';
import WifiIcon from '@mui/icons-material/Wifi';

import parseMessage from "../../utils/irc_message_parser";

const password = "oauth:midf6aaz8hgc14usszu0dgmmo2gqdd";
const account = 'muddle';
const channel = '#crimpsonsloper';

function getDayOfWeek(date) {
    const dayOfWeek = new Date(date).getDay();
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek].toUpperCase();
}

const renderLetters = (tickerString) => {
    return tickerString.split("").map((character, index) => {
        if (character == " ") {
            return (
                <Box
                    key={index}
                    sx={{
                        border: '0',
                        display: 'inline-block',
                        margin: '4px',
                        width: '80px'
                    }}
                />
            )
        }
        return (
            <Box
                key={index}
                sx={{
                    border: '1px dashed rgba(0,0,0,0.25)',
                    display: 'inline-block',
                    margin: '4px',
                    width: '80px',
                    textAlign: 'center',
                }}
            >
                <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>{character}</span>
            </Box>
        );
    });
};

function TickerHeader() {
    let today = new Date();
    let dayToRender = getDayOfWeek(today)

    return (
        <Box>
            <Typography sx={{ textTransform: 'uppercase', letterSpacing: '2px', color: "#7222C2" }}>
                WELCOME TO
            </Typography>
            <Typography variant="h1" m={0} p={0} sx={{ fontSize: '4.0vw !important', lineHeight: "1" }}>
                {renderLetters("NO STUPID")}
            </Typography>
            <Typography variant="h1" m={0} p={0} sx={{ fontSize: '4.0vw !important', lineHeight: "1" }}>
                {renderLetters("QUESTIONS")}
            </Typography>
            <Typography sx={{ textTransform: 'uppercase', letterSpacing: '2px', color: "#7222C2" }}>
                FEATURING: DARREN EWING
            </Typography>
        </Box>
    );
};

export default function NoStupidQuestions() {
    const [connected, setConnected] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState("Connecting");
    const [questions, setQuestions] = useState([]);
    const [client, setClient] = useState(null);

    useEffect(() => {
        const newClient = new WebSocket('ws://irc-ws.chat.twitch.tv:80');
        setClient(newClient);
    }, []);

    useEffect(() => {
        if (client) {
            client.onopen = () => {
                client.send(`PASS ${password}`);
                client.send(`NICK ${account}`);
            };

            client.onerror = (error) => {
                console.log('Connect Error: ' + error.toString());
            };

            client.onmessage = (event) => {
                setConnected(true);
                let rawIrcMessage = event.data.trimEnd();

                // console.log(`Message received (${new Date().toISOString()}): '${rawIrcMessage}'\n`);

                let messages = rawIrcMessage.split('\r\n');
                messages.forEach(message => {
                    let parsedMessage = parseMessage(message);
                    if (parsedMessage) {
                        // console.log(`Message command: ${parsedMessage.command.command}`);
                        // console.log(`\n${JSON.stringify(parsedMessage, null, 3)}`)

                        switch (parsedMessage.command.command) {
                            case 'PRIVMSG':
                                console.log(`Message received: ${parsedMessage.parameters} from ${parsedMessage.source['nick']}`)
                                if ('nsq' === parsedMessage.command.botCommand) {
                                    console.log(parsedMessage.parameters.replace('!nsq ', ''))
                                    setQuestions(oldArray => [...oldArray, parsedMessage])
                                }

                            case 'PING':
                                client.send(`PONG ${parsedMessage.parameters}`);
                                break;

                            case '001':
                                // Successfully logged in, so join the channel.
                                client.send(`JOIN ${channel}`);

                        }
                    }
                })
            };
        }
    }, [client]);

    const renderQuestions = questions.map((q, index) => {
        let returnValue;

        returnValue = (
            <Grid item key={index} xs="auto">
                <Box display={"flex"} flexDirection={"column"} width={"320px"}>
                    <Card variant="outlined" width={"100%"} p={2}>
                        <CardContent>
                            <Typography varaint="h5" gutterBottom>
                                Asked by: <strong>{q.source['nick']}</strong>
                            </Typography>
                            <Typography variant="body2">
                                {q.parameters.replace('!nsq ', '')}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Grid>
        )

        return returnValue;
    })

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                sx={{
                    width: '280px',
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: '280px',
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
                        letterSpacing="2px"
                    >
                        ATRIOC
                    </Typography>
                </Box>
                <Box mt="auto" p={1}>
                    <Card>
                        <CardHeader
                            avatar={connected ? <WifiIcon color="success" /> : <WifiOffIcon />}
                            title={connected ? "Connected!" : "connecting"}
                        />
                    </Card>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, padding: 3, overflow: "auto", height: "100vh" }}>
                <Grid container spacing={3} justifyContent={"center"}>
                    <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="flex-start"
                        py={3}
                    >
                        <TickerHeader />
                    </Grid>
                    {renderQuestions}
                </Grid>
            </Box>
            <Drawer
                sx={{
                    width: '25vw',
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: '25vw',
                        boxSizing: 'border-box',
                        border: "none",
                        backgroundColor: "transparent"
                    },
                }}
                variant="permanent"
                anchor="right"
            >
            </Drawer>
        </Box>
    )
}
