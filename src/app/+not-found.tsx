import { StyleSheet, View } from "react-native";

import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppButton } from "@/components/AppButton";
import { EmptyState } from "@/components/EmptyState";
import { colors, spacing } from "@/constants/ui";
import { routes } from "@/constants/routes";

export default function NotFoundScreen() {
  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <View style={styles.container}>
        <EmptyState
          description="This screen does not exist in the current app build."
          title="Route not found"
        />
        <AppButton
          label="Go Home"
          onPress={() => router.replace(routes.home)}
        />
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
    flex: 1,
    gap: spacing.lg,
    justifyContent: "center",
    padding: spacing.lg,
  },
});
