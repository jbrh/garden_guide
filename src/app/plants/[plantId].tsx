import {
  ActivityIndicator,
  Modal,
  Pressable,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
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
  const params = useLocalSearchParams<{ plantId?: string; backLabel?: string }>();
  const navigation = useNavigation();
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const plantId = getParamValue(params.plantId);
  const backLabel = getParamValue(params.backLabel) ?? "Home";
  const { plant, isLoading, error } = usePlant(plantId);
  const botanicalSearchQuery = plant?.botanicalName
    ? [plant.botanicalName, plant.cultivar].filter(Boolean).join(" ")
    : null;

  useEffect(() => {
    navigation.setOptions({
      headerBackTitle: backLabel,
    });
  }, [backLabel, navigation]);

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
            <Pressable
              accessibilityRole="button"
              onPress={() => setIsPhotoOpen(true)}
              style={({ pressed }) => [
                styles.photoTrigger,
                pressed && styles.photoTriggerPressed,
              ]}
            >
              <PlantPhoto size={140} source={photoSource} uri={plant.primaryPhotoUri} />
            </Pressable>
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

      {photoSource ? (
        <Modal
          animationType="fade"
          onRequestClose={() => setIsPhotoOpen(false)}
          transparent
          visible={isPhotoOpen}
        >
          <SafeAreaView edges={["top", "bottom"]} style={styles.photoModalScreen}>
            <Pressable
              onPress={() => setIsPhotoOpen(false)}
              style={styles.photoModalBackdrop}
            />
            <View style={styles.photoModalContent}>
              <View style={styles.photoModalImageWrap}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setIsPhotoOpen(false)}
                  style={({ pressed }) => [
                    styles.photoCloseButton,
                    pressed && styles.photoCloseButtonPressed,
                  ]}
                >
                  <Text style={styles.photoCloseLabel}>X</Text>
                </Pressable>
                <PlantPhoto size={320} source={photoSource} uri={plant.primaryPhotoUri} />
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      ) : null}
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
  photoTrigger: {
    alignSelf: "flex-start",
  },
  photoTriggerPressed: {
    opacity: 0.92,
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
  photoModalScreen: {
    backgroundColor: "rgba(20, 28, 22, 0.92)",
    flex: 1,
  },
  photoModalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  photoModalContent: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: spacing.lg,
  },
  photoModalImageWrap: {
    position: "relative",
  },
  photoCloseButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    left: 10,
    position: "absolute",
    top: 10,
    width: 44,
    zIndex: 1,
  },
  photoCloseButtonPressed: {
    opacity: 0.84,
  },
  photoCloseLabel: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 20,
  },
});
