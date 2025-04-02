import axios, { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { mutate } from "swr";

export const useDislike = (
  postId: string,
  initialDisliked: boolean = false,
  initialDislikesCount: number = 0
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [disliked, setDisliked] = useState(initialDisliked);
  const [dislikesCount, setDislikesCount] = useState(initialDislikesCount);

  // Function to toggle dislike
  const toggleDislike = async () => {
    try {
      setIsLoading(true);

      // Optimistic update
      setDisliked(!disliked);
      setDislikesCount(disliked ? dislikesCount - 1 : dislikesCount + 1);

      const response = await axios.post(
        `/api/v1/posts/${postId}/toggle-dislike`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update with actual data from server
      const { disliked: serverDisliked, dislikeCount } = response.data;
      setDisliked(serverDisliked);
      setDislikesCount(dislikeCount);

      // Refresh posts data in the background
      mutate("/api/v1/posts");
      return true;
    } catch (error: unknown) {
      // Revert optimistic update on error
      setDisliked(initialDisliked);
      setDislikesCount(initialDislikesCount);

      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to dislike post");
        console.log(error);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    disliked,
    dislikesCount,
    toggleDislike,
    isLoading,
  };
};
