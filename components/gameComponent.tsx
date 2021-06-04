import React, { ReactNode, useEffect, useState , useRef, Ref, MutableRefObject } from 'react'
import { Game } from '../Game'

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
    const game = new Game(canvasRef2.current);
    // const game = new Game(canvasRef);
    return () => {
      window.removeEventListener(`resize`, game.resizeFunc);
    }
  }, []);
  return <canvas ref={(canvas) => canvasRef = canvas} id={props.id} className={props.class}></canvas>
  // return <canvas ref={(canvas) => canvasRef = canvas} id={props.id} className={props.class}></canvas>
}

export default Component;