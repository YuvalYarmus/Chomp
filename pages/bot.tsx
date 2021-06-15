import styles from '../styles/Home.module.css'
import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'
import React, { ReactNode, useEffect, useState, useRef, Ref } from 'react'
import dynamic from "next/dynamic";


const Canvas = dynamic(() => import("../components/botComponent"), {
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

function WrapDiv(props: divProps) {
    return <div id={props.id} className={props.class}>{props.children}</div>
}

function SoundItem({ src, controls = false }: soundProps) {
    if (controls) return <audio controls>
        <source src={src} type="audio/ogg" />
    </audio>
    return <audio src={src}></audio>
}

export default function BotPage() {
    const soundBar = <SoundItem src="" />
    const soundWrap = <WrapDiv id="soundControl" children={soundBar} />;
    const canvas = <Canvas class="w-4/5 h-4/5" id="canvas" />;
    const main = <WrapDiv class="w-screen h-screen" id="flexWrap" children={canvas} />;
    return <>
        <Head>
            <title>BotChomp</title>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css"
                integrity="sha256-mmgLkCYLUQbXn0B1SRqzHar6dCnv9oZFPEC1g1cwlkk="
                crossOrigin="anonymous"
            />
            <link rel="stylesheet" href="/index2.css" />
            <link rel="icon" href="favicon.ico" />
        </Head>
        <h1>Welcome to the NextChomp Bot Page!</h1>
        {main}
    </>
}