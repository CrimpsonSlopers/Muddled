import React, { useEffect, createContext, useState, useContext, useMemo } from 'react';
import { Routes, Route } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theme";

import Landing from "pages/Landing";
import GetSmarterPage from "pages/GetSmarter";

const UserContext = createContext({
    user: null,
    setUser: () => { },
});

export default function App() {
    const [user, setUser] = useState(null);
    const value = useMemo(() => ({ user, setUser }), [user]);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = () => {
        fetch('/api/authenticate', {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(`Unexpected response status: ${response.status}`);
                }
            })
            .then(data => console.log(data))
            .catch(err => console.error(err));
    };

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