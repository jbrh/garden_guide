import { useCallback, useEffect, useState } from "react";

import { useFocusEffect } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";

import { getPlantById } from "@/repositories/plantRepository";
import type { Plant } from "@/types/domain";

export function usePlant(plantId?: string) {
  const db = useSQLiteContext();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(plantId));
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!plantId) {
      setPlant(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const nextPlant = await getPlantById(db, plantId);
      setPlant(nextPlant);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load this plant.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [db, plantId]);

  useEffect(() => {
    void load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  return {
    plant,
    isLoading,
    error,
    refresh: load,
  };
}
