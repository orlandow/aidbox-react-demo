import type { Encounter, Appointment, Patient } from '../types/fhir';
import aidbox from './aidbox';

export interface CreateEncounterParams {
  patient: Patient;
  appointment?: Appointment;
}

export async function createEncounter({ patient, appointment }: CreateEncounterParams): Promise<Encounter> {
  const encounter: Partial<Encounter> = {
    resourceType: 'Encounter',
    status: 'in-progress',
    class: {
      system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
      code: 'AMB',
      display: 'ambulatory'
    },
    subject: {
      reference: `Patient/${patient.id}`,
      display: patient.name?.[0] ? 
        `${patient.name[0].given?.join(' ') || ''} ${patient.name[0].family || ''}`.trim() :
        'Unknown Patient'
    },
    period: {
      start: new Date().toISOString()
    }
  };

  // Link to appointment if provided
  if (appointment) {
    encounter.appointment = [{
      reference: `Appointment/${appointment.id}`
    }];
  }

  return aidbox.create('Encounter', encounter as Encounter);
}

export async function completeEncounter(encounterId: string): Promise<Encounter> {
  const encounter = await aidbox.read('Encounter', encounterId);
  
  const updatedEncounter = {
    ...encounter,
    status: 'finished' as const,
    period: {
      ...encounter.period,
      end: new Date().toISOString()
    }
  };

  return aidbox.update('Encounter', encounterId, updatedEncounter);
}

export async function getActiveEncountersForPatient(patientId: string): Promise<Encounter[]> {
  const searchResult = await aidbox.search('Encounter', {
    'subject': `Patient/${patientId}`,
    'status': 'in-progress'
  });

  return searchResult.entry?.map(entry => entry.resource).filter((resource): resource is Encounter => !!resource) || [];
}

export async function getAllActiveEncounters(): Promise<Encounter[]> {
  const searchResult = await aidbox.search('Encounter', {
    'status': 'in-progress'
  });

  return searchResult.entry?.map(entry => entry.resource).filter((resource): resource is Encounter => !!resource) || [];
}

