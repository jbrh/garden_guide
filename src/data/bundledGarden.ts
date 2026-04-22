import type { CreatePlantInput } from "@/types/domain";

export interface BundledGardenDefinition {
  id: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
}

export interface BundledPlantDefinition
  extends Omit<CreatePlantInput, "gardenId"> {
  id: string;
}

export interface BundledGardenData {
  garden: BundledGardenDefinition;
  plants: BundledPlantDefinition[];
}

// Edit this file on your Mac to manage the canonical garden-tour content
// that ships with the app build.
export const bundledGardenData: BundledGardenData = {
  garden: {
    id: "garden_jenny_home",
    name: "Jenny Home Garden",
    description: "Bundled source-of-truth garden content for the tour app.",
    isActive: true,
  },
  plants: [
    {
      id: "plant_stella_cherry",
      commonName: "Stella Cherry",
      botanicalName: "Prunus avium",
      cultivar: "Stella",
      shortDescription:
        "Compact self-fertile cherry tree with spring blossom and summer fruit.",
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
      shortDescription:
        "Shrub with bright winter stems and clusters of white flowers.",
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
      shortDescription:
        "Perennial with deep purple flower spikes and aromatic foliage.",
      careBasics:
        "Full sun, average soil, deadhead after flowering for a second flush.",
      habitatValue:
        "Excellent nectar source for bees and other pollinators.",
      personalNotes:
        "A favorite for summer color near the path.",
      qrCodeValue: null,
      primaryPhotoUri: null,
    },
  ],
};
