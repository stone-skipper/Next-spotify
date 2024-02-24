import { PlayingType, MySession } from "../types/types";
import { useSpotify } from "../context/SpotifyContext";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import PlayControl from "./PlayControl";

interface UseSession {
  data: MySession | null;
}

export default function CurrentlyPlayingV() {
  const lyricsHeight = 60;
  const { playing, fetchCurrentPlaying } = useSpotify();
  const { lyrics, fetchLyrics } = useSpotify();
  const { data: session }: UseSession = useSession();

  const [current, setCurrent] = useState("");
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
        flexDirection: "row",
        position: "fixed",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        top: 0,
        left: 0,
        zIndex: 1000,
        // padding: 20,
        // background: "blue",
      }}
    >
      <div
        style={{
          display: "none",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 10,
        }}
      >
        {session?.user?.picture === undefined ? (
          <div className="bg-[#333333] p-1 rounded-full text-2xl w-8 h-8"></div>
        ) : (
          <img
            src={session?.user?.picture}
            className="object-contain w-8 h-8 rounded-full"
            alt={session?.user?.name}
          />
        )}
        <span className="text-sm font-bold tracking-wide">
          {session?.user?.name}
        </span>
      </div>

      {/* {playing?.is_playing === true ? "playing" : "paused"}
      <br />
      {playing?.progress_ms}
      <br />
      {playing?.item.id} */}

      <div
        style={{
          width: "50vw",
          height: "100vh",
          //   background: "blue",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            marginRight: "calc(50vw - 40px - 80px)",
            //   position: "fixed",
            width: "100vh",
            height: "fit-content",
            padding: 20,
            // background: "rgba(255,255,255,0.1)",
            transform: "rotate(90deg)",
            // background: "red",
          }}
        >
          {playing && (
            <motion.div
              style={{
                width: 80,
                height: 80,

                borderRadius: 4,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              // animate={{ rotate: playing?.is_playing === true ? 360 : 0 }}
              // transition={{
              //   repeat: Infinity,
              //   duration: playing?.is_playing === true ? 10 : 0,
              //   ease: "linear",
              // }}
            >
              <img
                src={playing?.item?.album.images[0].url}
                width={80}
                height={80}
                style={{ borderRadius: 5 }}
              />
            </motion.div>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 5,
                opacity: 0.8,
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
            <span style={{ fontSize: 20 }}>{playing?.item?.name}</span>
          </div>
        </div>
      </div>
      <div
        style={{
          width: "50vw",
          height: "100vh",
          //   background: "green",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: 0,
        }}
      >
        <div
          style={{
            height: lyricsHeight * 3,
            width: "100vh",
            opacity: toggleLyric === true ? 1 : 0,
            overflow: "hidden",
            WebkitMaskImage:
              "linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
            transform: "rotate(90deg)",
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
        <motion.div
          style={{
            background: "white",
            width: 20,
            height: 20,
            borderRadius: 100,
            marginRight: 20,
          }}
          animate={{ opacity: toggleLyric === true ? 0.2 : 1 }}
          whileHover={{ opacity: 0.4, scale: 1.1 }}
          onClick={() => {
            setToggleLyric(!toggleLyric);
          }}
        ></motion.div>
        <PlayControl rotate={true} />
      </div>

      {/* {playing?.item.artists.map((info, index) => {
        return <div key={`artist${index}`}>{info}</div>;
      })} */}
    </div>
  );
}
