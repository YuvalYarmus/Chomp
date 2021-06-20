import React, { useEffect, useRef } from "react";

import { Bot } from "../lib/bot";

interface Props {
  id?: string;
  class?: string;
}

const Component: React.FC<Props> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Run after mount
    const bot = new Bot(canvasRef.current);
    return () => {
      window.removeEventListener(`resize`, bot.resizeFunc);
    };
  }, []);

  return (
    <canvas ref={canvasRef} id={props.id} className={props.class}></canvas>
  );
};

export default Component;
