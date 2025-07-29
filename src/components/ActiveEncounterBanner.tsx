import { useLocation, Link } from 'react-router-dom';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { useAllActiveEncounters } from '../hooks/api';
import { usePatient } from '../hooks/api';
import type { Encounter } from '../types/fhir';
import { stringifyPatient } from '../utils/stringify';

export default function ActiveEncounterBanner() {
  const location = useLocation();
  const { data: activeEncounters = [] } = useAllActiveEncounters();

  // Don't show on encounter pages
  if (location.pathname.startsWith('/encounter/')) {
    return null;
  }

  // Don't show if no active encounters
  if (activeEncounters.length === 0) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <CalendarIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <div className="text-sm text-yellow-700">
            {activeEncounters.length === 1 ? (
              <ActiveEncounterItem encounter={activeEncounters[0]} />
            ) : (
              <div>
                <p className="font-medium">You have {activeEncounters.length} active encounters that need to be completed:</p>
                <ul className="mt-2 space-y-1">
                  {activeEncounters.map((encounter) => (
                    <li key={encounter.id}>
                      <ActiveEncounterItem encounter={encounter} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActiveEncounterItem({ encounter }: { encounter: Encounter }) {
  const patientId = encounter.subject?.reference?.replace('Patient/', '') || '';
  const { data: patient } = usePatient(patientId);

  return (
    <span>
      Open encounter with{' '}
      <Link
        to={`/encounter/${encounter.id}`}
        className="font-medium text-yellow-800 underline hover:text-yellow-900"
      >
        {patient ? stringifyPatient(patient) : 'Unknown Patient'}
      </Link>
    </span>
  );
}