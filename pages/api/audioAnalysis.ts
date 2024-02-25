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
    console.log(currentPlay.item);
    const audioAnalysis = await customGet(
      "https://api.spotify.com/v1/audio-analysis/" + currentPlay.item?.id,
      session
    );
    // const lyrics = await lyricsGet(session, currentPlay.item.id);

    res.status(200).json(audioAnalysis);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
