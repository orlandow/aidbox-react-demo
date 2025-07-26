# Task: Fix Patient Search Input Focus Loss

## Description
There's a UI issue with the patient list filtering where the search input loses focus and flickers when search results re-render. When a user types in the search input, the debounced search triggers a re-render of the patient list, which causes the search input to lose focus and creates a poor user experience.

## Problem Analysis
The issue occurs because:
1. User types in search input → input has focus
2. Debounced search (300ms) triggers API call and state update
3. React re-renders the PatientSearch component and PatientList
4. During re-render, the search input loses focus
5. User has to click back into the input to continue typing

## Current Implementation
- `PatientSearch` component contains the search input
- `usePatientSearch` hook manages search state with debouncing
- Search triggers re-render of the entire patient list section
- Input focus is not preserved across re-renders

## Solution: Input State Isolation (Option 3)
Isolate the input state from the global search state to prevent re-renders during typing:

1. **Local Input State**: Use local state in PatientSearch for immediate input updates
2. **Debounced Sync**: Only sync to global state after debounce period
3. **Focus Preservation**: Input doesn't re-render during typing, maintaining focus
4. **External Sync**: Handle external changes (URL updates, clear button) properly

## Implementation Steps
- [x] Add local state to PatientSearch component for input value
- [x] Import and use useDebounce hook in PatientSearch
- [x] Sync local state with global state using useEffect with ref-based tracking
- [x] Update input to use local state instead of prop
- [x] Update clear button to handle both local and global state
- [x] Test typing experience and functionality
- [x] Fix infinite loop issue in state synchronization

## Acceptance Criteria
- [x] Search input maintains focus while typing and during result updates
- [x] No visible flickering of the search input during filtering
- [x] Smooth typing experience without interruption
- [x] All existing search functionality preserved (debouncing, URL state, etc.)
- [x] Test that typing continuously works without losing focus
- [x] Verify that clear button still works correctly
- [x] Verify URL state updates work correctly
- [x] Verify external query changes (like page refresh) sync properly

## Files to Modify
- `src/components/PatientSearch.tsx` - Add input state isolation

## Testing Plan
1. **Manual Testing**:
   - Type continuously in search input without losing focus
   - Test clear button functionality
   - Test URL state management
   - Test page refresh with query in URL

2. **Playwright Testing**:
   - Verify focus is maintained during typing
   - Test search results update correctly
   - Test clear button interaction

## Success Metrics
- User can type continuously without clicking back into input
- No visible UI flickering during search
- Search functionality remains intact
- Performance is not degraded