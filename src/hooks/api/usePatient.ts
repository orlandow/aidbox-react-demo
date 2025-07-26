import { useQuery } from '@tanstack/react-query';
import aidbox from '../../services/aidbox';
import { queryKeys } from './queryKeys';

export function usePatient(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.patients.detail(id!),
    queryFn: () => aidbox.read('Patient', id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes for individual patient data
  });
}