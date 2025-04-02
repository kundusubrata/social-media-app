import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma";
import { asyncHandler } from "../middlewares/asyncHandler";
import CustomErrorHandler from "../utils/customErrorHandler";
import { updateUserProfileBody } from "../utils/zodValidation";

// Get all user  =====>>>>> /api/v1/users
export const getAllUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        profilePic: true,
        bio: true,
        createdAt: true,
        posts: true,
        followers: true,
        following: true,
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!users) {
      return next(new CustomErrorHandler("Users not found", 404));
    }

    res.status(200).json({
      success: true,
      data: users,
    });
  }
);

// Get user profile by id ====>>>>> /api/v1/users/:id
export const getUserProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

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
        posts: true,
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

    const userData: UserData = {
      ...user,
      followersCount: user._count.followers,
      followingCount: user._count.following,
      postsCount: user._count.posts,
    };

    delete userData._count;

    res.status(200).json({
      success: true,
      data: userData,
    });
  }
);

// Update user profile by id ====>>>>> /api/v1/users/:id
export const updateUserProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const currentUserId = req.userId;

    if (currentUserId !== userId) {
      return next(
        new CustomErrorHandler("Not authorized to update this profile", 403)
      );
    }

    const { success, data } = updateUserProfileBody.safeParse(req.body);

    if (!success) {
      return next(new CustomErrorHandler("Invalid input", 400));
    }

    const { username, email, bio, profilePic } = data;

    // Check if *user*, with this email or username already exists
    if (username || email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [username ? { username } : {}, email ? { email } : {}],
          NOT: {
            id: userId, // Exclude the current user
          },
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
    }
    // Update user
    const updateUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...(username && { username }), // if username is present, update it
        ...(email && { email }),
        ...(bio && { bio }),
        ...(profilePic && { profilePic }),
      },
      select: {
        id: true,
        username: true,
        email: true,
        profilePic: true,
        bio: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      success: true,
      data: updateUser,
    });
  }
);

// Delete user Account by id ====>>>>> /api/v1/users/:id
export const deleteUserAccount = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const currentUserId = req.userId;

    if (currentUserId !== userId) {
      return next(
        new CustomErrorHandler("Not authorized to delete this account", 403)
      );
    }

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  }
);

// Get list of user followers by id ====>>>>> /api/v1/users/:id/followers
export const getUserFollowers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const followers = await prisma.follower.findMany({
      where: {
        followingId: userId,
      },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            email: true,
            profilePic: true,
            bio: true,
            createdAt: true,
          },
        },
      },
      skip: skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get total number of followers
    const totalFollowersCount = await prisma.follower.count({
      where: {
        followingId: userId,
      },
    });

    // Format the response
    const formattedFollowers = followers.map((follower) => follower.follower);

    res.status(200).json({
      success: true,
      count: formattedFollowers.length,
      totalPages: Math.ceil(totalFollowersCount / limit),
      currentPage: page,
      data: formattedFollowers,
    });
  }
);

// Get list of user following by id ====>>>>> /api/v1/users/:id/following
export const getUserFollowing = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const following = await prisma.follower.findMany({
      where: {
        followerId: userId,
      },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            email: true,
            profilePic: true,
            bio: true,
            createdAt: true,
          },
        },
      },
      skip: skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get total number of following
    const totalFollowingCount = await prisma.follower.count({
      where: {
        followerId: userId,
      },
    });

    // Format the response
    const formattedFollowing = following.map((follow) => follow.following);

    res.status(200).json({
      success: true,
      count: formattedFollowing.length,
      totalPages: Math.ceil(totalFollowingCount / limit),
      currentPage: page,
      data: formattedFollowing,
    });
  }
);
