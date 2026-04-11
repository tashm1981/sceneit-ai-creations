import { createFileRoute, Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, Shuffle } from 'lucide-react';
import { PresetChips } from '@/components/PresetChips';
import { PromptBuilder } from '@/components/PromptBuilder';
import { PromptDisplay } from '@/components/PromptDisplay';
import { AdvancedSettings } from '@/components/AdvancedSettings';
import { GenerateButton } from '@/components/GenerateButton';
import { ImageGallery } from '@/components/ImageGallery';
import { ReferenceImageUpload } from '@/components/ReferenceImageUpload';
import { TemplateManager } from '@/components/TemplateManager';
import { useAppStore, buildPrompt, type GeneratedImage } from '@/lib/store';

export const Route = createFileRoute('/create')({
  head: () => ({
    meta: [
      { title: 'Create — SceneIt' },
      { name: 'description', content: 'Build your scene with AI-powered prompt building.' },
    ],
  }),
  component: CreatePage,
});

function CreatePage() {
  const store = useAppStore();

  const handleGenerate = () => {
    if (store.isGenerating || store.credits <= 0) return;
    store.setIsGenerating(true);

    const prompt = store.customPrompt || buildPrompt(store);

    // Simulate generation with placeholder images
    setTimeout(() => {
      const newImage: GeneratedImage = {
        id: crypto.randomUUID(),
        url: `https://picsum.photos/seed/${Date.now()}/512/512`,
        prompt,
        mode: store.mode,
        timestamp: Date.now(),
        subject: store.subject,
        outfit: store.outfit,
        location: store.location,
        mood: store.mood,
      };
      store.addGeneratedImage(newImage);
      store.setIsGenerating(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen px-5 py-6 pb-36">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-3 mb-6"
      >
        <Link to="/">
          <div className="rounded-xl bg-surface-elevated border-glow p-2">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </div>
        </Link>
        <h1 className="font-display text-sm font-bold tracking-wider uppercase text-foreground">
          Create Scene
        </h1>
        <div className="ml-auto">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={store.randomize}
            className="rounded-xl bg-surface-elevated border-glow p-2"
          >
            <Shuffle className="h-5 w-5 text-neon-blue" />
          </motion.button>
        </div>
      </motion.div>

      <div className="space-y-6">
        {/* Templates */}
        <section>
          <h2 className="font-display text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-3">
            Templates
          </h2>
          <TemplateManager />
        </section>

        {/* Presets */}
        <section>
          <h2 className="font-display text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-3">
            Quick Presets
          </h2>
          <PresetChips />
        </section>

        {/* Reference Images */}
        <section>
          <h2 className="font-display text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-3">
            Reference Images
          </h2>
          <ReferenceImageUpload />
        </section>

        {/* Prompt Builder */}
        <section>
          <h2 className="font-display text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-3">
            Build Your Scene
          </h2>
          <PromptBuilder />
        </section>

        {/* Prompt Display */}
        <PromptDisplay />

        {/* Advanced Settings */}
        <AdvancedSettings />

        {/* Gallery */}
        <ImageGallery />
      </div>

      <GenerateButton onGenerate={handleGenerate} />
    </div>
  );
}
