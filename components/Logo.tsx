import Link from "next/link";
import { motion } from "framer-motion";
export default function Logo({
  title,
  color = "white",
  logoHover,
  setLogoHover,
  optionHover,
  setOptionHover,
}) {
  return (
    <div
      style={{
        color: color,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "fit-content",
        height: "fit-content",
        flexDirection: "row",
        gap: 20,
        fontSize: 14,
        letterSpacing: 1,
      }}
    >
      <Link href="/">
        <motion.div
          style={{
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            cursor: "pointer",
          }}
          whileHover={{ textDecoration: "underline" }}
          onMouseOver={() => {
            setLogoHover(true);
          }}
          onMouseLeave={() => {
            setLogoHover(false);
          }}
        >
          timeface
        </motion.div>
      </Link>
      <div
        style={{ opacity: 0.6, whiteSpace: "nowrap", cursor: "pointer" }}
        onMouseOver={() => {
          setOptionHover(true);
        }}
        onMouseLeave={() => {
          setOptionHover(false);
        }}
      >
        {title}
      </div>
    </div>
  );
}
