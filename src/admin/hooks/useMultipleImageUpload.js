import { useCallback, useState } from "react";
import * as uploadApi from "../../api/uploadApi";
import { ApiError } from "../../api/client";
import { normalizeImages } from "../utils/catalogImage";
import { toDescriptiveUploadFileName } from "../../utils/publicImageUrl";
import { slugify } from "../../utils/slugify";

export const useMultipleImageUpload = (folder) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const resetImages = useCallback((apiImages) => {
    setImages(normalizeImages(apiImages));
    setError(null);
  }, []);

  const clearImages = useCallback(() => {
    setImages([]);
    setError(null);
  }, []);

  const uploadFile = useCallback(
    async (file, { slug, index } = {}) => {
      if (!file) return null;

      setUploading(true);
      setError(null);

      try {
        const { uploadUrl, key, publicUrl } = await uploadApi.getPresignedUrl({
          folder,
          fileName: toDescriptiveUploadFileName(file.name, {
            slug: slugify(slug) || "product",
            index,
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

        const uploaded = { key, url: publicUrl };
        setImages((prev) => [...prev, uploaded]);
        return uploaded;
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

  const uploadFiles = useCallback(
    async (files, { slug } = {}) => {
      const uploaded = [];
      const startIndex = images.length;
      for (const [offset, file] of files.entries()) {
        const result = await uploadFile(file, { slug, index: startIndex + offset });
        if (result) uploaded.push(result);
      }
      return uploaded;
    },
    [uploadFile, images.length],
  );

  const removeImage = useCallback((index) => {
    setImages((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  }, []);

  return {
    images,
    uploading,
    error,
    setError,
    uploadFile,
    uploadFiles,
    resetImages,
    clearImages,
    removeImage,
    imageKeys: images.map((image) => image.key).filter(Boolean),
  };
};
