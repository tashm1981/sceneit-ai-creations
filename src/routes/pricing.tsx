import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, X, Sparkles, Zap, Crown, ShieldCheck, Infinity as InfinityIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export const Route = createFileRoute('/pricing')({
  head: () => ({
    meta: [
      { title: 'Pricing — AetherScene' },
      {
        name: 'description',
        content:
          'Unlock your creative studio. Generate album covers, scenes, and AI visuals with full creative control.',
      },
    ],
  }),
  component: PricingPage,
});

type ModalState = { open: boolean; planName: string };

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '/month',
    icon: Sparkles,
    accent: 'from-muted-foreground/30 to-muted-foreground/10',
    ring: 'border-border',
    badge: null,
    features: [
      '20 credits / month',
      '1 reference image',
      'Basic generation',
      'Watermark optional',
    ],
    cta: 'Current Plan',
    disabled: true,
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$12.99',
    period: '/month',
    icon: Zap,
    accent: 'from-neon-purple to-neon-blue',
    ring: 'border-neon-purple',
    badge: 'Most Popular',
    features: [
      '800 credits / month',
      'Image URL import',
      'Up to 5 reference images',
      'Faster generation queue',
      'No watermark',
      'Full history + remix',
    ],
    cta: 'Upgrade to Pro',
    disabled: false,
    highlight: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$24.99',
    period: '/month',
    icon: Crown,
    accent: 'from-neon-blue to-neon-pink',
    ring: 'border-neon-blue',
    badge: null,
    features: [
      '2000 credits / month',
      'AI image understanding',
      '10+ reference images',
      'Style extraction',
      'Priority generation',
      'Commercial usage license',
    ],
    cta: 'Upgrade to Premium',
    disabled: false,
    highlight: false,
  },
] as const;

const creditPacks = [
  { id: 'starter', name: 'Starter Pack', price: '$5', credits: '300 credits' },
  { id: 'creator', name: 'Creator Pack', price: '$10', credits: '700 credits' },
  { id: 'studio', name: 'Studio Pack', price: '$20', credits: '1600 credits' },
] as const;

const compareRows = [
  { feature: 'Credits / month', free: '20', pro: '800', premium: '2000' },
  { feature: 'Image uploads', free: true, pro: true, premium: true },
  { feature: 'URL image import', free: false, pro: true, premium: true },
  { feature: 'AI image analysis', free: false, pro: false, premium: true },
  { feature: 'Max reference images', free: '1', pro: '5', premium: '10+' },
  { feature: 'Watermark', free: true, pro: false, premium: false },
] as const;

function PricingPage() {
  const [modal, setModal] = useState<ModalState>({ open: false, planName: '' });

  const openModal = (name: string) => setModal({ open: true, planName: name });
  const closeModal = () => setModal({ open: false, planName: '' });

  return (
    <div className="min-h-screen px-5 py-8 pb-32">
      {/* Header */}
      <div className="mx-auto max-w-6xl">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Link>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl sm:text-5xl font-black tracking-wider uppercase glow-text-purple">
            Unlock Your <span className="text-neon-purple">Creative</span> Studio
          </h1>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Generate album covers, scenes, and AI visuals with full creative control.
          </p>
          <p className="mt-2 text-xs text-muted-foreground/70">
            Choose a plan or buy credits anytime.
          </p>
        </motion.div>

        {/* Plans */}
        <section className="grid gap-5 md:grid-cols-3 mb-16">
          {plans.map((plan, idx) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className={`relative rounded-3xl border bg-surface-elevated/60 backdrop-blur p-6 flex flex-col transition-all ${
                  plan.highlight
                    ? 'border-neon-purple glow-purple md:scale-[1.03]'
                    : 'border-border hover:border-neon-purple/40'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary text-primary-foreground text-[10px] font-display font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                    {plan.badge}
                  </div>
                )}

                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.accent} flex items-center justify-center mb-4`}
                >
                  <Icon className="h-5 w-5 text-primary-foreground" />
                </div>

                <h3 className="font-display text-lg font-bold tracking-wider uppercase">
                  {plan.name}
                </h3>
                <div className="mt-2 mb-5 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-black">{plan.price}</span>
                  <span className="text-xs text-muted-foreground">{plan.period}</span>
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-neon-purple shrink-0 mt-0.5" />
                      <span className="text-foreground/90">{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  disabled={plan.disabled}
                  onClick={() => openModal(plan.name)}
                  className={`w-full rounded-2xl py-3 font-display text-xs font-bold tracking-widest uppercase transition-all ${
                    plan.disabled
                      ? 'bg-surface text-muted-foreground cursor-not-allowed'
                      : plan.highlight
                        ? 'gradient-primary text-primary-foreground glow-purple hover:opacity-90'
                        : 'bg-surface-elevated border border-neon-purple/40 text-foreground hover:border-neon-purple'
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            );
          })}
        </section>

        {/* Credit Packs */}
        <section className="mb-16">
          <div className="text-center mb-6">
            <h2 className="font-display text-2xl font-black tracking-wider uppercase">
              Need more credits?
            </h2>
            <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
              <InfinityIcon className="h-3 w-3" /> Credits never expire.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {creditPacks.map((pack, idx) => (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                whileHover={{ y: -2 }}
                className="rounded-2xl border border-border bg-surface-elevated/60 p-5 text-center hover:border-neon-blue/50 transition-colors"
              >
                <h4 className="font-display text-sm font-bold tracking-wider uppercase text-neon-blue">
                  {pack.name}
                </h4>
                <div className="font-display text-3xl font-black my-3">{pack.price}</div>
                <p className="text-xs text-muted-foreground mb-4">{pack.credits}</p>
                <button
                  onClick={() => openModal(pack.name)}
                  className="w-full rounded-xl bg-surface border border-neon-blue/40 py-2.5 font-display text-xs font-bold tracking-widest uppercase text-foreground hover:border-neon-blue hover:glow-blue transition-all"
                >
                  Buy
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Comparison Table */}
        <section className="mb-12">
          <h2 className="font-display text-2xl font-black tracking-wider uppercase text-center mb-6">
            Compare Plans
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-border bg-surface-elevated/40 backdrop-blur">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-5 font-display text-xs uppercase tracking-wider text-muted-foreground">
                    Feature
                  </th>
                  <th className="py-4 px-3 font-display text-xs uppercase tracking-wider">Free</th>
                  <th className="py-4 px-3 font-display text-xs uppercase tracking-wider text-neon-purple">
                    Pro
                  </th>
                  <th className="py-4 px-3 font-display text-xs uppercase tracking-wider text-neon-blue">
                    Premium
                  </th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row) => (
                  <tr key={row.feature} className="border-b border-border/50 last:border-0">
                    <td className="py-3 px-5 text-foreground/90">{row.feature}</td>
                    <td className="text-center py-3 px-3">{renderCell(row.free)}</td>
                    <td className="text-center py-3 px-3">{renderCell(row.pro)}</td>
                    <td className="text-center py-3 px-3">{renderCell(row.premium)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Trust */}
        <footer className="text-center space-y-4">
          <p className="text-xs text-muted-foreground">
            Used by music artists, creators, and visual designers worldwide.
          </p>
          <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground/70 font-display uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-neon-purple" /> Secure billing
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-neon-blue" /> Cancel anytime
            </span>
          </div>
        </footer>
      </div>

      {/* Modal */}
      <Dialog open={modal.open} onOpenChange={(o) => !o && closeModal()}>
        <DialogContent className="bg-surface-elevated border-neon-purple/30">
          <DialogHeader>
            <DialogTitle className="font-display tracking-wider uppercase">
              {modal.planName}
            </DialogTitle>
            <DialogDescription>
              Payment integration coming soon. We'll connect billing soon — drop your email and
              we'll let you know when it's live.
            </DialogDescription>
          </DialogHeader>
          <Input placeholder="you@email.com" type="email" className="bg-surface" />
          <DialogFooter>
            <button
              onClick={closeModal}
              className="w-full gradient-primary text-primary-foreground rounded-xl py-2.5 font-display text-xs font-bold tracking-widest uppercase glow-purple"
            >
              Notify Me
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function renderCell(v: string | boolean) {
  if (typeof v === 'boolean') {
    return v ? (
      <Check className="h-4 w-4 text-neon-purple mx-auto" />
    ) : (
      <X className="h-4 w-4 text-muted-foreground/50 mx-auto" />
    );
  }
  return <span className="text-foreground/90 font-medium">{v}</span>;
}