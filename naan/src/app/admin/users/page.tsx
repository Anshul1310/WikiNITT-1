"use client";

import { useState, useEffect } from "react";
import { GraphQLClient } from "graphql-request";
import {
  GET_USERS_QUERY,
  BLOCK_USER_MUTATION,
  UNBLOCK_USER_MUTATION,
} from "@/gql/admin";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isBanned: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();

  const fetchUsers = async () => {
    if (!session?.backendToken) return;

    const client = new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_API_URL!, {
      headers: {
        Authorization: `Bearer ${session.backendToken}`,
      },
    });

    try {
      const data: any = await client.request(GET_USERS_QUERY);
      setUsers(data.users);
    } catch (error: any) {
      console.error("Failed to fetch users", error);
      
      if (
        error.message.includes("access denied") ||
        error.message.includes("not authenticated")
      ) {
        signOut({ callbackUrl: "/admin/login" });
      } else {
        router.push("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.backendToken) {
      fetchUsers();
    } else if (session === null) {
      
      router.push("/admin/login");
    }
  }, [session]);

  const handleBlock = async (id: string) => {
    if (!session?.backendToken) return;
    const client = new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_API_URL!, {
      headers: { Authorization: `Bearer ${session.backendToken}` },
    });

    try {
      await client.request(BLOCK_USER_MUTATION, { id });
      fetchUsers(); 
    } catch (error) {
      console.error("Failed to block user", error);
    }
  };

  const handleUnblock = async (id: string) => {
    if (!session?.backendToken) return;
    const client = new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_API_URL!, {
      headers: { Authorization: `Bearer ${session.backendToken}` },
    });

    try {
      await client.request(UNBLOCK_USER_MUTATION, { id });
      fetchUsers(); 
    } catch (error) {
      console.error("Failed to unblock user", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">User Management</h1>
      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Name
              </th>
              <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Email
              </th>
              <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Role
              </th>
              <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Status
              </th>
              <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                  <p className="whitespace-no-wrap text-gray-900">
                    {user.name}
                  </p>
                </td>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                  <p className="whitespace-no-wrap text-gray-900">
                    {user.email}
                  </p>
                </td>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                  <span
                    className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                      user.isAdmin ? "text-green-900" : "text-gray-900"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`absolute inset-0 rounded-full opacity-50 ${
                        user.isAdmin ? "bg-green-200" : "bg-gray-200"
                      }`}
                    ></span>
                    <span className="relative">
                      {user.isAdmin ? "Admin" : "User"}
                    </span>
                  </span>
                </td>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                  <span
                    className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                      user.isBanned ? "text-red-900" : "text-green-900"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`absolute inset-0 rounded-full opacity-50 ${
                        user.isBanned ? "bg-red-200" : "bg-green-200"
                      }`}
                    ></span>
                    <span className="relative">
                      {user.isBanned ? "Banned" : "Active"}
                    </span>
                  </span>
                </td>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                  {user.isBanned ? (
                    <button
                      onClick={() => handleUnblock(user.id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Unblock
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBlock(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Block
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
