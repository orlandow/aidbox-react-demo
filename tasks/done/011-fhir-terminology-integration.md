# Task: FHIR Terminology Integration

## Overview
Replace all hard-coded dropdown values with FHIR terminology services using ValueSet operations. This aligns with FHIR standards and improves maintainability.

## Reference
- **ADR**: [002-fhir-terminology-integration.md](../../adr/002-fhir-terminology-integration.md)
- **Philosophy**: Use standard FHIR ValueSets with generic hooks for extensibility

## Current Hard-coded Values
- **Gender**: PatientForm.tsx, PatientIntake.tsx (male, female, other, unknown)
- **Languages**: PatientForm.tsx (en, es, fr, de, zh)
- **Appointment Types**: AppointmentForm.tsx (ROUTINE, WALKIN, CHECKUP, EMERGENCY, FOLLOWUP)  
- **Appointment Status**: AppointmentForm.tsx (proposed, pending, booked)

## Target ValueSets
- `http://hl7.org/fhir/ValueSet/administrative-gender`
- `http://hl7.org/fhir/ValueSet/languages`
- `http://hl7.org/fhir/ValueSet/appointmentstatus`
- `http://hl7.org/fhir/ValueSet/v2-0276` (appointment types)

## Implementation Plan

### Phase 1: Foundation (Core Infrastructure)

#### 1.1 Extend FHIR Types
- [ ] Add `OperationResultMap` type to `src/types/fhir/index.ts`
- [ ] Map operation names to return types:
  - `'ValueSet/$expand': ValueSet`
  - `'ValueSet/$validate-code': Parameters`
  - `'CodeSystem/$lookup': Parameters`

#### 1.2 Extend AidboxService  
- [ ] Add `op<T extends OperationName>()` method to `src/services/aidbox.ts`
- [ ] Support both parameter styles:
  - Query params: `{url: '...', filter: '...'}`
  - FHIR Parameters: `{resourceType: 'Parameters', parameter: [...]}`
- [ ] Auto-detect parameter type and choose GET vs POST
- [ ] Return type inference from operation name

#### 1.3 Create Terminology Infrastructure
- [ ] Create `src/hooks/api/useTerminology.ts`
- [ ] Define `TerminologyOption` interface: `{code: string, display: string, system?: string}`
- [ ] Implement generic `useValueSet(url, options)` hook
- [ ] Add React Query integration with 24hr stale time
- [ ] Support options: `{count?: number, filter?: string}`

### Phase 2: Convenience Hooks

#### 2.1 Administrative Gender
- [ ] Create `useAdministrativeGender()` hook
- [ ] Map to `http://hl7.org/fhir/ValueSet/administrative-gender`
- [ ] Test expansion returns: male, female, other, unknown

#### 2.2 Languages  
- [ ] Create `useLanguages(filter?)` hook
- [ ] Map to `http://hl7.org/fhir/ValueSet/languages`
- [ ] Support filtering for large result sets
- [ ] Default count limit (20 items)

#### 2.3 Appointment Status
- [ ] Create `useAppointmentStatus()` hook  
- [ ] Map to `http://hl7.org/fhir/ValueSet/appointmentstatus`
- [ ] Test expansion includes: proposed, pending, booked, etc.

#### 2.4 Appointment Types
- [ ] Create `useAppointmentTypes()` hook
- [ ] Map to `http://hl7.org/fhir/ValueSet/v2-0276`
- [ ] Verify ValueSet is available in Aidbox
- [ ] Test expansion includes appointment type codes

#### 2.5 Hook Exports
- [ ] Update `src/hooks/api/index.ts` to export terminology hooks
- [ ] Ensure proper TypeScript exports

### Phase 3: Component Migration (Incremental)

#### 3.1 PatientForm.tsx Migration
- [ ] **Gender Dropdown**: Replace hard-coded options with `useAdministrativeGender()`
- [ ] **Language Dropdown**: Replace hard-coded options with `useLanguages()`
- [ ] Add loading states: `disabled={isLoading}`
- [ ] Add error handling: Display error messages
- [ ] Test form submission with FHIR-compliant codes
- [ ] Verify backward compatibility with existing Patient resources

#### 3.2 AppointmentForm.tsx Migration  
- [ ] **Appointment Types**: Replace `appointmentTypes` array with `useAppointmentTypes()`
- [ ] **Appointment Status**: Replace `appointmentStatuses` array with `useAppointmentStatus()`
- [ ] Update component state management
- [ ] Add loading/error states for both dropdowns
- [ ] Test appointment creation with proper FHIR codes
- [ ] Verify integration with existing calendar functionality

#### 3.3 PatientIntake.tsx Migration
- [ ] **Gender Dropdown**: Replace hard-coded options with `useAdministrativeGender()`
- [ ] Ensure consistency with PatientForm.tsx approach
- [ ] Test form submission workflow
- [ ] Verify no regressions in intake flow

#### 3.4 Display Logic Updates
- [ ] Update `PatientDetail.tsx` `formatGender()` if needed
- [ ] Update `PatientList.tsx` `formatGender()` if needed  
- [ ] Update calendar display logic for appointment types/status
- [ ] Ensure proper display of terminology codes throughout app

### Phase 4: Testing & Validation

#### 4.1 Terminology Service Testing
- [ ] **ValueSet Availability**: Confirm all target ValueSets exist in Aidbox
- [ ] **Expansion Testing**: Test each ValueSet expansion manually via curl
- [ ] **Filter Testing**: Test language filtering with various filter strings
- [ ] **Error Scenarios**: Test with invalid ValueSet URLs

#### 4.2 Component Integration Testing
- [ ] **Form Submissions**: Verify all forms submit with proper FHIR codes
- [ ] **Data Display**: Confirm proper display of codes vs displays
- [ ] **Loading States**: Test terminology loading UX
- [ ] **Error States**: Test network failures and invalid responses
- [ ] **Performance**: Ensure no blocking of critical UI

#### 4.3 FHIR Compliance Testing
- [ ] **Patient Resources**: Verify gender codes are FHIR-compliant
- [ ] **Communication**: Verify language codes are proper BCP 47
- [ ] **Appointments**: Verify appointment type/status codes are valid
- [ ] **Bundle Validation**: Test created resources against FHIR schema

#### 4.4 Regression Testing
- [ ] **Existing Data**: Test app with existing Patient/Appointment data
- [ ] **Search Functionality**: Verify patient search still works
- [ ] **Calendar View**: Confirm calendar rendering unaffected
- [ ] **Form Validation**: Ensure form validation rules intact

## Success Criteria
- [ ] Zero hard-coded terminology values in components
- [ ] All dropdowns populated from FHIR terminology services
- [ ] Proper error handling when terminology unavailable
- [ ] FHIR-compliant codes in all generated resources
- [ ] No performance regression in form interactions
- [ ] Backward compatibility with existing data
- [ ] Comprehensive test coverage

## Error Handling Requirements
- [ ] Clear error messages when terminology services fail
- [ ] Form remains functional (doesn't crash) during terminology errors  
- [ ] Loading states prevent user confusion
- [ ] Retry mechanisms where appropriate

## Performance Requirements
- [ ] Terminology loading doesn't block critical UI
- [ ] React Query caching prevents unnecessary refetches
- [ ] Large ValueSets (languages) use server-side filtering
- [ ] Background terminology updates don't interrupt user workflow

## Documentation Updates
- [ ] Update component JSDoc with terminology dependencies
- [ ] Document error handling patterns for future components
- [ ] Add terminology integration examples to README
- [ ] Update development setup docs if needed

## Future Enhancements (Out of Scope)
- Custom ValueSet creation for organization-specific terminology
- Offline terminology caching
- Multi-language terminology support  
- Advanced terminology validation beyond basic $expand

## Rollback Plan
If issues arise:
1. Keep hard-coded values as fallbacks during transition
2. Feature flag terminology integration per component
3. Quick revert to hard-coded values if terminology services unavailable
4. Gradual rollout to identify issues early

## Notes
- Test with real Aidbox terminology services (not mocks)
- Maintain same UX patterns as current hard-coded dropdowns
- Follow ADR-002 guidelines for all implementation decisions
- Use incremental migration to catch issues early