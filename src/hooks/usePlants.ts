import { useCallback, useEffect, useState } from "react";

import { useFocusEffect } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";

import {
  getPlantsByGardenId,
  searchPlants,
} from "@/repositories/plantRepository";
import type { Plant } from "@/types/domain";

export function usePlants(gardenId?: string, query = "") {
  const db = useSQLiteContext();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(gardenId));
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!gardenId) {
      setPlants([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const nextPlants = query.trim()
        ? await searchPlants(db, gardenId, query)
        : await getPlantsByGardenId(db, gardenId);
      setPlants(nextPlants);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load plants.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [db, gardenId, query]);

  useEffect(() => {
    void load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  return {
    plants,
    isLoading,
    error,
    refresh: load,
  };
}
