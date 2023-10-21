import React, { useEffect, useRef, useContext } from 'react';
import Cookies from 'js-cookie';
import {
    createBrowserRouter,
    RouterProvider,
    useNavigate,
    Route
} from "react-router-dom";
import { AuthContext, AuthProvider, useAuth } from './hooks/useAuth';
import { LandingPage } from './pages/LandingPage';
import { GetSmarterPage } from './pages/GetSmarterPage';
import { AuthLayout } from './layouts/AuthLayout';
import { ProtectedLayout } from './layouts/ProtectedLayout';


const Callback = () => {
    const called = useRef(false);
    const { checkLoginState, loggedIn } = useContext(AuthContext);
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log(auth)
    }, [auth])

    useEffect(() => {
        console.log(checkLoginState, loggedIn)
        fetchToken();
    }, [checkLoginState, loggedIn, navigate]);

    const fetchToken = async () => {
        if (loggedIn === false) {
            try {
                if (called.current) return;
                called.current = true;
                const response = await fetch(`/oauth/token${window.location.search}`);
                const data = await response.json();
                console.log('response: ', data);
                checkLoginState();
                navigate('/');
            } catch (err) {
                console.error(err);
                navigate('/');
            }
        } else if (loggedIn === true) {
            navigate('/');
        }

    }
    return <></>
};

const Home = () => {
    const { loggedIn } = useContext(AuthContext);
    const auth = useAuth();

    useEffect(() => {
        console.log("useAuth", auth)
    }, [auth])

    useEffect(() => {
        console.log("context", loggedIn)
    }, [loggedIn]);

    if (loggedIn === true) return <LandingPage />;
    if (loggedIn === false) return <LandingPage />
    return <></>;
}



export const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/auth/callback',
        element: <Callback />,
    }
])

{/*
import GetSmarterPage from "./pages/GetSmarterPage";
import { LandingPage } from "./pages/LandingPage";
import { CallbackPage } from "./pages/CallbackPage";
import ArchiveLayout, { ArchivePage } from "./pages/ArchivePage";

import { ProtectedLayout } from "./layouts/ProtectedLayout";
import { AuthLayout } from "./layouts/AuthLayout";
import { AnonymousLayout } from "./layouts/AnonymousLayout";


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

        <Route path={"/auth/callback"} element={<TwitchCallback />} />
    </Route>
)
)
*/}
