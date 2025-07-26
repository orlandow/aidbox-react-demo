import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import aidbox from '../../services/aidbox';
import type { Patient } from '../../types/fhir';
import { queryKeys } from './queryKeys';
import { useToast } from '../../contexts/ToastContext';
import { stringifyPatient } from '../../utils/stringify';

export function useCreatePatient() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (patient: Patient) => aidbox.create('Patient', patient),
    onSuccess: () => {
      // Invalidate patient lists to refetch them
      queryClient.invalidateQueries({ queryKey: queryKeys.patients.lists() });
      
      addToast({
        type: 'success',
        title: 'Patient created',
        message: `Patient has been created successfully.`
      });

      navigate('/patients');
    },
    onError: (error) => {
      console.error('Failed to create patient:', error);
      addToast({
        type: 'error',
        title: 'Create failed',
        message: 'Failed to create patient. Please try again.'
      });
    },
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({ id, patient }: { id: string; patient: Patient }) => 
      aidbox.update('Patient', id, patient),
    onSuccess: (updatedPatient) => {
      // Update the specific patient in cache
      queryClient.setQueryData(
        queryKeys.patients.detail(updatedPatient.id!),
        updatedPatient
      );
      
      // Invalidate patient lists to refetch them
      queryClient.invalidateQueries({ queryKey: queryKeys.patients.lists() });
      

      addToast({
        type: 'success',
        title: 'Patient updated',
        message: `${stringifyPatient(updatedPatient)} has been updated successfully.`
      });

      navigate('/patients');
    },
    onError: (error) => {
      console.error('Failed to update patient:', error);
      addToast({
        type: 'error',
        title: 'Update failed',
        message: 'Failed to update patient. Please try again.'
      });
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (id: string) => aidbox.delete('Patient', id),
    onSuccess: (_, deletedId) => {
      // Remove the patient from cache
      queryClient.removeQueries({ queryKey: queryKeys.patients.detail(deletedId) });
      
      // Invalidate patient lists to refetch them
      queryClient.invalidateQueries({ queryKey: queryKeys.patients.lists() });
      
      addToast({
        type: 'success',
        title: 'Patient deleted',
        message: 'Patient has been deleted successfully.'
      });

      navigate('/patients');
    },
    onError: (error) => {
      console.error('Failed to delete patient:', error);
      addToast({
        type: 'error',
        title: 'Delete failed',
        message: 'Failed to delete patient. Please try again.'
      });
    },
  });
}