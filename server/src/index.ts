import "dotenv/config";
import express from "express";
import { globalErrorMiddleware } from "./middlewares/globalErrorMiddleware";
import authRoutes from "./routes/auth.routes";
import healthRoutes from "./routes/health.routes";
import userRoutes from "./routes/user.routes";
import followRoutes from "./routes/follow.routes";
import postRoutes from "./routes/post.routes";
import commentRoutes from "./routes/comment.routes";
import likeRoutes from "./routes/like.routes";


const app = express();
const port = process.env.PORT || 7000;

app.use(express.json());

// Health Check Endpoints
app.use("/health", healthRoutes);

// Routes
app.use("/api/v1", authRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", followRoutes);
app.use("/api/v1", postRoutes);
app.use("/api/v1", commentRoutes);
app.use("/api/v1", likeRoutes);

// Static Files

// Global Error Handler Middleware
app.use(globalErrorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
