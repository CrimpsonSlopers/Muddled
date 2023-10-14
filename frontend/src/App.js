import React from "react";

import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    defer
} from "react-router-dom";
import GetSmarterPage from "./pages/GetSmarterPage";
import { LandingPage } from "./pages/LandingPage";
import { CallbackPage } from "./pages/CallbackPage";
import ArchiveLayout, { ArchivePage } from "./pages/ArchivePage";

import { ProtectedLayout } from "./layouts/ProtectedLayout";
import { AuthLayout } from "./layouts/AuthLayout";
import { AnonymousLayout } from "./layouts/AnonymousLayout";


export async function rootLoader() {
    let token = JSON.parse(localStorage.getItem("token"))
    const response = await fetch(`/api/user/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    });
    const userData = await response.json();
    return { userData }
};

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route
            element={<AuthLayout />}
            loader={rootLoader}
        >
            <Route element={<AnonymousLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/archives" element={<ArchiveLayout />}>
                    <Route path=":channelName" element={<ArchivePage />} />
                </Route>
                <Route path="/callback" element={<CallbackPage />} />
            </Route>

            <Route element={<ProtectedLayout />}>
                <Route path="/get-smarter" element={<GetSmarterPage />} />
            </Route>
        </Route>
    )
)
