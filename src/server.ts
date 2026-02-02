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

app.set('trust proxy', 1);

const allowed = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://www.realblue.lol",
  "https://bluesunflower.vercel.app",
  "https://sunflower.realblue.lol",
  "https://sunflower-backend-vv4o.onrender.com",
];

app.use(
  cors({
    origin: function (origin, cb) {
      if (!origin) return cb(null, true);
      if (allowed.indexOf(origin) === -1) {
        return cb(new Error(`CORS denied for ${origin}`), false);
      }
      cb(null, true);
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    exposedHeaders: ['Set-Cookie'], // ✅ Add this
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Debug logging - enhanced
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  console.log('🍪 Cookies:', req.cookies);
  console.log('🔑 Headers:', req.headers.cookie);
  next();
});

app.all('/api/auth/*', toNodeHandler(auth));

app.use(router);

app.use((req, res) => {
  res.status(404).json({ error: "Not found", path: req.url });
});

app.use(errorHandler);

runServer(server);