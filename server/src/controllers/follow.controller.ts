import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma";
import { asyncHandler } from "../middlewares/asyncHandler";
import CustomErrorHandler from "../utils/customErrorHandler";

// Follow a user by id ====>>>>> /api/v1/users/:id/follow
export const followUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userToFollowId = req.params.id;
    const currentUserId = String(req.userId);

    if (currentUserId === userToFollowId) {
      return next(new CustomErrorHandler("You cannot follow yourself", 400));
    }

    const existingFollow = await prisma.follower.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: userToFollowId,
        },
      },
    });

    if (existingFollow) {
      return next(
        new CustomErrorHandler("You are already following this user", 400)
      );
    }

    // Create a new follower record
    await prisma.follower.create({
      data: {
        followerId: currentUserId,
        followingId: userToFollowId,
      },
    });

    res.status(200).json({
      success: true,
      message: "User followed successfully",
    });
  }
);

// Unfollow a user by id ====>>>>> /api/v1/users/:id/unfollow
export const unfollowUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userToUnfollowId = req.params.id;
    const currentUserId = String(req.userId);

    if (currentUserId === userToUnfollowId) {
      return next(new CustomErrorHandler("You cannot unfollow yourself", 400));
    }

    const existingFollow = await prisma.follower.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: userToUnfollowId,
        },
      },
    });

    if (!existingFollow) {
      return next(
        new CustomErrorHandler("You are not following this user", 400)
      );
    }

    // Delete the follower record
    await prisma.follower.delete({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: userToUnfollowId,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "User unfollowed successfully",
    });
  }
);
