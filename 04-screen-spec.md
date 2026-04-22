# Screen Specification

## V1 minimum screens
- Home
- Scan
- Plant List
- Plant Detail
- Add/Edit Plant

## 1. Home Screen
Purpose:
- act as landing page
- make scanning easy
- provide entry points to browse plants and add a plant

Main UI elements:
- primary button: `Scan Plant`
- secondary button: `My Plants`
- secondary button: `Add Plant`
- optional garden name display near top

Future additions:
- recent scans
- quick stats
- garden switcher

## 2. Scan Screen
Purpose:
- open camera
- detect QR code
- route to plant detail

Behavior:
- camera preview is shown
- QR scanning is active
- if QR matches a plant, navigate to Plant Detail
- if QR does not match, show message: `This label is not assigned yet.`

Minimum UI elements:
- camera preview
- back button
- short instructional text
- fallback message area for unknown QR

Notes:
- keep this screen focused and uncluttered
- optimize later for zoom and scan distance if needed

## 3. Plant List Screen
Purpose:
- browse saved plants without scanning
- support search

Main UI elements:
- search input at top
- scrollable list of plant cards or rows
- add button

Each row should show:
- thumbnail or image placeholder
- common name
- botanical name or cultivar if available
- short description if available

Tap behavior:
- tapping a row opens Plant Detail

## 4. Plant Detail Screen
Purpose:
- show the information returned after scan or list selection

Top section:
- primary photo
- common name
- botanical name
- cultivar
- short description

Sections:
- Care basics
- Habitat value
- QR label
- Personal notes

Actions:
- Edit Plant
- optional Delete Plant in an overflow or confirmation flow

Notes:
- keep hierarchy strong
- keep section labels simple
- avoid an encyclopedic feel

## 5. Add/Edit Plant Screen
Purpose:
- create a new plant record or edit an existing one

Fields:
- Common name
- Botanical name
- Cultivar
- Short description
- Care basics
- Habitat value
- Personal notes
- Primary photo
- Assign QR label

Buttons:
- Save
- Cancel

QR assignment flow:
- user taps `Assign QR Label`
- a scanner opens
- scanned value is saved to the plant
- if already assigned elsewhere, show conflict message

## Recommended navigation flow

### Setup flow
Home -> Add Plant -> Save -> Assign QR Label -> Plant Detail

### Scan flow
Home -> Scan -> Plant Detail

### Browse flow
Home -> My Plants -> Plant Detail -> Edit Plant
