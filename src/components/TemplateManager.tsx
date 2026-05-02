import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Save, Trash2, Film, Camera, Sparkles, Disc3 } from 'lucide-react';
import { useAppStore, type CreationMode, type SceneTemplate, SCENE_TEMPLATES, TEMPLATE_CATEGORIES, type TemplateCategory } from '@/lib/store';
import { TEMPLATE_THUMBNAILS } from '@/lib/templateThumbnails';

const modeIcons: Record<CreationMode, React.ReactNode> = {
  cinematic: <Film className="h-3.5 w-3.5" />,
  camera: <Camera className="h-3.5 w-3.5" />,
  animation: <Sparkles className="h-3.5 w-3.5" />,
  coverart: <Disc3 className="h-3.5 w-3.5" />,
};

export function TemplateManager() {
  const store = useAppStore();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [activeTab, setActiveTab] = useState<'premade' | 'saved'>('premade');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');

  const filteredTemplates =
    selectedCategory === 'all'
      ? SCENE_TEMPLATES
      : SCENE_TEMPLATES.filter((t) => t.category === selectedCategory);

  const handleApplyTemplate = (template: SceneTemplate) => {
    store.applyTemplate(template);
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim()) return;
    store.saveUserTemplate(templateName.trim());
    setTemplateName('');
    setShowSaveDialog(false);
  };

  return (
    <div className="space-y-3">
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('premade')}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-medium transition-all ${
            activeTab === 'premade'
              ? 'gradient-primary text-primary-foreground glow-purple'
              : 'bg-surface-elevated text-muted-foreground border-glow'
          }`}
        >
          <Layout className="h-3.5 w-3.5" />
          Scene Templates
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-medium transition-all ${
            activeTab === 'saved'
              ? 'gradient-primary text-primary-foreground glow-purple'
              : 'bg-surface-elevated text-muted-foreground border-glow'
          }`}
        >
          <Save className="h-3.5 w-3.5" />
          My Templates
        </button>
      </div>

      {/* Pre-made Templates */}
      {activeTab === 'premade' && (
        <>
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
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
          <div className="grid grid-cols-2 gap-2">
            {filteredTemplates.map((template) => (
            <motion.button
              key={template.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleApplyTemplate(template)}
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
        </>
      )}

      {/* Saved Templates */}
      {activeTab === 'saved' && (
        <div className="space-y-2">
          {/* Save Current Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowSaveDialog(true)}
            className="w-full rounded-2xl border-2 border-dashed border-muted-foreground/30 bg-surface/50 p-4 flex items-center justify-center gap-2 transition-colors hover:border-primary/50"
          >
            <Save className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Save Current Settings</span>
          </motion.button>

          {/* Save Dialog */}
          <AnimatePresence>
            {showSaveDialog && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-2xl bg-surface-elevated border-glow p-3 space-y-2"
              >
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Template name…"
                  maxLength={30}
                  className="w-full rounded-xl bg-surface border-glow px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveTemplate}
                    disabled={!templateName.trim()}
                    className="flex-1 rounded-xl gradient-primary py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowSaveDialog(false)}
                    className="rounded-xl bg-surface border-glow px-4 py-2 text-xs text-muted-foreground"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* User Templates List */}
          {store.userTemplates.length === 0 && !showSaveDialog && (
            <p className="text-center text-xs text-muted-foreground/60 py-4">
              No saved templates yet
            </p>
          )}

          <div className="grid grid-cols-2 gap-2">
            {store.userTemplates.map((template) => (
              <motion.div
                key={template.id}
                className="rounded-2xl bg-surface-elevated border-glow p-3 text-left relative group"
              >
                <button
                  onClick={() => handleApplyTemplate(template)}
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-neon-blue">{modeIcons[template.mode]}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{template.mode}</span>
                  </div>
                  <p className="text-xs font-semibold text-foreground truncate">{template.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {template.subject} · {template.location}
                  </p>
                </button>
                <button
                  onClick={() => store.removeUserTemplate(template.id)}
                  className="absolute top-2 right-2 rounded-lg bg-destructive/20 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
