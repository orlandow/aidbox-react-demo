import type { Patient } from '../types/fhir';

interface StringifyPatientOptions {
  includeDemographics?: boolean;
}

/**
 * Formats a FHIR Patient resource into a readable name string
 * @param patient - The FHIR Patient resource
 * @param options - Configuration options
 */
export function stringifyPatient(patient: Patient, options: StringifyPatientOptions = {}): string {
  const name = getPatientName(patient);
  
  if (!options.includeDemographics) {
    return name;
  }
  
  const demographics = stringifyDemographics(patient);
  return demographics ? `${name} ${demographics}` : name;
}

/**
 * Formats just the demographics part (e.g., "35yoF")
 */
export function stringifyDemographics(patient: Patient): string {
  const age = getPatientAge(patient);
  const gender = patient.gender ? patient.gender.charAt(0).toUpperCase() : '';
  
  if (age !== null && gender) {
    return `${age}yo${gender}`;
  } else if (age !== null) {
    return `${age}yo`;
  } else if (gender) {
    return gender;
  }
  return '';
}

/**
 * Gets the patient name from FHIR Patient resource
 */
function getPatientName(patient: Patient): string {
  const name = patient.name?.[0];
  if (!name) return 'Unknown Patient';
  
  const firstName = name.given?.[0] || '';
  const lastName = name.family || '';
  return `${firstName} ${lastName}`.trim() || 'Unknown Patient';
}

/**
 * Calculates patient age from birth date
 */
function getPatientAge(patient: Patient): number | null {
  if (!patient.birthDate) return null;
  const today = new Date();
  const birthDate = new Date(patient.birthDate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}