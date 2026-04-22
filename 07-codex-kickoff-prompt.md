# Codex Kickoff Prompt

Use this prompt in VS Code to start scaffolding the app.

---

I want to build a cross-platform mobile app using React Native, Expo, and TypeScript.

Project concept:
A garden app where a user can scan a physical QR code attached to a plant marker and open a plant record with useful information about that exact plant.

Target platforms:
- iPhone
- Android

Important constraints:
- Keep v1 small and finishable
- Local-first architecture
- Use local SQLite persistence first
- Do not integrate Supabase yet unless specifically asked
- Structure the app so Supabase can be added later for auth, sync, storage, and shared gardens

Main v1 screens:
1. Home screen with buttons for Scan Plant, My Plants, and Add Plant
2. Scan screen using camera and QR scanning
3. Plant List screen with search
4. Plant Detail screen
5. Add/Edit Plant screen

Main entities:

Garden:
- id
- name
- description optional
- createdAt
- updatedAt

Plant:
- id
- gardenId
- commonName
- botanicalName optional
- cultivar optional
- shortDescription optional
- careBasics optional
- habitatValue optional
- personalNotes optional
- primaryPhotoUri optional
- qrCodeValue optional
- createdAt
- updatedAt

Core v1 behavior:
- create, edit, delete plant
- browse plants
- search plants by name
- assign QR code to a plant
- scan QR code and open matching plant detail
- show a friendly message when a scanned QR code is not assigned
- ensure QR code value is unique locally
- persist all data across app restarts

Requested deliverables for this first step:
1. Propose a clean Expo project structure
2. Scaffold navigation
3. Create TypeScript types for Garden and Plant
4. Create a local SQLite schema and data access layer
5. Generate the five screens with placeholder but realistic UI
6. Seed one sample garden and one sample plant
7. Document how to run the app locally

Please explain major decisions briefly as you go, but optimize for producing working scaffolded code.

---
