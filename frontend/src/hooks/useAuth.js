import React, { createContext, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";


const AuthContext = createContext();

export const AuthProvider = ({ children, userData }) => {
    const [user, setUser] = useState(userData);
    const navigate = useNavigate();

    const login = async (data) => {
        setUser(data);
        navigate("/", { replace: true });
    };

    const logout = async () => {
        try {
            const response = await fetch("/api/logout");
            if (response.status === 200) {
                setUser(null);
                navigate("/", { replace: true });
            } else {
                throw new Error(
                    `Unexpected response status: ${response.status}`
                );
            }
        } catch (err) {
            console.error(err);
        }
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
