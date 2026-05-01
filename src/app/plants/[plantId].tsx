import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppButton } from "@/components/AppButton";
import { EmptyState } from "@/components/EmptyState";
import { FieldRow } from "@/components/FieldRow";
import { PlantPhoto } from "@/components/PlantPhoto";
import { SectionCard } from "@/components/SectionCard";
import { ScreenHeader } from "@/components/ScreenHeader";
import { colors, spacing } from "@/constants/ui";
import { getPlantPhotoSource } from "@/data/plantPhotoAssets";
import { usePlant } from "@/hooks/usePlant";
import { getParamValue } from "@/utils/validation";

export default function PlantDetailScreen() {
  const params = useLocalSearchParams<{ plantId?: string }>();
  const plantId = getParamValue(params.plantId);
  const { plant, isLoading, error } = usePlant(plantId);
  const botanicalSearchQuery = plant?.botanicalName
    ? [plant.botanicalName, plant.cultivar].filter(Boolean).join(" ")
    : null;

  if (isLoading) {
    return (
      <SafeAreaView edges={["bottom"]} style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </SafeAreaView>
    );
  }

  if (!plant) {
    return (
      <SafeAreaView edges={["bottom"]} style={styles.centered}>
        <EmptyState
          description={error ?? "The requested plant could not be found."}
          title="Plant not found"
        />
      </SafeAreaView>
    );
  }

  const photoSource = getPlantPhotoSource(plant.id, plant.primaryPhotoUri);

  return (
    <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          {photoSource ? (
            <PlantPhoto size={140} source={photoSource} uri={plant.primaryPhotoUri} />
          ) : null}
          <View style={styles.heroText}>
            <ScreenHeader
              eyebrow="Plant detail"
              subtitle={plant.shortDescription ?? "No short description yet."}
              title={plant.commonName}
              titleStyle={styles.heroTitle}
              subtitleStyle={styles.heroSubtitle}
            />
            {plant.botanicalName ? (
              <Text style={styles.botanicalName}>{plant.botanicalName}</Text>
            ) : null}
            {plant.cultivar ? <Text style={styles.cultivar}>{plant.cultivar}</Text> : null}
          </View>
        </View>

        {botanicalSearchQuery ? (
          <AppButton
            label="Search Google"
            onPress={() => {
              void Linking.openURL(
                `https://www.google.com/search?q=${encodeURIComponent(
                  botanicalSearchQuery,
                )}`,
              );
            }}
            variant="secondary"
          />
        ) : null}

        <SectionCard title="Care">
          <FieldRow
            label="Care basics"
            value={plant.careBasics ?? "No care notes yet."}
          />
        </SectionCard>

        <SectionCard title="Habitat value">
          <FieldRow
            label="Ecological role"
            value={plant.habitatValue ?? "No habitat notes yet."}
          />
        </SectionCard>

        <SectionCard title="Label">
          <FieldRow
            label="QR label"
            value={plant.qrCodeValue ?? "No QR label assigned"}
          />
        </SectionCard>

        <SectionCard title="Personal notes">
          <FieldRow
            label="Notes"
            value={plant.personalNotes ?? "No personal notes yet."}
          />
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  centered: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
    padding: spacing.lg,
  },
  content: {
    gap: spacing.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    gap: spacing.lg,
    padding: spacing.lg,
  },
  heroText: {
    gap: spacing.sm,
  },
  heroTitle: {
    color: colors.text,
  },
  heroSubtitle: {
    color: colors.textMuted,
  },
  botanicalName: {
    color: colors.textMuted,
    fontSize: 17,
    fontStyle: "italic",
  },
  cultivar: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: "700",
    fontStyle: "italic",
  },
});
