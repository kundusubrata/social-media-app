import axios, { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { mutate } from "swr";

export const useLike = (
  postId: string,
  initialLiked: boolean = false,
  initialLikesCount: number = 0
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);

  // Function to toggle like
  const toggleLike = async () => {
    try {
      setIsLoading(true);

      // Optimistic update
      setLiked(!liked);
      setLikesCount(liked ? likesCount - 1 : likesCount + 1);

      const response = await axios.post(
        `/api/v1/posts/${postId}/toggle-like`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update with actual data from server
      const { liked: serverLiked, likeCount } = response.data;
      setLiked(serverLiked);
      setLikesCount(likeCount);

      // Refresh posts data in the background
      mutate("/api/v1/posts");

      return true;
    } catch (error: unknown) {
      // Revert optimistic update on error
      setLiked(initialLiked);
      setLikesCount(initialLikesCount);

      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to like post");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    liked,
    likesCount,
    toggleLike,
    isLoading,
  };
};

