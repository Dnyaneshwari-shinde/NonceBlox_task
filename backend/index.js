import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import userRoute from "./app/routers/userRoute.js"; 
import postRoute from "./app/routers/postRouter.js";

const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


app.use(cors({
  origin: '*',
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization'
}));

// MongoDB Connection
const MONGO_URI = "mongodb://0.0.0.0:27017/nonceblox_db";
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Connection error:", err));

// Routes
app.use("/api", userRoute);
app.use("/api", postRoute);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

const PORT = 3000;
app.listen(PORT, async () => {
  console.log(`Backend is running on port ${PORT}`);
});

export default app;