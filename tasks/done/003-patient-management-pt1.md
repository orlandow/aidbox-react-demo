# Task: Patient Management - Create & List

## Description
Implement patient creation and listing functionality to replace the current POC implementation. Create a professional patient management system with the ability to create new patients via a form and display them in a well-designed list view.

## Features

### Create Patient
- Form to capture patient data and convert to FHIR format
- Fields to capture:
  - first name, last name
  - gender (male, female, other, unknown - hard-coded options for now)
  - birthDate
  - telecom.phone
  - telecom.email
  - communication.language (hard-coded options for now)
- Post data to FHIR server using existing aidbox service

### List Patients
- Professional-looking patient list replacing current JSON dump POC
- Display key patient information in organized format
- Responsive design using Tailwind CSS

## Acceptance Criteria
- [x] Add `create` function to aidbox.ts service
- [x] Analyze current POC implementation and FHIR Patient resource structure
- [x] Design form component for patient creation with proper FHIR mapping
- [x] Implement patient creation form with validation
- [x] Refactor patient list to display professional patient cards
- [x] Integrate create functionality with existing aidbox service
- [x] Add URL routing for bookmarkable patient creation (/patients/new)
- [x] Sanitize FHIR data to prevent empty arrays being sent to server
- [x] Update patient list layout: Name age gender / phone email with icons
- [x] Add "yo" suffix to age display (40yo Male)
- [x] Show "n/a" placeholders for missing contact information
- [x] Use lighter TailwindUI-style layout without boxes
- [x] Restore indigo colors for avatar placeholders
- [x] Test patient creation and listing functionality end-to-end using playwright MCP server
- [x] Ensure responsive design and good UX
- [x] Verify FHIR data structure correctness

## Notes
- Current POC exists in `src/pages/Patients.tsx` with basic patient fetching
- Use existing generic aidbox service methods from task #2
- Use Tailwind CSS and Tailwind UI for styling
- Focus on clean, simple code as per project guidelines
- Will bind gender and language to ValueSets in future tasks

## Technical Considerations
- Need to understand FHIR Patient resource structure for proper data mapping
- Form validation for required fields
- Error handling for API calls
- State management for form and list
- Responsive design patterns

## Testing
- Use playwright MCP server for end-to-end testing
- If needed for debugging, use curl to make direct requests to Aidbox instance at http://localhost:8080/fhir

## Implementation Summary

### Core Features Implemented
- **Patient Creation**: Complete form with validation for name, gender, birthDate, phone, email, and language
- **Patient Listing**: Professional list view replacing JSON dump POC
- **URL Routing**: Bookmarkable `/patients/new` route with proper navigation
- **FHIR Integration**: Proper Patient resource mapping with data sanitization

### Technical Improvements
- **Generic Service**: Added `create()` method to aidbox.ts for type-safe FHIR operations
- **Data Validation**: Form validation with error messages for required fields
- **Data Sanitization**: Prevents empty arrays being sent to FHIR server
- **State Management**: Proper loading states and form/list state handling

### UI/UX Enhancements
- **Layout**: Name age gender / phone email format with icons
- **Age Display**: Shows calculated age with "yo" suffix (e.g., "40yo Male")
- **Contact Info**: Icons for phone/email with "n/a" placeholders when missing
- **Design**: Lighter TailwindUI-style without boxes, indigo avatar colors
- **Responsive**: Mobile-friendly design with proper spacing

### Code Summary
- **Added**: `src/pages/PatientForm.tsx` - Dedicated patient creation page
- **Added**: `src/components/PatientForm.tsx` - Reusable form component
- **Added**: `src/components/PatientList.tsx` - Professional patient list component
- **Enhanced**: `src/services/aidbox.ts` - Added generic create method
- **Updated**: `src/pages/Patients.tsx` - Simplified to use new components and routing
- **Updated**: `src/App.tsx` - Added `/patients/new` route

## Testing Results
- ✅ End-to-end patient creation workflow tested with playwright
- ✅ URL navigation and bookmarking verified
- ✅ FHIR data persistence confirmed via curl
- ✅ Form validation and error handling working
- ✅ Data sanitization preventing server errors
- ✅ Responsive design and professional UI confirmed

## Completion Status
✅ **COMPLETED** - Patient creation and listing functionality fully implemented with professional UI, proper FHIR integration, URL routing, and thorough testing. Ready for future enhancement with Update and Delete operations.