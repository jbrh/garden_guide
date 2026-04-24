# V1 Product Requirements Document

## Objective
Deliver a first usable version of the app that allows a user to bundle plant records from the Mac, assign QR labels to those records, scan labels on a phone, and view rich plant information during the tour.

## V1 success criteria
A user can:
1. prepare plant records on the Mac and bundle them into the app
2. assign a QR code to each plant record
3. scan the QR code in the garden
4. open the correct plant detail screen
5. read useful information about the plant
6. update the bundled plant data later from the Mac and ship a newer build

## Target platforms
- iPhone
- Android

## Recommended stack
- React Native
- Expo
- TypeScript

## Required v1 capabilities

### Plant management
- browse list of plants
- search list of plants by name
- refresh bundled plant content through newer builds

### QR support
- assign a QR label to a plant
- scan a QR label from the camera
- open the corresponding plant record
- handle unassigned QR labels gracefully
- prevent accidental duplicate QR assignment

### Plant detail display
The plant detail screen must show:
- common name
- botanical name if available
- cultivar if available
- primary photo if available
- short description
- care basics
- habitat value
- personal notes
- QR assignment status

### Persistence
- data must persist across app restarts
- user should not lose plant data after closing the app

## V1 user stories

### As a gardener
I want to prepare plant records on my Mac so that I can store practical and personal knowledge about the plants in my garden and ship that tour content to phones.

### As a gardener
I want to assign a QR label to a plant so that I can access that plant's information later by scanning the label.

### As a garden visitor or family member
I want to scan a plant label and quickly learn what the plant is and why it matters.

### As a gardener
I want to refine plant content on my Mac and ship updated builds so that the tour stays useful over time.

## V1 functional behavior

### Mac-authored content
Plant records are maintained in a bundled data file in the repo and synced into local SQLite on app launch.

### Assign label
QR labels are assigned in the bundled plant data so the correct plant opens when the label is scanned on a phone.

### Scan flow
From the Scan screen:
- if QR code matches a saved plant, open Plant Detail
- if QR code is unknown, show a message that the label is not assigned
- optionally offer a future path to assign it, but that can wait if needed

### Plant list
Display a scrollable list of saved plants with at least:
- thumbnail image or placeholder
- common name
- botanical name or cultivar if present
- short description if present

### Search
User can search by plant name.

## UX constraints
- keep the app simple and clear
- make scan action prominent
- keep plant detail readable and layered, not a wall of text
- optimize the phone UI for touring, not authoring

## V1 exclusions
Do not build these into the first milestone unless unexpectedly easy:
- multiple photos per plant
- task reminders
- observation timeline
- plant bed map
- real-time syncing
- garden sharing
- public cloud account system

## Suggested acceptance test for v1
1. Add a plant like Stella Cherry to the bundled garden data on the Mac
2. Fill in description, care, habitat, notes, and a QR code value
3. Launch the app so the bundled content syncs into SQLite
4. Return to home
5. Scan the same QR code
6. Confirm the correct plant detail page opens
7. Update one field in the bundled data, relaunch the app, and confirm the change appears on the device
