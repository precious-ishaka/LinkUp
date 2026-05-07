// ============================================================
// api.ts — All HTTP calls to Spring Boot backend
// Base URL: http://localhost:8080/api
// ============================================================

import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://localhost:8080/api";

// ── Helpers ─────────────────────────────────────────────────

async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem("access_token");
}

async function authHeaders(): Promise<HeadersInit> {
  const token = await getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// ── Auth ─────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface OAuthRequest {
  provider: "GOOGLE" | "GITHUB";
  code: string;
  redirectUri: string;
}

export const AuthAPI = {
  login: (data: LoginRequest) =>
    request<AuthResponse>("POST", "/auth/login", data),

  register: (data: {
    fullName: string;
    username: string;
    email: string;
    password: string;
  }) => request<AuthResponse>("POST", "/auth/register", data),

  forgotPassword: (email: string) =>
    request<{ message: string }>("POST", "/auth/forgot-password", { email }),

  resetPassword: (token: string, newPassword: string) =>
    request<{ message: string }>("POST", "/auth/reset-password", {
      token,
      newPassword,
    }),

  oauthLogin: (data: OAuthRequest) =>
    request<AuthResponse>("POST", "/auth/oauth2/callback", data),

  refreshToken: (refreshToken: string) =>
    request<AuthResponse>("POST", "/auth/refresh", { refreshToken }),

  logout: () => request<void>("POST", "/auth/logout"),

  saveTokens: async (auth: AuthResponse) => {
    await AsyncStorage.setItem("access_token", auth.accessToken);
    await AsyncStorage.setItem("refresh_token", auth.refreshToken);
  },

  clearTokens: async () => {
    await AsyncStorage.multiRemove(["access_token", "refresh_token"]);
  },
};

// ── Users ─────────────────────────────────────────────────────

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  status: "ONLINE" | "OFFLINE" | "AWAY";
  friendsCount: number;
  onlineFriendsCount: number;
  createdAt: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
}

export const UserAPI = {
  getMe: () => request<User>("GET", "/users/me"),

  updateProfile: (data: UpdateProfileRequest) =>
    request<User>("PUT", "/users/me", data),

  updateStatus: (status: "ONLINE" | "OFFLINE" | "AWAY") =>
    request<User>("PATCH", "/users/me/status", { status }),

  deactivateAccount: () => request<void>("DELETE", "/users/me"),

  uploadAvatar: async (uri: string): Promise<{ avatarUrl: string }> => {
    const token = await getToken();
    const formData = new FormData();
    formData.append("file", {
      uri,
      name: "avatar.jpg",
      type: "image/jpeg",
    } as any);
    const res = await fetch(`${BASE_URL}/users/me/avatar`, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    if (!res.ok) throw new Error("Avatar upload failed");
    return res.json();
  },

  searchUsers: (query: string) =>
    request<User[]>("GET", `/users/search?q=${encodeURIComponent(query)}`),

  getUserById: (id: string) => request<User>("GET", `/users/${id}`),

  getFriends: () => request<User[]>("GET", "/users/me/friends"),

  getOnlineFriends: () => request<User[]>("GET", "/users/me/friends/online"),
};

// ── Friends ─────────────────────────────────────────────────

export interface FriendRequest {
  id: string;
  sender: User;
  receiver: User;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
}

export const FriendAPI = {
  sendRequest: (receiverId: string) =>
    request<FriendRequest>("POST", "/friends/request", { receiverId }),

  acceptRequest: (requestId: string) =>
    request<FriendRequest>("PATCH", `/friends/request/${requestId}/accept`),

  rejectRequest: (requestId: string) =>
    request<FriendRequest>("PATCH", `/friends/request/${requestId}/reject`),

  removeFriend: (friendId: string) =>
    request<void>("DELETE", `/friends/${friendId}`),

  getPendingRequests: () =>
    request<FriendRequest[]>("GET", "/friends/requests/pending"),
};

// ── Chats ─────────────────────────────────────────────────────

export interface ChatRoom {
  id: string;
  name?: string;
  isGroup: boolean;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
}

export interface Message {
  id: string;
  chatRoomId: string;
  sender: User;
  content: string;
  type: "TEXT" | "IMAGE" | "FILE";
  readBy: string[];
  createdAt: string;
}

export const ChatAPI = {
  getMyChats: () => request<ChatRoom[]>("GET", "/chats"),

  getChatById: (id: string) => request<ChatRoom>("GET", `/chats/${id}`),

  createDirectChat: (userId: string) =>
    request<ChatRoom>("POST", "/chats/direct", { userId }),

  createGroupChat: (name: string, participantIds: string[]) =>
    request<ChatRoom>("POST", "/chats/group", { name, participantIds }),

  getMessages: (chatId: string, page = 0, size = 30) =>
    request<{ content: Message[]; totalPages: number }>(
      "GET",
      `/chats/${chatId}/messages?page=${page}&size=${size}`,
    ),

  sendMessage: (chatId: string, content: string, type = "TEXT") =>
    request<Message>("POST", `/chats/${chatId}/messages`, { content, type }),

  markAsRead: (chatId: string) =>
    request<void>("PATCH", `/chats/${chatId}/read`),

  deleteChat: (chatId: string) => request<void>("DELETE", `/chats/${chatId}`),
};

// ── Posts ──────────────────────────────────────────────────────

export interface Post {
  id: string;
  author: User;
  content: string;
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  likedByMe: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: string;
}

export const PostAPI = {
  getFeed: (page = 0) =>
    request<{ content: Post[]; totalPages: number }>(
      "GET",
      `/posts/feed?page=${page}&size=20`,
    ),

  createPost: (content: string, imageUrl?: string) =>
    request<Post>("POST", "/posts", { content, imageUrl }),

  likePost: (postId: string) =>
    request<{ likesCount: number }>("POST", `/posts/${postId}/like`),

  unlikePost: (postId: string) =>
    request<{ likesCount: number }>("DELETE", `/posts/${postId}/like`),

  getComments: (postId: string) =>
    request<Comment[]>("GET", `/posts/${postId}/comments`),

  addComment: (postId: string, content: string) =>
    request<Comment>("POST", `/posts/${postId}/comments`, { content }),

  deletePost: (postId: string) => request<void>("DELETE", `/posts/${postId}`),
};

// ── Notifications ─────────────────────────────────────────────

export interface AppNotification {
  id: string;
  type: "FRIEND_REQUEST" | "MESSAGE" | "LIKE" | "COMMENT" | "INVITE";
  title: string;
  body: string;
  read: boolean;
  data?: Record<string, string>;
  createdAt: string;
}

export const NotificationAPI = {
  getAll: () => request<AppNotification[]>("GET", "/notifications"),
  markRead: (id: string) => request<void>("PATCH", `/notifications/${id}/read`),
  markAllRead: () => request<void>("PATCH", "/notifications/read-all"),
};

// ── Invite ─────────────────────────────────────────────────────

export const InviteAPI = {
  sendInvite: (email: string) =>
    request<{ message: string }>("POST", "/invites", { email }),
  getInviteLink: () => request<{ link: string }>("GET", "/invites/link"),
};
