import type { Appointment } from '../types/fhir/Appointment';
import { getAppointmentColor, getAppointmentStatusColor, APPOINTMENT_STATUS_COLORS } from '../utils/colors';
import { formatRelativeTime } from '../utils/date';

interface AppointmentIndicatorProps {
  appointments: Appointment[];
}

export default function AppointmentIndicator({ appointments }: AppointmentIndicatorProps) {
  if (!appointments || appointments.length === 0) {
    return null;
  }

  const formatAppointmentDate = (date: string | Date): string => {
    const targetDate = new Date(date);
    return targetDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getAppointmentTypeLabel = (appointmentType?: Appointment['appointmentType']): string => {
    const type = appointmentType?.coding?.[0]?.code || appointmentType?.text;
    
    switch (type) {
      case 'ROUTINE':
        return 'Routine';
      case 'EMERGENCY':
        return 'Emergency';
      case 'FOLLOWUP':
        return 'Follow-up';
      case 'CONSULTATION':
        return 'Consultation';
      default:
        return appointmentType?.text || 'Appointment';
    }
  };

  const getAppointmentStatusLabel = (status: Appointment['status']): string => {
    const statusLabels: Record<string, string> = {
      'proposed': 'Proposed',
      'pending': 'Pending',
      'booked': 'Booked',
      'arrived': 'Arrived',
      'fulfilled': 'Fulfilled',
      'cancelled': 'Cancelled',
      'noshow': 'No Show',
    };
    return statusLabels[status] || status;
  };

  const nextAppointment = appointments[0];
  const additionalCount = appointments.length - 1;
  const typeColor = getAppointmentColor(nextAppointment);

  // Map colors to explicit Tailwind classes to ensure they're included in build
  const getBorderClass = (color: string) => {
    switch (color) {
      case 'red': return 'border-b-red-300';
      case 'green': return 'border-b-green-300';
      case 'blue': return 'border-b-blue-300';
      case 'purple': return 'border-b-purple-300';
      case 'yellow': return 'border-b-yellow-300';
      case 'orange': return 'border-b-orange-300';
      default: return 'border-b-gray-300';
    }
  };

  const borderClass = getBorderClass(typeColor);

  const tooltipContent = appointments.map((apt) => (
    `${formatAppointmentDate(apt.start!)} - ${getAppointmentTypeLabel(apt.appointmentType)} (${getAppointmentStatusLabel(apt.status)})`
  )).join('\n');

  return (
    <div className="flex items-center" title={tooltipContent}>
      <div className={`text-center border border-gray-300 border-b-4 ${borderClass} rounded-md bg-white shadow-sm px-3 py-2 w-20`}>
        <div className="text-lg font-bold text-gray-900">
          {formatAppointmentDate(nextAppointment.start!)}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">
          {formatRelativeTime(nextAppointment.start!)}
        </div>
      </div>
      <div className="text-xs text-gray-500 ml-2 w-16">
        {additionalCount > 0 ? `+${additionalCount} more` : ''}
      </div>
    </div>
  );
}