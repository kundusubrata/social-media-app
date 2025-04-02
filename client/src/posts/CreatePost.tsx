import React, { useState, useRef } from "react";
import { Image, Send, X } from "lucide-react";
import { useCreatePost } from "../hooks/usePosts";
import { useMyProfile } from "../hooks/useAuth";
import Loader from "../utils/Loader";
import { toast } from "react-toastify";

const CreatePost = () => {
  const [postText, setPostText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, error, isLoading } = useMyProfile();
  const { trigger, isMutating } = useCreatePost();

  if (isLoading) return <Loader />;
  if (error) return <p>{error.message}</p>;
  const { profilePic, username } = data?.data || {};
  

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!postText.trim() && !selectedFile) return;

    const formData = new FormData();
    formData.append("content", postText);
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      await trigger(formData);
      setPostText("");
      setSelectedFile(null);
      setPreviewUrl(null);

      toast.success("Post created successfully");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center mb-4">
        {profilePic ? (
          <img
            src={profilePic}
            alt="Your Profile"
            className="w-10 h-10 rounded-full mr-3"
          />
        ) : (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-xl font-bold text-gray-600">
            {username.charAt(0).toUpperCase()}
          </div>
        )}
        <h3 className="font-semibold ml-4">Create Post</h3>
      </div>

      <textarea
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
        className="w-full border border-gray-200 rounded-lg p-3 mb-3 min-h-24 focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="What's on your mind?"
      />

      {previewUrl && (
        <div className="relative mb-3">
          <img src={previewUrl} alt="Selected" className="w-full rounded-lg" />
          <button
            onClick={handleRemoveFile}
            className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white p-1 rounded-full"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            ref={fileInputRef}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-primary"
          >
            <Image size={20} />
            <span>Add Photo/Video</span>
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={(!postText.trim() && !selectedFile) || isMutating}
          aria-busy={isMutating}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-md transition-all
            ${
              (!postText.trim() && !selectedFile) || isMutating
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }
          `}
        >
          {isMutating ? (
            "Posting..."
          ) : (
            <>
              <Send size={16} /> Post
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
