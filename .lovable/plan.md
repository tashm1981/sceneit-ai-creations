# Expand Prompt Templates + Add Category Filters

## What changes

**1. Grow `SCENE_TEMPLATES` from 8 → ~28 templates** in `src/lib/store.ts`

Add ~20 new templates spanning more genres so users have a real library to browse. Each gets a `category` field (new) plus existing fields (name, description, subject, outfit, location, mood, mode, lighting).

New categories and example templates:
- **Hip-Hop / Trap** — Drill Cypher, Studio Booth, Money Shot, Block Party
- **Luxury / Wealth** — Yacht Life, Private Jet, Supercar Pull-up
- **Anime / Manga** — Shonen Power-up, Slice of Life, Mecha Pilot, Magical Girl
- **Cinematic / Film** — Noir Detective, Western Standoff, Heist Crew, Sci-fi Runner
- **Fashion / Editorial** — High Fashion Flash, Vogue Cover, Streetwear Lookbook
- **Cover Art** — Lo-fi Chill Cover, Drill Mixtape, R&B Single, Rock EP
- **Lifestyle / Vlog** — Coffee Shop Morning, Gym Pump, Night Drive

(Existing 8 kept and tagged into the right categories.)

## New: category type + filter UI

In `src/lib/store.ts`:
- Add `TemplateCategory` type: `'hip-hop' | 'luxury' | 'anime' | 'cinematic' | 'fashion' | 'coverart' | 'lifestyle'`
- Add `category: TemplateCategory` to `SceneTemplate`
- Tag every template (existing + new) with a category

In `src/components/TemplateManager.tsx`:
- Above the template grid (premade tab only), add a horizontal scrollable chip row: `All` + one chip per category
- Local `useState` for `selectedCategory`, defaults to `'all'`
- Filter `SCENE_TEMPLATES` by selected category before rendering
- Style chips to match existing `PresetChips` look (rounded-full, gradient when active)
- "My Templates" tab unchanged

## Files touched

- `src/lib/store.ts` — add category type, expand `SCENE_TEMPLATES`
- `src/components/TemplateManager.tsx` — add filter chip row + filtering logic

## Out of scope

- Featured section on landing/Create home (option 3) — skipped per your choice
- Community/shared templates (option 4) — skipped per your choice
- Thumbnail previews — text cards only, matches current design

Approve and I'll implement.