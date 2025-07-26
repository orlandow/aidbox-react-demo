# Task: Patient Management pt3 - Update & Delete

## Description
Complete the CRUD operations for patient management by adding update (edit) and delete functionality. Build on the existing create/list foundation to provide full patient lifecycle management with proper FHIR integration.

## Features

### Update Patient Functionality
- **Edit Patient Form**: Reuse existing `PatientForm` component for editing
- **Pre-populated Form**: Load existing patient data into form fields
- **URL Routing**: `/patients/:id/edit` route for bookmarkable edit pages
- **Validation**: Same validation rules as create, with proper error handling
- **Optimistic Updates**: Show changes immediately, handle conflicts gracefully
- **Change Detection**: Warn users about unsaved changes when navigating away

### Delete Patient Functionality  
- **Delete Confirmation**: Modal or inline confirmation before deletion

### Patient Actions Interface
- **Action Menu**: Button group for each patient in list
- **Quick Actions**: Edit/Delete buttons in patient list items

### Integration Enhancements
- **Navigation Flow**: Smooth transitions between list → edit → list
- **Success Feedback**: Toast notifications or success messages
- **Error Handling**: Comprehensive error states and recovery options
- **Conflict Resolution**: Handle concurrent edits by multiple users

## Acceptance Criteria
- [ ] Add `update` and `delete` methods to aidbox service
- [ ] Create `/patients/:id/edit` route and page component
- [ ] Implement patient data loading for edit form pre-population
- [ ] Add action buttons to patient list items
- [ ] Create delete confirmation modal component
- [ ] Add unsaved changes warning dialog
- [ ] Add success/error toast notifications
- [ ] Test update/delete operations end-to-end
- [ ] Ensure proper error recovery and user feedback
- [ ] Verify FHIR resource versioning handling

## Technical Considerations

### FHIR Operations
- `PUT /fhir/Patient/:id` for updates with proper versioning
- `DELETE /fhir/Patient/:id` for deletions
- Handle HTTP 409 (Conflict) for concurrent updates
- Implement proper error parsing from FHIR OperationOutcome

### Service Layer Updates
```typescript
// Extend aidbox.ts service
async update<T extends keyof ResourceTypeMap>(
  resourceType: T,
  id: string,
  resource: ResourceTypeMap[T]
): Promise<ResourceTypeMap[T]>

async delete<T extends keyof ResourceTypeMap>(
  resourceType: T,
  id: string
): Promise<void>
```

### State Management
- Form state management for edit operations
- List state updates after edit/delete operations
- Loading states for individual operations
- Error state management with recovery options

### Component Architecture
- Reuse `PatientForm` component with edit mode
- Create reusable confirmation dialog component
- Add action menu component for patient list items
- Implement toast notification system

### URL Structure
- `/patients` - Patient list (existing)
- `/patients/new` - Create patient (existing)
- `/patients/:id/edit` - Edit patient (new)
- `/patients/:id` - View patient details (future consideration)

### Error Handling Scenarios
- Network failures during update/delete
- FHIR validation errors on update
- Concurrent modification conflicts
- Patient not found (deleted by another user)
- Insufficient permissions

## Design Patterns
- Follow existing form design patterns from create flow
- Use consistent action button styling throughout app
- Implement standard confirmation dialog patterns
- Maintain existing responsive design principles

## User Experience Considerations
- **Confirmation Patterns**: Clear, non-destructive delete confirmations
- **Feedback**: Immediate visual feedback for all actions
- **Recovery**: Easy way to undo or retry failed operations
- **Performance**: Optimistic updates for immediate response
- **Accessibility**: Keyboard navigation, screen reader support

## Integration Points
- Extend existing `PatientForm` component with edit mode prop
- Modify `PatientList` to include action controls
- Update `App.tsx` routing for edit pages
- Enhance `Patients` page to handle post-edit navigation
- Integrate with existing error handling patterns

## Testing Strategy
- Unit tests for CRUD service methods
- Component tests for edit form and delete confirmation
- Integration tests for optimistic updates
- End-to-end tests for complete edit/delete workflows
- Error scenario testing (network failures, conflicts)
- Accessibility testing for new UI elements

## Dependencies
- Current patient management pt1 (create/list) implementation
- Existing `PatientForm` and `PatientList` components
- Current routing and service architecture
- Toast notification system (to be implemented or chosen)

## Notes
- Consider FHIR resource versioning for conflict detection
- Delete operations should be carefully considered - some healthcare systems prefer soft deletes
- Edit form should maintain all validation and sanitization from create form
- Action controls should be intuitive but not accidentally triggerable
- Consider implementing keyboard shortcuts for power users
