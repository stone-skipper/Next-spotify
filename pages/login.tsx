import { signIn } from "next-auth/react";
import Image from "next/image";
import Layout from "../components/Layout";
import { motion } from "framer-motion";
export default function Login() {
  const handleLogin = () => {
    signIn("spotify", { callbackUrl: "http://localhost:3000" });
  };

  return (
    <Layout title="Log in to Music Dreamer">
      <div className="flex flex-col items-center justify-center w-screen h-screen gap-20">
        <motion.h1>Music Painter</motion.h1>
        <motion.button
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            padding: "10px 40px",
            width: "fit-content",
            height: "fit-content",
          }}
          className="bg-primary focus:outline-none rounded-full"
          whileHover={{ background: "rgb(0, 145, 44)" }}
          animate={{ background: "rgb(29, 185, 84)" }}
          transition={{ duration: 0.4 }}
          onClick={handleLogin}
        >
          Sign in with
          <Image
            src="/images/spotify_logo.png"
            alt="spotify logo"
            width={100}
            height={50}
            objectFit="contain"
          />
        </motion.button>
      </div>
    </Layout>
  );
}
