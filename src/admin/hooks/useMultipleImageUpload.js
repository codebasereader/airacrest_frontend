import { useCallback, useState } from "react";
import * as uploadApi from "../../api/uploadApi";
import { ApiError } from "../../api/client";
import { normalizeImages } from "../utils/catalogImage";

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
    async (file) => {
      if (!file) return null;

      setUploading(true);
      setError(null);

      try {
        const { uploadUrl, key, publicUrl } = await uploadApi.getPresignedUrl({
          folder,
          fileName: file.name,
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
    async (files) => {
      const uploaded = [];
      for (const file of files) {
        const result = await uploadFile(file);
        if (result) uploaded.push(result);
      }
      return uploaded;
    },
    [uploadFile],
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
