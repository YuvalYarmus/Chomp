import Head from "next/head";
import { useEffect } from "react";

function HomePage() {
  useEffect(() => {
    document.getElementById("__next")!.classList.add("MegaCenter");
    // document.getElementsByTagName("BODY")[0].classList.add('flex ml-5');
    document.body.classList.add("grid");
  });
  return (
    <>
      <Head>
        <title>NextChomp</title>
        <link rel="stylesheet" href="/css/index2.css" />
      </Head>
      <div className="join-container">
        <div className="join-container">
          <header className="join-header">
            <h1 className="title">
              <i className="fas fa-smile"></i> Chomp Online
            </h1>
          </header>
          <main className="join-main">
            <form id="form" className="form" action="/loader">
              <input
                id="a"
                type="radio"
                name="hopping"
                value="a"
                defaultChecked
              />
              <label htmlFor="a">
                <span></span>One Device
              </label>
              <input id="b" type="radio" name="hopping" value="b" />
              <label htmlFor="b">
                <span></span>Online Multiplayer
              </label>
              <input id="c" type="radio" name="hopping" value="c" />
              <label htmlFor="c">
                <span></span>Play against a bot
              </label>
              <div className="worm">
                {Array(29)
                  .fill(null)
                  .map((_, i) => (
                    <div className="worm__segment" key={i}></div>
                  ))}
              </div>

              <button type="submit" className="btn">
                Start a game!
              </button>
            </form>
          </main>
        </div>
      </div>
    </>
  );
}

export default HomePage;
