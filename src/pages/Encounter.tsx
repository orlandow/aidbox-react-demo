import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import type { Patient, Appointment } from '../types/fhir';
import aidbox from '../services/aidbox';
import { useEncounter, useCompleteEncounter } from '../hooks/api/useEncounter';
import WrapUpModal from '../components/WrapUpModal';
import { stringifyPatient } from '../utils/stringify';

export default function EncounterPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [showWrapUpModal, setShowWrapUpModal] = useState(false);
  
  const { data: encounter, isLoading, error } = useEncounter(id!);
  const completeEncounterMutation = useCompleteEncounter();

  useEffect(() => {
    if (!encounter) return;
    
    const loadRelatedData = async () => {
      try {
        // Load patient
        if (encounter.subject?.reference) {
          const patientId = encounter.subject.reference.split('/')[1];
          const patientData = await aidbox.read('Patient', patientId);
          setPatient(patientData);
        }

        // Load appointment if exists
        if (encounter.appointment?.[0]?.reference) {
          const appointmentId = encounter.appointment[0].reference.split('/')[1];
          const appointmentData = await aidbox.read('Appointment', appointmentId);
          setAppointment(appointmentData);
        }
      } catch (error) {
        console.error('Error loading related data:', error);
      }
    };

    loadRelatedData();
  }, [encounter]);

  const handleWrapUp = async () => {
    if (!encounter) return;

    completeEncounterMutation.mutate(encounter.id!, {
      onSuccess: () => {
        setShowWrapUpModal(false);
        navigate('/calendar');
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading encounter...</p>
        </div>
      </div>
    );
  }

  if (error || !encounter) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">
            {error ? 'Error loading encounter' : 'Encounter not found'}
          </p>
          <button
            onClick={() => navigate('/calendar')}
            className="mt-4 text-indigo-600 hover:text-indigo-500"
          >
            Back to Calendar
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/calendar')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Calendar
          </button>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between">
              {/* Patient Header */}
              {patient && (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {patient ? stringifyPatient(patient, {includeDemographics: true}) : 'Unknown Patient'}
                  </h1>
                  <div className="flex items-center gap-3 mt-1">
                    <h2 className="text-lg text-gray-600">
                      Encounter on {encounter.period?.start && formatDate(encounter.period.start).split(' at ').join(', ')}
                    </h2>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      encounter.status === 'in-progress' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : encounter.status === 'finished'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {encounter.status === 'in-progress' ? 'In Progress' : 
                       encounter.status === 'finished' ? 'Completed' :
                       encounter.status}
                    </span>
                  </div>
                </div>
              )}
              
              <div>
                {encounter.status === 'in-progress' && (
                  <button
                    onClick={() => setShowWrapUpModal(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Wrap Up
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>


        {/* Vitals */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Vitals</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500">
              Vital signs will be displayed here
            </p>
          </div>
        </div>

        {/* Lab Results */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Lab Results</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500">
              Laboratory results will be displayed here
            </p>
          </div>
        </div>

        {/* Medications */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Medications</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500">
              Medication information will be displayed here
            </p>
          </div>
        </div>
      </div>

      {/* Wrap Up Modal */}
      <WrapUpModal
        isOpen={showWrapUpModal}
        onClose={() => setShowWrapUpModal(false)}
        onConfirm={handleWrapUp}
        patientName={patient ? stringifyPatient(patient) : 'Unknown Patient'}
      />
    </div>
  );
}