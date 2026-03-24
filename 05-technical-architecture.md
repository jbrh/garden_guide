# Technical Architecture

## Recommended stack
- React Native
- Expo
- TypeScript
- local persistence first
- Supabase later for accounts, sync, and shared gardens

## Why this stack
This app needs to support iPhone and Android. React Native with Expo is the best fit given:
- cross-platform requirement
- existing React experience
- need for camera access and QR scanning
- need for local-first persistence
- future Supabase integration

## Architecture principle
Start local-first. Add cloud later.

This reduces cost, complexity, and the chance of getting stuck before the app is useful.

## Phase 1 architecture

### Mobile app
- React Native app using Expo
- local SQLite database on device
- local image URIs for plant photos
- QR scanning through camera module

### No backend yet
At this stage there is:
- no auth
- no cloud sync
- no photo upload service
- no multi-user sharing

This phase should still be designed with future syncing in mind.

## Phase 2 architecture

### Supabase introduction
Add:
- Supabase Auth
- Postgres tables for gardens and plants
- Storage bucket for photos
- sync layer between local SQLite and remote records

### Why local plus cloud
The app should remain usable in the garden even with weak connectivity.

Local database provides:
- fast startup
- persistence
- offline use

Supabase provides:
- cross-device data access
- shared gardens later
- cloud backup
- photo storage

## Suggested project structure
```txt
src/
  components/
  screens/
  navigation/
  hooks/
  services/
    database/
    qr/
    photos/
    sync/
  models/
  types/
  utils/
```

## Suggested service boundaries

### database service
Responsibilities:
- initialize SQLite
- create schema
- CRUD for gardens and plants
- enforce QR uniqueness locally

### QR service
Responsibilities:
- launch scanning flow
- return scanned QR value
- validate format if needed

### photo service
Responsibilities:
- choose or capture image
- store local URI
- optionally compress later

### sync service - future
Responsibilities:
- push local changes to Supabase
- pull remote updates
- resolve sync metadata

## Local schema suggestion
Tables:
- `gardens`
- `plants`

Optional later:
- `sync_queue`
- `users`
- `garden_members`

## Supabase schema suggestion for later
Tables:
- `profiles`
- `gardens`
- `plants`
- `garden_members`

Storage:
- `plant-photos` bucket

## Important implementation advice
- do not wire in Supabase before the local app loop works
- get create -> assign QR -> scan -> view detail working first
- treat sync as a second major project, not part of the first milestone
