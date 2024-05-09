import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (session) {
    const { user } = session;
    const { data, error } = await supabase
      .from("users")
      .update({ color_preference: req.body.color })
      .eq("id", user.id);

    if (error) return res.status(401).json({ error: error.message });
    return res.status(200).json(data);
  } else {
    res.status(401).send("Unauthorized");
  }
}
