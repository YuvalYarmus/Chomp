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

const Canvas = dynamic(() => import("../../components/gameComponent"), {
    ssr: false,
});


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
    bool : boolean, room : Room, user: User, errors : string
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


export default function uuid({ bool, room, user, errors } : Props) {
    if (!bool) return alert(`Must have a name, errors is: ${errors}`)
    const soundBar = <SoundItem controls src="" />
    const soundWrap = <WrapDiv id="soundControl" children={soundBar} />;
    const canvas = <Canvas n={room.n} m={room.m} class="w-4/5 h-4/5" id="canvas" />;
    const main = <WrapDiv class="w-screen h-screen" id="flexWrap" children={canvas} />;
    const roomKeys = Object.keys(room)
    const roomValues = Object.values(room)
    const roomList = roomKeys.map((element, index) => {
        if (element!= "users") return <li key={element}>{element}: {roomValues[index]}</li>
        return <li key={element}>{element}: {roomValues[index]?.toString()}</li>
    });
    console.log(`user is: ${user}`);
    useEffect(() => {
        console.log(`roomList: ${roomList}`)
        var event = document.createEvent('HTMLEvents');
        event.initEvent('resize', true, false);
        document.dispatchEvent(event);
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
        {/* {console.log(`room in client is: ${JSON.stringify(room)}`)} */}
        <ul className="ml-8">{roomList}</ul>
        <h1 className="ml-8">the game should be: {room.n}X{room.m}</h1>
        
    </>
}

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export const getServerSideProps: GetServerSideProps = async ({ params, query }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    try {
        const id = params?.uuid, userId = query?.userId
        init();
        if (!id || !userId || id === undefined || userId === undefined) {
            return { props: {bool : false}}
        }
        // use onsnapshot only on the client side as it opens a socket
        const room = await firebase.firestore().collection(`rooms`).doc(`${id}`).get().then((doc) => doc.data());
        const user = await firebase.firestore().collection(`users`).doc(`${userId}`).get().then((doc) => doc.data());
        
        // const item = sampleUserData.find((data) => data.id === Number(id))
        // By returning { props: item }, the StaticPropsDetail component
        // will receive `item` as a prop at build time
        // return { props: { item } }


        console.log(`room var is: ${room}, user: ${user}`);
        return {
            props: { 
                bool : true,
                room :room,
                user : user,
                errors : null
            }
        }


    } catch (err) {
        return { props: { bool : false, errors: err.message, room : null, user: null } };
    }
}