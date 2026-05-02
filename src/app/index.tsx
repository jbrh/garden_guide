import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from "react-native";

import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppButton } from "@/components/AppButton";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SectionCard } from "@/components/SectionCard";
import { colors, spacing } from "@/constants/ui";
import { routes } from "@/constants/routes";
import { useActiveGarden } from "@/hooks/useActiveGarden";
import { useGardens } from "@/hooks/useGardens";

export default function HomeScreen() {
  const { garden, isLoading, error, refresh } = useActiveGarden();
  const {
    gardens,
    isLoading: areGardensLoading,
    error: gardensError,
    setActiveGarden,
  } = useGardens();

  async function handleActivateGarden(gardenId: string) {
    await setActiveGarden(gardenId);
    await refresh();
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader
          eyebrow="Garden Companion"
          subtitle="Scan a label or browse the plant list for the current garden."
          title="A field guide to your garden"
          eyebrowStyle={styles.headerEyebrow}
          titleStyle={styles.headerTitle}
          subtitleStyle={styles.headerSubtitle}
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
              {error ? <Text style={styles.error}>{error}</Text> : null}
            </>
          )}
        </SectionCard>

        {!areGardensLoading && gardens.length > 1 ? (
          <SectionCard title="Gardens">
            <Text style={styles.gardenSwitchDescription}>
              Choose which bundled garden you want to tour right now.
            </Text>
            <View style={styles.gardenSwitchList}>
              {gardens.map((availableGarden) => {
                const isActiveGarden = availableGarden.id === garden?.id;

                return (
                  <AppButton
                    key={availableGarden.id}
                    disabled={isActiveGarden}
                    label={availableGarden.name}
                    onPress={() => {
                      void handleActivateGarden(availableGarden.id);
                    }}
                    variant={isActiveGarden ? "primary" : "secondary"}
                  />
                );
              })}
            </View>
            {gardensError ? <Text style={styles.error}>{gardensError}</Text> : null}
          </SectionCard>
        ) : null}

        <View style={styles.actions}>
          <AppButton
            label="Scan Plant"
            onPress={() => router.push(routes.scan)}
            variant="accent"
          />
          <AppButton
            label="Plant List"
            onPress={() => router.push(routes.plantList)}
            variant="secondary"
          />
        </View>

        <View style={styles.brandMarkWrap}>
          <Image
            source={require("../../assets/app-icon.png")}
            style={styles.brandMark}
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
  headerEyebrow: {
    fontSize: 15,
    letterSpacing: 1.1,
    marginBottom: spacing.xs,
  },
  headerTitle: {
    marginBottom: spacing.sm,
  },
  headerSubtitle: {
    lineHeight: 26,
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
  gardenSwitchDescription: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  gardenSwitchList: {
    gap: spacing.md,
  },
  actions: {
    gap: spacing.lg,
    marginTop: spacing.xs,
  },
  brandMarkWrap: {
    alignItems: "center",
    paddingTop: spacing.lg,
  },
  brandMark: {
    borderRadius: 28,
    height: 112,
    opacity: 0.78,
    width: 112,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: "600",
  },
});
