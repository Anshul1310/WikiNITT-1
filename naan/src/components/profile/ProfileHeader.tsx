"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { Pencil } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { request } from "graphql-request";
import { GET_ME } from "@/queries/user";

interface ProfileHeaderProps {
  user: {
    username: string;
    displayName: string;
    avatar: string;
    gender?: string;
  };
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const { data: session } = useSession();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      if (!session?.backendToken) return null;
      const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_API_URL!;
      const data = await request<any>(
        endpoint,
        GET_ME,
        {},
        {
          Authorization: `Bearer ${session.backendToken}`,
        }
      );
      return data.me;
    },
    enabled: !!session?.backendToken,
  });

  const isOwner = me?.username === user.username;

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6 mb-4 relative">
        <div className="flex items-center space-x-4">
          <Image
            src={user.avatar}
            alt={user.username}
            className="w-20 h-20 rounded-full object-cover"
            width={80}
            height={80}
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.displayName}
            </h1>
            <p className="text-gray-500">u/{user.username}</p>
          </div>
        </div>

        {isOwner && (
          <div className="absolute top-6 right-6">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          </div>
        )}
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentUser={{
          username: user.username,
          displayName: user.displayName,
          avatar: user.avatar,
        }}
      />
    </>
  );
};
