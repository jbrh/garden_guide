import type { ImageSourcePropType } from "react-native";

const bundledPlantPhotoAssets: Record<string, ImageSourcePropType> = {
  deer_fern: require("../../assets/plant-photos/deer_fern.jpeg"),
  lady_fern_limelight: require("../../assets/plant-photos/lady_fern_limelight.jpeg"),
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
