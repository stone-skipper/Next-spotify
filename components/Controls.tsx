import { motion } from "framer-motion";
import {
  ArrowCounterClockwise,
  Playlist,
  Clock,
} from "@phosphor-icons/react/dist/ssr";
import { useInterfaceStore } from "../utils/store";

export default function Controls({}) {
  const vertical = useInterfaceStore((state) => state.vertical);

  return (
    <div>
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
          right: 120,
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
          toggleTime(!time);
        }}
      >
        <Clock size={20} color={"white"} />
      </motion.div>
    </div>
  );
}
