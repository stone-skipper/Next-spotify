import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Flower({ flowerColor = "pink" }) {
  const stroke = 6;
  const [flowerState, setFlowerState] = useState("initial");
  const [timer, setTimer] = useState(1);
  const [timerStart, setTimerStart] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [totalDuration, setTotalDuration] = useState(timer * 60);

  useEffect(() => {
    setTotalDuration(timer * 60);
  }, [timer]);

  useEffect(() => {
    let timer;
    if (timerStart) {
      timer = setInterval(() => {
        setSecondsElapsed((prevSeconds) => prevSeconds + 1);
      }, 1000); // Update every second
    }

    // Cleanup function to stop the timer when the component unmounts or when timerRunning becomes false
    return () => clearInterval(timer);
  }, [timerStart]); // Re-run effect when timerRunning changes

  // Calculate minutes and seconds remaining
  const minutesRemaining = Math.floor((totalDuration - secondsElapsed) / 60);
  const secondsRemaining = (totalDuration - secondsElapsed) % 60;

  // Calculate progress percentage
  const progress = (secondsElapsed / totalDuration) * 100;

  const handleStartTimer = () => {
    setTimerStart(true);
  };
  useEffect(() => {
    if (progress > 0 && progress <= 20) {
      setFlowerState("small");
    } else if (progress > 20 && progress <= 40) {
      setFlowerState("medium");
    } else if (progress > 40) {
      setFlowerState("large");
    }
  }, [progress]);

  const windVariant = {
    left: { rotate: -20 },
    right: { rotate: 20 },
  };
  const flowerVariant = {
    initial: {
      scale: 0,
      d: "M425.501 204.5C428.301 232.1 449.334 242 459.501 243.5C477.001 243.5 491 210.5 480 199C469 187.5 466 204.5 459.501 204.5C453.002 204.5 452.501 179 442.001 179C431.501 179 422.001 170 425.501 204.5Z",
    },
    small: {
      scale: 1,
      d: "M425.501 204.5C428.301 232.1 449.334 242 459.501 243.5C477.001 243.5 491 210.5 480 199C469 187.5 466 204.5 459.501 204.5C453.002 204.5 452.501 179 442.001 179C431.501 179 422.001 170 425.501 204.5Z",
    },
    medium: {
      scale: 1,
      d: "M398 211C400.8 238.6 449.329 242 459.496 243.5C476.996 243.5 525 224.499 514.5 152.5C512.204 136.752 481.005 105 470 140C463.103 161.936 415.998 114 389.502 140C361.708 167.274 394.5 176.5 398 211Z",
    },
    large: {
      scale: 1,
      d: "M331.502 288C331.506 349 411 256.5 427.5 329.5C444 402.5 469.769 232.309 541.996 223.501C603.496 216 606.995 49.9995 535 89.5C514.84 100.561 397.569 60.7587 363.5 75.5C259.499 120.5 331.498 227.665 331.502 288Z",
    },
  };
  return (
    <div
      style={{
        width: "fit-content",
        height: "fit-content",
        position: "absolute",
        color: "black",
      }}
      onClick={() => {
        handleStartTimer();
      }}
    >
      {progress}
      {flowerState}
      <motion.svg
        width="253"
        // height="1288"
        viewBox="0 0 653 1288"
        fill="none"
        variants={windVariant}
        style={{ originY: 1 }}
        initial={"left"}
        animate={"right"}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 0.2,
          duration: 3,
          type: "spring",
          bounce: 0.2,
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M460.095 244.278C457.894 256.379 448.508 267.822 443.275 278.706C429.836 306.659 416.997 335.256 404.38 363.591C377.532 423.89 366.409 493.646 361.806 559.117C355.778 644.852 360.793 730.778 371.267 815.613C383.332 913.342 412.585 1009.79 436.442 1105.22C444.454 1137.27 450.634 1166.65 450.634 1199.83C450.634 1214.19 447.28 1230.28 455.364 1242.41"
          stroke="#1BB157"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <path
          d="M374.689 919.777C357.702 901.092 352.638 871.446 339.465 850.001C315.94 811.705 279.831 769.123 237.961 750.514C214.125 739.921 192.171 727.555 165.497 726.315C141.511 725.199 118.545 722.628 95.0493 717.71C75.0517 713.525 55.1531 708.313 34.8193 706.686C26.4304 706.015 14.9238 700.369 26.3494 711.795C56.586 742.032 101.863 756.564 137.13 780.495C159.896 795.943 166.487 825.124 188.89 839.381C201.913 847.668 214.148 855.618 228.147 862.236C245.474 870.427 264.359 871.56 282.73 876.218C316.366 884.745 364.403 884.685 381.949 919.777"
          stroke="#1BB157"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <path
          d="M365.01 675.361C365.01 619.613 388.234 567.137 408.569 516.182C422.099 482.278 433.089 444.878 458.313 417.636C473.331 401.417 493.802 388.617 511.417 375.287C533.625 358.481 545.567 333.091 555.649 307.528C561.947 291.557 571.709 277.025 577.428 261.011C578.662 257.556 579.736 254.19 580.52 250.659C582.152 243.318 575.214 262.813 574.47 265.044C566.179 289.918 558.186 314.549 552.556 340.197C547.736 362.157 548.241 385.091 541.667 406.746C527.286 454.116 512.441 501.787 478.613 539.844C452.386 569.349 421.184 592.862 397.007 624.542C379.301 647.743 367.43 668.089 367.43 697.141"
          stroke="#1BB157"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <path
          d="M432.768 1067.39C432.768 1018.65 429.29 967.184 442.985 919.777C454.866 878.653 469.067 841.278 469.067 797.569C469.067 780.05 466.647 762.751 466.647 745.54C466.647 743.709 467.254 756.274 467.992 759.119C472.048 774.765 477.045 789.734 478.747 805.905C481.912 835.969 483.587 864.686 483.587 895.04C483.587 930.534 467.853 964.206 448.363 993.72C439.665 1006.89 425.24 1022.35 423.222 1038.49C421.831 1049.62 421.739 1061.76 418.248 1072.23"
          stroke="#1BB157"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <motion.path
          variants={flowerVariant}
          fill={flowerColor}
          initial="initial"
          animate={flowerState}
          transition={{ duration: 20 }}
        ></motion.path>
        {/* <path
          d="M425.501 204.5C428.301 232.1 449.334 242 459.501 243.5C477.001 243.5 491 210.5 480 199C469 187.5 466 204.5 459.501 204.5C453.002 204.5 452.501 179 442.001 179C431.501 179 422.001 170 425.501 204.5Z"
          fill={flowerColor}
        />
        <path
          d="M398 211C400.8 238.6 449.329 242 459.496 243.5C476.996 243.5 525 224.499 514.5 152.5C512.204 136.752 481.005 105 470 140C463.103 161.936 415.998 114 389.502 140C361.708 167.274 394.5 176.5 398 211Z"
          fill={flowerColor}
        />
        <path
          d="M331.502 288C331.506 349 411 256.5 427.5 329.5C444 402.5 469.769 232.309 541.996 223.501C603.496 216 606.995 49.9995 535 89.5C514.84 100.561 397.569 60.7587 363.5 75.5C259.499 120.5 331.498 227.665 331.502 288Z"
          fill={flowerColor}
        /> */}
      </motion.svg>
    </div>
  );
}
