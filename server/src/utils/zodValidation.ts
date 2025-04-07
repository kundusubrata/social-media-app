import { z } from "zod";

export const registerBody = z.object({
  username: z.string().min(2, "Username must be at least 3 characters long"),
  email: z.string().email(),
  password: z.string().min(3, "Password must be at least 3 characters long"),
});

export const loginBody = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});

export const updateUserProfileBody = z.object({
  username: z.string().min(2, "Username must be at least 3 characters long").optional(),
  email: z.string().email().optional(),
  profilePic: z.string().optional(),
  bio: z.string().optional(),
});

export const createPostBody = z.object({
  content: z
    .string()
    .max(500, "Content cannot exceed 500 characters")
    .trim()
    .optional(),
});

export const commentBody = z.object({
  content: z
    .string()
    .max(500, "Content cannot exceed 500 characters")
    .trim()
    .optional(),
});

type registerBody = z.infer<typeof registerBody>;
type loginBody = z.infer<typeof loginBody>;
type updateUserProfileBody = z.infer<typeof updateUserProfileBody>;
type createPostBody = z.infer<typeof createPostBody>;
