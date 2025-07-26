import { useNavigate } from 'react-router-dom';
import type { Patient } from '../types/fhir';
import PatientFormComponent from '../components/PatientForm';
import { useCreatePatient } from '../hooks/api';

export default function PatientFormPage() {
  const navigate = useNavigate();
  const createPatientMutation = useCreatePatient();

  const handleCreatePatient = (patient: Patient) => {
    createPatientMutation.mutate(patient);
  };

  const handleCancel = () => {
    navigate('/patients');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Patient</h1>
        <p className="text-gray-600 mt-2">Add a new patient to the system</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <PatientFormComponent
          onSubmit={handleCreatePatient}
          onCancel={handleCancel}
          loading={createPatientMutation.isPending}
        />
      </div>
    </div>
  );
}