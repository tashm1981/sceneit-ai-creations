import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, Film, Camera, Sparkles, Disc3 } from 'lucide-react';
import { useState } from 'react';
import {
  useAppStore,
  SCENE_TEMPLATES,
  TEMPLATE_CATEGORIES,
  type CreationMode,
  type SceneTemplate,
  type TemplateCategory,
} from '@/lib/store';
import { TEMPLATE_THUMBNAILS } from '@/lib/templateThumbnails';

export const Route = createFileRoute('/templates')({
  head: () => ({
    meta: [
      { title: 'Templates — SceneIt' },
      { name: 'description', content: 'Browse pre-built scene templates. Tap a template to open it in the generator.' },
    ],
  }),
  component: TemplatesPage,
});

const modeIcons: Record<CreationMode, React.ReactNode> = {
  cinematic: <Film className="h-3.5 w-3.5" />,
  camera: <Camera className="h-3.5 w-3.5" />,
  animation: <Sparkles className="h-3.5 w-3.5" />,
  coverart: <Disc3 className="h-3.5 w-3.5" />,
};

function TemplatesPage() {
  const navigate = useNavigate();
  const applyTemplate = useAppStore((s) => s.applyTemplate);
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');

  const filtered =
    selectedCategory === 'all'
      ? SCENE_TEMPLATES
      : SCENE_TEMPLATES.filter((t) => t.category === selectedCategory);

  const handleSelect = (template: SceneTemplate) => {
    applyTemplate(template);
    navigate({ to: '/create' });
  };

  return (
    <div className="min-h-screen px-5 py-6 pb-[calc(5rem+env(safe-area-inset-bottom))]">
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
        <div>
          <h1 className="font-display text-sm font-bold tracking-wider uppercase text-foreground">
            Templates
          </h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Tap any template to open it in the studio
          </p>
        </div>
      </motion.div>

      <div className="overflow-x-auto scrollbar-hide -mx-5 px-5 mb-4">
        <div className="flex gap-2 pb-1">
          {(['all', ...TEMPLATE_CATEGORIES.map((c) => c.id)] as const).map((cat) => {
            const label = cat === 'all' ? 'All' : TEMPLATE_CATEGORIES.find((c) => c.id === cat)?.label;
            const active = selectedCategory === cat;
            return (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.93 }}
                onClick={() => setSelectedCategory(cat as TemplateCategory | 'all')}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-medium transition-all ${
                  active
                    ? 'gradient-primary text-primary-foreground glow-purple'
                    : 'bg-surface-elevated border-glow text-muted-foreground'
                }`}
              >
                {label}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filtered.map((template) => (
          <motion.button
            key={template.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(template)}
            className="rounded-2xl bg-surface-elevated border-glow text-left transition-all hover:border-primary/50 overflow-hidden"
          >
            <div className="relative aspect-square w-full overflow-hidden bg-surface">
              {TEMPLATE_THUMBNAILS[template.id] && (
                <img
                  src={TEMPLATE_THUMBNAILS[template.id]}
                  alt={template.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              )}
              <div className="absolute top-1.5 left-1.5 flex items-center gap-1 rounded-full bg-background/70 backdrop-blur px-2 py-0.5">
                <span className="text-neon-blue">{modeIcons[template.mode]}</span>
                <span className="text-[9px] text-foreground uppercase tracking-wider">{template.mode}</span>
              </div>
            </div>
            <div className="p-2.5">
              <p className="text-xs font-semibold text-foreground truncate">{template.name}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{template.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}