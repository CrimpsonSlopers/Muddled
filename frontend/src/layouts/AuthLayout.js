import React, { Suspense } from "react";
import { useLoaderData, useOutlet, Await } from "react-router-dom";
import { AuthProvider } from "../hooks/useAuth";

import CircularProgress from "@mui/material/CircularProgress";


export const AuthLayout = () => {
    const outlet = useOutlet();
    const { user } = useLoaderData();

    return ({ outlet }
    );
};
