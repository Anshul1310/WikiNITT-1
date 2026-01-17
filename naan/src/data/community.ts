import { VoteType, PublicUser, Group } from "@/gql/graphql";

export interface Comment {
  id: string;
  author: string | PublicUser;
  content: string;
  timestamp: string;
  upvotes: number;
  replies?: Comment[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string | PublicUser;
  community?: string;
  group?: Group;
  timestamp?: string;
  createdAt?: string;
  upvotes: number;
  downvotes: number;
  userVote: VoteType;
  commentsCount: number;
  comments: Comment[];
}
