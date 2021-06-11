import React, { ReactNode, useEffect, useState , useRef, Ref, MutableRefObject } from 'react'
import Game from '../multGame'

interface Props {
  // Props
  userIndex : number,
  roomId : string,
  userId : string,
  n : number, 
  m : number
  id?: string,
  class?: string
}

const Component: React.FC<Props> = (props) => {
  let canvasRef : HTMLCanvasElement | null = null;
  const canvasRef2 = useRef(null);
  useEffect( () => {
    // Run after mount
    let game = new Game(props.userIndex, props.roomId, props.userId, canvasRef2.current, props.n, props.m);
    
    // return () => {
    //   window.removeEventListener(`resize`, game.resizeFunc);
    // }
  }, []);
  return <canvas ref={canvasRef2} id={props.id} className={props.class}></canvas>
  // return <canvas ref={(canvas) => canvasRef = canvas} id={props.id} className={props.class}></canvas>
}

export default Component;