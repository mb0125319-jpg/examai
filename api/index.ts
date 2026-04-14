import { createServer } from "http";
import { appRouter } from "../server/routers";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import { VercelRequest, VercelResponse } from "@vercel/node";

const app = express();

// tRPC middleware
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: async (opts) => {
      // Create context for tRPC
      return {};
    },
  })
);

// Serve static files from dist
app.use(express.static("dist"));

// Fallback to index.html for client-side routing
app.get("*", (req, res) => {
  res.sendFile("dist/index.html");
});

export default app;
