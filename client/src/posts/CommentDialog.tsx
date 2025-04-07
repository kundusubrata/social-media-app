import * as Dialog from "@radix-ui/react-dialog";
import * as Form from "@radix-ui/react-form";
import { X, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useComments } from "../hooks/useComments";
import Loader from "../utils/Loader";

interface CommentDialogProps {
  postId: string;
  commentsCount: number;
}

const CommentDialog: React.FC<CommentDialogProps> = ({
  postId,
  commentsCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [newComment, setNewComment] = useState("");

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

  const handleSubmitComment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (await addComment(newComment)) {
      setNewComment("");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500">
          <MessageCircle />
          <span>{commentsCount || 0}</span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md max-h-[85vh] -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-0 focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] duration-200 flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <Dialog.Title className="text-lg font-semibold">
              Comments ({totalComments})
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-full p-1">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader />
              </div>
            ) : (
              <>
                {/* Comment Form */}
                <Form.Root className="mb-6" onSubmit={handleSubmitComment}>
                  <Form.Field name="comment">
                    <div className="space-y-2">
                      <Form.Control asChild>
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Write a comment..."
                          className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                          disabled={isSubmitting}
                        />
                      </Form.Control>
                      <Form.Submit asChild>
                        <button
                          disabled={isSubmitting || !newComment.trim()}
                          className={`px-4 py-2 bg-blue-500 text-white rounded-md ml-auto block
                            ${
                              isSubmitting || !newComment.trim()
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-blue-600"
                            }`}
                        >
                          {isSubmitting ? "Posting..." : "Post Comment"}
                        </button>
                      </Form.Submit>
                    </div>
                  </Form.Field>
                </Form.Root>

                {/* Comments List */}
                {comments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No comments yet</p>
                    <p className="text-gray-400 text-sm">
                      Be the first to share your thoughts
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-gray-50 rounded-lg p-4"
                      >
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
                                {comment.author.username
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                            )}
                            <div>
                              <span className="font-medium">
                                {comment.author.username}
                              </span>
                              <span className="text-xs text-gray-500 ml-2">
                                {new Date(comment.createdAt).toLocaleDateString(
                                  undefined,
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          </div>

                          {currentUserId === comment.author.id && (
                            <button
                              onClick={() => deleteComment(comment.id)}
                              disabled={isDeleting[comment.id]}
                              className="text-gray-400 hover:text-red-500 focus:outline-none"
                              aria-label="Delete comment"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                        <p className="mt-2 text-gray-700 whitespace-pre-line">
                          {comment.content}
                        </p>
                      </div>
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center mt-6 space-x-1">
                        <button
                          onClick={() => handlePageChange(page - 1)}
                          disabled={page === 1}
                          className={`px-3 py-1 rounded ${
                            page === 1
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          Previous
                        </button>

                        {Array.from(
                          { length: Math.min(totalPages, 3) },
                          (_, i) => {
                            const pageNumber = i + 1;
                            return (
                              <button
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                                className={`px-3 py-1 rounded ${
                                  pageNumber === page
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                }`}
                              >
                                {pageNumber}
                              </button>
                            );
                          }
                        )}

                        {totalPages > 3 && (
                          <>
                            {page > 3 && <span className="px-2 py-1">...</span>}

                            {page > 3 && (
                              <button
                                onClick={() => handlePageChange(page)}
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                              >
                                {page}
                              </button>
                            )}

                            {page < totalPages - 2 && (
                              <span className="px-2 py-1">...</span>
                            )}

                            {page < totalPages - 2 && (
                              <button
                                onClick={() => handlePageChange(totalPages)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded"
                              >
                                {totalPages}
                              </button>
                            )}
                          </>
                        )}

                        <button
                          onClick={() => handlePageChange(page + 1)}
                          disabled={page === totalPages}
                          className={`px-3 py-1 rounded ${
                            page === totalPages
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CommentDialog;
