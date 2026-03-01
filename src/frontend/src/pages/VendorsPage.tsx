import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  Edit,
  Loader2,
  Mail,
  Phone,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Vendor } from "../backend.d.ts";
import {
  useCreateVendor,
  useDeleteVendor,
  useGetVendors,
  useUpdateVendor,
} from "../hooks/useQueries";

const VENDOR_TYPES = [
  "Hotel",
  "Airline",
  "Transport",
  "Activity",
  "Cruise",
  "Other",
];
const TYPE_COLORS: Record<string, string> = {
  Hotel: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Airline: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Transport: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Activity: "bg-teal-500/20 text-teal-400 border-teal-500/30",
  Cruise: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  Other: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const defaultForm = {
  name: "",
  vendorType: "Hotel",
  contactName: "",
  phone: "",
  email: "",
  commissionRate: "",
  notes: "",
};

export default function VendorsPage() {
  const { data: vendors = [], isLoading } = useGetVendors();
  const { mutateAsync: createVendor, isPending: isCreating } =
    useCreateVendor();
  const { mutateAsync: updateVendor, isPending: isUpdating } =
    useUpdateVendor();
  const { mutateAsync: deleteVendor } = useDeleteVendor();

  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [form, setForm] = useState(defaultForm);

  const update = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const openCreate = () => {
    setEditingVendor(null);
    setForm(defaultForm);
    setShowModal(true);
  };
  const openEdit = (v: Vendor) => {
    setEditingVendor(v);
    setForm({
      name: v.name,
      vendorType: v.vendorType,
      contactName: v.contactName,
      phone: v.phone,
      email: v.email,
      commissionRate: String(Number(v.commissionRate)),
      notes: v.notes,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Vendor name is required");
      return;
    }
    try {
      if (editingVendor) {
        await updateVendor({
          ...editingVendor,
          name: form.name,
          vendorType: form.vendorType,
          contactName: form.contactName,
          phone: form.phone,
          email: form.email,
          commissionRate: BigInt(Math.round(Number(form.commissionRate) || 0)),
          notes: form.notes,
        });
        toast.success("Vendor updated!");
      } else {
        await createVendor({
          name: form.name,
          vendorType: form.vendorType,
          contactName: form.contactName,
          phone: form.phone,
          email: form.email,
          commissionRate: BigInt(Math.round(Number(form.commissionRate) || 0)),
          notes: form.notes,
        });
        toast.success("Vendor created!");
      }
      setShowModal(false);
      setForm(defaultForm);
    } catch {
      toast.error("Failed to save vendor");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteVendor(id);
      toast.success("Vendor deleted");
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
              <span className="text-gradient-gold">Vendors</span>
            </h2>
            <p className="text-sm text-muted-foreground font-sans mt-0.5">
              {vendors.length} registered vendors
            </p>
          </div>
          <Button
            onClick={openCreate}
            className="gradient-gold text-sidebar font-display font-bold shadow-gold"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Vendor
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : vendors.length === 0 ? (
          <Card className="premium-card">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Building2 className="w-14 h-14 text-muted-foreground/20 mb-4" />
              <p className="text-muted-foreground font-sans">No vendors yet.</p>
              <Button
                onClick={openCreate}
                variant="outline"
                size="sm"
                className="mt-3 border-gold/40 text-gold hover:bg-gold/10 font-sans"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add first vendor
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendors.map((vendor) => (
              <Card
                key={String(vendor.id)}
                className="premium-card hover:border-gold/30 transition-all group"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-foreground truncate">
                        {vendor.name}
                      </h3>
                      <Badge
                        className={`mt-1 text-xs border ${TYPE_COLORS[vendor.vendorType] ?? "border-border"}`}
                      >
                        {vendor.vendorType}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => openEdit(vendor)}
                        className="text-muted-foreground hover:text-gold transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(vendor.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  {vendor.contactName && (
                    <p className="text-sm font-sans text-foreground">
                      {vendor.contactName}
                    </p>
                  )}
                  {vendor.phone && (
                    <div className="flex items-center gap-2 text-sm font-sans text-muted-foreground">
                      <Phone className="w-3.5 h-3.5 text-teal" />
                      {vendor.phone}
                    </div>
                  )}
                  {vendor.email && (
                    <div className="flex items-center gap-2 text-sm font-sans text-muted-foreground truncate">
                      <Mail className="w-3.5 h-3.5 text-teal" />
                      <span className="truncate">{vendor.email}</span>
                    </div>
                  )}
                  {Number(vendor.commissionRate) > 0 && (
                    <div className="pt-2 border-t border-border">
                      <span className="text-xs text-muted-foreground font-sans">
                        Commission:{" "}
                      </span>
                      <span className="text-sm font-mono text-gold font-semibold">
                        {Number(vendor.commissionRate)}%
                      </span>
                    </div>
                  )}
                  {vendor.notes && (
                    <p className="text-xs text-muted-foreground font-sans line-clamp-2">
                      {vendor.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              {editingVendor ? "Edit Vendor" : "Add Vendor"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-sans">Vendor Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Hotel Sunshine"
                  className="font-sans text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">Type</Label>
                <Select
                  value={form.vendorType}
                  onValueChange={(v) => update("vendorType", v)}
                >
                  <SelectTrigger className="font-sans text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VENDOR_TYPES.map((t) => (
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
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-sans">Contact Name</Label>
                <Input
                  value={form.contactName}
                  onChange={(e) => update("contactName", e.target.value)}
                  placeholder="Rajesh Kumar"
                  className="font-sans text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                  className="font-sans text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-sans">Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="vendor@example.com"
                  className="font-sans text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">Commission (%)</Label>
                <Input
                  type="number"
                  value={form.commissionRate}
                  onChange={(e) => update("commissionRate", e.target.value)}
                  placeholder="10"
                  className="font-sans text-sm"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-sans">Notes</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                placeholder="Additional details..."
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
              {editingVendor ? "Update Vendor" : "Add Vendor"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
