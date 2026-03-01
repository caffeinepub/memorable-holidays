import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  BookOpen,
  DollarSign,
  Loader2,
  MapPin,
  Package,
  TrendingUp,
  Users,
  Users2,
} from "lucide-react";
import {
  useGetAnalyticsSummary,
  useGetBookings,
  useGetLeadsByStage,
  useGetTopDestinations,
} from "../hooks/useQueries";

const STAGE_LABELS: Record<string, string> = {
  NewLead: "New Lead",
  Contacted: "Contacted",
  Prospect: "Prospect",
  QuotationSent: "Quotation",
  InNegotiation: "Negotiation",
  ReadyToBook: "Ready",
  PaymentAwaited: "Payment",
  BookingConfirmed: "Confirmed",
  Lost: "Lost",
  Cancelled: "Cancelled",
};

const STAGE_COLORS: Record<string, string> = {
  NewLead: "bg-blue-500",
  Contacted: "bg-purple-500",
  Prospect: "bg-yellow-500",
  QuotationSent: "bg-orange-500",
  InNegotiation: "bg-pink-500",
  ReadyToBook: "bg-teal-500",
  PaymentAwaited: "bg-amber-500",
  BookingConfirmed: "bg-green-500",
  Lost: "bg-red-500",
  Cancelled: "bg-gray-500",
};

const BOOKING_STATUS_COLORS: Record<string, string> = {
  Confirmed: "bg-green-500",
  Pending: "bg-amber-500",
  Cancelled: "bg-red-500",
  Amended: "bg-blue-500",
};

export default function AnalyticsPage() {
  const { data: summary, isLoading: summaryLoading } = useGetAnalyticsSummary();
  const { data: stageCounts = [], isLoading: stageLoading } =
    useGetLeadsByStage();
  const { data: topDestinations = [], isLoading: destLoading } =
    useGetTopDestinations();
  const { data: bookings = [], isLoading: bookingsLoading } = useGetBookings();

  const isLoading =
    summaryLoading || stageLoading || destLoading || bookingsLoading;

  const bookingStatusMap = bookings.reduce<Record<string, number>>((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {});

  const maxStageCount = Math.max(...stageCounts.map((s) => Number(s.count)), 1);
  const maxDestCount = Math.max(
    ...topDestinations.map((d) => Number(d.count)),
    1,
  );

  const statCards = summary
    ? [
        {
          label: "Total Revenue",
          value: `₹${Number(summary.totalRevenue).toLocaleString()}`,
          icon: DollarSign,
          color: "text-gold",
          bg: "bg-gold/10 border-gold/20",
        },
        {
          label: "Total Leads",
          value: Number(summary.totalLeads),
          icon: Users2,
          color: "text-blue-400",
          bg: "bg-blue-500/10 border-blue-500/20",
        },
        {
          label: "Total Packages",
          value: Number(summary.totalPackages),
          icon: Package,
          color: "text-teal",
          bg: "bg-teal/10 border-teal/20",
        },
        {
          label: "Total Bookings",
          value: Number(summary.totalBookings),
          icon: BookOpen,
          color: "text-purple-400",
          bg: "bg-purple-500/10 border-purple-500/20",
        },
        {
          label: "Conversion Rate",
          value: `${Number(summary.conversionRate)}%`,
          icon: TrendingUp,
          color: "text-green-400",
          bg: "bg-green-500/10 border-green-500/20",
        },
        {
          label: "Total Customers",
          value: Number(summary.totalCustomers),
          icon: Users,
          color: "text-orange-400",
          bg: "bg-orange-500/10 border-orange-500/20",
        },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-sidebar border-b border-border px-4 py-5">
        <div className="container mx-auto">
          <h2 className="text-2xl font-display font-bold text-foreground">
            <span className="text-gradient-gold">Analytics</span>
          </h2>
          <p className="text-sm text-muted-foreground font-sans mt-0.5">
            Business overview and performance metrics
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statCards.map(({ label, value, icon: Icon, color, bg }) => (
            <Card key={label} className="premium-card">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lead Funnel */}
          <Card className="premium-card">
            <CardHeader className="pb-4">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-gold" />
                Lead Pipeline Funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stageCounts.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground font-sans text-sm">
                  No lead data yet
                </div>
              ) : (
                <div className="space-y-3">
                  {stageCounts.map((stage) => (
                    <div key={stage.stage} className="flex items-center gap-3">
                      <div className="w-28 shrink-0 text-xs font-sans text-muted-foreground truncate">
                        {STAGE_LABELS[stage.stage] ?? stage.stage}
                      </div>
                      <div className="flex-1 h-6 bg-card rounded-md overflow-hidden">
                        <div
                          className={`h-full rounded-md ${STAGE_COLORS[stage.stage] ?? "bg-gray-500"} opacity-80 flex items-center justify-end pr-2 transition-all duration-500`}
                          style={{
                            width: `${(Number(stage.count) / maxStageCount) * 100}%`,
                            minWidth: "2rem",
                          }}
                        >
                          <span className="text-[10px] font-mono font-bold text-white">
                            {Number(stage.count)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Destinations */}
          <Card className="premium-card">
            <CardHeader className="pb-4">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal" />
                Top Destinations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topDestinations.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground font-sans text-sm">
                  No destination data yet
                </div>
              ) : (
                <div className="space-y-3">
                  {topDestinations.slice(0, 8).map((dest, i) => (
                    <div
                      key={dest.destination}
                      className="flex items-center gap-3"
                    >
                      <span className="w-5 text-xs font-mono text-muted-foreground text-right shrink-0">
                        {i + 1}.
                      </span>
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm font-sans text-foreground truncate">
                          {dest.destination}
                        </span>
                        <div className="flex items-center gap-2 ml-2">
                          <div className="w-16 h-2 bg-card rounded-full overflow-hidden">
                            <div
                              className="h-full bg-teal rounded-full"
                              style={{
                                width: `${(Number(dest.count) / maxDestCount) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs font-mono text-teal w-6 text-right shrink-0">
                            {Number(dest.count)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Booking Status */}
          <Card className="premium-card">
            <CardHeader className="pb-4">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                Booking Status Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(bookingStatusMap).length === 0 ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground font-sans text-sm">
                  No booking data yet
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(bookingStatusMap).map(([status, count]) => (
                    <div key={status} className="flex items-center gap-3">
                      <div className="w-24 shrink-0 text-xs font-sans text-muted-foreground">
                        {status}
                      </div>
                      <div className="flex-1 h-6 bg-card rounded-md overflow-hidden">
                        <div
                          className={`h-full rounded-md ${BOOKING_STATUS_COLORS[status] ?? "bg-gray-500"} opacity-80 flex items-center justify-end pr-2 transition-all duration-500`}
                          style={{
                            width: `${(count / Math.max(...Object.values(bookingStatusMap))) * 100}%`,
                            minWidth: "2.5rem",
                          }}
                        >
                          <span className="text-[10px] font-mono font-bold text-white">
                            {count}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Revenue Summary */}
          {summary && (
            <Card className="premium-card">
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-base flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gold" />
                  Revenue Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-end gap-3">
                    <div>
                      <p className="text-4xl font-display font-bold text-gradient-gold">
                        ₹{Number(summary.totalRevenue).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground font-sans mt-1">
                        Total Revenue Generated
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                    <div className="bg-sidebar rounded-xl p-3">
                      <p className="text-xs text-muted-foreground font-sans mb-1">
                        Avg per Package
                      </p>
                      <p className="text-lg font-display font-bold text-foreground">
                        ₹
                        {Number(summary.totalPackages) > 0
                          ? Math.round(
                              Number(summary.totalRevenue) /
                                Number(summary.totalPackages),
                            ).toLocaleString()
                          : 0}
                      </p>
                    </div>
                    <div className="bg-sidebar rounded-xl p-3">
                      <p className="text-xs text-muted-foreground font-sans mb-1">
                        Conversion Rate
                      </p>
                      <p className="text-lg font-display font-bold text-green-400">
                        {Number(summary.conversionRate)}%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
