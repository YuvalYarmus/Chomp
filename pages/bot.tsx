import React, { useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

const Canvas = dynamic(() => import("../components/botComponent"), {
  ssr: false,
});

export default function BotPage() {
  useEffect(() => {
    document.body.style.backgroundColor = "#251f1f";
  });

  return (
    <>
      <Head>
        <title>BotChomp</title>
        <link rel="stylesheet" href="/index2.css" />
      </Head>
      <h1 className="text-gray-400">Welcome to the NextChomp Bot Page!</h1>
      <div className="w-screen h-screen" id="flexWrap">
        <Canvas class="w-4/5 h-4/5" id="canvas" />
      </div>
    </>
  );
}
