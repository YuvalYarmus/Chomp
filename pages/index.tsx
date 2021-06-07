import Link from 'next/link'
import Head from 'next/head'
import { useEffect } from 'react'
import styles from '../styles/Home.module.css'
import Image from 'next/image'
import 'tailwindcss/tailwind.css'
function HomePage() {
    useEffect( () => {
        document.getElementById('__next')!.classList.add('MegaCenter');
        // document.getElementsByTagName("BODY")[0].classList.add('flex ml-5');
        document.body.classList.add("grid");
    })
    const style1 = {
        
    }
    return (<>
    <Head>
        <title>NextChomp</title>
		<meta charSet="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta http-equiv="X-UA-Compatible" content="ie=edge" />
		<link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css"
        integrity="sha256-mmgLkCYLUQbXn0B1SRqzHar6dCnv9oZFPEC1g1cwlkk="
        crossOrigin="anonymous"
		/>
        <link rel="stylesheet" href="/css/index2.css"/>    
    </Head>
    <div className="join-container">
    <div className="join-container" style={style1}>
			<header className="join-header">
				<h1 className="title"><i className="fas fa-smile"></i> Chomp Online</h1>
			</header>
			<main className="join-main">
				<form id="form" className="form" action="/loader">                    
                    <input id="a" type="radio" name="hopping" value="a" defaultChecked />
                    <label htmlFor="a"><span></span>One Device</label>
                    <input id="b" type="radio" name="hopping" value="b" />
                    <label htmlFor="b"><span></span>Online Multiplayer</label>
                    <input id="c" type="radio" name="hopping" value="c" />
                    <label htmlFor="c"><span></span>Play against a bot</label>
                    <div className="worm">
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                    </div>
                    
                    <button type="submit" className="btn">Start a game!</button>
                </form>
			</main>
		</div>
    </div>
        </>)
}

export default HomePage
