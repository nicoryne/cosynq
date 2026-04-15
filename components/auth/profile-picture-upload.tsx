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
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  className?: string;
}

export function ProfilePictureUpload({
  onFileSelect,
  selectedFile,
  className,
}: ProfilePictureUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    onFileSelect(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Handles removing/replacing the selected image
   * Requirements: 17.12
   */
  const handleRemove = () => {
    setPreview(null);
    onFileSelect(null);
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
            <div className="relative size-32 overflow-hidden rounded-full border-2 border-border shadow-glow-primary/20">
              <Image
                src={preview}
                alt="Profile picture preview"
                fill
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -right-2 -top-2 rounded-full bg-destructive p-1.5 text-destructive-foreground shadow-md hover:bg-destructive/90 transition-transform hover:scale-110 active:scale-95"
              aria-label="Remove profile picture"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSelectClick}
            className="flex size-32 items-center justify-center rounded-full border-2 border-dashed border-primary/20 bg-primary/5 transition-all hover:bg-primary/10 hover:border-primary/40 group relative overflow-hidden"
            aria-label="Select profile picture"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Upload className="size-8 text-primary/60 group-hover:text-primary transition-colors" />
          </button>
        )}

        {/* Status indicator */}
        <div className="text-center space-y-1">
          {selectedFile ? (
            <p className="text-xs md:text-sm font-black uppercase tracking-widest text-primary animate-in fade-in slide-in-from-bottom-2">
              Image Selected
            </p>
          ) : (
            <p className="text-xs md:text-sm font-black uppercase tracking-widest text-muted-foreground/60">
              No image selected
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          {preview ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSelectClick}
              className="rounded-full px-6"
            >
              Change
            </Button>
          ) : (
            <Button
              type="button"
              variant="celestial"
              size="sm"
              onClick={handleSelectClick}
              className="rounded-full px-8 shadow-glow-primary"
            >
              Select Image
            </Button>
          )}
        </div>

        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 italic">
          JPEG, PNG, or WEBP • Max {IMAGE_MAX_SIZE / (1024 * 1024)}MB
        </p>
      </div>
    </div>
  );
}
