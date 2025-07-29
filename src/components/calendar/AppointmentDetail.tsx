import { useState } from 'react';
import { XMarkIcon, PencilIcon, TrashIcon, PlayIcon } from '@heroicons/react/24/outline';
import { useUpdateAppointment, useDeleteAppointment, useCreateEncounter, useActiveEncountersForPatient, usePatient } from '../../hooks/api';
import { getAppointmentStatusColor, APPOINTMENT_STATUS_COLORS } from '../../utils/colors';
import type { Appointment } from '../../types/fhir/Appointment';

interface AppointmentDetailProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}


export default function AppointmentDetail({ isOpen, onClose, appointment }: AppointmentDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editStatus, setEditStatus] = useState<Appointment['status']>('booked');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const statusOptions: { value: Appointment['status']; label: string; color: string }[] = [
    { value: 'proposed', label: 'Proposed', color: 'gray' },
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'booked', label: 'Booked', color: 'blue' },
    { value: 'arrived', label: 'Arrived', color: 'green' },
    { value: 'fulfilled', label: 'Fulfilled', color: 'purple' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' },
    { value: 'noshow', label: 'No Show', color: 'orange' },
  ];

  const getAppointmentStatusInfo = (status: Appointment['status']) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0];
  };

  const updateAppointmentMutation = useUpdateAppointment();
  const deleteAppointmentMutation = useDeleteAppointment();
  const createEncounterMutation = useCreateEncounter();

  const handleEdit = () => {
    if (appointment) {
      setEditStatus(appointment.status);
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!appointment) return;

    try {
      await updateAppointmentMutation.mutateAsync({
        id: appointment.id!,
        appointment: { ...appointment, status: editStatus },
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const handleDelete = async () => {
    if (!appointment) return;

    try {
      await deleteAppointmentMutation.mutateAsync(appointment.id!);
      setShowDeleteConfirm(false);
      onClose();
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const getPatientName = (): string => {
    if (!appointment) return '';
    
    const patientParticipant = appointment.participant?.find(
      p => p.actor?.reference?.startsWith('Patient/')
    );
    return patientParticipant?.actor?.display || 'Unknown Patient';
  };

  const getAppointmentType = (): string => {
    if (!appointment) return '';
    
    return appointment.appointmentType?.text || 
           appointment.appointmentType?.coding?.[0]?.display || 
           'Appointment';
  };

  const formatDateTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };


  const getPatientId = (): string => {
    if (!appointment) return '';
    
    const patientParticipant = appointment.participant?.find(
      p => p.actor?.reference?.startsWith('Patient/')
    );
    return patientParticipant?.actor?.reference?.replace('Patient/', '') || '';
  };

  const patientId = getPatientId();
  const { data: patient } = usePatient(patientId);
  const { data: activeEncounters = [] } = useActiveEncountersForPatient(patientId);

  const hasActiveEncounter = activeEncounters.length > 0;
  
  const handleStartEncounter = async () => {
    if (!patient || !appointment) return;

    try {
      await createEncounterMutation.mutateAsync({
        patient,
        appointment
      });
      onClose();
    } catch (error) {
      console.error('Error starting encounter:', error);
    }
  };

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Appointment Details
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Patient Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Patient</h4>
                <p className="text-lg text-gray-700">{getPatientName()}</p>
                {getPatientId() && (
                  <p className="text-sm text-gray-500">ID: {getPatientId()}</p>
                )}
              </div>

              {/* Date and Time */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Date & Time</h4>
                <p className="text-gray-700">
                  {appointment.start && formatDateTime(appointment.start)}
                </p>
                {appointment.minutesDuration && (
                  <p className="text-sm text-gray-500">
                    Duration: {appointment.minutesDuration} minutes
                  </p>
                )}
              </div>

              {/* Appointment Type */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Type</h4>
                <p className="text-gray-700">{getAppointmentType()}</p>
              </div>

              {/* Status */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Status</h4>
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as Appointment['status'])}
                      className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleSave}
                      disabled={updateAppointmentMutation.isPending}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      {updateAppointmentMutation.isPending ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full bg-${getAppointmentStatusInfo(appointment.status).color}-100 text-${getAppointmentStatusInfo(appointment.status).color}-800`}>
                      {getAppointmentStatusInfo(appointment.status).label}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              {appointment.description && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">{appointment.description}</p>
                </div>
              )}

              {/* Actions */}
              <div className="border-t pt-4">
                {hasActiveEncounter && (
                  <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      This patient has an active encounter. Complete the existing encounter before starting a new one.
                    </p>
                  </div>
                )}
                
                <div className="flex space-x-2 flex-wrap">
                  {!hasActiveEncounter && patient && (
                    <button
                      onClick={handleStartEncounter}
                      disabled={createEncounterMutation.isPending}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      <PlayIcon className="h-4 w-4 mr-1" />
                      {createEncounterMutation.isPending ? 'Starting...' : 'Start Encounter'}
                    </button>
                  )}
                  
                  {!isEditing && (
                    <button
                      onClick={handleEdit}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Edit Status
                    </button>
                  )}
                  
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="border-t bg-gray-50 px-4 py-3 sm:px-6">
              <div className="mb-3">
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete this appointment? This action cannot be undone.
                </p>
              </div>
              <div className="flex space-x-2 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteAppointmentMutation.isPending}
                  className="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  {deleteAppointmentMutation.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}