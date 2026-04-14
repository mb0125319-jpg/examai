import { VercelRequest, VercelResponse } from "@vercel/node";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import { appRouter } from "../server/routers";

const app = express();

app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: async () => ({}),
  })
);

export default app;
