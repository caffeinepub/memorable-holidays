# Memorable Holidays

## Current State
Full-stack tourism package management app with: package editor, CRM (leads/customers/bookings), invoices, rate management (hotels, food, cabs, activities, boating, add-ons, destination fees), user management with per-module privileges, and staff credential login.

**Known persistent issue:** `CredentialSessionProvider` is defined in `CredentialSessionContext.tsx` but is NOT imported or used in `main.tsx`. This causes `AppLayout` to crash on every load since it calls `useCredentialSession()` without a provider wrapper. This must be fixed in this build.

## Requested Changes (Diff)

### Add
- **Markup Management** tab in Settings > Rate Management (admin and authorized staff only)
  - Admin can create markup rules: name, type (percentage or fixed amount), value, applies-to category (All Bookings / Hotel / Activities / Food / Transport / Boating / Custom), optional notes
  - Admin can assign a markup rule to any booking/package on demand (not automatic)
  - Markup rules are stored in localStorage via a `markupStore`
  - A "Markup Applied" section visible only to admin/staff in the Package Editor and Invoice page showing the markup breakdown and adjusted total
  - Guest-facing views (Package Preview print/share, guest bill / invoice print output) must NEVER show markup line items or markup total - only the final price after markup is shown as the package total
  - Staff can see markup details in the internal invoice view and package summary, but cannot edit markup rules (only admin can add/edit/delete markup rules)
  - A `useIsAdminOrStaff()` hook that returns true if the user is logged in as admin (Internet Identity) or as a credential user

### Modify
- `main.tsx` - add `CredentialSessionProvider` import and wrap app with it (permanent fix)
- `RateManagementPage.tsx` - add new "Markup" tab at the end of the tabs list
- `InvoicePage.tsx` - show markup section in internal view (admin/staff only), hide from print/guest bill output
- `PackageEditorPage.tsx` (if exists) or `PackagePreviewPage.tsx` - show markup breakdown to admin/staff only in the internal summary panel

### Remove
- Nothing removed

## Implementation Plan
1. Fix `main.tsx` - add `CredentialSessionProvider` wrapping `<App />`
2. Create `src/frontend/src/lib/markupStore.ts` - localStorage-backed store for markup rules and applied markups
3. Create `src/frontend/src/hooks/useIsAdminOrStaff.ts` - hook that returns boolean based on login state
4. Add `MarkupTab` component inside `RateManagementPage.tsx` with full CRUD for markup rules, and an "Apply Markup" panel to assign rules to bookings/packages
5. Add markup visibility in `InvoicePage.tsx` - staff/admin internal section showing markup, hidden in print CSS
6. Verify build passes with zero errors
