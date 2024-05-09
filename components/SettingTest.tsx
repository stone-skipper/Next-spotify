import { useState } from "react";
import { useSession } from "next-auth/react";

export default function SettingTest() {
  const { session } = useSession();
  const [color, setColor] = useState("");

  const updateColorPreference = async () => {
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ color }),
    });
    const data = await res.json();
    // Handle response
  };

  if (!session) return <p>Please sign in</p>;
  return (
    <div>
      <input
        value={color}
        onChange={(e) => setColor(e.target.value)}
        placeholder="Set your color preference"
      />
      <button onClick={updateColorPreference}>Save Color</button>
    </div>
  );
}
