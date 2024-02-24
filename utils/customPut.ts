import { MySession } from "../types/types";

export const customPut = async (url: string, session: MySession | null) => {
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  }).then((res) => res.json());

  return res;
};
