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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Check, Eye, FileText, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Invoice, InvoiceLineItem } from "../backend.d.ts";
import {
  useCreateInvoice,
  useGetAllInvoices,
  useMarkInvoicePaid,
} from "../hooks/useQueries";

const STATUS_COLORS: Record<string, string> = {
  Draft: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  Sent: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Paid: "bg-green-500/20 text-green-400 border-green-500/30",
};

const defaultLineItem = { id: 0, description: "", qty: "1", unitPrice: "" };

export default function InvoicePage() {
  const { data: invoices = [], isLoading } = useGetAllInvoices();
  const { mutateAsync: createInvoice, isPending: isCreating } =
    useCreateInvoice();
  const { mutateAsync: markPaid } = useMarkInvoicePaid();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);
  const [guestName, setGuestName] = useState("");
  const [packageId] = useState("0");
  const [taxPercent, setTaxPercent] = useState("18");
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [lineItems, setLineItems] = useState([
    { ...defaultLineItem, id: Date.now() },
  ]);
  const [lineItemIdCounter, setLineItemIdCounter] = useState(1);

  const addLineItem = () => {
    const newId = lineItemIdCounter;
    setLineItemIdCounter((c) => c + 1);
    setLineItems((p) => [...p, { ...defaultLineItem, id: newId }]);
  };
  const removeLineItem = (i: number) =>
    setLineItems((p) => p.filter((_, idx) => idx !== i));
  const updateLineItem = (i: number, k: string, v: string) =>
    setLineItems((p) =>
      p.map((item, idx) => (idx === i ? { ...item, [k]: v } : item)),
    );

  const subtotal = lineItems.reduce(
    (sum, item) =>
      sum + (Number(item.qty) || 0) * (Number(item.unitPrice) || 0),
    0,
  );
  const taxAmount = (subtotal * (Number(taxPercent) || 0)) / 100;
  const grandTotal = subtotal + taxAmount;

  const handleCreate = async () => {
    if (!guestName.trim()) {
      toast.error("Guest name required");
      return;
    }
    if (lineItems.every((i) => !i.description.trim())) {
      toast.error("Add at least one line item");
      return;
    }
    try {
      const items: InvoiceLineItem[] = lineItems
        .filter((i) => i.description.trim())
        .map((i) => ({
          description: i.description,
          qty: BigInt(Math.round(Number(i.qty) || 1)),
          unitPrice: BigInt(Math.round(Number(i.unitPrice) || 0)),
          total: BigInt(
            Math.round((Number(i.qty) || 1) * (Number(i.unitPrice) || 0)),
          ),
        }));
      await createInvoice({
        packageId: BigInt(packageId || "0"),
        guestName,
        lineItems: items,
        subtotal: BigInt(Math.round(subtotal)),
        taxPercent: BigInt(Math.round(Number(taxPercent) || 0)),
        notes,
        dueDate: dueDate
          ? BigInt(new Date(dueDate).getTime() * 1_000_000)
          : BigInt(0),
      });
      toast.success("Invoice created!");
      setShowCreateModal(false);
      setGuestName("");
      setLineItems([{ ...defaultLineItem }]);
    } catch {
      toast.error("Failed to create invoice");
    }
  };

  const handleMarkPaid = async (id: bigint) => {
    try {
      await markPaid(id);
      toast.success("Invoice marked as paid!");
    } catch {
      toast.error("Failed to update");
    }
  };

  const formatDate = (ts: bigint) => {
    if (Number(ts) === 0) return "–";
    return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-sidebar border-b border-border px-4 py-5">
        <div className="container mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              <span className="text-gradient-gold">Invoices</span>
            </h2>
            <p className="text-sm text-muted-foreground font-sans mt-0.5">
              {invoices.length} total invoices
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="gradient-gold text-sidebar font-display font-bold shadow-gold"
          >
            <Plus className="w-4 h-4 mr-1" />
            Create Invoice
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : invoices.length === 0 ? (
          <Card className="premium-card">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="w-14 h-14 text-muted-foreground/20 mb-4" />
              <p className="text-muted-foreground font-sans">
                No invoices yet.
              </p>
              <Button
                onClick={() => setShowCreateModal(true)}
                variant="outline"
                size="sm"
                className="mt-3 border-gold/40 text-gold hover:bg-gold/10 font-sans"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Create first invoice
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
                      Invoice #
                    </TableHead>
                    <TableHead className="font-sans text-xs text-muted-foreground uppercase tracking-wide">
                      Guest
                    </TableHead>
                    <TableHead className="font-sans text-xs text-muted-foreground uppercase tracking-wide">
                      Issued
                    </TableHead>
                    <TableHead className="font-sans text-xs text-muted-foreground uppercase tracking-wide">
                      Grand Total
                    </TableHead>
                    <TableHead className="font-sans text-xs text-muted-foreground uppercase tracking-wide">
                      Status
                    </TableHead>
                    <TableHead className="font-sans text-xs text-muted-foreground uppercase tracking-wide w-24">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow
                      key={String(inv.id)}
                      className="border-border hover:bg-accent/20 transition-colors"
                    >
                      <TableCell className="font-mono text-xs text-gold">
                        {inv.invoiceNumber}
                      </TableCell>
                      <TableCell className="font-sans text-sm text-foreground">
                        {inv.guestName}
                      </TableCell>
                      <TableCell className="font-sans text-xs text-muted-foreground">
                        {formatDate(inv.issuedDate)}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-gold font-semibold">
                        ₹{Number(inv.grandTotal).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`text-xs border ${STATUS_COLORS[inv.status] ?? "border-border"}`}
                        >
                          {inv.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setViewInvoice(inv)}
                            className="text-muted-foreground hover:text-gold transition-colors"
                            title="View"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {inv.status !== "Paid" && (
                            <button
                              type="button"
                              onClick={() => handleMarkPaid(inv.id)}
                              className="text-muted-foreground hover:text-green-400 transition-colors"
                              title="Mark Paid"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
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

      {/* Create Invoice Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              Create Invoice
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-sans">Guest Name *</Label>
                <Input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="John Doe"
                  className="font-sans text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">Due Date</Label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="font-sans text-sm"
                />
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-sans">Line Items</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLineItem}
                  className="text-xs border-teal/40 text-teal hover:bg-teal/10 font-sans"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Item
                </Button>
              </div>
              <div className="space-y-2">
                {lineItems.map((item, i) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-2 items-center"
                  >
                    <div className="col-span-5">
                      <Input
                        value={item.description}
                        onChange={(e) =>
                          updateLineItem(i, "description", e.target.value)
                        }
                        placeholder="Description"
                        className="font-sans text-xs"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        value={item.qty}
                        onChange={(e) =>
                          updateLineItem(i, "qty", e.target.value)
                        }
                        placeholder="Qty"
                        className="font-sans text-xs"
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateLineItem(i, "unitPrice", e.target.value)
                        }
                        placeholder="Unit Price"
                        className="font-sans text-xs"
                      />
                    </div>
                    <div className="col-span-1 text-xs font-mono text-gold text-right">
                      ₹
                      {(
                        (Number(item.qty) || 0) * (Number(item.unitPrice) || 0)
                      ).toLocaleString()}
                    </div>
                    <div className="col-span-1 flex justify-end">
                      {lineItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLineItem(i)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-sans">Tax (%)</Label>
                <Input
                  type="number"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(e.target.value)}
                  placeholder="18"
                  className="font-sans text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={1}
                  className="font-sans text-sm resize-none"
                />
              </div>
            </div>

            {/* Totals */}
            <div className="bg-sidebar rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm font-sans">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground font-medium">
                  ₹{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm font-sans">
                <span className="text-muted-foreground">
                  Tax ({taxPercent}%)
                </span>
                <span className="text-foreground font-medium">
                  ₹{Math.round(taxAmount).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-base font-display font-bold pt-2 border-t border-border">
                <span className="text-foreground">Grand Total</span>
                <span className="text-gold">
                  ₹{Math.round(grandTotal).toLocaleString()}
                </span>
              </div>
            </div>

            <Button
              onClick={handleCreate}
              disabled={isCreating}
              className="w-full gradient-gold text-sidebar font-display font-bold"
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <FileText className="w-4 h-4 mr-2" />
              )}
              Create Invoice
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Invoice Modal */}
      <Dialog open={!!viewInvoice} onOpenChange={() => setViewInvoice(null)}>
        {viewInvoice && (
          <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-start justify-between">
                <DialogTitle className="font-display text-lg">
                  Invoice {viewInvoice.invoiceNumber}
                </DialogTitle>
                <Badge
                  className={`text-xs border ${STATUS_COLORS[viewInvoice.status] ?? "border-border"}`}
                >
                  {viewInvoice.status}
                </Badge>
              </div>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4 text-sm font-sans">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Bill To</p>
                  <p className="text-foreground font-semibold">
                    {viewInvoice.guestName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-1">
                    Issued Date
                  </p>
                  <p className="text-foreground">
                    {formatDate(viewInvoice.issuedDate)}
                  </p>
                  {Number(viewInvoice.dueDate) > 0 && (
                    <>
                      <p className="text-xs text-muted-foreground mt-1 mb-1">
                        Due Date
                      </p>
                      <p className="text-foreground">
                        {formatDate(viewInvoice.dueDate)}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="font-sans text-xs">
                      Description
                    </TableHead>
                    <TableHead className="font-sans text-xs text-right">
                      Qty
                    </TableHead>
                    <TableHead className="font-sans text-xs text-right">
                      Unit Price
                    </TableHead>
                    <TableHead className="font-sans text-xs text-right">
                      Total
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {viewInvoice.lineItems.map((item) => (
                    <TableRow key={item.description} className="border-border">
                      <TableCell className="font-sans text-sm text-foreground">
                        {item.description}
                      </TableCell>
                      <TableCell className="font-sans text-sm text-muted-foreground text-right">
                        {Number(item.qty)}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground text-right">
                        ₹{Number(item.unitPrice).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-foreground text-right">
                        ₹{Number(item.total).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="bg-sidebar rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm font-sans">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">
                    ₹{Number(viewInvoice.subtotal).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-sans">
                  <span className="text-muted-foreground">
                    Tax ({Number(viewInvoice.taxPercent)}%)
                  </span>
                  <span className="text-foreground">
                    ₹{Number(viewInvoice.taxAmount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-base font-display font-bold pt-2 border-t border-border">
                  <span className="text-foreground">Grand Total</span>
                  <span className="text-gold">
                    ₹{Number(viewInvoice.grandTotal).toLocaleString()}
                  </span>
                </div>
              </div>

              {viewInvoice.notes && (
                <p className="text-sm font-sans text-muted-foreground">
                  {viewInvoice.notes}
                </p>
              )}

              {viewInvoice.status !== "Paid" && (
                <Button
                  onClick={() => {
                    handleMarkPaid(viewInvoice.id);
                    setViewInvoice(null);
                  }}
                  className="w-full font-sans bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Mark as Paid
                </Button>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
