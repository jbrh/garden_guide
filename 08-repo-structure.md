# Garden App Repo Structure (Expo + React Native + TypeScript)

This document proposes a practical repo/file structure for a local-first Expo app that can later add Supabase sync.

## Goals of this structure

- Keep v1 simple and easy to understand
- Separate screens, components, and data logic
- Avoid overengineering while leaving room for growth
- Make it easy for Codex to scaffold code incrementally

## Recommended stack

- Expo
- React Native
- TypeScript
- Expo Router
- expo-sqlite
- expo-camera
- expo-image-picker

## Suggested repo structure

```text
garden-app/
├─ src/
│  ├─ app/
│  │  ├─ _layout.tsx
│  │  ├─ index.tsx                 # Home screen
│  │  ├─ scan.tsx                  # QR scan screen
│  │  ├─ plants/
│  │  │  ├─ index.tsx              # Plant list screen
│  │  │  ├─ new.tsx                # Add plant screen
│  │  │  ├─ [plantId].tsx          # Plant detail screen
│  │  │  └─ [plantId]/edit.tsx     # Edit plant screen
│  │  ├─ gardens/
│  │  │  ├─ index.tsx              # Garden list / switcher
│  │  │  ├─ new.tsx                # Add garden screen
│  │  │  └─ [gardenId].tsx         # Garden detail / overview
│  │  └─ settings.tsx              # Minimal settings screen (optional)
│  │
│  ├─ components/
│  │  ├─ AppButton.tsx
│  │  ├─ EmptyState.tsx
│  │  ├─ FieldRow.tsx
│  │  ├─ PlantCard.tsx
│  │  ├─ PlantPhoto.tsx
│  │  ├─ SectionCard.tsx
│  │  ├─ ScreenHeader.tsx
│  │  └─ TextInputField.tsx
│  │
│  ├─ data/
│  │  └─ bundledGarden.ts         # Mac-authored garden-tour content shipped with the app
│  │
│  ├─ db/
│  │  ├─ client.ts                 # sqlite connection setup
│  │  ├─ migrations.ts             # run schema migrations on launch
│  │  ├─ schema.sql                # starter schema for v1
│  │  └─ seed.ts                   # sync bundled garden content into SQLite on launch
│  │
│  ├─ constants/
│  │  ├─ routes.ts
│  │  └─ ui.ts
│  │
│  ├─ hooks/
│  │  ├─ useActiveGarden.ts
│  │  ├─ usePlant.ts
│  │  └─ usePlants.ts
│  │
│  ├─ repositories/
│  │  ├─ gardenRepository.ts
│  │  └─ plantRepository.ts
│  │
│  ├─ services/
│  │  └─ images/
│  │     └─ imagePickerService.ts
│  │
│  ├─ types/
│  │  ├─ database.ts
│  │  └─ domain.ts
│  │
│  └─ utils/
│     ├─ dates.ts
│     ├─ ids.ts
│     └─ validation.ts
│
├─ assets/
│  ├─ images/
│  └─ icons/
│
├─ docs/
│  ├─ 01-product-brief.md
│  ├─ 02-v1-prd.md
│  ├─ 03-data-model.md
│  ├─ 04-screen-spec.md
│  ├─ 05-technical-architecture.md
│  ├─ 06-implementation-roadmap.md
│  ├─ 07-codex-kickoff-prompt.md
│  ├─ 08-repo-structure.md
│  └─ 09-sqlite-schema-and-types.md
│
├─ package.json
├─ tsconfig.json
├─ app.json
└─ README.md
```

## Why Expo Router

Expo Router keeps navigation close to the file system, which makes it easier to reason about screens while you are learning mobile app structure.
In this repo, the route root lives in `src/app/`, which Expo Router supports directly.

## Suggested v1 screen mapping

- `src/app/index.tsx` → Home
- `src/app/scan.tsx` → Scan QR label
- `src/app/plants/index.tsx` → Plant list
- `src/app/plants/new.tsx` → Add plant
- `src/app/plants/[plantId].tsx` → Plant detail
- `src/app/plants/[plantId]/edit.tsx` → Edit plant
- `src/app/gardens/index.tsx` → Garden switcher

## Why include Gardens now

Even if v1 only uses one garden per user at first, it is worth including a `gardens` table and screen-level concept now because:

- you want your own garden and your daughter's garden in the long run
- future sharing is easier if plants always belong to a garden
- the app can still default to a single garden in the first release

## What can be postponed

These files or folders can be stubbed or omitted at first if you want the smallest possible prototype:

- `src/app/gardens/new.tsx`
- `src/app/gardens/[gardenId].tsx`
- `src/app/settings.tsx`
- a future `src/services/sync/`
- richer import/export tooling beyond `src/data/bundledGarden.ts`

## Minimal prototype repo shape

If you want an ultra-small starting point, this reduced structure is enough:

```text
garden-app/
├─ src/
│  ├─ app/
│  │  ├─ _layout.tsx
│  │  ├─ index.tsx
│  │  ├─ scan.tsx
│  │  ├─ plants/
│  │  │  ├─ index.tsx
│  │  │  ├─ new.tsx
│  │  │  ├─ [plantId].tsx
│  │  │  └─ [plantId]/edit.tsx
│  ├─ data/bundledGarden.ts
│  ├─ db/
│  │  ├─ client.ts
│  │  ├─ migrations.ts
│  │  ├─ schema.sql
│  │  └─ seed.ts
│  ├─ repositories/plantRepository.ts
│  ├─ hooks/usePlants.ts
│  └─ services/images/imagePickerService.ts
└─ README.md
```

## Guidance for Codex

When prompting Codex:

- Ask it to scaffold the smallest working version first
- Keep local SQLite as the source of truth for v1
- If the Mac is the source of truth for tour content, keep bundled plant data in a dedicated file and sync it into SQLite on launch
- Do not add Supabase yet unless explicitly requested
- Keep forms straightforward and avoid premature abstractions
- Prefer readable repository/query functions over generic data layers

## Recommended implementation order

1. Scaffold Expo app with Router and TypeScript
2. Create SQLite client and migrations runner
3. Create `gardens` and `plants` tables
4. Build Plant List screen
5. Build Add Plant form
6. Build Plant Detail screen
7. Build Edit Plant screen
8. Add QR scanning screen
9. Wire scan result to plant lookup by QR code
10. Add image picker for plant photo
11. Add basic garden switcher
12. Only then consider cloud sync
