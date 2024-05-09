import BlobClock from "../components/BlobClock";

import Layout from "../components/Layout";

export default function Home({ session }) {
  return (
    <Layout title="Timeface (beta)">
      <BlobClock />
      {/* <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <Link href="/calendar">Calendar</Link>
        <Link href="/clock">Clock</Link>
        <Link href="/vertical">Music</Link>
        <Link href="/pomodoro">Timer</Link>

        {session?.user.email}
        <br />
        {session?.user.name}
        <img src={session?.user.picture} width={100} height={100} />
      </div> */}

      {/* <CurrentlyPlaying />
      <MovingCanvas /> */}
    </Layout>
  );
}

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const session = await getSession(ctx);
//   console.log(session);

// if (!(await isAuthenticated(session))) {
//   return {
//     redirect: {
//       destination: "/login",
//       permanent: false,
//     },
//   };
// }

// const newReleases = await customGet(
//   "https://api.spotify.com/v1/browse/new-releases?country=IN&limit=25",
//   session
// );

// const featuredPlaylists = await customGet(
//   "https://api.spotify.com/v1/browse/featured-playlists?country=IN",
//   session
// );

//   return { props: { session } };
// };
