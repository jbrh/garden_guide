import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing } from "@/constants/ui";

type Variant = "primary" | "secondary" | "danger" | "ghost";

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  accessory?: ReactNode;
}

export function AppButton({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  accessory,
}: AppButtonProps) {
  const variantStyle = variantStyles[variant];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variantStyle.button,
        disabled && styles.disabledButton,
        pressed && !disabled && styles.pressedButton,
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.label, variantStyle.label]}>{label}</Text>
        {accessory}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radii.pill,
    borderWidth: 1,
    minHeight: 52,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  content: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  primaryLabel: {
    color: colors.white,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  secondaryLabel: {
    color: colors.text,
  },
  dangerButton: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  dangerLabel: {
    color: colors.white,
  },
  ghostButton: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    paddingHorizontal: 0,
  },
  ghostLabel: {
    color: colors.primary,
  },
  disabledButton: {
    opacity: 0.45,
  },
  pressedButton: {
    transform: [{ scale: 0.99 }],
  },
});

const variantStyles = {
  primary: {
    button: styles.primaryButton,
    label: styles.primaryLabel,
  },
  secondary: {
    button: styles.secondaryButton,
    label: styles.secondaryLabel,
  },
  danger: {
    button: styles.dangerButton,
    label: styles.dangerLabel,
  },
  ghost: {
    button: styles.ghostButton,
    label: styles.ghostLabel,
  },
} as const;
