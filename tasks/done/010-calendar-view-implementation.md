# Task: Calendar View Implementation

## Description
Implement a comprehensive calendar view for managing FHIR Appointments with focus on work hours scheduling. The calendar will provide week-view display, appointment scheduling with patient lookup, and appointment detail viewing.

## Features

### Calendar UI
- **Week View**: Display 7-day week with work hours (8 AM - 6 PM)
- **30-minute Time Slots**: Grid-based layout with 30-minute intervals
- **Custom Tailwind Implementation**: Built with existing design system
- **Navigation**: Previous/next week buttons + "Today" button
- **Free Slots**: Empty clickable grid cells for new appointments

### Appointment Management
- **Display Appointments**: Show existing appointments in time slots
- **Color Coding**: Different colors by appointment type (using HL7 v2-0276 value set)
- **Status Badges**: Visual indicators for appointment status
- **Click to Schedule**: Click empty slots to create new appointments
- **Conflict Warnings**: Alert users when scheduling over existing appointments

### Patient Lookup
- **Inline Search**: Compact patient search component for scheduling
- **Typeahead Dropdown**: Quick patient lookup with name + basic info
- **Auto-fill**: Select patient and auto-populate appointment form

### Appointment Details
- **Detail View**: Click appointments to view details
- **Information Display**: Patient name, status, appointment type
- **Quick Actions**: Edit/cancel options from detail view

## Technical Requirements

### FHIR Integration
- Use existing `Appointment` FHIR type from `src/types/fhir/Appointment.ts`
- Leverage established Aidbox service for CRUD operations
- Implement React Query hooks for data fetching and caching

### Calendar Data Structure
```typescript
// Calendar view needs:
- start/end: ISO datetime strings
- status: 'proposed' | 'pending' | 'booked' | 'arrived' | 'fulfilled' | 'cancelled' | 'noshow'
- participant: Array with patient reference
- appointmentType: CodeableConcept (HL7 v2-0276)
```

### Appointment Types (HL7 v2-0276)
Hard-code initial support for:
- Routine appointment
- Walk-in
- Checkup
- Emergency
- Follow-up

## Acceptance Criteria

### Calendar Display
- [ ] Week view showing 7 days with proper date headers
- [ ] Time slots from 8 AM to 6 PM in 30-minute intervals
- [ ] Navigation between weeks with prev/next/today buttons
- [ ] Responsive design that works on different screen sizes
- [ ] Empty slots are clearly clickable areas

### Appointment Visualization
- [ ] Existing appointments display in correct time slots
- [ ] Appointment types have distinct color coding
- [ ] Status badges show current appointment status
- [ ] Appointments span correct duration (30 minutes)
- [ ] Overflow handling for long patient names/details

### Scheduling Workflow
- [ ] Click empty slot opens new appointment modal/form
- [ ] Inline patient search with typeahead functionality
- [ ] Patient selection auto-fills appointment details
- [ ] Form validation prevents invalid scheduling
- [ ] Conflict detection shows warning for overlapping appointments
- [ ] Successful creation updates calendar immediately

### Appointment Details
- [ ] Click existing appointment opens detail view
- [ ] Detail view shows patient, status, type, time
- [ ] Quick actions available (edit, cancel, mark as completed)
- [ ] Detail view integrates with existing patient management

### Data Management
- [ ] React Query hooks for appointments (fetch, create, update, delete)
- [ ] Proper loading states during API operations
- [ ] Error handling with user-friendly messages
- [ ] Cache invalidation after appointment changes
- [ ] Real-time updates when appointments are modified

## Implementation Plan

### Phase 1: Calendar UI Foundation
1. Create calendar grid component with time slots
2. Implement week navigation functionality
3. Add responsive design and basic styling
4. Handle date calculations and time slot generation

### Phase 2: Appointment Display
1. Create React Query hooks for appointment data
2. Implement appointment rendering in time slots
3. Add color coding by appointment type
4. Create status badge component
5. Handle appointment click interactions

### Phase 3: Scheduling Interface
1. Build inline patient search component
2. Create new appointment modal/form
3. Implement conflict detection logic
4. Add form validation and submission
5. Integrate with existing patient management

### Phase 4: Detail View & Actions
1. Create appointment detail modal/view
2. Add quick action buttons (edit, cancel, complete)
3. Implement appointment state transitions
4. Add confirmation dialogs for destructive actions

## Files to Create
- `src/pages/Calendar.tsx` - Main calendar view (replace existing placeholder)
- `src/components/calendar/CalendarGrid.tsx` - Week view grid component
- `src/components/calendar/AppointmentSlot.tsx` - Individual appointment display
- `src/components/calendar/PatientLookup.tsx` - Inline patient search
- `src/components/calendar/AppointmentForm.tsx` - New appointment creation
- `src/components/calendar/AppointmentDetail.tsx` - Appointment detail view  
- `src/hooks/api/useAppointments.ts` - React Query hooks for appointments
- `src/utils/calendar.ts` - Date/time calculation utilities

## Files to Modify
- `src/hooks/api/queryKeys.ts` - Add appointment query keys
- `src/hooks/api/index.ts` - Export new appointment hooks

## Testing Requirements
- [ ] End-to-end Playwright tests for complete scheduling workflow
- [ ] Test week navigation and date calculations
- [ ] Test patient search and appointment creation
- [ ] Test appointment detail view and actions
- [ ] Test conflict detection and error handling
- [ ] Test responsive design on different screen sizes

## Dependencies
- Existing patient management system and API hooks
- FHIR Appointment types and Aidbox service
- React Query setup and patterns
- Tailwind CSS and Tailwind UI components
- Current routing and navigation structure

## Success Metrics
- Users can navigate calendar weeks smoothly
- Scheduling new appointments takes < 30 seconds
- Appointment conflicts are clearly communicated
- Calendar loads and displays appointments quickly
- Mobile/tablet experience is functional and intuitive

## Notes
- Start with custom Tailwind implementation; migrate to library if complexity grows
- All appointments default to 30-minute duration for POC
- Focus on core functionality before advanced features
- Maintain consistency with existing design patterns
- Prioritize performance and user experience