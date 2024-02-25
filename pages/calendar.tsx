import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
// import { google } from "googleapis";
// import { useSpotify } from "../context/SpotifyContext";

import { useEffect, useState } from "react";
import Layout from "../components/Layout";

import { customGet } from "../utils/customGet";

import { isAuthenticated } from "../utils/isAuthenticated";

export default function Calendar({ session }) {
  const [events, setEvents] = useState(null);
  //   const { calendar, fetchCalendar } = useSpotify();
  //   useEffect(() => {
  //     fetchCalendar();
  //     console.log(calendar);
  //   }, []);
  useEffect(() => {
    async function fetchEvents() {
      const res = await fetch("/api/calendar"); // Adjust the path to match your API route
      const data = await res.json();
      setEvents(data);
    }

    fetchEvents();
  }, []);
  return (
    <Layout title="Welcome to Spotify">
      Calendar
      {events &&
        events.length !== 0 &&
        events.map((info, index) => {
          return (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                background: "green",
                width: "fit-content",
                height: "fit-content",
                marginBottom: 5,
              }}
            >
              {info.summary}
              <br />
              {info.start.dateTime} <br />
              {info.end.dateTime}
            </div>
          );
        })}
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

  return { props: { session } };
};
