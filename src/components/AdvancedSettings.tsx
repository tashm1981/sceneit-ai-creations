import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';

const lightingOptions = ['natural', 'dramatic', 'neon', 'flash'] as const;

export function AdvancedSettings() {
  const [open, setOpen] = useState(false);
  const { advancedSettings, setAdvancedSettings } = useAppStore();

  return (
    <div className="rounded-2xl bg-surface-elevated border-glow overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-4 text-sm font-medium text-muted-foreground"
      >
        <span>Advanced Settings</span>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-5 px-4 pb-4">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">
                  Creativity: {advancedSettings.creativity}%
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={advancedSettings.creativity}
                  onChange={(e) => setAdvancedSettings({ creativity: +e.target.value })}
                  className="w-full accent-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">
                  Style Strength: {advancedSettings.styleStrength}%
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={advancedSettings.styleStrength}
                  onChange={(e) => setAdvancedSettings({ styleStrength: +e.target.value })}
                  className="w-full accent-primary"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">HD Resolution</span>
                <button
                  onClick={() => setAdvancedSettings({ hdEnabled: !advancedSettings.hdEnabled })}
                  className={`h-6 w-11 rounded-full transition-colors ${
                    advancedSettings.hdEnabled ? 'gradient-primary' : 'bg-muted'
                  }`}
                >
                  <div
                    className={`h-5 w-5 rounded-full bg-foreground transition-transform ${
                      advancedSettings.hdEnabled ? 'translate-x-5.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Lighting</label>
                <div className="flex gap-2">
                  {lightingOptions.map((l) => (
                    <button
                      key={l}
                      onClick={() => setAdvancedSettings({ lighting: l })}
                      className={`rounded-lg px-3 py-1.5 text-xs capitalize transition-all ${
                        advancedSettings.lighting === l
                          ? 'gradient-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
