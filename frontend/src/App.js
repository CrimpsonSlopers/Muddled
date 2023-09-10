import React from 'react';
import { Routes, Route } from "react-router-dom";

import { AuthProvider, ProtectedRoute } from "utils/auth";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { theme } from "./theme";
import Landing from "pages/Landing";
import Login from "pages/Login";
import GetSmarterPage from "pages/GetSmarter";

export default function App() {

    return (
        <AuthProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Routes>
                    <Route index element={<Landing />} />
                    <Route path="login" element={<Login />} />
                    <Route path="get-smarter" element={<ProtectedRoute><GetSmarterPage /></ProtectedRoute>} />
                </Routes>
            </ThemeProvider>
        </AuthProvider>
    )
}