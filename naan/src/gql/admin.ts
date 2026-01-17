import { gql } from "graphql-request";

export const ADMIN_LOGIN_MUTATION = gql`
  mutation AdminLogin($input: LoginInput!) {
    login(input: $input)
  }
`;

export const GET_USERS_QUERY = gql`
  query GetUsers {
    users {
      id
      name
      email
      isAdmin
      isBanned
      createdAt
    }
  }
`;

export const BLOCK_USER_MUTATION = gql`
  mutation BlockUser($id: ID!) {
    blockUser(id: $id)
  }
`;

export const UNBLOCK_USER_MUTATION = gql`
  mutation UnblockUser($id: ID!) {
    unblockUser(id: $id)
  }
`;

export const GET_ARTICLES_QUERY = gql`
  query GetArticles {
    articles {
      id
      title
      slug
      category
      content
      thumbnail
      featured
      author {
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_ARTICLE_MUTATION = gql`
  mutation CreateArticle($input: NewArticle!) {
    createArticle(input: $input) {
      id
    }
  }
`;

export const UPDATE_ARTICLE_MUTATION = gql`
  mutation UpdateArticle($input: UpdateArticle!) {
    updateArticle(input: $input) {
      id
    }
  }
`;

export const DELETE_ARTICLE_MUTATION = gql`
  mutation DeleteArticle($id: ID!) {
    deleteArticle(id: $id)
  }
`;

export const UPLOAD_IMAGE_MUTATION = gql`
  mutation UploadImage($file: Upload!) {
    uploadImage(file: $file)
  }
`;

export const GET_CATEGORIES_QUERY = gql`
  query GetCategories {
    categories {
      id
      name
      slug
    }
  }
`;

export const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory($name: String!) {
    createCategory(name: $name) {
      id
      name
      slug
    }
  }
`;
