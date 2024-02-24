// import { motion } from "framer-motion";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import * as fal from "@fal-ai/serverless-client";
import dynamic from "next/dynamic";
import { useSpotify } from "../context/SpotifyContext";
import { getRandomColorBetween, interpolateColor } from "../utils/drawUtils";
import { prominent, average } from "color.js";
import { motion } from "framer-motion";

fal.config({
  credentials: process.env.FAL_KEY,
  proxyUrl: "/api/fal/proxy",
});

export default function MovingCanvasAI() {
  const [wSize, setWSize] = useState({ w: 512, h: 512 });
  const [color, setColor] = useState(null);
  const [colors, setColors] = useState([]);
  const { playing, fetchCurrentPlaying } = useSpotify();
  const { lyrics, fetchLyrics } = useSpotify();
  const [current, setCurrent] = useState("");
  const frequencyDataHistoryRef = useRef([]);
  const maxHistoryLength = 70; // Adjust this value based on your needs

  const addToHistory = (newData) => {
    const history = frequencyDataHistoryRef.current;
    const newDataCopy = Array.from(newData); // Create a copy of the current data

    history.push(newDataCopy);

    if (history.length > maxHistoryLength) {
      history.shift(); // Remove the oldest entry if history exceeds max length
    }
  };

  useEffect(() => {
    setWSize({ w: window.innerWidth, h: window.innerHeight });
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
          analyser.fftSize = 128;

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

  useEffect(() => {
    console.log(frequencyDataHistoryRef.current);
  }, [frequencyDataHistoryRef.current]);

  const animate = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;

    const ctx = canvas.getContext("2d");
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    // setLog([frequencyData, ...log]);
    // console.log(frequencyData.length);

    const draw = () => {
      analyser.getByteFrequencyData(frequencyData);
      addToHistory(frequencyData);

      // ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const rotationSpeed = 0.02; // Adjust this value to control the speed of rotation
      rotationAngleRef.current += rotationSpeed;

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

  useEffect(() => {
    if (playing) {
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
      requestInspo();
    }
  }, [lyrics]);

  //   const memoizedP5 = useMemo(() => {
  //     return <P5JsComponent captureInterval={10} getImage={getImage} />;
  //   }, [getImage]);
  const [result, setResult] = useState(null);

  const connection = fal.realtime.connect("fal-ai/lcm-sd15-i2i", {
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
          inspo.length === lyrics.lines.length
            ? // @ts-ignore
              inspo?.prompt[
                getCurrentLyricIndex(lyrics.lines, playing?.progress_ms)
              ] + ""
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
        background: color,
        position: "fixed",
        right: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        zIndex: 0,
      }}
    >
      <motion.div
        onClick={() => {
          setStart(!start);
        }}
        style={{
          position: "fixed",
          right: 140,
          bottom: 0,
          zIndex: 100,

          cursor: "pointer",
          textAlign: "right",
          margin: 48,
          color: "white",
        }}
        whileHover={{ scale: 1.05 }}
      >
        {inspo.length !== 0 ? "prompt ready" : ""}
      </motion.div>
      <motion.div
        onClick={() => {
          setStart(!start);
        }}
        style={{
          position: "fixed",
          right: 0,
          bottom: 0,
          zIndex: 100,
          padding: "20px 30px",
          borderRadius: 200,
          background: "white",
          cursor: "pointer",
          margin: 28,
          color: color,
        }}
        whileHover={{ scale: 1.05 }}
      >
        Visualizer {start === true ? "on" : "off"}
      </motion.div>
      {/* {colors.map((info, index) => {
          return (
            <div
              style={{ background: info, width: 30, height: 30 }}
              key={"color" + index}
            ></div>
          );
        })} */}
      Current Lyrics:
      <br />
      {lyrics &&
        playing &&
        playing.is_playing === true &&
        lyrics.error === false &&
        lyrics?.lines[getCurrentLyricIndex(lyrics.lines, playing?.progress_ms)]
          ?.words}
      <br />
      Prompt:
      {inspo.length !== 0 &&
        // @ts-ignore
        inspo?.prompt[getCurrentLyricIndex(lyrics.lines, playing?.progress_ms)]}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
        }}
      >
        <canvas ref={canvasRef} width={wSize.w} height={wSize.h} />

        {start === true && (
          <img
            src={result}
            width={wSize.w}
            height={wSize.h}
            style={{
              opacity: 0.8,
              position: "absolute",
              left: 0,
              top: 0,
              zIndex: 2,
            }}
          />
        )}
      </div>
    </div>
  );
}
