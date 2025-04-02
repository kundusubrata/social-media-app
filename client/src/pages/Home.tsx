import { toast } from "react-toastify";
import { useAllPost } from "../hooks/usePosts";
import CreatePost from "../posts/CreatePost";
import Post from "../posts/Post";
import Loader from "../utils/Loader";

const Home = () => {
  const { data, isLoading, error } = useAllPost();

  if (isLoading) return <Loader />;
  if (error) {
    toast.error(error.message || "Failed to load feed. Please try again");
  }

  console.log(data);
  const { posts } = data;

  return (
    <div className="max-w-2xl mx-auto">
      <CreatePost />

      {Array.isArray(posts) && posts.length > 0 ? (
        posts.map((post) => (
          <Post
            key={post.id}
            postId={post.id}
            authorId={post.author.id}
            profileImage={post.author.profilePic || null}
            name={post.author.username}
            description={post.content}
            postImage={post.imageUrl || post.videoUrl} 
            commentsCount={post._count.comments}
            likesCount={post._count.likes}
            dislikesCount={post._count.dislikes}
          />
        ))
      ) : (
        <p className="text-gray-500 px-4">No posts available</p>
      )}
    </div>
  );
};

export default Home;
