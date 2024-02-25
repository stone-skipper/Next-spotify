import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import moment from "moment";

export default function BlobClock() {
  const [filter, setFilter] = useState(true);
  const [time, setTime] = useState([0, 0, 0]);
  const [marker, setMarker] = useState(12);
  const centerColor = "lightgrey";
  const hourmark = "green";
  const minutemark = "#ff340a";
  const secondmark = "blue";
  var now = moment().format();

  const tick = () => {
    setInterval(() => {
      setTime([moment().hour(), moment().minute(), moment().second()]);
    }, 1000);
  };

  useEffect(() => {
    tick();
  }, []);
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "60vw",
        justifyContent: "center",
        alignItems: "center",
        overflow: "visible",
        filter: 'url("#goo")',
        flexDirection: "column",
        position: "relative",
      }}
    >
      <motion.div
        style={{
          width: 40,
          height: 40,
          borderRadius: 30,
          background: centerColor,
        }}
      ></motion.div>
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      ></div>
      {Array(marker)
        .fill(null)
        .map((info, index) => {
          return (
            <motion.div
              key={"hourmark" + index}
              style={{
                width: "100%",
                aspectRatio: 1 / 1,
                position: "absolute",
                display: "flex",
                justifyContent: "center",
                alignItems: "end",
              }}
              animate={{ rotate: (index + 1) * 30 + 180 }}
            >
              <motion.div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 100,
                  // background: props.marks,
                  margin: 100,
                  fontSize: 200,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  rotate: (index + 1) * -30 + 180,
                  padding:
                    time[0] === index + 1 || time[0] - 12 === index + 1
                      ? 100
                      : 0,
                  color:
                    time[0] === index + 1 || time[0] - 12 === index + 1
                      ? hourmark
                      : centerColor,
                }}
              >
                {index + 1}
              </motion.div>
            </motion.div>
          );
        })}
      <motion.div
        // hour indicator
        style={{
          display: "flex",
          width: "50%",
          height: "50%",
          justifyContent: "center",
          position: "absolute",
        }}
        animate={{
          rotate:
            time[0] > 12
              ? ((time[0] - 12) / 12) * 360 + (time[1] / 60) * 30
              : (time[0] / 12) * 360 + (time[1] / 60) * 30,
        }}
      >
        <div
          style={{
            height: "30%",
            width: 30,
            background: hourmark,
            textTransform: "uppercase",
            writingMode: "vertical-rl",
          }}
        ></div>
      </motion.div>

      <motion.div
        // minute indicator
        style={{
          display: "flex",
          width: "50%",
          height: "50%",
          // background: "blue",
          justifyContent: "center",
          position: "absolute",
        }}
        animate={{
          rotate: time[1] * 6,
        }}
      >
        <motion.div
          style={{
            height: "50%",
            width: 30,
            background: minutemark,
            textTransform: "uppercase",
            writingMode: "vertical-rl",
          }}
        ></motion.div>
      </motion.div>

      <motion.div
        // second indicator
        style={{
          display: "flex",
          width: "80%",
          height: "80%",
          justifyContent: "center",
          position: "absolute",
        }}
        animate={{
          rotate: time[2] * 6 + 180,
        }}
      >
        <div
          style={{
            height: "90%",
            width: 100,
            // background: "green",
            display: "flex",
            justifyContent: "center",
            alignItems: "end",
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 100,
              background: secondmark,
            }}
          ></div>
        </div>
      </motion.div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        style={{ display: "none" }}
      >
        <defs>
          <filter id="goo">
            <motion.feGaussianBlur
              in="SourceGraphic"
              // stdDeviation={filter === true ? 20 : 0}
              result="blur"
              animate={{
                stdDeviation: filter === true ? 10 : 0,
              }}
              transition={{ duration: 1 }}
            />
            <feTurbulence
              //type="turbulence"
              type="fractalNoise"
              baseFrequency={`${0.01} ${0.01}`}
              numOctaves={`${5} `}
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
              scale={`${0} `}
              xChannelSelector="R"
              yChannelSelector="B"
              x="0%"
              y="0%"
              width="100%"
              height="100%"
            />
            <motion.feColorMatrix
              in="blur"
              mode="matrix"
              values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${80} -${17}`}
              result="goo"
              animate={{
                values:
                  filter === true
                    ? `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${80} -${17}`
                    : `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${1} -${0}`,
              }}
              transition={{ duration: 1 }}
            />

            {/* <feBlend in="SourceGraphic" in2="goo" />*/}
          </filter>
        </defs>
      </svg>
    </div>
  );
}
