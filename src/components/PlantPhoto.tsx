import { Image, StyleSheet } from "react-native";

import { colors } from "@/constants/ui";

interface PlantPhotoProps {
  uri: string | null | undefined;
  size?: number;
}

export function PlantPhoto({ uri, size = 96 }: PlantPhotoProps) {
  if (!uri) {
    return null;
  }

  return (
    <Image
      resizeMode="cover"
      source={{ uri }}
      style={[styles.image, { width: size, height: size }]}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 18,
  },
});
