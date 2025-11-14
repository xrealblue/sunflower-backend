import express from 'express';
import http from 'http';
import router from "./router/router";
import { runServer } from './lib/db';
import cookieParser from 'cookie-parser';
import useCors from "cors";
import { cors } from './lib/utils';
import { errorHandler } from './handlers/errorHandler';

const app = express();
const server = http.createServer(app);

// Middleware setup
app.use(useCors(cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use(router);

// Error handling middleware (should be last)
app.use(errorHandler);

// Start server with database connection
runServer(server);