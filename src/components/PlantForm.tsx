import { StyleSheet, Text, View } from "react-native";

import { AppButton } from "@/components/AppButton";
import { PlantPhoto } from "@/components/PlantPhoto";
import { SectionCard } from "@/components/SectionCard";
import { TextInputField } from "@/components/TextInputField";
import { colors, spacing } from "@/constants/ui";
import type { PlantFormValues } from "@/types/domain";

interface PlantFormProps {
  values: PlantFormValues;
  onChange: (field: keyof PlantFormValues, value: string | null) => void;
  onPickImage: () => void;
  onAssignQrPress?: () => void;
  assignQrDisabled?: boolean;
  assignQrHint?: string;
  submitLabel: string;
  onSubmit: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  error?: string | null;
  isSaving?: boolean;
}

export function PlantForm({
  values,
  onChange,
  onPickImage,
  onAssignQrPress,
  assignQrDisabled = false,
  assignQrHint,
  submitLabel,
  onSubmit,
  onCancel,
  onDelete,
  error,
  isSaving = false,
}: PlantFormProps) {
  return (
    <View style={styles.content}>
      <SectionCard title="Primary photo">
        <View style={styles.photoRow}>
          <PlantPhoto size={112} uri={values.primaryPhotoUri} />
          <View style={styles.photoActions}>
            <AppButton
              label={values.primaryPhotoUri ? "Replace photo" : "Choose photo"}
              onPress={onPickImage}
              variant="secondary"
            />
            {values.primaryPhotoUri ? (
              <AppButton
                label="Remove photo"
                onPress={() => onChange("primaryPhotoUri", null)}
                variant="ghost"
              />
            ) : null}
          </View>
        </View>
      </SectionCard>

      <SectionCard title="Plant details">
        <TextInputField
          label="Common name"
          onChangeText={(value) => onChange("commonName", value)}
          placeholder="Stella Cherry"
          value={values.commonName}
        />
        <TextInputField
          label="Botanical name"
          autoCapitalize="none"
          onChangeText={(value) => onChange("botanicalName", value)}
          placeholder="Prunus avium"
          value={values.botanicalName}
        />
        <TextInputField
          label="Cultivar"
          onChangeText={(value) => onChange("cultivar", value)}
          placeholder="Stella"
          value={values.cultivar}
        />
        <TextInputField
          label="Short description"
          multiline
          onChangeText={(value) => onChange("shortDescription", value)}
          placeholder="A quick overview of the plant."
          value={values.shortDescription}
        />
      </SectionCard>

      <SectionCard title="Care and value">
        <TextInputField
          label="Care basics"
          multiline
          onChangeText={(value) => onChange("careBasics", value)}
          placeholder="Sun, water, pruning, and other basics."
          value={values.careBasics}
        />
        <TextInputField
          label="Habitat value"
          multiline
          onChangeText={(value) => onChange("habitatValue", value)}
          placeholder="Pollinators, birds, shelter, or food value."
          value={values.habitatValue}
        />
      </SectionCard>

      <SectionCard title="Notes and QR">
        <TextInputField
          label="Personal notes"
          multiline
          onChangeText={(value) => onChange("personalNotes", value)}
          placeholder="Your observations, stories, or reminders."
          value={values.personalNotes}
        />
        <TextInputField
          label="QR label value"
          autoCapitalize="characters"
          onChangeText={(value) => onChange("qrCodeValue", value)}
          placeholder="QR-PLANT-0001"
          value={values.qrCodeValue}
        />
        {onAssignQrPress ? (
          <View style={styles.assignSection}>
            <AppButton
              disabled={assignQrDisabled}
              label="Assign QR Label"
              onPress={onAssignQrPress}
              variant="secondary"
            />
            {assignQrHint ? <Text style={styles.helper}>{assignQrHint}</Text> : null}
          </View>
        ) : null}
      </SectionCard>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.actions}>
        <AppButton
          label={isSaving ? "Saving..." : submitLabel}
          onPress={onSubmit}
        />
        <AppButton label="Cancel" onPress={onCancel} variant="secondary" />
        {onDelete ? (
          <AppButton label="Delete Plant" onPress={onDelete} variant="danger" />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  photoRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
  },
  photoActions: {
    flex: 1,
    gap: spacing.sm,
  },
  assignSection: {
    gap: spacing.sm,
  },
  helper: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  error: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: "600",
  },
  actions: {
    gap: spacing.sm,
  },
});
