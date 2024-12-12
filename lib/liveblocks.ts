import { Liveblocks } from "@liveblocks/node";

export const liveblocks = new Liveblocks({
    secret: process.env.LIVE_BLOCK_SECRET_KEY as string,
  });
  