import { useMyProfile } from "../hooks/useAuth";
import { Calendar } from "lucide-react";
import { FormatDate } from "../utils/FormatDate";
import Loader from "../utils/Loader";
import MyProfilePost from "../posts/MyProfilePost";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { data, error, isLoading } = useMyProfile();

  // console.log(data);

  if (isLoading) {
    return <Loader />;
  }

  // if (error) {
  //   return <div className="text-red-500">Failed to load profile</div>;
  // }
  if (error) {
    toast.error(error.message || "Failed to load profile. Please try again.");
  }
  

  const { profilePic, username, createdAt, email, bio, posts, _count } =
    data?.data || {};

  return (
    <>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center my-8">
          {/* Profile Picture */}
          {profilePic ? (
            <img
              src={profilePic}
              alt="Profile image"
              className="w-48 h-48 rounded-full border-4 border-blue-200"
            />
          ) : (
            <div className="flex items-center justify-center w-48 h-48 rounded-full border-4 border-blue-200 bg-gray-200 text-6xl font-bold text-gray-600">
              {username.charAt(0).toUpperCase()}
            </div>
          )}
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
              <span>Joined at {FormatDate(createdAt)}</span>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-1">
              <span className="font-bold">{_count.following}</span>
              <span className="text-gray-600">Following</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold">{_count.followers}</span>
              <span className="text-gray-600">Followers</span>
            </div>
          </div>

          <div className="flex gap-2 mb-8">
            <button className="bg-gray-200 text-black py-2 px-6 rounded-full hover:bg-blue-300">
              Edit Profile
            </button>
            <button className="bg-gray-200 text-black py-2 px-6 rounded-full hover:bg-red-300">
              Delete Profile
            </button>
          </div>
        </div>

        {/* My all Posts */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 px-4">Posts</h2>

          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((post) => (
              <MyProfilePost
                key={post.id}
                id={post.id}
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
    </>
  );
};

export default MyProfile;
