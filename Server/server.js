import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import { inngest, functions } from "./inngest/index.js";
import { serve } from "inngest/express";

const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("server is running"));

// ✅ IMPORTANT
app.use("/api/inngest", serve({ client: inngest, functions }));

// ✅ THIS IS THE REAL FIX
export default async function handler(req, res) {
  return app(req, res);
}
