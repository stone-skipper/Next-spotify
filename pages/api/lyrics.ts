import { MySession } from "../../types/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { customGet } from "../../utils/customGet";

const lyricsGet = async (session: MySession | null, trackID: string) => {
  const url = `https://spotify-lyric-api-984e7b4face0.herokuapp.com/?trackid=${trackID}`;
  //   const url = `https://spclient.wg.spotify.com/color-lyrics/v2/track/${trackID}?format=json&vocalRemoval=false`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
      "app-platform": "WebPlayer",
    },
  }).then((res) => res.json());

  return res;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  const currentPlay = await customGet(
    "https://api.spotify.com/v1/me/player/currently-playing",
    session
  );
  const lyrics = await lyricsGet(session, currentPlay.item.id);
  console.log(lyrics);
  res.status(200).json(lyrics);
  //   if (currentPlay.is_playing === true) {
  //   } else {
  //     console.log("nothing is playing");
  //   }
}
