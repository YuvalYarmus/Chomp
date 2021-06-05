import styles from '../styles/Home.module.css'
import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'
import React, { ReactNode, useEffect, useState, useRef, Ref } from 'react'
import { Game } from '../Game'
import 'tailwindcss/tailwind.css'


type divProps = {
  children?: ReactNode
  id?: string
  class?: string
}

type soundProps = {
  controls?: boolean
  src?: string
}

type canvasProps = {
  id?: string
  class?: string
  ref?: React.MutableRefObject<any>
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

function Canvas(props: canvasProps) {
  useEffect(() => {
    const game = new Game();
    return () => {
      window.removeEventListener(`resize`, game.resizeFunc);
    }
  });

  return <canvas ref={props.ref} id={props.id} className={props.class}></canvas>
}


/* {<div className={styles.container}> }*/ 
// </div>

export default function Home() {

  const canvasRef = useRef(null);
  const soundBar = <SoundItem controls src="" />
  const soundWrap = <WrapDiv id="soundControl" children={soundBar} />;
  const canvas = <Canvas ref={canvasRef} class="w-full h-full" id="canvas" />;
  const main = <WrapDiv class="w-screen h-screen" id="flexWrap" children={canvas} />;
  return <>
    <Head>
      <title>NextChomp</title>
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
    {soundWrap}
    {main}
    

  </>
}



/*
<div id="Holder2" x-data="{ open: false }"
        x-init=" () => $watch('open', value => { if (value === true) { document.body.classList.add('overflow-hidden') } else { document.body.classList.remove('overflow-hidden') } });"
        x-show="open" className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div x-show="open" x-description="Background overlay, show/hide based on modal state."
                x-transition:enter="ease-out duration-300" x-transition:enter-start="opacity-0"
                x-transition:enter-end="opacity-100" x-transition:leave="ease-in duration-200"
                x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0"
                className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div><span
                className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div x-show="open" x-description="Modal panel, show/hide based on modal state."
                x-transition:enter="ease-out duration-300"
                x-transition:enter-start="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                x-transition:enter-end="opacity-100 translate-y-0 sm:scale-100"
                x-transition:leave="ease-in duration-200"
                x-transition:leave-start="opacity-100 translate-y-0 sm:scale-100"
                x-transition:leave-end="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                Do you wish to play another game? </h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    if you wish to play one more time feel free to press the play again button and
                                    restart the game.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button onClick={ () => {document
            .getElementById("Holder2")!
            .setAttribute("x-data", "{ open: false }"); setTimeout(() => window.location.reload() , 300)}} type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                        Play Again
                    </button>
                    <button onClick={ () => {document
            .getElementById("Holder2")!
            .setAttribute("x-data", "{ open: false }");}} type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
    */