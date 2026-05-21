import express from "express";
import { logger } from "@repo/logger";
import cors from "cors";

import * as trpcExpress from "@trpc/server/adapters/express";
import { generateOpenApiDocument, createOpenApiExpressMiddleware } from "trpc-to-openapi";
import { apiReference } from "@scalar/express-api-reference";

import { serverRouter, createContext } from "@repo/trpc/server";
import cookieParser from "cookie-parser"
import { env } from "./env";

export const app = express();
const openApiDocument = generateOpenApiDocument(serverRouter, {
  title: "Formit OpenAPI",
  version: "1.0.0",
  baseUrl: env.BASE_URL.concat("/api"),
});

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      return callback(null, true);
    },
    credentials: true,
  }),
);


app.use(cookieParser())

app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ message: "Formit is up and running..." });
});

app.get("/health", (req, res) => {
  return res.json({ healthy: true });
});

logger.debug(`openapi.json: ${env.BASE_URL}/openapi.json`);
app.get("/openapi.json", (req, res) => {
  return res.json(openApiDocument);
});

logger.debug(`docs: ${env.BASE_URL}/docs`);
app.use("/docs", apiReference({ url: "/openapi.json" }));

import rateLimit, { ipKeyGenerator } from "express-rate-limit";

const submitRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { message: "Rate limit exceeded. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.set("trust proxy", 1);


app.use("/trpc/formResponse.submitResponse", submitRateLimiter);
app.use("/api/form-response/submitResponse", submitRateLimiter);

const generalRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  keyGenerator: (req, res) => {
    const token = req.cookies?.["authentication-token"];
    if (token) return token;

    // fallback to IP Address (prevents IPv6 bypass warnings/crashes)
    return ipKeyGenerator(req.ip || "unknown");
  },
  message: { message: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(
  "/api",
  generalRateLimiter,
  createOpenApiExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

app.use(
  "/trpc",
  generalRateLimiter,
  trpcExpress.createExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

export default app;
