import Link from "next/link";

export default function SignUp({ title, color = "white" }) {
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
      }}
    >
      <Link href="/">Sign up to </Link>
      <div>{title}</div>
    </div>
  );
}
