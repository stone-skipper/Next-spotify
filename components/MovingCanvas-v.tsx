// import { motion } from "framer-motion";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import * as fal from "@fal-ai/serverless-client";
import dynamic from "next/dynamic";
import { useSpotify } from "../context/SpotifyContext";
import { getRandomColorBetween, interpolateColor } from "../utils/drawUtils";
import { prominent, average } from "color.js";
import { motion } from "framer-motion";
import { useInterfaceStore } from "../utils/store";

fal.config({
  credentials: process.env.FAL_KEY,
  proxyUrl: "/api/fal/proxy",
});

export default function MovingCanvasV() {
  const vertical = useInterfaceStore((state) => state.vertical);

  const [wSize, setWSize] = useState({ w: 512, h: 512 });
  const [color, setColor] = useState(null);
  const [colors, setColors] = useState([]);
  const { playing, fetchCurrentPlaying } = useSpotify();
  const { lyrics, fetchLyrics } = useSpotify();
  const { trackAnalysis, fetchTrackAnalysis } = useSpotify();
  const [current, setCurrent] = useState("");
  //   const [progress, setProgress] = useState(0);
  const frequencyDataHistoryRef = useRef([]);
  const maxHistoryLength = 70; // Adjust this value based on your needs

  //   const addToHistory = (newData) => {
  //     const history = frequencyDataHistoryRef.current;
  //     const newDataCopy = Array.from(newData); // Create a copy of the current data

  //     history.push(newDataCopy);

  //     if (history.length > maxHistoryLength) {
  //       history.shift(); // Remove the oldest entry if history exceeds max length
  //     }
  //   };

  const addToHistory = (newData) => {
    const history = frequencyDataHistoryRef.current;
    const newDataWithoutFirst = Array.from(newData).slice(1);

    // Prepare the modified data array: original (without 0th) + reversed (exclude last to prevent duplication)
    const modifiedData = [
      ...newDataWithoutFirst.slice(0, -1),
      // Reverse everything but the last item to avoid duplication, since the last of original is now the first of reversed
      ...newDataWithoutFirst.slice(0, -1).slice(1).reverse(),
    ];

    // Push this modified data into the history
    history.push(modifiedData);

    if (history.length > maxHistoryLength) {
      history.shift(); // Remove the oldest entry if history exceeds max length
    }
  };

  useEffect(() => {
    setWSize({ w: window.innerWidth, h: window.innerHeight });
    // fetchCurrentPlaying();

    setInterval(() => {
      fetchCurrentPlaying();
    }, 500);
    console.log("playing:" + playing);
  }, []);

  useEffect(() => {
    if (playing) {
      setCurrent(playing?.item?.name);
      //   progressRef.current = playing?.progress_ms / 1000;
      //   setProgress(playing?.progress_ms / 1000);
    }
  }, [playing]);

  useEffect(() => {
    fetchLyrics();
    fetchTrackAnalysis();
  }, [current]);

  useEffect(() => {
    console.log(trackAnalysis);
  }, [trackAnalysis]);

  const frameInterval = 10;
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const frameCountRef = useRef(0); // Ref to keep track of frame count
  const rotationAngleRef = useRef(0);

  useEffect(() => {
    if (
      colors.length !== 0 &&
      playing.is_playing === true &&
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia
    ) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          if (!audioContextRef.current) {
            audioContextRef.current = new AudioContext();
          }

          const audioContext = audioContextRef.current;
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 64;

          analyserRef.current = analyser;

          const source = audioContext.createMediaStreamSource(stream);
          source.connect(analyser);

          animate();
        })
        .catch((err) => console.error("Microphone access denied:", err));
    }

    return () => {
      //   cancelAnimationFrame(animationFrameRef.current);
      //   if (audioContextRef.current) {
      //     audioContextRef.current.close();
      //   }
    };
  }, [colors]);

  const animate = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;

    const ctx = canvas.getContext("2d");
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);

    // setLog([frequencyData, ...log]);
    // console.log(frequencyData.length);

    const draw = () => {
      analyser.getByteFrequencyData(frequencyData);
      if (playing?.is_playing === true) {
        addToHistory(frequencyData);
      }

      // ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const rotationSpeed = playing?.is_playing === true ? 0.03 : 0; // Adjust this value to control the speed of rotation

      rotationAngleRef.current += rotationSpeed;

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

      // for (let i = 0; i < 8; i++) {
      //   for (let k = 0; k < 8; k++) {
      //     const barHeight = frequencyData[i] * 2;
      //     ctx.fillStyle = "rgba(0,0,0," + frequencyData[8 * i + k] / 255 + ")";
      //     ctx.fillRect(
      //       (i * canvas.width) / 8,
      //       (k * canvas.width) / 8,
      //       canvas.width / 8,
      //       canvas.height / 8
      //     );
      //   }
      // }

      // for (let i = 0; i < frequencyData.length; i++) {
      //   ctx.beginPath();
      //   ctx.lineWidth = (frequencyData[i] / 255) * 15;
      //   ctx.strokeStyle = color;
      //   ctx.arc(canvas.width / 2, canvas.height / 2, i * 8, 0, 2 * Math.PI);
      //   ctx.stroke();
      // }

      for (let i = 0; i < frequencyDataHistoryRef.current.length; i++) {
        for (let k = 0; k < frequencyDataHistoryRef.current[i].length; k++) {
          ctx.strokeStyle = interpolateColor(
            colors[0],
            colors[2],
            frequencyDataHistoryRef.current[i][k] / 255
          );

          ctx.beginPath();

          ctx.lineWidth = (frequencyDataHistoryRef.current[i][k] / 255) * 30;
          ctx.arc(
            canvas.width / 2,
            canvas.height / 2,
            (frequencyDataHistoryRef.current.length - i) * 12,
            ((2 * Math.PI) / frequencyDataHistoryRef.current[i].length) *
              (k + rotationAngleRef.current),
            ((2 * Math.PI) / frequencyDataHistoryRef.current[i].length) *
              (k + 1 + rotationAngleRef.current)
          );
          ctx.stroke();
        }
      }

      frameCountRef.current++;
      if (frameCountRef.current >= frameInterval) {
        // captureCanvas();
        frameCountRef.current = 0; // Reset frame count after capture
      }

      //   let barWidth = canvas.width / trackAnalysis?.segments.length;
      //   for (let i = 0; i < trackAnalysis?.segments.length; i++) {
      //     if (
      //       progressRef.current > trackAnalysis.segments[i].start &&
      //       progressRef.current <
      //         trackAnalysis.segments[i].start + trackAnalysis.segments[i].duration
      //     ) {
      //       ctx.fillStyle = "red";
      //     } else {
      //       ctx.fillStyle = "pink";
      //     }

      //     const pitch =
      //       (Math.max(...trackAnalysis.segments[i].pitches) * canvas.height) / 2;

      //     const barHeight =
      //       (((trackAnalysis.segments[i].pitches.indexOf(
      //         Math.max(...trackAnalysis.segments[i].pitches)
      //       ) +
      //         1) /
      //         12) *
      //         canvas.height) /
      //       2;
      //     ctx.fillRect(
      //       i * barWidth,
      //       canvas.height / 2 - barHeight / 2,
      //       barWidth,
      //       barHeight
      //     );
      //   }
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

  useEffect(() => {
    if (playing && playing?.item?.album.images[0].url) {
      average(playing?.item?.album.images[0].url, {
        amount: 1,
        format: "hex",
      }).then((color) => {
        console.log(color); // [241, 221, 63]
        setColor(color);
      });

      prominent(playing?.item?.album.images[0].url, {
        amount: 3,
        format: "hex",
      }).then((color) => {
        console.log(color);
        // @ts-ignore
        setColors(Array.from(color));
      });
    }
  }, [current]);

  const [start, setStart] = useState(false);

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
      console.log(answer.data.choices[0].message.content);

      setInspo(JSON.parse(answer.data.choices[0].message.content));
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
        content: "You are a helpful assistant writing a text-to-image prompt.",
      },
      {
        role: "user",
        content: `These are the lyrics of a song named ${
          playing?.item?.name
        } from the artist ${
          playing?.item?.artists[0].name
        } in JSON format. ${JSON.stringify(
          newArray
        )} Write a text-to-image prompt inspired by each line of the lyrics, and return them as an array of texts in the property 'prompt' in JSON. The number of prompts and order should match the lyrics.`,
      },
    ]);
    await sendMessage(messages);
  };

  useEffect(() => {
    if (lyrics && lyrics.error === false && lyrics.lines) {
      //   requestInspo();
    }
  }, [lyrics]);

  //   const memoizedP5 = useMemo(() => {
  //     return <P5JsComponent captureInterval={10} getImage={getImage} />;
  //   }, [getImage]);
  const [result, setResult] = useState(null);

  const connection = fal.realtime.connect("fal-ai/lcm-sd15-i2i", {
    throttleInterval: 128,
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
          inspo.length === lyrics.lines.length
            ? // @ts-ignore
              inspo?.prompt[
                getCurrentLyricIndex(lyrics.lines, playing?.progress_ms)
              ] + " in rough oil painting style"
            : lyrics?.lines[
                getCurrentLyricIndex(lyrics.lines, playing?.progress_ms)
              ]?.words + " in rough oil painting style",
        // sync_mode: true,
        image_url: image,
        negative_propmpt:
          "cartoon, illustration, animation. face. male, female",
        strength: 0.6,
      });
    }
  }, [image, start]);

  return (
    <div
      style={{
        background: colors[1],
        position: "fixed",
        right: 0,
        top: 0,
        width: "100vw",
        height: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        zIndex: 0,
      }}
    >
      <div style={{ display: "none" }}>
        Current Lyrics:
        <br />
        {lyrics &&
          playing &&
          playing.is_playing === true &&
          lyrics.error === false &&
          lyrics?.lines[
            getCurrentLyricIndex(lyrics.lines, playing?.progress_ms)
          ]?.words}
        <br />
        Prompt:
        {inspo.length !== 0 &&
          // @ts-ignore
          inspo?.prompt[
            getCurrentLyricIndex(lyrics.lines, playing?.progress_ms)
          ]}
      </div>

      <motion.div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "fixed",
          right: vertical === true ? "5vw" : "auto",
          top: vertical === true ? "5vw" : "auto",
          bottom: vertical === true ? "auto" : "5vw",
          left: vertical === true ? "auto" : "5vw",
          width: "90vw",
          height: "90vw",
          overflow: "hidden",
          borderRadius: 1000,
          background: color,
        }}
        initial={{ y: 200 }}
        animate={{
          y: 0,
          opacity: playing?.is_playing === true ? 1 : 0.1,
          scale: playing?.is_playing === true ? 1 : 0.7,
        }}
        transition={{ y: { duration: 0.6 } }}
      >
        <canvas
          ref={canvasRef}
          width={wSize.w * 0.9}
          height={wSize.w * 0.9}
          style={{ opacity: playing?.is_playing === true ? 1 : 0 }}
        />
      </motion.div>
    </div>
  );
}
