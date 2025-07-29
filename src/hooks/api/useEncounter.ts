import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { createEncounter, completeEncounter, getActiveEncountersForPatient, getAllActiveEncounters } from '../../services/encounter';
import { queryKeys } from './queryKeys';
import type { Encounter } from '../../types/fhir';

export function useCreateEncounter() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEncounter,
    onSuccess: (encounter: Encounter) => {
      showToast('Encounter started successfully', 'success');
      queryClient.invalidateQueries({ queryKey: queryKeys.encounters.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.encounters.active() });
      // Invalidate calendar data since encounters affect appointment display
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
      navigate(`/encounter/${encounter.id}`);
    },
    onError: (error) => {
      console.error('Error creating encounter:', error);
      showToast('Failed to start encounter', 'error');
    }
  });
}

export function useCompleteEncounter() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeEncounter,
    onSuccess: () => {
      showToast('Encounter completed successfully', 'success');
      queryClient.invalidateQueries({ queryKey: queryKeys.encounters.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.encounters.active() });
      // Invalidate calendar data since encounters affect appointment display
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
    },
    onError: (error) => {
      console.error('Error completing encounter:', error);
      showToast('Failed to complete encounter', 'error');
    }
  });
}

export function useEncounter(id: string) {
  return useQuery({
    queryKey: queryKeys.encounters.detail(id),
    queryFn: () => import('../../services/aidbox').then(({ default: aidbox }) => aidbox.read('Encounter', id)),
    enabled: !!id
  });
}

export function useActiveEncountersForPatient(patientId: string) {
  return useQuery({
    queryKey: queryKeys.encounters.activeForPatient(patientId),
    queryFn: () => getActiveEncountersForPatient(patientId),
    enabled: !!patientId
  });
}

export function useAllActiveEncounters() {
  return useQuery({
    queryKey: queryKeys.encounters.active(),
    queryFn: getAllActiveEncounters
  });
}

