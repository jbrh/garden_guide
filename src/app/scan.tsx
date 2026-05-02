import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";
import { BarcodeScanningResult, CameraView, useCameraPermissions } from "expo-camera";
import { useSQLiteContext } from "expo-sqlite";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppButton } from "@/components/AppButton";
import { SectionCard } from "@/components/SectionCard";
import { colors, radii, spacing } from "@/constants/ui";
import { routes } from "@/constants/routes";
import { getPlantByQrCodeValue } from "@/repositories/plantRepository";

export default function ScanScreen() {
  const db = useSQLiteContext();
  const [permission, requestPermission] = useCameraPermissions();
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

      const plant = await getPlantByQrCodeValue(db, qrCodeValue);

      if (plant) {
        router.replace(routes.plantDetail(plant.id, "Home"));
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
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <View style={styles.container}>
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

        <SectionCard title="Scan a plant label">
          <Text style={styles.instructions}>
            Point the camera at a QR label to open that plant record.
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
  message: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: "700",
  },
});
