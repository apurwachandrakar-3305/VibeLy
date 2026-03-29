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

// ✅ Inngest route
app.use("/api/inngest", serve({ client: inngest, functions }));

// ❌ REMOVE app.listen
// ✅ EXPORT app
export default app;
