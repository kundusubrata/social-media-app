import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LikeButton from "./LikeButton";
import DislikeButton from "./DislikeButton";
import CommentDialog from "./CommentDialog";
import axios from "axios";

interface PostProps {
  postId: string;
  authorId: string;
  profileImage: string;
  name: string;
  description: string;
  postImage?: string;
  commentsCount?: number;
  likesCount?: number;
  dislikesCount?: number;
}

const Post = ({
  postId,
  authorId,
  profileImage,
  name,
  description,
  postImage,
  commentsCount = 0,
  likesCount = 0,
  dislikesCount = 0,
}: PostProps) => {
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const currentUserId = localStorage.getItem("userId");

  // Check if the current user has already liked or disliked this post
  useEffect(() => {
    const checkInteractionStatus = async () => {
      try {
        const response = await axios.get(
          `/api/v1/posts/${postId}/like-status`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setHasLiked(response.data.liked);
        setHasDisliked(response.data.disliked);
      } catch (error) {
        console.error("Error checking interaction status:", error);
      } finally {
        setCheckingStatus(false);
      }
    };

    if (currentUserId) {
      checkInteractionStatus();
    } else {
      setCheckingStatus(false);
    }
  }, [postId, currentUserId]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <Link to={`/profile/${authorId}`} className="flex items-center mb-4">
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
      </Link>
      <p className="text-gray-700 mb-4">{description}</p>
      {postImage && (
        <img src={postImage} alt="Post" className="w-full rounded-md mb-4" />
      )}
      <div className="flex items-center space-x-4">
        <LikeButton
          postId={postId}
          likes={Number(likesCount)}
          initialLiked={hasLiked}
        />
        <DislikeButton
          postId={postId}
          disLikes={Number(dislikesCount)}
          initialDisliked={hasDisliked}
        />
        <CommentDialog postId={postId} commentsCount={commentsCount} />
      </div>
    </div>
  );
};

export default Post;
