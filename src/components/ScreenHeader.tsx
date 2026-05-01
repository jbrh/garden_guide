import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "@/constants/ui";

interface ScreenHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
  eyebrowStyle?: StyleProp<TextStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
}

export function ScreenHeader({
  eyebrow,
  title,
  subtitle,
  style,
  eyebrowStyle,
  titleStyle,
  subtitleStyle,
}: ScreenHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      {eyebrow ? <Text style={[styles.eyebrow, eyebrowStyle]}>{eyebrow}</Text> : null}
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  title: {
    color: colors.textOnDark,
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 36,
  },
  subtitle: {
    color: colors.textMutedOnDark,
    fontSize: 16,
    lineHeight: 24,
  },
});
