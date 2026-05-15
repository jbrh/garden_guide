# Garden Companion

This repo now contains both the project docs and the first-pass Expo/React Native scaffold for the Garden Companion mobile app.

## Product idea
A user places weather-resistant QR labels in a garden. Scanning a label opens a plant record with plant identity, care basics, habitat value, photos, and personal notes.

## Current project state
- Product and implementation docs are in the repo root as the source of truth.
- App code lives under `src/`, with Expo Router routes in `src/app/`.
- The SQLite schema, bundled multi-garden sync, repositories, and tour-focused screens are in place.
- `package.json` and `package-lock.json` are committed, but you still need to run `npm install` in a fresh clone before starting the app.

## Why this stack
The app should support both Jenny on iPhone and her daughter on Android, so the project is planned as a cross-platform mobile app.

Recommended stack:
- React Native
- Expo
- Expo Router
- TypeScript
- SQLite for local persistence first
- Supabase later for shared cloud sync, auth, and photos

## Scaffolded app areas
- `src/app/` - the single Expo Router route root for Home, Scan, Plant List, and Plant Detail
- `src/components/` - shared UI pieces
- `src/data/` - bundled garden-tour content authored on the Mac and synced into the app database
- `src/db/` - SQLite client, migrations, schema, and bundled-content sync logic
- `src/repositories/` - garden and plant query / active-garden functions
- `src/hooks/` - hooks for active garden, all gardens, plant list, and plant detail loading
- `src/types/` - domain and SQLite row typing
- `src/utils/` - ids, date formatting, and small validation helpers

## Install
From the repo root:
1. `npm install`
2. `npx expo install --fix`

## Run locally
For the normal dev server:
1. `npx expo start`

For the iPhone development build that is already set up for this project:
1. `npx expo start --dev-client`
2. open the installed Garden Companion dev build on the phone

Notes:
- the Mac and iPhone should be on the same Wi-Fi
- stop the dev server with `Ctrl+C`
- Metro reloads JavaScript and most asset changes, but not native config changes

## Build for iPhone
This project is currently using an Expo development build rather than Expo Go.

Prerequisites:
- Apple Developer account
- `eas-cli` installed: `npm install -g eas-cli`
- logged in to Expo: `eas login`

Build command:
1. `eas build --platform ios --profile development`

After the build finishes:
1. open the install link on the iPhone
2. install the build
3. if iOS still shows an older icon or stale native assets, delete the app and reinstall

You need a new build when changing native app config such as:
- app icon
- iOS permission strings in `app.json`
- Expo plugins

You do not need a new build for normal content and UI work such as:
- `src/data/bundledGarden.ts`
- most screen/layout changes
- bundled plant-photo asset mapping

## Bundled garden content
If your Mac is the source of truth for the tour, edit [src/data/bundledGarden.ts](/Users/jenny/Documents/garden_guide/src/data/bundledGarden.ts:1).

How it works:
- the app upserts all bundled gardens and their plants into local SQLite on launch
- stable `id` values let newer builds update the same records on devices
- stable `qrCodeValue` values keep label assignments attached to the intended plants
- plants removed from the bundled file are also removed from that bundled garden on device
- the currently active bundled garden is preserved across launches if it still exists in the bundle

Practical workflow:
1. update `src/data/bundledGarden.ts` on the Mac
2. for normal content/UI changes, run `npx expo start --dev-client`
3. for native config changes, build a new app version with EAS
4. launch the app so the bundled data syncs into the device database

## Bundled plant photos
Place plant photos in:
- `assets/plant-photos/`

Use this convention:
- one photo per plant
- filename matches the plant `id`
- use `.jpg` for normal photos

After adding a file, also add it to:
- [src/data/plantPhotoAssets.ts](/Users/jenny/Documents/garden_guide/src/data/plantPhotoAssets.ts:1)

## Documents in this folder
- `01-product-brief.md` - concise statement of the product, audience, scope, and goals
- `02-v1-prd.md` - product requirements document for the first version
- `03-data-model.md` - core entities, fields, and relationships
- `04-screen-spec.md` - minimum app screens and behavior
- `05-technical-architecture.md` - recommended implementation approach and staging
- `06-implementation-roadmap.md` - suggested development phases and milestones
- `07-codex-kickoff-prompt.md` - a starter prompt to paste into Codex in VS Code
- `08-repo-structure.md` - proposed Expo app structure and file organization
- `09-sqlite-schema-and-types.md` - initial SQLite schema and app-facing TypeScript types

## Suggested order of use
1. Read the product brief
2. Review the v1 PRD
3. Review the data model and screen spec
4. Use the technical architecture and roadmap to guide implementation
5. Review the scaffolded app files and continue implementation incrementally

## Important scope decision
Keep v1 small enough to finish.

That means v1 should focus on:
- bundled gardens authored on the Mac
- plant records
- QR scanning
- plant detail display
- garden switching on device

The app should be designed so multi-garden and shared-garden features can be added later without a major rewrite.
