import React from "react";
import { createTheme } from "@mui/material/styles";
import typography from "./base/typography";
import globals from "./base/globals";

export const theme = createTheme({
    typography: { ...typography },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                ...globals,
            },
        },
    }
});
