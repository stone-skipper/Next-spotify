import { PlayingType, MySession } from "../types/types";
import { useSpotify } from "../context/SpotifyContext";
import { useEffect, useState } from "react";

interface UseSession {
  data: MySession | null;
}

export default function PlayControl({ rotate = false }) {
  const { playing, play, pause, fetchCurrentPlaying } = useSpotify();
  const [localPlaying, setLocalPlaying] = useState(playing?.is_playing);

  useEffect(() => {
    setLocalPlaying(playing?.is_playing);
  }, [playing]);

  return (
    <div>
      <div
        style={{
          color: "white",
          transform: rotate === true ? "rotate(90deg)" : "",
          cursor: "pointer",
        }}
        onClick={() => {
          if (playing?.is_playing === true) {
            setLocalPlaying(false);
            pause();
          } else {
            setLocalPlaying(true);
            play();
          }
        }}
      >
        {localPlaying === true ? "playing" : "paused"}
      </div>
    </div>
  );
}
