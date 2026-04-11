import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, X, Heart, Download, Share2, Filter } from 'lucide-react';
import { useAppStore, type CreationMode, type GeneratedImage } from '@/lib/store';

const MODE_FILTERS: { value: CreationMode | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'cinematic', label: 'Cinematic' },
  { value: 'camera', label: 'Camera' },
  { value: 'animation', label: 'Animation' },
  { value: 'coverart', label: 'Cover Art' },
];

export const Route = createFileRoute('/gallery')({
  head: () => ({
    meta: [
      { title: 'Gallery — SceneIt' },
      { name: 'description', content: 'Browse your generated scenes and creations.' },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { generatedImages, favorites, toggleFavorite } = useAppStore();
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState<CreationMode | 'all'>('all');
  const [selected, setSelected] = useState<GeneratedImage | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const filtered = generatedImages.filter((img) => {
    if (modeFilter !== 'all' && img.mode !== modeFilter) return false;
    if (showFavoritesOnly && !favorites.includes(img.id)) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        img.prompt.toLowerCase().includes(q) ||
        img.subject.toLowerCase().includes(q) ||
        img.location.toLowerCase().includes(q) ||
        img.mood.toLowerCase().includes(q) ||
        img.outfit.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen px-5 py-6 pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-3 mb-5"
      >
        <Link to="/">
          <div className="rounded-xl bg-surface-elevated border-glow p-2">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </div>
        </Link>
        <h1 className="font-display text-sm font-bold tracking-wider uppercase text-foreground">
          Gallery
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`rounded-xl p-2 border-glow ${showFavoritesOnly ? 'bg-neon-pink/20' : 'bg-surface-elevated'}`}
          >
            <Heart className={`h-5 w-5 ${showFavoritesOnly ? 'fill-neon-pink text-neon-pink' : 'text-muted-foreground'}`} />
          </motion.button>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by prompt, subject, location..."
          className="w-full rounded-xl bg-surface-elevated border-glow pl-10 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-neon-purple"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Mode filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {MODE_FILTERS.map((f) => (
          <motion.button
            key={f.value}
            whileTap={{ scale: 0.95 }}
            onClick={() => setModeFilter(f.value)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
              modeFilter === f.value
                ? 'gradient-primary text-primary-foreground glow-purple'
                : 'bg-surface-elevated text-muted-foreground border-glow'
            }`}
          >
            {f.label}
          </motion.button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground mb-3">
        {filtered.length} {filtered.length === 1 ? 'scene' : 'scenes'}
        {showFavoritesOnly && ' (favorites)'}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Filter className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">
            {generatedImages.length === 0
              ? 'No scenes yet. Start creating!'
              : 'No scenes match your filters.'}
          </p>
          {generatedImages.length === 0 && (
            <Link to="/create" className="mt-4 text-xs font-semibold text-neon-purple">
              Create your first scene →
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {filtered.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => setSelected(img)}
              className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
            >
              <img
                src={img.url}
                alt={img.prompt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-display uppercase tracking-wider text-foreground/80">{img.mode}</span>
              </div>
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
      )}

      {/* Fullscreen viewer */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl flex flex-col"
          >
            <div className="flex justify-between items-center p-4">
              <span className="text-xs font-display uppercase tracking-wider text-muted-foreground">{selected.mode}</span>
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
            <div className="px-4 pb-2">
              <p className="text-xs text-muted-foreground line-clamp-2">{selected.prompt}</p>
            </div>
            <div className="flex justify-center gap-4 p-6">
              {[
                { icon: Download, label: 'Save' },
                { icon: Heart, label: 'Fave', active: favorites.includes(selected.id) },
                { icon: Share2, label: 'Share' },
              ].map(({ icon: Icon, label, active }) => (
                <button
                  key={label}
                  onClick={() => {
                    if (label === 'Fave') toggleFavorite(selected.id);
                  }}
                  className="flex flex-col items-center gap-1 text-muted-foreground"
                >
                  <div className={`rounded-full p-3 border-glow ${active ? 'bg-neon-pink/20' : 'bg-surface-elevated'}`}>
                    <Icon className={`h-5 w-5 ${active ? 'fill-neon-pink text-neon-pink' : ''}`} />
                  </div>
                  <span className="text-[10px]">{label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
