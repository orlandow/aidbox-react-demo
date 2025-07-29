import type { Appointment } from '../types/fhir/Appointment';

// Maps FHIR codes to color names
export const APPOINTMENT_STATUS_COLORS: Record<string, string> = {
  'proposed': 'gray',
  'pending': 'yellow',
  'booked': 'blue',
  'arrived': 'green',
  'fulfilled': 'purple',
  'cancelled': 'red',
  'noshow': 'orange',
};

export const APPOINTMENT_TYPE_COLORS: Record<string, string> = {
  'ROUTINE': 'blue',
  'EMERGENCY': 'red',
  'FOLLOWUP': 'green',
  'CONSULTATION': 'purple',
};

// Helper function to get color with fallback
export function getColorForCode(codeMap: Record<string, string>, code: string, fallback: string = 'gray'): string {
  return codeMap[code] || fallback;
}

// Resource-aware color functions (like stringify pattern)
export function getAppointmentColor(appointment: Appointment): string {
  const typeCode = appointment.appointmentType?.coding?.[0]?.code || appointment.appointmentType?.text;
  return getColorForCode(APPOINTMENT_TYPE_COLORS, typeCode);
}

export function getAppointmentStatusColor(appointment: Appointment): string {
  return getColorForCode(APPOINTMENT_STATUS_COLORS, appointment.status);
}