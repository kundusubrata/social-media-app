import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { commentBody } from "../utils/zodValidation";
import CustomErrorHandler from "../utils/customErrorHandler";
import prisma from "../config/prisma";

// Add a comment to a post by id ====>>>>> /api/v1/posts/:id/comments
export const addComment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id;
    const { success, data } = commentBody.safeParse(req.body);
    const currentUserId = String(req.userId);

    if (!success) {
      return next(new CustomErrorHandler("Invalid input", 400));
    }
    const { content } = data;

    if (!content || content.trim() === "") {
      return next(new CustomErrorHandler("Comment content is required", 400));
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
        deletedAt: null,
      },
    });
    if (!post) {
      return next(new CustomErrorHandler("Post not found", 404));
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: currentUserId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profilePic: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: comment,
    });
  }
);

// Get all comments on a post by id ====>>>>> /api/v1/posts/:id/comments
export const getComments = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const comments = await prisma.comment.findMany({
      where: {
        postId,
        // deletedAt: null,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profilePic: true,
          },
        },
      },
    });

    const totalComments = await prisma.comment.count({
      where: {
        postId,
        // deletedAt: null,
      },
    });

    res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      totalComments,
      totalPages: Math.ceil(totalComments / limit),
      currentPage: page,
      data: comments,
    });
  }
);

// Delete a comment (only author can delete) by id ====>>>>> /api/v1/comments/:id
export const deleteComment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.body;
    const userId = req.userId;

    if (!commentId) {
      return next(new CustomErrorHandler("Comment id is required", 400));
    }

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      return next(new CustomErrorHandler("Comment not found", 404));
    }

    if (comment.authorId !== userId) {
      return next(
        new CustomErrorHandler(
          "You are not authorized to delete this comment",
          403
        )
      );
    }

    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  }
);
