import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import {
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  Search,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { GuestDetails } from "../backend";
import {
  useAddOrUpdateCustomer,
  useGetGuestRecords,
} from "../hooks/useQueries";

const emptyGuest: GuestDetails = {
  name: "",
  contactNumber: "",
  email: "",
  whatsapp: "",
  adults: BigInt(2),
  children: BigInt(0),
  travelDates: "",
  notes: "",
};

export default function CustomerDatabasePage() {
  const navigate = useNavigate();
  const { data: customers = [], isLoading } = useGetGuestRecords();
  const { mutateAsync: saveCustomer, isPending: isSaving } =
    useAddOrUpdateCustomer();

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<GuestDetails>(emptyGuest);

  const filtered = customers.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.contactNumber.includes(search),
  );

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Customer name is required");
      return;
    }
    try {
      await saveCustomer(formData);
      toast.success("Customer saved!");
      setShowForm(false);
      setFormData(emptyGuest);
    } catch {
      toast.error("Failed to save customer");
    }
  };

  const handleEdit = (customer: GuestDetails) => {
    setFormData(customer);
    setShowForm(true);
  };

  const handleViewDetail = (name: string) => {
    navigate({
      to: "/customers/$customerName",
      params: { customerName: encodeURIComponent(name) },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground">
            Customer Database
          </h2>
          <p className="text-sm text-muted-foreground font-sans">
            {customers.length} customer{customers.length !== 1 ? "s" : ""} on
            record
          </p>
        </div>
        <Button
          onClick={() => {
            setFormData(emptyGuest);
            setShowForm(true);
          }}
          className="font-sans bg-teal hover:bg-teal-dark text-white"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Customer
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or phone..."
          className="pl-9 font-sans"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-teal" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground font-sans">
            {customers.length === 0
              ? "No customers yet. Add your first customer!"
              : "No customers match your search."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((customer) => (
            <Card
              key={customer.name}
              className="premium-card cursor-pointer hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-teal/10 border border-teal/30 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-teal" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-semibold text-foreground truncate">
                      {customer.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-sans">
                      {Number(customer.adults)} Adults ·{" "}
                      {Number(customer.children)} Children
                    </p>
                  </div>
                </div>

                <div className="space-y-1 mb-4">
                  {customer.contactNumber && (
                    <p className="text-xs text-muted-foreground font-sans flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {customer.contactNumber}
                    </p>
                  )}
                  {customer.email && (
                    <p className="text-xs text-muted-foreground font-sans flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {customer.email}
                    </p>
                  )}
                  {customer.whatsapp && (
                    <p className="text-xs text-muted-foreground font-sans flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" /> {customer.whatsapp}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-3 border-t border-border">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewDetail(customer.name)}
                    className="flex-1 font-sans text-xs"
                  >
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(customer)}
                    className="flex-1 font-sans text-xs border-teal text-teal hover:bg-teal/10"
                  >
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {formData.name ? "Edit Customer" : "Add New Customer"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-2">
            <div className="col-span-2 space-y-1">
              <Label className="font-sans text-xs">Full Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Customer full name"
                className="font-sans text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="font-sans text-xs">Phone Number</Label>
              <Input
                value={formData.contactNumber}
                onChange={(e) =>
                  setFormData({ ...formData, contactNumber: e.target.value })
                }
                placeholder="+91 XXXXX XXXXX"
                className="font-sans text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="font-sans text-xs">WhatsApp</Label>
              <Input
                value={formData.whatsapp}
                onChange={(e) =>
                  setFormData({ ...formData, whatsapp: e.target.value })
                }
                placeholder="+91 XXXXX XXXXX"
                className="font-sans text-sm"
              />
            </div>
            <div className="col-span-2 space-y-1">
              <Label className="font-sans text-xs">Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="customer@email.com"
                className="font-sans text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="font-sans text-xs">Adults</Label>
              <Input
                type="number"
                min={1}
                value={Number(formData.adults)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    adults: BigInt(Number.parseInt(e.target.value) || 1),
                  })
                }
                className="font-sans text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="font-sans text-xs">Children</Label>
              <Input
                type="number"
                min={0}
                value={Number(formData.children)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    children: BigInt(Number.parseInt(e.target.value) || 0),
                  })
                }
                className="font-sans text-sm"
              />
            </div>
            <div className="col-span-2 space-y-1">
              <Label className="font-sans text-xs">Travel Dates</Label>
              <Input
                value={formData.travelDates}
                onChange={(e) =>
                  setFormData({ ...formData, travelDates: e.target.value })
                }
                placeholder="e.g. 15 Mar – 22 Mar 2026"
                className="font-sans text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              className="font-sans"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="font-sans bg-teal hover:bg-teal-dark text-white"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : null}
              Save Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
