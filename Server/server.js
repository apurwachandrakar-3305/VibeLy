import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import { inngest, functions } from "./inngest/index.js";
import { serve } from "inngest/express";
import {clerkMiddleware} from '@clerk/express'
import userRouter from "./routes/userRoutes.js";
const app = express();
const PORT= process.env.PORT||3333
connectDB();

// ✅ Inngest FIRST
app.use("/api/inngest", serve({ client: inngest, functions }))

// ✅ Then JSON
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware())
app.get("/", (req, res) => res.send("server is running"));
app.use('/api/inngest',serve({client:inngest,functions}))
app.use('/api/user',userRouter)
export default async function handler(req, res) {
  try {
    return app(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}
app.listen(PORT,()=>console.log('server is running on port 3333'))
