"use client";

import React, { useState } from "react";
import Image from "next/image";
import { GraphQLClient } from "graphql-request";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import {
  GET_ARTICLES_QUERY,
  CREATE_ARTICLE_MUTATION,
  UPDATE_ARTICLE_MUTATION,
  DELETE_ARTICLE_MUTATION,
  UPLOAD_IMAGE_MUTATION,
} from "@/gql/admin";
import { useSession } from "next-auth/react";

import { useRouter } from "next/navigation";
import Editor from "@/components/Editor";
import { CategorySelect } from "@/components/CategorySelect";

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  thumbnail: string;
  featured: boolean;
  author: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ArticleFormData {
  title: string;
  content: string;
  category: string;
  thumbnail: string;
  featured: boolean;
}

export default function ArticlesPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ArticleFormData>({
    defaultValues: {
      title: "",
      content: "",
      category: "",
      thumbnail: "",
      featured: false,
    },
  });

  const thumbnail = watch("thumbnail");

  const getClient = () => {
    if (!session?.backendToken) {
      
      return null;
    }
    return new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_API_URL!, {
      headers: { Authorization: `Bearer ${session.backendToken}` },
    });
  };

  
  const { data: articlesData, isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const client = getClient();
      if (!client) return { articles: [] };
      return client.request<{ articles: Article[] }>(GET_ARTICLES_QUERY);
    },
    enabled: !!session?.backendToken,
  });

  const articles = articlesData?.articles || [];

  
  const createMutation = useMutation({
    mutationFn: async (data: ArticleFormData) => {
      const client = getClient();
      if (!client) throw new Error("Not authenticated");
      return client.request(CREATE_ARTICLE_MUTATION, { input: data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      reset();
      setIsEditing(false);
      setIsFormVisible(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ArticleFormData) => {
      const client = getClient();
      if (!client) throw new Error("Not authenticated");
      if (!editingId) throw new Error("No article selected for update");
      return client.request(UPDATE_ARTICLE_MUTATION, {
        input: { id: editingId, ...data },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      reset();
      setIsEditing(false);
      setEditingId(null);
      setIsFormVisible(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const client = getClient();
      if (!client) throw new Error("Not authenticated");
      return client.request(DELETE_ARTICLE_MUTATION, { id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!session?.backendToken) {
        router.push("/admin/login");
        throw new Error("Not authenticated");
      }

      const formData = new FormData();
      const operations = {
        query: UPLOAD_IMAGE_MUTATION,
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
      return result.data.uploadImage;
    },
  });

  const onSubmit = (data: ArticleFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (article: Article) => {
    setIsEditing(true);
    setEditingId(article.id);
    setIsFormVisible(true);
    reset({
      title: article.title,
      content: article.content,
      category: article.category,
      thumbnail: article.thumbnail,
      featured: article.featured,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const url = await uploadImageMutation.mutateAsync(file);
      return url;
    } catch (error) {
      console.error("Failed to upload image", error);
      alert("Failed to upload image");
      return "";
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Article Management</h1>
        {!isFormVisible && (
          <button
            onClick={() => {
              setIsEditing(false);
              setEditingId(null);
              reset({
                title: "",
                content: "",
                category: "",
                thumbnail: "",
                featured: false,
              });
              setIsFormVisible(true);
            }}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Create New Article
          </button>
        )}
      </div>

      {}
      {isFormVisible && (
        <div className="mb-8 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">
            {isEditing ? "Edit Article" : "Add New Article"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  {...register("title", { required: true })}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Category is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <CategorySelect
                      value={field.value}
                      onChange={field.onChange}
                      error={error?.message}
                    />
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Thumbnail
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      if (e.target.files?.[0]) {
                        const url = await handleImageUpload(e.target.files[0]);
                        if (url) {
                          setValue("thumbnail", url, { shouldValidate: true });
                        }
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <input
                    type="hidden"
                    {...register("thumbnail", {
                      required: "Thumbnail is required",
                    })}
                  />
                  {thumbnail && (
                    <Image
                      src={thumbnail}
                      alt="Thumbnail"
                      className="h-12 w-12 rounded object-cover"
                      width={48}
                      height={48}
                    />
                  )}
                  {uploadImageMutation.isPending && (
                    <span className="text-sm text-gray-500">Uploading...</span>
                  )}
                </div>
                {errors.thumbnail && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.thumbnail.message}
                  </p>
                )}
              </div>
              <div className="flex items-center">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register("featured")}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Featured Article
                  </span>
                </label>
              </div>
            </div>

            <div data-color-mode="light">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <Editor
                    value={field.value}
                    onChange={(val) => field.onChange(val)}
                    height={400}
                    uploadMutation={UPLOAD_IMAGE_MUTATION}
                  />
                )}
              />
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={isSubmitting || uploadImageMutation.isPending}
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-400"
              >
                {isEditing ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditingId(null);
                  setIsFormVisible(false);
                  reset({
                    title: "",
                    content: "",
                    category: "",
                    thumbnail: "",
                    featured: false,
                  });
                }}
                className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {}
      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Title
              </th>
              <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Category
              </th>
              <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Featured
              </th>
              <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Author
              </th>
              <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Created At
              </th>
              <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id}>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                  <div className="flex items-center">
                    {article.thumbnail && (
                      <Image
                        src={article.thumbnail}
                        alt=""
                        className="mr-3 h-8 w-8 rounded object-cover"
                        width={32}
                        height={32}
                      />
                    )}
                    <p className="whitespace-no-wrap text-gray-900">
                      {article.title}
                    </p>
                  </div>
                </td>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                  <span className="inline-block rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700">
                    {article.category}
                  </span>
                </td>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                  {article.featured ? (
                    <span className="text-green-600 font-bold">Yes</span>
                  ) : (
                    <span className="text-gray-500">No</span>
                  )}
                </td>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                  <p className="whitespace-no-wrap text-gray-900">
                    {article.author?.name || "Unknown"}
                  </p>
                </td>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                  <p className="whitespace-no-wrap text-gray-900">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </p>
                </td>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                  <button
                    onClick={() => handleEdit(article)}
                    className="mr-3 text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
