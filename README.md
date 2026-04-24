# Garden Companion

This repo now contains both the project docs and the first-pass Expo/React Native scaffold for the Garden Companion mobile app.

## Product idea
A user places weather-resistant QR labels in a garden. Scanning a label opens a plant record with plant identity, care basics, habitat value, photos, and personal notes.

## Current project state
- Product and implementation docs are in the repo root as the source of truth.
- App code lives under `src/`, with Expo Router routes in `src/app/`.
- The SQLite schema, bundled garden-content sync, repositories, and v1 screens are scaffolded.
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
- `src/app/` - the single Expo Router route root for Home, Scan, Plant List, Plant Detail, Add Plant, and Edit Plant
- `src/components/` - shared UI pieces and the reusable plant form
- `src/data/` - bundled garden-tour content authored on the Mac and synced into the app database
- `src/db/` - SQLite client, migrations, schema, and bundled-content sync logic
- `src/repositories/` - garden and plant CRUD/query functions
- `src/hooks/` - hooks for active garden, plant list, and plant detail loading
- `src/services/images/` - photo picker helper
- `src/types/` - domain and SQLite row typing
- `src/utils/` - ids, date formatting, and small validation helpers

## Safe next setup step
When you are ready to install dependencies, review `package.json` first and then run the install step from the VS Code terminal.

Typical next commands:
1. `npm install`
2. `npx expo install --fix`
3. `npx expo start`

## Bundled garden content
If your Mac is the source of truth for the tour, edit [src/data/bundledGarden.ts](/Users/jenny/Documents/garden_guide/src/data/bundledGarden.ts:1).

How it works:
- the app upserts that bundled garden and its plants into local SQLite on launch
- stable `id` values let newer builds update the same records on devices
- stable `qrCodeValue` values keep label assignments attached to the intended plants
- plants removed from the bundled file are also removed from that bundled garden on device, so the Mac-authored file stays the exact source of truth

Practical workflow:
1. update `src/data/bundledGarden.ts` on the Mac
2. run the simulator or build a new app version
3. install that updated build on the phones
4. launch the app so the bundled data syncs into the device database

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
- one garden per user locally
- plant records
- QR label assignment
- QR scanning
- plant detail display
- basic edit flow

The app should be designed so multi-garden and shared-garden features can be added later without a major rewrite.
