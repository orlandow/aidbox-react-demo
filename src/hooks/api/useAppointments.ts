import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Appointment } from '../../types/fhir/Appointment';
import type { Encounter } from '../../types/fhir/Encounter';
import aidbox from '../../services/aidbox';
import { queryKeys } from './queryKeys';

export function useAppointments(filters?: Record<string, string | string[]>) {
  return useQuery({
    queryKey: queryKeys.appointments.list(filters || {}),
    queryFn: () => aidbox.search('Appointment', filters),
    staleTime: 2 * 60 * 1000, // 2 minutes for appointment lists
  });
}


export function useWeekAppointmentsWithEncounters(startDate: string, endDate: string) {
  return useQuery({
    queryKey: queryKeys.appointments.weekWithEncounters(startDate, endDate),
    queryFn: async () => {
      const searchResult = await aidbox.search('Appointment', {
        'date': [`ge${startDate}`, `le${endDate}`],
        '_sort': 'date',
        '_count': '100',
        '_revinclude': 'Encounter:appointment'
      });

      const appointments: Appointment[] = [];
      const encounters: Encounter[] = [];

      searchResult.entry?.forEach(entry => {
        if (entry.resource.resourceType === 'Appointment') {
          appointments.push(entry.resource as Appointment);
        } else if (entry.resource.resourceType === 'Encounter') {
          encounters.push(entry.resource as Encounter);
        }
      });

      return { appointments, encounters };
    },
    staleTime: 1 * 60 * 1000, // 1 minute for calendar data
  });
}

export function useAppointment(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.appointments.detail(id!),
    queryFn: () => aidbox.read('Appointment', id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes for individual appointment data
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointment: Omit<Appointment, 'id' | 'resourceType'>) => 
      aidbox.create('Appointment', {
        resourceType: 'Appointment',
        ...appointment,
      } as Appointment),
    onSuccess: () => {
      // Invalidate all appointment queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, appointment }: { id: string; appointment: Partial<Appointment> }) =>
      aidbox.update('Appointment', id, {
        resourceType: 'Appointment',
        id,
        ...appointment,
      } as Appointment),
    onSuccess: (data) => {
      // Update the cache for this specific appointment
      queryClient.setQueryData(queryKeys.appointments.detail(data.id!), data);
      // Invalidate appointment lists to trigger refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.lists() });
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => aidbox.delete('Appointment', id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.appointments.detail(id) });
      // Invalidate appointment lists to trigger refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.lists() });
    },
  });
}