import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma";
import { asyncHandler } from "../middlewares/asyncHandler";
import CustomErrorHandler from "../utils/customErrorHandler";
import { generateJwtToken } from "../utils/generateJwtToken";
import { loginBody, registerBody } from "../utils/zodValidation";

// Register a new user  ====>>>> /api/v1/auth/register
export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { success, data } = registerBody.safeParse(req.body);

    if (!success) {
      return next(new CustomErrorHandler("Invalid input", 400));
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: data.email,
          },
          {
            username: data.username,
          },
        ],
      },
    });

    if (existingUser) {
      return next(
        new CustomErrorHandler(
          "User with this email or username already exists",
          409
        )
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
      },
    });

    const token = generateJwtToken(user.id);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        token,
      },
    });
  }
);

// Login a user  ====>>>> /api/v1/auth/login
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { success, data } = loginBody.safeParse(req.body);

    if (!success) {
      return next(new CustomErrorHandler("Invalid input", 400));
    }

    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      return next(new CustomErrorHandler("Invalid Credentials", 401));
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      return next(new CustomErrorHandler("Invalid Credentials", 401));
    }

    const token = generateJwtToken(user.id);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        token,
      },
    });
  }
);

// Logout a user  ====>>>> /api/v1/auth/logout
export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
});

// Get current logged in user  ====>>>> /api/v1/auth/me
export const getMe = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        profilePic: true,
        bio: true,
        createdAt: true,
        posts: {
          where: {
            deletedAt: null,
          },
        },
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      return next(new CustomErrorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  }
);
