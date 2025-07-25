import { useEffect, useState } from 'react';
import aidbox from '../services/aidbox';
import type { Patient } from '../types';

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPatients() {
      const result = await aidbox.search('Patient');
      const patients = result.entry?.map(entry => entry.resource) || [];
      setPatients(patients);
      setLoading(false);
    }
    fetchPatients();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
        <p className="text-gray-600 mt-2">Patient management and records</p>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        {loading ? (
          <p className="text-gray-500">Loading patients...</p>
        ) : (
          <pre>{JSON.stringify(patients, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}