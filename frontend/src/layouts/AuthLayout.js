import React, { Suspense } from "react";
import { useLoaderData, useOutlet, Await } from "react-router-dom";
import { AuthProvider } from "../hooks/useAuth";

import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";


export const AuthLayout = () => {
    const outlet = useOutlet();

    const { userData } = useLoaderData();

    return (
        <Suspense fallback={<CircularProgress />}>
            <Await
                resolve={userData}
                errorElement={<Alert severity="error">Something went wrong!</Alert>}
                children={(user) => (<AuthProvider userData={user}>{outlet}</AuthProvider>)}
            />
        </Suspense>
    );
};
