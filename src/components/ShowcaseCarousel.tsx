import { motion } from 'framer-motion';
import showcase1 from '@/assets/showcase-1.jpg';
import showcase2 from '@/assets/showcase-2.jpg';
import showcase3 from '@/assets/showcase-3.jpg';
import showcase4 from '@/assets/showcase-4.jpg';
import showcase5 from '@/assets/showcase-5.jpg';
import showcase6 from '@/assets/showcase-6.jpg';

const SCENES = [
  { src: showcase1, label: 'Cinematic', tag: 'Rooftop Neon' },
  { src: showcase2, label: 'Anime', tag: 'Hero Arc' },
  { src: showcase3, label: 'Cover Art', tag: 'Trap Single' },
  { src: showcase4, label: 'Photo', tag: 'Golden Hour' },
  { src: showcase5, label: 'Cinematic', tag: 'Squad' },
  { src: showcase6, label: 'Anime', tag: 'Villain' },
];

function Column({
  images,
  duration,
  reverse = false,
}: {
  images: typeof SCENES;
  duration: number;
  reverse?: boolean;
}) {
  // Duplicate the list so the loop appears seamless
  const loop = [...images, ...images];

  return (
    <div className="relative h-[420px] overflow-hidden rounded-3xl">
      <motion.div
        className="flex flex-col gap-3"
        animate={{ y: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
      >
        {loop.map((s, i) => (
          <div
            key={i}
            className="relative shrink-0 overflow-hidden rounded-2xl border border-white/10"
            style={{ aspectRatio: '3/4' }}
          >
            <img
              src={s.src}
              alt={`${s.label} — ${s.tag}`}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-2.5">
              <div className="text-[9px] font-bold uppercase tracking-widest text-neon-blue">
                {s.label}
              </div>
              <div className="text-[11px] font-semibold text-white">{s.tag}</div>
            </div>
          </div>
        ))}
      </motion.div>
      {/* Top/bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}

export function ShowcaseCarousel() {
  const colA = [SCENES[0], SCENES[3], SCENES[4]];
  const colB = [SCENES[1], SCENES[2], SCENES[5]];

  return (
    <div className="grid grid-cols-2 gap-3">
      <Column images={colA} duration={28} />
      <Column images={colB} duration={34} reverse />
    </div>
  );
}