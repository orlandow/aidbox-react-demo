import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import aidbox from '../../services/aidbox';
import { queryKeys } from './queryKeys';
import { useDebounce } from '../useDebounce';
import type { Patient, Bundle } from '../../types/fhir';

interface SearchFilters extends Record<string, unknown> {
  query: string;
  showInactive: boolean;
  page: number;
}

interface PaginationInfo {
  current: number;
  total: number;
  count: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextUrl?: string;
  prevUrl?: string;
  firstUrl?: string;
  lastUrl?: string;
}

interface SearchResult {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo;
  filters: { query: string; showInactive: boolean };
  setQuery: (query: string) => void;
  setShowInactive: (show: boolean) => void;
  goToPage: (url: string) => void;
  refresh: () => void;
}

const buildSearchParams = (filters: SearchFilters) => {
  const params: Record<string, string> = {
    _count: '20',
    page: filters.page.toString(),
  };

  if (filters.query.trim()) {
    params._ilike = filters.query.trim();
  }

  if (!filters.showInactive) {
    params['active:not'] = 'false';
  }

  return params;
};

const parseLinks = (bundle: Bundle<Patient>) => {
  const links = bundle.link || [];
  const linkMap = links.reduce((acc, link) => {
    acc[link.relation] = link.url;
    return acc;
  }, {} as Record<string, string>);

  return {
    nextUrl: linkMap.next,
    prevUrl: linkMap.prev,
    firstUrl: linkMap.first,
    lastUrl: linkMap.last,
  };
};

export function usePatientSearch(): SearchResult {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get filters from URL params
  const query = searchParams.get('q') || '';
  const showInactive = searchParams.get('inactive') === 'true';
  const page = parseInt(searchParams.get('page') || '1');

  // Debounce the search query
  const debouncedQuery = useDebounce(query, 300);

  // Use React Query for data fetching
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.patients.list({ query: debouncedQuery, showInactive, page }),
    queryFn: async () => {
      const params = buildSearchParams({ query: debouncedQuery, showInactive, page });
      const result = await aidbox.search('Patient', params);
      
      const patients = result.entry?.map(entry => entry.resource!) || [];
      const links = parseLinks(result);
      
      const pagination: PaginationInfo = {
        current: page,
        total: result.total || 0,
        count: 20,
        hasNext: !!links.nextUrl,
        hasPrev: !!links.prevUrl,
        ...links,
      };

      return { patients, pagination };
    },
    staleTime: 30 * 1000, // 30 seconds for search results
    gcTime: 5 * 60 * 1000, // 5 minutes garbage collection
  });

  const patients = data?.patients || [];
  const pagination = data?.pagination || {
    current: 1,
    total: 0,
    count: 20,
    hasNext: false,
    hasPrev: false,
  };

  const setQuery = (newQuery: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (newQuery.trim()) {
      newParams.set('q', newQuery);
    } else {
      newParams.delete('q');
    }
    newParams.delete('page'); // Reset to first page on new search
    setSearchParams(newParams);
  };

  const setShowInactive = (show: boolean) => {
    const newParams = new URLSearchParams(searchParams);
    if (show) {
      newParams.set('inactive', 'true');
    } else {
      newParams.delete('inactive');
    }
    newParams.delete('page'); // Reset to first page on filter change
    setSearchParams(newParams);
  };

  const goToPage = (url: string) => {
    const urlObj = new URL(url);
    const pageParam = urlObj.searchParams.get('page');
    if (pageParam) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('page', pageParam);
      setSearchParams(newParams);
    }
  };

  const refresh = () => {
    refetch();
  };

  return {
    patients,
    loading: isLoading,
    error: error?.message || null,
    pagination,
    filters: { query, showInactive },
    setQuery,
    setShowInactive,
    goToPage,
    refresh,
  };
}