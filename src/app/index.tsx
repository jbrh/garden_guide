import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppButton } from "@/components/AppButton";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SectionCard } from "@/components/SectionCard";
import { colors, spacing } from "@/constants/ui";
import { routes } from "@/constants/routes";
import { useActiveGarden } from "@/hooks/useActiveGarden";

export default function HomeScreen() {
  const { garden, isLoading, error } = useActiveGarden();

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader
          eyebrow="Garden Companion"
          subtitle="Scan a label or browse the plant list for the current garden."
          title="A field guide for your own garden"
        />

        <SectionCard>
          {isLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <>
              <Text style={styles.gardenLabel}>Active garden</Text>
              <Text style={styles.gardenName}>
                {garden?.name ?? "No garden available"}
              </Text>
              {garden?.description ? (
                <Text style={styles.gardenDescription}>{garden.description}</Text>
              ) : null}
              {error ? <Text style={styles.error}>{error}</Text> : null}
            </>
          )}
        </SectionCard>

        <View style={styles.actions}>
          <AppButton
            label="Scan Plant"
            onPress={() => router.push(routes.scan)}
          />
          <AppButton
            label="Plant List"
            onPress={() => router.push(routes.plantList)}
            variant="secondary"
          />
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
    gap: spacing.xl,
    padding: spacing.lg,
  },
  gardenLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  gardenName: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800",
  },
  gardenDescription: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    gap: spacing.md,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: "600",
  },
});
