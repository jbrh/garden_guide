# Implementation Roadmap

## Goal
Build the app in stages that preserve momentum and avoid early complexity.

## Milestone 0 - project setup
Tasks:
- create Expo app with TypeScript
- choose navigation library and scaffold base navigation
- set up folder structure
- add linting and formatting

Definition of done:
- app runs on iPhone and Android simulators or devices
- placeholder Home screen exists

## Milestone 1 - core data and screens
Tasks:
- create local SQLite schema for Garden and Plant
- build Home screen
- build Plant List screen
- build Plant Detail screen with mock data
- build Add/Edit Plant screen

Definition of done:
- user can create plant records locally
- plant list and detail screens work from local data

## Milestone 2 - QR assignment and scan loop
Tasks:
- add QR scanner screen
- add Assign QR Label flow from Add/Edit Plant screen
- enforce uniqueness of QR values locally
- route scanned QR to Plant Detail
- handle unknown QR

Definition of done:
- full local workflow works end to end
- create plant -> assign QR -> scan QR -> open plant detail

## Milestone 3 - polish and persistence validation
Tasks:
- improve form UX
- improve plant detail layout
- add search in Plant List
- validate persistence across app restarts
- test with several real plants and labels in the garden

Definition of done:
- app feels stable and useful for real garden use

## Milestone 4 - prepare for family use
Tasks:
- add support for multiple gardens locally
- add garden selector or hidden support as needed
- clean up data layer so sync can be added later

Definition of done:
- app can store more than one garden locally
- architecture is ready for cloud sync without large rewrite

## Milestone 5 - Supabase integration
Tasks:
- add auth
- create remote schema
- sync local and remote gardens and plants
- upload plant photos to cloud storage

Definition of done:
- same user's data can be restored or accessed beyond one phone

## Milestone 6 - garden sharing
Tasks:
- create shared-garden model
- invite viewer or editor
- allow access to another person's garden

Definition of done:
- one user can have own garden and also access a shared garden

## What to postpone aggressively
- plant recognition by image
- AR overlays
- elaborate reminders
- advanced analytics
- polished public launch features

## Advice for staying on track
- build the smallest full loop first
- do not let backend work delay the first usable version
- test in the real garden early
- assume several fields may change after actual use
