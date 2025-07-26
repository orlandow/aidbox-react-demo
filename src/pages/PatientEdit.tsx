import { useParams, useNavigate } from 'react-router-dom';
import PatientForm from '../components/PatientForm';
import type { Patient } from '../types/fhir';
import { usePatient, useUpdatePatient } from '../hooks/api';
import { stringifyPatient } from '../utils/stringify';

export default function PatientEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: patient, isLoading: loading, error } = usePatient(id);
  const updatePatientMutation = useUpdatePatient();


  const handleSubmit = (updatedPatient: Patient) => {
    if (id) {
      updatePatientMutation.mutate({ id, patient: updatedPatient });
    }
  };

  const handleCancel = () => {
    navigate('/patients');
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || (!loading && !patient)) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {error ? 'Error loading patient' : 'Patient not found'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              The patient you're looking for could not be loaded.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => navigate('/patients')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Patients
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // After this point, patient is guaranteed to exist
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Edit Patient: {stringifyPatient(patient!)}
        </h1>
        <p className="text-gray-600 mt-2">Update patient information</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <PatientForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={updatePatientMutation.isPending}
          isEditing={true}
          initialData={patient!}
        />
      </div>
    </div>
  );
}