import React, { createContext, useState } from "react";
import { Navigate } from "react-router-dom";
import Cookies from 'js-cookie';


const AuthContext = createContext();


function useAuth() {
    const [authed, setAuthed] = useState();

    React.useEffect(() => {
        setAuthed(true);
    }, [])

    return {
        authed,
        login(data) {
            setAuthed(true);
            return 200;
        }
    }

}

export function ProtectedRoute({ children }) {
    const { authed } = AuthConsumer();

    if (typeof authed !== "undefined") {
        if (authed) {
            return children
        } else {
            return <Navigate to="/" replace />
        }
    }
};

export const AuthProvider = ({ children }) => {
    let auth = useAuth();
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
}

export default function AuthConsumer() {
    return React.useContext(AuthContext);
}