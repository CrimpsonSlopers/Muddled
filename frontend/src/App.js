import React from 'react';
import { Routes, Route } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theme";

import Landing from "pages/Landing";
import GetSmarterPage from "pages/GetSmarter";


export default function App() {

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
                <Route index element={<Landing />} />
                <Route path="get-smarter" element={<GetSmarterPage />} />
            </Routes>
        </ThemeProvider>
    )
} 