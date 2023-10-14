import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


export const CallbackPage = () => {
    const { login } = useAuth();
    let [searchParams] = useSearchParams();

    useEffect(() => {
        fetch(`/oauth/token/?code=${searchParams.get('code')}`, {
            headers: { "Content-Type": "application/json" },
        }).then((response) => {
            if (response.status > 200) {
                throw new Error("ERROR GETTING TOKEN")
            } else {
                return response.json()
            }
        }).then((data) => login(data))
            .catch((error) => console.log(error))
    }, [])
}
