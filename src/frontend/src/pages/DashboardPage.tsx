import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  Clock,
  DollarSign,
  FileText,
  FolderOpen,
  Globe,
  Package,
  PlusCircle,
  Settings,
  Sparkles,
  Tag,
  TrendingUp,
  Users,
  Users2,
  Zap,
} from "lucide-react";
import {
  useGetActivePromotions,
  useGetAllInvoices,
  useGetAnalyticsSummary,
  useGetCallerUserProfile,
  useGetLeads,
  useGetReminders,
} from "../hooks/useQueries";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: summary } = useGetAnalyticsSummary();
  const { data: reminders = [] } = useGetReminders();
  const { data: leads = [] } = useGetLeads();
  const { data: activePromotions = [] } = useGetActivePromotions();
  const { data: allInvoices = [] } = useGetAllInvoices();
  const isAdmin = userProfile?.role === "admin";

  const pendingInvoices = allInvoices.filter((inv) => inv.status !== "Paid");

  const now = Date.now();
  const next7Days = now + 7 * 24 * 60 * 60 * 1000;
  const upcomingReminders = reminders
    .filter(
      (r) =>
        r.status === "Pending" &&
        Number(r.reminderDate) / 1_000_000 <= next7Days,
    )
    .sort((a, b) => Number(a.reminderDate) - Number(b.reminderDate))
    .slice(0, 5);

  const recentLeads = [...leads]
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    .slice(0, 5);

  const stats = [
    {
      label: "Total Revenue",
      value: summary
        ? `₹${Number(summary.totalRevenue).toLocaleString()}`
        : "–",
      icon: DollarSign,
      color: "text-gold",
      bg: "bg-gold/10 border-gold/20",
    },
    {
      label: "Total Leads",
      value: summary ? Number(summary.totalLeads) : "–",
      icon: Users2,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "Packages",
      value: summary ? Number(summary.totalPackages) : "–",
      icon: Package,
      color: "text-teal",
      bg: "bg-teal/10 border-teal/20",
    },
    {
      label: "Bookings",
      value: summary ? Number(summary.totalBookings) : "–",
      icon: BookOpen,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      label: "Conversion",
      value: summary ? `${Number(summary.conversionRate)}%` : "–",
      icon: TrendingUp,
      color: "text-green-400",
      bg: "bg-green-500/10 border-green-500/20",
    },
    {
      label: "Customers",
      value: summary ? Number(summary.totalCustomers) : "–",
      icon: Users,
      color: "text-orange-400",
      bg: "bg-orange-500/10 border-orange-500/20",
    },
    {
      label: "Pending Invoices",
      value: pendingInvoices.length,
      icon: FileText,
      color: "text-red-400",
      bg: "bg-red-500/10 border-red-500/20",
    },
  ];

  const quickActions = [
    {
      label: "Create Package",
      description: "Design from premium templates",
      icon: PlusCircle,
      gradient: "from-gold-dark to-gold",
      action: () => navigate({ to: "/categories" }),
    },
    {
      label: "Quick Quote",
      description: "Instant price calculator",
      icon: Zap,
      gradient: "from-yellow-700 to-yellow-500",
      action: () => navigate({ to: "/quick-quote" }),
    },
    {
      label: "Add Lead",
      description: "Track a new prospect",
      icon: Users2,
      gradient: "from-blue-700 to-blue-500",
      action: () => navigate({ to: "/leads" }),
    },
    {
      label: "Add Customer",
      description: "Register customer details",
      icon: Users,
      gradient: "from-teal-dark to-teal",
      action: () => navigate({ to: "/customers" }),
    },
    {
      label: "View Analytics",
      description: "Business performance stats",
      icon: BarChart3,
      gradient: "from-purple-700 to-purple-500",
      action: () => navigate({ to: "/analytics" }),
    },
    ...(isAdmin
      ? [
          {
            label: "Settings",
            description: "Configure rates & company",
            icon: Settings,
            gradient: "from-orange-700 to-orange-500",
            action: () => navigate({ to: "/settings/company" }),
          },
        ]
      : []),
  ];

  const formatReminderDate = (ts: bigint) => {
    const ms = Number(ts) / 1_000_000;
    const diff = ms - now;
    if (diff < 0) return "Overdue";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h left`;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days}d left`;
  };

  const STAGE_LABELS: Record<string, string> = {
    NewLead: "New Lead",
    Contacted: "Contacted",
    Prospect: "Prospect",
    QuotationSent: "Quotation Sent",
    InNegotiation: "In Negotiation",
    ReadyToBook: "Ready to Book",
    PaymentAwaited: "Payment Awaited",
    BookingConfirmed: "Confirmed",
    Lost: "Lost",
    Cancelled: "Cancelled",
  };

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden bg-sidebar border-b border-border">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-15"
            style={{
              background:
                "radial-gradient(circle, oklch(var(--gold)), transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10"
            style={{
              background:
                "radial-gradient(circle, oklch(var(--teal)), transparent 70%)",
            }}
          />
        </div>
        <div className="relative container mx-auto px-4 py-10 md:py-14">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-gold" />
                <span className="text-xs font-sans text-muted-foreground uppercase tracking-widest">
                  Dashboard
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-1">
                Welcome back,{" "}
                <span className="text-gradient-gold">
                  {userProfile?.name || "User"}
                </span>
              </h2>
              <p className="text-muted-foreground font-sans text-sm max-w-md">
                Your complete travel CRM — packages, leads, bookings, analytics
                and more.
              </p>
            </div>
            <Button
              onClick={() => navigate({ to: "/categories" })}
              className="gradient-gold text-sidebar font-display font-bold shadow-gold hover:shadow-glow-gold transition-all duration-300 px-6"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              New Package
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <Card
              key={label}
              className="premium-card hover:border-gold/30 transition-all"
            >
              <CardContent className="p-4">
                <div
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center mb-3 ${bg}`}
                >
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <p className="text-xl font-display font-bold text-foreground">
                  {value}
                </p>
                <p className="text-xs text-muted-foreground font-sans mt-0.5 leading-tight">
                  {label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-xs font-sans font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            Quick Actions
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {quickActions.map(
              ({ label, description, icon: Icon, gradient, action }) => (
                <button
                  key={label}
                  type="button"
                  onClick={action}
                  className={`group relative overflow-hidden bg-gradient-to-br ${gradient} rounded-xl p-5 text-left transition-all duration-300 shadow-md hover:-translate-y-1 hover:shadow-lg shrink-0 w-44`}
                >
                  <Icon className="w-7 h-7 mb-3 text-white/90" />
                  <p className="font-display font-bold text-base mb-0.5 text-white leading-tight">
                    {label}
                  </p>
                  <p className="text-xs text-white/70 font-sans leading-relaxed">
                    {description}
                  </p>
                  <ArrowRight className="absolute bottom-4 right-4 w-3.5 h-3.5 text-white/50 group-hover:text-white/80 group-hover:translate-x-0.5 transition-all" />
                </button>
              ),
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Reminders */}
          <Card className="premium-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <Bell className="w-4 h-4 text-gold" />
                Upcoming Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingReminders.length === 0 ? (
                <div className="text-center py-6">
                  <Clock className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground font-sans">
                    No upcoming reminders
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {upcomingReminders.map((r) => {
                    const ms = Number(r.reminderDate) / 1_000_000;
                    const overdue = ms < now;
                    return (
                      <div
                        key={String(r.id)}
                        className={`flex items-start gap-2 p-2.5 rounded-lg ${overdue ? "bg-red-500/10 border border-red-500/20" : "bg-card border border-border/40"}`}
                      >
                        <Bell
                          className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${overdue ? "text-red-400" : "text-gold"}`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-sans text-foreground truncate">
                            {r.message}
                          </p>
                          <p
                            className={`text-[10px] font-sans mt-0.5 ${overdue ? "text-red-400" : "text-muted-foreground"}`}
                          >
                            {formatReminderDate(r.reminderDate)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <Link
                    to="/reminders"
                    className="text-xs text-gold hover:text-gold-light font-sans flex items-center gap-1 pt-1"
                  >
                    View all <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Leads */}
          <Card className="premium-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <Users2 className="w-4 h-4 text-blue-400" />
                Recent Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentLeads.length === 0 ? (
                <div className="text-center py-6">
                  <Users2 className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground font-sans">
                    No leads yet
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentLeads.map((lead) => (
                    <Link
                      key={String(lead.id)}
                      to="/leads/$leadId"
                      params={{ leadId: String(lead.id) }}
                      className="flex items-center gap-2 p-2.5 rounded-lg bg-card border border-border/40 hover:border-blue-500/30 transition-all group"
                    >
                      <div className="w-7 h-7 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                        <span className="text-xs font-display font-bold text-blue-400">
                          {lead.guestName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-display font-semibold text-foreground truncate">
                          {lead.guestName}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-sans truncate">
                          {lead.destination || "–"}
                        </p>
                      </div>
                      <Badge className="text-[10px] border bg-blue-500/10 text-blue-400 border-blue-500/20 shrink-0">
                        {STAGE_LABELS[lead.stage] ?? lead.stage}
                      </Badge>
                    </Link>
                  ))}
                  <Link
                    to="/leads"
                    className="text-xs text-gold hover:text-gold-light font-sans flex items-center gap-1 pt-1"
                  >
                    View all leads <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Promotions */}
          <Card className="premium-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <Tag className="w-4 h-4 text-orange-400" />
                Active Promotions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activePromotions.length === 0 ? (
                <div className="text-center py-6">
                  <Tag className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground font-sans">
                    No active promotions
                  </p>
                  {isAdmin && (
                    <Link
                      to="/promotions"
                      className="text-xs text-gold hover:text-gold-light font-sans block mt-2"
                    >
                      Create promotion →
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {activePromotions.slice(0, 4).map((promo) => (
                    <div
                      key={String(promo.id)}
                      className="flex items-center gap-2 p-2.5 rounded-lg bg-orange-500/5 border border-orange-500/20"
                    >
                      <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                        <span className="text-sm font-mono font-bold text-orange-400">
                          {Number(promo.discountPercent)}%
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-display font-semibold text-foreground truncate">
                          {promo.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-sans">
                          Till{" "}
                          {new Date(
                            Number(promo.validTo) / 1_000_000,
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Link
                    to="/promotions"
                    className="text-xs text-gold hover:text-gold-light font-sans flex items-center gap-1 pt-1"
                  >
                    View all <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Analytics Quick Link */}
        <button
          type="button"
          className="relative overflow-hidden rounded-2xl cursor-pointer group w-full text-left"
          onClick={() => navigate({ to: "/analytics" })}
          style={{
            background:
              "linear-gradient(135deg, oklch(var(--sidebar)), oklch(var(--card)))",
          }}
        >
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 80% 50%, oklch(var(--gold)), transparent 50%)",
            }}
          />
          <div className="relative flex items-center justify-between px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="font-display font-bold text-foreground">
                  View Full Analytics
                </p>
                <p className="text-sm font-sans text-muted-foreground">
                  Revenue trends, top destinations, booking analysis
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gold group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Packages quick link */}
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-sans font-semibold text-muted-foreground uppercase tracking-widest">
            Quick Navigation
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              to: "/packages" as const,
              label: "All Packages",
              icon: FolderOpen,
              color: "text-gold",
            },
            {
              to: "/bookings" as const,
              label: "Bookings",
              icon: BookOpen,
              color: "text-purple-400",
            },
            {
              to: "/vendors" as const,
              label: "Vendors",
              icon: Users,
              color: "text-teal",
            },
            {
              to: "/invoices" as const,
              label: "Invoices",
              icon: FolderOpen,
              color: "text-orange-400",
            },
          ].map(({ to, label, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-gold/30 transition-all hover:-translate-y-0.5 group"
            >
              <Icon className={`w-5 h-5 ${color}`} />
              <span className="text-sm font-sans font-medium text-foreground">
                {label}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-gold group-hover:translate-x-0.5 transition-all ml-auto" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
