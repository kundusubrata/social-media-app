import { Calendar } from "lucide-react";
import { useUserProfile } from "../hooks/useUsers";
import { useParams } from "react-router-dom";
import Loader from "../utils/Loader";
import { toast } from "react-toastify";
import { FormatDate } from "../utils/FormatDate";
import UserProfilePost from "../posts/UserProfilePost";

const UserProfile = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useUserProfile(String(id));

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    toast.error(error.message || "Failed to load profile. Please try again.");
  }

  // console.log(data);
  const {
    bio,
    createdAt,
    email,
    profilePic,
    username,
    posts,
    followersCount,
    followingCount,
    postsCount,
  } = data.data || {};

  return (
    <div className="max-w-2xl mx-auto">
      {/* Cover Photo */}
      <div className="relative mb-16">
        <div className="h-48 overflow-hidden rounded-t-lg">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
            alt="Cover"
            className="w-full object-cover"
          />
        </div>

        {/* Profile Picture */}
        <div className="absolute -bottom-12 left-4">
          {profilePic ? (
            <img
              src={profilePic}
              alt={"Profile image"}
              className="w-24 h-24 rounded-full border-4 border-white"
            />
          ) : (
            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gray-200 text-xl font-bold text-gray-600">
              {username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 mb-6">
        <h1 className="text-2xl font-bold">
          {username.charAt(0).toUpperCase() + username.slice(1)}
        </h1>
        <p className="text-gray-600 mb-2">{email}</p>
        <p className="mb-3">{bio}</p>

        <div className="flex flex-wrap gap-4 text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>Joined {FormatDate(createdAt)}</span>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-1">
            <span className="font-bold">{followingCount}</span>
            <span className="text-gray-600">Following</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold">{followersCount}</span>
            <span className="text-gray-600">Followers</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold">{postsCount}</span>
            <span className="text-gray-600">Posts</span>
          </div>
        </div>
      </div>

      {/* User Posts */}
      <div className="mb-6 mt-12">
        <h2 className="text-xl font-semibold mb-4 px-4">Posts</h2>

        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => (
            <UserProfilePost
              key={post.id}
              profileImage={profilePic || null}
              name={username.charAt(0).toUpperCase() + username.slice(1)}
              description={post.content}
              postImage={post.imageUrl || post.videoUrl}
            />
          ))
        ) : (
          <p className="text-gray-500 px-4">No posts available</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
