import { useQuery } from '@tanstack/react-query';
import aidbox from '../../services/aidbox';
import { queryKeys } from './queryKeys';
import type { Patient, Appointment } from '../../types/fhir';

interface DashboardStats {
  totalPatients: number;
  totalAppointments: number;
  todayAppointments: Appointment[];
}

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: async (): Promise<DashboardStats> => {
      const today = new Date().toISOString().split('T')[0];
      
      // Execute all API calls in parallel for better performance
      const [patientResult, appointmentResult, todayAppointmentResult] = await Promise.all([
        aidbox.search('Patient', { _count: '0' }),
        aidbox.search('Appointment', { _count: '0' }),
        aidbox.search('Appointment', { date: today, _count: '100' })
      ]);
      
      const todayAppointments = (todayAppointmentResult.entry?.map(entry => entry.resource as Appointment) || [])
        .sort((a, b) => {
          if (!a.start || !b.start) return 0;
          return new Date(a.start).getTime() - new Date(b.start).getTime();
        });
      
      return {
        totalPatients: patientResult.total || 0,
        totalAppointments: appointmentResult.total || 0,
        todayAppointments,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}