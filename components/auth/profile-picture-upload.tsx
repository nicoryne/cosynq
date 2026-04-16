'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, X, Scissors } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { IMAGE_MAX_SIZE, ACCEPTED_IMAGE_MIME_TYPES } from '@/lib/constants/file-size';
import { ImageCropperDialog } from './image-cropper-dialog';

// =====================================================================
// Profile Picture Upload Component
// =====================================================================
// Handles optional avatar upload during sign-up with interactive cropping
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
  const [cropperSrc, setCropperSrc] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Sync preview with selectedFile if it exists (e.g. after full page reload or step back)
   */
  useEffect(() => {
    if (selectedFile && !preview) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  }, [selectedFile, preview]);

  /**
   * Cleanup cropper source to prevent memory leaks
   */
  useEffect(() => {
    return () => {
      if (cropperSrc) {
        URL.revokeObjectURL(cropperSrc);
      }
    };
  }, [cropperSrc]);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_IMAGE_MIME_TYPES.includes(file.type)) {
      return 'Invalid file type. Only JPEG, PNG, and WEBP are allowed.';
    }

    if (file.size > IMAGE_MAX_SIZE) {
      return `File is too large. Maximum size is ${IMAGE_MAX_SIZE / (1024 * 1024)}MB.`;
    }

    return null;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }

    // Intercept with Cropper Modal
    const objectUrl = URL.createObjectURL(file);
    setCropperSrc(objectUrl);
    setIsCropperOpen(true);
    
    // Clear input so selecting same file works again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropConfirm = (croppedFile: File) => {
    onFileSelect(croppedFile);

    // Create preview for display
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(croppedFile);
    
    setIsCropperOpen(false);
    setCropperSrc(null);
  };

  const handleRemove = () => {
    setPreview(null);
    onFileSelect(null);
  };

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

      {/* Image Cropper Modal */}
      <ImageCropperDialog
        imageSrc={cropperSrc}
        isOpen={isCropperOpen}
        onClose={() => {
          setIsCropperOpen(false);
          setCropperSrc(null);
        }}
        onConfirm={handleCropConfirm}
      />

      {/* Preview or upload area */}
      <div className="flex flex-col items-center gap-4">
        {preview ? (
          <div className="relative group/preview">
            <div className="relative size-32 overflow-hidden rounded-full border-2 border-primary/20 shadow-glow-primary/10 group-hover/preview:shadow-glow-primary/30 transition-shadow">
              <Image
                src={preview}
                alt="Profile picture preview"
                fill
                className="object-cover"
              />
              <div 
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity cursor-pointer"
                onClick={handleSelectClick}
              >
                <Scissors className="size-6 text-white" />
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -right-2 -top-2 rounded-full bg-destructive/90 p-1.5 text-destructive-foreground shadow-md hover:bg-destructive transition-transform hover:scale-110 active:scale-95 z-20"
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
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary animate-in fade-in slide-in-from-bottom-2">
              Aura Synchronized
            </p>
          ) : (
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
              Orbital Vacancy
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
              className="rounded-full px-6 border-white/5 hover:bg-white/5 uppercase font-bold tracking-widest text-[10px]"
            >
              Re-sculpt
            </Button>
          ) : (
            <Button
              type="button"
              variant="celestial"
              size="sm"
              onClick={handleSelectClick}
              className="rounded-full px-8 shadow-glow-primary uppercase font-black tracking-widest text-[10px]"
            >
              Begin Sculpting
            </Button>
          )}
        </div>

        <p className="text-center text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 italic">
          JPEG, PNG, or WEBP • Max {IMAGE_MAX_SIZE / (1024 * 1024)}MB
        </p>
      </div>
    </div>
  );
}
