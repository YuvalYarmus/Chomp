import React, { useEffect, useRef } from "react";

import { Game } from "../lib/Game";

interface Props {
  id: string;
  className: string;
  n?: number;
  m?: number;
}

const Component: React.FC<Props> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let game: Game;
    if (props.n && props.m)
      game = new Game(canvasRef.current, props.n, props.m);
    else new Game(canvasRef.current);
  }, []);

  return (
    <canvas ref={canvasRef} id={props.id} className={props.className}></canvas>
  );
};

export default Component;
