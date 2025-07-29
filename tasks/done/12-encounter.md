# Task: Encounter

## Overview

We want to be able to start and finish encounters based on appointments (as well as a global button to start an encounter with a patient without an appointment, we'll flesh this out later)

## Requirements

### Core Flow
1. **Start from Calendar**: Click an appointment → "Start Encounter" button → Create encounter resource → Navigate to encounter page
2. **Start from Patient Details**: Global "Start Encounter" button on patient details page (for encounters without appointments)
3. **Encounter Management**: Navigate to dedicated encounter page with own routes (`/encounter/{id}`)
4. **Wrap Up**: "Wrap Up" button opens modal with summary space and confirmation
5. **Return**: After wrap up, return to calendar

### Technical Requirements

#### Encounter Resource
- **Status Management**: Use `in-progress` when created, `completed` when wrapped up
- **FHIR Compliance**: Follow FHIR encounter status codes - when using tx bindings for dropdowns, use proper terminology; for single values, add code directly without $expand/$lookup
- **Data Links**: Link to appointment (when started from calendar) and patient (minimum required data)
- **Concurrency**: Prevent multiple active encounters per patient globally

#### UI/UX Requirements
- **Calendar Integration**: Visual indicators for appointments showing encounter status:
  - No encounter: default appearance
  - Active encounter (`in-progress`): suggest visual treatment 
  - Completed encounter: suggest visual treatment
- **Navigation**: 
  - Allow navigation back to calendar from encounter page without finishing encounter
  - Encounter page accessible via dedicated routes (`/encounter/{id}`)
- **Active Encounter Banner**: 
  - Yellow warning-style banner on all non-encounter pages when user has open encounters
  - Shows "Open encounter with [patient name]" with link to encounter page
  - Should be subtle but noticeable - not too strident
- **Encounter Page Layout**: 
  - Keep simple and extensible
  - Display patient info and encounter details
  - "Wrap Up" button prominently displayed
- **Wrap Up Modal**: 
  - Summary section for everything done during encounter (empty/placeholder for now)
  - Confirmation button to complete encounter
  - Modal closes and returns user to calendar after completion

#### Error Handling
- Show error message if encounter creation fails
- Stay on current page and allow retry mechanism
- Handle network failures gracefully

#### Data Integration
- When fetching appointments for calendar, `_revinclude` encounters to show encounter status
- Use existing FHIR types from `./src/types/fhir/Encounter.ts`
- Follow existing API patterns and error handling

## Implementation Considerations

### Routing
- Follow existing patterns from `App.tsx`
- Add new encounter routes to routing structure
- Ensure proper navigation state management

### Styling
- Use existing Tailwind CSS and Tailwind UI components
- Follow established design patterns from other pages
- Maintain consistent styling across the application

### State Management
- Track active encounters for banner display
- Manage encounter state during navigation
- Handle encounter completion state updates

### Future Extensibility
- Design encounter page to accommodate future features (vitals, notes, procedures, etc.)
- Structure data models to support additional encounter content
- Plan for intake form integration in future iterations

## Questions Resolved
- Encounter statuses: Use FHIR codes (`in-progress`, `completed`)
- Calendar visual treatment: Need design suggestions for encounter status indicators
- Navigation: Dedicated routes with back navigation capability
- Active encounter tracking: Global banner system for awareness
- Wrap up process: Modal with summary space and confirmation
- Error handling: Show errors and allow retry
- Concurrent encounters: Prevent multiple active encounters per patient
- Post-completion navigation: Return to calendar
- Data requirements: Link to appointment and patient minimally
