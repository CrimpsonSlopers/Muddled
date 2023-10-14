import React from "react";
import { useOutlet } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";


export const ArchivePage = () => {

    return (
        <Box
            sx={{
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
                    <Typography
                        variant="h5"
                        component="div"
                    >
                        <a
                            href={"/admin/"}
                            style={{
                                color: "white",
                                textDecoration: "none",
                                fontWeight: "bold",
                            }} >
                            ADMIN
                        </a>
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
}


const ArchiveLayout = () => {
    const outlet = useOutlet();

    return (
        <Box height="100%" width="100%">
            {outlet}
        </Box>
    )
}

export default ArchiveLayout;