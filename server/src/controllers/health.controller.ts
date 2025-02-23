import { Request, Response, NextFunction } from "express";

export const healthCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
  };

  try {
    res.status(200).send(healthCheck);
  } catch (error) {
    healthCheck.message = error as string;
    res.status(503).send(healthCheck);
  }
};
