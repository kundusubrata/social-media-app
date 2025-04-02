import { Heart } from "lucide-react";
import { useLike } from "../hooks/useLike";

interface LikeButtonProps {
  postId: string;
  likes?: number;
  initialLiked?: boolean;
}

const LikeButton = ({ postId, likes = 0, initialLiked = false }: LikeButtonProps) => {
  const { liked, likesCount, toggleLike, isLoading } = useLike(postId, initialLiked, likes);

  return (
    <button
      className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
      onClick={toggleLike}
      disabled={isLoading}
    >
      <Heart
        className={`w-5 h-5 ${liked ? "text-red-500 fill-red-500" : "text-gray-400"}`}
      />
      <span>{likesCount}</span>
    </button>
  );
};

export default LikeButton;