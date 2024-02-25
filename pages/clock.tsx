import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";

import Layout from "../components/Layout";

import CurrentlyPlayingV from "../components/CurrentPlaying-v";
import { customGet } from "../utils/customGet";

import { isAuthenticated } from "../utils/isAuthenticated";
import MovingCanvasV from "../components/MovingCanvas-v";
import { useEffect } from "react";
import BlobClock from "../components/BlobClock";

export default function Clock() {
  return (
    <Layout title="Welcome to Spotify">
      <BlobClock />
    </Layout>
  );
}
