import { Request,Response, NextFunction } from "express";

// Register a new user  ====>>>> /api/v1/auth/signup
export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.send("signup");
    } catch (error) {
        next(error);
    }
};