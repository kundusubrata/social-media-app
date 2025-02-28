type UserData = {
    id: string;
    username: string;
    email: string;
    profilePic: string | null;
    bio: string | null;
    createdAt: Date;
    followersCount: number;
    followingCount: number;
    postsCount: number;
    _count?: {
        followers: number;
        following: number;
        posts: number;
    };
};