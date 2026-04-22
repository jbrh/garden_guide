import { useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";

import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { SafeAreaView } from "react-native-safe-area-context";

import { PlantForm } from "@/components/PlantForm";
import { ScreenHeader } from "@/components/ScreenHeader";
import { colors, spacing } from "@/constants/ui";
import { routes } from "@/constants/routes";
import { useActiveGarden } from "@/hooks/useActiveGarden";
import { createPlant } from "@/repositories/plantRepository";
import { pickPlantImageAsync } from "@/services/images/imagePickerService";
import {
  emptyPlantFormValues,
  type PlantFormValues,
} from "@/types/domain";

export default function NewPlantScreen() {
  const db = useSQLiteContext();
  const { garden } = useActiveGarden();
  const [values, setValues] = useState<PlantFormValues>(emptyPlantFormValues);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function setField(field: keyof PlantFormValues, value: string | null) {
    setValues((current) => ({ ...current, [field]: value ?? "" }));
  }

  async function handlePickImage() {
    const uri = await pickPlantImageAsync();

    if (uri) {
      setValues((current) => ({ ...current, primaryPhotoUri: uri }));
    }
  }

  async function handleSubmit() {
    if (!garden) {
      setError("No active garden is available.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const plant = await createPlant(db, {
        gardenId: garden.id,
        commonName: values.commonName,
        botanicalName: values.botanicalName,
        cultivar: values.cultivar,
        shortDescription: values.shortDescription,
        careBasics: values.careBasics,
        habitatValue: values.habitatValue,
        personalNotes: values.personalNotes,
        qrCodeValue: values.qrCodeValue,
        primaryPhotoUri: values.primaryPhotoUri,
      });

      router.replace(routes.plantDetail(plant.id));
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to save the plant.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader
          subtitle="Create a new plant record in the active garden. Save first, then scan a QR label if you want to assign one with the camera."
          title="Add Plant"
        />
        <PlantForm
          assignQrDisabled
          assignQrHint="Save the plant first if you want to assign a QR label by scanning it."
          error={error}
          isSaving={isSaving}
          onAssignQrPress={() => {
            Alert.alert(
              "Save first",
              "Create the plant first, then use Edit Plant to scan and assign a QR label.",
            );
          }}
          onCancel={() => router.back()}
          onChange={setField}
          onPickImage={handlePickImage}
          onSubmit={() => {
            void handleSubmit();
          }}
          submitLabel="Save Plant"
          values={values}
        />
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
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
});
