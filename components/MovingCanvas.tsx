// import { motion } from "framer-motion";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import * as fal from "@fal-ai/serverless-client";
import dynamic from "next/dynamic";
import { useSpotify } from "../context/SpotifyContext";
import { getRandomColorBetween } from "../utils/drawUtils";

fal.config({
  credentials: process.env.FAL_KEY,
  proxyUrl: "/api/fal/proxy",
});

export default function MovingCanvas({ playing, lyrics }) {
  const frameInterval = 10;
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const frameCountRef = useRef(0); // Ref to keep track of frame count
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          if (!audioContextRef.current) {
            audioContextRef.current = new AudioContext();
          }

          const audioContext = audioContextRef.current;
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 128;

          analyserRef.current = analyser;

          const source = audioContext.createMediaStreamSource(stream);
          source.connect(analyser);

          animate();
        })
        .catch((err) => console.error("Microphone access denied:", err));
    }

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const animate = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;

    const ctx = canvas.getContext("2d");
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    // console.log(frequencyData.length);

    const draw = () => {
      analyser.getByteFrequencyData(frequencyData);
      //   console.log(frequencyData);
      //   ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgb(100,100,100)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let barWidth = canvas.width / frequencyData.length;
      //   for (let i = 0; i < frequencyData.length; i++) {
      // ctx.fillStyle = getRandomColorBetween("#FF7D54", "#5EABF8");

      //     const barHeight = frequencyData[i] * 2;
      //     ctx.fillRect(
      //       i * barWidth,
      //       canvas.height / 2 - barHeight / 2,
      //       barWidth,
      //       barHeight
      //     );
      //   }

      for (let i = 0; i < 8; i++) {
        for (let k = 0; k < 8; k++) {
          const barHeight = frequencyData[i] * 2;
          ctx.fillStyle = "rgba(0,0,0," + frequencyData[8 * i + k] / 255 + ")";
          ctx.fillRect(
            (i * canvas.width) / 8,
            (k * canvas.width) / 8,
            canvas.width / 8,
            canvas.height / 8
          );
        }
      }

      frameCountRef.current++;
      if (frameCountRef.current >= frameInterval) {
        captureCanvas();
        frameCountRef.current = 0; // Reset frame count after capture
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  const captureCanvas = () => {
    const canvas = canvasRef.current;
    const imageString = canvas.toDataURL("image/png");
    setImage(imageString);
    // console.log(imageString);
  };

  //   const { playing, fetchCurrentPlaying } = useSpotify();
  //   const { lyrics, fetchLyrics } = useSpotify();
  const [current, setCurrent] = useState("");

  const [start, setStart] = useState(false);
  const [input, setInput] = useState(
    "a flying panda drawn in oil painting style"
  );
  const [image, setImage] = useState(null);
  const getImage = useCallback((image) => {
    setImage(image);
  }, []);

  //   const [running, setRunning, features] = useMeydaAnalyser();

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

  const [messages, setMessages] = useState([]);

  const [inspo, setInspo] = useState([]);

  const sendMessage = async (messages) => {
    try {
      console.log(messages);
      const response = await fetch("/api/gpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      });
      const answer = await response.json();

      setInspo(JSON.parse(answer.data.choices[0].message.content));
      console.log(JSON.parse(answer.data.choices[0].message.content));
    } catch (error) {
      console.log(error);
    }
  };

  const requestInspo = async () => {
    const newArray = lyrics.lines.map(
      ({ syllables, endTimeMs, ...keepAttrs }) => keepAttrs
    );

    setMessages([
      {
        role: "system",
        content:
          "You are a helpful assistant writing a text-to-image prompt. Your response should be in JSON format.",
      },
      {
        role: "user",
        content: `These are the lyrics of a song named ${
          playing?.item?.name
        } from the artist ${
          playing?.item?.artists[0].name
        } in JSON format. ${JSON.stringify(
          newArray
        )} Write a text-to-image prompt inspired by each line of the lyrics, and return them in JSON format, containing startTimeMs, words, prompts in each object. .`,
      },
    ]);
    await sendMessage(messages);
  };
  useEffect(() => {
    if (lyrics && lyrics.error === false && lyrics.lines) {
      requestInspo();
    }
  }, [lyrics]);

  //   const memoizedP5 = useMemo(() => {
  //     return <P5JsComponent captureInterval={10} getImage={getImage} />;
  //   }, [getImage]);
  const [result, setResult] = useState(null);

  const connection = fal.realtime.connect("110602490-sdxl-turbo-realtime", {
    // throttleInterval: 128,
    onResult: (result) => {
      setResult(result.images[0].url);
      //   console.log(result.images[0].url);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    if (start === true) {
      connection.send({
        prompt:
          lyrics?.lines[
            getCurrentLyricIndex(lyrics.lines, playing?.progress_ms)
          ]?.words + " in analog film style",
        sync_mode: true,
        image_url: image,
      });
    }
  }, [image, start]);

  return (
    <div
      style={{
        background: "gray",
        position: "fixed",
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        onClick={() => {
          setStart(!start);
        }}
      >
        {start === true ? "stop" : "start"}
      </div>
      {/* <div
        onClick={() => {
          setRunning(!running);
        }}
      >
        {running === true ? "microphone on" : "microphone off"}
      </div> */}
      {/* <P5JsComponent captureInterval={10} getImage={getImage} /> */}
      Current Lyrics:
      <br />
      {lyrics &&
        playing &&
        playing.is_playing === true &&
        lyrics.error === false &&
        lyrics.lines[getCurrentLyricIndex(lyrics.lines, playing?.progress_ms)]
          .words}
      <br />
      Prompt:
      {inspo.length !== 0 &&
        inspo[getCurrentLyricIndex(lyrics.lines, playing?.progress_ms)].prompt}
      <div style={{ display: "flex", flexDirection: "row" }}>
        <canvas ref={canvasRef} width={512} height={512} />

        <img src={result} width={512} height={512} />
      </div>
    </div>
  );
}
