import { motion } from "framer-motion";
import {
  ArrowCounterClockwise,
  Playlist,
  Clock,
  FadersHorizontal,
} from "@phosphor-icons/react/dist/ssr";
import { useState, useEffect, useCallback } from "react";
import { useInterfaceStore } from "../utils/store";
import Logo from "./Logo";

export default function Controls({
  showRot = true,
  showLyric = false,
  showTime = false,
  showControls = false,
  toggleControls = () => {},
  title = "",
  alwaysOn = false,
}) {
  const vertical = useInterfaceStore((state) => state.vertical);
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const [timer, setTimer] = useState(null);
  const [logoHover, setLogoHover] = useState(false);
  const [optionHover, setOptionHover] = useState(false);

  // Function to handle the mouse move event
  const handleMouseMove = useCallback(() => {
    // Clear any existing timer when mouse moves
    if (timer) {
      clearTimeout(timer);
    }

    // Indicate that the mouse is moving
    setIsMouseMoving(true);

    // Set a new timer to detect mouse stop after 1 second of inactivity
    const newTimer = setTimeout(() => {
      setIsMouseMoving(false);
    }, 2000); // Adjust the delay according to your needs

    setTimer(newTimer);
  }, [timer]);

  useEffect(() => {
    // Attach the mouse move event listener
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      // Cleanup the event listener and timer on unmount
      window.removeEventListener("mousemove", handleMouseMove);
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [handleMouseMove, timer]);
  return (
    <motion.div
      style={{
        position: "fixed",
        width: "100vw",
        bottom: 0,
        padding: 25,
        display: "flex",
        height: "100vh",
        // height: vertical === true ? "100%" : "fit-content",
        alignItems: vertical === true ? "center" : "flex-end",
        justifyContent: "space-between",
        // pointerEvents: "none",
      }}
      animate={{
        opacity:
          (isMouseMoving === true && alwaysOn === false) ||
          alwaysOn === true ||
          logoHover === true
            ? 1
            : 0,
      }}
    >
      <motion.div
        // explanation
        style={{
          position: "fixed",
          width: "20vw",
          height: "100vh",
          top: 0,
          left: 0,
          background: "rgba(255,255,255,0.2)",
          padding: 25,
          color: "white",
          display: "none",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          flexDirection: "column",
          pointerEvents: "auto",
          zIndex: 5,
        }}
        onMouseOver={() => {
          setLogoHover(true);
        }}
        onMouseLeave={() => {
          setLogoHover(false);
        }}
        animate={{ x: logoHover === true ? 0 : "-20vw" }}
        transition={{ duration: 1, bounce: 0.1, type: "spring" }}
      >
        {optionHover === false ? (
          <span>
            {" "}
            Interfaces about time,
            <br /> like an object in your space
            <br /> <br /> <br />
          </span>
        ) : (
          <span>
            03 something <br />
            02 something
            <br />
            <br /> <br /> <br />
          </span>
        )}
      </motion.div>
      <div
        style={{
          // background: "blue",
          height: 30,
          width: 30,
          display: "flex",
          justifyContent: vertical === true ? "center" : "flex-start",
          alignItems: "center",
          transform: vertical === true ? "rotate(90deg)" : "rotate(0deg)",
        }}
      >
        <motion.div
          style={{ width: "fit-content", height: "fit-content", zIndex: 10 }}
          onMouseOver={() => {
            setLogoHover(true);
          }}
          onMouseLeave={() => {
            setLogoHover(false);
          }}
        >
          <Logo
            title={title}
            logoHover={logoHover}
            setLogoHover={setLogoHover}
            optionHover={optionHover}
            setOptionHover={setOptionHover}
          />
        </motion.div>
      </div>
      <div
        style={{
          display: "flex",

          justifyContent: vertical === true ? "center" : "flex-end",
          alignItems: vertical === true ? "flex-start" : "flex-end",
          gap: 10,
          width: "fit-content",
          height: "fit-content",

          flexDirection: vertical === true ? "column" : "row",
          // pointerEvents: "none",
        }}
      >
        {showRot === true && (
          <motion.div
            style={{
              padding: 10,
              borderRadius: 100,
              background: "rgba(255,255,255,0.1)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              rotate: vertical === true ? 90 : 0,
              pointerEvents: "auto",
              zIndex: 10,
            }}
            whileHover={{ background: "rgba(255,255,255,0.2)", scale: 1.05 }}
            onClick={() => {
              useInterfaceStore.setState({ vertical: !vertical });
            }}
          >
            <ArrowCounterClockwise size={20} color={"white"} />
          </motion.div>
        )}

        {showLyric === true && (
          <motion.div
            style={{
              padding: 10,
              borderRadius: 100,
              background: "rgba(255,255,255,0.1)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              rotate: vertical === true ? 90 : 0,
              pointerEvents: "auto",
              zIndex: 10,
            }}
            whileHover={{ background: "rgba(255,255,255,0.2)", scale: 1.05 }}
            // onClick={() => {
            //   setToggleLyric(!toggleLyric);
            // }}
          >
            <Playlist size={20} color={"white"} />
          </motion.div>
        )}

        {showTime === true && (
          <motion.div
            style={{
              padding: 10,
              borderRadius: 100,
              background: "rgba(255,255,255,0.1)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              rotate: vertical === true ? 90 : 0,
              pointerEvents: "auto",
              zIndex: 10,
            }}
            whileHover={{ background: "rgba(255,255,255,0.2)", scale: 1.05 }}
            // onClick={() => {
            //   toggleTime(!time);
            // }}
          >
            <Clock size={20} color={"white"} />
          </motion.div>
        )}
        {showControls === true && (
          <motion.div
            style={{
              padding: 10,
              borderRadius: 100,
              background: "rgba(255,255,255,0.1)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              rotate: vertical === true ? 90 : 0,
              pointerEvents: "auto",
              zIndex: 10,
            }}
            whileHover={{ background: "rgba(255,255,255,0.2)", scale: 1.05 }}
            onClick={toggleControls}
          >
            <FadersHorizontal size={20} color={"white"} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
