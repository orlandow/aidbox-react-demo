export const queryKeys = {
  patients: {
    all: ['patients'] as const,
    lists: () => [...queryKeys.patients.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.patients.lists(), filters] as const,
    details: () => [...queryKeys.patients.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.patients.details(), id] as const,
  },
  appointments: {
    all: ['appointments'] as const,
    lists: () => [...queryKeys.appointments.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.appointments.lists(), filters] as const,
    weekWithEncounters: (startDate: string, endDate: string) => [...queryKeys.appointments.all, 'week-with-encounters', startDate, endDate] as const,
    details: () => [...queryKeys.appointments.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.appointments.details(), id] as const,
  },
  dashboard: {
    all: ['dashboard'] as const,
    stats: () => [...queryKeys.dashboard.all, 'stats'] as const,
  },
  encounters: {
    all: ['encounters'] as const,
    lists: () => [...queryKeys.encounters.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.encounters.lists(), filters] as const,
    details: () => [...queryKeys.encounters.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.encounters.details(), id] as const,
    active: () => [...queryKeys.encounters.lists(), 'active'] as const,
    activeForPatient: (patientId: string) => [...queryKeys.encounters.lists(), 'active', 'patient', patientId] as const,
  },
  terminology: {
    all: ['terminology'] as const,
    valueSets: () => [...queryKeys.terminology.all, 'valueSet'] as const,
    valueSet: (url: string, options: Record<string, unknown> = {}) => [...queryKeys.terminology.valueSets(), url, options] as const,
  },
} as const;