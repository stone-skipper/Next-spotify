import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import moment from "moment";
import { hexToRGBA, addZero } from "../utils/utils";
import Flower from "./Flower";

export default function FlowerClock() {
  const [timer, setTimer] = useState(25);
  const [timerStart, setTimerStart] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  // const [minutesElapsed, setMinutesElapsed] = useState(0);

  const [totalDuration, setTotalDuration] = useState(timer * 60);

  const [vertical, setVertical] = useState(false);

  useEffect(() => {
    setTotalDuration(timer * 60);
  }, [timer]);

  useEffect(() => {
    let timer;
    if (timerStart) {
      timer = setInterval(() => {
        setSecondsElapsed((prevSeconds) => prevSeconds + 1);
      }, 1000); // Update every second
    }

    // Cleanup function to stop the timer when the component unmounts or when timerRunning becomes false
    return () => clearInterval(timer);
  }, [timerStart]); // Re-run effect when timerRunning changes

  // Calculate minutes and seconds remaining
  const minutesRemaining = Math.floor((totalDuration - secondsElapsed) / 60);
  const secondsRemaining = (totalDuration - secondsElapsed) % 60;

  // Calculate progress percentage
  const progress = (secondsElapsed / totalDuration) * 100;
  const minutes = Math.floor(secondsElapsed / 60) + 1;

  const handleStartTimer = () => {
    setTimerStart(true);
  };

  const TimerControl = ({ label, onClick }) => {
    return (
      <motion.div
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          background: hexToRGBA("#ffffff", 0.2),
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
      >
        {label}
      </motion.div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        justifyContent: "center",
        alignItems: "center",
        overflow: "visible",
        flexDirection: "row",
        position: "relative",
        // background: "beige",
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 30,
            width: "30vw",
          }}
        >
          <TimerControl
            label={"+"}
            onClick={() => {
              setTimer(timer + 5);
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <span
              style={{ fontSize: "6em", margin: 0, padding: 0, lineHeight: 1 }}
              onClick={() => {
                setTimerStart(true);
              }}
            >
              {timerStart === true
                ? `${addZero(
                    Math.floor((totalDuration - secondsElapsed) / 60)
                  )}:${addZero((totalDuration - secondsElapsed) % 60)}`
                : timer}
            </span>{" "}
            {timerStart === true ? "remaining" : "minutes"}
            {/* {timerStart === true && progress} */}
          </div>
          <TimerControl
            label={"-"}
            onClick={() => {
              if (timer > 5) {
                setTimer(timer - 5);
              }
            }}
          />
        </div>
      </div>
      <div
        //flower
        style={{
          width: "50vw",
          height: "100vh",
          background: "beige",
          position: "relative",
        }}
      >
        {/* <Flower flowerColor="red" /> */}
        {Array(minutes)
          .fill(null)
          .map((info, index) => {
            return (
              <motion.div
                key={"flower" + index}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 100,
                  background: "pink",
                  display: timerStart === true ? "block" : "none",
                  filter: "url(#noise)",
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 60 }}
              ></motion.div>
            );
          })}
        <div
          style={{
            width: "100%",
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            left: 0,
            bottom: 20,
          }}
        >
          <svg
            width="200"
            //   height="558"
            viewBox="0 0 594 558"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#vase)">
              <rect
                x="0"
                y="0"
                width={"100%"}
                height={"100%"}
                //   fill="blue"
                fill="url(#paint0_linear_2451_6106)"
                filter="url(#noise)"
              ></rect>
            </g>
            <defs>
              <clipPath id="vase">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M113.496 0C108.215 0 104.381 5.02759 105.781 10.1201L128.434 92.5388C55.8086 102.996 0 165.48 0 241V550C0 554.418 3.58203 558 8 558H586C590.418 558 594 554.418 594 550V241C594 165.48 538.191 102.996 465.566 92.5388L488.219 10.1201C489.619 5.02759 485.785 0 480.504 0H113.496Z"
                ></path>
              </clipPath>
              <linearGradient
                id="paint0_linear_2451_6106"
                x1="297"
                y1="279"
                x2="545"
                y2="279"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FF8B49" />
                <stop offset="1" stopColor="#FF8B49" />
              </linearGradient>
              <filter id="noise">
                <feTurbulence
                  //type="turbulence"
                  type="fractalNoise"
                  baseFrequency={`${0.1} ${0.1}`}
                  numOctaves={`${10}`}
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
                  scale={35}
                  xChannelSelector="R"
                  yChannelSelector="B"
                  x="0%"
                  y="0%"
                  width="100%"
                  height="100%"
                />
                {/* <feTurbulence
                type="fractalNoise"
                baseFrequency="1"
                numOctaves="3"
                stitchTiles="stitch"
              />

              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale={`${5} `}
                xChannelSelector="R"
                yChannelSelector="B"
                x="0"
                y="0"
                width="100%"
                height="100%"
              /> */}
              </filter>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
