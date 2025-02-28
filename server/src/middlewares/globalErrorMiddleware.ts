// globalErrorMiddleware.ts
import { Request, Response, NextFunction } from "express";
import CustomErrorHandler from "../utils/customErrorHandler";

export const globalErrorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default error values
  let statusCode = 500;
  let message = "Internal Server Error";
  
  // Check if it's our custom error
  if (err instanceof CustomErrorHandler) {
    statusCode = err.statusCode;
    message = err.message;
  } else {
    // Handle unexpected errors
    console.error("Unexpected error:", err);
  }

  // Only include stack trace in development
  const isDevelopment = process.env.NODE_ENV === "development";
  
  res.status(statusCode).json({
    success: false,
    message: message,
    ...(isDevelopment && { stack: err?.stack })
  });
};