"use client";

import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import remarkBreaks from "remark-breaks";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { UPLOAD_IMAGE_MUTATION } from "@/gql/admin";
import { UPLOAD_USER_IMAGE_MUTATION } from "@/queries/community";
import { useRouter } from "next/navigation";
import { print } from "graphql";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: number;
  placeholder?: string;
  preview?: "live" | "edit" | "preview";
  uploadMutation?: any;
}

export default function Editor({
  value,
  onChange,
  height = 400,
  preview = "live",
  uploadMutation = UPLOAD_USER_IMAGE_MUTATION,
}: EditorProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!session?.backendToken) {
        
        throw new Error("Not authenticated");
      }

      const formData = new FormData();
      const query =
        typeof uploadMutation === "string"
          ? uploadMutation
          : print(uploadMutation);
      const operations = {
        query,
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
      
      return result.data.uploadImage || result.data.uploadUserImage;
    },
  });

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

  const onPaste = async (event: React.ClipboardEvent<HTMLDivElement>) => {
    const items = event.clipboardData.items;
    for (const item of items) {
      if (item.kind === "file" && item.type.startsWith("image/")) {
        event.preventDefault();
        const file = item.getAsFile();
        if (file) {
          const url = await handleImageUpload(file);
          if (url) {
            const imageMarkdown = `![image](${url})`;
            onChange(value + "\n" + imageMarkdown);
          }
        }
      }
    }
  };

  return (
    <div data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || "")}
        height={height}
        preview={preview}
        previewOptions={{
          remarkPlugins: [remarkBreaks],
        }}
        onPaste={onPaste}
        commands={[
          {
            name: "upload-image",
            keyCommand: "upload-image",
            buttonProps: { "aria-label": "Upload Image" },
            icon: (
              <svg width="12" height="12" viewBox="0 0 20 20">
                <path
                  fill="currentColor"
                  d="M15 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13l-6-5-2 2-4-5-4 8V4h16v11z"
                />
              </svg>
            ),
            execute: () => {
              document.getElementById("editor-image-upload")?.click();
            },
          },
        ]}
      />
      <input
        type="file"
        id="editor-image-upload"
        accept="image/*"
        style={{ display: "none" }}
        onChange={async (e) => {
          if (e.target.files?.[0]) {
            const url = await handleImageUpload(e.target.files[0]);
            if (url) {
              const imageMarkdown = `![image](${url})`;
              onChange(value + "\n" + imageMarkdown);
            }
          }
          e.target.value = "";
        }}
      />
    </div>
  );
}
