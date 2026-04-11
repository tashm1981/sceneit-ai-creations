import { useAppStore, type Subject, type Outfit, type Location, type Mood } from '@/lib/store';

const subjects: Subject[] = ['Person', 'Man', 'Woman', 'Group'];
const outfits: Outfit[] = ['Streetwear', 'Casual', 'Luxury', 'Athletic'];
const locations: Location[] = ['City street', 'Rooftop', 'Studio', 'Mansion', 'Club'];
const moods: Mood[] = ['Confident', 'Aggressive', 'Calm', 'Mysterious', 'Happy'];

function ChipGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`rounded-xl px-3.5 py-1.5 text-sm font-medium transition-all ${
              value === opt
                ? 'gradient-primary text-primary-foreground glow-purple'
                : 'bg-surface-elevated text-muted-foreground border-glow'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PromptBuilder() {
  const { subject, setSubject, outfit, setOutfit, location, setLocation, mood, setMood } =
    useAppStore();

  return (
    <div className="space-y-5">
      <ChipGroup label="Subject" options={subjects} value={subject as string} onChange={setSubject} />
      <ChipGroup label="Outfit" options={outfits} value={outfit as string} onChange={setOutfit} />
      <ChipGroup label="Location" options={locations} value={location as string} onChange={setLocation} />
      <ChipGroup label="Mood" options={moods} value={mood as string} onChange={setMood} />
    </div>
  );
}
