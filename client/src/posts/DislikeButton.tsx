import { ThumbsDown } from "lucide-react";
import { useDislike } from "../hooks/useDislike";
import { useEffect, useState } from "react";
import axios from "axios";

interface DislikeButtonProps {
  postId: string;
  disLikes?: number;
  initialDisliked?: boolean;
}

const DislikeButton = ({ 
  postId, 
  disLikes = 0, 
  initialDisliked = false 
}: DislikeButtonProps) => {
  const [hasDisliked, setHasDisliked] = useState(initialDisliked);
  const [checkingDislikeStatus, setCheckingDislikeStatus] = useState(true);
  
  // Get dislike status when component mounts
  useEffect(() => {
    const checkDislikeStatus = async () => {
      try {
        const response = await axios.get(`/api/v1/posts/${postId}/like-status`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setHasDisliked(response.data.disliked);
      } catch (error) {
        console.error("Error checking dislike status:", error);
      } finally {
        setCheckingDislikeStatus(false);
      }
    };
    
    const currentUserId = localStorage.getItem("userId");
    if (currentUserId) {
      checkDislikeStatus();
    } else {
      setCheckingDislikeStatus(false);
    }
  }, [postId]);

  const { disliked, dislikesCount, toggleDislike, isLoading } = useDislike(
    postId, 
    hasDisliked, 
    disLikes
  );

  return (
    <button
      className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
      onClick={toggleDislike}
      disabled={isLoading || checkingDislikeStatus}
    >
      <ThumbsDown
        className={`w-5 h-5 ${disliked ? "text-blue-500 fill-blue-500" : "text-gray-400"}`}
      />
      <span>{dislikesCount}</span>
    </button>
  );
};

export default DislikeButton;