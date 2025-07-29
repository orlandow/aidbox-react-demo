# Task: Encounter UI Enhancements

## Overview

Enhance the encounter view UI to make it more streamlined and focused on clinical information.

## Requirements

### UI Changes
1. **Patient Header**: Replace the large patient information box with a compact header card showing format like "Jane Doe 30yoF"
2. **Remove Sections**: 
   - Remove the related appointment box
   - Remove the encounter details box
3. **Add New Sections** (blank placeholders for now):
   - Vitals information box
   - Lab results box  
   - Medication information box

### Implementation Notes
- Keep the existing encounter status and wrap up functionality intact
- Maintain the back navigation to calendar
- Use consistent styling with existing design patterns
- All new boxes should be empty placeholders with appropriate headers

## Files to Modify
- `src/pages/Encounter.tsx` - Main encounter page component

## Acceptance Criteria
- [ ] Compact patient header shows "FirstName LastName AgeGender" format
- [ ] Related appointment section is removed
- [ ] Encounter details section is removed  
- [ ] Vitals placeholder box is added
- [ ] Lab results placeholder box is added
- [ ] Medication placeholder box is added
- [ ] Existing wrap up functionality still works
- [ ] Navigation and loading states remain functional