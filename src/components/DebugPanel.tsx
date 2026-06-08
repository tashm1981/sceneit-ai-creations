import { useAppStore, buildPrompt, composePrompt, MODEL_OPTIONS } from '@/lib/store';
import { Bug } from 'lucide-react';

export function DebugPanel() {
  const {
    debugMode,
    setDebugMode,
    mode,
    subject,
    outfit,
    location,
    mood,
    advancedSettings,
    userPrompt,
    referenceImages,
    modelTier,
    lastDebugPayload,
  } = useAppStore();

  const templatePrompt = buildPrompt({ mode, subject, outfit, location, mood, advancedSettings });
  const combined = composePrompt({
    templatePrompt,
    userPrompt,
    hasReference: referenceImages.length > 0,
  });
  const model = MODEL_OPTIONS.find((m) => m.id === modelTier);

  return (
    <div className="rounded-2xl bg-surface-elevated border-glow p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bug className="h-4 w-4 text-neon-blue" />
          <span className="font-display text-xs font-bold tracking-wider uppercase text-foreground">
            Developer Mode
          </span>
        </div>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={debugMode}
            onChange={(e) => setDebugMode(e.target.checked)}
            className="rounded"
          />
          Enable
        </label>
      </div>

      {debugMode && (
        <div className="space-y-3 text-xs">
          <DebugRow label="Model" value={`${model?.name ?? modelTier} (${modelTier})`} />
          <DebugRow label="Mode" value={mode} />
          <DebugRow
            label="Reference Images"
            value={`${referenceImages.length} (${referenceImages.filter((r) => r.type === 'subject').length} subject, ${referenceImages.filter((r) => r.type === 'style').length} style)`}
          />
          {referenceImages.length > 0 && (
            <div className="space-y-1">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Reference URLs
              </p>
              <ul className="space-y-1">
                {referenceImages.map((r) => (
                  <li key={r.id} className="flex items-center gap-2">
                    <img src={r.dataUrl} alt="" className="h-8 w-8 rounded object-cover" />
                    <span className="text-[10px] text-muted-foreground truncate">
                      [{r.type}] {r.name} ({Math.round(r.dataUrl.length / 1024)}KB)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <DebugBlock label="Template Prompt" value={templatePrompt} />
          <DebugBlock label="User Prompt" value={userPrompt || '(none)'} />
          <DebugBlock label="Combined Prompt" value={combined} />
          {lastDebugPayload !== null && (
            <DebugBlock
              label="Last Generation Payload"
              value={JSON.stringify(lastDebugPayload, null, 2)}
            />
          )}
        </div>
      )}
    </div>
  );
}

function DebugRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <span className="text-xs text-foreground text-right">{value}</span>
    </div>
  );
}

function DebugBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <pre className="rounded-lg bg-background/60 p-2 text-[11px] text-foreground/80 whitespace-pre-wrap break-words max-h-48 overflow-auto">
        {value}
      </pre>
    </div>
  );
}