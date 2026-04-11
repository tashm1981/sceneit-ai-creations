import { create } from 'zustand';

export type CreationMode = 'cinematic' | 'camera' | 'animation' | 'coverart';
export type Subject = 'Person' | 'Man' | 'Woman' | 'Group' | string;
export type Outfit = 'Streetwear' | 'Casual' | 'Luxury' | 'Athletic' | string;
export type Location = 'City street' | 'Rooftop' | 'Studio' | 'Mansion' | 'Club' | string;
export type Mood = 'Confident' | 'Aggressive' | 'Calm' | 'Mysterious' | 'Happy';

export interface Preset {
  id: string;
  name: string;
  subject: Subject;
  outfit: Outfit;
  location: Location;
  mood: Mood;
  mode: CreationMode;
}

export const PRESETS: Preset[] = [
  { id: 'hood-vlog', name: 'Hood Vlog', subject: 'Man', outfit: 'Streetwear', location: 'City street', mood: 'Confident', mode: 'camera' },
  { id: 'street-legend', name: 'Street Legend', subject: 'Man', outfit: 'Streetwear', location: 'City street', mood: 'Aggressive', mode: 'cinematic' },
  { id: 'luxury-boss', name: 'Luxury Boss', subject: 'Man', outfit: 'Luxury', location: 'Mansion', mood: 'Confident', mode: 'cinematic' },
  { id: 'crime-story', name: 'Crime Story', subject: 'Group', outfit: 'Streetwear', location: 'City street', mood: 'Mysterious', mode: 'cinematic' },
  { id: 'anime-protag', name: 'Anime Protagonist', subject: 'Person', outfit: 'Casual', location: 'Rooftop', mood: 'Confident', mode: 'animation' },
  { id: 'cartoon-story', name: 'Cartoon Story', subject: 'Group', outfit: 'Casual', location: 'Studio', mood: 'Happy', mode: 'animation' },
  { id: 'trap-cover', name: 'Trap Cover', subject: 'Man', outfit: 'Streetwear', location: 'Studio', mood: 'Aggressive', mode: 'coverart' },
  { id: 'luxury-cover', name: 'Luxury Cover', subject: 'Man', outfit: 'Luxury', location: 'Mansion', mood: 'Confident', mode: 'coverart' },
];

export interface AdvancedSettings {
  creativity: number;
  styleStrength: number;
  hdEnabled: boolean;
  lighting: 'natural' | 'dramatic' | 'neon' | 'flash';
}

export interface ReferenceImage {
  id: string;
  dataUrl: string;
  type: 'style' | 'subject';
  name: string;
}

export interface SceneTemplate {
  id: string;
  name: string;
  description?: string;
  subject: Subject;
  outfit: Outfit;
  location: Location;
  mood: Mood;
  mode: CreationMode;
  lighting?: 'natural' | 'dramatic' | 'neon' | 'flash';
}

export const SCENE_TEMPLATES: SceneTemplate[] = [
  { id: 'dark-alley', name: 'Dark Alley Confrontation', description: 'Tense street scene with dramatic neon lighting', subject: 'Man', outfit: 'Streetwear', location: 'City street', mood: 'Aggressive', mode: 'cinematic', lighting: 'neon' },
  { id: 'penthouse-flex', name: 'Penthouse Flex', description: 'Luxury lifestyle shot from a high-rise view', subject: 'Man', outfit: 'Luxury', location: 'Mansion', mood: 'Confident', mode: 'cinematic', lighting: 'natural' },
  { id: 'rooftop-anime', name: 'Rooftop Anime Hero', description: 'Dramatic anime hero pose at golden hour', subject: 'Person', outfit: 'Casual', location: 'Rooftop', mood: 'Confident', mode: 'animation', lighting: 'dramatic' },
  { id: 'studio-portrait', name: 'Studio Portrait', description: 'Clean professional portrait with flash', subject: 'Woman', outfit: 'Luxury', location: 'Studio', mood: 'Calm', mode: 'camera', lighting: 'flash' },
  { id: 'trap-single', name: 'Trap Single Cover', description: 'Bold centered cover art with text space', subject: 'Man', outfit: 'Streetwear', location: 'Studio', mood: 'Aggressive', mode: 'coverart', lighting: 'neon' },
  { id: 'group-squad', name: 'Squad Goals', description: 'Group shot with cinematic composition', subject: 'Group', outfit: 'Streetwear', location: 'City street', mood: 'Confident', mode: 'cinematic', lighting: 'dramatic' },
  { id: 'anime-villain', name: 'Anime Villain Arc', description: 'Dark mysterious anime antagonist', subject: 'Person', outfit: 'Luxury', location: 'Mansion', mood: 'Mysterious', mode: 'animation', lighting: 'neon' },
  { id: 'club-night', name: 'Club Night', description: 'Neon-lit party scene vibes', subject: 'Group', outfit: 'Athletic', location: 'Club', mood: 'Happy', mode: 'camera', lighting: 'neon' },
];

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  mode: CreationMode;
  timestamp: number;
  subject: Subject;
  outfit: Outfit;
  location: Location;
  mood: Mood;
}
  id: string;
  url: string;
  prompt: string;
  mode: CreationMode;
  timestamp: number;
  subject: Subject;
  outfit: Outfit;
  location: Location;
  mood: Mood;
}

interface AppState {
  mode: CreationMode;
  setMode: (mode: CreationMode) => void;
  subject: Subject;
  setSubject: (s: Subject) => void;
  outfit: Outfit;
  setOutfit: (o: Outfit) => void;
  location: Location;
  setLocation: (l: Location) => void;
  mood: Mood;
  setMood: (m: Mood) => void;
  customPrompt: string;
  setCustomPrompt: (p: string) => void;
  advancedSettings: AdvancedSettings;
  setAdvancedSettings: (s: Partial<AdvancedSettings>) => void;
  credits: number;
  generatedImages: GeneratedImage[];
  addGeneratedImage: (img: GeneratedImage) => void;
  isGenerating: boolean;
  setIsGenerating: (g: boolean) => void;
  applyPreset: (preset: Preset) => void;
  randomize: () => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  referenceImages: ReferenceImage[];
  addReferenceImage: (img: ReferenceImage) => void;
  removeReferenceImage: (id: string) => void;
  userTemplates: SceneTemplate[];
  saveUserTemplate: (name: string) => void;
  removeUserTemplate: (id: string) => void;
  applyTemplate: (template: SceneTemplate) => void;
}

const SUBJECTS: Subject[] = ['Person', 'Man', 'Woman', 'Group'];
const OUTFITS: Outfit[] = ['Streetwear', 'Casual', 'Luxury', 'Athletic'];
const LOCATIONS: Location[] = ['City street', 'Rooftop', 'Studio', 'Mansion', 'Club'];
const MOODS: Mood[] = ['Confident', 'Aggressive', 'Calm', 'Mysterious', 'Happy'];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const useAppStore = create<AppState>((set) => ({
  mode: 'cinematic',
  setMode: (mode) => set({ mode }),
  subject: 'Man',
  setSubject: (subject) => set({ subject }),
  outfit: 'Streetwear',
  setOutfit: (outfit) => set({ outfit }),
  location: 'City street',
  setLocation: (location) => set({ location }),
  mood: 'Confident',
  setMood: (mood) => set({ mood }),
  customPrompt: '',
  setCustomPrompt: (customPrompt) => set({ customPrompt }),
  advancedSettings: {
    creativity: 50,
    styleStrength: 70,
    hdEnabled: false,
    lighting: 'dramatic',
  },
  setAdvancedSettings: (s) =>
    set((state) => ({ advancedSettings: { ...state.advancedSettings, ...s } })),
  credits: 10,
  generatedImages: [],
  addGeneratedImage: (img) =>
    set((state) => ({ generatedImages: [img, ...state.generatedImages] })),
  isGenerating: false,
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  applyPreset: (preset) =>
    set({
      subject: preset.subject,
      outfit: preset.outfit,
      location: preset.location,
      mood: preset.mood,
      mode: preset.mode,
    }),
  randomize: () =>
    set({
      subject: pickRandom(SUBJECTS),
      outfit: pickRandom(OUTFITS),
      location: pickRandom(LOCATIONS),
      mood: pickRandom(MOODS),
    }),
  favorites: [],
  toggleFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.includes(id)
        ? state.favorites.filter((f) => f !== id)
        : [...state.favorites, id],
    })),
}));

export function buildPrompt(state: {
  mode: CreationMode;
  subject: Subject;
  outfit: Outfit;
  location: Location;
  mood: Mood;
  advancedSettings: AdvancedSettings;
}): string {
  const { mode, subject, outfit, location, mood, advancedSettings } = state;

  let base = `A ${mood.toLowerCase()} ${subject.toLowerCase()} wearing ${outfit.toLowerCase()} at a ${location.toLowerCase()}`;

  const modeEnhancements: Record<CreationMode, string> = {
    cinematic: ', dramatic cinematic lighting, 35mm lens, shallow depth of field, film still quality, color graded, anamorphic lens flare',
    camera: ', shot on iPhone 15 Pro, natural lighting, slight film grain, candid photography, realistic imperfections, high detail',
    animation: ', anime art style, clean linework, stylized cel-shading, vibrant colors, studio quality animation',
    coverart: ', centered composition, high contrast, space for text at top, album cover styling, bold typography space, professional graphic design',
  };

  base += modeEnhancements[mode];

  const lightingMap: Record<string, string> = {
    natural: ', soft natural sunlight',
    dramatic: ', dramatic chiaroscuro lighting',
    neon: ', neon city lights, cyberpunk glow',
    flash: ', camera flash, paparazzi style',
  };
  base += lightingMap[advancedSettings.lighting] || '';

  if (advancedSettings.hdEnabled) {
    base += ', ultra high resolution, 8K, extremely detailed';
  }

  return base;
}
