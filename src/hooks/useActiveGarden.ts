import { useCallback, useEffect, useState } from "react";

import { useFocusEffect } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";

import { getActiveGarden } from "@/repositories/gardenRepository";
import type { Garden } from "@/types/domain";

export function useActiveGarden() {
  const db = useSQLiteContext();
  const [garden, setGarden] = useState<Garden | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const nextGarden = await getActiveGarden(db);
      setGarden(nextGarden);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load the active garden.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [db]);

  useEffect(() => {
    void load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  return {
    garden,
    isLoading,
    error,
    refresh: load,
  };
}
