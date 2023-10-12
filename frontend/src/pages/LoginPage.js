import React from "react";
import Cookies from 'js-cookie';
import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { TextFieldElement } from "components/TextFieldElement";


const CLIENT_ID = ""
const PARAMS = `response_type=${CODE}&client_id=${CLIENT_ID}&redirect_uri=http://localhost:8000&scope=user%3Aread%3Aemail&state=${Cookies.get("csrftoken")}`


export const LoginPage = () => {
    const { login } = useAuth();

    const onSubmitLogin = (data) => {
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            },
            body: JSON.stringify(data)
        };
        const result = fetch('/api/login', requestOptions)
            .then((response) => {
                if (response.ok) {
                    login(data);
                }
            })
    };

    return (
        <Box px={1} width="100%" height="100vh" mx="auto">
            <Grid
                container
                spacing={1}
                justifyContent="center"
                alignItems="center"
                height="100%"
            >
                <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
                    <Card>
                        <Box p={3}>
                            <Typography variant="h4" fontWeight="medium" pb={3}>
                                Sign in
                            </Typography>
                            <Box mt={3} mb={1}>
                                <a href={`https://id.twitch.tv/oauth2/authorize?${PARAMS}`}>Connect with Twitch</a>
                            </Box>

                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
