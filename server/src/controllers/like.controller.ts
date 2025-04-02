import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import prisma from "../config/prisma";
import CustomErrorHandler from "../utils/customErrorHandler";

// Toggle Like a post by id ====>>>> /api/v1/posts/:id/like
export const toggleLikePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id;
    const userId = String(req.userId);

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
        deletedAt: null,
      },
    });
    if (!post) {
      return next(new CustomErrorHandler("Post not found", 404));
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          postId,
          userId,
        },
      },
    });

    let message;

    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_postId: {
            postId,
            userId,
          },
        },
      });
      message = "Post unliked successfully";
    } else {
      const existingDislike = await prisma.dislike.findUnique({
        where: {
          userId_postId: {
            postId,
            userId,
          },
        },
      });

      if (existingDislike) {
        await prisma.dislike.delete({
          where: {
            userId_postId: {
              postId,
              userId,
            },
          },
        });
      }
      await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });
      message = "Post liked successfully";
    }

    const likesCount = await prisma.like.count({
      where: {
        postId,
      },
    });

    const dislikesCount = await prisma.dislike.count({
      where: {
        postId,
      },
    });

    res.status(200).json({
      success: true,
      message,
      liked: !existingLike,
      disliked: false, // If we liked, any dislike was removed
      likeCount: likesCount,
      dislikeCount: dislikesCount,
    });
  }
);

// Toggle Dislike a post by id ====>>>> /api/v1/posts/:id/dislike
export const toggleDislikePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id;
    const userId = String(req.userId);

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
        deletedAt: null,
      },
    });
    if (!post) {
      return next(new CustomErrorHandler("Post not found", 404));
    }

    const existingDislike = await prisma.dislike.findUnique({
      where: {
        userId_postId: {
          postId,
          userId,
        },
      },
    });

    let message;

    if (existingDislike) {
      await prisma.dislike.delete({
        where: {
          userId_postId: {
            postId,
            userId,
          },
        },
      });
      message = "Post undisliked successfully";
    } else {
      const existingLike = await prisma.like.findUnique({
        where: {
          userId_postId: {
            postId,
            userId,
          },
        },
      });

      if (existingLike) {
        await prisma.like.delete({
          where: {
            userId_postId: {
              postId,
              userId,
            },
          },
        });
      }
      await prisma.dislike.create({
        data: {
          userId,
          postId,
        },
      });
      message = "Post disliked successfully";
    }

    const likesCount = await prisma.like.count({
      where: {
        postId,
      },
    });

    const dislikesCount = await prisma.dislike.count({
      where: {
        postId,
      },
    });

    res.status(200).json({
      success: true,
      message,
      liked: false, // If we disliked, any like was removed
      disliked: !existingDislike,
      likeCount: likesCount,
      dislikeCount: dislikesCount,
    });
  }
);


// Check if user has liked a post ====>>>> /api/v1/posts/:id/like-status
export const getLikeStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id;
    const userId = String(req.userId);

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          postId,
          userId,
        },
      },
    });

    const existingDislike = await prisma.dislike.findUnique({
      where: {
        userId_postId: {
          postId,
          userId,
        },
      },
    });

    res.status(200).json({
      success: true,
      liked: !!existingLike,
      disliked: !!existingDislike
    });
  }
);