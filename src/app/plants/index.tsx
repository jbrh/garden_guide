import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState } from "@/components/EmptyState";
import { PlantCard } from "@/components/PlantCard";
import { ScreenHeader } from "@/components/ScreenHeader";
import { TextInputField } from "@/components/TextInputField";
import { colors, radii, spacing } from "@/constants/ui";
import { routes } from "@/constants/routes";
import { useActiveGarden } from "@/hooks/useActiveGarden";
import { usePlants } from "@/hooks/usePlants";
import { useState } from "react";

export default function PlantListScreen() {
  const [query, setQuery] = useState("");
  const { garden, isLoading: isGardenLoading } = useActiveGarden();
  const { plants, isLoading, error } = usePlants(garden?.id, query);

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace(routes.home)}
          style={({ pressed }) => [
            styles.homeLink,
            pressed && styles.homeLinkPressed,
          ]}
        >
          <Text style={styles.homeLinkText}>{"< Home"}</Text>
        </Pressable>

        <ScreenHeader
          subtitle="Browse plants in the active garden or search by name, botanical name, or cultivar."
          title="Plant List"
        />

        <TextInputField
          label="Search"
          onChangeText={setQuery}
          placeholder="Search plants"
          value={query}
        />

        {isGardenLoading || isLoading ? (
          <ActivityIndicator color={colors.primary} />
        ) : null}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {!isLoading && plants.length === 0 ? (
          <EmptyState
            description={
              query.trim()
                ? "Try a different search term."
                : "No bundled plants are available in the current garden."
            }
            title={query.trim() ? "No matching plants" : "No plants yet"}
          />
        ) : null}

        <View style={styles.list}>
          {plants.map((plant) => (
            <PlantCard
              key={plant.id}
              onPress={() => router.push(routes.plantDetail(plant.id, "List"))}
              plant={plant}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    gap: spacing.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  homeLink: {
    alignSelf: "flex-start",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    justifyContent: "center",
    marginBottom: -4,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
  },
  homeLinkPressed: {
    opacity: 0.72,
  },
  homeLinkText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  list: {
    gap: spacing.md,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: "600",
  },
});
