import { Request, Response, NextFunction } from "express";

export const asyncHandler = (
  controllerFunction: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(controllerFunction(req, res, next)).catch(next);
  };
};
