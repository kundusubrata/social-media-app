import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "./asyncHandler";
import CustomErrorHandler from "../utils/customErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const isAuthenticated = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(
        new CustomErrorHandler("No Token Provided,Authorization denied", 401)
      );
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as JwtPayload;

    if (!decoded || !decoded.id) {
      return next(new CustomErrorHandler("Invalid Token", 401));
    }

    req.userId = decoded.id;
    next();
  }
);
