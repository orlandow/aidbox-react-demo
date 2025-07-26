export const queryKeys = {
  patients: {
    all: ['patients'] as const,
    lists: () => [...queryKeys.patients.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.patients.lists(), filters] as const,
    details: () => [...queryKeys.patients.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.patients.details(), id] as const,
  },
  dashboard: {
    all: ['dashboard'] as const,
    stats: () => [...queryKeys.dashboard.all, 'stats'] as const,
  },
} as const;