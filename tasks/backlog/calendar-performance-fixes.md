# Calendar Performance and Code Quality Fixes

**Status**: Not yet approved - pending review

## Overview
Address code review feedback from the calendar implementation to improve performance, fix bugs, and enhance code quality.

## Issues to Fix

### 1. Time Indicator Performance Issue
**Problem**: The `setInterval` runs constantly (every minute, 24/7) even when the time indicator isn't visible.

**Current Code** (CalendarGrid.tsx):
```typescript
useEffect(() => {
  const updateTime = () => {
    setCurrentTimePos(getCurrentTimePosition());
  };

  const interval = setInterval(updateTime, 60000); // Runs ALWAYS
  return () => clearInterval(interval);
}, []);
```

**Fix**: Only run interval when the time indicator should be visible:
```typescript
useEffect(() => {
  // Only run interval if we should show the indicator
  if (!showTimeIndicator || !currentTimePos.isVisible) return;

  const updateTime = () => {
    setCurrentTimePos(getCurrentTimePosition());
  };

  const interval = setInterval(updateTime, 60000);
  return () => clearInterval(interval);
}, [showTimeIndicator, currentTimePos.isVisible]);
```

### 2. Appointment Type Color Mismatch
**Problem**: Form saves appointment codes (`"ROUTINE"`, `"EMERGENCY"`) but color logic checks display text (`"routine"`, `"emergency"`), causing all appointments to show default gray color.

**Current Code** (CalendarGrid.tsx):
```typescript
const getTypeColor = (appointment: Appointment) => {
  const type = appointment.appointmentType?.text || 
               appointment.appointmentType?.coding?.[0]?.display || 
               '';
  
  switch (type.toLowerCase()) {
    case 'emergency':        // ← expects lowercase display text
    case 'checkup':          // ← but we stored "ROUTINE" as code
    // ...
  }
};
```

**Fix**: Check against the actual codes being stored:
```typescript
const getTypeColor = (appointment: Appointment) => {
  const typeCode = appointment.appointmentType?.coding?.[0]?.code || '';
  
  switch (typeCode.toUpperCase()) {
    case 'EMERGENCY':
      return 'bg-red-100 border-red-300 text-red-800';
    case 'ROUTINE':
    case 'CHECKUP':
      return 'bg-blue-100 border-blue-300 text-blue-800';
    case 'CONSULTATION':
      return 'bg-purple-100 border-purple-300 text-purple-800';
    case 'FOLLOWUP':
      return 'bg-green-100 border-green-300 text-green-800';
    case 'SURGERY':
    case 'PROCEDURE':
      return 'bg-orange-100 border-orange-300 text-orange-800';
    case 'THERAPY':
      return 'bg-teal-100 border-teal-300 text-teal-800';
    default:
      return 'bg-gray-100 border-gray-300 text-gray-800';
  }
};
```

### 3. Weekend Detection Code Duplication
**Problem**: Weekend detection logic (`day.dayName === 'Sun' || day.dayName === 'Sat'`) appears twice.

**Fix**: Extract to utility function in `calendar.ts`:
```typescript
export function isWeekendDay(dayName: string): boolean {
  return dayName === 'Sun' || dayName === 'Sat';
}
```

Then use in CalendarGrid.tsx:
```typescript
const isWeekend = isWeekendDay(day.dayName);
```

### 4. Inefficient Appointment Lookup
**Problem**: Currently O(n) search for each time slot (154 slots × n appointments). With 100 appointments, that's 15,400 comparisons just to render the calendar.

**Current Code** (CalendarGrid.tsx):
```typescript
const getAppointmentForSlot = (day: WeekDay, timeSlot: TimeSlot): Appointment | null => {
  return appointments.find(apt => {  // ← Searches through ALL appointments
    // Complex comparison logic...
  }) || null;
};
```

**Fix**: Pre-index appointments for O(1) lookup:
```typescript
// Build index ONCE when appointments change
const appointmentIndex = useMemo(() => {
  const index = new Map<string, Appointment>();
  appointments.forEach(apt => {
    if (apt.start) {
      const date = new Date(apt.start);
      const key = `${date.toDateString()}-${date.getHours()}-${date.getMinutes()}`;
      index.set(key, apt);
    }
  });
  return index;
}, [appointments]);

// O(1) instant lookup for each slot
const getAppointmentForSlot = (day: WeekDay, timeSlot: TimeSlot): Appointment | null => {
  const key = `${day.date.toDateString()}-${timeSlot.hour}-${timeSlot.minute}`;
  return appointmentIndex.get(key) || null;
};
```

## Optional Enhancements

### Extract Time Indicator Logic to Custom Hook
Create `src/hooks/useCurrentTimeIndicator.ts`:
```typescript
function useCurrentTimeIndicator(isVisible: boolean) {
  const [currentTimePos, setCurrentTimePos] = useState(getCurrentTimePosition());
  
  useEffect(() => {
    if (!isVisible) return;
    
    const updateTime = () => setCurrentTimePos(getCurrentTimePosition());
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [isVisible]);
  
  return currentTimePos;
}
```

## Acceptance Criteria

- [ ] Time indicator interval only runs when indicator is visible
- [ ] Appointment colors correctly display based on appointment type codes
- [ ] Weekend detection logic is extracted to reusable utility function
- [ ] Appointment lookup uses O(1) indexing instead of O(n) search
- [ ] All existing functionality continues to work as expected
- [ ] No performance regression when viewing different weeks or outside work hours

## Testing

- Test appointment colors display correctly for different appointment types
- Verify time indicator performance by checking browser dev tools
- Test calendar performance with large number of appointments (50+)
- Verify weekend styling still works correctly
- Test time indicator only appears on today's column during work hours