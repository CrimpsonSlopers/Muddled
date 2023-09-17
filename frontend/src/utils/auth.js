import React, { createContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import LoadingWindow from "../components/Loading";
const AuthContext = createContext();

function useAuth() {
    const [user, setUser] = useState();

    useEffect(() => {
        let isMounted = true;

        fetch("/api/authenticate")
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Unauthorized");
                }
            })
            .then((data) => {
                if (isMounted) {
                    setUser(data);
                }
            })
            .catch((error) => {
                if (isMounted) {
                    console.log("Error: ", error);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return {
        user,
        login(data) {
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": Cookies.get("csrftoken"),
                },
                body: JSON.stringify(data),
            };
            const results = fetch("/api/login", requestOptions)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("Unauthorized");
                    }
                })
                .then((data) => {
                    setUser(data);
                    return true;
                })
                .catch((error) => {
                    setUser({ username: "AnonymousUser" });
                    console.log("Error: ", error);
                    return false;
                });
            return results;
        },
    };
}

export function ProtectedRoute({ children }) {
    const { user } = AuthConsumer();

    if (typeof user === "undefined") {
        return <LoadingWindow />;
    } else if (user.username == "AnonymousUser") {
        return <Navigate to="/" replace />;
    } else {
        return children;
    }
}

export const AuthProvider = ({ children }) => {
    let auth = useAuth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export function AuthConsumer() {
    return React.useContext(AuthContext);
}
