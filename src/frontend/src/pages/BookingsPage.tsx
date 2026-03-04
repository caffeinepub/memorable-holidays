import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarCheck,
  ChevronDown,
  ChevronRight,
  Edit,
  History,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import React from "react";
import { useState } from "react";
import { toast } from "sonner";
import type { Booking } from "../backend.d.ts";

// ── Amendment store (localStorage) ───────────────────────────────────────────

interface Amendment {
  id: string;
  date: number;
  description: string;
  newAmount: number | null;
  reason: string;
}

function getAmendments(bookingId: string): Amendment[] {
  try {
    const stored = localStorage.getItem(`mh_booking_amendments_${bookingId}`);
    if (stored) return JSON.parse(stored) as Amendment[];
  } catch {}
  return [];
}

function saveAmendments(bookingId: string, amendments: Amendment[]): void {
  try {
    localStorage.setItem(
      `mh_booking_amendments_${bookingId}`,
      JSON.stringify(amendments),
    );
  } catch {}
}
import {
  useCreateBooking,
  useDeleteBooking,
  useGetBookings,
  useUpdateBooking,
} from "../hooks/useQueries";

const BOOKING_TYPES = [
  "Hotel",
  "Flight",
  "Sightseeing",
  "Vehicle",
  "Cruise",
  "Activity",
  "Other",
];
const STATUS_COLORS: Record<string, string> = {
  Confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
  Pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  Amended: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const defaultForm = {
  packageId: "0",
  bookingType: "Hotel",
  vendorName: "",
  bookingRef: "",
  checkIn: "",
  checkOut: "",
  amount: "",
  notes: "",
};

export default function BookingsPage() {
  const { data: bookings = [], isLoading } = useGetBookings();
  const { mutateAsync: createBooking, isPending: isCreating } =
    useCreateBooking();
  const { mutateAsync: updateBooking, isPending: isUpdating } =
    useUpdateBooking();
  const { mutateAsync: deleteBooking } = useDeleteBooking();

  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [form, setForm] = useState(defaultForm);

  // Amendment state
  const [amendBooking, setAmendBooking] = useState<Booking | null>(null);
  const [amendDesc, setAmendDesc] = useState("");
  const [amendAmount, setAmendAmount] = useState("");
  const [amendReason, setAmendReason] = useState("");
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(
    null,
  );
  const [amendVersion, setAmendVersion] = useState(0);

  const update = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const openCreate = () => {
    setEditingBooking(null);
    setForm(defaultForm);
    setShowModal(true);
  };
  const openEdit = (b: Booking) => {
    setEditingBooking(b);
    setForm({
      packageId: String(b.packageId),
      bookingType: b.bookingType,
      vendorName: b.vendorName,
      bookingRef: b.bookingRef,
      checkIn: b.checkIn,
      checkOut: b.checkOut,
      amount: String(Number(b.amount)),
      notes: b.notes,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.vendorName.trim()) {
      toast.error("Vendor name is required");
      return;
    }
    try {
      if (editingBooking) {
        await updateBooking({
          ...editingBooking,
          bookingType: form.bookingType,
          vendorName: form.vendorName,
          bookingRef: form.bookingRef,
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          amount: BigInt(Math.round(Number(form.amount) || 0)),
          notes: form.notes,
        });
        toast.success("Booking updated!");
      } else {
        await createBooking({
          packageId: BigInt(form.packageId || "0"),
          bookingType: form.bookingType,
          vendorName: form.vendorName,
          bookingRef: form.bookingRef,
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          amount: BigInt(Math.round(Number(form.amount) || 0)),
          notes: form.notes,
        });
        toast.success("Booking created!");
      }
      setShowModal(false);
      setForm(defaultForm);
    } catch {
      toast.error("Failed to save booking");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteBooking(id);
      toast.success("Booking deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleSaveAmendment = () => {
    if (!amendBooking || !amendDesc.trim()) {
      toast.error("Description required");
      return;
    }
    const id = String(amendBooking.id);
    const existing = getAmendments(id);
    const newAmendment: Amendment = {
      id: `${Date.now()}`,
      date: Date.now(),
      description: amendDesc,
      newAmount: amendAmount ? Number(amendAmount) : null,
      reason: amendReason,
    };
    saveAmendments(id, [...existing, newAmendment]);
    toast.success("Amendment logged");
    setAmendBooking(null);
    setAmendDesc("");
    setAmendAmount("");
    setAmendReason("");
    setAmendVersion((r) => r + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-sidebar border-b border-border px-4 py-5">
        <div className="container mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              <span className="text-gradient-gold">Bookings</span>
            </h2>
            <p className="text-sm text-muted-foreground font-sans mt-0.5">
              {bookings.length} total bookings
            </p>
          </div>
          <Button
            onClick={openCreate}
            className="gradient-gold text-sidebar font-display font-bold shadow-gold"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Booking
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : bookings.length === 0 ? (
          <Card className="premium-card">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <CalendarCheck className="w-14 h-14 text-muted-foreground/20 mb-4" />
              <p className="text-muted-foreground font-sans">
                No bookings yet.
              </p>
              <Button
                onClick={openCreate}
                variant="outline"
                size="sm"
                className="mt-3 border-gold/40 text-gold hover:bg-gold/10 font-sans"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Create first booking
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="premium-card overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="font-sans text-xs text-muted-foreground uppercase tracking-wide">
                      ID
                    </TableHead>
                    <TableHead className="font-sans text-xs text-muted-foreground uppercase tracking-wide">
                      Type
                    </TableHead>
                    <TableHead className="font-sans text-xs text-muted-foreground uppercase tracking-wide">
                      Vendor
                    </TableHead>
                    <TableHead className="font-sans text-xs text-muted-foreground uppercase tracking-wide">
                      Ref#
                    </TableHead>
                    <TableHead className="font-sans text-xs text-muted-foreground uppercase tracking-wide">
                      Check-in
                    </TableHead>
                    <TableHead className="font-sans text-xs text-muted-foreground uppercase tracking-wide">
                      Check-out
                    </TableHead>
                    <TableHead className="font-sans text-xs text-muted-foreground uppercase tracking-wide">
                      Amount
                    </TableHead>
                    <TableHead className="font-sans text-xs text-muted-foreground uppercase tracking-wide">
                      Status
                    </TableHead>
                    <TableHead className="font-sans text-xs text-muted-foreground uppercase tracking-wide w-28">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody key={amendVersion}>
                  {bookings.map((b) => {
                    const bId = String(b.id);
                    const amendments = getAmendments(bId);
                    const isExpanded = expandedBookingId === bId;
                    return (
                      <React.Fragment key={bId}>
                        <TableRow
                          className="border-border hover:bg-accent/20 transition-colors"
                          data-ocid={`bookings.row.${bId}`}
                        >
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedBookingId(isExpanded ? null : bId)
                              }
                              className="flex items-center gap-1 hover:text-gold transition-colors"
                            >
                              {amendments.length > 0 &&
                                (isExpanded ? (
                                  <ChevronDown className="w-3 h-3" />
                                ) : (
                                  <ChevronRight className="w-3 h-3" />
                                ))}
                              #{bId}
                              {amendments.length > 0 && (
                                <span className="ml-1 text-[10px] text-gold bg-gold/10 border border-gold/30 rounded-full px-1">
                                  {amendments.length}
                                </span>
                              )}
                            </button>
                          </TableCell>
                          <TableCell>
                            <Badge className="text-xs border border-teal/30 bg-teal/10 text-teal">
                              {b.bookingType}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-sans text-sm text-foreground">
                            {b.vendorName}
                          </TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {b.bookingRef || "–"}
                          </TableCell>
                          <TableCell className="font-sans text-xs text-foreground">
                            {b.checkIn || "–"}
                          </TableCell>
                          <TableCell className="font-sans text-xs text-foreground">
                            {b.checkOut || "–"}
                          </TableCell>
                          <TableCell className="font-mono text-sm text-gold font-semibold">
                            {Number(b.amount) > 0
                              ? `₹${Number(b.amount).toLocaleString()}`
                              : "–"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`text-xs border ${STATUS_COLORS[b.status] ?? "border-border bg-muted text-muted-foreground"}`}
                            >
                              {b.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => openEdit(b)}
                                className="text-muted-foreground hover:text-gold transition-colors"
                                data-ocid={`bookings.edit_button.${bId}`}
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setAmendBooking(b);
                                  setAmendDesc("");
                                  setAmendAmount("");
                                  setAmendReason("");
                                }}
                                className="text-muted-foreground hover:text-blue-400 transition-colors"
                                title="Amend"
                                data-ocid={`bookings.amend_button.${bId}`}
                              >
                                <History className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(b.id)}
                                className="text-muted-foreground hover:text-destructive transition-colors"
                                data-ocid={`bookings.delete_button.${bId}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                        {isExpanded && amendments.length > 0 && (
                          <TableRow className="border-border bg-sidebar/40">
                            <TableCell colSpan={9} className="py-3 px-6">
                              <p className="text-xs font-sans font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
                                <History className="w-3 h-3" /> Amendment
                                History
                              </p>
                              <div className="space-y-2">
                                {amendments.map((a) => (
                                  <div
                                    key={a.id}
                                    className="bg-card border border-border/50 rounded-lg p-2.5 text-xs font-sans"
                                  >
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-semibold text-foreground">
                                        {a.description}
                                      </span>
                                      <span className="text-muted-foreground">
                                        {new Date(a.date).toLocaleString()}
                                      </span>
                                    </div>
                                    {a.newAmount && (
                                      <span className="text-gold font-mono">
                                        New Amount: ₹
                                        {a.newAmount.toLocaleString()}
                                      </span>
                                    )}
                                    {a.reason && (
                                      <p className="text-muted-foreground mt-0.5">
                                        {a.reason}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </div>

      {/* Amendment Dialog */}
      <Dialog
        open={!!amendBooking}
        onOpenChange={(o) => !o && setAmendBooking(null)}
      >
        <DialogContent
          className="bg-card border-border max-w-md"
          data-ocid="bookings.amend.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-lg flex items-center gap-2">
              <History className="w-4 h-4 text-blue-400" />
              Log Amendment
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1">
              <Label className="text-xs font-sans">What Changed *</Label>
              <Input
                value={amendDesc}
                onChange={(e) => setAmendDesc(e.target.value)}
                placeholder="e.g. Hotel changed from Paradise to Grand"
                className="font-sans text-sm"
                data-ocid="bookings.amend.input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-sans">
                New Amount (₹) — leave blank if unchanged
              </Label>
              <Input
                type="number"
                value={amendAmount}
                onChange={(e) => setAmendAmount(e.target.value)}
                placeholder="Leave blank if no change"
                className="font-sans text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-sans">Reason</Label>
              <Textarea
                value={amendReason}
                onChange={(e) => setAmendReason(e.target.value)}
                placeholder="Guest requested change..."
                rows={2}
                className="font-sans text-sm resize-none"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setAmendBooking(null)}
                className="flex-1 font-sans"
                data-ocid="bookings.amend.cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveAmendment}
                className="flex-1 gradient-gold text-sidebar font-sans shadow-gold"
                data-ocid="bookings.amend.save_button"
              >
                Save Amendment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              {editingBooking ? "Edit Booking" : "Add Booking"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-sans">Type</Label>
                <Select
                  value={form.bookingType}
                  onValueChange={(v) => update("bookingType", v)}
                >
                  <SelectTrigger className="font-sans text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BOOKING_TYPES.map((t) => (
                      <SelectItem
                        key={t}
                        value={t}
                        className="font-sans text-sm"
                      >
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">Vendor Name *</Label>
                <Input
                  value={form.vendorName}
                  onChange={(e) => update("vendorName", e.target.value)}
                  placeholder="Hotel Paradise"
                  className="font-sans text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-sans">Booking Ref#</Label>
                <Input
                  value={form.bookingRef}
                  onChange={(e) => update("bookingRef", e.target.value)}
                  placeholder="BK-2024-001"
                  className="font-sans text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">Amount (₹)</Label>
                <Input
                  type="number"
                  value={form.amount}
                  onChange={(e) => update("amount", e.target.value)}
                  placeholder="10000"
                  className="font-sans text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-sans">Check-in</Label>
                <Input
                  value={form.checkIn}
                  onChange={(e) => update("checkIn", e.target.value)}
                  placeholder="2026-01-15"
                  className="font-sans text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">Check-out</Label>
                <Input
                  value={form.checkOut}
                  onChange={(e) => update("checkOut", e.target.value)}
                  placeholder="2026-01-20"
                  className="font-sans text-sm"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-sans">Notes</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                placeholder="Any additional notes..."
                rows={2}
                className="font-sans text-sm resize-none"
              />
            </div>
            <Button
              onClick={handleSave}
              disabled={isCreating || isUpdating}
              className="w-full gradient-gold text-sidebar font-display font-bold"
            >
              {isCreating || isUpdating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              {editingBooking ? "Update Booking" : "Create Booking"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
