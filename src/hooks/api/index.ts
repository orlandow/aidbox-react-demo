// Patient hooks
export { usePatient } from './usePatient';
export { usePatientSearch } from './usePatientSearch';
export { useCreatePatient, useUpdatePatient, useDeletePatient } from './usePatientMutations';

// Appointment hooks
export { 
  useAppointments, 
  useWeekAppointmentsWithEncounters,
  useAppointment,
  useCreateAppointment,
  useUpdateAppointment,
  useDeleteAppointment 
} from './useAppointments';

// Encounter hooks
export { 
  useCreateEncounter,
  useCompleteEncounter,
  useEncounter,
  useActiveEncountersForPatient,
  useAllActiveEncounters
} from './useEncounter';

// Terminology hooks
export { 
  useValueSetExpand,
  ValueSetUrls 
} from './useTerminology';

// Query keys
export { queryKeys } from './queryKeys';