import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { customPut } from "../../utils/customPut";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  const currentPlay = await customPut(
    "https://api.spotify.com/v1/me/player/play",
    session
  );

  res.status(200).json(currentPlay);
}
