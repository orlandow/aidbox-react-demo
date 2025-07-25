// FHIR Resource types
export interface Patient {
  resourceType: 'Patient';
  id?: string;
  name?: Array<{
    family?: string;
    given?: string[];
  }>;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other' | 'unknown';
  telecom?: Array<{
    system?: 'phone' | 'email';
    value?: string;
  }>;
  address?: Array<{
    line?: string[];
    city?: string;
    state?: string;
    postalCode?: string;
  }>;
}

export interface Encounter {
  resourceType: 'Encounter';
  id?: string;
  status: 'planned' | 'arrived' | 'triaged' | 'in-progress' | 'onleave' | 'finished' | 'cancelled';
  subject: {
    reference: string;
  };
  period?: {
    start?: string;
    end?: string;
  };
}

export interface Observation {
  resourceType: 'Observation';
  id?: string;
  status: 'registered' | 'preliminary' | 'final' | 'amended';
  code: {
    coding: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
  };
  subject: {
    reference: string;
  };
  encounter?: {
    reference: string;
  };
  valueQuantity?: {
    value: number;
    unit: string;
    system?: string;
    code?: string;
  };
}

// FHIR Bundle type
export interface Bundle<T = any> {
  resourceType: 'Bundle';
  total?: number;
  link?: Array<{
    relation: string;
    url: string;
  }>;
  entry?: Array<{
    resource: T;
  }>;
}

// Resource type mapping for generic functions
export type FHIRResourceMap = {
  'Patient': Patient;
  'Encounter': Encounter;
  'Observation': Observation;
};