import { useCallback, useEffect, useState } from "react";

import { useFocusEffect } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";

import {
  getAllGardens,
  setActiveGarden as setActiveGardenInRepository,
} from "@/repositories/gardenRepository";
import type { Garden } from "@/types/domain";

export function useGardens() {
  const db = useSQLiteContext();
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const nextGardens = await getAllGardens(db);
      setGardens(nextGardens);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load gardens.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [db]);

  const setActiveGarden = useCallback(
    async (gardenId: string) => {
      try {
        setError(null);
        await setActiveGardenInRepository(db, gardenId);
        await load();
      } catch (setActiveGardenError) {
        setError(
          setActiveGardenError instanceof Error
            ? setActiveGardenError.message
            : "Unable to switch gardens.",
        );
      }
    },
    [db, load],
  );

  useEffect(() => {
    void load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  return {
    gardens,
    isLoading,
    error,
    refresh: load,
    setActiveGarden,
  };
}
