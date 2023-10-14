import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Navigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";


export const LandingPage = () => {
    const { user, logout } = useAuth();

    let isAuthenticated;
    if (user?.hasOwnProperty('username')) {
        isAuthenticated = true
    } else {
        isAuthenticated = false
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
                {user ? (
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
                            {user.profile.display_name}
                        </a>
                    </Typography>
                ) : (
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
                )}
                {user ? (
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
                ) : (null)}
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
                {user ? (
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
                ) : (null)}
                {user ? (
                    <Button onClick={logout}>
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
                ) : (
                    <Typography
                        variant="h5"
                        component="div"
                        marginRight={"48px"}
                    >
                        <a
                            href="/oauth/auth/"
                            style={{
                                color: "white",
                                textDecoration: "none",
                                fontWeight: "bold",
                            }} >
                            LOGIN
                        </a>
                    </Typography>
                )}
            </Box>
        </Box>
    );
}
