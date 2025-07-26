import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../hooks/useDebounce';

interface PatientSearchProps {
  query: string;
  showInactive: boolean;
  onQueryChange: (query: string) => void;
  onShowInactiveChange: (show: boolean) => void;
  loading: boolean;
}

export default function PatientSearch({
  query,
  showInactive,
  onQueryChange,
  onShowInactiveChange,
  loading,
}: PatientSearchProps) {
  // Local state for input value to prevent re-renders during typing
  const [localQuery, setLocalQuery] = useState(query);
  
  // Debounce the local query to sync with global state
  const debouncedLocalQuery = useDebounce(localQuery, 300);
  
  // Sync local state with global state when external changes occur
  // Use a ref to track if the change is from internal typing vs external source
  const isInternalChange = useRef(false);
  
  useEffect(() => {
    if (!isInternalChange.current) {
      setLocalQuery(query);
    }
    isInternalChange.current = false;
  }, [query]);
  
  // Sync debounced local query with global state
  useEffect(() => {
    if (debouncedLocalQuery !== query) {
      isInternalChange.current = true;
      onQueryChange(debouncedLocalQuery);
    }
  }, [debouncedLocalQuery, query, onQueryChange]);
  
  const handleClear = () => {
    setLocalQuery('');
    isInternalChange.current = true;
    onQueryChange('');
  };
  return (
    <div className="bg-white px-4 py-3 border-b border-gray-200 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search patients..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            disabled={loading}
            className={`block w-full pl-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500 ${
              localQuery || loading ? 'pr-10' : 'pr-3'
            }`}
          />
          
          {/* Loading spinner or Clear button */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {loading ? (
              <svg
                className="animate-spin h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : localQuery ? (
              <button
                onClick={handleClear}
                disabled={loading}
                className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-50"
                title="Clear search"
              >
                <svg
                  className="h-4 w-4 text-gray-400 hover:text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            ) : null}
          </div>
        </div>

        {/* Filters - now stable without clear button moving things around */}
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => onShowInactiveChange(e.target.checked)}
              disabled={loading}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
            />
            <span className="ml-2 text-sm text-gray-700">
              Show inactive
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}