import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UPDATE_USER, UPLOAD_AVATAR } from "@/queries/user";
import { UpdateUserMutation } from "@/gql/graphql";
import { X, Camera, Loader2 } from "lucide-react";

import { print } from "graphql";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    username: string;
    displayName: string;
    avatar: string;
  };
}

interface ProfileFormData {
  username: string;
  displayName: string;
  avatar: string;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [previewImage, setPreviewImage] = useState<string>(currentUser.avatar);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormData>({
    defaultValues: {
      username: currentUser.username,
      displayName: currentUser.displayName,
      avatar: currentUser.avatar,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        username: currentUser.username,
        displayName: currentUser.displayName,
        avatar: currentUser.avatar,
      });
      setPreviewImage(currentUser.avatar);
      setError(null);
    }
  }, [isOpen, currentUser, reset]);

  const getClient = () => {
    if (!session?.backendToken) return null;
    return new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_API_URL!, {
      headers: { Authorization: `Bearer ${session.backendToken}` },
    });
  };

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!session?.backendToken) throw new Error("Not authenticated");

      const formData = new FormData();
      const operations = {
        query: print(UPLOAD_AVATAR),
        variables: {
          file: null,
        },
      };
      formData.append("operations", JSON.stringify(operations));
      formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
      formData.append("0", file);

      const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_API_URL!, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.backendToken}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      return result.data.uploadAvatar;
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const client = getClient();
      if (!client) throw new Error("Not authenticated");
      return client.request(UPDATE_USER, { input: data });
    },
    onSuccess: async (data: UpdateUserMutation) => {
      const newUsername = data.updateUser.username;

      queryClient.invalidateQueries({
        queryKey: ["publicUser", currentUser.username],
      });
      queryClient.invalidateQueries({ queryKey: ["me"] });

      onClose();

      if (newUsername !== currentUser.username) {
        router.push(`/u/${newUsername}`);
      } else {
        router.refresh();
      }
    },
    onError: (err: Error) => {
      setError(err.message || "Failed to update profile");
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("File must be an image");
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);

      const url = await uploadAvatarMutation.mutateAsync(file);
      setValue("avatar", url);
    } catch (err) {
      setError((err as Error).message || "Failed to upload image");
      setPreviewImage(currentUser.avatar);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (data: ProfileFormData) => {
    updateUserMutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                <Image
                  src={previewImage}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                  width={96}
                  height={96}
                />
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
              >
                <Camera className="w-8 h-8 text-white" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={uploading || isSubmitting}
              />
            </div>
            {uploading && (
              <p className="text-sm text-blue-600 mt-2">Uploading...</p>
            )}
          </div>

          {}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            <input
              type="text"
              {...register("displayName", {
                required: "Display name is required",
                pattern: {
                  value: /^[a-zA-Z0-9 ]+$/,
                  message: "Only letters, numbers, and spaces allowed",
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.displayName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.displayName.message}
              </p>
            )}
          </div>

          {}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden">
              <span className="pl-3 text-gray-500 bg-gray-50 h-full flex items-center border-r px-2">
                u/
              </span>
              <input
                type="text"
                {...register("username", {
                  required: "Username is required",
                  pattern: {
                    value: /^[a-zA-Z0-9_.-]+$/,
                    message:
                      "Only letters, numbers, underscores, dots, and hyphens allowed",
                  },
                })}
                className="w-full px-3 py-2 focus:outline-none"
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">
                {errors.username.message}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Changing username will change your profile URL.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isSubmitting || uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || uploading}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {(isSubmitting || uploading) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
