import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "@/constants/ui";

interface FieldRowProps {
  label: string;
  value: string;
}

export function FieldRow({ label, value }: FieldRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 6,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  value: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
  },
});
