import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, radii, shadows, spacing } from "@/constants/ui";

interface SectionCardProps {
  title?: string;
  children: ReactNode;
}

export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <View style={styles.card}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
    ...shadows.card,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
});
