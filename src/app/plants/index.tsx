import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppButton } from "@/components/AppButton";
import { EmptyState } from "@/components/EmptyState";
import { PlantCard } from "@/components/PlantCard";
import { ScreenHeader } from "@/components/ScreenHeader";
import { TextInputField } from "@/components/TextInputField";
import { colors, spacing } from "@/constants/ui";
import { routes } from "@/constants/routes";
import { useActiveGarden } from "@/hooks/useActiveGarden";
import { usePlants } from "@/hooks/usePlants";
import { useState } from "react";

export default function PlantListScreen() {
  const [query, setQuery] = useState("");
  const { garden, isLoading: isGardenLoading } = useActiveGarden();
  const { plants, isLoading, error } = usePlants(garden?.id, query);

  return (
    <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader
          subtitle="Browse plants in the active garden or search by name, cultivar, or location."
          title="My Plants"
        />

        <TextInputField
          label="Search"
          onChangeText={setQuery}
          placeholder="Search plants"
          value={query}
        />

        <AppButton
          label="Add Plant"
          onPress={() => router.push(routes.plantNew)}
          variant="secondary"
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
                : "Add a plant to start building your local garden guide."
            }
            title={query.trim() ? "No matching plants" : "No plants yet"}
          />
        ) : null}

        <View style={styles.list}>
          {plants.map((plant) => (
            <PlantCard
              key={plant.id}
              onPress={() => router.push(routes.plantDetail(plant.id))}
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
  list: {
    gap: spacing.md,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: "600",
  },
});
