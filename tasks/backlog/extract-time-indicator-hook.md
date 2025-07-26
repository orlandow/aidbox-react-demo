# Extract Time Indicator Logic to Custom Hook

**Status**: Not yet approved - pending review

## Overview
Extract the current time indicator logic from CalendarGrid component into a reusable custom hook to improve code organization and reusability.

## Current Implementation
The time indicator logic is currently embedded directly in the CalendarGrid component:

```typescript
// CalendarGrid.tsx
const [currentTimePos, setCurrentTimePos] = useState(getCurrentTimePosition());

// Find today's column index
const todayColumnIndex = weekDays.findIndex(day => day.isToday);
const showTimeIndicator = todayColumnIndex !== -1;

// Update current time position every minute
useEffect(() => {
  const updateTime = () => {
    setCurrentTimePos(getCurrentTimePosition());
  };

  const interval = setInterval(updateTime, 60000);
  return () => clearInterval(interval);
}, []);
```

## Proposed Refactoring

### Create Custom Hook
Create `src/hooks/useCurrentTimeIndicator.ts`:

```typescript
import { useState, useEffect } from 'react';
import { getCurrentTimePosition } from '../utils/calendar';

interface UseCurrentTimeIndicatorOptions {
  isVisible: boolean;
  updateInterval?: number; // milliseconds, default 60000 (1 minute)
}

export function useCurrentTimeIndicator(options: UseCurrentTimeIndicatorOptions) {
  const { isVisible, updateInterval = 60000 } = options;
  const [currentTimePos, setCurrentTimePos] = useState(getCurrentTimePosition());

  useEffect(() => {
    if (!isVisible) return;

    const updateTime = () => {
      setCurrentTimePos(getCurrentTimePosition());
    };

    const interval = setInterval(updateTime, updateInterval);
    return () => clearInterval(interval);
  }, [isVisible, updateInterval]);

  return currentTimePos;
}
```

### Updated CalendarGrid Usage
```typescript
// CalendarGrid.tsx
export default function CalendarGrid({ currentDate, appointments, onSlotClick, onAppointmentClick }: CalendarGridProps) {
  const weekDays = getWeekDays(currentDate);
  const timeSlots = generateTimeSlots();

  // Find today's column index
  const todayColumnIndex = weekDays.findIndex(day => day.isToday);
  const showTimeIndicator = todayColumnIndex !== -1;

  // Use custom hook for time indicator
  const currentTimePos = useCurrentTimeIndicator({ 
    isVisible: showTimeIndicator 
  });

  // ... rest of component
}
```

## Benefits

1. **Separation of Concerns**: Time indicator logic is isolated from calendar rendering logic
2. **Reusability**: Hook can be used in other components that need time indicators
3. **Testability**: Hook can be unit tested independently
4. **Configurability**: Update interval can be customized per use case
5. **Performance**: Automatic cleanup when not visible

## Acceptance Criteria

- [ ] Create `useCurrentTimeIndicator` custom hook
- [ ] Hook accepts `isVisible` parameter to control when interval runs
- [ ] Hook accepts optional `updateInterval` parameter (default 60000ms)
- [ ] Hook properly cleans up interval when component unmounts or becomes invisible
- [ ] CalendarGrid component uses the new hook instead of inline logic
- [ ] All existing time indicator functionality continues to work
- [ ] No performance regression

## Testing

- Test hook independently with different `isVisible` values
- Test hook cleanup when component unmounts
- Verify time indicator still updates correctly in calendar
- Test with different update intervals
- Verify no memory leaks from uncleaned intervals