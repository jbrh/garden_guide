# Data Model

## Design principle
Keep the data model small in v1, but shape it so that it can grow into multi-garden and shared-garden support later.

## Recommended entity progression

### Earliest implementation
- Plant

### Better foundation even for early work
- Garden
- Plant

### Later shared-cloud version
- User
- Garden
- Plant
- GardenMember

## Recommended v1 local model

### Garden
A garden groups plants together.

Fields:
- `id: string`
- `name: string`
- `description?: string`
- `createdAt: datetime`
- `updatedAt: datetime`

Notes:
- In the earliest build, the app may only expose one garden.
- Still, keeping a Garden entity now will reduce pain later.

### Plant
A specific plant record in one garden.

Fields:
- `id: string`
- `gardenId: string`
- `commonName: string`
- `botanicalName?: string`
- `cultivar?: string`
- `shortDescription?: string`
- `careBasics?: string`
- `habitatValue?: string`
- `personalNotes?: string`
- `primaryPhotoUri?: string`
- `qrCodeValue?: string`
- `createdAt: datetime`
- `updatedAt: datetime`

## Required versus optional

### Required in v1 form
- `commonName`

### Strongly recommended but optional
- `shortDescription`
- `careBasics`
- `habitatValue`
- `primaryPhotoUri`
- `qrCodeValue`

## Constraints
- `qrCodeValue` should be unique within the app database when assigned
- a plant can have at most one assigned QR code in v1
- a plant belongs to one garden

## Future cloud model

### User
Fields:
- `id`
- `email`
- `displayName`
- `createdAt`

### GardenMember
Represents who can access a garden.

Fields:
- `id`
- `gardenId`
- `userId`
- `role` where role is one of `owner | editor | viewer`
- `createdAt`

This would support:
- Jenny owning her garden
- daughter owning her own garden
- daughter viewing Jenny's garden
- husband viewing Jenny's garden

## Example record

### Garden
```json
{
  "id": "garden_001",
  "name": "Jenny's Garden",
  "createdAt": "2026-03-24T12:00:00Z",
  "updatedAt": "2026-03-24T12:00:00Z"
}
```

### Plant
```json
{
  "id": "plant_001",
  "gardenId": "garden_001",
  "commonName": "Stella Cherry",
  "botanicalName": "Prunus avium",
  "cultivar": "Stella",
  "shortDescription": "Compact self-fertile cherry tree with spring blossom and summer fruit.",
  "careBasics": "Full sun. Water deeply in dry periods. Prune lightly after fruiting if needed.",
  "habitatValue": "Spring flowers support pollinators and fruit may attract birds.",
  "personalNotes": "Planted after moving to Seattle. Has stayed fairly compact.",
  "primaryPhotoUri": "file:///.../stella-cherry.jpg",
  "qrCodeValue": "QR-PLANT-0001",
  "createdAt": "2026-03-24T12:00:00Z",
  "updatedAt": "2026-03-24T12:00:00Z"
}
```
