import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import AppLayout from "./components/layout/AppLayout";
import AnalyticsPage from "./pages/AnalyticsPage";
import BookingsPage from "./pages/BookingsPage";
import CategorySelectionPage from "./pages/CategorySelectionPage";
import CustomerDatabasePage from "./pages/CustomerDatabasePage";
import CustomerDetailPage from "./pages/CustomerDetailPage";
import DashboardPage from "./pages/DashboardPage";
import InvoicePage from "./pages/InvoicePage";
import LeadDetailPage from "./pages/LeadDetailPage";
import LeadsPage from "./pages/LeadsPage";
import LoginPage from "./pages/LoginPage";
import PackageEditorPage from "./pages/PackageEditorPage";
import PackagePreviewPage from "./pages/PackagePreviewPage";
import PackagesLibraryPage from "./pages/PackagesLibraryPage";
import PromotionsPage from "./pages/PromotionsPage";
import RemindersPage from "./pages/RemindersPage";
import ReviewsPage from "./pages/ReviewsPage";
import TemplateLibraryPage from "./pages/TemplateLibraryPage";
import VendorsPage from "./pages/VendorsPage";
import CompanySettingsPage from "./pages/admin/CompanySettingsPage";
import RateManagementPage from "./pages/admin/RateManagementPage";
import UserManagementPage from "./pages/admin/UserManagementPage";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "app",
  component: AppLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/",
  component: DashboardPage,
});

const categoryRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/categories",
  component: CategorySelectionPage,
});

const templateLibraryRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/templates/$category",
  component: TemplateLibraryPage,
});

const packageEditorRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/editor",
  component: PackageEditorPage,
});

const packageEditorEditRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/editor/$packageId",
  component: PackageEditorPage,
});

const packagePreviewRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/preview",
  component: PackagePreviewPage,
});

const packagesLibraryRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/packages",
  component: PackagesLibraryPage,
});

const customerDatabaseRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/customers",
  component: CustomerDatabasePage,
});

const customerDetailRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/customers/$customerName",
  component: CustomerDetailPage,
});

// New CRM Routes
const leadsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/leads",
  component: LeadsPage,
});

const leadDetailRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/leads/$leadId",
  component: LeadDetailPage,
});

const bookingsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/bookings",
  component: BookingsPage,
});

const vendorsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/vendors",
  component: VendorsPage,
});

const remindersRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/reminders",
  component: RemindersPage,
});

const promotionsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/promotions",
  component: PromotionsPage,
});

const invoicesRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/invoices",
  component: InvoicePage,
});

const analyticsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/analytics",
  component: AnalyticsPage,
});

const reviewsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/reviews",
  component: ReviewsPage,
});

// Admin Routes
const companySettingsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/settings/company",
  component: CompanySettingsPage,
});

const userManagementRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/settings/users",
  component: UserManagementPage,
});

const rateManagementRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/settings/rates",
  component: RateManagementPage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  appLayoutRoute.addChildren([
    dashboardRoute,
    categoryRoute,
    templateLibraryRoute,
    packageEditorRoute,
    packageEditorEditRoute,
    packagePreviewRoute,
    packagesLibraryRoute,
    customerDatabaseRoute,
    customerDetailRoute,
    // New CRM
    leadsRoute,
    leadDetailRoute,
    bookingsRoute,
    vendorsRoute,
    remindersRoute,
    promotionsRoute,
    invoicesRoute,
    analyticsRoute,
    reviewsRoute,
    // Admin
    companySettingsRoute,
    userManagementRoute,
    rateManagementRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
