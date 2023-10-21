import React, { useEffect, useState, useContext } from "react";
import Cookies from 'js-cookie';

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { useAuth } from "../hooks/useAuth";

const TOKEN_PARAMS = {
    "response_type": "code",
    "client_id": "bs99mqyazrfa7tut83c2wa108xasmz",
    "scope": "user%3Aread%3Aemail",
    "redirect_uri": "http://localhost:8000/auth/callback",
    "state": Cookies.get("csrftoken"),
}

export const LandingPage = () => {
    const { user, loggedIn } = useAuth();

    const handleLogin = async () => {
        try {
            let url = `https://id.twitch.tv/oauth2/authorize?`
            const token_url = url + Object.keys(TOKEN_PARAMS).map(key => `${(key)}=${(TOKEN_PARAMS[key])}`).join("&");
            window.location.assign(token_url);
        } catch (err) {
            console.error(err);
        }
    }

    const handleLogout = async () => {
        try {
            await fetch(`/oauth/logout`, { method: "POST" });
            checkLoginState();
        } catch (err) {
            console.error(err);
        }
    }


    return (
        <Box
            sx={{
                backgroundImage: `url(/static/images/cover.png)`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                width: "100vw",
                height: "100vh",
            }}
        >
            <Box sx={{
                padding: 3,
                minHeight: "128px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Typography
                    variant="h2"
                    component="div"
                    sx={{ flexGrow: 1 }}
                >
                    <a
                        style={{
                            color: "white",
                            textDecoration: "none",
                            fontWeight: "bold",
                        }}
                    >
                        MUDDLED
                    </a>
                </Typography>
                {loggedIn && (
                    <Button>
                        <Typography
                            variant="h5"
                            component="div"
                            marginRight={"48px"}
                        >
                            <a
                                href={"/admin/"}
                                style={{
                                    color: "white",
                                    textDecoration: "none",
                                    fontWeight: "bold",
                                    textTransform: "uppercase"
                                }} >
                                ADMIN
                            </a>
                        </Typography>
                    </Button>
                )}
                <Typography
                    variant="h5"
                    component="div"
                    marginRight={"48px"}
                >
                    <a
                        href="/archives"
                        style={{
                            color: "white",
                            textDecoration: "none",
                            fontWeight: "bold",
                            textTransform: "uppercase"
                        }} >
                        Archives
                    </a>
                </Typography>
                {loggedIn ? (
                    <>
                        <Typography
                            variant="h5"
                            component="div"
                            marginRight={"48px"}
                        >
                            <a
                                href="/get-smarter"
                                style={{
                                    color: "white",
                                    textDecoration: "none",
                                    fontWeight: "bold",
                                    textTransform: "uppercase"
                                }}
                            >
                                Get Smarter
                            </a>
                        </Typography>
                        <Button onClick={handleLogout}>
                            <Typography
                                variant="h5"
                                component="div"
                                marginRight={"48px"}
                            >
                                <a
                                    style={{
                                        color: "white",
                                        textDecoration: "none",
                                        fontWeight: "bold",
                                    }} >
                                    LOGOUT
                                </a>
                            </Typography>
                        </Button>
                    </>
                ) : (
                    <Button onClick={handleLogin}>
                        <Typography
                            variant="h5"
                            component="div"
                            marginRight={"48px"}
                        >
                            <a
                                style={{
                                    color: "white",
                                    textDecoration: "none",
                                    fontWeight: "bold",
                                }} >
                                LOGIN
                            </a>
                        </Typography>
                    </Button>
                )}
            </Box>
        </Box>
    );
}
