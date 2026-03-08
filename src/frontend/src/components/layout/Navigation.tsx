import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Building2,
  CalendarCheck,
  CalendarDays,
  ChevronDown,
  Database,
  FileText,
  FolderOpen,
  Hotel,
  LayoutDashboard,
  Lock,
  PlusCircle,
  Settings,
  Star,
  Tag,
  Users,
  Users2,
  Zap,
} from "lucide-react";
import type { UserPrivileges } from "../../backend.d.ts";
import { useCredentialSession } from "../../contexts/CredentialSessionContext";
import { useGetCallerUserProfile } from "../../hooks/useQueries";

// ── Nav Item Definitions ─────────────────────────────────────────────────────

type PrivilegeKey = keyof Omit<UserPrivileges, "accountId">;

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  privilegeKey?: PrivilegeKey;
}

const coreNavItems: NavItem[] = [
  {
    to: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    privilegeKey: "dashboard",
  },
  {
    to: "/categories",
    label: "New Package",
    icon: PlusCircle,
    privilegeKey: "newPackage",
  },
  {
    to: "/quick-quote",
    label: "Quick Quote",
    icon: Zap,
    privilegeKey: "newPackage",
  },
  {
    to: "/packages",
    label: "Packages",
    icon: FolderOpen,
    privilegeKey: "packagesLibrary",
  },
  {
    to: "/itinerary",
    label: "Itinerary",
    icon: CalendarDays,
    privilegeKey: "packagesLibrary",
  },
  { to: "/leads", label: "Leads", icon: Users2, privilegeKey: "leads" },
  {
    to: "/customers",
    label: "Customers",
    icon: Users,
    privilegeKey: "customers",
  },
];

const mgmtNavItems: NavItem[] = [
  {
    to: "/bookings",
    label: "Bookings",
    icon: CalendarCheck,
    privilegeKey: "bookings",
  },
  {
    to: "/vendors",
    label: "Vendors",
    icon: Building2,
    privilegeKey: "vendors",
  },
  {
    to: "/reminders",
    label: "Reminders",
    icon: Bell,
    privilegeKey: "reminders",
  },
  {
    to: "/invoices",
    label: "Invoices",
    icon: FileText,
    privilegeKey: "invoices",
  },
];

const growthNavItems: NavItem[] = [
  {
    to: "/promotions",
    label: "Promotions",
    icon: Tag,
    privilegeKey: "promotions",
  },
  {
    to: "/analytics",
    label: "Analytics",
    icon: BarChart3,
    privilegeKey: "analytics",
  },
  { to: "/reviews", label: "Reviews", icon: Star, privilegeKey: "reviews" },
];

// ── Helper ───────────────────────────────────────────────────────────────────

function canAccess(
  item: NavItem,
  isAdmin: boolean,
  isCredentialUser: boolean,
  privileges: UserPrivileges | null,
): boolean {
  if (isAdmin) return true;
  if (!isCredentialUser) return true; // normal II user
  if (!item.privilegeKey) return false;
  if (!privileges) return false;
  return privileges[item.privilegeKey] === true;
}

function filterItems(
  items: NavItem[],
  isAdmin: boolean,
  isCredentialUser: boolean,
  privileges: UserPrivileges | null,
): NavItem[] {
  return items.filter((item) =>
    canAccess(item, isAdmin, isCredentialUser, privileges),
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export default function Navigation() {
  const { data: userProfile } = useGetCallerUserProfile();
  const { isCredentialUser, privileges } = useCredentialSession();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const isAdmin = !isCredentialUser && userProfile?.role === "admin";

  const isActive = (to: string) =>
    to === "/" ? currentPath === "/" : currentPath.startsWith(to);

  const navLinkClass = (active: boolean) =>
    `group flex items-center gap-2 px-3 py-3.5 text-sm font-medium font-sans whitespace-nowrap border-b-2 transition-all duration-200 relative ${
      active
        ? "border-gold text-gold"
        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
    }`;

  const navIconClass = (active: boolean) =>
    `w-4 h-4 transition-all shrink-0 ${
      active
        ? "text-gold drop-shadow-[0_0_6px_rgba(201,162,39,0.7)]"
        : "text-muted-foreground group-hover:text-foreground"
    }`;

  const navIconWrapClass = (active: boolean) =>
    `flex items-center justify-center transition-all duration-200 ${
      active
        ? "bg-gold/15 rounded-md p-0.5"
        : "group-hover:bg-foreground/5 rounded-md p-0.5"
    }`;

  const visibleCore = filterItems(
    coreNavItems,
    isAdmin,
    isCredentialUser,
    privileges,
  );
  const visibleMgmt = filterItems(
    mgmtNavItems,
    isAdmin,
    isCredentialUser,
    privileges,
  );
  const visibleGrowth = filterItems(
    growthNavItems,
    isAdmin,
    isCredentialUser,
    privileges,
  );

  const canSeeSettings =
    isAdmin ||
    !isCredentialUser ||
    (isCredentialUser &&
      privileges &&
      (privileges.companySettings || privileges.rateManagement));

  const hasAnyAccess =
    visibleCore.length > 0 ||
    visibleMgmt.length > 0 ||
    visibleGrowth.length > 0 ||
    canSeeSettings;

  // Empty state for restricted credential users
  if (isCredentialUser && !hasAnyAccess) {
    return (
      <nav className="bg-card/50 border-b border-border backdrop-blur-sm sticky top-16 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 py-3">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground font-sans">
              Contact your administrator to enable module access.
            </p>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-card/50 border-b border-border backdrop-blur-sm sticky top-16 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-0 overflow-x-auto scrollbar-none py-0">
          {/* Core Operations */}
          {visibleCore.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className={navLinkClass(isActive(to))}>
              <span className={navIconWrapClass(isActive(to))}>
                <Icon className={navIconClass(isActive(to))} />
              </span>
              <span className="hidden md:inline">{label}</span>
              {isActive(to) && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold shadow-glow-gold" />
              )}
            </Link>
          ))}

          {/* Management Dropdown */}
          {visibleMgmt.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={navLinkClass(
                    visibleMgmt.some((i) => isActive(i.to)),
                  )}
                >
                  <span
                    className={navIconWrapClass(
                      visibleMgmt.some((i) => isActive(i.to)),
                    )}
                  >
                    <CalendarCheck
                      className={navIconClass(
                        visibleMgmt.some((i) => isActive(i.to)),
                      )}
                    />
                  </span>
                  <span className="hidden md:inline">Management</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                  {visibleMgmt.some((i) => isActive(i.to)) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold shadow-glow-gold" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={4}
                className="bg-popover border-border w-44 z-[100]"
              >
                <DropdownMenuLabel className="text-xs text-muted-foreground font-sans uppercase tracking-wide">
                  Management
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {visibleMgmt.map(({ to, label, icon: Icon }) => (
                  <DropdownMenuItem key={to} asChild>
                    <Link
                      to={to}
                      className={`cursor-pointer font-sans text-sm flex items-center gap-2 ${isActive(to) ? "text-gold" : ""}`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Growth Dropdown */}
          {visibleGrowth.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={navLinkClass(
                    visibleGrowth.some((i) => isActive(i.to)),
                  )}
                >
                  <span
                    className={navIconWrapClass(
                      visibleGrowth.some((i) => isActive(i.to)),
                    )}
                  >
                    <BarChart3
                      className={navIconClass(
                        visibleGrowth.some((i) => isActive(i.to)),
                      )}
                    />
                  </span>
                  <span className="hidden md:inline">Growth</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                  {visibleGrowth.some((i) => isActive(i.to)) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold shadow-glow-gold" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={4}
                className="bg-popover border-border w-44 z-[100]"
              >
                <DropdownMenuLabel className="text-xs text-muted-foreground font-sans uppercase tracking-wide">
                  Growth
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {visibleGrowth.map(({ to, label, icon: Icon }) => (
                  <DropdownMenuItem key={to} asChild>
                    <Link
                      to={to}
                      className={`cursor-pointer font-sans text-sm flex items-center gap-2 ${isActive(to) ? "text-gold" : ""}`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Settings */}
          {canSeeSettings && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={navLinkClass(currentPath.startsWith("/settings"))}
                  data-ocid="settings.button"
                >
                  <span
                    className={navIconWrapClass(
                      currentPath.startsWith("/settings"),
                    )}
                  >
                    <Settings
                      className={navIconClass(
                        currentPath.startsWith("/settings"),
                      )}
                    />
                  </span>
                  <span className="hidden md:inline">Settings</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                  {currentPath.startsWith("/settings") && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold shadow-glow-gold" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={4}
                className="bg-popover border-border w-52 z-[100]"
                data-ocid="settings.dropdown_menu"
              >
                <DropdownMenuLabel className="text-xs text-muted-foreground font-sans uppercase tracking-wide">
                  Settings
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* Company Settings - visible if admin or has companySettings privilege */}
                {(isAdmin ||
                  !isCredentialUser ||
                  (isCredentialUser && privileges?.companySettings)) && (
                  <DropdownMenuItem asChild>
                    <Link
                      to="/settings/company"
                      className="cursor-pointer font-sans text-sm flex items-center gap-2"
                      data-ocid="settings.company.link"
                    >
                      <Building2 className="w-4 h-4" />
                      Company Settings
                    </Link>
                  </DropdownMenuItem>
                )}
                {/* User Management - admin only */}
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link
                      to="/settings/users"
                      className="cursor-pointer font-sans text-sm flex items-center gap-2"
                      data-ocid="settings.users.link"
                    >
                      <Users className="w-4 h-4" />
                      User Management
                    </Link>
                  </DropdownMenuItem>
                )}
                {/* Rate Management - visible if admin or has rateManagement privilege */}
                {(isAdmin ||
                  !isCredentialUser ||
                  (isCredentialUser && privileges?.rateManagement)) && (
                  <DropdownMenuItem asChild>
                    <Link
                      to="/settings/rates"
                      className="cursor-pointer font-sans text-sm flex items-center gap-2"
                      data-ocid="settings.rates.link"
                    >
                      <Hotel className="w-4 h-4" />
                      Rate Management
                    </Link>
                  </DropdownMenuItem>
                )}
                {/* Master Data - admin only */}
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link
                      to="/settings/master-data"
                      className="cursor-pointer font-sans text-sm flex items-center gap-2"
                      data-ocid="settings.masterdata.link"
                    >
                      <Database className="w-4 h-4" />
                      Master Data
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
}
