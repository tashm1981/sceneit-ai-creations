import { createFileRoute, useNavigate, Link, redirect } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, ArrowLeft, Zap, Heart, Images } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useAppStore } from '@/lib/store';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const Route = createFileRoute('/account')({
  head: () => ({ meta: [{ title: 'Account — SceneIt' }] }),
  component: AccountPage,
});

function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { credits, favorites, generatedImages } = useAppStore();
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: '/auth' });
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.display_name) setDisplayName(data.display_name);
      });
  }, [user]);

  if (!user) return null;

  const handleSave = async () => {
    const { error } = await supabase
      .from('profiles')
      .update({ display_name: displayName, updated_at: new Date().toISOString() })
      .eq('id', user.id);
    if (error) toast.error(error.message);
    else toast.success('Saved');
  };

  return (
    <div className="flex min-h-screen flex-col px-5 py-8 pb-24">
      <Link to="/" className="flex items-center gap-1 text-muted-foreground text-sm mb-6">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-2xl font-black tracking-wider">Account</h1>
        <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {[
          { icon: Zap, label: 'Credits', value: credits },
          { icon: Heart, label: 'Favorites', value: favorites.length },
          { icon: Images, label: 'Scenes', value: generatedImages.length },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-surface-elevated border-glow rounded-2xl p-3 text-center">
            <Icon className="h-4 w-4 text-neon-purple mx-auto mb-1" />
            <div className="font-display text-lg font-bold">{value}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3 mb-6">
        <label className="text-xs uppercase tracking-wider text-muted-foreground">Display name</label>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full bg-surface-elevated border-glow rounded-2xl py-3.5 px-4 text-sm text-foreground"
        />
        <button
          onClick={handleSave}
          className="w-full gradient-primary glow-purple rounded-2xl py-3.5 font-display text-sm font-bold tracking-wider uppercase text-primary-foreground"
        >
          Save
        </button>
      </div>

      <button
        onClick={async () => {
          await signOut();
          navigate({ to: '/' });
        }}
        className="w-full bg-surface-elevated border border-border rounded-2xl py-3.5 font-display text-sm font-semibold tracking-wider uppercase text-muted-foreground flex items-center justify-center gap-2"
      >
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </div>
  );
}