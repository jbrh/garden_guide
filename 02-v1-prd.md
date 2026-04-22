# V1 Product Requirements Document

## Objective
Deliver a first usable version of the app that allows a user to create plant records, assign QR labels, scan labels, and view or edit rich plant information.

## V1 success criteria
A user can:
1. create a plant record
2. assign a QR code to that plant
3. scan the QR code in the garden
4. open the correct plant detail screen
5. read useful information about the plant
6. edit the plant later

## Target platforms
- iPhone
- Android

## Recommended stack
- React Native
- Expo
- TypeScript

## Required v1 capabilities

### Plant management
- create plant
- edit plant
- delete plant
- browse list of plants
- search list of plants by name

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
I want to create a plant record so that I can store practical and personal knowledge about the plants in my garden.

### As a gardener
I want to assign a QR label to a plant so that I can access that plant's information later by scanning the label.

### As a garden visitor or family member
I want to scan a plant label and quickly learn what the plant is and why it matters.

### As a gardener
I want to update notes later so that the app stays useful over time.

## V1 functional behavior

### Create plant
User can enter plant details and optionally attach a photo.

### Assign label
User can scan a QR code from within the Add/Edit Plant screen to assign it to the current plant.

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
- keep add/edit form manageable

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
1. Create a plant called Stella Cherry
2. Fill in description, care, habitat, and notes
3. Assign a QR code
4. Return to home
5. Scan the same QR code
6. Confirm the correct plant detail page opens
7. Edit one field and confirm the change persists after app restart
