# Patient List - Upcoming Appointments Display

## Goal ✅ COMPLETED
Add upcoming appointments display to the patient list on the right side of each patient row, showing appointment information with visual indicators.

## Requirements

### Data Fetching ✅
- ✅ Use `_revinclude=Appointment:patient` in the patient list API call to get appointments
- ✅ Show all future appointments (any status)
- ✅ Display the earliest upcoming appointment prominently
- ✅ If patient has multiple appointments, show "+ X more" indicator

### Visual Design ✅
- ✅ Color-code appointments using the same colors as the calendar
- ✅ Move appointment color logic to a utils file for reuse between calendar and patient list
- ✅ Display appointment date and relative time ("today", "in 3 days", etc.)
- ✅ Use calendar-like card design with colored bottom border
- ✅ Add tooltip for additional appointment details (not clickable card)
- ✅ If no upcoming appointments, show nothing

### Display Priority ✅
- ✅ Show the earliest upcoming appointment first
- ✅ Include relative time display (today, tomorrow, in X days)
- ✅ For multiple appointments: show count as "+ 2 more" format

## Implementation Completed

### Files Created/Modified
**New Files:**
- `src/utils/colors.ts` - Generic color mappings and resource-aware color functions
- `src/utils/date.ts` - Date utilities (formatRelativeTime)
- `src/components/AppointmentIndicator.tsx` - Calendar-style appointment display component

**Modified Files:**
- `src/hooks/api/usePatientSearch.ts` - Added `_revinclude` and appointment parsing logic
- `src/pages/Patients.tsx` - Pass appointments map to PatientList
- `src/components/PatientList.tsx` - Integrate appointment indicators on right side
- `src/components/calendar/AppointmentDetail.tsx` - Use refactored color system

### Architecture Improvements
- **Clean color system**: `utils/colors.ts` with resource-aware functions like `getAppointmentColor(appointment)`
- **FHIR type preservation**: Used appointments map instead of modifying FHIR types
- **Local component logic**: Moved component-specific functions (date formatting, labels) into components
- **Eliminated unnecessary abstractions**: Removed wrapper functions that just called other functions

### Visual Features Delivered
- **Calendar-style cards**: Fixed-width cards (80px) with clean borders and shadows
- **Colored bottom borders**: Based on appointment type (Emergency=red, Routine=blue, etc.)
- **Muted color palette**: Using `-300` Tailwind variants for subtle, professional look
- **Perfect alignment**: Fixed layout issues with consistent spacing for "+X more" text
- **Rich tooltips**: Show all appointment details on hover
- **Responsive design**: Clean integration with existing patient list layout

## Final Result
Patients now display upcoming appointments as calendar-like cards on the right side of each row, with:
- Big prominent date (e.g., "Jul 30")
- Small relative time below (e.g., "tomorrow")
- Colored bottom border indicating appointment type
- Additional appointment count ("+2 more") when applicable
- Detailed tooltip showing all appointment information
- No display for patients without upcoming appointments

The feature provides immediate visual scanning of patient appointments while maintaining clean, professional aesthetics consistent with the existing UI design.