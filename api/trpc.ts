import { VercelRequest, VercelResponse } from "@vercel/node";
import { appRouter } from "../server/routers";
import { createHTTPHandler } from "@trpc/server/adapters/standalone";

const handler = createHTTPHandler({
  router: appRouter,
  createContext: () => ({}),
});

export default async (req: VercelRequest, res: VercelResponse) => {
  return handler(req as any, res as any);
};
