'use client';

import { useState, useRef, useEffect } from 'react';
import { UserProfileDTO } from '@/lib/types/auth.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle, Upload, X, MapPin, Globe, Edit3, Save } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useCloudinaryUpload } from '@/lib/hooks/use-cloudinary-upload';
import { IMAGE_MAX_SIZE, ACCEPTED_IMAGE_MIME_TYPES } from '@/lib/constants/file-size';
import { useUpdateProfile } from '@/lib/hooks/use-auth';
import { toast } from 'sonner';

interface ProfileMatrixProps {
  initialData: UserProfileDTO;
}

export function ProfileMatrix({ initialData }: ProfileMatrixProps) {
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const [preview, setPreview] = useState<string | null>(initialData.avatarUrl || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading, progress } = useCloudinaryUpload();

  const [formData, setFormData] = useState({
    displayName: initialData.displayName || '',
    bio: initialData.bio || '',
    location: initialData.location || '',
    website: initialData.website || '',
    facebookUrl: initialData.facebookUrl || '',
    avatarUrl: initialData.avatarUrl || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_MIME_TYPES.includes(file.type)) {
      toast.error('Invalid file type. Only JPEG, PNG, and WEBP are allowed.');
      return;
    }
    if (file.size > IMAGE_MAX_SIZE) {
      toast.error(`File is too large. Max size is ${IMAGE_MAX_SIZE / (1024 * 1024)}MB.`);
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let currentAvatarUrl = formData.avatarUrl;

    if (selectedFile) {
      const result = await uploadFile(selectedFile);
      if (result) {
        currentAvatarUrl = result.secure_url;
      } else {
        toast.error('Failed to upload profile image.');
        return;
      }
    }

    updateProfile({ ...formData, avatarUrl: currentAvatarUrl }, {
      onSuccess: () => {
        toast.success('Profile updated successfully');
        setSelectedFile(null);
      },
      onError: (err) => {
        toast.error(err.message);
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="rounded-none sm:rounded-md border-white/5 glassmorphism bg-white/[0.01] shadow-xl relative overflow-hidden border-x-0 sm:border-x">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-50" />
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <UserCircle className="size-5 text-primary" />
            <span className="font-heading text-xl font-bold tracking-tight uppercase tracking-[0.1em]">Profile Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Profile Picture */}
          <div className="flex flex-col md:flex-row items-center gap-8 p-6 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="relative group shrink-0">
              <Avatar className="size-28 sm:size-32 border-4 border-white/10 shadow-glow-primary transition-transform group-hover:scale-105 duration-500">
                {preview ? (
                  <AvatarImage src={preview} alt="Profile avatar" />
                ) : (
                  <AvatarFallback className="bg-background">
                    <UserCircle className="size-full text-muted-foreground/20 p-4" />
                  </AvatarFallback>
                )}
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 rounded-full bg-primary p-2.5 text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-110 active:scale-95"
              >
                <Upload className="size-4" />
              </button>
              <input ref={fileInputRef} type="file" accept={ACCEPTED_IMAGE_MIME_TYPES.join(',')} onChange={handleFileSelect} className="hidden" />
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Profile Image</h3>
                <p className="text-xs text-muted-foreground">JPEG, PNG, or WEBP • Max 4MB</p>
              </div>
              {isUploading && (
                <div className="space-y-2 max-w-xs mx-auto md:mx-0">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                    <div className="h-full bg-primary shadow-glow-primary transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-[10px] font-bold text-primary animate-pulse">Uploading Image... {progress}%</p>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label htmlFor="displayName" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Display Name</Label>
                <Input id="displayName" name="displayName" value={formData.displayName} onChange={handleChange} placeholder="The name others see" className="h-12 bg-white/[0.02]" />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="location" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                  <Input id="location" name="location" value={formData.location} onChange={handleChange} placeholder="Cebu City, PH" className="h-12 bg-white/[0.02] pl-11" />
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="facebookUrl" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Facebook Identity</Label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 flex items-center justify-center text-muted-foreground/40">
                  <svg viewBox="0 0 24 24" className="size-full" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <Input id="facebookUrl" name="facebookUrl" type="url" value={formData.facebookUrl} onChange={handleChange} placeholder="https://facebook.com/yourprofile" className="h-12 bg-white/[0.02] pl-11" />
              </div>
              <p className="text-[9px] font-bold text-muted-foreground/30 ml-1 italic uppercase tracking-wider">Unique social link used for community verification</p>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="website" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Website</Label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                <Input id="website" name="website" type="url" value={formData.website} onChange={handleChange} placeholder="https://cosynq.space" className="h-12 bg-white/[0.02] pl-11" />
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center px-1">
                <Label htmlFor="bio" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">About me (Bio)</Label>
                <span className="text-[9px] font-bold text-muted-foreground/40">{formData.bio.length}/500</span>
              </div>
              <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={5} placeholder="Tell the community about yourself..." className="bg-white/[0.02] resize-none" maxLength={500} />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isPending || isUploading} className="rounded-sm sm:rounded-xl px-8 h-12 font-black uppercase tracking-widest text-xs gap-2" variant="celestial">
                {isPending ? <>Saving... <Save className="size-4 animate-pulse" /></> : <>Save Profile <Save className="size-4" /></>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
