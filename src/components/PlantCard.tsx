import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, shadows, spacing } from "@/constants/ui";
import { getPlantPhotoSource } from "@/data/plantPhotoAssets";
import type { Plant } from "@/types/domain";
import { PlantPhoto } from "@/components/PlantPhoto";

interface PlantCardProps {
  plant: Plant;
  onPress: () => void;
}

export function PlantCard({ plant, onPress }: PlantCardProps) {
  const photoSource = getPlantPhotoSource(plant.id, plant.primaryPhotoUri);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      {photoSource ? <PlantPhoto size={88} source={photoSource} uri={plant.primaryPhotoUri} /> : null}
      <View style={styles.content}>
        <Text style={styles.name}>{plant.commonName}</Text>
        {plant.botanicalName ? (
          <Text style={styles.detail}>{plant.botanicalName}</Text>
        ) : null}
        {plant.cultivar ? <Text style={styles.cultivar}>{plant.cultivar}</Text> : null}
        <Text style={styles.summary}>
          {plant.shortDescription ? plant.shortDescription : "No description yet"}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md,
    ...shadows.card,
  },
  pressed: {
    opacity: 0.92,
  },
  content: {
    flex: 1,
    gap: 4,
    justifyContent: "center",
  },
  name: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "700",
  },
  detail: {
    color: colors.textMuted,
    fontSize: 14,
  },
  cultivar: {
    color: colors.textMuted,
    fontSize: 14,
    fontStyle: "italic",
  },
  summary: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 6,
  },
});
