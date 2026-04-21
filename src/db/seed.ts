import type { SQLiteDatabase } from "expo-sqlite";

import { getNowIsoString } from "@/utils/dates";

const SAMPLE_GARDEN_ID = "garden_jenny_home";

export async function seedDatabase(db: SQLiteDatabase): Promise<void> {
  const row = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) AS count FROM gardens;",
  );

  if ((row?.count ?? 0) > 0) {
    return;
  }

  const now = getNowIsoString();

  await db.runAsync(
    `INSERT INTO gardens (id, name, description, is_active, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?);`,
    SAMPLE_GARDEN_ID,
    "Jenny Home Garden",
    "Local starter garden for development and first-pass testing.",
    1,
    now,
    now,
  );

  const samplePlants = [
    {
      id: "plant_stella_cherry",
      commonName: "Stella Cherry",
      botanicalName: "Prunus avium",
      cultivar: "Stella",
      locationName: "Front border west",
      datePlanted: "2024-03-10",
      shortDescription:
        "Compact self-fertile cherry tree with spring blossom and summer fruit.",
      recognitionNotes:
        "Small cherry tree with white spring flowers and glossy leaves.",
      careBasics:
        "Full sun. Water deeply during dry spells and prune lightly after fruiting.",
      habitatValue:
        "Spring blossom supports pollinators and the fruit attracts birds.",
      personalNotes:
        "Planted after moving in. It has stayed compact and reliable.",
      qrCodeValue: "QR-PLANT-0001",
      primaryPhotoUri: null,
    },
    {
      id: "plant_red_twig_dogwood",
      commonName: "Red Twig Dogwood",
      botanicalName: "Cornus sericea",
      cultivar: null,
      locationName: "Rain garden edge",
      datePlanted: "2023-10-02",
      shortDescription:
        "Shrub with bright winter stems and clusters of white flowers.",
      recognitionNotes:
        "Look for vivid red stems in winter and broad opposite leaves in summer.",
      careBasics:
        "Prefers moisture. Prune oldest stems every few years to keep color bright.",
      habitatValue:
        "Flowers support pollinators and berries are useful to birds.",
      personalNotes:
        "Handles the wet patch well and makes the bed look alive in winter.",
      qrCodeValue: "QR-PLANT-0002",
      primaryPhotoUri: null,
    },
    {
      id: "plant_salvia_caradonna",
      commonName: "Salvia",
      botanicalName: "Salvia nemorosa",
      cultivar: "Caradonna",
      locationName: "South pollinator strip",
      datePlanted: "2025-04-18",
      shortDescription:
        "Perennial with deep purple flower spikes and aromatic foliage.",
      recognitionNotes:
        "Dark stems and upright violet blooms above narrow green leaves.",
      careBasics:
        "Full sun, average soil, deadhead after flowering for a second flush.",
      habitatValue:
        "Excellent nectar source for bees and other pollinators.",
      personalNotes:
        "A favorite for summer color near the path.",
      qrCodeValue: null,
      primaryPhotoUri: null,
    },
  ];

  for (const plant of samplePlants) {
    await db.runAsync(
      `INSERT INTO plants (
        id,
        garden_id,
        common_name,
        botanical_name,
        cultivar,
        location_name,
        date_planted,
        short_description,
        recognition_notes,
        care_basics,
        habitat_value,
        personal_notes,
        qr_code_value,
        primary_photo_uri,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      plant.id,
      SAMPLE_GARDEN_ID,
      plant.commonName,
      plant.botanicalName,
      plant.cultivar,
      plant.locationName,
      plant.datePlanted,
      plant.shortDescription,
      plant.recognitionNotes,
      plant.careBasics,
      plant.habitatValue,
      plant.personalNotes,
      plant.qrCodeValue,
      plant.primaryPhotoUri,
      now,
      now,
    );
  }
}
