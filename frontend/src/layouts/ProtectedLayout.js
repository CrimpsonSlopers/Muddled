import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


export const ProtectedLayout = () => {
    const user = useAuth();

    if (!user) {
        return <Navigate to="/" />;
    }

    return (<Outlet />);
};
