import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";
import { BarcodeScanningResult, CameraView, useCameraPermissions } from "expo-camera";
import { useSQLiteContext } from "expo-sqlite";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppButton } from "@/components/AppButton";
import { SectionCard } from "@/components/SectionCard";
import { TextInputField } from "@/components/TextInputField";
import { colors, spacing } from "@/constants/ui";
import { routes } from "@/constants/routes";
import {
  assignQrCodeToPlant,
  getPlantByQrCodeValue,
} from "@/repositories/plantRepository";
import { getParamValue } from "@/utils/validation";

type ScanMode = "lookup" | "assign";

const SAMPLE_QR_LABELS = [
  {
    value: "QR-PLANT-0001",
    label: "Open Stella Cherry",
  },
  {
    value: "QR-PLANT-0002",
    label: "Open Red Twig Dogwood",
  },
];

export default function ScanScreen() {
  const db = useSQLiteContext();
  const params = useLocalSearchParams<{
    mode?: string;
    plantId?: string;
  }>();
  const mode = (getParamValue(params.mode) as ScanMode | undefined) ?? "lookup";
  const plantId = getParamValue(params.plantId);
  const [permission, requestPermission] = useCameraPermissions();
  const [manualValue, setManualValue] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isHandlingScan, setIsHandlingScan] = useState(false);

  async function handleScanValue(value: string) {
    const qrCodeValue = value.trim();

    if (!qrCodeValue || isHandlingScan) {
      return;
    }

    try {
      setIsHandlingScan(true);
      setMessage(null);

      if (mode === "assign") {
        if (!plantId) {
          throw new Error("Missing plant id for QR assignment.");
        }

        await assignQrCodeToPlant(db, plantId, qrCodeValue);
        Alert.alert("QR assigned", "The label has been assigned to this plant.", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
        return;
      }

      const plant = await getPlantByQrCodeValue(db, qrCodeValue);

      if (plant) {
        router.replace(routes.plantDetail(plant.id));
        return;
      }

      setMessage("This label is not assigned yet.");
    } catch (scanError) {
      setMessage(
        scanError instanceof Error
          ? scanError.message
          : "Unable to handle the QR scan.",
      );
    } finally {
      setIsHandlingScan(false);
    }
  }

  function handleBarcodeScanned(result: BarcodeScanningResult) {
    void handleScanValue(result.data);
  }

  return (
    <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
      <View style={styles.container}>
        <SectionCard title={mode === "assign" ? "Assign a QR label" : "Scan a plant label"}>
          <Text style={styles.instructions}>
            {mode === "assign"
              ? "Point the camera at a QR label to assign it to the current plant."
              : "Point the camera at a QR label to open that plant record."}
          </Text>

          {!permission ? (
            <Text style={styles.instructions}>Checking camera permission...</Text>
          ) : permission.granted ? (
            <CameraView
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
              onBarcodeScanned={isHandlingScan ? undefined : handleBarcodeScanned}
              style={styles.camera}
            />
          ) : (
            <View style={styles.permissionBox}>
              <Text style={styles.instructions}>
                Camera permission is required for live scanning.
              </Text>
              <AppButton
                label="Grant Camera Access"
                onPress={() => {
                  void requestPermission();
                }}
              />
            </View>
          )}

          {message ? <Text style={styles.message}>{message}</Text> : null}
        </SectionCard>

        <SectionCard title="Manual test fallback">
          <Text style={styles.instructions}>
            Use this if you are testing in an environment where camera scanning is unavailable.
          </Text>
          {mode === "lookup" ? (
            <View style={styles.sampleList}>
              <Text style={styles.sampleTitle}>Seeded sample labels</Text>
              {SAMPLE_QR_LABELS.map((sample) => (
                <AppButton
                  key={sample.value}
                  label={`${sample.label} (${sample.value})`}
                  onPress={() => {
                    setManualValue(sample.value);
                    void handleScanValue(sample.value);
                  }}
                  variant="secondary"
                />
              ))}
            </View>
          ) : null}
          <TextInputField
            autoCapitalize="characters"
            label="QR label value"
            onChangeText={setManualValue}
            placeholder="QR-PLANT-0001"
            value={manualValue}
          />
          {mode === "lookup" ? (
            <Text style={styles.instructions}>
              Try `QR-PLANT-0001` or `QR-PLANT-0002`. `QR-PLANT-001` is not currently assigned in the sample data.
            </Text>
          ) : null}
          <AppButton
            label={mode === "assign" ? "Assign Entered Label" : "Open Entered Label"}
            onPress={() => {
              void handleScanValue(manualValue);
            }}
            variant="secondary"
          />
          <AppButton label="Back" onPress={() => router.back()} variant="ghost" />
        </SectionCard>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  container: {
    gap: spacing.lg,
    padding: spacing.lg,
  },
  instructions: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  camera: {
    borderRadius: 22,
    height: 320,
    overflow: "hidden",
  },
  permissionBox: {
    gap: spacing.md,
  },
  sampleList: {
    gap: spacing.sm,
  },
  sampleTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  message: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: "700",
  },
});
