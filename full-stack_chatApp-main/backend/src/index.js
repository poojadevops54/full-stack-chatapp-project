import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173", // Local frontend
      "http://localhost",      // Kubernetes frontend
      "http://127.0.0.1",
    ],
    credentials: true,
  })
);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "ChatApp Backend is running successfully!",
    status: "OK",
  });
});

// Start Server
server.listen(PORT, async () => {
  console.log(`Server is running on PORT: ${PORT}`);

  try {
    await connectDB();
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
});