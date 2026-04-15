import { useState } from "react";
import { getCloudinarySignature } from "@/lib/actions/upload.actions";
import { IMAGE_MAX_SIZE, ACCEPTED_IMAGE_MIME_TYPES, MAX_FILE_SIZE_5MB } from "@/lib/constants/file-size";

export interface CloudinaryUploadResult {
  url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  secure_url: string;
}

interface UseCloudinaryUploadReturn {
  uploadFile: (file: File) => Promise<CloudinaryUploadResult | null>;
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export function useCloudinaryUpload(): UseCloudinaryUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<CloudinaryUploadResult | null> => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      // 1. Client-Side Validation (Do Not Trust the Client, but save them time!)
      if (!ACCEPTED_IMAGE_MIME_TYPES.includes(file.type)) {
        throw new Error("Invalid file type. Only JPEG, PNG, and WEBP are allowed.");
      }

      if (file.size > IMAGE_MAX_SIZE) {
        throw new Error(`File is too large. Max size is ${MAX_FILE_SIZE_5MB / (1024 * 1024)}MB.`);
      }

      // 2. Fetch the signature from your Server Action
      const signatureResponse = await getCloudinarySignature();

      if (!signatureResponse.success || !signatureResponse.signature || !signatureResponse.timestamp || !signatureResponse.uploadPreset || !signatureResponse.apiKey) {
        throw new Error(signatureResponse.error || "Failed to get upload signature from server.");
      }

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

      if (!cloudName) {
        throw new Error("Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in env");
      }

      // 3. Prepare FormData for Direct Upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signatureResponse.apiKey); // Retrieved securely via Action
      formData.append("timestamp", signatureResponse.timestamp.toString());
      formData.append("signature", signatureResponse.signature);
      formData.append("upload_preset", signatureResponse.uploadPreset);

      // 4. Use XMLHttpRequest to track upload progress (fetch doesn't support upload progress yet)
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percentage = Math.round((event.loaded * 100) / event.total);
            setProgress(percentage);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response as CloudinaryUploadResult);
            } catch (err) {
              reject(new Error("Failed to parse Cloudinary response."));
            }
          } else {
            let errorMessage = `Upload failed with status ${xhr.status}`;
            try {
              const errorResponse = JSON.parse(xhr.responseText);
              if (errorResponse.error && errorResponse.error.message) {
                errorMessage = `Cloudinary Error: ${errorResponse.error.message}`;
              }
            } catch (e) {
              // Fallback if response is not JSON
              errorMessage += `: ${xhr.responseText.substring(0, 100)}`;
            }
            reject(new Error(errorMessage));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Network error occurred during upload."));
        });

        xhr.addEventListener("abort", () => {
          reject(new Error("Upload aborted."));
        });

        xhr.open("POST", uploadUrl);
        // Note: Do not set 'Content-Type' with XHR when sending FormData, it sets the boundary automatically
        xhr.send(formData);
      });

      setProgress(100);
      return result;

    } catch (err: any) {
      console.error("Cloudinary upload hook error:", err);
      setError(err.message || "An unexpected error occurred during upload.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading, progress, error };
}
