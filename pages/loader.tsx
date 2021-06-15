import Link from 'next/link'
import Head from 'next/head'
import 'tailwindcss/tailwind.css'
import init from '../firebase/initFirebase'
import { Room, User } from "../firebase/types"
import addUser from '../firebase/addUser'
import addRoomUser from '../firebase/addRoomUser'
import addRoom from '../firebase/addRoom'
const { v4: uuidV4, validate: uuidValidate } = require("uuid");
import { useRouter } from 'next/router'
import React, { ReactNode, useEffect, useState, useRef, Ref } from 'react'
import { useAuthState } from "react-firebase-hooks/auth"
import Auth from "../components/authComponent"
import firebase from 'firebase'
import CubeComponenet from "../components/cube"
init();



function Load() {
    const router = useRouter();
    // if we got no param
    if (router.query.hopping === null || router.query.hopping === "") router.push("/");
    // requesting the bot page
    else if (router.query.hopping === "c") router.push("/bot");
    // requesting the once Device Page
    else if (router.query.hopping === "a") router.push("/solo");
    // requesting the multiplayer
    else {
        const [authUser, loading, error] = useAuthState(firebase.auth());
        const [n, setN] = useState(7);
        const [m, setM] = useState(9);
        
        // const [name, setName] = useState('');
        init();
        if (authUser != null) {
            const name = authUser.displayName as string;
            interface Style {
                [key1: string]: any;
            }
            let style: Style = { color: 'grey', paddingTop: '10px' }
            return <><Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css"
                    integrity="sha256-mmgLkCYLUQbXn0B1SRqzHar6dCnv9oZFPEC1g1cwlkk="
                    crossOrigin="anonymous"
                />
                <link rel="stylesheet" href="/css/loader.css" />
                <title>Chomp Online Loading Page</title>
            </Head>
                <div className="flex flex-col items-center mt-10 w-screen h-screen">
                    <div className="join-container mt-8 ml-4 mr-4 flex-grow">
                        <main className="join-main text-gray-200">
                            <form id="form" className="form" onSubmit={async (event) => {
                                event.preventDefault();
                                // const roomUuid = uuidV4(), userUuid = uuidV4();
                                const roomUuid = uuidV4(), userUuid = authUser.uid;
                                console.log(`--------submit triggered---------`)
                                const user: User = {
                                    id: userUuid,
                                    name: name,
                                    room: roomUuid
                                }
                                const room: Room = {
                                    population: 1,
                                    uuid: roomUuid,
                                    currTurn: 0,
                                    n: n,
                                    m: m,
                                    users: [],
                                }
                                console.log(`from loader: room: ${JSON.stringify(room)}, user: ${JSON.stringify(user)}`)
                                await addRoom(room);
                                await addUser(user);
                                await addRoomUser(user);
                                console.log(`from loader: after write to firestore`);
                                router.push({
                                    pathname: `/room/${roomUuid}`,
                                    query: { name: name, userId: userUuid },
                                });
                            }}>
                                
                                <div>{authUser && <>
                                    <h1>Welcome to the Chomp Multiplayer loading screen<span></span> {authUser?.displayName}
                                    </h1>
                                    <img src={authUser?.photoURL as string}></img>
                                </>}</div>
                                <label htmlFor="n" style={style}>The amount of rows:</label>
                                <input onChange={event => setN(parseInt(event.target.value))} type="number" id="n" value={n} name="n" min="3" max="11"></input>
                                <label htmlFor="m" style={style}>The amount of columns:</label>
                                <input onChange={event => setM(parseInt(event.target.value))} type="number" id="m" value={m} name="m" min="2" max="12"></input>
                                <button type="submit" className="btn">Start the game!</button>
                            </form>
                        </main>
                    </div>
                    {/* <script src="https://unpkg.com/three@0.110.0/build/three.js"></script>
                    <script src="/cube/three.min.js"></script>
                    <script src="/cube/loader2.js"></script> */}
                    
                    <CubeComponenet className="flex-shrink mt-20 mr-16 ml-16"></CubeComponenet>
                </div>
            </>
        }
        return <div className="flex flex-col items-center mt-10"><Auth path={router.asPath} /></div>
    }
}

export default Load