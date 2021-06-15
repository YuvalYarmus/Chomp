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
init();

function getURLParam(paramName: string) {
    let params = new URLSearchParams(window.location.search);
    console.log(window.location.search)
    return params.get(paramName);
}

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
        init();
        const [n, setN] = useState('');
        const [m, setM] = useState('');
        const [name, setName] = useState('');
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
            <div className="join-container mt-8 ml-4 mr-4">
                <main className="join-main text-gray-200">
                    <form id="form" className="form" onSubmit={async (event) => {
                        event.preventDefault();
                        const roomUuid = uuidV4(), userUuid = uuidV4();
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
                            n: parseInt(n),
                            m: parseInt(m),
                            users: [user],
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
                        <input onChange={event => setName(event.target.value)} id="full_name" placeholder="Plese enter your name" name="full_name" required></input>
                        <label htmlFor="n" style={style}>The amount of rows:</label>
                        <input onChange={event => setN(event.target.value)} type="number" id="n" value="7" name="n" min="3" max="11"></input>
                        <label htmlFor="m" style={style}>The amount of columns:</label>
                        <input onChange={event => setM(event.target.value)} type="number" id="m" value="9" name="m" min="2" max="12"></input>
                        <button type="submit" className="btn">Start the game!</button>
                    </form>
                </main>
            </div>
            <script src="https://unpkg.com/three@0.110.0/build/three.js"></script>
            <script src="/cube/three.min.js"></script>
            <script src="/cube/loader2.js"></script>
        </>
    }
}

export default Load