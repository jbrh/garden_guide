import { Suspense } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";

import { colors } from "@/constants/ui";
import { DATABASE_NAME } from "@/db/client";
import { initializeDatabase } from "@/db/migrations";

export default function RootLayout() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        onInit={initializeDatabase}
        useSuspense
      >
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: colors.background },
            headerShadowVisible: false,
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="scan"
            options={{ headerTitle: "", headerBackTitle: "Home" }}
          />
          <Stack.Screen
            name="plants/index"
            options={{ headerTitle: "", headerBackTitle: "Home" }}
          />
          <Stack.Screen name="plants/new" options={{ title: "Add Plant" }} />
          <Stack.Screen
            name="plants/[plantId]"
            options={{ title: "Plant Detail" }}
          />
          <Stack.Screen
            name="plants/[plantId]/edit"
            options={{ title: "Edit Plant" }}
          />
          <Stack.Screen name="+not-found" options={{ title: "Not Found" }} />
        </Stack>
      </SQLiteProvider>
    </Suspense>
  );
}

function LoadingScreen() {
  return (
    <View style={styles.loadingScreen}>
      <ActivityIndicator color={colors.primary} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
  },
});
