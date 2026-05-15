import type { ImageSourcePropType } from "react-native";

const bundledPlantPhotoAssets: Record<string, ImageSourcePropType> = {
  brunnera_alexanders_great: require("../../assets/plant-photos/brunnera_alexanders_great.jpg"),
  campion_rose: require("../../assets/plant-photos/campion_rose.jpg"),
  deer_fern: require("../../assets/plant-photos/deer_fern.jpeg"),
  geranium_rozanne: require("../../assets/plant-photos/geranium_rozanne.jpg"),
  geum_starkers_magnificent: require("../../assets/plant-photos/geum_starkers_magnificent.jpg"),
  grape_canadice: require("../../assets/plant-photos/grape_canadice.jpg"),
  lady_fern_limelight: require("../../assets/plant-photos/lady_fern_limelight.jpeg"),
  rose_zepherine_drouhin: require("../../assets/plant-photos/rose_zepherine_drouhin.jpg"),
  saber_fern: require("../../assets/plant-photos/saber_fern.jpeg"),
  sword_fern: require("../../assets/plant-photos/sword_fern.jpeg"),
  tassel_fern: require("../../assets/plant-photos/tassel_fern.jpeg"),
  wood_fern_jurassic_gold: require("../../assets/plant-photos/wood_fern_jurassic_gold.jpeg"),
  wood_fern_tokyo: require("../../assets/plant-photos/wood_fern_tokyo.jpeg"),
};

export function getPlantPhotoSource(
  plantId: string,
  primaryPhotoUri?: string | null,
): ImageSourcePropType | null {
  if (primaryPhotoUri) {
    return { uri: primaryPhotoUri };
  }

  return bundledPlantPhotoAssets[plantId] ?? null;
}
