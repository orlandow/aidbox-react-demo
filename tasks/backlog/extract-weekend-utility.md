# Extract Weekend Detection Utility Function

**Status**: Not yet approved - pending review

## Overview
Extract duplicated weekend detection logic into a reusable utility function to follow DRY principles and improve maintainability.

## Current Code Duplication

The weekend detection logic appears multiple times in CalendarGrid.tsx:

### Location 1: Header rendering
```typescript
// Line ~97
{weekDays.map((day, index) => {
  const isWeekend = day.dayName === 'Sun' || day.dayName === 'Sat'; // ← Duplicated logic
  return (
    <div key={index} className={`... ${isWeekend ? 'bg-blue-50' : 'bg-white'}`}>
      // ...
    </div>
  );
})}
```

### Location 2: Time slot rendering
```typescript
// Line ~122
{weekDays.map((day, dayIndex) => {
  const isWeekend = day.dayName === 'Sun' || day.dayName === 'Sat'; // ← Duplicated logic
  
  return (
    <div className={`... ${isWeekend ? 'bg-blue-50' : 'bg-white'}`}>
      // ...
    </div>
  );
})}
```

## Problem
- **DRY Violation**: Same logic repeated in multiple places
- **Maintenance Risk**: If weekend logic changes, must update multiple locations
- **Inconsistency Risk**: Easy to forget to update one location
- **No Reusability**: Other components can't easily use weekend detection

## Proposed Solution

### Add Utility Function
Add to `src/utils/calendar.ts`:

```typescript
/**
 * Determines if a given day name represents a weekend day
 * @param dayName - Day name (e.g., 'Sun', 'Mon', 'Sat')
 * @returns true if the day is Saturday or Sunday
 */
export function isWeekendDay(dayName: string): boolean {
  return dayName === 'Sun' || dayName === 'Sat';
}
```

### Alternative: Add to WeekDay Interface
Could also add as a computed property to the WeekDay interface:

```typescript
// In calendar.ts - WeekDay interface
export interface WeekDay {
  date: Date;
  dateString: string;
  isToday: boolean;
  dayName: string;
  isWeekend: boolean; // ← Add this
}

// In getWeekDays function
days.push({
  date,
  dateString: date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  }),
  isToday: date.toDateString() === today.toDateString(),
  dayName: dayNames[date.getDay()],
  isWeekend: dayNames[date.getDay()] === 'Sun' || dayNames[date.getDay()] === 'Sat', // ← Compute once
});
```

### Updated CalendarGrid Usage

#### Option 1: Using utility function
```typescript
import { isWeekendDay } from '../../utils/calendar';

// Header rendering
{weekDays.map((day, index) => {
  const isWeekend = isWeekendDay(day.dayName);
  return (
    <div key={index} className={`... ${isWeekend ? 'bg-blue-50' : 'bg-white'}`}>
      // ...
    </div>
  );
})}

// Time slot rendering  
{weekDays.map((day, dayIndex) => {
  const isWeekend = isWeekendDay(day.dayName);
  return (
    <div className={`... ${isWeekend ? 'bg-blue-50' : 'bg-white'}`}>
      // ...
    </div>
  );
})}
```

#### Option 2: Using interface property
```typescript
// Header rendering
{weekDays.map((day, index) => (
  <div key={index} className={`... ${day.isWeekend ? 'bg-blue-50' : 'bg-white'}`}>
    // ...
  </div>
))}

// Time slot rendering
{weekDays.map((day, dayIndex) => (
  <div className={`... ${day.isWeekend ? 'bg-blue-50' : 'bg-white'}`}>
    // ...
  </div>
))}
```

## Recommendation
**Option 2** (interface property) is preferred because:
- Weekend status is computed once per day, not multiple times per day
- Cleaner usage in components (`day.isWeekend` vs `isWeekendDay(day.dayName)`)
- More semantic and self-documenting
- Better performance (computed once vs computed multiple times)

## Benefits
1. **DRY Compliance**: Single source of truth for weekend logic
2. **Maintainability**: Changes only need to be made in one place  
3. **Reusability**: Other components can easily determine weekend status
4. **Performance**: Weekend status computed once per day instead of multiple times
5. **Type Safety**: TypeScript ensures consistent usage

## Acceptance Criteria

- [ ] Add weekend detection to WeekDay interface or create utility function
- [ ] Remove duplicated weekend logic from CalendarGrid component
- [ ] Weekend styling continues to work exactly as before
- [ ] All existing functionality remains unchanged
- [ ] Weekend detection is reusable by other components

## Testing

- Verify weekend columns (Saturday/Sunday) still have correct styling
- Test that weekday columns maintain white background
- Verify weekend detection works across different weeks/months
- Test edge cases (week boundaries, month boundaries)