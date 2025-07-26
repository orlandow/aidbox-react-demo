import type { Patient } from '../types/fhir';

/**
 * Formats a FHIR Patient resource into a readable name string
 */
export function stringifyPatient(patient: Patient): string {
  const name = patient.name?.[0];
  if (!name) return 'Unknown Patient';
  
  const firstName = name.given?.[0] || '';
  const lastName = name.family || '';
  return `${firstName} ${lastName}`.trim() || 'Unknown Patient';
}