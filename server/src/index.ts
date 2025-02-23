import express, { Request, Response } from "express";
import "dotenv/config";
import healthRoutes from "./routes/health.routes";
import authRoutes from "./routes/auth.routes";

const app = express();
const port = process.env.PORT || 7000;

app.use(express.json());

// Health Check Endpoints
app.use("/health",healthRoutes);

// Routes
app.use("/api/v1", authRoutes);

// Static Files

// Global Error Handler Middleware

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
