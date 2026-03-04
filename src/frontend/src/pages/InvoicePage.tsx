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
import {
  Check,
  Eye,
  FileText,
  Loader2,
  Plus,
  Printer,
  Receipt,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Invoice, InvoiceLineItem } from "../backend.d.ts";
import {
  useCreateInvoice,
  useGetAllInvoices,
  useGetCompanySettings,
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
  const { data: companySettings } = useGetCompanySettings();
  const { mutateAsync: createInvoice, isPending: isCreating } =
    useCreateInvoice();
  const { mutateAsync: markPaid } = useMarkInvoicePaid();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);
  const [receiptInvoice, setReceiptInvoice] = useState<Invoice | null>(null);
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

  const handlePrintInvoice = (inv: Invoice) => {
    const companyName = companySettings?.companyName || "Memorable Holidays";
    const companyAddress = companySettings?.address || "";
    const companyPhone = companySettings?.phone || "";
    const companyEmail = companySettings?.email || "";
    const companyGST = companySettings?.gstNumber || "";

    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;

    const rows = inv.lineItems
      .map(
        (item) =>
          `<tr style="border-bottom:1px solid #e5e7eb">
            <td style="padding:8px 12px;font-size:13px">${item.description}</td>
            <td style="padding:8px 12px;text-align:center;font-size:13px">${Number(item.qty)}</td>
            <td style="padding:8px 12px;text-align:right;font-size:13px">₹${Number(item.unitPrice).toLocaleString()}</td>
            <td style="padding:8px 12px;text-align:right;font-size:13px;font-weight:600">₹${Number(item.total).toLocaleString()}</td>
          </tr>`,
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${inv.invoiceNumber}</title>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 24px; color: #111; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
          .company-name { font-size: 22px; font-weight: 700; color: #1a1a2e; }
          .company-details { font-size: 12px; color: #555; margin-top: 4px; }
          .invoice-title { font-size: 28px; font-weight: 700; color: #c9a227; text-align: right; }
          .invoice-meta { font-size: 12px; color: #555; text-align: right; margin-top: 4px; }
          .divider { border: none; border-top: 2px solid #c9a227; margin: 16px 0; }
          .bill-to { background: #f9f9f9; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; }
          thead tr { background: #1a1a2e; color: white; }
          thead th { padding: 10px 12px; text-align: left; font-size: 12px; text-transform: uppercase; }
          .totals { margin-top: 16px; float: right; width: 280px; }
          .totals table { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
          .totals td { padding: 8px 12px; font-size: 13px; }
          .grand-total { background: #c9a227; color: white; font-weight: 700; font-size: 15px; }
          .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; }
          .status-paid { background: #d1fae5; color: #065f46; }
          .status-draft { background: #f3f4f6; color: #374151; }
          .status-sent { background: #dbeafe; color: #1e40af; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="company-name">${companyName}</div>
            <div class="company-details">
              ${companyAddress ? `${companyAddress}<br>` : ""}
              ${companyPhone ? `📞 ${companyPhone}` : ""}
              ${companyEmail ? ` | ✉️ ${companyEmail}` : ""}
              ${companyGST ? `<br>GST: ${companyGST}` : ""}
            </div>
          </div>
          <div>
            <div class="invoice-title">INVOICE</div>
            <div class="invoice-meta">
              <strong>#${inv.invoiceNumber}</strong><br>
              Issued: ${formatDate(inv.issuedDate)}<br>
              ${Number(inv.dueDate) > 0 ? `Due: ${formatDate(inv.dueDate)}<br>` : ""}
              <span class="status-badge status-${inv.status.toLowerCase()}">${inv.status}</span>
            </div>
          </div>
        </div>
        <hr class="divider">
        <div class="bill-to">
          <strong>Bill To:</strong><br>
          <span style="font-size:16px;font-weight:600">${inv.guestName}</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align:center">Qty</th>
              <th style="text-align:right">Unit Price</th>
              <th style="text-align:right">Total</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="totals">
          <table>
            <tr><td>Subtotal</td><td style="text-align:right">₹${Number(inv.subtotal).toLocaleString()}</td></tr>
            <tr><td>Tax (${Number(inv.taxPercent)}%)</td><td style="text-align:right">₹${Number(inv.taxAmount).toLocaleString()}</td></tr>
            <tr class="grand-total"><td><strong>Grand Total</strong></td><td style="text-align:right"><strong>₹${Number(inv.grandTotal).toLocaleString()}</strong></td></tr>
          </table>
        </div>
        ${inv.notes ? `<div style="clear:both;margin-top:32px;padding:12px;background:#f9f9f9;border-radius:8px;font-size:12px;color:#555"><strong>Notes:</strong> ${inv.notes}</div>` : ""}
        <script>window.onload = function(){ window.print(); window.close(); }</script>
      </body>
      </html>
    `);
    printWindow.document.close();
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
                            data-ocid="invoices.view.button"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {inv.status === "Paid" && (
                            <button
                              type="button"
                              onClick={() => setReceiptInvoice(inv)}
                              className="text-muted-foreground hover:text-green-400 transition-colors"
                              title="View Receipt"
                              data-ocid="invoices.receipt.button"
                            >
                              <Receipt className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {inv.status !== "Paid" && (
                            <button
                              type="button"
                              onClick={() => handleMarkPaid(inv.id)}
                              className="text-muted-foreground hover:text-green-400 transition-colors"
                              title="Mark as Paid"
                              data-ocid="invoices.markpaid.button"
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

      {/* Receipt Dialog */}
      <Dialog
        open={!!receiptInvoice}
        onOpenChange={() => setReceiptInvoice(null)}
      >
        {receiptInvoice && (
          <DialogContent
            className="bg-card border-border max-w-md"
            data-ocid="invoices.receipt.dialog"
          >
            <DialogHeader>
              <DialogTitle className="font-display text-lg text-foreground flex items-center gap-2">
                <Receipt className="w-5 h-5 text-gold" />
                Payment Receipt
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="bg-sidebar rounded-xl p-4 border border-green-500/20">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-display font-bold text-lg text-foreground">
                      {companySettings?.companyName || "Memorable Holidays"}
                    </p>
                    {companySettings?.address && (
                      <p className="text-xs text-muted-foreground font-sans">
                        {companySettings.address}
                      </p>
                    )}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-400" />
                  </div>
                </div>
                <div className="border-t border-border pt-3 space-y-2 text-sm font-sans">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Receipt No.</span>
                    <span className="font-mono text-gold">
                      REC-{receiptInvoice.invoiceNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Invoice No.</span>
                    <span className="font-mono text-foreground">
                      {receiptInvoice.invoiceNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Guest</span>
                    <span className="text-foreground font-semibold">
                      {receiptInvoice.guestName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Issue Date</span>
                    <span className="text-foreground">
                      {formatDate(receiptInvoice.issuedDate)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2 mt-2">
                    <span className="font-semibold text-foreground">
                      Amount Paid
                    </span>
                    <span className="font-display font-bold text-green-400 text-lg">
                      ₹{Number(receiptInvoice.grandTotal).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-3 py-1 text-xs font-sans font-semibold">
                    <Check className="w-3 h-3" /> PAID
                  </span>
                </div>
              </div>
              <Button
                onClick={() => {
                  const w = window.open("", "_blank", "width=500,height=600");
                  if (!w) return;
                  w.document.write(
                    `<!DOCTYPE html><html><head><title>Receipt REC-${receiptInvoice.invoiceNumber}</title><style>body{font-family:Arial,sans-serif;padding:24px;color:#111;max-width:480px;margin:0 auto}.header{text-align:center;margin-bottom:20px}.co-name{font-size:20px;font-weight:700}.rec-num{font-size:14px;color:#666;margin-top:4px}.paid-badge{background:#d1fae5;color:#065f46;padding:4px 16px;border-radius:20px;font-size:12px;font-weight:700;display:inline-block;margin:8px 0}.row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee;font-size:13px}.total-row{display:flex;justify-content:space-between;padding:10px 0;font-size:16px;font-weight:700}@media print{body{padding:0}}</style></head><body><div class="header"><div class="co-name">${companySettings?.companyName || "Memorable Holidays"}</div><div class="rec-num">Receipt No: REC-${receiptInvoice.invoiceNumber}</div><div class="paid-badge">✓ PAID</div></div><div class="row"><span>Guest</span><span><b>${receiptInvoice.guestName}</b></span></div><div class="row"><span>Invoice</span><span>${receiptInvoice.invoiceNumber}</span></div><div class="row"><span>Date</span><span>${formatDate(receiptInvoice.issuedDate)}</span></div><div class="total-row"><span>Amount Paid</span><span style="color:#059669">₹${Number(receiptInvoice.grandTotal).toLocaleString()}</span></div><script>window.onload=function(){window.print();window.close()}<\/script></body></html>`,
                  );
                  w.document.close();
                }}
                className="w-full font-sans border-border/60 text-foreground hover:border-border"
                variant="outline"
                data-ocid="invoices.receipt.print_button"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Receipt
              </Button>
            </div>
          </DialogContent>
        )}
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

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePrintInvoice(viewInvoice)}
                  className="flex-1 font-sans border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print Invoice
                </Button>
                {viewInvoice.status !== "Paid" && (
                  <Button
                    onClick={() => {
                      handleMarkPaid(viewInvoice.id);
                      setViewInvoice(null);
                    }}
                    className="flex-1 font-sans bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Mark as Paid
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
