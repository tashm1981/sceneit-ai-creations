import { motion } from 'framer-motion';
import { Zap, Sparkles, Crown } from 'lucide-react';
import { useAppStore, MODEL_OPTIONS, type ModelTier } from '@/lib/store';

const ICONS: Record<ModelTier, typeof Zap> = {
  fast: Zap,
  balanced: Sparkles,
  hd: Crown,
};

export function ModelSelector() {
  const { modelTier, setModelTier, setAdvancedSettings } = useAppStore();

  return (
    <div className="space-y-2">
      {MODEL_OPTIONS.map((opt) => {
        const Icon = ICONS[opt.id];
        const active = modelTier === opt.id;
        return (
          <motion.button
            key={opt.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setModelTier(opt.id);
              setAdvancedSettings({ hdEnabled: opt.id === 'hd' });
            }}
            className={`w-full text-left rounded-2xl p-4 transition-all border ${
              active
                ? 'gradient-primary glow-purple border-transparent'
                : 'bg-surface-elevated border-glow border-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`rounded-xl p-2 ${
                  active ? 'bg-white/15' : 'bg-muted'
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    active ? 'text-primary-foreground' : 'text-neon-blue'
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-display text-sm font-bold tracking-wide ${
                      active ? 'text-primary-foreground' : 'text-foreground'
                    }`}
                  >
                    {opt.name}
                  </span>
                  {opt.badge && (
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5 ${
                        active
                          ? 'bg-white/20 text-primary-foreground'
                          : 'bg-neon-blue/15 text-neon-blue'
                      }`}
                    >
                      {opt.badge}
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs mt-0.5 ${
                    active ? 'text-primary-foreground/85' : 'text-muted-foreground'
                  }`}
                >
                  {opt.description}
                </p>
              </div>
              <div
                className={`text-right shrink-0 ${
                  active ? 'text-primary-foreground' : 'text-muted-foreground'
                }`}
              >
                <div className="font-display text-sm font-black leading-none">
                  {opt.credits}
                </div>
                <div className="text-[10px] uppercase tracking-wider mt-0.5">
                  {opt.credits === 1 ? 'credit' : 'credits'}
                </div>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}