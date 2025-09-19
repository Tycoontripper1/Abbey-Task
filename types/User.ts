export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  bio?: string;
  avatar?: string;
  joinDate: string;
  friendsCount: number;
  connectionsCount: number;
}

export interface Connection {
  id: string;
  userId: string;
  connectedUserId: string;
  status: "pending" | "accepted" | "blocked";
  createdAt: string;
  updatedAt: string;
}

export interface ConnectionRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
  fromUser?: User;
  toUser?: User;
}
// Add to your types/User.ts or create a new file types/Post.ts
export interface Post {
  id: string;
  userId: string;
  user?: User; // Optional user data
  content: string;
  imageUrl?: string;
  likes: string[]; // Array of user IDs who liked the post
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  user?: User; // Optional user data
  postId: string;
  content: string;
  createdAt: string;
}
