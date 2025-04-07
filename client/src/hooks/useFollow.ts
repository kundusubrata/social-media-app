// hooks/useFollow.ts
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { mutate } from "swr";

export const useFollow = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [followingIds, setFollowingIds] = useState<string[]>([]);

  // Function to follow a user
  const followUser = async (userId: string) => {
    try {
      setIsLoading(true);
      
      // Update local state immediately
      setFollowingIds(prev => [...prev, userId]);
      
      const response = await axios.post(
        `/api/v1/users/${userId}/follow`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      // Refresh data in the background
      mutate("/api/v1/users/");
      // window.location.reload();
      
      toast.success(response.data.message);
      return true;
    } catch (error: unknown) {
      // Revert local state on error
      setFollowingIds(prev => prev.filter(id => id !== userId));
      
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to follow user");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to unfollow a user
  const unfollowUser = async (userId: string) => {
    try {
      setIsLoading(true);
      
      // Update local state immediately
      setFollowingIds(prev => prev.filter(id => id !== userId));
      
      const response = await axios.delete(`/api/v1/users/${userId}/unfollow`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      // Refresh data in the background
      mutate("/api/v1/users/");
      // window.location.reload();
      
      toast.success(response.data.message);
      return true;
    } catch (error: unknown) {
      // Revert local state on error
      setFollowingIds(prev => [...prev, userId]);
      
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to unfollow user");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    followUser,
    unfollowUser,
    isLoading,
    followingIds
  };
};