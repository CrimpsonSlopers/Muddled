import React, { useEffect } from "react";
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const twitch_client_id = 'bs99mqyazrfa7tut83c2wa108xasmz';
const twitch_client_secret = 'o9iwnwaltxku3vlacsbrhzvt5v0cdg';

const django_client_secret = '9rbW86cef4UAD1zL8Lx3hOokfMYC2zEAJ9sFAKRPl674p66yELJ8Yf1gUP4ur5W6kfqLgWpu5sF4D30ztrSjTFF1daMDSTdFBMAIgZQpn5klY5yPOztJeBEZs1YfFiWz';
const django_client_id = 'Eq9IyUsZKMYlt6Pl60U81O5AqecJEASG2YBhJOJO';

export default function OAuthComplete() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const code = searchParams.get('code');
    const scope = searchParams.get('scope');
    const state = searchParams.get('state');

    useEffect(() => {
        fetch(`https://id.twitch.tv/oauth2/token?client_id=${twitch_client_id}&client_secret=${twitch_client_secret}&code=${code}&grant_type=authorization_code&redirect_uri=http://localhost:8000/atrioc`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(`Unexpected response status: ${response.status}`);
                }
            })
            .then(data => {
                console.log(data)
                fetch('/auth/convert-token', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        token: data.access_token,
                        backend: 'twitch',
                        grant_type: 'convert_token',
                        client_id: django_client_id,
                        client_secret: django_client_secret,
                    })
                }).then(response => {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        throw new Error(`Unexpected response status: ${response.status}`);
                    }
                }).then(data => {
                    window.localStorage.setItem('access_token', data.access_token);
                    window.localStorage.setItem('refresh_token', data.refresh_token);
                }).catch(err => console.error(err));

            })
            .catch(err => console.error(err));
    }, [false])

    return (
        <div>
            <h1>URL Parameters</h1>
            <p>Code: {code}</p>
            <p>Scope: {scope}</p>
            <p>State: {state}</p>
        </div>
    );
};



