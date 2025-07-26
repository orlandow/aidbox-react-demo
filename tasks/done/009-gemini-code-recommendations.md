---
title: Gemini Code Recommendations
status: todo
---

This task outlines code improvement recommendations provided by the Gemini assistant.

### 1. Implement Optimistic Updates in React Query

**File:** `src/hooks/api/usePatientMutations.ts`

**Recommendation:**

Refactor the `useCreatePatient`, `useUpdatePatient`, and `useDeletePatient` mutations to use optimistic updates. This will make the UI feel more responsive by updating the local cache immediately, before the API call completes.

**Example for `useUpdatePatient`:**

```typescript
export function useUpdatePatient() {
  // ... (imports and other hooks)

  return useMutation({
    mutationFn: ({ id, patient }: { id: string; patient: Patient }) =>
      aidbox.update('Patient', id, patient),
    // Optimistically update the cache
    onMutate: async (updatedPatient) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.patients.detail(updatedPatient.id) });

      // Snapshot the previous value
      const previousPatient = queryClient.getQueryData(queryKeys.patients.detail(updatedPatient.id));

      // Optimistically update to the new value
      queryClient.setQueryData(queryKeys.patients.detail(updatedPatient.id), updatedPatient.patient);

      // Return a context object with the snapshotted value
      return { previousPatient, updatedPatient };
    },
    // If the mutation fails, roll back
    onError: (err, newPatient, context) => {
      queryClient.setQueryData(
        queryKeys.patients.detail(context.updatedPatient.id),
        context.previousPatient
      );
      // ... (toast notification)
    },
    // Always refetch after error or success
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.patients.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.patients.lists() });
    },
    onSuccess: (updatedPatient) => {
      // ... (toast notification and navigation)
    },
  });
}
```

### 2. Extract `formatPatientName` Utility Function ✅ COMPLETED

**File:** `src/hooks/api/usePatientMutations.ts`

**Recommendation:**

The `formatPatientName` function is duplicated. Extract it into a utility file (e.g., `src/utils/fhir.ts` or a more general `src/utils/formatting.ts`) to promote reuse and keep the mutation hook focused on data logic.

**Implementation:**
- Created `src/utils/stringify.ts` with `stringifyPatient` function
- Updated all files to use the centralized utility
- Removed duplicate implementations from `PatientEdit.tsx`, `PatientDetail.tsx`, and `usePatientMutations.ts`

## Analysis: Optimistic Updates for Healthcare Applications

**Decision: NOT RECOMMENDED for this healthcare application**

While the Gemini suggestion for optimistic updates is technically sound and follows React Query best practices, it's not appropriate for healthcare applications due to:

1. **Data Integrity Requirements**: Healthcare professionals need certainty that patient data changes are actually persisted, not just optimistically displayed.

2. **Trust and Confidence**: The slight delay provides confidence that data is truly saved, which is critical in medical contexts.

3. **Audit and Compliance**: Healthcare systems require clear audit trails - important to distinguish between "attempted to save" vs "actually saved."

4. **Risk of Clinical Decisions**: Clinicians might make decisions based on patient data that appears saved but could get rolled back on server rejection.

**Current implementation is more appropriate** - it only updates UI with server-confirmed data, ensuring displayed information matches stored data. Loading states provide clear feedback about the save process without the risks of optimistic updates.
