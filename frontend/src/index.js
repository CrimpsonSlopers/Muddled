import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";

import { router } from "./App";
import { theme } from "./theme";
import { AuthProvider } from "./hooks/useAuth";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    <ThemeProvider theme={theme}>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </ThemeProvider>
);
