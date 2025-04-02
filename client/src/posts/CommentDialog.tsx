import { X } from "lucide-react";
import CommentSection from "./CommentSection";

interface CommentDialogProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
}

const CommentDialog = ({ postId, isOpen, onClose }: CommentDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Comments</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close dialog"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="overflow-y-auto p-4 flex-grow">
          <CommentSection postId={postId} />
        </div>
      </div>
    </div>
  );
};

export default CommentDialog;