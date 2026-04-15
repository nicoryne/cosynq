'use client';

import dynamic from 'next/dynamic';

// Lazy load profile picture upload component
const ProfilePictureUpload = dynamic(() => import('./profile-picture-upload').then(mod => ({ default: mod.ProfilePictureUpload })), {
  loading: () => <div className="h-32 w-32 rounded-full bg-muted animate-pulse" />,
  ssr: false,
});

export interface Step4VisualProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  errors: {
    avatarUrl?: string;
    avatarPublicId?: string;
  };
}

export function SignUpStepVisual({
  onFileSelect,
  selectedFile,
  errors,
}: Step4VisualProps) {
  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 text-center">
      <div className="space-y-2">
        <h2 className="font-heading text-2xl md:text-3xl font-black tracking-tight leading-tight">Finalize <span className="text-primary italic">Aura</span></h2>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          Select a profile picture to complete your visual orbit. (Optional)
        </p>
      </div>

      <ProfilePictureUpload onFileSelect={onFileSelect} selectedFile={selectedFile} />
      
      {(errors.avatarUrl || errors.avatarPublicId) && (
        <p className="text-[10px] font-black uppercase tracking-widest text-destructive animate-in fade-in slide-in-from-top-2">
          {errors.avatarUrl || errors.avatarPublicId}
        </p>
      )}
    </div>
  );
}
