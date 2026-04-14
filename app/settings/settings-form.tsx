'use client';

import { useState, useRef } from 'react';
import { useUpdateProfile } from '@/lib/hooks/use-auth';
import { UserProfileDTO } from '@/lib/types/auth.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';
import { Loader2, AlertCircle, Sparkles, UserCircle, Upload, X, Palette } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useCloudinaryUpload } from '@/lib/hooks/use-cloudinary-upload';
import { IMAGE_MAX_SIZE, ACCEPTED_IMAGE_MIME_TYPES } from '@/lib/constants/file-size';
import Image from 'next/image';

interface SettingsFormProps {
  initialData: UserProfileDTO;
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(initialData.avatarUrl || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading, progress, error: uploadError } = useCloudinaryUpload();

  const [formData, setFormData] = useState({
    displayName: initialData.displayName || '',
    bio: initialData.bio || '',
    location: initialData.location || '',
    website: initialData.website || '',
    avatarUrl: initialData.avatarUrl || '',
    avatarPublicId: '', // Not stored in DTO, will be set on upload
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);

    // Upload avatar if a new file is selected
    if (selectedFile) {
      const result = await uploadFile(selectedFile);
      if (result) {
        formData.avatarUrl = result.secure_url;
        formData.avatarPublicId = result.public_id;
      } else {
        setError('Failed to upload avatar. Please try again.');
        return;
      }
    }

    updateProfile(formData, {
      onSuccess: () => {
        setSuccess(true);
        setSelectedFile(null);
        setTimeout(() => setSuccess(false), 3000);
      },
      onError: (err) => {
        setError(err.message);
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
      setError(validationError);
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setPreview(null);
    setSelectedFile(null);
    setFormData((prev) => ({ ...prev, avatarUrl: '', avatarPublicId: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Success/Error Alerts */}
      {success && (
        <Alert className="rounded-2xl bg-primary/10 border-primary/30 p-6 text-primary shadow-glow-primary animate-in fade-in zoom-in duration-500 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-full bg-primary/5 blur-2xl transform rotate-12 -mr-16" />
          <Sparkles className="size-6 text-primary shrink-0 z-10" />
          <div className="ml-4 z-10">
            <AlertTitle className="text-xs font-black uppercase tracking-[0.3em] mb-1">Link Established</AlertTitle>
            <AlertDescription className="text-sm font-bold italic opacity-90">
              Profile star-linked! Your manifest is live across the sector.
            </AlertDescription>
          </div>
        </Alert>
      )}

      {(error || uploadError) && (
        <Alert variant="destructive" className="rounded-2xl bg-destructive/10 border-destructive/30 p-6 text-destructive animate-in fade-in zoom-in duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-full bg-destructive/5 blur-2xl transform rotate-12 -mr-16" />
          <AlertCircle className="size-6 shrink-0 z-10" />
          <div className="ml-4 z-10">
            <AlertTitle className="text-xs font-black uppercase tracking-[0.3em] mb-1">Transmission Error</AlertTitle>
            <AlertDescription className="text-sm font-bold italic opacity-90">
              {error || uploadError}
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Profile Section */}
      <Card className="rounded-[2rem] border-none glassmorphism shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <UserCircle className="size-6 text-primary" />
            <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight">
              Profile <span className="text-primary italic">Identity</span>
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Avatar Upload */}
          <div className="space-y-4">
            <Label className="ml-1">Avatar Projection</Label>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_IMAGE_MIME_TYPES.join(',')}
                onChange={handleFileSelect}
                className="hidden"
                aria-label="Select profile picture"
              />
              
              <div className="relative group">
                <Avatar className="size-32 border-4 border-white/10 shadow-glow-primary transition-transform group-hover:scale-105 duration-500">
                  {preview ? (
                    <AvatarImage src={preview} alt="Profile avatar" />
                  ) : (
                    <AvatarFallback className="bg-background">
                      <UserCircle className="size-full text-muted-foreground/20 p-4" />
                    </AvatarFallback>
                  )}
                </Avatar>
                {preview && !isUploading && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="absolute -right-2 -top-2 rounded-full bg-destructive p-2 text-destructive-foreground shadow-md hover:bg-destructive/90 transition-all"
                    aria-label="Remove avatar"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              <div className="flex-1 space-y-4">
                {isUploading && (
                  <div className="space-y-2">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${progress}%` }}
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">Uploading... {progress}%</p>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="size-4 mr-2" />
                    {preview ? 'Change' : 'Upload'}
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  JPEG, PNG, or WEBP • Max {IMAGE_MAX_SIZE / (1024 * 1024)}MB
                </p>
              </div>
            </div>
          </div>

          {/* Username Display (Read-only) */}
          <div className="space-y-3">
            <Label htmlFor="username" className="ml-1">Galactic Handle</Label>
            <Input
              id="username"
              type="text"
              value={`@${initialData.username}`}
              disabled
              className="h-14 text-base opacity-60 cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground/60 ml-1">
              Your galactic handle is permanent and cannot be changed.
            </p>
          </div>

          {/* Display Name & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="displayName" className="ml-1">Display Alias</Label>
              <Input
                id="displayName"
                name="displayName"
                type="text"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="How the quadrant sees you"
                maxLength={50}
                className="h-14 text-base"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="location" className="ml-1">Galactic Sector</Label>
              <Input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="E.g. Cebu City, PH"
                maxLength={100}
                className="h-14 text-base"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-3">
            <Label htmlFor="bio" className="ml-1">The Chronicle (Bio)</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={6}
              placeholder="Narrate your trajectory through the stars..."
              maxLength={500}
              className="text-base"
            />
            <p className="text-xs text-muted-foreground/60 text-right mr-1">
              {formData.bio.length} / 500 characters
            </p>
          </div>

          {/* Website */}
          <div className="space-y-3">
            <Label htmlFor="website" className="ml-1">Transmission Frequency (Website)</Label>
            <Input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://nexus-hub.space"
              className="h-14 text-base"
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance Section */}
      <Card className="rounded-[2rem] border-none glassmorphism shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-accent" />
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Palette className="size-6 text-secondary" />
            <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight">
              Visual <span className="text-secondary italic">Spectrum</span>
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-6 rounded-xl bg-background/30 border border-white/5">
            <div className="space-y-1">
              <Label className="ml-0 text-sm">Theme Mode</Label>
              <p className="text-xs text-muted-foreground">
                Toggle between light, dark, and system themes
              </p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={isPending || isUploading}
          className="min-w-[240px] h-14 rounded-[1.5rem] font-black tracking-[0.2em] uppercase"
          variant="celestial"
          size="lg"
        >
          {isPending || isUploading ? (
            <>
              <Loader2 className="mr-3 size-5 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              Sync Manifest
              <Sparkles className="ml-3 size-5" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
