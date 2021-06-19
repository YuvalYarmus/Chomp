import Head from 'next/head'
import React, { useEffect } from 'react'
import dynamic from "next/dynamic";

const Canvas = dynamic(() => import("../components/gameComponent"), {
	ssr: false,
});

export default function Solo() {
	useEffect(() => {
		document.body.style.backgroundColor = "#251f1f"
	});

	return <>
		<Head>
			<title>SoloChomp</title>
			<link rel="stylesheet" href="/index2.css" />
		</Head>
		<h1 className="text-gray-400">Welcome to the NextChomp One Device Page!</h1>
		<div className="w-screen h-screen" id="flexWrap">
			<Canvas class="w-4/5 h-4/5" id="canvas" />
		</div>
	</>
}