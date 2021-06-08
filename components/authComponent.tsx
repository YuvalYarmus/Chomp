import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import init from "../firebase/initFirebase";
// import firebase from "firebase/app";
import firebase from "firebase"
import { NextRouter } from "next/router";

type Props = {
    path: string
}

export default function auth({path} : Props) {
    const uiConfig = {
        signInFlow: 'popup',
        signInSuccess: `${path}`,
        signInSuccessURL: `${path}`,
        signInOptions: [
            // List of OAuth providers supported.
            {
                provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
                signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
                requireDisplayName: true
    
            },
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.GithubAuthProvider.PROVIDER_ID
        ],
        // Other config options...
    }
    console.log(`returning in auth`)
    return (
        <div
            style={{
                maxWidth: "320px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <h1>Please sign-in:</h1>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        </div>
    )
}
