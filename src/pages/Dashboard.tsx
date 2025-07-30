import { useDashboardStats } from '../hooks/api/useDashboard';
import { getAppointmentColor } from '../utils/colors';
import type { Appointment } from '../types/fhir';

export default function Dashboard() {
  const { data: stats, isLoading, error } = useDashboardStats();

  const formatAppointmentTime = (appointment: Appointment) => {
    if (!appointment.start) return '';
    return new Date(appointment.start).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getPatientName = (appointment: Appointment) => {
    const patientRef = appointment.participant?.find(p => 
      p.actor?.reference?.startsWith('Patient/')
    );
    return patientRef?.actor?.display || 'Unknown Patient';
  };

  const getAppointmentType = (appointment: Appointment) => {
    const type = appointment.appointmentType?.coding?.[0]?.code;

    switch (type) {
      case 'ROUTINE':
        return 'Routine';
      case 'EMERGENCY':
        return 'Emergency';
      case 'FOLLOWUP':
        return 'Follow-up';
      case 'WALKIN':
        return 'Walk-in';
      case 'CHECKUP':
        return 'Check-up';
      default:
        return appointment.appointmentType?.text || 'Appointment';
    }
  };

  const getTypeColorClasses = (appointment: Appointment) => {
    const color = getAppointmentColor(appointment);
    switch (color) {
      case 'blue':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'red':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'green':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'purple':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-red-600">Error loading dashboard: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Patient intake management system</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">P</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Patients</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {isLoading ? '...' : stats?.totalPatients || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Appointments</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {isLoading ? '...' : stats?.totalAppointments || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Today's Appointments</h2>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="text-gray-500">Loading appointments...</div>
          ) : stats?.todayAppointments && stats.todayAppointments.length > 0 ? (
            <div className="space-y-3">
              {stats.todayAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center gap-4">
                  {/* Time on the left - bigger */}
                  <div className="flex-shrink-0 w-24 text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      {formatAppointmentTime(appointment)}
                    </div>
                  </div>
                  
                  {/* Appointment card - similar to calendar */}
                  <div className={`flex-1 p-3 rounded border text-sm ${getTypeColorClasses(appointment)}`}>
                    <div className="font-medium truncate">{getPatientName(appointment)}</div>
                    <div className="text-xs opacity-75 truncate">{getAppointmentType(appointment)}</div>
                    <div className="text-xs opacity-75 capitalize">{appointment.status}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">No appointments scheduled for today</div>
          )}
        </div>
      </div>
    </div>
  );
}