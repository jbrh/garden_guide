# Garden Companion App - Project Docs

This folder contains the initial project documentation for a cross-platform garden app intended for iPhone and Android.

## Product idea
A user places weather-resistant QR labels in a garden. Scanning a label opens a plant record with plant identity, recognition notes, care basics, habitat value, location, planting date, and personal notes.

## Why this stack
The app should support both Jenny on iPhone and her daughter on Android, so the project is planned as a cross-platform mobile app.

Recommended stack:
- React Native
- Expo
- TypeScript
- Local persistence first
- Supabase later for shared cloud sync, auth, and photos

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
5. Paste the kickoff prompt into Codex and begin scaffolding

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
