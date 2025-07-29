import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import PatientLookup from './PatientLookup';
import { useCreateAppointment, useValueSetExpand, ValueSetUrls } from '../../hooks/api';
import type { WeekDay, TimeSlot } from '../../types/calendar';
import type { Patient } from '../../types/fhir/Patient';
import type { Appointment } from '../../types/fhir/Appointment';

interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: WeekDay | null;
  selectedTimeSlot: TimeSlot | null;
}

export default function AppointmentForm({ isOpen, onClose, selectedDay, selectedTimeSlot }: AppointmentFormProps) {
  // Terminology hooks
  const { data: appointmentTypes = [], isLoading: typesLoading, error: typesError } = useValueSetExpand(ValueSetUrls.APPOINTMENT_TYPES);
  const { data: appointmentStatuses = [], isLoading: statusLoading, error: statusError } = useValueSetExpand(ValueSetUrls.APPOINTMENT_STATUS);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [appointmentType, setAppointmentType] = useState('');
  const [status, setStatus] = useState<Appointment['status']>('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Set default values when terminology loads
  useEffect(() => {
    if (appointmentTypes.length > 0 && !appointmentType) {
      setAppointmentType(appointmentTypes[0].code);
    }
  }, [appointmentTypes, appointmentType]);

  useEffect(() => {
    if (appointmentStatuses.length > 0 && !status) {
      setStatus(appointmentStatuses[0].code as Appointment['status']);
    }
  }, [appointmentStatuses, status]);

  const createAppointmentMutation = useCreateAppointment();

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setSelectedPatient(null);
      setAppointmentType(appointmentTypes.length > 0 ? appointmentTypes[0].code : '');
      setStatus(appointmentStatuses.length > 0 ? appointmentStatuses[0].code as Appointment['status'] : '');
      setDescription('');
      setErrors({});
    }
  }, [isOpen, appointmentTypes, appointmentStatuses]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedPatient) {
      newErrors.patient = 'Patient is required';
    }

    if (!selectedDay || !selectedTimeSlot) {
      newErrors.time = 'Date and time are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!selectedPatient || !selectedDay || !selectedTimeSlot) {
      return;
    }

    try {
      const startDate = new Date(selectedDay.date);
      startDate.setHours(selectedTimeSlot.hour, selectedTimeSlot.minute, 0, 0);
      const startTime = startDate.toISOString();
      
      const endDate = new Date(selectedDay.date);
      endDate.setHours(selectedTimeSlot.hour, selectedTimeSlot.minute + 30, 0, 0);
      const endTime = endDate.toISOString();

      const appointmentData: Omit<Appointment, 'id' | 'resourceType'> = {
        status,
        start: startTime,
        end: endTime,
        participant: [
          {
            status: 'accepted',
            actor: {
              reference: `Patient/${selectedPatient.id}`,
              display: getPatientName(selectedPatient),
            },
          },
        ],
        appointmentType: {
          coding: [
            {
              code: appointmentType,
              display: appointmentTypes.find(type => type.code === appointmentType)?.display || appointmentType,
              system: appointmentTypes.find(type => type.code === appointmentType)?.system,
            },
          ],
          text: appointmentTypes.find(type => type.code === appointmentType)?.display || appointmentType,
        },
        minutesDuration: 30,
        ...(description && { description }),
      };

      await createAppointmentMutation.mutateAsync(appointmentData);
      onClose();
    } catch (error) {
      console.error('Error creating appointment:', error);
      setErrors({ submit: 'Failed to create appointment. Please try again.' });
    }
  };

  const getPatientName = (patient: Patient): string => {
    if (!patient.name || patient.name.length === 0) {
      return 'Unknown Patient';
    }

    const name = patient.name[0];
    const given = name.given?.join(' ') || '';
    const family = name.family || '';
    
    return `${given} ${family}`.trim() || 'Unknown Patient';
  };

  const getTimeDisplay = () => {
    if (!selectedDay || !selectedTimeSlot) return '';
    
    const endHour = selectedTimeSlot.minute === 30 ? selectedTimeSlot.hour + 1 : selectedTimeSlot.hour;
    const endMinute = selectedTimeSlot.minute === 30 ? 0 : selectedTimeSlot.minute + 30;
    const endTimeString = `${endHour === 0 ? 12 : endHour > 12 ? endHour - 12 : endHour}:${endMinute.toString().padStart(2, '0')} ${endHour >= 12 ? 'PM' : 'AM'}`;
    
    return `${selectedDay.dayName}, ${selectedDay.dateString} at ${selectedTimeSlot.timeString} - ${endTimeString}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Schedule New Appointment
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Time Display */}
              <div className="mb-6 p-3 bg-gray-50 rounded-md">
                <p className="text-sm font-medium text-gray-700">
                  {getTimeDisplay()}
                </p>
              </div>

              <div className="space-y-4">
                {/* Patient Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient *
                  </label>
                  <PatientLookup
                    onPatientSelect={setSelectedPatient}
                    placeholder="Search for a patient..."
                  />
                  {selectedPatient && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-800">
                        Selected: {getPatientName(selectedPatient)}
                      </p>
                    </div>
                  )}
                  {errors.patient && (
                    <p className="mt-1 text-sm text-red-600">{errors.patient}</p>
                  )}
                </div>

                {/* Appointment Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Type
                  </label>
                  {typesError ? (
                    <div className="text-sm text-red-600">Error loading appointment types: {typesError.message}</div>
                  ) : (
                    <select
                      value={appointmentType}
                      onChange={(e) => setAppointmentType(e.target.value)}
                      disabled={typesLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                    >
                      {typesLoading ? (
                        <option>Loading...</option>
                      ) : (
                        appointmentTypes.map((type) => (
                          <option key={type.code} value={type.code}>
                            {type.display || type.code}
                          </option>
                        ))
                      )}
                    </select>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  {statusError ? (
                    <div className="text-sm text-red-600">Error loading appointment statuses: {statusError.message}</div>
                  ) : (
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as Appointment['status'])}
                      disabled={statusLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                    >
                      {statusLoading ? (
                        <option>Loading...</option>
                      ) : (
                        appointmentStatuses.map((statusOption) => (
                          <option key={statusOption.code} value={statusOption.code}>
                            {statusOption.display || statusOption.code}
                          </option>
                        ))
                      )}
                    </select>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Add any additional notes..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {errors.submit && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{errors.submit}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={createAppointmentMutation.isPending || typesLoading || statusLoading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createAppointmentMutation.isPending ? 'Creating...' : 'Create Appointment'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}