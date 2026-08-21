import { useCallback, useState } from "react";
import * as uploadApi from "../../api/uploadApi";
import { ApiError } from "../../api/client";
import { getImageKey, getImageUrl } from "../utils/catalogImage";
import { toDescriptiveUploadFileName } from "../../utils/publicImageUrl";
import { slugify } from "../../utils/slugify";

export const useImageUpload = (folder) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [imageKey, setImageKey] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  const resetImage = useCallback((image) => {
    setImageKey(getImageKey(image));
    setPreviewUrl(getImageUrl(image));
    setError(null);
  }, []);

  const clearImage = useCallback(() => {
    setImageKey("");
    setPreviewUrl(null);
    setError(null);
  }, []);

  const uploadFile = useCallback(
    async (file, { slug } = {}) => {
      if (!file) return "";

      setUploading(true);
      setError(null);

      try {
        const { uploadUrl, key, publicUrl } = await uploadApi.getPresignedUrl({
          folder,
          fileName: toDescriptiveUploadFileName(file.name, {
            slug: slugify(slug) || "product",
          }),
          contentType: file.type,
        });

        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!uploadResponse.ok) {
          throw new ApiError("Image upload failed. Please try again.", 400);
        }

        setImageKey(key);
        setPreviewUrl(publicUrl);
        return key;
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : "Failed to upload image. Please try again.";
        setError(message);
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [folder],
  );

  return {
    imageKey,
    previewUrl,
    uploading,
    error,
    setError,
    uploadFile,
    resetImage,
    clearImage,
  };
};
