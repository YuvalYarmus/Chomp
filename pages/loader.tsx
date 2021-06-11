import Link from 'next/link'
import Head from 'next/head'
import { useEffect } from 'react'
import 'tailwindcss/tailwind.css'
import init from '../firebase/initFirebase'
import { writeToFireStore, Room, User, createGameString } from '../firebase/loadWrite'
const { v4: uuidV4, validate: uuidValidate } = require("uuid");
import { useRouter } from 'next/router'

function getURLParam(paramName: string) {
    let params = new URLSearchParams(window.location.search);
    console.log(window.location.search)
    return params.get(paramName);
}

function Load() {
    const router = useRouter();
    useEffect(() => {
        let hopping: string = getURLParam("hopping")!;
        if (hopping === "c") setTimeout(() => {
            window.location.replace("/bot");
        }, 500);
        else if (hopping === "a") setTimeout(() => {
            window.location.replace("/solo");
        }, 500);
        else {
            init();
            let style = `style="color:grey; padding-top:10px;"`;
            let text: string = `
            <main class="join-main">
            <form id="form" class="form">
            <input id="full_name" placeholder="Plese enter your name" name="full_name" required>
            <label for="n" ${style}>The amount of columns:</label>
            <input type="number" id="n" value="7" name="n" min="2" max="8">
            <label for="m" ${style}>The amount of rows:</label>
            <input type="number" id="m" value="9" name="m" min="2" max="12">
            <button type="submit" class="btn">Start the game!</button>
            </form></main>
            `;
            const node = document.getElementById("container2")!;
            node.innerHTML = text;
            const form = document.getElementById("form")!.addEventListener("submit", async (e) => {
                e.preventDefault();
                const n = parseInt((document.getElementById("n")! as HTMLInputElement).value);
                const m = parseInt((document.getElementById("m")! as HTMLInputElement).value);
                const name = (document.getElementById("full_name")! as HTMLInputElement).value;
                const roomUuid = uuidV4(), userUuid = uuidV4();
                console.log(`--------submit triggered---------`)
                const user: User = {
                    // id: `${uuid}-${name}`,
                    id: userUuid,
                    name: name,
                    room: roomUuid
                }
                const room: Room = {
                    population: 1,
                    uuid: roomUuid,
                    currTurn: 0,
                    n: n,
                    m: m,
                    users: [user],
                }
                console.log(`from loader: room: ${JSON.stringify(room)}, user: ${JSON.stringify(user)}`)
                await writeToFireStore(room, user);
                // alert(`after write to firestore`);
                console.log(`from loader: after write to firestore`);
                router.push({
                    pathname: `/room/${roomUuid}`,
                    query: { name: name, userId: userUuid   },
                });
                // router.push(`?name=${name}&&userId=${uuid}-${name}`);
            });
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