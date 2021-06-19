import Head from "next/head";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import homeCss from "../styles/Home.module.css"
import Image from 'next/image'


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
export default MyApp;
