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
import { CalendarCheck, Edit, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Booking } from "../backend.d.ts";
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
                    <TableHead className="font-sans text-xs text-muted-foreground uppercase tracking-wide w-20">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((b) => (
                    <TableRow
                      key={String(b.id)}
                      className="border-border hover:bg-accent/20 transition-colors"
                    >
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        #{String(b.id)}
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
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(b.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </div>

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
