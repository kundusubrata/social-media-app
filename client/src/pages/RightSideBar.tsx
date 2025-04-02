import { useAllUser } from "../hooks/useUsers";
import Loader from "../utils/Loader";
import { toast } from "react-toastify";
import { useFollow } from "../hooks/useFollow";
import { useEffect } from "react";

const RightSideBar = () => {
  const { data, isLoading, error } = useAllUser();
  const { followUser, unfollowUser, isLoading: followLoading, followingIds } = useFollow();
  const currentUserId = localStorage.getItem("userId");

  // Initialize followingIds from the API data
  useEffect(() => {
    if (data?.data) {
      const initialFollowing = data.data
        .filter((user: any) => 
          user.followers?.some((follow: any) => follow.followerId === currentUserId)
        )
        .map((user: any) => user.id);
    }
  }, [data, currentUserId]);

  if (isLoading) return <Loader />;
  if (error) {
    toast.error("Failed to load users. Please try again");
  }

  const users = data?.data || [];

  const handleToggleFollow = async (userId: string, isFollowing: boolean) => {
    if (isFollowing) {
      await unfollowUser(userId);
    } else {
      await followUser(userId);
    }
  };

  return (
    <div className="w-64 bg-white border-l h-screen p-4">
      <h3 className="text-xl font-semibold mb-4">Users to Follow</h3>
      {Array.isArray(users) && users.length > 0 ? (
        users
          .filter((user: any) => user.id !== currentUserId) // Don't show current user
          .map((user: any) => {
            // Check if following based on local state first, fall back to API data
            const isFollowing = followingIds.includes(user.id) || 
              user.followers?.some((follow: any) => follow.followerId === currentUserId);
            
            return (
              <div
                key={user.id}
                className="flex items-center justify-between mb-3 p-2 hover:bg-gray-100 rounded-md"
              >
                <div className="flex items-center space-x-3">
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user.username}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 font-bold text-gray-600">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="truncate max-w-24">{user.username}</span>
                </div>
                <button
                  className={`
                    px-3 py-1 rounded-full text-sm
                    ${isFollowing ? "bg-gray-200 text-gray-700" : "bg-primary text-black"}
                  `}
                  onClick={() => handleToggleFollow(user.id, isFollowing)}
                  disabled={followLoading}
                >
                  {followLoading ? "..." : isFollowing ? "Unfollow" : "Follow"}
                </button>
              </div>
            );
          })
      ) : (
        <p className="text-gray-500 px-4">No users to follow</p>
      )}
    </div>
  );
};

export default RightSideBar;