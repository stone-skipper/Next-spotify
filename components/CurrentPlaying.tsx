import { PlayingType, MySession } from "../types/types";
import { useSpotify } from "../context/SpotifyContext";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";

// interface IProps {
//   playing: PlayingType;
// }
interface UseSession {
  data: MySession | null;
}

export default function CurrentlyPlaying() {
  const { playing, fetchCurrentPlaying } = useSpotify();
  const { lyrics, fetchLyrics } = useSpotify();
  const { data: session }: UseSession = useSession();

  const [current, setCurrent] = useState("");

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
        flexDirection: "column",
        position: "fixed",
        width: "100vw",
        height: "100vh",
        top: 0,
        left: 0,
        zIndex: 10,
        pointerEvents: "none",
        padding: 20,
      }}
    >
      <div
        style={{
          display: "flex",
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

      {playing?.is_playing === true ? "playing" : "paused"}
      <br />
      {playing?.progress_ms}
      <br />
      {/* {playing?.item.id} */}

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 20,
        }}
      >
        {playing && (
          <motion.div
            style={{
              width: 100,
              height: 100,
              background: "black",
              borderRadius: 1000,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            animate={{ rotate: playing?.is_playing === true ? 360 : 0 }}
            transition={{
              repeat: Infinity,
              duration: playing?.is_playing === true ? 10 : 0,
              ease: "linear",
            }}
          >
            <img
              src={playing?.item?.album.images[0].url}
              width={50}
              height={50}
              style={{ borderRadius: 1000 }}
            />
          </motion.div>
        )}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>
            {playing?.item?.artists.map((info, index) => {
              return <div key={index}>{info.name}</div>;
            })}
          </span>
          <span style={{ fontSize: 40 }}>{playing?.item?.name}</span>
        </div>
      </div>

      <div>
        {lyrics &&
          lyrics.error === false &&
          playing &&
          lyrics?.lines.map((info, index) => {
            return (
              <motion.div
                key={index}
                style={{
                  opacity:
                    index ===
                    getCurrentLyricIndex(lyrics.lines, playing.progress_ms)
                      ? 1
                      : 0.4,
                }}
              >
                {/* {parseInt(info.startTimeMs)} -  */}
                {info.words}
              </motion.div>
            );
          })}
        {lyrics && lyrics.error !== false && lyrics.message}
      </div>
      {/* {playing?.item.artists.map((info, index) => {
        return <div key={`artist${index}`}>{info}</div>;
      })} */}
    </div>
  );
}
