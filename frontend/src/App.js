import React from "react";

import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    defer
} from "react-router-dom";
import { GetSmarterPage } from "./pages/GetSmarterPage";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedLayout } from "./layouts/ProtectedLayout";
import { HomeLayout } from "./layouts/HomeLayout";
import { AuthLayout } from "./layouts/AuthLayout";


const getUserData = () =>
    new Promise((resolve, reject) => {
        fetch("/api/authenticate", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => {
                if (!response.ok) {
                    resolve(null);
                }
                return response.json();
            })
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(null);
            });
    });

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route
            element={<AuthLayout />}
            loader={() => defer({ userPromise: getUserData() })}
        >
            <Route path="/" element={<LandingPage />} />

            <Route element={<HomeLayout />}>
                <Route path="/login" element={<LoginPage />} />
            </Route>

            <Route path="/get-smarter" element={<ProtectedLayout />}>
                <Route index element={<GetSmarterPage />} />
            </Route>
        </Route>
    )
)
