import React from "react";
import { createTheme } from "@mui/material/styles";
import typography from "./base/typography";
import globals from "./base/globals";
import input from "./components/form/input";
import inputLabel from "./components/form/inputLabel";
import inputOutlined from "./components/form/inputOutlined";
import textField from "./components/form/textField";

export const theme = createTheme({
    typography: { ...typography },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                ...globals,
            },
        },
        MuiInput: { ...input },
        MuiInputLabel: { ...inputLabel },
        MuiOutlinedInput: { ...inputOutlined },
        MuiTextField: { ...textField },
    }
});
