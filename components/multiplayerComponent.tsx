import React, { useEffect, useRef } from "react";
import Game from "../lib/multGame";

interface Props {
  userIndex: number;
  roomId: string;
  userId: string;
  n: number;
  m: number;
  id: string;
  className: string;
}

const Component: React.FC<Props> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    // Run after mount
    const game = new Game(
      props.userIndex,
      props.roomId,
      props.userId,
      canvasRef.current,
      props.n,
      props.m
    );
  }, []);

  return (
    <canvas ref={canvasRef} id={props.id} className={props.className}></canvas>
  );
};

export default Component;
