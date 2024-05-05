import moment from "moment";
import { useState, useEffect } from "react";
export default function Time({
  color = "white",
  dayFontSize = 60,
  timeFontSize = 200,
}) {
  const [time, setTime] = useState([0, 0, 0]);

  useEffect(() => {
    const tick = setInterval(() => {
      setTime([moment().hour(), moment().minute(), moment().second()]);
    }, 1000);
    return () => clearInterval(tick);
  }, []);
  return (
    <div>
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
          color: color,
        }}
      >
        <p
          style={{
            fontSize: dayFontSize,
            padding: 0,
            margin: 0,
            textAlign: "left",
          }}
        >
          {moment().format("MMM, DD")}
        </p>
        <p
          style={{
            fontSize: timeFontSize,
            padding: 0,
            margin: 0,
            textAlign: "left",
          }}
        >
          {moment().format("HH:mm")}
        </p>
      </div>
    </div>
  );
}
