import React from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useAuth } from "../hooks/useAuth";

export const LandingPage = () => {
    const { user } = useAuth();

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
            <AppBar sx={{ background: "transparent", boxShadow: "none" }}>
                <Toolbar>
                    <Typography
                        variant="h5"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        <a
                            href="/"
                            style={{
                                color: "white",
                                textDecoration: "none",
                                fontWeight: "bold",
                            }}
                        >
                            Muddled
                        </a>
                    </Typography>
                    {/*<Typography
                        variant="body1"
                        component="div"
                        sx={{ marginRight: "20px", fontWeight: "bold" }}
                    >
                        <a
                            href="/archives"
                            style={{ color: "white", textDecoration: "none" }}
                        >
                            Archives
                        </a>
                        </Typography>*/}
                    {user != null ? (
                        <Typography
                            variant="body1"
                            component="div"
                            sx={{ marginRight: "20px", fontWeight: "bold" }}
                        >
                            <a
                                href="/get-smarter"
                                style={{
                                    color: "white",
                                    textDecoration: "none",
                                }}
                            >
                                Get Smarter
                            </a>
                        </Typography>
                    ) : null}
                </Toolbar>
            </AppBar>
        </Box>
    );
}
