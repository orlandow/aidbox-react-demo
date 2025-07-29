# Fix Calendar Performance: Implement O(1) Appointment Lookup

**Priority**: High  
**Estimated Effort**: 2-3 hours  
**Component**: Calendar Grid  

## Problem Statement

The calendar grid component has a critical performance issue identified in the code review. The current implementation performs O(n) linear searches for every time slot, causing severe performance degradation as the number of appointments increases.

### Current Implementation Issues

**File**: `src/components/calendar/CalendarGrid.tsx:112-127`

```typescript
const getAppointmentForSlot = (day: Date, hour: number, minute: number) => {
  return appointments.find(appointment => {
    // This searches through ALL appointments for EVERY time slot
    if (!appointment.start) return false;
    
    const aptDate = new Date(appointment.start);
    const aptDay = aptDate.toDateString();
    const dayString = day.toDateString();
    
    if (aptDay !== dayString) return false;
    
    const aptHour = aptDate.getHours();
    const aptMinute = aptDate.getMinutes();
    
    return aptHour === hour && aptMinute === minute;
  });
};
```

### Performance Impact Analysis

**Current Complexity**: O(n × slots) per render
- Calendar displays ~154 time slots (7 days × 22 slots/day)
- Each slot triggers `appointments.find()` which scans ALL appointments
- **With 50 appointments**: 154 × 50 = 7,700 operations per render
- **With 200 appointments**: 154 × 200 = 30,800 operations per render
- **With 1000 appointments**: 154 × 1000 = 154,000 operations per render

**Real-world Impact**:
- Calendar becomes noticeably slow with 100+ appointments
- Scrolling and interactions lag significantly
- Performance degrades linearly with appointment count
- Poor user experience in production environments

## Proposed Solution

### 1. Implement Appointment Indexing with useMemo

Replace the linear search with a pre-computed hash map for O(1) lookups:

```typescript
import { useMemo } from 'react';

export default function CalendarGrid({ currentDate, appointments, onSlotClick, onAppointmentClick }: CalendarGridProps) {
  // Pre-compute appointment index when appointments change
  const appointmentIndex = useMemo(() => {
    const index = new Map<string, Appointment>();
    
    appointments.forEach(appointment => {
      if (!appointment.start) return; // Skip invalid appointments
      
      try {
        const aptDate = new Date(appointment.start);
        
        // Validate date
        if (isNaN(aptDate.getTime())) return;
        
        // Create unique key for day-hour-minute combination
        const key = `${aptDate.toDateString()}-${aptDate.getHours()}-${aptDate.getMinutes()}`;
        index.set(key, appointment);
      } catch (error) {
        console.warn('Invalid appointment start time:', appointment.start);
      }
    });
    
    return index;
  }, [appointments]); // Rebuild only when appointments array changes

  // O(1) instant lookup for each slot
  const getAppointmentForSlot = (day: Date, hour: number, minute: number): Appointment | undefined => {
    const key = `${day.toDateString()}-${hour}-${minute}`;
    return appointmentIndex.get(key);
  };

  // Rest of component remains unchanged
  // ...
}
```

### 2. Performance Optimization Results

**New Complexity**: O(n + slots) per render
- Build index once: n operations (where n = number of appointments)
- Lookup per slot: 1 operation × 154 slots = 154 operations
- **With 50 appointments**: 50 + 154 = 204 operations (was 7,700) - **38x faster**
- **With 200 appointments**: 200 + 154 = 354 operations (was 30,800) - **87x faster**
- **With 1000 appointments**: 1000 + 154 = 1,154 operations (was 154,000) - **133x faster**

### 3. Alternative: Extract to Custom Hook (Recommended)

For better reusability and separation of concerns, create a custom hook:

**File**: `src/hooks/useAppointmentIndex.ts`

```typescript
import { useMemo } from 'react';
import type { Appointment } from '../types/fhir/Appointment';

export function useAppointmentIndex(appointments: Appointment[]) {
  const appointmentIndex = useMemo(() => {
    const index = new Map<string, Appointment>();
    
    appointments.forEach(appointment => {
      if (!appointment.start) return;
      
      try {
        const aptDate = new Date(appointment.start);
        
        if (isNaN(aptDate.getTime())) {
          console.warn('Invalid appointment date:', appointment.start);
          return;
        }
        
        const key = `${aptDate.toDateString()}-${aptDate.getHours()}-${aptDate.getMinutes()}`;
        index.set(key, appointment);
      } catch (error) {
        console.warn('Error processing appointment:', appointment.id, error);
      }
    });
    
    return index;
  }, [appointments]);

  const getAppointmentForSlot = (day: Date, hour: number, minute: number): Appointment | undefined => {
    const key = `${day.toDateString()}-${hour}-${minute}`;
    return appointmentIndex.get(key);
  };

  const hasAppointmentForSlot = (day: Date, hour: number, minute: number): boolean => {
    const key = `${day.toDateString()}-${hour}-${minute}`;
    return appointmentIndex.has(key);
  };

  return {
    appointmentIndex,
    getAppointmentForSlot,
    hasAppointmentForSlot
  };
}
```

**Usage in CalendarGrid**:
```typescript
import { useAppointmentIndex } from '../hooks/useAppointmentIndex';

export default function CalendarGrid({ currentDate, appointments, onSlotClick, onAppointmentClick }: CalendarGridProps) {
  const { getAppointmentForSlot } = useAppointmentIndex(appointments);
  
  // Rest of component uses the optimized lookup
  // ...
}
```

## Edge Cases & Considerations

### 1. Multiple Appointments per Slot
Current implementation assumes one appointment per time slot. If multiple appointments can exist at the same time:

```typescript
// Modify to store arrays of appointments
const index = new Map<string, Appointment[]>();
appointments.forEach(appointment => {
  // ...
  const existing = index.get(key) || [];
  index.set(key, [...existing, appointment]);
});
```

### 2. Timezone Handling
Ensure consistent date formatting across different timezones:

```typescript
// Use consistent date formatting
const key = `${aptDate.getFullYear()}-${aptDate.getMonth()}-${aptDate.getDate()}-${aptDate.getHours()}-${aptDate.getMinutes()}`;
```

### 3. Memory Usage
The index rebuilds when the appointments array reference changes. Ensure appointments array is properly memoized in parent components.

### 4. Error Handling
Handle malformed dates gracefully without breaking the calendar:

```typescript
try {
  const aptDate = new Date(appointment.start);
  if (isNaN(aptDate.getTime())) return; // Skip invalid dates
} catch (error) {
  console.warn('Invalid appointment start time:', appointment.start);
  return;
}
```

## Implementation Steps

### Phase 1: Direct Implementation (Quick Fix)
1. [ ] Update `CalendarGrid.tsx` with `useMemo` appointment indexing
2. [ ] Replace `getAppointmentForSlot` with O(1) lookup
3. [ ] Add error handling for invalid dates
4. [ ] Test with existing appointment data

### Phase 2: Extract to Hook (Recommended)
1. [ ] Create `src/hooks/useAppointmentIndex.ts`
2. [ ] Move indexing logic to custom hook
3. [ ] Update `CalendarGrid.tsx` to use the hook
4. [ ] Add additional utility methods (`hasAppointmentForSlot`)

### Phase 3: Testing & Validation
1. [ ] Test calendar with 0, 10, 100, 500+ appointments
2. [ ] Verify appointment positioning accuracy
3. [ ] Performance testing: measure render times before/after
4. [ ] Test edge cases (invalid dates, missing start times)
5. [ ] Ensure no visual changes to calendar behavior

## Acceptance Criteria

- [ ] **Performance**: Calendar renders smoothly with 500+ appointments
- [ ] **Accuracy**: All appointments display in correct time slots
- [ ] **Error Handling**: Invalid appointment dates don't break calendar
- [ ] **Memory**: Index rebuilds only when appointments array changes
- [ ] **Backward Compatibility**: No changes to calendar visual behavior
- [ ] **Code Quality**: Clean separation of concerns with custom hook
- [ ] **Testing**: Performance improvement measurable and documented

## Testing Strategy

### Performance Testing
```typescript
// Before optimization
console.time('calendar-render');
// Render calendar with test appointments
console.timeEnd('calendar-render');

// After optimization - should show significant improvement
```

### Functional Testing
- Calendar displays all appointments correctly
- Click handlers work for both slots and appointments
- Date navigation works properly
- No visual regression in calendar layout

### Edge Case Testing
- Empty appointments array
- Appointments with invalid/missing start times
- Appointments spanning multiple days
- Duplicate appointments at same time slot

## Success Metrics

- **Performance**: >90% reduction in lookup operations
- **User Experience**: Smooth scrolling with 500+ appointments
- **Maintainability**: Clean, reusable hook implementation
- **Reliability**: Zero calendar crashes from invalid data