import { gql } from "../gql/gql";

export const GET_PUBLIC_USER = gql(`
  query GetPublicUser($username: String!) {
    user(username: $username) {
      id
      username
      displayName
      avatar
      gender
    }
  }
`);

export const GET_USER_POSTS = gql(`
  query GetUserPosts($username: String!, $limit: Int, $offset: Int) {
    user(username: $username) {
      id
      posts(limit: $limit, offset: $offset) {
        id
        title
        content
        createdAt
        voteStatus: userVote
        upvotesCount: upvotes
        downvotesCount: downvotes
        commentsCount
        author {
          id
          username
          displayName
          avatar
        }
        group {
          id
          name
          slug
        }
      }
    }
  }
`);

export const GET_USER_COMMENTS = gql(`
  query GetUserComments($username: String!, $limit: Int, $offset: Int) {
    user(username: $username) {
      id
      comments(limit: $limit, offset: $offset) {
        id
        content
        createdAt
        voteStatus: userVote
        upvotesCount: upvotes
        downvotesCount: downvotes
        repliesCount
        author {
          id
          username
          displayName
          avatar
        }
        post {
          id
          title
          group {
            id
            slug
            name
          }
        }
      }
    }
  }
`);

export const GET_USER_GROUPS = gql(`
  query GetUserGroups($username: String!) {
    userGroups(username: $username) {
        id
        name
        slug
        description
        membersCount
    }
  }
`);

export const GET_ME = gql(`
  query GetMe {
    me {
      id
      username
      displayName
      avatar
      isAdmin
    }
  }
`);

export const UPDATE_USER = gql(`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      username
      displayName
      avatar
    }
  }
`);

export const UPLOAD_AVATAR = gql(`
  mutation UploadAvatar($file: Upload!) {
    uploadAvatar(file: $file)
  }
`);
