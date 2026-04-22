import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet } from "react-native";

import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState } from "@/components/EmptyState";
import { PlantForm } from "@/components/PlantForm";
import { ScreenHeader } from "@/components/ScreenHeader";
import { colors, spacing } from "@/constants/ui";
import { routes } from "@/constants/routes";
import { usePlant } from "@/hooks/usePlant";
import {
  deletePlant,
  updatePlant,
} from "@/repositories/plantRepository";
import { pickPlantImageAsync } from "@/services/images/imagePickerService";
import {
  emptyPlantFormValues,
  toPlantFormValues,
  type PlantFormValues,
} from "@/types/domain";
import { getParamValue } from "@/utils/validation";

export default function EditPlantScreen() {
  const db = useSQLiteContext();
  const params = useLocalSearchParams<{ plantId?: string }>();
  const plantId = getParamValue(params.plantId);
  const { plant, isLoading } = usePlant(plantId);
  const [values, setValues] = useState<PlantFormValues>(emptyPlantFormValues);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (plant) {
      setValues(toPlantFormValues(plant));
    }
  }, [plant]);

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
    if (!plantId) {
      setError("Missing plant id.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      await updatePlant(db, plantId, {
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

      router.replace(routes.plantDetail(plantId));
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to update the plant.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleDelete() {
    if (!plantId) {
      return;
    }

    Alert.alert(
      "Delete plant?",
      "This will remove the plant record from the local database.",
      [
        {
          style: "cancel",
          text: "Cancel",
        },
        {
          style: "destructive",
          text: "Delete",
          onPress: async () => {
            try {
              await deletePlant(db, plantId);
              router.replace(routes.plantList);
            } catch (deleteError) {
              setError(
                deleteError instanceof Error
                  ? deleteError.message
                  : "Unable to delete the plant.",
              );
            }
          },
        },
      ],
    );
  }

  if (!plantId || (!plant && !isLoading)) {
    return (
      <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <EmptyState
            description="This plant could not be loaded for editing."
            title="Plant not found"
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (isLoading || !plant) {
    return (
      <SafeAreaView edges={["bottom"]} style={styles.loadingState}>
        <ActivityIndicator color={colors.primary} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader
          subtitle="Update the plant details and optionally scan a QR label."
          title="Edit Plant"
        />
        <PlantForm
          assignQrDisabled={!plantId}
          assignQrHint="Use the scanner to capture a QR label and assign it to this plant."
          error={error}
          isSaving={isSaving}
          onAssignQrPress={() => {
            if (plantId) {
              router.push(routes.scanAssign(plantId));
            }
          }}
          onCancel={() => router.back()}
          onChange={setField}
          onDelete={handleDelete}
          onPickImage={handlePickImage}
          onSubmit={() => {
            void handleSubmit();
          }}
          submitLabel="Save Changes"
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
  loadingState: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
});
