import React, { ReactNode, useEffect, useState , useRef, Ref, MutableRefObject } from 'react'
import { Game } from '../Game'
import { Bot } from "../bot"

interface Props {
  // Props
  id?: string
  class?: string
}

const Component: React.FC<Props> = (props) => {
  let canvasRef : HTMLCanvasElement | null = null;
  const canvasRef2 = useRef(null);
  useEffect(() => {
    // Run after mount
    const bot = new Bot(canvasRef2.current)
    return () => {
      window.removeEventListener(`resize`, bot.resizeFunc);
    }
  }, []);
  return <canvas ref={canvasRef2} id={props.id} className={props.class}></canvas>
}

export default Component;