import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import GetSmarterPage from "pages/GetSmarter";

import { AuthProvider, ProtectedRoute } from "utils/auth";
import { theme } from "./theme";
import Landing from "./pages/Landing";
import Login from "pages/Login";


const NoMatch = () => {
    return (
        <div>
            <h1>NoMatch!</h1>
        </div>
    );
};


export default function App() {

    return (
        <AuthProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Routes>
                    <Route path="" element={<Landing />} />
                    <Route path="login" element={<Login />} />
                    <Route path="get-smarter" element={<ProtectedRoute><GetSmarterPage /></ProtectedRoute>} />
                    <Route path="*" element={<NoMatch />} />
                </Routes>
            </ThemeProvider>
        </AuthProvider>
    )
} 