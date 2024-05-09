import { motion } from "framer-motion";

export const ColorPicker = ({ title, value, onChange, index, toggle }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        width: "100%",
        gap: 20,
      }}
    >
      <motion.div
        style={{
          width: "fit-content",
          height: "fit-content",
          top: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
          // textTransform: "uppercase",
          // mixBlendMode: "difference",
        }}
        animate={{ opacity: toggle === true ? 1 : 0 }}
        transition={{
          duration: 1,
          bounce: 0.1,
          type: "spring",
          delay: toggle === false ? 0 : index * 0.1,
        }}
      >
        {title}
      </motion.div>
      <motion.div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 50,
          border: "2px solid rgba(255,255,255,0.4)",
          cursor: "pointer",
          width: 60,
          height: 60,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: toggle === true ? 1 : 0,
          opacity: toggle === true ? 1 : 0,
        }}
        transition={{
          duration: 1,
          bounce: 0.1,
          type: "spring",
          delay: toggle === false ? 0 : index * 0.1,
        }}
      >
        <input
          type="color"
          value={value}
          style={{ cursor: "pointer" }}
          onChange={(e) => {
            onChange(e.target.value);
          }}
        />
      </motion.div>
    </div>
  );
};
