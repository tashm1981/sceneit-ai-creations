import { motion } from 'framer-motion';
import { Film, Camera, Palette, Disc3 } from 'lucide-react';
import { type CreationMode, useAppStore } from '@/lib/store';

const modes: { id: CreationMode; label: string; icon: typeof Film; description: string }[] = [
  { id: 'cinematic', label: 'Cinematic', icon: Film, description: 'Movie-quality scenes' },
  { id: 'camera', label: 'Camera', icon: Camera, description: 'Real-life photos' },
  { id: 'animation', label: 'Animation', icon: Palette, description: 'Anime & cartoon' },
  { id: 'coverart', label: 'Cover Art', icon: Disc3, description: 'Album & cover art' },
];

export function ModeSelector() {
  const { mode, setMode } = useAppStore();

  return (
    <div className="grid grid-cols-2 gap-3">
      {modes.map((m) => {
        const active = mode === m.id;
        const Icon = m.icon;
        return (
          <motion.button
            key={m.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMode(m.id)}
            className={`relative flex flex-col items-center gap-2 rounded-2xl p-5 transition-all duration-300 ${
              active
                ? 'gradient-primary glow-purple text-primary-foreground'
                : 'bg-surface-elevated border-glow text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="h-7 w-7" />
            <span className="font-display text-xs font-semibold tracking-wider uppercase">
              {m.label}
            </span>
            <span className="text-[10px] opacity-70">{m.description}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
