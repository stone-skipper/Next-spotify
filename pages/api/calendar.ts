import type { NextApiHandler } from "next";
import { getSession } from "next-auth/react";
import { google } from "googleapis";

const TestHandler: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    res.status(401);
  }
  if (session) {
    console.log(session);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  const accessToken = session?.user?.accessToken;
  //   const refreshToken = session?.user?.refreshToken;

  const auth = new google.auth.OAuth2({
    clientId,
    clientSecret,
  });
  auth.setCredentials({
    access_token: accessToken,
    // refresh_token: refreshToken,
  });

  //   console.log(accessToken, refreshToken);
  const calendar = google.calendar({ auth, version: "v3" });
  //   try {
  //     const calendarId = "primary";
  //     const response = await calendar.events.list({
  //       calendarId,
  //       timeMin: new Date().toISOString(),
  //       maxResults: 10,
  //       singleEvents: true,
  //       orderBy: "startTime",
  //     });

  //     const events = response.data.items;
  //     console.log(events);

  //     // return events;
  //     res.status(200).json(events);
  //   } catch (error) {
  //     console.error("Error fetching calendar events: ", error);
  //     // return error;
  //   }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0); // Set time to 00:00:00.000
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1); // Start of tomorrow
  try {
    // List all calendars
    const calendarList = await calendar.calendarList.list();
    const calendarIds = calendarList.data.items.map((item) => item.id);

    let allEvents = [];

    // Fetch events from each calendar
    for (const calendarId of calendarIds) {
      const events = await calendar.events.list({
        calendarId: calendarId,
        timeMin: todayStart.toISOString(),
        timeMax: tomorrowStart.toISOString(),
        maxResults: 10, // Fetch up to 10 future events from each calendar
        singleEvents: true,
        orderBy: "startTime",
      });

      const filteredEvents = events.data.items.filter((event) => {
        const start = new Date(event.start.dateTime || event.start.date);
        const end = new Date(event.end.dateTime || event.end.date);
        // @ts-ignore
        const durationHours = (end - start) / (1000 * 60 * 60);
        return durationHours < 24;
      });

      allEvents.push(...filteredEvents);
    }

    // Sort all events by start time
    allEvents.sort(
      (a, b) =>
        new Date(a.start.dateTime || a.start.date).getTime() -
        new Date(b.start.dateTime || b.start.date).getTime()
    );

    // Select the closest 10 events
    // const closestEvents = allEvents.slice(0, 10);
    const closestEvents = allEvents;

    res.status(200).json(closestEvents);
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    res.status(500).json({ error: "Failed to fetch calendar events" });
  }
};

export default TestHandler;
