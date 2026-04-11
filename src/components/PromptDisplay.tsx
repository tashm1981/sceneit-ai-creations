import { useAppStore, buildPrompt } from '@/lib/store';
import { useEffect } from 'react';

export function PromptDisplay() {
  const { mode, subject, outfit, location, mood, advancedSettings, customPrompt, setCustomPrompt } =
    useAppStore();

  const generatedPrompt = buildPrompt({ mode, subject, outfit, location, mood, advancedSettings });

  useEffect(() => {
    setCustomPrompt(generatedPrompt);
  }, [generatedPrompt, setCustomPrompt]);

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Generated Prompt
      </label>
      <textarea
        value={customPrompt}
        onChange={(e) => setCustomPrompt(e.target.value)}
        rows={3}
        className="w-full rounded-xl bg-surface-elevated border-glow p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
      />
    </div>
  );
}
