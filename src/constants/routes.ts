export const routes = {
  home: "/" as const,
  scan: "/scan" as const,
  plantList: "/plants" as const,
  plantDetail: (plantId: string, backLabel?: string) =>
    ({
      pathname: "/plants/[plantId]",
      params: backLabel ? { plantId, backLabel } : { plantId },
    }) as const,
};
