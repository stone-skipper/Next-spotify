import { useState, useEffect } from "react";
import moment from "moment";
import { useInterfaceStore } from "../utils/store";

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
        flexDirection: "row",
        gap: 0,
      }}
      suppressHydrationWarning={true}
    >
      {Array(24)
        .fill(null)
        .map((info, index) => {
          return (
            <div
              key={index}
              style={{
                height: "100vh",
                width: "calc(100vw / 24)",
                borderRight: "1px solid yellow",
                color: "yellow",
              }}
            >
              {index}
            </div>
          );
        })}

      <div
        style={{ position: "fixed", display: "flex", flexDirection: "column" }}
      >
        {now}
        <br />
        {events === null && "loading.."}
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
      </div>
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
          overflow: "visible",
        }}
      >
        {/* {(currentSec / totalSec) * 100} */}
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: 100,
            background: "red",
          }}
        ></div>
      </div>
    </div>
  );
}
