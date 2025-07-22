# 📋 USER REQUEST TRACKER

## 🎯 CURRENT PLAN: Final Transcript Requirements

This plan is based on a full re-review of the user transcript. These are the final changes required.

### 📋 Remaining Tasks (In Progress)

1.  **[ ] "User Management" Button → "System Settings"**
    -   **Reason**: The button will manage more than just users (brands, models, etc.).
    -   **File**: `components/pfi-dashboard.tsx`

2.  **[ ] Remove "Valid Until" Date Picker**
    -   **Reason**: Not needed for management PFIs; validity is immediate.
    -   **File**: `components/pfi-form.tsx`

3.  **[ ] Flexible Discount Input (% or ₦)**
    -   **Reason**: Allow discount as a percentage OR a fixed Naira amount with quick selects.
    -   **Files**: `components/pfi-form.tsx`, `lib/types.ts`

4.  **[ ] "Internal Notes" → Floating Action Button (FAB)**
    -   **Reason**: Notes are secondary; should not be a main form section.
    -   **Files**: `components/pfi-form.tsx`, `components/ui/internal-notes-fab.tsx` (new)

5.  **[ ] Remove Duplicate "Prepared By" & "Approved By"**
    -   **Reason**: These fields only belong in the final "Terms & Authorization" section.
    -   **File**: `components/pfi-form.tsx`

6.  **[ ] Remove "Save" Button**
    -   **Reason**: The primary actions are "Preview" and "Download"; saving state is not required for this workflow.
    -   **File**: `components/pfi-form.tsx`

---

## ✅ PREVIOUSLY COMPLETED

-   **React Infinite Loop Bug**: Fixed.
-   **Nigerian Localization**: Completed.
-   **Screenshot Organization**: Completed.
-   **Modern Vehicle Selector**: Completed.
-   **Core Form Logic**: Address structure, validation, auto-fills, collapsible sections all completed.

---

*Last Updated: 2025-01-21 23:10 - Executing final requirements.* 🤖 