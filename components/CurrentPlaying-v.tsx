import { PlayingType, MySession } from "../types/types";
import { useSpotify } from "../context/SpotifyContext";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import PlayControl from "./PlayControl";
import { useInterfaceStore } from "../utils/store";
import {
  ArrowCounterClockwise,
  Play,
  Pause,
  Playlist,
} from "@phosphor-icons/react/dist/ssr";

interface UseSession {
  data: MySession | null;
}

export default function CurrentlyPlayingV() {
  const vertical = useInterfaceStore((state) => state.vertical);
  const lyricsHeight = 60;
  const { playing, fetchCurrentPlaying, play, pause } = useSpotify();
  const { lyrics, fetchLyrics } = useSpotify();
  const { data: session }: UseSession = useSession();

  const [current, setCurrent] = useState("");
  const [hoverCover, setHoverCover] = useState(false);
  const [toggleLyric, setToggleLyric] = useState(true);

  function getCurrentLyricIndex(lyrics, currentTimestamp) {
    if (!lyrics || lyrics.length === 0) return -1; // No lyrics available

    // Find the index of the lyric segment that is currently being played
    for (let i = 0; i < lyrics.length; i++) {
      if (lyrics[i + 1]) {
        if (
          currentTimestamp >= parseInt(lyrics[i].startTimeMs) &&
          currentTimestamp < parseInt(lyrics[i + 1].startTimeMs)
        ) {
          return i;
        }
      } else {
        // Handle the last lyric line
        if (currentTimestamp >= parseInt(lyrics[i].startTimeMs)) {
          return i;
        }
      }
    }

    return -1; // No matching lyric found for the current timestamp
  }

  useEffect(() => {
    // fetchCurrentPlaying();

    setInterval(() => {
      fetchCurrentPlaying();
    }, 1000);
    console.log(playing);
  }, []);

  useEffect(() => {
    if (playing) {
      setCurrent(playing?.item?.name);
    }
  }, [playing]);

  useEffect(() => {
    fetchLyrics();
  }, [current]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: vertical === true ? "row" : "column-reverse",
        position: "fixed",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        top: 0,
        left: 0,
        zIndex: 1000,
        gap: 0,
      }}
    >
      <motion.div
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,

          zIndex: 10000,
          padding: 10,
          borderRadius: 100,
          background: "rgba(255,255,255,0.1)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
        whileHover={{ background: "rgba(255,255,255,0.2)", scale: 1.05 }}
        onClick={() => {
          useInterfaceStore.setState({ vertical: !vertical });
        }}
      >
        <ArrowCounterClockwise size={20} color={"white"} />
      </motion.div>

      <motion.div
        style={{
          position: "fixed",
          bottom: 20,
          right: 70,
          zIndex: 10000,
          padding: 10,
          borderRadius: 100,
          background: "rgba(255,255,255,0.1)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
        whileHover={{ background: "rgba(255,255,255,0.2)", scale: 1.05 }}
        onClick={() => {
          setToggleLyric(!toggleLyric);
        }}
      >
        <Playlist size={20} color={"white"} />
      </motion.div>

      <div
        style={{
          width: vertical === true ? "50vw" : "100vw",
          height: vertical === true ? "100vh" : "50vh",
          // background: "blue",
          display: "flex",
          flexDirection: "column",
          alignItems: vertical === true ? "center" : "flex-start",
          justifyContent: vertical === true ? "center" : "flex-end",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            marginRight: "calc(50vw - 40px - 80px)",

            width: vertical === true ? "100vh" : "100vw",
            height: "fit-content",
            padding: 20,
            // background: "rgba(255,255,255,0.1)",
            transform: vertical === true ? "rotate(90deg)" : "rotate(0deg)",
            // background: "red",
            userSelect: "none",
          }}
        >
          {playing && (
            <motion.div
              style={{
                width: 80,
                height: 80,

                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                userSelect: "none",
                position: "relative",
                cursor: "pointer",
                borderRadius: 5,
                overflow: "hidden",
              }}
              onMouseOver={() => {
                setHoverCover(true);
              }}
              onMouseLeave={() => {
                setHoverCover(false);
              }}
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                if (playing?.is_playing === true) {
                  pause();
                } else {
                  play();
                }
              }}
            >
              <img
                src={playing?.item?.album.images[0].url}
                width={80}
                height={80}
                style={{ aspectRatio: 1 / 1 }}
              />
              <motion.div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  background: "rgba(0,0,0,0.1)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                animate={{
                  opacity: hoverCover === true ? 1 : 0,
                }}
              >
                {playing?.is_playing === true ? (
                  <Pause color="white" weight="fill" size={30} />
                ) : (
                  <Play color="white" weight="fill" size={30} />
                )}
              </motion.div>
            </motion.div>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              userSelect: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 5,
                opacity: 0.8,
                width: "fit-content",
                height: "fit-content",
                whiteSpace: "nowrap",
                userSelect: "none",
              }}
            >
              {playing?.item?.artists.map((info, index) => {
                return (
                  <div key={index}>
                    {info.name}
                    {index !== playing.item.artists.length - 1 && ","}
                  </div>
                );
              })}
            </div>
            <div
              style={{
                fontSize: 20,
                width: "fit-content",
                height: "fit-content",
                whiteSpace: "nowrap",
              }}
            >
              {playing?.item?.name}
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          width: vertical === true ? "50vw" : "100vw",
          height: vertical === true ? "100vh" : "50vh",
          // background: "green",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 0,
        }}
      >
        <div
          style={{
            height: lyricsHeight * 3,
            width: vertical === true ? "86vh" : "96vw",
            opacity: toggleLyric === true ? 1 : 0,
            // background: "yellow",
            overflow: "hidden",
            WebkitMaskImage:
              "linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
            transform: vertical === true ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          {lyrics && lyrics.error === false && playing && (
            <motion.div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 0,
              }}
            >
              {lyrics?.lines.map((info, index) => {
                return (
                  <motion.div
                    key={index}
                    style={{
                      fontSize: 40,
                      height: lyricsHeight,
                      display: "flex",
                      lineHeight: 1,
                      // justifyContent: "center",
                      alignItems: "center",
                    }}
                    animate={{
                      y:
                        -lyricsHeight *
                          getCurrentLyricIndex(
                            lyrics.lines,
                            playing.progress_ms
                          ) +
                        lyricsHeight,
                      opacity:
                        index ===
                        getCurrentLyricIndex(lyrics.lines, playing.progress_ms)
                          ? 1
                          : 0.4,
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* {parseInt(info.startTimeMs)} -  */}
                    {info.words}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
          {lyrics && lyrics.error !== false && lyrics.message}
        </div>
      </div>
    </div>
  );
}
