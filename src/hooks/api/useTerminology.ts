import { useQuery } from '@tanstack/react-query';
import AidboxService from '../../services/aidbox';
import type { Coding } from '../../types/fhir';
import { queryKeys } from './queryKeys';

export const ValueSetUrls = {
  ADMINISTRATIVE_GENDER: 'http://hl7.org/fhir/ValueSet/administrative-gender',
  LANGUAGES: 'http://hl7.org/fhir/ValueSet/languages',
  APPOINTMENT_STATUS: 'http://hl7.org/fhir/ValueSet/appointmentstatus',
  APPOINTMENT_TYPES: 'http://terminology.hl7.org/ValueSet/v2-0276',
} as const;

interface ValueSetExpandOptions {
  count?: number;
  filter?: string;
}

interface UseValueSetExpandResult {
  data: Coding[];
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
}

function useValueSetExpand(url: string, options: ValueSetExpandOptions = {}): UseValueSetExpandResult {
  const { count, filter } = options;
  
  const queryKey = queryKeys.terminology.valueSet(url, { count, filter });
  
  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<Coding[]> => {
      const params: Record<string, string | number> = { url };
      
      if (count !== undefined) {
        params.count = count;
      }
      
      if (filter !== undefined && filter.trim() !== '') {
        params.filter = filter.trim();
      }
      
      const valueSet = await AidboxService.op('ValueSet/$expand', params);
      
      // Extract codings from the expanded ValueSet
      const codings = valueSet.expansion?.contains?.map((concept): Coding => ({
        code: concept.code || '',
        display: concept.display,
        system: concept.system,
      })) || [];
      
      return codings;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    enabled: Boolean(url),
  });
  
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
    isError: query.isError,
  };
}

export { useValueSetExpand };