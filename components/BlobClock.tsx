import { motion, useAnimation } from "framer-motion";
import { useState, useEffect } from "react";
import moment from "moment";
import { ColorPicker } from "./ColorPicker";
import { useInterfaceStore } from "../utils/store";
import Controls from "./Controls";

export default function BlobClock() {
  const [filter, setFilter] = useState(true);
  const [time, setTime] = useState([0, 0, 0]);
  const [marker, setMarker] = useState(12);
  const [bgColor, setBgColor] = useState("#DDC445");
  const [numberColor, setNumberColor] = useState("#C4A840");
  const [hourmark, setHourmark] = useState("#70F570");
  const [minutemark, setMinutemark] = useState("#90A2FF");
  const [secondmark, setSecondmark] = useState("#F0F0FF");
  const [highlightColor, setHighlightColor] = useState("#FF682A");
  const [name, setName] = useState("seungmee");
  const vertical = useInterfaceStore((state) => state.vertical);
  const [settings, setSettings] = useState(false);
  const secondHand = useAnimation();

  const hourHand = useAnimation();
  const minuteHand = useAnimation();
  const [initialLoad, setInitialLoad] = useState(false);

  useEffect(() => {
    setInitialLoad(true);

    const tick = setInterval(() => {
      setTime([moment().hour(), moment().minute(), moment().second()]);
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  const animateHands = async () => {
    // If the second is `0`, we need to handle the reset-to-0 scenario
    if (time[2] === 59) {
      // Reset instantly to `180` degrees without any animation
      await secondHand.start({
        rotate: 180 + 59 * 6,
        transition: { duration: 0.5, type: "spring" },
      });
      // Then animate to `1` second (which is `186` degrees)
      secondHand.start({
        rotate: 180 - 6,
        transition: { duration: 0 },
      });
    } else {
      // For all other seconds, animate normally
      secondHand.start({
        rotate: time[2] * 6 + 180,
        transition: { duration: 0.5, type: "spring" },
      });
    }

    // If the minute is `0`, we need to handle the reset-to-0 scenario
    if (time[1] === 59) {
      // Reset instantly to `180` degrees without any animation
      await minuteHand.start({
        rotate: 59 * 6,
        transition: { duration: 0.5, type: "spring" },
      });
      // Then animate to `1` minute (which is `186` degrees)
      minuteHand.start({
        rotate: -6,
        transition: { duration: 0 },
      });
    } else {
      // For all other minutes, animate normally
      minuteHand.start({
        rotate: time[1] * 6,
        transition: { duration: 0.5, type: "spring" },
      });
    }

    // If the minute is `0`, we need to handle the reset-to-0 scenario
    // if (time[0] === 23) {
    //   // Reset instantly to `180` degrees without any animation
    //   await hourHand.start({
    //     rotate: 59 * 6,
    //     transition: { duration: 0.5, type: "spring" },
    //   });
    //   // Then animate to `1` minute (which is `186` degrees)
    //   hourHand.start({
    //     rotate: -6,
    //     transition: { duration: 0 },
    //   });
    // } else {
    //   // For all other minutes, animate normally
    //   hourHand.start({
    //     // rotate: time[0] * 6,
    //     rotate:
    //       time[0] > 12
    //         ? ((time[0] - 12) / 12) * 360 + (time[1] / 60) * 30
    //         : (time[0] / 12) * 360 + (time[1] / 60) * 30,
    //     transition: { duration: 0.5, type: "spring" },
    //   });
    // }
  };

  useEffect(() => {
    animateHands();
  }, [time]);

  return (
    <motion.div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        flexDirection: "row",
        overflow: "hidden",
        position: "relative",
      }}
      animate={{ background: bgColor }}
    >
      <Controls
        title={"01 Blob clock"}
        showRot={true}
        showControls={true}
        toggleControls={() => {
          setSettings(!settings);
        }}
        alwaysOn={settings}
      />

      <div
        style={{
          display: initialLoad === true ? "flex" : "none",
          height: "100vh",
          aspectRatio: 1 / 1,
          transform: vertical === true ? "rotate(90deg)" : "rotate(0deg)",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            color: numberColor,
            textAlign: "center",
            textTransform: "uppercase",
            position: "absolute",
            display: name === "" ? "none" : "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
            left: 0,
            top: 0,
            paddingTop: "30%",
            fontSize: 12,
            opacity: 0.6,
            userSelect: "none",
            letterSpacing: 1,
          }}
        >
          colored by
          <br />
          {name}
          {/* <br />
          {time[0]}:{time[1]}:{time[2]} */}
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            overflow: "visible",
            filter: 'url("#goo")',
            position: "relative",
          }}
        >
          <motion.div
            //center
            style={{
              width: 40,
              height: 40,
              borderRadius: 30,
              background: numberColor,
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
                    }}
                    initial={{ y: 300, opacity: 0 }}
                    animate={{
                      padding:
                        time[0] === index + 1 ||
                        time[0] - 12 === index + 1 ||
                        index + 1 - 12 === time[0]
                          ? 80
                          : 0,
                      color:
                        time[0] === index + 1 ||
                        time[0] - 12 === index + 1 ||
                        index + 1 - 12 === time[0]
                          ? highlightColor
                          : numberColor,
                      y: 0,
                      opacity: 1,
                    }}
                    transition={{
                      y: {
                        duration: 2,
                        type: "spring",
                        bounce: 0.1,
                        delay: initialLoad === false ? index * 0.15 + 1 : 0,
                      },
                      opacity: {
                        duration: 2,
                        type: "spring",
                        bounce: 0.1,
                        delay: initialLoad === false ? index * 0.15 + 1 : 0,
                      },
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
            <motion.div
              initial={{ height: "0%" }}
              style={{
                // height: "30%",
                width: 30,
              }}
              animate={{ height: "30%", background: hourmark }}
              transition={{
                height: { duration: 1, type: "spring", bounce: 0.1 },
              }}
            ></motion.div>
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
            // animate={{
            //   rotate: time[1] * 6,
            // }}
            animate={minuteHand}
          >
            <motion.div
              initial={{ height: "0%" }}
              style={{
                width: 30,
                // textTransform: "uppercase",
                // writingMode: "vertical-rl",
              }}
              animate={{ height: "50%", background: minutemark }}
              transition={{
                height: { duration: 1, type: "spring", bounce: 0.1 },
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
            // animate={{
            //   rotate: time[2] !== 0 ? time[2] * 6 + 180 : 180 + 360,
            // }}
            transition={{
              type: "spring", // or "tween", "inertia", etc.
              stiffness: 500, // adjust stiffness for desired effect
              damping: 20, // adjust damping for desired effect
            }}
            animate={secondHand}
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
              <motion.div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 100,
                }}
                animate={{ background: secondmark }}
              ></motion.div>
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
                  initial={{ stdDeviation: 10 }}
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
                        ? `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${80} -${16}`
                        : `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${1} -${0}`,
                  }}
                  transition={{ duration: 1 }}
                />

                {/* <feBlend in="SourceGraphic" in2="goo" />*/}
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <motion.div
        style={{
          width: "30vw",
          height: "50vh",
          // background: "rgba(255,255,255,0.1)",
          display: settings === true ? "flex" : "none",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 10,
          padding: 20,
          position: "fixed",
          right: 0,
          top: "25vh",
          zIndex: 1,
        }}
        // initial={{ x: "30vw" }}
        // animate={{ x: settings === true ? 0 : "30vw" }}
        // transition={{ duration: 1, bounce: 0.1, type: "spring" }}
      >
        <ColorPicker
          value={bgColor}
          title="background"
          onChange={setBgColor}
          index={0}
          toggle={settings}
        />
        <ColorPicker
          value={numberColor}
          title="numbers"
          onChange={setNumberColor}
          index={1}
          toggle={settings}
        />
        <ColorPicker
          value={hourmark}
          title="hour hand"
          onChange={setHourmark}
          index={2}
          toggle={settings}
        />
        <ColorPicker
          value={minutemark}
          title="minute hand"
          onChange={setMinutemark}
          index={3}
          toggle={settings}
        />
        <ColorPicker
          value={secondmark}
          title="second hand"
          onChange={setSecondmark}
          index={4}
          toggle={settings}
        />
        <ColorPicker
          value={highlightColor}
          title="current hour"
          onChange={setHighlightColor}
          index={5}
          toggle={settings}
        />
        {/* <input
          placeholder="Claim your color with your name"
          onChange={(e) => {
            setName(e.target.value);
          }}
          style={{
            background: "transparent",
            mixBlendMode: "difference",
            textTransform: "uppercase",
          }}
        /> */}
      </motion.div>
    </motion.div>
  );
}
