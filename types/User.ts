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
