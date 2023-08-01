import React, { createContext, useState } from "react";
import { Navigate } from "react-router-dom";
import Cookies from 'js-cookie';


const AuthContext = createContext();


function useAuth() {
    const [authed, setAuthed] = useState();

    React.useEffect(() => {
        fetch('/api/authenticate')
            .then((response) => {
                if (response.ok) {
                    console.log("authenticated")
                    setAuthed(true);
                } else {
                    setAuthed(false);
                }
            })
    }, [])

    return {
        authed,
        csrfToken: Cookies.get('csrftoken')
    }

}

export function ProtectedRoute({ children }) {
    const { authed } = AuthConsumer();

    console.log("AUTHED", authed)

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