import { createFileRoute, Link } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Images, Sparkles, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ShowcaseCarousel } from '@/components/ShowcaseCarousel';
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

const ROTATING_WORDS = ['cinematic', 'anime', 'cover art', 'realistic', 'iconic'];

function HomePage() {
  const { credits } = useAppStore();
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setWordIndex((i) => (i + 1) % ROTATING_WORDS.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden px-5 py-8 pb-28">
      {/* Ambient glows */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-32 h-96 w-96 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(closest-side, hsl(280 90% 55% / 0.35), transparent)' }}
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -right-32 h-96 w-96 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(closest-side, hsl(200 100% 55% / 0.28), transparent)' }}
        animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex items-center justify-between mb-8"
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

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.6 }}
        className="relative mb-7"
      >
        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 mb-4">
          <Sparkles className="h-3 w-3 text-neon-blue" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Powered by Lovable AI
          </span>
        </div>
        <h2 className="font-display text-[32px] leading-[1.05] font-black tracking-tight text-foreground">
          Generate
          <br />
          <span className="inline-flex items-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={ROTATING_WORDS[wordIndex]}
                initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -18, filter: 'blur(8px)' }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="gradient-primary bg-clip-text text-transparent"
              >
                {ROTATING_WORDS[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
          <br />
          scenes in seconds.
        </h2>
        <p className="text-sm text-muted-foreground mt-3 max-w-[34ch]">
          Pick a vibe, build your scene, and let AI render the moment. Three model
          tiers from fast drafts to cinematic HD.
        </p>
      </motion.div>

      {/* Showcase carousel */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.7 }}
        className="relative mb-8"
      >
        <ShowcaseCarousel />
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="relative space-y-3"
      >
        <Link to="/create">
          <motion.div
            whileTap={{ scale: 0.97 }}
            className="group relative w-full gradient-primary glow-purple rounded-2xl py-4 font-display text-sm font-bold tracking-wider uppercase text-primary-foreground text-center flex items-center justify-center gap-2"
          >
            Start Creating
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </motion.div>
        </Link>
        <Link to="/gallery" className="block">
          <motion.div
            whileTap={{ scale: 0.97 }}
            className="w-full bg-surface-elevated border-glow rounded-2xl py-4 font-display text-sm font-bold tracking-wider uppercase text-muted-foreground text-center flex items-center justify-center gap-2"
          >
            <Images className="h-4 w-4" />
            Browse Gallery
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}
