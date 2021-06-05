import Link from 'next/link'
import Head from 'next/head'
import { useEffect } from 'react'
import 'tailwindcss/tailwind.css'


function getURLParam(paramName: string) {
    let params = new URLSearchParams(window.location.search);
    console.log(window.location.search)
    return params.get(paramName);
}

function Load() {
    useEffect(() => {
        let hopping: string = getURLParam("hopping")!;
        if (hopping === "c") setTimeout(() => {
            window.location.replace("/bot");
        }, 500);
        else if (hopping === "a") setTimeout(() => {
            window.location.replace("/solo");
        }, 500);
        else {
            let page="/multiplayer"
            let style = `style="color:grey; padding-top:10px;"`;
            let text: string = `
        <main class="join-main">
        <form id="form" class="form" action="${page}">
            <input id="full_name" placeholder="Plese enter your name" name="full_name" required>
            <label for="n" ${style}>The amount of columns:</label>
            <input type="number" id="n" value="6" name="n" min="2" max="8">
            <label for="m" ${style}>The amount of rows:</label>
            <input type="number" id="m" value="7" name="m" min="2" max="8">
            <button type="submit" class="btn">Start the game!</button>
        </form></main>
        `;
            var node = document.getElementById("container2")!;
            node.innerHTML = text;
        }
    })
    return (<><Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css"
            integrity="sha256-mmgLkCYLUQbXn0B1SRqzHar6dCnv9oZFPEC1g1cwlkk="
            crossOrigin="anonymous"
        />
        <link rel="stylesheet" href="/css/loader.css" />

        <title>Chomp Online Loading Page</title>

    </Head>
        <div id="container"></div>
        <div className="join-container">
            <main className="join-main"><div id="container2"></div></main>
        </div>
        <script src="https://unpkg.com/three@0.110.0/build/three.js"></script>
        <script src="/cube/three.min.js"></script>
        <script src="/cube/loader2.js"></script>
        {/* <script src="/loader.ts" ></script> */}
    </>
    );
}

export default Load