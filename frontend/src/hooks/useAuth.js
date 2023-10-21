import React, { useEffect, createContext, useContext, useState, useCallback } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(null);
    const [user, setUser] = useState(null);

    const checkLoginState = useCallback(async () => {
        try {
            const response = await fetch(`/oauth/logged_in`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + Cookies.get('token')
                }
            });
            const { logged_in, user } = await response.json()
            setLoggedIn(logged_in);
            user && setUser(user);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        checkLoginState();
    }, [checkLoginState])

    return (
        <AuthContext.Provider value={{ loggedIn, checkLoginState, user }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};

