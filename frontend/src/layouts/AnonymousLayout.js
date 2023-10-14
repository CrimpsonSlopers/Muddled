import React from "react";
import { Navigate, Outlet, useOutlet } from "react-router-dom";


export const AnonymousLayout = () => {
    return (<Outlet />);
};
