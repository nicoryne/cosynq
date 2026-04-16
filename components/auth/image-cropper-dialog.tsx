'use client';

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Area, Point } from 'react-easy-crop';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { getCroppedImg } from '@/lib/utils/image-crop.utils';
import { Loader2, ZoomIn, Scissors } from 'lucide-react';

interface ImageCropperDialogProps {
  imageSrc: string | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (croppedFile: File) => void;
}

/**
 * ImageCropperDialog
 * A celestial-themed dialog for cropping profile pictures with a circular template.
 */
export function ImageCropperDialog({
  imageSrc,
  isOpen,
  onClose,
  onConfirm,
}: ImageCropperDialogProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((_area: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      setIsProcessing(true);
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedFile) {
        onConfirm(croppedFile);
        onClose();
      }
    } catch (error) {
      console.error('Error cropping image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!imageSrc) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl glassmorphism border-white/10 p-0 overflow-hidden gap-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="font-heading text-2xl font-black tracking-tighter flex items-center gap-2">
            <Scissors className="size-5 text-primary" />
            Sculpt your <span className="text-primary italic">Aura</span>
          </DialogTitle>
        </DialogHeader>

        <div className="relative w-full aspect-square bg-background/40">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            classes={{
              containerClassName: "bg-background/20",
              cropAreaClassName: "border-2 border-primary/50 shadow-[0_0_20px_rgba(var(--primary),0.3)]",
            }}
          />
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                <ZoomIn className="size-3" />
                Dilation Level
              </span>
              <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {Math.round(zoom * 100)}%
              </span>
            </div>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={([v]) => setZoom(v)}
              className="py-4"
            />
          </div>

          <DialogFooter className="flex-row gap-3 pt-4 border-t border-white/5">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 rounded-full border border-white/5 hover:bg-white/5 font-bold uppercase tracking-widest text-[10px]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isProcessing}
              className="flex-1 rounded-full font-black uppercase tracking-widest text-[11px] shadow-glow-primary h-12"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Finalize Orbit'
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
