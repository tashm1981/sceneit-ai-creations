import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export function GenerateButton({ onGenerate }: { onGenerate: () => void }) {
  const { isGenerating, credits } = useAppStore();

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pt-8 z-50">
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onGenerate}
        disabled={isGenerating || credits <= 0}
        className="w-full gradient-primary glow-purple rounded-2xl py-4 font-display text-sm font-bold tracking-wider uppercase text-primary-foreground disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            Make a Scene
          </>
        )}
      </motion.button>
      <p className="text-center text-xs text-muted-foreground mt-2">
        {credits} credits remaining
      </p>
    </div>
  );
}
