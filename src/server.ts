import express from 'express';
import http from 'http';
import router from "./router/router";
import { runServer } from './lib/db';
import cookieParser from 'cookie-parser';
import cors from "cors";
import { errorHandler } from './handlers/errorHandler';
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";

const app = express();
const server = http.createServer(app);

// Middleware setup

const allowed = [
  "http://localhost:3000",
  "https://www.realblue.lol",
  "https://bluesunflower.vercel.app/",
  "https://sunflower.realblue.lol/",
];

app.use(
  cors({
    origin: function (origin, cb) {
      // allow requests with no origin (like server‑to‑server, Postman, etc.)
      if (!origin) return cb(null, true);
      if (allowed.indexOf(origin) === -1) {
        return cb(new Error(`CORS denied for ${origin}`), false);
      }
      cb(null, true);
    },
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Debug logging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

app.all('/api/auth/*', toNodeHandler(auth));

app.use(router);

app.use((req, res) => {
  res.status(404).json({ error: "Not found", path: req.url });
});

app.use(errorHandler);

// Start server
runServer(server);