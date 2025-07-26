import { useNavigate } from 'react-router-dom';
import type { Patient } from '../types/fhir';

interface PatientListProps {
  patients: Patient[];
  loading: boolean;
  searchQuery?: string;
  emptyMessage?: string;
}

export default function PatientList({ patients, loading, searchQuery = '', emptyMessage }: PatientListProps) {
  const navigate = useNavigate();

  const handleRowClick = (patientId: string) => {
    navigate(`/patients/${patientId}`);
  };
  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          {searchQuery ? 'No matching patients' : 'No patients'}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {emptyMessage || (searchQuery ? 'Try adjusting your search terms or filters.' : 'Get started by creating a new patient.')}
        </p>
      </div>
    );
  }

  const formatName = (patient: Patient): string => {
    const name = patient.name?.[0];
    if (!name) return 'Unknown';
    
    const firstName = name.given?.[0] || '';
    const lastName = name.family || '';
    return `${firstName} ${lastName}`.trim() || 'Unknown';
  };

  const formatGender = (gender?: Patient['gender']): string => {
    if (!gender || gender === 'unknown') return '';
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  };

  const calculateAge = (birthDate?: string): string => {
    if (!birthDate) return '';
    try {
      const birth = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return `${age}yo`;
    } catch {
      return '';
    }
  };

  const getContactInfo = (patient: Patient) => {
    const phone = patient.telecom?.find(t => t.system === 'phone')?.value;
    const email = patient.telecom?.find(t => t.system === 'email')?.value;
    return { phone, email };
  };

  const getInitials = (patient: Patient): string => {
    const name = patient.name?.[0];
    if (!name) return '?';
    
    const first = name.given?.[0]?.[0] || '';
    const last = name.family?.[0] || '';
    return (first + last).toUpperCase() || '?';
  };

  const highlightMatch = (text: string, query: string): React.ReactNode => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 text-gray-900 font-medium">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <ul className="divide-y divide-gray-200">
      {patients.map((patient) => {
        const { phone, email } = getContactInfo(patient);
        const age = calculateAge(patient.birthDate);
        const gender = formatGender(patient.gender);
        
        return (
          <li key={patient.id}>
            <div 
              className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
              onClick={() => handleRowClick(patient.id!)}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-indigo-100 rounded-full h-10 w-10 flex items-center justify-center">
                    <span className="text-sm font-medium text-indigo-700">
                      {getInitials(patient)}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900">
                      {highlightMatch(formatName(patient), searchQuery)}
                    </p>
                    {age && (
                      <span className="text-sm text-gray-500">{age}</span>
                    )}
                    {gender && (
                      <span className="text-sm text-gray-500">{gender}</span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>
                        {phone ? highlightMatch(phone, searchQuery) : (
                          <span className="text-gray-400 italic">No phone</span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>
                        {email ? highlightMatch(email, searchQuery) : (
                          <span className="text-gray-400 italic">No email</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}