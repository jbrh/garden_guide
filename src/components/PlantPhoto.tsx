import { Image, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/ui";

interface PlantPhotoProps {
  uri: string | null | undefined;
  size?: number;
}

export function PlantPhoto({ uri, size = 96 }: PlantPhotoProps) {
  if (!uri) {
    return (
      <View style={[styles.placeholder, { width: size, height: size }]}>
        <Text style={styles.placeholderText}>No photo</Text>
      </View>
    );
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
  placeholder: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: "center",
  },
  placeholderText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
});
