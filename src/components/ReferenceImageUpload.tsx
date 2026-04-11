import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImagePlus, X, Eye, Palette } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export function ReferenceImageUpload() {
  const { referenceImages, addReferenceImage, removeReferenceImage } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadType, setUploadType] = useState<'style' | 'subject'>('style');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      if (file.size > 10 * 1024 * 1024) return; // 10MB limit

      const reader = new FileReader();
      reader.onload = () => {
        addReferenceImage({
          id: crypto.randomUUID(),
          dataUrl: reader.result as string,
          type: uploadType,
          name: file.name,
        });
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const styleImages = referenceImages.filter((img) => img.type === 'style');
  const subjectImages = referenceImages.filter((img) => img.type === 'subject');

  return (
    <div className="space-y-4">
      {/* Type Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setUploadType('style')}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-medium transition-all ${
            uploadType === 'style'
              ? 'gradient-primary text-primary-foreground glow-purple'
              : 'bg-surface-elevated text-muted-foreground border-glow'
          }`}
        >
          <Palette className="h-3.5 w-3.5" />
          Style Reference
        </button>
        <button
          onClick={() => setUploadType('subject')}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-medium transition-all ${
            uploadType === 'subject'
              ? 'gradient-primary text-primary-foreground glow-purple'
              : 'bg-surface-elevated text-muted-foreground border-glow'
          }`}
        >
          <Eye className="h-3.5 w-3.5" />
          Subject Reference
        </button>
      </div>

      {/* Upload Area */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => fileInputRef.current?.click()}
        className="w-full rounded-2xl border-2 border-dashed border-muted-foreground/30 bg-surface/50 p-6 flex flex-col items-center gap-2 transition-colors hover:border-primary/50"
      >
        <ImagePlus className="h-8 w-8 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">
          Upload {uploadType === 'style' ? 'style' : 'subject'} reference
        </span>
        <span className="text-[10px] text-muted-foreground/60">JPG, PNG up to 10MB</span>
      </motion.button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Style References */}
      {styleImages.length > 0 && (
        <div>
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Style References
          </p>
          <div className="flex gap-2 flex-wrap">
            <AnimatePresence>
              {styleImages.map((img) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative h-16 w-16 rounded-xl overflow-hidden border-glow"
                >
                  <img src={img.dataUrl} alt={img.name} className="h-full w-full object-cover" />
                  <button
                    onClick={() => removeReferenceImage(img.id)}
                    className="absolute top-0.5 right-0.5 rounded-full bg-background/80 p-0.5"
                  >
                    <X className="h-3 w-3 text-foreground" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-neon-purple/80 px-1 py-0.5">
                    <Palette className="h-2 w-2 text-primary-foreground mx-auto" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Subject References */}
      {subjectImages.length > 0 && (
        <div>
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Subject References
          </p>
          <div className="flex gap-2 flex-wrap">
            <AnimatePresence>
              {subjectImages.map((img) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative h-16 w-16 rounded-xl overflow-hidden border-glow"
                >
                  <img src={img.dataUrl} alt={img.name} className="h-full w-full object-cover" />
                  <button
                    onClick={() => removeReferenceImage(img.id)}
                    className="absolute top-0.5 right-0.5 rounded-full bg-background/80 p-0.5"
                  >
                    <X className="h-3 w-3 text-foreground" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-neon-blue/80 px-1 py-0.5">
                    <Eye className="h-2 w-2 text-primary-foreground mx-auto" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
