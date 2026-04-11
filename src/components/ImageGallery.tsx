import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Shuffle, Wand2, Share2, Heart, X } from 'lucide-react';
import { useAppStore, type GeneratedImage } from '@/lib/store';

export function ImageGallery() {
  const { generatedImages, favorites, toggleFavorite } = useAppStore();
  const [selected, setSelected] = useState<GeneratedImage | null>(null);

  if (generatedImages.length === 0) return null;

  return (
    <>
      <div className="space-y-3">
        <h3 className="font-display text-xs font-semibold tracking-wider uppercase text-muted-foreground">
          Your Scenes
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {generatedImages.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelected(img)}
              className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
            >
              <img
                src={img.url}
                alt={img.prompt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(img.id);
                }}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-background/60 backdrop-blur-sm"
              >
                <Heart
                  className={`h-3.5 w-3.5 ${
                    favorites.includes(img.id) ? 'fill-neon-pink text-neon-pink' : 'text-foreground'
                  }`}
                />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl flex flex-col"
          >
            <div className="flex justify-end p-4">
              <button onClick={() => setSelected(null)} className="p-2 text-muted-foreground">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center p-4">
              <img
                src={selected.url}
                alt={selected.prompt}
                className="max-w-full max-h-full rounded-2xl object-contain"
              />
            </div>
            <div className="flex justify-center gap-4 p-6">
              {[
                { icon: Download, label: 'Save' },
                { icon: Shuffle, label: 'Remix' },
                { icon: Wand2, label: 'Refine' },
                { icon: Share2, label: 'Share' },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  className="flex flex-col items-center gap-1 text-muted-foreground"
                >
                  <div className="rounded-full bg-surface-elevated p-3 border-glow">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px]">{label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
