import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";

import Layout from "../components/Layout";

import CurrentlyPlayingV from "../components/CurrentPlaying-v";
import { customGet } from "../utils/customGet";

import { isAuthenticated } from "../utils/isAuthenticated";
import MovingCanvasV from "../components/MovingCanvas-v";
import { useEffect } from "react";

export default function Vertical() {
  //   const { data: session, status, update } = useSession();

  //   // Polling the session every 1 hour
  //   useEffect(() => {
  //     // TIP: You can also use `navigator.onLine` and some extra event handlers
  //     // to check if the user is online and only update the session if they are.
  //     // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine
  //     const interval = setInterval(() => update(), 1000 * 60 * 60);
  //     return () => clearInterval(interval);
  //   }, [update]);

  //   // Listen for when the page is visible, if the user switches tabs
  //   // and makes our tab visible again, re-fetch the session
  //   useEffect(() => {
  //     const visibilityHandler = () =>
  //       document.visibilityState === "visible" && update();
  //     window.addEventListener("visibilitychange", visibilityHandler, false);
  //     return () =>
  //       window.removeEventListener("visibilitychange", visibilityHandler, false);
  //   }, [update]);

  return (
    <Layout title="Welcome to Spotify">
      <CurrentlyPlayingV />
      <MovingCanvasV />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!(await isAuthenticated(session))) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const newReleases = await customGet(
    "https://api.spotify.com/v1/browse/new-releases?country=IN&limit=25",
    session
  );

  const featuredPlaylists = await customGet(
    "https://api.spotify.com/v1/browse/featured-playlists?country=IN",
    session
  );

  return { props: { newReleases, featuredPlaylists } };
};
