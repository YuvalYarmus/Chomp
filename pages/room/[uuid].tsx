import styles from '../styles/Home.module.css'
import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'
import React, { ReactNode, useEffect, useState, useRef, Ref } from 'react'
import 'tailwindcss/tailwind.css'
import dynamic from "next/dynamic";
import { GetServerSideProps, GetStaticProps, InferGetServerSidePropsType } from 'next'
import init from '../../firebase/initFirebase'
import firebase from "firebase/app";
import firestore from "firebase/firestore";
import { Game } from "../../Game";
import { Room, User } from "../../firebase/loadWrite"
import { useRouter } from 'next/router'
import addUser from "../../firebase/userWrite"
import { useAuthState } from "react-firebase-hooks/auth"
import { useCollection } from "react-firebase-hooks/firestore"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import Auth from "../../components/authComponent"
import addUserToUsers from "../../firebase/addUser"
import addRoomUser from "../../firebase/addRoomUser"
import removeRoomUser from "../../firebase/RemoveRoomUser"
import removeUser from '../../firebase/RemoveUser'
import getRoomUsers from "../../firebase/getRoomUsers"
import getRoomMoves from "../../firebase/getRoomMoves";

const { v4: uuidV4, validate: uuidValidate } = require("uuid");

const Canvas = dynamic(() => import("../../components/multiplayerComponent"), {
    ssr: false,
});

init()
type Props = {
    bool: boolean, room: Room, user: User, userIndex : number, errors: string
}
type divProps = {
    children?: ReactNode
    id?: string
    class?: string
}
type soundProps = {
    controls?: boolean
    src?: string
}

function WrapDiv(props: divProps) {
    return <div id={props.id} className={props.class}>{props.children}</div>
}

function SoundItem({ src, controls = false }: soundProps) {
    if (controls) return <audio controls>
        <source src={src} type="audio/ogg" />
    </audio>
    return <audio src={src}></audio>
}

export default function uuid({ bool, room, user, userIndex, errors }: Props) {
    const router = useRouter();
    const [authUser, loading, error] = useAuthState(firebase.auth());
    console.log(`hello there! I am in page!`)
    console.log(`bool is: ${bool}, room: ${room}, user: ${user}, userIndex: ${userIndex}, errors: ${errors}`);
    if (!bool) {

        console.log(`in bool statement`)
        console.log(`${router.asPath}`)
        console.log(`auth user: ${JSON.stringify(authUser)}, loading: ${JSON.stringify(loading)}`)
        useEffect(() => {
            console.log(`from use effect with: ${authUser}`)
            if (authUser != null) (async () => {
                const name = authUser?.displayName as string
                const userUuid = uuidV4();
                const newUser: User = {
                    id: userUuid,
                    name: name,
                    room: router.query.uuid as string
                }
                console.log(`before addUserToUsers from useEffect`)
                const answer = await addRoomUser(newUser);
                if (answer === true) {
                    await addUserToUsers(newUser);
                    const url = `/room/${router.query.uuid as string}?name=${name}&userId=${userUuid}`;
                    console.log(`move to url: ${url}`);
                    router.push(url);
                }
                else {
                    console.log(`found a user with that name already: ${name}`);
                    alert(`a user with that name probably already exists`);
                    const named = name.trim().replace(/\s/g, '')
                    const url = `/room/${router.query.uuid as string}?name=${named}&userId=${answer}`;
                    console.log(`move to url: ${url}`);
                    router.push(url);
                }
                return () => {
                    (async () => {
                        alert(`please don't leave :(`);
                        await removeRoomUser(newUser);
                        await removeUser(newUser);
                    })();
                }
            })()
            return
        });
        return <>
            {loading && <h4>Loading...</h4>}
            {!authUser && <Auth path={router.asPath} />}
            {errors && <h1>{errors}</h1>}
            {authUser && (<>
                <h1>{authUser?.displayName}</h1>
                <h1>{authUser?.photoURL as string}</h1>
                <img src={authUser?.photoURL as string}></img>
            </>)}
        </>


    }
    else {
        console.log(`passed bool`);
        const soundBar = <SoundItem controls src="" />
        const soundWrap = <WrapDiv id="soundControl" children={soundBar} />;
        const canvas = <Canvas roomId={user.room} userId={user.id} userIndex={userIndex} n={room.n} m={room.m} class="w-4/5 h-4/5" id="canvas" />;
        const main = <WrapDiv class="w-screen h-screen" id="flexWrap" children={canvas} />;
        const roomKeys = Object.keys(room)
        const roomValues = Object.values(room)
        const roomList = roomKeys.map((element, index) => {
            if (element != "users") return <li key={element}>{element}: {roomValues[index]}</li>
            return <li key={element}>{element}: {roomValues[index]?.toString()}</li>
        });
        console.log(`user is: ${JSON.stringify(user)}`);
        console.log(`room is: ${JSON.stringify(room)}`);
        useEffect(() => {
            const onDC = async () => {
                alert(`please don't leave :(`);
                await removeRoomUser(user);
                await removeUser(user);
            }
            window.addEventListener(`unload`, onDC);
        });
        return <>
            <Head>
                <title>SoloChomp</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css"
                    integrity="sha256-mmgLkCYLUQbXn0B1SRqzHar6dCnv9oZFPEC1g1cwlkk="
                    crossOrigin="anonymous"
                />
                <link rel="stylesheet" href="/css/index2.css" />
                <link rel="icon" href="favicon.ico" />
            </Head>
            <h1>Welcome to the NextChomp Bot Page!</h1>

            {soundWrap}
            {main}
            {/* <Link href={router.asPath} passHref /> */}
            <Link href={`/room/${router.query.uuid as string}`} passHref>
                <a target="_blank" rel="noopener noreferrer">yo I am here</a>
            </Link>

            {console.log(`room in client is: ${JSON.stringify(room)}`)}
            <ul className="ml-8">{roomList}</ul>
            <h1 className="ml-8">the game should be: {room.n}X{room.m}</h1>






        </>
    }
}


export const getServerSideProps: GetServerSideProps = async ({ params, query }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    try {
        const id = params?.uuid, userId = query?.userId
        init();
        if (!id || !userId || id === undefined || userId === undefined) {
            return { props: { bool: false } }
        }
        // use onsnapshot only on the client side as it opens a socket
        const room: any = await firebase.firestore().collection(`rooms`).doc(`${id}`).get().then((doc) => {
            if (doc.exists) return doc.data();
            console.log(`there is no such room document: ${doc}-${doc.data()}`)
            return doc;
        }).catch((error) => {
            console.log(`error in fetching a room: ${error}`)
        });
        const user: any = await firebase.firestore().collection(`users`).doc(`${userId}`).get().then((doc) => {
            if (doc.exists) return doc.data();
            console.log(`there is no such user document: ${doc}-${doc.data()}`)
            return doc;
        }).catch((error) => {
            console.log(`error in fetching a room: ${error}`)
        });

        console.log(`room var is: ${JSON.stringify(room)}, user: ${user}`);
        room.users.forEach((user: User) => user.created = JSON.stringify(user.created.toDate()))
        user.created = JSON.stringify(user.created.toDate());
        const userIndex = (() => {
            for (let i = 0; i < room.users.length; i++) {
                if (room.users[i].id === user.id) return i;
            }
            return -1;
        })();
        return {
            props: {
                bool: true,
                room: room,
                user: user,
                userIndex : userIndex,
                errors: null
            }
        }


    } catch (err) {
        console.log(`server side props failed with: ${err}`)
        return { props: { bool: false, errors: err.message, room: null, user: null } };
    }
}