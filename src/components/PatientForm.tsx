import { useState } from 'react';
import type { Patient } from '../types/fhir';

interface PatientFormData {
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'other' | 'unknown';
  birthDate: string;
  phone: string;
  email: string;
  language: string;
}

interface PatientFormProps {
  onSubmit: (patient: Patient) => void;
  onCancel: () => void;
  loading?: boolean;
  isEditing?: boolean;
  initialData?: Patient;
}

export default function PatientForm({ onSubmit, onCancel, loading = false, isEditing = false, initialData }: PatientFormProps) {
  // Helper function to convert Patient to form data
  const patientToFormData = (patient?: Patient): PatientFormData => {
    if (!patient) {
      return {
        firstName: '',
        lastName: '',
        gender: 'unknown',
        birthDate: '',
        phone: '',
        email: '',
        language: 'en'
      };
    }

    const name = patient.name?.[0];
    const phone = patient.telecom?.find(t => t.system === 'phone')?.value || '';
    const email = patient.telecom?.find(t => t.system === 'email')?.value || '';
    const language = patient.communication?.[0]?.language?.text || 'en';

    return {
      firstName: name?.given?.[0] || '',
      lastName: name?.family || '',
      gender: patient.gender || 'unknown',
      birthDate: patient.birthDate || '',
      phone,
      email,
      language
    };
  };

  const [formData, setFormData] = useState<PatientFormData>(() => 
    patientToFormData(initialData)
  );

  const [errors, setErrors] = useState<Partial<PatientFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<PatientFormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.birthDate) {
      newErrors.birthDate = 'Birth date is required';
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Map form data to FHIR Patient resource
    const patient: Patient & { resourceType: 'Patient' } = {
      resourceType: 'Patient',
      name: [{
        use: 'official',
        given: [formData.firstName],
        family: formData.lastName
      }],
      gender: formData.gender,
      birthDate: formData.birthDate
    };

    // Include ID and meta when editing
    if (isEditing && initialData?.id) {
      patient.id = initialData.id;
      if (initialData.meta) {
        patient.meta = initialData.meta;
      }
    }

    // Only add telecom if we have contact info
    const telecom = [
      ...(formData.phone ? [{
        system: 'phone' as const,
        value: formData.phone,
        use: 'home' as const
      }] : []),
      ...(formData.email ? [{
        system: 'email' as const,
        value: formData.email,
        use: 'home' as const
      }] : [])
    ];
    
    if (telecom.length > 0) {
      patient.telecom = telecom;
    }

    // Only add communication if we have language
    if (formData.language && formData.language !== 'en') {
      patient.communication = [{
        language: {
          text: formData.language
        }
      }];
    }

    onSubmit(patient);
  };

  const handleInputChange = (field: keyof PatientFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.firstName ? 'border-red-300' : ''
            }`}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.lastName ? 'border-red-300' : ''
            }`}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            id="gender"
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value as PatientFormData['gender'])}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="unknown">Unknown</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
            Birth Date *
          </label>
          <input
            type="date"
            id="birthDate"
            value={formData.birthDate}
            onChange={(e) => handleInputChange('birthDate', e.target.value)}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.birthDate ? 'border-red-300' : ''
            }`}
          />
          {errors.birthDate && (
            <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.email ? 'border-red-300' : ''
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="language" className="block text-sm font-medium text-gray-700">
            Preferred Language
          </label>
          <select
            id="language"
            value={formData.language}
            onChange={(e) => handleInputChange('language', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="zh">Chinese</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Patient' : 'Create Patient')}
        </button>
      </div>
    </form>
  );
}