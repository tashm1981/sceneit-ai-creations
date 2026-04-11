import { motion } from 'framer-motion';
import { PRESETS, useAppStore } from '@/lib/store';

export function PresetChips() {
  const { applyPreset, subject, outfit, location, mood } = useAppStore();

  return (
    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
      <div className="flex gap-2 pb-1">
        {PRESETS.map((preset) => {
          const active =
            preset.subject === subject &&
            preset.outfit === outfit &&
            preset.location === location &&
            preset.mood === mood;
          return (
            <motion.button
              key={preset.id}
              whileTap={{ scale: 0.93 }}
              onClick={() => applyPreset(preset)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                active
                  ? 'gradient-primary text-primary-foreground glow-purple'
                  : 'bg-surface-elevated border-glow text-muted-foreground'
              }`}
            >
              {preset.name}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
