# Task: Patient Management pt2 - Search & Pagination

## Description
Enhance the patient management system with search and filtering capabilities, plus pagination support for large patient datasets. Build on the existing patient list foundation to add robust search functionality that integrates with FHIR server-side search parameters.

## Features

### Search Functionality
- **Text Search**: Search using Aidbox' `_ilike` query parameter
- **Status: Active/Inactive**: Use `active:not=false` to get active patients
- **Real-time Search**: Debounced search input for performance
- **Search Results**: Highlight matching terms in results
- **Clear Filters**: Easy way to reset all search criteria

### Pagination
- **Server-side Pagination**: Use FHIR Bundle links for navigation
- **Navigation Controls**: First, Previous, Next, Last buttons
- **Result Count**: Show "Showing X-Y of Z patients" information
- **URL Integration**: Preserve search/pagination state in URL for bookmarking

### UI Enhancements
- **Search Bar**: Prominent search input in patient list header
- **Loading States**: Show skeleton loaders during search
- **Empty States**: Custom messages for no results vs no patients

## Acceptance Criteria
- [ ] Add search input with debounced text search functionality
- [ ] Add status filter controls (Show Inactive checkbox)
- [ ] Integrate FHIR search parameters with aidbox service
- [ ] Add pagination controls with page size selection
- [ ] Implement URL state management for search/pagination
- [ ] Add loading states and skeleton UI during search
- [ ] Create empty states for no results scenarios
- [ ] Ensure search preserves existing list design and responsiveness
- [ ] Verify FHIR Bundle pagination handling

## Technical Considerations

### FHIR Search Implementation
- Use existing `aidbox.search()` method with search parameters
- FHIR search params: `_ilike`, `active`
- Handle FHIR Bundle `next`, `prev`, `first`, `last` links for pagination
- Implement proper error handling for search failures

### State Management
- Search state: query, filters, pagination, sort order
- URL synchronization for bookmarkable search results
- Debouncing for text search (300ms recommended)
- Loading states management

### Performance
- Debounced search to avoid excessive API calls
- Skeleton loading for better UX
- Efficient re-rendering with proper React keys

### Integration Points
- Extend existing `PatientList` component to handle search results
- Modify `Patients` page to include search controls
- Maintain existing routing structure (`/patients` with query params)

## Design Patterns
- Follow existing TailwindUI patterns from current implementation
- Integrate search controls with existing page header design
- Maintain current patient card design in results
- Use consistent loading and empty states

## Dependencies
- Current patient management pt1 implementation
- Existing `aidbox.search()` method
- Current `PatientList` and `Patients` components
- React Router for URL state management

## Testing Approach
- Unit tests for search logic and debouncing
- Integration tests for FHIR search parameter handling
- End-to-end tests with playwright for search workflows
- Performance testing with large patient datasets
- Test pagination edge cases (first/last pages)
- Test implementation using playwright MCP

## Implementation Summary

### Core Features Implemented
- ✅ **Text Search**: Debounced search (300ms) using Aidbox `_ilike` parameter
- ✅ **Status Filtering**: "Show inactive patients" checkbox with `active:not=false`
- ✅ **Server-side Pagination**: 20 items per page using FHIR Bundle links
- ✅ **URL State Management**: Search, filters, and pagination preserved in URL
- ✅ **Search Highlighting**: Matching terms highlighted in yellow in results
- ✅ **Loading States**: Skeleton UI and spinner during searches
- ✅ **Empty States**: Custom messages for no results vs no patients

### UI/UX Improvements
- ✅ **Integrated Header**: Search/filters integrated as list header (like pagination)
- ✅ **Compact Layout**: Search input and filters on single line
- ✅ **In-input Clear**: Clear button (X) inside search input, doesn't disrupt layout
- ✅ **Better Placeholders**: "No phone"/"No email" instead of "n/a" for consistency
- ✅ **Responsive Design**: Mobile-friendly with proper breakpoints

### Technical Architecture
- ✅ **Custom Hooks**: `useDebounce` and `usePatientSearch` for clean state management
- ✅ **Component Structure**: Separated `PatientSearch`, `PatientPagination`, enhanced `PatientList`
- ✅ **Error Handling**: User-friendly error messages and loading states
- ✅ **FHIR Integration**: Proper Bundle link handling for pagination

### Files Created/Modified
**New Files:**
- `src/hooks/useDebounce.ts` - Debouncing utility
- `src/hooks/usePatientSearch.ts` - Main search logic with URL state
- `src/components/PatientSearch.tsx` - Search input and filters
- `src/components/PatientPagination.tsx` - Pagination controls

**Modified Files:**
- `src/components/PatientList.tsx` - Added search highlighting and better placeholders
- `src/pages/Patients.tsx` - Integrated all search components

### Testing Results
- ✅ All search functionality tested with playwright MCP
- ✅ URL state management verified across all scenarios
- ✅ Pagination tested with 28+ patients across multiple pages
- ✅ Search highlighting confirmed for names, phone, and email
- ✅ Filter combinations working (search + inactive status)
- ✅ Clear button and empty states functioning properly

## Completion Status
✅ **COMPLETED** - Full search and pagination system implemented with professional UI, FHIR integration, URL state management, and comprehensive testing. Ready for additional filters and future enhancements.
