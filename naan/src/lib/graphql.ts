import { GraphQLClient } from "graphql-request";

const endpoint =
  process.env.NEXT_PUBLIC_GRAPHQL_API_URL || "http://localhost:8080/query";

export const getGraphQLClient = (token?: string) => {
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return new GraphQLClient(endpoint, { headers });
};
