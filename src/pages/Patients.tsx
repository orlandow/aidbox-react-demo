import { Link } from 'react-router-dom';
import PatientList from '../components/PatientList';
import PatientSearch from '../components/PatientSearch';
import PatientPagination from '../components/PatientPagination';
import { usePatientSearch } from '../hooks/api';

export default function Patients() {
  const {
    patients,
    loading,
    error,
    pagination,
    filters,
    setQuery,
    setShowInactive,
    goToPage,
  } = usePatientSearch();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
            <p className="text-gray-600 mt-2">Patient management and records</p>
          </div>
          <Link
            to="/patients/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Patient
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <PatientSearch
          query={filters.query}
          showInactive={filters.showInactive}
          onQueryChange={setQuery}
          onShowInactiveChange={setShowInactive}
          loading={loading}
        />
        <PatientList 
          patients={patients} 
          loading={loading}
          searchQuery={filters.query}
        />
        <PatientPagination
          pagination={pagination}
          onPageChange={goToPage}
          loading={loading}
        />
      </div>
    </div>
  );
}