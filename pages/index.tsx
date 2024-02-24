import { GetServerSideProps } from "next";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import AlbumList from "../components/AlbumList";
import Heading from "../components/Heading";
import Layout from "../components/Layout";
import Header from "../components/Header";
import PlaylistList from "../components/PlaylistList";
import CurrentlyPlaying from "../components/CurrentPlaying";
import { customGet } from "../utils/customGet";
import { getGreeting } from "../utils/getGreeting";
import { isAuthenticated } from "../utils/isAuthenticated";
import MovingCanvas from "../components/MovingCanvas";

export default function Home({ session }) {
  return (
    <Layout title="Welcome to ArtOS">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        {session?.user.email}
        <br />
        {session?.user.name}
        <img src={session?.user.picture} width={100} height={100} />
      </div>

      {/* <CurrentlyPlaying />
      <MovingCanvas /> */}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  console.log(session);

  if (!(await isAuthenticated(session))) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // const newReleases = await customGet(
  //   "https://api.spotify.com/v1/browse/new-releases?country=IN&limit=25",
  //   session
  // );

  // const featuredPlaylists = await customGet(
  //   "https://api.spotify.com/v1/browse/featured-playlists?country=IN",
  //   session
  // );

  return { props: { session } };
};
