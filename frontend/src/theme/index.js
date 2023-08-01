import React  from "react";
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                html: {
                    scrollBehavior: "smooth",
                },
                "*, *::before, *::after": {
                    margin: 0,
                    padding: 0,
                },
                "a, a:link, a:visited": {
                    textDecoration: "none !important",
                },
                "a.link, .link, a.link:link, .link:link, a.link:visited, .link:visited": {
                    color: `#344767 !important`,
                    transition: "color 150ms ease-in !important",
                },
                "a.link:hover, .link:hover, a.link:focus, .link:focus": {
                    color: `#1A73E8 !important`,
                },
            }
        },
    },
    typography: {
        fontFamily: 'Lexend',
    },
});