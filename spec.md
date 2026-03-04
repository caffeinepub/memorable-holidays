# Memorable Holidays - Complete Feature Fix & Tripotomize Parity

## Current State
The app has all major routes and pages present but suffers from:
1. **Critical crash bug**: `CredentialSessionProvider` is missing from `main.tsx`, causing blank screen for all users since any component calling `useCredentialSession()` throws immediately.
2. **Settings sheet/dropdown non-functional**: The Settings navigation dropdown doesn't open properly due to z-index/portal issues in the nav bar when CredentialSessionProvider is missing.
3. **Missing Tripotomize features**: Master Data library (destinations, hotels, sightseeing, vehicles, airlines), lead activity log, smart lead import, multi-currency, package comparison, PDF designer, custom reports, payment receipts, customer birthday/anniversary reminders, booking amendment handling.
4. **Placeholder content**: Several pages have stub UIs without full functionality.

## Requested Changes (Diff)

### Add
- `CredentialSessionProvider` wrap in `main.tsx` (critical fix)
- **Master Data page** (`/settings/master-data`): Destination database, hotel inventory with rates, sightseeing activities library, vehicle fleet management, airline management, add-on services catalog — all fully CRUD with persistent backend storage
- **Lead Activity Log**: Every lead detail page shows a full timestamped activity log (call, email, WhatsApp, meeting, note) with the ability to add new interactions
- **Lead Import**: CSV-style bulk lead creation from the Leads page (paste or upload)
- **Payment Receipts**: In Invoices page, after marking as Paid, generate and share a payment receipt (PDF layout)
- **Package Comparison**: From Packages Library, select up to 3 packages and compare them side-by-side (destinations, price, inclusions)
- **Multi-currency toggle**: In Package Editor and Quick Quote, toggle between INR/USD/EUR/AED with live conversion display
- **Customer birthday/anniversary reminders**: In Customer detail, add DOB/anniversary fields that auto-create reminders
- **Booking amendment tracking**: In Bookings, add "Amend" button that records amendment history per booking
- **Custom Reports page**: Under Analytics, filterable reports for revenue by destination, agent performance, source-wise leads, monthly bookings — exportable

### Modify
- `main.tsx`: Add `CredentialSessionProvider` wrapping the app
- `Navigation.tsx`: Fix Settings dropdown portal/z-index; add Master Data link under Settings
- `LeadDetailPage.tsx`: Add fully functional activity log section (currently minimal)
- `InvoicePage.tsx`: Add payment receipt generation after marking paid
- `PackagesLibraryPage.tsx`: Add compare mode (select 2-3 packages, side-by-side modal)
- `AnalyticsPage.tsx`: Add custom report filters and export buttons
- `CustomerDetailPage.tsx`: Add DOB, anniversary fields with auto-reminder creation
- `PackageEditorPage.tsx`: Add multi-currency display toggle
- `QuickQuotePage.tsx`: Add multi-currency display toggle
- `RateManagementPage.tsx`: Connect to Master Data — rate dropdowns should pull from master data library

### Remove
- Nothing to remove

## Implementation Plan
1. Fix `main.tsx` — add CredentialSessionProvider (1 line change, critical)
2. Fix Navigation z-index / Settings dropdown portal issue
3. Add MasterDataPage with full CRUD for destinations, hotels, sightseeing, vehicles, airlines, add-ons
4. Enhance LeadDetailPage with full timestamped activity log
5. Add lead CSV import modal on LeadsPage
6. Add payment receipt in InvoicePage
7. Add package compare modal in PackagesLibraryPage
8. Add multi-currency toggle in PackageEditorPage and QuickQuotePage
9. Add DOB/anniversary to CustomerDetailPage with auto-reminder
10. Add custom reports section to AnalyticsPage
11. Add booking amendment history in BookingsPage
12. Route MasterDataPage in App.tsx and add link in Navigation Settings dropdown
