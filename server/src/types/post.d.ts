type PostData = {
  id: string;
  createdAt: Date;
  deletedAt: Date | null;
  content: string | null;
  imageUrl: string | null;
  imagePublicId: string | null;
  videoUrl: string | null;
  videoPublicId: string | null;
  authorId: string;
  author: {
    id: string;
    username: string;
    profilePic: string | null;
  };
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  _count?: {
    likes: number;
    dislikes: number;
    comments: number;
  };
};
