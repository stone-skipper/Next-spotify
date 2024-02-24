import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

import Layout from "../components/Layout";

import CurrentlyPlayingAI from "../components/CurrentlyPlaying-ai";
import { customGet } from "../utils/customGet";

import { isAuthenticated } from "../utils/isAuthenticated";
import MovingCanvasAI from "../components/MovingCanvas-ai";

export default function Vertical() {
  return (
    <Layout title="Welcome to Spotify">
      <CurrentlyPlayingAI />
      <MovingCanvasAI />
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
