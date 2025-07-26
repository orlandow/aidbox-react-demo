# Optimize Appointment Lookup with Indexing

**Status**: Not yet approved - pending review

## Overview
Replace the current O(n) appointment lookup with O(1) indexing to improve calendar rendering performance, especially with large numbers of appointments.

## Current Performance Problem

### Current Implementation
```typescript
// CalendarGrid.tsx - Current O(n) lookup
const getAppointmentForSlot = (day: WeekDay, timeSlot: TimeSlot): Appointment | null => {
  return appointments.find(apt => {  // ← Searches through ALL appointments for each slot
    if (!apt.start) return false;
    
    const aptDate = new Date(apt.start);
    const aptDay = aptDate.toDateString();
    const dayString = day.date.toDateString();
    
    if (aptDay !== dayString) return false;
    
    const aptHour = aptDate.getHours();
    const aptMinute = aptDate.getMinutes();
    
    return aptHour === timeSlot.hour && aptMinute === timeSlot.minute;
  }) || null;
};
```

### Performance Impact
- Calendar has **154 time slots** (7 days × 22 slots per day)
- Each slot calls `appointments.find()` which searches through ALL appointments
- With 100 appointments: **154 × 100 = 15,400 comparisons** per render
- Performance degrades linearly with number of appointments

## Proposed Optimization

### Create Appointment Index
```typescript
// CalendarGrid.tsx - O(1) lookup with indexing
import { useMemo } from 'react';

export default function CalendarGrid({ currentDate, appointments, onSlotClick, onAppointmentClick }: CalendarGridProps) {
  // ... existing code ...

  // Build appointment index once when appointments change
  const appointmentIndex = useMemo(() => {
    const index = new Map<string, Appointment>();
    
    appointments.forEach(apt => {
      if (!apt.start) return;
      
      const date = new Date(apt.start);
      const key = `${date.toDateString()}-${date.getHours()}-${date.getMinutes()}`;
      index.set(key, apt);
    });
    
    return index;
  }, [appointments]);

  // O(1) instant lookup for each slot
  const getAppointmentForSlot = (day: WeekDay, timeSlot: TimeSlot): Appointment | null => {
    const key = `${day.date.toDateString()}-${timeSlot.hour}-${timeSlot.minute}`;
    return appointmentIndex.get(key) || null;
  };

  // ... rest of component
}
```

### Alternative: Extract to Custom Hook
For even better organization, create `src/hooks/useAppointmentIndex.ts`:

```typescript
import { useMemo } from 'react';
import type { Appointment } from '../types/fhir/Appointment';
import type { WeekDay, TimeSlot } from '../utils/calendar';

export function useAppointmentIndex(appointments: Appointment[]) {
  const appointmentIndex = useMemo(() => {
    const index = new Map<string, Appointment>();
    
    appointments.forEach(apt => {
      if (!apt.start) return;
      
      const date = new Date(apt.start);
      const key = `${date.toDateString()}-${date.getHours()}-${date.getMinutes()}`;
      index.set(key, apt);
    });
    
    return index;
  }, [appointments]);

  const getAppointmentForSlot = (day: WeekDay, timeSlot: TimeSlot): Appointment | null => {
    const key = `${day.date.toDateString()}-${timeSlot.hour}-${timeSlot.minute}`;
    return appointmentIndex.get(key) || null;
  };

  return { appointmentIndex, getAppointmentForSlot };
}
```

Then in CalendarGrid:
```typescript
const { getAppointmentForSlot } = useAppointmentIndex(appointments);
```

## Performance Benefits

### Before (O(n) per slot)
- 154 slots × 100 appointments = 15,400 comparisons
- 154 slots × 1000 appointments = 154,000 comparisons

### After (O(1) per slot)  
- Build index once: 100 operations
- 154 slot lookups: 154 operations
- **Total: 254 operations** (vs 15,400)

### Improvement
- **60x faster** with 100 appointments
- **600x faster** with 1000 appointments
- Performance stays constant regardless of appointment count

## Edge Cases to Handle

1. **Multiple appointments at same time**: Currently assumes one appointment per slot
2. **Invalid dates**: Handle appointments with malformed `start` times
3. **Timezone considerations**: Ensure consistent date string formatting
4. **Memory usage**: Index rebuilds when appointments array changes

## Acceptance Criteria

- [ ] Replace O(n) appointment lookup with O(1) indexed lookup
- [ ] Use `useMemo` to rebuild index only when appointments change
- [ ] Handle edge cases (invalid dates, missing start times)
- [ ] Maintain existing appointment display functionality
- [ ] No visual changes to calendar behavior
- [ ] Significant performance improvement with large appointment lists

## Testing

- Test calendar rendering with 0, 1, 10, 100, and 1000+ appointments
- Verify appointment positioning accuracy remains unchanged
- Test edge cases (appointments without start times, invalid dates)
- Performance testing: measure render times before/after optimization
- Test index rebuilding when appointments array changes