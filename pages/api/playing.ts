import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { customGet } from "../../utils/customGet";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getSession({ req });

    const currentPlay = await customGet(
      "https://api.spotify.com/v1/me/player/currently-playing",
      session
    );

    res.status(200).json(currentPlay);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
