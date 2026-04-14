'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCloudinaryUpload } from '@/lib/hooks/use-cloudinary-upload';
import { IMAGE_MAX_SIZE, ACCEPTED_IMAGE_MIME_TYPES } from '@/lib/constants/file-size';

// =====================================================================
// Profile Picture Upload Component
// =====================================================================
// Handles optional avatar upload during sign-up using Cloudinary
// Requirements: 17.2, 17.3, 17.4, 17.5, 17.6, 17.7, 17.8, 17.9, 17.10, 17.11, 17.12, 17.13, 17.14

interface ProfilePictureUploadProps {
  onUploadComplete: (url: string, publicId: string) => void;
  className?: string;
}

export function ProfilePictureUpload({
  onUploadComplete,
  className,
}: ProfilePictureUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadFile, isUploading, progress, error } = useCloudinaryUpload();

  /**
   * Validates file type and size
   * Requirements: 17.4, 17.5
   */
  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_IMAGE_MIME_TYPES.includes(file.type)) {
      return 'Invalid file type. Only JPEG, PNG, and WEBP are allowed.';
    }

    if (file.size > IMAGE_MAX_SIZE) {
      return `File is too large. Maximum size is ${IMAGE_MAX_SIZE / (1024 * 1024)}MB.`;
    }

    return null;
  };

  /**
   * Handles file selection and preview
   * Requirements: 17.6, 17.7
   */
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Handles file upload to Cloudinary
   * Requirements: 17.8, 17.9, 17.10
   */
  const handleUpload = async () => {
    if (!selectedFile) return;

    const result = await uploadFile(selectedFile);

    if (result) {
      onUploadComplete(result.secure_url, result.public_id);
    }
  };

  /**
   * Handles removing/replacing the selected image
   * Requirements: 17.12
   */
  const handleRemove = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Triggers file input click
   */
  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_IMAGE_MIME_TYPES.join(',')}
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Select profile picture"
      />

      {/* Preview or upload area */}
      <div className="flex flex-col items-center gap-4">
        {preview ? (
          <div className="relative">
            <div className="relative size-32 overflow-hidden rounded-full border-2 border-border">
              <Image
                src={preview}
                alt="Profile picture preview"
                fill
                className="object-cover"
              />
            </div>
            {!isUploading && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -right-2 -top-2 rounded-full bg-destructive p-1.5 text-destructive-foreground shadow-md hover:bg-destructive/90"
                aria-label="Remove profile picture"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSelectClick}
            className="flex size-32 items-center justify-center rounded-full border-2 border-dashed border-border bg-muted/50 transition-colors hover:bg-muted"
            aria-label="Select profile picture"
          >
            <Upload className="size-8 text-muted-foreground" />
          </button>
        )}

        {/* Progress bar during upload */}
        {isUploading && (
          <div className="w-full max-w-xs space-y-2">
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Upload progress"
              />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Uploading... {progress}%
            </p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          {preview && !isUploading && (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSelectClick}
              >
                Change
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload'
                )}
              </Button>
            </>
          )}
          {!preview && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSelectClick}
            >
              Select Image
            </Button>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          JPEG, PNG, or WEBP • Max {IMAGE_MAX_SIZE / (1024 * 1024)}MB
        </p>
      </div>
    </div>
  );
}
