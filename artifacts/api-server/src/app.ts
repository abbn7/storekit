import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import path from "path";
import fs from "fs";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.CLERK_SECRET_KEY) {
  app.use(
    clerkMiddleware((req) => ({
      publishableKey: publishableKeyFromHost(
        getClerkProxyHost(req) ?? "",
        process.env.CLERK_PUBLISHABLE_KEY,
      ),
    })),
  );
} else {
  logger.warn("CLERK_SECRET_KEY is not configured; Clerk authentication is disabled for this local run.");
}

app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true, service: "storekit", environment: process.env.NODE_ENV ?? "development" });
});

app.get("/healthz", (_req, res) => {
  res.status(200).type("text/plain").send("ok");
});

app.use("/api", router);

// ── Serve built frontend in production ──────────────────────────────────────
// Set FRONTEND_DIST env var to the path of the built frontend (e.g. ./public)
// This lets the Docker image serve both API + frontend from a single process.
const frontendDist = process.env.FRONTEND_DIST;
if (frontendDist && fs.existsSync(frontendDist)) {
  logger.info({ frontendDist }, "Serving static frontend");
  app.use(
    express.static(frontendDist, {
      setHeaders(res, filePath) {
        if (path.basename(filePath) === "index.html") {
          res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
          res.setHeader("Pragma", "no-cache");
          res.setHeader("Expires", "0");
        } else {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      },
    }),
  );
  // SPA fallback — all non-API routes go to index.html without allowing stale HTML shells.
  app.get("/{*splat}", (_req, res) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.sendFile(path.resolve(frontendDist, "index.html"));
  });
}

export default app;
