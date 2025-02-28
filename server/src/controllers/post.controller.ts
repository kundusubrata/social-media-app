import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { createPostBody } from "../utils/zodValidation";
import CustomErrorHandler from "../utils/customErrorHandler";
import prisma from "../config/prisma";
import { cloudinary } from "../utils/cloudinaryConfig";
import fs from "fs";
import { count } from "console";

// Create a new posts ====>>>> /api/v1/posts
export const createPost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { success, data } = createPostBody.safeParse(req.body);
    const userId = req.userId;

    console.log(data);

    if (!userId) {
      return next(new CustomErrorHandler("Unauthorized", 401));
    }

    if (!success) {
      return next(new CustomErrorHandler("Invalid input", 400));
    }

    const { content } = data;

    if (!content && !req.file) {
      return next(
        new CustomErrorHandler("Post must have content or file", 400)
      );
    }

    let imageUrl;
    let imagePublicId;
    let videoUrl;
    let videoPublicId;

    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          resource_type: "auto",
          folder: req.file.mimetype.startsWith("image")
            ? "social-media-app/images"
            : "social-media-app/videos",
        });

        if (result.resource_type === "image") {
          imageUrl = result.secure_url;
          imagePublicId = result.public_id;
        } else if (result.resource_type === "video") {
          videoUrl = result.secure_url;
          videoPublicId = result.public_id;
        }

        fs.unlinkSync(req.file.path);
      } catch (error) {
        if (req.file && req.file.path) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({
          success: false,
          message: "File upload failed",
          error,
        });
      }
    }

    const post = await prisma.post.create({
      data: {
        content: content,
        authorId: userId,
        imageUrl,
        videoUrl,
        ...(imagePublicId && { imagePublicId }),
        ...(videoPublicId && { videoPublicId }),
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profilePic: true,
          },
        },
        _count: {
          select: {
            likes: true,
            dislikes: true,
            comments: true,
          },
        },
      },
    });

    // Format response
    const formattedPost: PostData = {
      ...post,
      likesCount: post._count.likes,
      dislikesCount: post._count.dislikes,
      commentsCount: post._count.comments,
    };

    // Remove the _count field from the response
    delete formattedPost._count;

    res.status(201).json({
      success: true,
      data: formattedPost,
    });
  }
);

// Get all posts ====>>>> /api/v1/posts
export const getAllPosts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const posts = await prisma.post.findMany({
      where: {
        deletedAt: null,
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
        _count: {
          select: {
            likes: true,
            dislikes: true,
            comments: true,
          },
        },
      },
    });

    // Get total count of non-deleted posts for pagination
    const totalPostsCount = await prisma.post.count({
      where: {
        deletedAt: null,
      },
    });

    // Return the response
    res.status(200).json({
      success: true,
      totalPostsCount,
      totalPages: Math.ceil(totalPostsCount / limit),
      currentPage: page,
      posts,
    });
  }
);

// Get a specific post by id ====>>>> /api/v1/posts/:id
export const getPostById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id;

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
        deletedAt: null,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profilePic: true,
            bio: true,
          },
        },
        comments: {
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
        },
        _count: {
          select: {
            likes: true,
            dislikes: true,
            comments: true,
          },
        },
      },
    });

    if (!post) {
      return next(new CustomErrorHandler("Post not found", 404));
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  }
);

// Delete a post(only author can delete) by id ====>>>> /api/v1/posts/:id
export const deletePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id;
    const userId = req.userId;

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
        deletedAt: null,
      },
    });

    if (!post) {
      return next(new CustomErrorHandler("Post not found", 404));
    }

    if (post.authorId !== userId) {
      return next(
        new CustomErrorHandler(
          "You are not authorized to delete this post",
          403
        )
      );
    }

    // Soft delete the post
    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    // Delete the image and video if they exist
    if (post.imagePublicId) {
      await cloudinary.uploader.destroy(post.imagePublicId, {
        resource_type: "image",
      });
    }

    if (post.videoPublicId) {
      await cloudinary.uploader.destroy(post.videoPublicId, {
        resource_type: "video",
      });
    }

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  }
);

// Get posts from followers and other users ====>>>> /api/v1/posts/feed
export const getFeedPosts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentUserId = req.userId;
    console.log(currentUserId);

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const following = await prisma.follower.findMany({
      where: {
        followerId: currentUserId,
      },
      select: {
        followingId: true,
      },
    });

    const followingId = following.map((follow) => follow.followingId);

    followingId.push(currentUserId as string);

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            authorId: {
              in: followingId,
            },
            deletedAt: null,
          },
          {
            authorId: {
              notIn: followingId,
            },
            deletedAt: null,
          },
        ],
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
        _count: {
          select: {
            likes: true,
            dislikes: true,
            comments: true,
          },
        },
      },
    });

    const totalCount = await prisma.post.count({
      where: {
        OR: [
          {
            authorId: {
              in: followingId,
            },
            deletedAt: null,
          },
          {
            authorId: {
              notIn: followingId,
            },
            deletedAt: null,
          },
        ],
      },
    });

    // Format the response
    const formattedPosts = posts.map((post) => {
      const { _count, ...restPost } = post;

      return {
        ...restPost,
        likesCount: _count.likes,
        dislikesCount: _count.dislikes,
        commentsCount: _count.comments,
      };
    });

    res.status(200).json({
      success: true,
      count: formattedPosts.length,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      data: formattedPosts,
    });
  }
);
