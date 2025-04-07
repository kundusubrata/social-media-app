import { useState } from "react";
import { Heart, MessageCircle, ThumbsDown } from "lucide-react";
import { DeleteDropdown } from "./DeleteDropdown";


interface MyProfilePostProps {
  postId: string;
  profileImage: string;
  name: string;
  description: string;
  postImage?: string;
}

const MyProfilePost = ({
  postId,
  profileImage,
  name,
  description,
  postImage,
}: MyProfilePostProps) => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between">
        <div className="flex items-center mb-4">
          {profileImage ? (
            <img
            src={profileImage}
            alt={name}
            className="w-10 h-10 rounded-full mr-3"
          />
          ) : (
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-xl font-bold text-gray-600">
            {name.charAt(0).toUpperCase()}
          </div>
          )}
          <div>
            <h3 className="font-semibold ml-4">{name}</h3>
          </div>
        </div>
        <div>
            <DeleteDropdown postId={postId} />
        </div>
      </div>

      <p className="text-gray-700 mb-4">{description}</p>

      {postImage && (
        <img src={postImage} alt="Post" className="w-full rounded-md mb-4" />
      )}

      <div className="flex items-center space-x-4">
        <button
          className="flex items-center space-x-2 text-gray-600 hover:text-green-500"
          onClick={() => setLikes(likes + 1)}
        >
          <Heart />
          <span>{likes}</span>
        </button>

        <button
          className="flex items-center space-x-2 text-gray-600 hover:text-red-500"
          onClick={() => setDislikes(dislikes + 1)}
        >
          <ThumbsDown />
          <span>{dislikes}</span>
        </button>

        <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500">
          <MessageCircle />
          <span>Comment</span>
        </button>
      </div>
    </div>
  );
};

export default MyProfilePost;
