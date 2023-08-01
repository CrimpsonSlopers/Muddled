import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import GetSmarterPage from "pages/GetSmarter";

import { AuthProvider, ProtectedRoute } from "utils/auth";
import { theme } from "./theme";


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
                    <Route path="get-smarter" element={<ProtectedRoute><GetSmarterPage /></ProtectedRoute>} />
                    <Route path="*" element={<NoMatch />} />
                </Routes>
            </ThemeProvider>
        </AuthProvider>
    )
} 