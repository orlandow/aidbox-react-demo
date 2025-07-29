import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import aidbox from '../../services/aidbox';
import { queryKeys } from '../../hooks/api/queryKeys';
import type { Patient } from '../../types/fhir/Patient';

interface PatientLookupProps {
  onPatientSelect: (patient: Patient) => void;
  placeholder?: string;
  className?: string;
}

export default function PatientLookup({ onPatientSelect, placeholder = "Search patients...", className = "" }: PatientLookupProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: queryKeys.patients.list({ query }),
    queryFn: () => aidbox.search('Patient', { 
      name: query,
      _count: '10'
    }),
    enabled: query.length >= 2,
    staleTime: 30 * 1000,
  });
  const patients = searchResults?.entry?.map(entry => entry.resource).filter((patient): patient is Patient => !!patient) || [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length >= 2);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || patients.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < patients.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && patients[selectedIndex]) {
          handlePatientSelect(patients[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handlePatientSelect = (patient: Patient) => {
    const patientName = getPatientName(patient);
    setQuery(patientName);
    setIsOpen(false);
    setSelectedIndex(-1);
    onPatientSelect(patient);
  };

  const getPatientName = (patient: Patient): string => {
    if (!patient.name || patient.name.length === 0) {
      return 'Unknown Patient';
    }

    const name = patient.name[0];
    const given = name.given?.join(' ') || '';
    const family = name.family || '';
    
    return `${given} ${family}`.trim() || 'Unknown Patient';
  };

  const getPatientInfo = (patient: Patient): string => {
    const parts = [];
    
    if (patient.birthDate) {
      const age = new Date().getFullYear() - new Date(patient.birthDate).getFullYear();
      parts.push(`Age ${age}`);
    }
    
    if (patient.gender) {
      parts.push(patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1));
    }

    if (patient.identifier && patient.identifier.length > 0) {
      const mrn = patient.identifier.find(id => id.type?.coding?.[0]?.code === 'MR');
      if (mrn?.value) {
        parts.push(`MRN: ${mrn.value}`);
      }
    }

    return parts.join(' • ');
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(query.length >= 2)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              Searching...
            </div>
          ) : patients.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              {query.length < 2 ? 'Type at least 2 characters to search' : 'No patients found'}
            </div>
          ) : (
            patients.map((patient, index) => (
              <button
                key={patient.id}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none ${
                  index === selectedIndex ? 'bg-gray-50' : ''
                }`}
                onClick={() => handlePatientSelect(patient)}
              >
                <div className="font-medium text-gray-900">
                  {getPatientName(patient)}
                </div>
                <div className="text-sm text-gray-500">
                  {getPatientInfo(patient)}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}