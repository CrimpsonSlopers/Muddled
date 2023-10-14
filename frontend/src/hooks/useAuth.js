import React, { createContext, useContext, useMemo, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";


const AuthContext = createContext();

export const AuthProvider = ({ children, userData }) => {
    const [user, setUser] = useState(userData);
    const navigate = useNavigate();

    const login = async (data) => {
        setUser(data.user);
        setToken(data.token);
        navigate("/", { replace: true });

    };

    const logout = () => {
        setUser(null);
        setToken(null)
        navigate("/", { replace: true });
    };

    const value = useMemo(
        () => ({
            user,
            login,
            logout
        }),
        [user]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
