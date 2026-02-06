import express from 'express';
import http from 'http';
import router from "./router/router";
import { runServer } from './lib/db';
import cookieParser from 'cookie-parser';
import cors from "cors";
import session from 'express-session';
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
    exposedHeaders: ['Set-Cookie'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.BETTER_AUTH_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 10 * 60 * 1000,
    },
  })
);

// Your existing logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  console.log('🍪 Cookies:', req.cookies);
  console.log('🔑 Session ID:', (req as any).session?.id);
  next();
});

app.use('/api/auth/sign-in/social', (req, res, next) => {
  console.log('🔍 Social Sign-In Request Body:', req.body);
  next();
});

app.use('/api/auth/*', (req, res, next) => {
  const originalSend = res.send;
  res.send = function (data) {
    console.log('📤 Response Headers:', res.getHeaders()['set-cookie']);
    return originalSend.call(this, data);
  };
  next();
});

app.all('/api/auth/*', toNodeHandler(auth));

app.use(router);

app.use((req, res) => {
  res.status(404).json({ error: "Not found", path: req.url });
});

app.use(errorHandler);

runServer(server);