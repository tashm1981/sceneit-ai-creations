import { createFileRoute, Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Zap, Images } from 'lucide-react';
import { ModeSelector } from '@/components/ModeSelector';
import { useAppStore } from '@/lib/store';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'SceneIt — AI Image Generation' },
      { name: 'description', content: 'You get noticed when you… Make a Scene! Create cinematic visuals with AI.' },
      { property: 'og:title', content: 'SceneIt — AI Image Generation' },
      { property: 'og:description', content: 'Create cinematic visuals, realistic photos, animations, and cover art with AI.' },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { credits } = useAppStore();

  return (
    <div className="flex min-h-screen flex-col px-5 py-8 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-10"
      >
        <div>
          <h1 className="font-display text-2xl font-black tracking-wider glow-text-purple text-primary">
            SceneIt
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Make a Scene!</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-surface-elevated border-glow px-3 py-1.5">
          <Zap className="h-3.5 w-3.5 text-neon-blue" />
          <span className="font-display text-xs font-bold text-foreground">{credits}</span>
        </div>
      </motion.div>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-10"
      >
        <p className="text-lg font-medium text-foreground">
          You get noticed when you…
        </p>
        <p className="font-display text-2xl font-black mt-1 gradient-primary bg-clip-text" style={{ color: 'black' }}>
          Make a Scene!
        </p>
      </motion.div>

      {/* Mode Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-10"
      >
        <h2 className="font-display text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-4">
          Choose Your Mode
        </h2>
        <ModeSelector />
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Link to="/create">
          <motion.div
            whileTap={{ scale: 0.97 }}
            className="w-full gradient-primary glow-purple rounded-2xl py-4 font-display text-sm font-bold tracking-wider uppercase text-primary-foreground text-center"
          >
            Start Creating
          </motion.div>
        </Link>
        <Link to="/gallery" className="mt-3 block">
          <motion.div
            whileTap={{ scale: 0.97 }}
            className="w-full bg-surface-elevated border-glow rounded-2xl py-4 font-display text-sm font-bold tracking-wider uppercase text-muted-foreground text-center flex items-center justify-center gap-2"
          >
            <Images className="h-4 w-4" />
            Gallery
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}
