import { useState, useEffect } from "react";
import moment from "moment";
import { useInterfaceStore } from "../utils/store";
import { motion } from "framer-motion";

export default function CalendarArt({ events }) {
  const vertical = useInterfaceStore((state) => state.vertical);
  const [filter, setFilter] = useState(true);
  const [time, setTime] = useState([0, 0, 0]);
  const [marker, setMarker] = useState(12);

  var now = moment().format();

  const tick = () => {
    setInterval(() => {
      setTime([moment().hour(), moment().minute(), moment().second()]);
    }, 1000);
  };

  const currentSec = time[0] * 60 * 60 + time[1] * 60 + time[2];
  const totalSec = 24 * 60 * 60;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0); // Set time to 00:00:00.000
  const tomorrowStart = moment(todayStart).add(1, "day");

  useEffect(() => {
    tick();
    console.log(events);
  }, []);
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 0,
        background: "white",
      }}
      suppressHydrationWarning={true}
    >
      <div
        style={{
          position: "relative",
          width: "90vw",
          height: "calc(100vh - 10vw)",
          display: "flex",
          flexDirection: "row",
          gap: 0,
          background: "pink",
          //   overflow: "hidden",
          filter: "url(#goo)",
        }}
      >
        <div
          style={{
            position: "absolute",
            display: "flex",
            height: "100%",
            alignItems: "flex-start",
            flexDirection: "column",
            justifyContent: "center",
            lineHeight: 1,
            zIndex: 10,
            paddingLeft: 30,
          }}
        >
          <p style={{ fontSize: 60, padding: 0, margin: 0, textAlign: "left" }}>
            {moment().format("MMM, DD")}
          </p>
          <p
            style={{ fontSize: 200, padding: 0, margin: 0, textAlign: "left" }}
          >
            {moment().format("HH:mm")}
          </p>
        </div>
        {Array(24)
          .fill(null)
          .map((info, index) => {
            return (
              <div
                key={index}
                style={{
                  height: "calc(100vh - 10vw)",
                  width: "calc(90vw / 24)",
                  borderRight: "1px solid grey",
                  color: "grey",
                  opacity: 0.2,
                }}
              >
                <p style={{ marginTop: -30, marginLeft: -5 }}>{index}</p>
              </div>
            );
          })}
        {/* 
        <div
          style={{
            position: "fixed",
            display: "flex",
            flexDirection: "column",
          }}
        > */}
        {/* {now}
          <br /> */}
        {/* {events === null && "loading.."} */}
        {events &&
          events.length !== 0 &&
          events.map((info, index) => {
            console
              .log
              //   moment.(info.end.dateTime) - new Date(info.start.dateTime)
              ();
            // console.log(new Date(info.end.dateTime));
            const start = moment(new Date(info.start.dateTime));
            const end = moment(new Date(info.end.dateTime));
            const differenceInMinutes = end.diff(start, "minutes");

            return (
              <motion.div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "green",
                  position: "absolute",
                  top: 0,
                  //   zIndex: 0,
                  left: `calc(90vw / 24 * ${
                    moment(info.start.dateTime).hour() +
                    moment(info.start.dateTime).minute() / 60
                  })`,
                  // moment(info.start.dateTime).hour() * 60 +
                  // moment(info.start.dateTime).minute(),
                  //   width: "fit-content",
                  //   height: "fit-content",
                  width: `calc(90vw / 24 * ${differenceInMinutes} / 60)`,
                  height: "calc(100vh - 10vw)",
                  marginBottom: 5,
                }}
              >
                {/* {info.summary}
                <br />
                {differenceInMinutes} */}
              </motion.div>
            );
          })}
        {events &&
          events.length !== 0 &&
          events.map((info, index) => {
            const start =
              index !== 0
                ? moment(new Date(events[index - 1].end.dateTime))
                : todayStart;
            const end = moment(new Date(info.start.dateTime));
            const differenceInMinutes = end.diff(start, "minutes");

            return (
              <motion.div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "orange",
                  position: "absolute",
                  top: 0,
                  //   zIndex: 0,
                  left: `calc(90vw / 24 * ${
                    moment(start).hour() + moment(start).minute() / 60
                  })`,
                  // moment(info.start.dateTime).hour() * 60 +
                  // moment(info.start.dateTime).minute(),
                  //   width: "fit-content",
                  //   height: "fit-content",
                  width: `calc(90vw / 24 * ${differenceInMinutes} / 60)`,
                  height: "calc(100vh - 10vw)",
                  marginBottom: 5,
                }}
              >
                {/* {info.summary}
                <br />
                {differenceInMinutes} */}
              </motion.div>
            );
          })}
      </div>
      <div
        style={{
          width: "90vw",
          height: "100vh",
          position: "fixed",
          left: "5vw",
        }}
      >
        <div
          style={{
            height: "100vh",
            width: 1,
            background: "red",
            position: "absolute",
            top: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            left: (currentSec / totalSec) * 100 + "%",
          }}
        ></div>
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        style={{ display: "none" }}
      >
        <defs>
          <filter id="goo">
            {/* <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={10}
              result="blur"
            /> */}
            <feTurbulence
              //type="turbulence"
              type="fractalNoise"
              baseFrequency={`${0.03} ${0.03}`}
              numOctaves={`${5}`}
              stitchTiles="stich"
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              result="noise"
            />

            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={5}
              xChannelSelector="R"
              yChannelSelector="B"
              x="0%"
              y="0%"
              width="100%"
              height="100%"
            />
            {/* <feColorMatrix
              in="blur"
              mode="matrix"
              values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${80} -${17}`}
              result="goo"
            /> */}

            {/* <feBlend in="SourceGraphic" in2="goo" />*/}
          </filter>
        </defs>
      </svg>
    </div>
  );
}
