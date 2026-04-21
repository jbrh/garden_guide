import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, shadows, spacing } from "@/constants/ui";
import type { Plant } from "@/types/domain";
import { PlantPhoto } from "@/components/PlantPhoto";

interface PlantCardProps {
  plant: Plant;
  onPress: () => void;
}

export function PlantCard({ plant, onPress }: PlantCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <PlantPhoto size={88} uri={plant.primaryPhotoUri} />
      <View style={styles.content}>
        <Text style={styles.name}>{plant.commonName}</Text>
        {plant.botanicalName ? (
          <Text style={styles.detail}>{plant.botanicalName}</Text>
        ) : null}
        {plant.cultivar ? <Text style={styles.detail}>{plant.cultivar}</Text> : null}
        <Text style={styles.location}>
          {plant.locationName ? plant.locationName : "Location not set"}
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
  location: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 6,
  },
});
