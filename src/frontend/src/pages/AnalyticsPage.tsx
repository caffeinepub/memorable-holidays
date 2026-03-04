import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart3,
  BookOpen,
  DollarSign,
  Download,
  FileText,
  Loader2,
  MapPin,
  Package,
  Radio,
  TrendingUp,
  Users,
  Users2,
} from "lucide-react";
import type { Invoice, Lead } from "../backend.d.ts";
import {
  useGetAllInvoices,
  useGetAnalyticsSummary,
  useGetBookings,
  useGetLeads,
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
  const { data: allLeads = [], isLoading: leadsLoading } = useGetLeads();
  const { data: allInvoices = [], isLoading: invoicesLoading } =
    useGetAllInvoices();

  const isLoading =
    summaryLoading ||
    stageLoading ||
    destLoading ||
    bookingsLoading ||
    leadsLoading ||
    invoicesLoading;

  const bookingStatusMap = bookings.reduce<Record<string, number>>((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {});

  // Lead source breakdown
  const leadSourceMap = allLeads.reduce<Record<string, number>>((acc, l) => {
    const source = l.source || "Unknown";
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});
  const maxSourceCount = Math.max(...Object.values(leadSourceMap), 1);

  // Pending invoices
  const pendingInvoices = allInvoices.filter((inv) => inv.status !== "Paid");
  const pendingInvoiceTotal = pendingInvoices.reduce(
    (sum, inv) => sum + Number(inv.grandTotal),
    0,
  );

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
        {
          label: "Pending Invoices",
          value: pendingInvoices.length,
          icon: FileText,
          color: "text-red-400",
          bg: "bg-red-500/10 border-red-500/20",
        },
        {
          label: "Pending Value",
          value: `₹${pendingInvoiceTotal.toLocaleString()}`,
          icon: DollarSign,
          color: "text-amber-400",
          bg: "bg-amber-500/10 border-amber-500/20",
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
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

          {/* Lead Source Breakdown */}
          <Card className="premium-card">
            <CardHeader className="pb-4">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <Radio className="w-4 h-4 text-orange-400" />
                Lead Source Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(leadSourceMap).length === 0 ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground font-sans text-sm">
                  No lead data yet
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(leadSourceMap)
                    .sort(([, a], [, b]) => b - a)
                    .map(([source, count]) => (
                      <div key={source} className="flex items-center gap-3">
                        <div className="w-28 shrink-0 text-xs font-sans text-muted-foreground truncate">
                          {source}
                        </div>
                        <div className="flex-1 h-6 bg-card rounded-md overflow-hidden">
                          <div
                            className="h-full rounded-md bg-orange-500 opacity-80 flex items-center justify-end pr-2 transition-all duration-500"
                            style={{
                              width: `${(count / maxSourceCount) * 100}%`,
                              minWidth: "2rem",
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

        {/* Custom Reports */}
        <CustomReports allLeads={allLeads} allInvoices={allInvoices} />
      </div>
    </div>
  );
}

// ── Custom Reports Component ──────────────────────────────────────────────────

function CustomReports({
  allLeads,
  allInvoices,
}: {
  allLeads: Lead[];
  allInvoices: Invoice[];
}) {
  // Revenue by Destination
  const revenueByDestination = allLeads.reduce<Record<string, number>>(
    (acc, l) => {
      const dest = l.destination || "Unknown";
      acc[dest] = (acc[dest] || 0) + Number(l.budget);
      return acc;
    },
    {},
  );

  // Monthly Lead Trend
  const monthlyLeadTrend = allLeads.reduce<Record<string, number>>((acc, l) => {
    const date = new Date(Number(l.id) / 1_000_000);
    const month = date.toLocaleDateString("en-IN", {
      month: "short",
      year: "2-digit",
    });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  // Stage conversion funnel
  const STAGE_ORDER = [
    "NewLead",
    "Contacted",
    "Prospect",
    "QuotationSent",
    "InNegotiation",
    "ReadyToBook",
    "PaymentAwaited",
    "BookingConfirmed",
    "Lost",
    "Cancelled",
  ];
  const STAGE_LABELS: Record<string, string> = {
    NewLead: "New Lead",
    Contacted: "Contacted",
    Prospect: "Prospect",
    QuotationSent: "Quotation Sent",
    InNegotiation: "In Negotiation",
    ReadyToBook: "Ready to Book",
    PaymentAwaited: "Payment Awaited",
    BookingConfirmed: "Booking Confirmed",
    Lost: "Lost",
    Cancelled: "Cancelled",
  };
  const stageFunnel = STAGE_ORDER.map((s) => ({
    stage: s,
    count: allLeads.filter((l) => l.stage === s).length,
  })).filter((s) => s.count > 0);

  const exportCsv = (type: string) => {
    let csv = "";
    if (type === "destinations") {
      csv = "Destination,Lead Count,Total Budget (INR)\n";
      for (const [dest, budget] of Object.entries(revenueByDestination).sort(
        (a, b) => b[1] - a[1],
      )) {
        const count = allLeads.filter(
          (l) => (l.destination || "Unknown") === dest,
        ).length;
        csv += `"${dest}",${count},${budget}\n`;
      }
    } else if (type === "monthly") {
      csv = "Month,Lead Count\n";
      for (const [m, c] of Object.entries(monthlyLeadTrend)) {
        csv += `"${m}",${c}\n`;
      }
    } else if (type === "funnel") {
      csv = "Stage,Count\n";
      for (const s of stageFunnel) {
        csv += `"${STAGE_LABELS[s.stage] || s.stage}",${s.count}\n`;
      }
    }
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}_report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 mt-2">
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-gold" />
        <h3 className="text-lg font-display font-bold text-foreground">
          Custom Reports
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Destination */}
        <Card className="premium-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal" /> Revenue by Destination
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportCsv("destinations")}
                className="text-xs font-sans border-border/60 text-muted-foreground hover:text-foreground"
                data-ocid="analytics.destinations.export_button"
              >
                <Download className="w-3 h-3 mr-1" /> CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {Object.keys(revenueByDestination).length === 0 ? (
              <p className="text-sm text-muted-foreground font-sans text-center py-6">
                No data yet
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                      Destination
                    </TableHead>
                    <TableHead className="font-sans text-xs text-muted-foreground uppercase text-right">
                      Leads
                    </TableHead>
                    <TableHead className="font-sans text-xs text-muted-foreground uppercase text-right">
                      Budget
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(revenueByDestination)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 8)
                    .map(([dest, budget]) => (
                      <TableRow
                        key={dest}
                        className="border-border hover:bg-accent/20"
                      >
                        <TableCell className="font-sans text-sm text-foreground">
                          {dest}
                        </TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground text-right">
                          {
                            allLeads.filter(
                              (l) => (l.destination || "Unknown") === dest,
                            ).length
                          }
                        </TableCell>
                        <TableCell className="font-mono text-sm text-gold text-right">
                          ₹{budget.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Monthly Lead Trend */}
        <Card className="premium-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" /> Monthly Lead
                Trend
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportCsv("monthly")}
                className="text-xs font-sans border-border/60 text-muted-foreground hover:text-foreground"
                data-ocid="analytics.monthly.export_button"
              >
                <Download className="w-3 h-3 mr-1" /> CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {Object.keys(monthlyLeadTrend).length === 0 ? (
              <p className="text-sm text-muted-foreground font-sans text-center py-6">
                No data yet
              </p>
            ) : (
              <div className="space-y-2">
                {Object.entries(monthlyLeadTrend).map(([month, count]) => {
                  const max = Math.max(...Object.values(monthlyLeadTrend));
                  return (
                    <div key={month} className="flex items-center gap-3">
                      <span className="w-16 text-xs font-sans text-muted-foreground shrink-0">
                        {month}
                      </span>
                      <div className="flex-1 h-5 bg-card rounded overflow-hidden">
                        <div
                          className="h-full bg-blue-500 opacity-80 rounded flex items-center justify-end pr-2 transition-all"
                          style={{
                            width: `${(count / max) * 100}%`,
                            minWidth: "1.5rem",
                          }}
                        >
                          <span className="text-[10px] font-mono font-bold text-white">
                            {count}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stage Conversion Funnel */}
        <Card className="premium-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <Users2 className="w-4 h-4 text-purple-400" /> Stage Conversion
                Funnel
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportCsv("funnel")}
                className="text-xs font-sans border-border/60 text-muted-foreground hover:text-foreground"
                data-ocid="analytics.funnel.export_button"
              >
                <Download className="w-3 h-3 mr-1" /> CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {stageFunnel.length === 0 ? (
              <p className="text-sm text-muted-foreground font-sans text-center py-6">
                No data yet
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                      Stage
                    </TableHead>
                    <TableHead className="font-sans text-xs text-muted-foreground uppercase text-right">
                      Count
                    </TableHead>
                    <TableHead className="font-sans text-xs text-muted-foreground uppercase text-right">
                      %
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stageFunnel.map((s) => (
                    <TableRow
                      key={s.stage}
                      className="border-border hover:bg-accent/20"
                    >
                      <TableCell className="font-sans text-sm text-foreground">
                        {STAGE_LABELS[s.stage] || s.stage}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground text-right">
                        {s.count}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-gold text-right">
                        {allLeads.length > 0
                          ? Math.round((s.count / allLeads.length) * 100)
                          : 0}
                        %
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Pending Invoices */}
        <Card className="premium-card">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-red-400" /> Pending Invoices
              Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allInvoices.filter((i) => i.status !== "Paid").length === 0 ? (
              <p className="text-sm text-muted-foreground font-sans text-center py-6">
                All invoices paid 🎉
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                      Invoice
                    </TableHead>
                    <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                      Guest
                    </TableHead>
                    <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                      Status
                    </TableHead>
                    <TableHead className="font-sans text-xs text-muted-foreground uppercase text-right">
                      Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allInvoices
                    .filter((i) => i.status !== "Paid")
                    .slice(0, 6)
                    .map((inv) => (
                      <TableRow
                        key={String(inv.id)}
                        className="border-border hover:bg-accent/20"
                      >
                        <TableCell className="font-mono text-xs text-gold">
                          {inv.invoiceNumber}
                        </TableCell>
                        <TableCell className="font-sans text-sm text-foreground">
                          {inv.guestName}
                        </TableCell>
                        <TableCell className="font-sans text-xs text-amber-400">
                          {inv.status}
                        </TableCell>
                        <TableCell className="font-mono text-sm text-foreground text-right">
                          ₹{Number(inv.grandTotal).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
