import express, { Request, Response } from 'express';
import cors from "cors";
import dotenv from "dotenv";
import { connectDatabase } from './config/database';

import clientRoutes from "./routes/client/index.route";

const app = express();
const port = 4000;

// Load environment variables from .env file
dotenv.config();

// Connect to database
connectDatabase();

// CORS
app.use(cors({
  origin: "*", // can be a particular domain name
  methods: ["GET", "POST", "PATCH", "DELETE"], // allowed methods
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// allow sending data as json
app.use(express.json());

// --- Set up routes
app.use("/", clientRoutes);
// --- End set up routes

app.listen(port, () => {
  console.log(`Website backend is running on port ${port}`);
});