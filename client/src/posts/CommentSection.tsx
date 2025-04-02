import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useComments } from "../hooks/useComments";
import Loader from "../utils/Loader";

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [newComment, setNewComment] = useState("");
  const [page, setPage] = useState(1);
  const {
    comments,
    totalComments,
    totalPages,
    isLoading,
    isSubmitting,
    isDeleting,
    addComment,
    deleteComment,
  } = useComments(postId, page);

  const currentUserId = localStorage.getItem("userId");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await addComment(newComment)) {
      setNewComment("");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="font-semibold text-lg mb-4">Comments ({totalComments})</h3>
      
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col space-y-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className={`px-4 py-2 bg-blue-500 text-white rounded-md self-end
              ${
                isSubmitting || !newComment.trim()
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-600"
              }`}
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </form>

      {/* Comments List */}
      {comments.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  {comment.author.profilePic ? (
                    <img
                      src={comment.author.profilePic}
                      alt={comment.author.username}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-sm font-bold text-gray-600 mr-2">
                      {comment.author.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">{comment.author.username}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                {currentUserId === comment.author.id && (
                  <button
                    onClick={() => deleteComment(comment.id)}
                    disabled={isDeleting[comment.id]}
                    className="text-gray-500 hover:text-red-500"
                    aria-label="Delete comment"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <p className="mt-2 text-gray-700">{comment.content}</p>
            </div>
          ))}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`px-3 py-1 rounded-md ${
                  page === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                Previous
              </button>
              <span className="px-3 py-1 bg-blue-500 text-white rounded-md">
                {page}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className={`px-3 py-1 rounded-md ${
                  page === totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;