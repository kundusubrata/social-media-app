import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
  postId: string;
  author: {
    id: string;
    username: string;
    profilePic: string | null;
  };
}

interface CommentsResponse {
  success: boolean;
  message: string;
  totalComments: number;
  totalPages: number;
  currentPage: number;
  data: Comment[];
}

const fetcher = async (url: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const useComments = (postId: string, page = 1, limit = 10) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});

  // Fetch comments
  const {
    data,
    error,
    isLoading,
    mutate: refreshComments,
  } = useSWR<CommentsResponse>(
    `/api/v1/posts/${postId}/comments?page=${page}&limit=${limit}`,
    fetcher
  );

  const comments = data?.data || [];
  const totalComments = data?.totalComments || 0;
  const totalPages = data?.totalPages || 1;

  // Add a new comment
  const addComment = async (content: string) => {
    if (!content.trim()) {
      toast.error("Comment cannot be empty");
      return false;
    }

    try {
      setIsSubmitting(true);

      await axios.post(
        `/api/v1/posts/${postId}/comments`,
        { content },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Refresh comments
      refreshComments();
      // Update post comments count
      mutate(`/api/v1/posts`);

      toast.success("Comment added successfully");
      return true;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to add comment");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a comment
  const deleteComment = async (commentId: string) => {
    try {
      setIsDeleting((prev) => ({ ...prev, [commentId]: true }));

      await axios.delete(`/api/v1/comments/${commentId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: { commentId },
      });

      // Refresh comments
      refreshComments();
      // Update post comments count
      mutate(`/api/v1/posts`);

      toast.success("Comment deleted successfully");
      return true;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || "Failed to delete comment"
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      return false;
    } finally {
      setIsDeleting((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  return {
    comments,
    totalComments,
    totalPages,
    currentPage: page,
    isLoading,
    error,
    isSubmitting,
    isDeleting,
    addComment,
    deleteComment,
    refreshComments,
  };
};
