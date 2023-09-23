import React, { useEffect, useState } from "react";
import { Link, Navigate, Outlet, useOutlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Box } from "@mui/material";

export const ProtectedLayout = () => {
    const { user } = useAuth();
    const outlet = useOutlet();

    if (!user) {
        return <Navigate to="/" />;
    }


    return (
        <Box>
            {outlet}
        </Box>
    );
};
