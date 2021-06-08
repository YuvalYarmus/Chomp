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
import SignIn from "../../components/signIn"
const { v4: uuidV4, validate: uuidValidate } = require("uuid");

const Canvas = dynamic(() => import("../../components/gameComponent"), {
    ssr: false,
});


init()
type divProps = {
    children?: ReactNode
    id?: string
    class?: string
}

type soundProps = {
    controls?: boolean
    src?: string
}
type Props = {
    bool: boolean, room: Room, user: User, errors: string
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

// const sign = async () => {
//     const name = prompt(`choose a name: `) || "John Dough"
//     const uuid = router.query.uuid as string
//     const user: User = {
//         id: `${uuid}-${name}`,
//         name: name,
//         room: uuid
//     }
//     await init();
//     await addUser(user);
//     router.push({
//         pathname: window.location.href.split('?')[0],
//         query: {
//             name: name,
//             userId: `${uuid}-${name}`,
//             invite: true
//         }
//     });
// }

export default function uuid({ bool, room, user, errors }: Props) {
    const router = useRouter();
    console.log(`hello there! I am in page!`)
    console.log(`bool is: ${bool}, room: ${room}, user: ${user}, errors: ${errors}`);
    const [authUser, loading, error] = useAuthState(firebase.auth());
    if (!bool) {
        const addUserr = async () => {
            console.log(`trying to create another user in first bool if`)
            const name = authUser?.displayName as string
            const userUuid = uuidV4();
            const newUser: User = {
                id: userUuid,
                name: name,
                room: router.query.uuid as string
            }
            await addUser(newUser);
            console.log(`after creating another user`)
            const url = `/room/${router.query.uuid as string}?name=${name}&userId=${userUuid}`;
            console.log(`move to url: ${url}`);
            router.push(url);
            // router.push({
            //     href: `/room/${router.query.uuid as string}`,
            //     query: {
            //         name: name,
            //         userId: userUuid
            //     }
            // })
            // return new Promise<void>(resolve =>resolve());
        }
        // if (authUser) addUserr();
        http://localhost:3000/room/57b26427-1070-45cf-bc1a-28dae53dc297
        console.log(`in bool statement`)
        console.log(`${router.asPath}`)
        console.log(`auth user: ${JSON.stringify(authUser)}, loading: ${JSON.stringify(loading)}`)
        useEffect( () => {
            console.log(`from use effect`)
            if (authUser != null) async () => {
                console.log(`in authUser if in useEffect`)
                await addUserr();
                return
            }
            console.log(`after the the authUser if statemnt from the useEffect: ${JSON.stringify(authUser)}`);
            (async () => {
                await addUserr();
            })();
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
        // return <>
        //     <div>
        //       <h1>My App</h1>
        //       <p>Please sign-in:</p>
        //       <SignIn />
        //     </div>
        //   </>;    
    }
    else {
        console.log(`passed bool`);
        const soundBar = <SoundItem controls src="" />
        const soundWrap = <WrapDiv id="soundControl" children={soundBar} />;
        const canvas = <Canvas n={room.n} m={room.m} class="w-4/5 h-4/5" id="canvas" />;
        const main = <WrapDiv class="w-screen h-screen" id="flexWrap" children={canvas} />;
        const roomKeys = Object.keys(room)
        const roomValues = Object.values(room)
        const roomList = roomKeys.map((element, index) => {
            if (element != "users") return <li key={element}>{element}: {roomValues[index]}</li>
            return <li key={element}>{element}: {roomValues[index]?.toString()}</li>
        });
        console.log(`user is: ${JSON.stringify(user)}`);
        console.log(`room is: ${JSON.stringify(room)}`);
        useEffect( () => {
            console.log(`from use effect 2`)
            if (authUser) async () => {
                console.log(`trying to create another user`)
                const name = authUser?.displayName as string
                const userUuid = uuidV4();
                const newUser: User = {
                    id: userUuid,
                    name: name,
                    room: router.query.uuid as string
                }
                await addUser(newUser);
                console.log(`after creating another user`)
                router.push({
                    href: `/room/${router.query.uuid as string}`,
                    query: {
                        name: name,
                        userId: userUuid
                    }
                })
            }
        }, []);
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

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.


// missions: 
// 1. create the invite setup
// 2. listen to realtime snapshot updates
// 3. 
export const getServerSideProps: GetServerSideProps = async ({ params, query }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    try {
        const id = params?.uuid, userId = query?.userId
        init();
        if (!id || !userId || id === undefined || userId === undefined) {
            return { props: { bool: false } }
        }
        // use onsnapshot only on the client side as it opens a socket
        const room = await firebase.firestore().collection(`rooms`).doc(`${id}`).get().then((doc) => {
            if (doc.exists) return doc.data();
            console.log(`there is no such room document: ${doc}-${doc.data()}`)
            return doc;
        }).catch((error) => {
            console.log(`error in fetching a room: ${error}`)
        });
        const user = await firebase.firestore().collection(`users`).doc(`${userId}`).get().then((doc) => {
            if (doc.exists) return doc.data();
            console.log(`there is no such user document: ${doc}-${doc.data()}`)
            return doc;
        }).catch((error) => {
            console.log(`error in fetching a room: ${error}`)
        });

        // const item = sampleUserData.find((data) => data.id === Number(id))
        // By returning { props: item }, the StaticPropsDetail component
        // will receive `item` as a prop at build time
        // return { props: { item } }

        console.log(`id: ${id}, userId: ${userId}`);
        console.log(`room var is: ${room}, user: ${user}`);
        return {
            props: {
                bool: true,
                room: room,
                user: user,
                errors: null
            }
        }


    } catch (err) {
        console.log(`server side props failed with: ${err}`)
        return { props: { bool: false, errors: err.message, room: null, user: null } };
    }
}