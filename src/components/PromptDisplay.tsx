import { useAppStore, buildPrompt, composePrompt } from '@/lib/store';

export function PromptDisplay() {
  const {
    mode,
    subject,
    outfit,
    location,
    mood,
    advancedSettings,
    userPrompt,
    setUserPrompt,
    referenceImages,
  } = useAppStore();

  const templatePrompt = buildPrompt({ mode, subject, outfit, location, mood, advancedSettings });
  const combined = composePrompt({
    templatePrompt,
    userPrompt,
    hasReference: referenceImages.length > 0,
  });

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Your Instructions
        </label>
        <textarea
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          rows={3}
          placeholder="Add any specific details, overrides, or directions (e.g. 'holding a vintage camera, golden hour, no sunglasses')"
          className="w-full rounded-xl bg-surface-elevated border-glow p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
        />
        <p className="text-[10px] text-muted-foreground/70">
          {referenceImages.length > 0
            ? 'Reference image will be used as the subject. Template applies styling. Your instructions take priority.'
            : 'Template defines the scene. Your instructions take priority.'}
        </p>
      </div>
      <details className="rounded-xl bg-surface-elevated/60 border-glow px-3 py-2">
        <summary className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider cursor-pointer">
          Combined Prompt Preview
        </summary>
        <p className="mt-2 text-xs text-foreground/80 whitespace-pre-wrap">{combined}</p>
      </details>
    </div>
  );
}
