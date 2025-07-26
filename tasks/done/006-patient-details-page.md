# Task: Patient Details Page

## Description
Replace the current row-based action buttons with a clickable row interface that navigates to a dedicated patient details page. This page will provide a view of patient information with integrated actions for editing and deleting.

## Features

### Clickable Patient Rows
- **Row Navigation**: Clicking anywhere on a patient row navigates to `/patients/:id`
- **Visual Feedback**: Hover states and cursor changes to indicate clickability
- **Remove Action Buttons**: Remove the current `PatientActions` component from list rows

### Patient Details Page
- **Patient Information**: Display all patient information in a readable format
- **Structured Layout**: Organized sections for demographics, contact info, and metadata
- **Breadcrumb Navigation**: Easy way to return to patient list

### Integrated Actions
- **Primary Actions**: Edit and Delete buttons prominently displayed
- **Delete Confirmation**: Maintain existing delete confirmation modal
- **Edit Navigation**: Navigate to existing edit page (`/patients/:id/edit`)

## Acceptance Criteria
- [ ] Remove `PatientActions` component from `PatientList` rows
- [ ] Make patient list rows clickable with hover states
- [ ] Create new `/patients/:id` route and `PatientDetail` page component
- [ ] Implement patient data loading in detail page
- [ ] Add Edit and Delete action buttons to detail page header
- [ ] Maintain existing delete confirmation functionality
- [ ] Add breadcrumb navigation back to patient list
- [ ] Handle loading and error states for patient detail page
- [ ] Test navigation flow end-to-end with playwright

## Technical Considerations

### Routing Updates
- Add new route: `/patients/:id` → `PatientDetail` component
- Maintain existing routes: `/patients/:id/edit` for editing

### Data Loading
- Use existing `aidbox.get()` method to fetch individual patient
- Implement loading and error states

### Component Architecture
```typescript
// New component structure
PatientDetail.tsx
- PatientDetailHeader (with actions)
- PatientDetailInfo (demographics)
- PatientDetailContact (contact info)
```

## Integration Points
- **PatientList**: Remove `PatientActions`, add row click handlers
- **App.tsx**: Add new route for patient details
- **Existing Services**: Use current `aidbox.get()` for data loading
- **Delete Flow**: Maintain existing delete confirmation modal

## Files to Modify
- `src/components/PatientList.tsx` - Remove actions, add click handlers
- `src/App.tsx` - Add new route
- `src/pages/PatientDetail.tsx` - New detail page component (to create)

## Files to Remove
- `src/components/PatientActions.tsx` - No longer needed in list view

## User Experience Flow
1. User sees patient list with clickable rows (no action buttons)
2. User clicks on any part of a patient row
3. Navigate to `/patients/:id` showing detailed patient information
4. User can edit (navigate to `/patients/:id/edit`) or delete from detail page
5. After edit/delete, user returns to patient list

## Testing Strategy
- End-to-end playwright tests for complete user flow
- Error scenario testing (404, network failures)

## Dependencies
- Current patient management functionality (list, edit, delete)
- Existing routing and service architecture
- Current `aidbox` service methods
- Existing toast notification system