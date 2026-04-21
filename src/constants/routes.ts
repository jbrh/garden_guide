export const routes = {
  home: "/" as const,
  scan: "/scan" as const,
  plantList: "/plants" as const,
  plantNew: "/plants/new" as const,
  plantDetail: (plantId: string) =>
    ({
      pathname: "/plants/[plantId]",
      params: { plantId },
    }) as const,
  plantEdit: (plantId: string) =>
    ({
      pathname: "/plants/[plantId]/edit",
      params: { plantId },
    }) as const,
  scanAssign: (plantId: string) =>
    ({
      pathname: "/scan",
      params: { mode: "assign", plantId },
    }) as const,
};
