"use client";
import Image from "next/image";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "graphql-request";
import {
  GET_DISCUSSION,
  GET_CHANNEL_MESSAGES,
  SEND_MESSAGE,
  CREATE_CHANNEL,
} from "@/queries/community";
import {
  Query,
  GetChannelMessagesQuery,
  GetDiscussionQuery,
  ChannelType,
} from "@/gql/graphql";
import { Send, Hash, Plus, MoreVertical } from "lucide-react";
import { useSession } from "next-auth/react";
import { getGraphQLClient } from "@/lib/graphql";

interface DiscussionViewProps {
  groupId: string;
  groupName: string;
  isOwner: boolean;
}

export default function DiscussionView({
  groupId,
  groupName,
  isOwner,
}: DiscussionViewProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(
    null,
  );
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: discussionData, isLoading: isLoadingDiscussion } = useQuery({
    queryKey: ["discussion", groupId],
    queryFn: async () => {
      const client = getGraphQLClient(session?.backendToken);
      const data = await client.request<GetDiscussionQuery>(GET_DISCUSSION, {
        groupId,
      });
      return data.discussion;
    },
  });

  useEffect(() => {
    if (
      discussionData?.channels &&
      discussionData.channels.length > 0 &&
      !selectedChannelId
    ) {
      setSelectedChannelId(discussionData.channels[0].id);
    }
  }, [discussionData, selectedChannelId]);

  const { data: channelData, isLoading: isLoadingMessages } = useQuery({
    queryKey: ["channel", selectedChannelId],
    queryFn: async () => {
      if (!selectedChannelId) return null;
      const client = getGraphQLClient(session?.backendToken);
      const data = await client.request<GetChannelMessagesQuery>(
        GET_CHANNEL_MESSAGES,
        {
          channelId: selectedChannelId,
          limit: 50,
          offset: 0,
        },
      );
      return data.channel;
    },
    enabled: !!selectedChannelId,
    refetchInterval: 3000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!selectedChannelId) return;
      const client = getGraphQLClient(session?.backendToken);
      await client.request(SEND_MESSAGE, {
        input: {
          channelId: selectedChannelId,
          content,
        },
      });
    },
    onSuccess: () => {
      setMessageInput("");
      queryClient.invalidateQueries({
        queryKey: ["channel", selectedChannelId],
      });
    },
  });

  const createChannelMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!discussionData?.id) return;
      const client = getGraphQLClient(session?.backendToken);
      await client.request(CREATE_CHANNEL, {
        input: {
          discussionId: discussionData.id,
          name,
          type: ChannelType.Text,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussion", groupId] });
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    sendMessageMutation.mutate(messageInput);
  };

  const handleCreateChannel = () => {
    const name = prompt("Enter channel name:");
    if (name) {
      createChannelMutation.mutate(name);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [channelData?.messages]);

  if (isLoadingDiscussion) {
    return <div className="p-8 text-center">Loading discussion...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white border rounded-lg overflow-hidden shadow-sm">
      {}
      <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-bold text-gray-700 truncate">{groupName}</h2>
          {isOwner && (
            <button
              onClick={handleCreateChannel}
              className="p-1 hover:bg-gray-200 rounded-full text-gray-500"
              title="Create Channel"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {discussionData?.channels?.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setSelectedChannelId(channel.id)}
              className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedChannelId === channel.id
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Hash className="w-4 h-4 mr-2 opacity-70" />
              {channel.name}
            </button>
          ))}
          {(!discussionData?.channels ||
            discussionData.channels.length === 0) && (
            <div className="text-center py-4 text-sm text-gray-500">
              No channels yet.
            </div>
          )}
        </div>
      </div>

      {}
      <div className="flex-1 flex flex-col">
        {selectedChannelId ? (
          <>
            {}
            <div className="h-14 border-b border-gray-200 flex items-center px-6 justify-between bg-white">
              <div className="flex items-center">
                <Hash className="w-5 h-5 text-gray-400 mr-2" />
                <h3 className="font-bold text-gray-900">
                  {
                    discussionData?.channels?.find(
                      (c) => c.id === selectedChannelId,
                    )?.name
                  }
                </h3>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
              {isLoadingMessages ? (
                <div className="text-center text-gray-500">
                  Loading messages...
                </div>
              ) : channelData?.messages && channelData.messages.length > 0 ? (
                channelData.messages
                  .slice()
                  .reverse()
                  .map((msg) => {
                    return (
                      <div key={msg.id} className="flex items-start space-x-3">
                        <div className="shrink-0">
                          {msg.sender.avatar ? (
                            <Image
                              className="h-8 w-8 rounded-full"
                              src={msg.sender.avatar}
                              alt={msg.sender.name}
                              width={32}
                              height={32}
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                              {msg.sender.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-baseline space-x-2">
                            <span className="text-sm font-bold text-gray-900">
                              {msg.sender.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-800 mt-1">
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="text-center text-gray-400 py-10">
                  No messages yet. Start the conversation!
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={`Message #${
                    discussionData?.channels?.find(
                      (c) => c.id === selectedChannelId,
                    )?.name
                  }`}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border"
                  disabled={sendMessageMutation.isPending}
                />
                <button
                  type="submit"
                  disabled={
                    sendMessageMutation.isPending || !messageInput.trim()
                  }
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a channel to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
