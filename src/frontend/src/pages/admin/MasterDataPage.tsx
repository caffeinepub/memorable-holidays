import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Database,
  Edit,
  Hotel,
  MapPin,
  Plane,
  Plus,
  Tag,
  Trash2,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type {
  Activity,
  Addon,
  Airline,
  Destination,
  Hotel as HotelType,
  Vehicle,
} from "../../lib/masterDataStore";
import { masterDataStore } from "../../lib/masterDataStore";

// ── Destinations Tab ──────────────────────────────────────────────────────────

function DestinationsTab() {
  const [data, setData] = useState(() => masterDataStore.get().destinations);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<Destination | null>(null);
  const [form, setForm] = useState({
    name: "",
    country: "",
    description: "",
    popularMonths: "",
    highlights: "",
  });

  const openAdd = () => {
    setEditing(null);
    setForm({
      name: "",
      country: "",
      description: "",
      popularMonths: "",
      highlights: "",
    });
    setShowDialog(true);
  };

  const openEdit = (item: Destination) => {
    setEditing(item);
    setForm({
      name: item.name,
      country: item.country,
      description: item.description,
      popularMonths: item.popularMonths,
      highlights: item.highlights,
    });
    setShowDialog(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (editing) {
      masterDataStore.updateDestination(editing.id, form);
      toast.success("Destination updated");
    } else {
      masterDataStore.addDestination(form);
      toast.success("Destination added");
    }
    setData(masterDataStore.get().destinations);
    setShowDialog(false);
  };

  const handleDelete = (id: string) => {
    masterDataStore.deleteDestination(id);
    setData(masterDataStore.get().destinations);
    toast.success("Deleted");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground font-sans">
          {data.length} destinations
        </p>
        <Button
          onClick={openAdd}
          size="sm"
          className="gradient-gold text-sidebar font-sans shadow-gold"
          data-ocid="masterdata.destination.button"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Destination
        </Button>
      </div>
      <Card className="premium-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                Name
              </TableHead>
              <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                Country
              </TableHead>
              <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                Popular Months
              </TableHead>
              <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                Highlights
              </TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-muted-foreground font-sans text-sm"
                  data-ocid="masterdata.destination.empty_state"
                >
                  No destinations yet
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, idx) => (
                <TableRow
                  key={item.id}
                  className="border-border hover:bg-accent/20"
                  data-ocid={`masterdata.destination.row.${idx + 1}`}
                >
                  <TableCell className="font-sans font-semibold text-foreground">
                    {item.name}
                  </TableCell>
                  <TableCell className="font-sans text-sm text-muted-foreground">
                    {item.country}
                  </TableCell>
                  <TableCell className="font-sans text-sm text-muted-foreground">
                    {item.popularMonths || "–"}
                  </TableCell>
                  <TableCell className="font-sans text-xs text-muted-foreground max-w-xs truncate">
                    {item.highlights || "–"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="text-muted-foreground hover:text-gold transition-colors"
                        data-ocid={`masterdata.destination.edit_button.${idx + 1}`}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        data-ocid={`masterdata.destination.delete_button.${idx + 1}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              {editing ? "Edit Destination" : "Add Destination"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-sans">Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Goa"
                  className="font-sans text-sm"
                  data-ocid="masterdata.destination.input"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">Country *</Label>
                <Input
                  value={form.country}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, country: e.target.value }))
                  }
                  placeholder="India"
                  className="font-sans text-sm"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-sans">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Brief description..."
                rows={2}
                className="font-sans text-sm resize-none"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-sans">Popular Months</Label>
              <Input
                value={form.popularMonths}
                onChange={(e) =>
                  setForm((f) => ({ ...f, popularMonths: e.target.value }))
                }
                placeholder="October – March"
                className="font-sans text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-sans">Highlights</Label>
              <Textarea
                value={form.highlights}
                onChange={(e) =>
                  setForm((f) => ({ ...f, highlights: e.target.value }))
                }
                placeholder="Key attractions..."
                rows={2}
                className="font-sans text-sm resize-none"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="font-sans"
              data-ocid="masterdata.destination.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="gradient-gold text-sidebar font-sans shadow-gold"
              data-ocid="masterdata.destination.save_button"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Hotels Tab ────────────────────────────────────────────────────────────────

function HotelsTab() {
  const [data, setData] = useState(() => masterDataStore.get().hotels);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<HotelType | null>(null);
  const [form, setForm] = useState({
    name: "",
    city: "",
    category: "4-star" as HotelType["category"],
    perPersonPerNight: "",
    singleSupplement: "",
    childRate: "",
    contact: "",
    notes: "",
  });

  const openAdd = () => {
    setEditing(null);
    setForm({
      name: "",
      city: "",
      category: "4-star",
      perPersonPerNight: "",
      singleSupplement: "",
      childRate: "",
      contact: "",
      notes: "",
    });
    setShowDialog(true);
  };

  const openEdit = (item: HotelType) => {
    setEditing(item);
    setForm({
      name: item.name,
      city: item.city,
      category: item.category,
      perPersonPerNight: String(item.perPersonPerNight),
      singleSupplement: String(item.singleSupplement),
      childRate: String(item.childRate),
      contact: item.contact,
      notes: item.notes,
    });
    setShowDialog(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Name required");
      return;
    }
    const payload = {
      name: form.name,
      city: form.city,
      category: form.category,
      perPersonPerNight: Number(form.perPersonPerNight) || 0,
      singleSupplement: Number(form.singleSupplement) || 0,
      childRate: Number(form.childRate) || 0,
      contact: form.contact,
      notes: form.notes,
    };
    if (editing) {
      masterDataStore.updateHotel(editing.id, payload);
      toast.success("Hotel updated");
    } else {
      masterDataStore.addHotel(payload);
      toast.success("Hotel added");
    }
    setData(masterDataStore.get().hotels);
    setShowDialog(false);
  };

  const handleDelete = (id: string) => {
    masterDataStore.deleteHotel(id);
    setData(masterDataStore.get().hotels);
    toast.success("Deleted");
  };

  const CATEGORIES: HotelType["category"][] = [
    "3-star",
    "4-star",
    "5-star",
    "resort",
    "budget",
  ];
  const CAT_COLORS: Record<string, string> = {
    "5-star": "text-gold border-gold/40 bg-gold/10",
    "4-star": "text-blue-400 border-blue-400/40 bg-blue-400/10",
    "3-star": "text-teal border-teal/40 bg-teal/10",
    resort: "text-purple-400 border-purple-400/40 bg-purple-400/10",
    budget: "text-muted-foreground border-border",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground font-sans">
          {data.length} hotels
        </p>
        <Button
          onClick={openAdd}
          size="sm"
          className="gradient-gold text-sidebar font-sans shadow-gold"
          data-ocid="masterdata.hotel.button"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Hotel
        </Button>
      </div>
      <Card className="premium-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                Hotel
              </TableHead>
              <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                Category
              </TableHead>
              <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                Per Person/Night
              </TableHead>
              <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                Child Rate
              </TableHead>
              <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                City
              </TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground font-sans text-sm"
                  data-ocid="masterdata.hotel.empty_state"
                >
                  No hotels yet
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, idx) => (
                <TableRow
                  key={item.id}
                  className="border-border hover:bg-accent/20"
                  data-ocid={`masterdata.hotel.row.${idx + 1}`}
                >
                  <TableCell className="font-sans font-semibold text-foreground">
                    {item.name}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-xs border ${CAT_COLORS[item.category]}`}
                    >
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-gold">
                    ₹{item.perPersonPerNight.toLocaleString()}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    ₹{item.childRate.toLocaleString()}
                  </TableCell>
                  <TableCell className="font-sans text-sm text-muted-foreground">
                    {item.city}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="text-muted-foreground hover:text-gold transition-colors"
                        data-ocid={`masterdata.hotel.edit_button.${idx + 1}`}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        data-ocid={`masterdata.hotel.delete_button.${idx + 1}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              {editing ? "Edit Hotel" : "Add Hotel"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1 col-span-2">
                <Label className="text-xs font-sans">Hotel Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="The Leela Palace"
                  className="font-sans text-sm"
                  data-ocid="masterdata.hotel.input"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">City</Label>
                <Input
                  value={form.city}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, city: e.target.value }))
                  }
                  placeholder="Goa"
                  className="font-sans text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      category: v as HotelType["category"],
                    }))
                  }
                >
                  <SelectTrigger className="font-sans text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem
                        key={c}
                        value={c}
                        className="font-sans text-sm"
                      >
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">
                  Per Person/Night (₹)
                </Label>
                <Input
                  type="number"
                  value={form.perPersonPerNight}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      perPersonPerNight: e.target.value,
                    }))
                  }
                  placeholder="8500"
                  className="font-sans text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">
                  Single Supplement (₹)
                </Label>
                <Input
                  type="number"
                  value={form.singleSupplement}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, singleSupplement: e.target.value }))
                  }
                  placeholder="4000"
                  className="font-sans text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">
                  Child Rate/Night (₹)
                </Label>
                <Input
                  type="number"
                  value={form.childRate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, childRate: e.target.value }))
                  }
                  placeholder="2500"
                  className="font-sans text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">Contact</Label>
                <Input
                  value={form.contact}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, contact: e.target.value }))
                  }
                  placeholder="+91-XXX-XXXXXXX"
                  className="font-sans text-sm"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-sans">Notes</Label>
              <Textarea
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                placeholder="Special notes..."
                rows={2}
                className="font-sans text-sm resize-none"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="font-sans"
              data-ocid="masterdata.hotel.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="gradient-gold text-sidebar font-sans shadow-gold"
              data-ocid="masterdata.hotel.save_button"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Activities Tab ────────────────────────────────────────────────────────────

function ActivitiesTab() {
  const [data, setData] = useState(() => masterDataStore.get().activities);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<Activity | null>(null);
  const [form, setForm] = useState({
    name: "",
    destination: "",
    durationHours: "2",
    adultRate: "",
    childRate: "",
    category: "leisure" as Activity["category"],
    description: "",
  });

  const CATEGORIES: Activity["category"][] = [
    "adventure",
    "cultural",
    "leisure",
    "water",
    "wildlife",
  ];
  const CAT_COLORS: Record<string, string> = {
    adventure: "text-orange-400 border-orange-400/40 bg-orange-400/10",
    cultural: "text-purple-400 border-purple-400/40 bg-purple-400/10",
    leisure: "text-teal border-teal/40 bg-teal/10",
    water: "text-blue-400 border-blue-400/40 bg-blue-400/10",
    wildlife: "text-green-400 border-green-400/40 bg-green-400/10",
  };

  const openAdd = () => {
    setEditing(null);
    setForm({
      name: "",
      destination: "",
      durationHours: "2",
      adultRate: "",
      childRate: "",
      category: "leisure",
      description: "",
    });
    setShowDialog(true);
  };

  const openEdit = (item: Activity) => {
    setEditing(item);
    setForm({
      name: item.name,
      destination: item.destination,
      durationHours: String(item.durationHours),
      adultRate: String(item.adultRate),
      childRate: String(item.childRate),
      category: item.category,
      description: item.description,
    });
    setShowDialog(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Name required");
      return;
    }
    const payload = {
      name: form.name,
      destination: form.destination,
      durationHours: Number(form.durationHours) || 2,
      adultRate: Number(form.adultRate) || 0,
      childRate: Number(form.childRate) || 0,
      category: form.category,
      description: form.description,
    };
    if (editing) {
      masterDataStore.updateActivity(editing.id, payload);
      toast.success("Activity updated");
    } else {
      masterDataStore.addActivity(payload);
      toast.success("Activity added");
    }
    setData(masterDataStore.get().activities);
    setShowDialog(false);
  };

  const handleDelete = (id: string) => {
    masterDataStore.deleteActivity(id);
    setData(masterDataStore.get().activities);
    toast.success("Deleted");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground font-sans">
          {data.length} activities
        </p>
        <Button
          onClick={openAdd}
          size="sm"
          className="gradient-gold text-sidebar font-sans shadow-gold"
          data-ocid="masterdata.activity.button"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Activity
        </Button>
      </div>
      <Card className="premium-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                Activity
              </TableHead>
              <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                Category
              </TableHead>
              <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                Destination
              </TableHead>
              <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                Adult Rate
              </TableHead>
              <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                Child Rate
              </TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground font-sans text-sm"
                  data-ocid="masterdata.activity.empty_state"
                >
                  No activities yet
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, idx) => (
                <TableRow
                  key={item.id}
                  className="border-border hover:bg-accent/20"
                  data-ocid={`masterdata.activity.row.${idx + 1}`}
                >
                  <TableCell className="font-sans font-semibold text-foreground">
                    {item.name}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-xs border ${CAT_COLORS[item.category]}`}
                    >
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-sans text-sm text-muted-foreground">
                    {item.destination || "–"}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-gold">
                    ₹{item.adultRate.toLocaleString()}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    ₹{item.childRate.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="text-muted-foreground hover:text-gold transition-colors"
                        data-ocid={`masterdata.activity.edit_button.${idx + 1}`}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        data-ocid={`masterdata.activity.delete_button.${idx + 1}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              {editing ? "Edit Activity" : "Add Activity"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1">
              <Label className="text-xs font-sans">Name *</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Water Sports Package"
                className="font-sans text-sm"
                data-ocid="masterdata.activity.input"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-sans">Destination</Label>
                <Input
                  value={form.destination}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, destination: e.target.value }))
                  }
                  placeholder="Goa"
                  className="font-sans text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      category: v as Activity["category"],
                    }))
                  }
                >
                  <SelectTrigger className="font-sans text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem
                        key={c}
                        value={c}
                        className="font-sans text-sm"
                      >
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">Duration (hrs)</Label>
                <Input
                  type="number"
                  value={form.durationHours}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, durationHours: e.target.value }))
                  }
                  placeholder="3"
                  className="font-sans text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">Adult Rate (₹)</Label>
                <Input
                  type="number"
                  value={form.adultRate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, adultRate: e.target.value }))
                  }
                  placeholder="2500"
                  className="font-sans text-sm"
                />
              </div>
              <div className="space-y-1 col-span-2">
                <Label className="text-xs font-sans">Child Rate (₹)</Label>
                <Input
                  type="number"
                  value={form.childRate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, childRate: e.target.value }))
                  }
                  placeholder="1500"
                  className="font-sans text-sm"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-sans">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={2}
                className="font-sans text-sm resize-none"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="font-sans"
              data-ocid="masterdata.activity.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="gradient-gold text-sidebar font-sans shadow-gold"
              data-ocid="masterdata.activity.save_button"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Vehicles Tab ──────────────────────────────────────────────────────────────

function VehiclesTab() {
  const [data, setData] = useState(() => masterDataStore.get().vehicles);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [form, setForm] = useState({
    type: "suv" as Vehicle["type"],
    seatingCapacity: "7",
    perDayRate: "",
    perKmRate: "",
    driverIncluded: true,
    ac: true,
    notes: "",
  });

  const TYPES: Vehicle["type"][] = ["sedan", "suv", "minivan", "bus", "boat"];

  const openAdd = () => {
    setEditing(null);
    setForm({
      type: "suv",
      seatingCapacity: "7",
      perDayRate: "",
      perKmRate: "",
      driverIncluded: true,
      ac: true,
      notes: "",
    });
    setShowDialog(true);
  };

  const openEdit = (item: Vehicle) => {
    setEditing(item);
    setForm({
      type: item.type,
      seatingCapacity: String(item.seatingCapacity),
      perDayRate: String(item.perDayRate),
      perKmRate: String(item.perKmRate),
      driverIncluded: item.driverIncluded,
      ac: item.ac,
      notes: item.notes,
    });
    setShowDialog(true);
  };

  const handleSave = () => {
    const payload = {
      type: form.type,
      seatingCapacity: Number(form.seatingCapacity) || 4,
      perDayRate: Number(form.perDayRate) || 0,
      perKmRate: Number(form.perKmRate) || 0,
      driverIncluded: form.driverIncluded,
      ac: form.ac,
      notes: form.notes,
    };
    if (editing) {
      masterDataStore.updateVehicle(editing.id, payload);
      toast.success("Vehicle updated");
    } else {
      masterDataStore.addVehicle(payload);
      toast.success("Vehicle added");
    }
    setData(masterDataStore.get().vehicles);
    setShowDialog(false);
  };

  const handleDelete = (id: string) => {
    masterDataStore.deleteVehicle(id);
    setData(masterDataStore.get().vehicles);
    toast.success("Deleted");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground font-sans">
          {data.length} vehicles
        </p>
        <Button
          onClick={openAdd}
          size="sm"
          className="gradient-gold text-sidebar font-sans shadow-gold"
          data-ocid="masterdata.vehicle.button"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Vehicle
        </Button>
      </div>
      <Card className="premium-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                Type
              </TableHead>
              <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                Seats
              </TableHead>
              <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                Per Day
              </TableHead>
              <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                Per Km
              </TableHead>
              <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                Driver
              </TableHead>
              <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                AC
              </TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-10 text-muted-foreground font-sans text-sm"
                  data-ocid="masterdata.vehicle.empty_state"
                >
                  No vehicles yet
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, idx) => (
                <TableRow
                  key={item.id}
                  className="border-border hover:bg-accent/20"
                  data-ocid={`masterdata.vehicle.row.${idx + 1}`}
                >
                  <TableCell className="font-sans font-semibold text-foreground capitalize">
                    {item.type}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-foreground">
                    {item.seatingCapacity}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-gold">
                    ₹{item.perDayRate.toLocaleString()}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    ₹{item.perKmRate}
                  </TableCell>
                  <TableCell className="text-sm">
                    {item.driverIncluded ? (
                      <span className="text-green-400">Yes</span>
                    ) : (
                      <span className="text-red-400">No</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {item.ac ? (
                      <span className="text-green-400">Yes</span>
                    ) : (
                      <span className="text-red-400">No</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="text-muted-foreground hover:text-gold transition-colors"
                        data-ocid={`masterdata.vehicle.edit_button.${idx + 1}`}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        data-ocid={`masterdata.vehicle.delete_button.${idx + 1}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              {editing ? "Edit Vehicle" : "Add Vehicle"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-sans">Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, type: v as Vehicle["type"] }))
                  }
                >
                  <SelectTrigger className="font-sans text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPES.map((t) => (
                      <SelectItem
                        key={t}
                        value={t}
                        className="font-sans text-sm capitalize"
                      >
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">Seating Capacity</Label>
                <Input
                  type="number"
                  value={form.seatingCapacity}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, seatingCapacity: e.target.value }))
                  }
                  className="font-sans text-sm"
                  data-ocid="masterdata.vehicle.input"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">Per Day Rate (₹)</Label>
                <Input
                  type="number"
                  value={form.perDayRate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, perDayRate: e.target.value }))
                  }
                  placeholder="4000"
                  className="font-sans text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">Per Km Rate (₹)</Label>
                <Input
                  type="number"
                  value={form.perKmRate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, perKmRate: e.target.value }))
                  }
                  placeholder="18"
                  className="font-sans text-sm"
                />
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.driverIncluded}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, driverIncluded: v }))
                  }
                />
                <Label className="text-xs font-sans">Driver Included</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.ac}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, ac: v }))}
                />
                <Label className="text-xs font-sans">AC</Label>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-sans">Notes</Label>
              <Input
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                placeholder="e.g. Innova Crysta / similar"
                className="font-sans text-sm"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="font-sans"
              data-ocid="masterdata.vehicle.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="gradient-gold text-sidebar font-sans shadow-gold"
              data-ocid="masterdata.vehicle.save_button"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Airlines Tab ──────────────────────────────────────────────────────────────

function AirlinesTab() {
  const [data, setData] = useState(() => masterDataStore.get().airlines);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<Airline | null>(null);
  const [form, setForm] = useState({
    name: "",
    route: "",
    economyFare: "",
    businessFare: "",
    luggageAllowance: "",
    notes: "",
  });

  const openAdd = () => {
    setEditing(null);
    setForm({
      name: "",
      route: "",
      economyFare: "",
      businessFare: "",
      luggageAllowance: "",
      notes: "",
    });
    setShowDialog(true);
  };

  const openEdit = (item: Airline) => {
    setEditing(item);
    setForm({
      name: item.name,
      route: item.route,
      economyFare: String(item.economyFare),
      businessFare: String(item.businessFare),
      luggageAllowance: item.luggageAllowance,
      notes: item.notes,
    });
    setShowDialog(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Airline name required");
      return;
    }
    const payload = {
      name: form.name,
      route: form.route,
      economyFare: Number(form.economyFare) || 0,
      businessFare: Number(form.businessFare) || 0,
      luggageAllowance: form.luggageAllowance,
      notes: form.notes,
    };
    if (editing) {
      masterDataStore.updateAirline(editing.id, payload);
      toast.success("Airline updated");
    } else {
      masterDataStore.addAirline(payload);
      toast.success("Airline added");
    }
    setData(masterDataStore.get().airlines);
    setShowDialog(false);
  };

  const handleDelete = (id: string) => {
    masterDataStore.deleteAirline(id);
    setData(masterDataStore.get().airlines);
    toast.success("Deleted");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground font-sans">
          {data.length} airlines
        </p>
        <Button
          onClick={openAdd}
          size="sm"
          className="gradient-gold text-sidebar font-sans shadow-gold"
          data-ocid="masterdata.airline.button"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Airline
        </Button>
      </div>
      <Card className="premium-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                Airline
              </TableHead>
              <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                Route/Sector
              </TableHead>
              <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                Economy
              </TableHead>
              <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                Business
              </TableHead>
              <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                Luggage
              </TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground font-sans text-sm"
                  data-ocid="masterdata.airline.empty_state"
                >
                  No airlines yet
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, idx) => (
                <TableRow
                  key={item.id}
                  className="border-border hover:bg-accent/20"
                  data-ocid={`masterdata.airline.row.${idx + 1}`}
                >
                  <TableCell className="font-sans font-semibold text-foreground">
                    {item.name}
                  </TableCell>
                  <TableCell className="font-sans text-sm text-muted-foreground">
                    {item.route}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-gold">
                    ₹{item.economyFare.toLocaleString()}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {item.businessFare > 0
                      ? `₹${item.businessFare.toLocaleString()}`
                      : "–"}
                  </TableCell>
                  <TableCell className="font-sans text-xs text-muted-foreground">
                    {item.luggageAllowance || "–"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="text-muted-foreground hover:text-gold transition-colors"
                        data-ocid={`masterdata.airline.edit_button.${idx + 1}`}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        data-ocid={`masterdata.airline.delete_button.${idx + 1}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              {editing ? "Edit Airline" : "Add Airline"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-sans">Airline Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="IndiGo"
                  className="font-sans text-sm"
                  data-ocid="masterdata.airline.input"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">Route/Sector</Label>
                <Input
                  value={form.route}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, route: e.target.value }))
                  }
                  placeholder="Delhi – Goa"
                  className="font-sans text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">Economy Fare (₹)</Label>
                <Input
                  type="number"
                  value={form.economyFare}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, economyFare: e.target.value }))
                  }
                  placeholder="4500"
                  className="font-sans text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">Business Fare (₹)</Label>
                <Input
                  type="number"
                  value={form.businessFare}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, businessFare: e.target.value }))
                  }
                  placeholder="0"
                  className="font-sans text-sm"
                />
              </div>
              <div className="space-y-1 col-span-2">
                <Label className="text-xs font-sans">Luggage Allowance</Label>
                <Input
                  value={form.luggageAllowance}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, luggageAllowance: e.target.value }))
                  }
                  placeholder="15 kg check-in + 7 kg cabin"
                  className="font-sans text-sm"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-sans">Notes</Label>
              <Input
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                className="font-sans text-sm"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="font-sans"
              data-ocid="masterdata.airline.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="gradient-gold text-sidebar font-sans shadow-gold"
              data-ocid="masterdata.airline.save_button"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Add-ons Tab ───────────────────────────────────────────────────────────────

function AddonsTab() {
  const [data, setData] = useState(() => masterDataStore.get().addons);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<Addon | null>(null);
  const [form, setForm] = useState({
    name: "",
    unit: "per person" as Addon["unit"],
    rate: "",
    category: "other" as Addon["category"],
    description: "",
  });

  const UNITS: Addon["unit"][] = ["per person", "per night", "per trip"];
  const CATS: Addon["category"][] = [
    "insurance",
    "visa",
    "photography",
    "spa",
    "meal-upgrade",
    "other",
  ];

  const openAdd = () => {
    setEditing(null);
    setForm({
      name: "",
      unit: "per person",
      rate: "",
      category: "other",
      description: "",
    });
    setShowDialog(true);
  };

  const openEdit = (item: Addon) => {
    setEditing(item);
    setForm({
      name: item.name,
      unit: item.unit,
      rate: String(item.rate),
      category: item.category,
      description: item.description,
    });
    setShowDialog(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Name required");
      return;
    }
    const payload = {
      name: form.name,
      unit: form.unit,
      rate: Number(form.rate) || 0,
      category: form.category,
      description: form.description,
    };
    if (editing) {
      masterDataStore.updateAddon(editing.id, payload);
      toast.success("Add-on updated");
    } else {
      masterDataStore.addAddon(payload);
      toast.success("Add-on added");
    }
    setData(masterDataStore.get().addons);
    setShowDialog(false);
  };

  const handleDelete = (id: string) => {
    masterDataStore.deleteAddon(id);
    setData(masterDataStore.get().addons);
    toast.success("Deleted");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground font-sans">
          {data.length} add-ons
        </p>
        <Button
          onClick={openAdd}
          size="sm"
          className="gradient-gold text-sidebar font-sans shadow-gold"
          data-ocid="masterdata.addon.button"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Service
        </Button>
      </div>
      <Card className="premium-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                Service
              </TableHead>
              <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                Category
              </TableHead>
              <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                Unit
              </TableHead>
              <TableHead className="font-sans text-xs text-muted-foreground uppercase">
                Rate
              </TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-muted-foreground font-sans text-sm"
                  data-ocid="masterdata.addon.empty_state"
                >
                  No add-ons yet
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, idx) => (
                <TableRow
                  key={item.id}
                  className="border-border hover:bg-accent/20"
                  data-ocid={`masterdata.addon.row.${idx + 1}`}
                >
                  <TableCell className="font-sans font-semibold text-foreground">
                    {item.name}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-xs font-sans capitalize"
                    >
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-sans text-sm text-muted-foreground">
                    {item.unit}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-gold">
                    ₹{item.rate.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="text-muted-foreground hover:text-gold transition-colors"
                        data-ocid={`masterdata.addon.edit_button.${idx + 1}`}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        data-ocid={`masterdata.addon.delete_button.${idx + 1}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              {editing ? "Edit Add-on" : "Add Service"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1">
              <Label className="text-xs font-sans">Service Name *</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Travel Insurance"
                className="font-sans text-sm"
                data-ocid="masterdata.addon.input"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-sans">Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, category: v as Addon["category"] }))
                  }
                >
                  <SelectTrigger className="font-sans text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATS.map((c) => (
                      <SelectItem
                        key={c}
                        value={c}
                        className="font-sans text-sm capitalize"
                      >
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">Unit</Label>
                <Select
                  value={form.unit}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, unit: v as Addon["unit"] }))
                  }
                >
                  <SelectTrigger className="font-sans text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map((u) => (
                      <SelectItem
                        key={u}
                        value={u}
                        className="font-sans text-sm"
                      >
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 col-span-2">
                <Label className="text-xs font-sans">Rate (₹)</Label>
                <Input
                  type="number"
                  value={form.rate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, rate: e.target.value }))
                  }
                  placeholder="800"
                  className="font-sans text-sm"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-sans">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={2}
                className="font-sans text-sm resize-none"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="font-sans"
              data-ocid="masterdata.addon.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="gradient-gold text-sidebar font-sans shadow-gold"
              data-ocid="masterdata.addon.save_button"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function MasterDataPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-sidebar border-b border-border px-4 py-5">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <Database className="w-6 h-6 text-gold" />
            <h2 className="text-2xl font-display font-bold text-foreground">
              Master <span className="text-gradient-gold">Data Library</span>
            </h2>
          </div>
          <p className="text-sm text-muted-foreground font-sans mt-0.5">
            Manage your reusable data — destinations, hotels, activities,
            vehicles, airlines &amp; add-ons
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="destinations">
          <TabsList className="mb-6 bg-card border border-border flex flex-wrap h-auto gap-1 p-1">
            <TabsTrigger
              value="destinations"
              className="font-sans text-sm flex items-center gap-1.5"
              data-ocid="masterdata.destinations.tab"
            >
              <MapPin className="w-3.5 h-3.5" /> Destinations
            </TabsTrigger>
            <TabsTrigger
              value="hotels"
              className="font-sans text-sm flex items-center gap-1.5"
              data-ocid="masterdata.hotels.tab"
            >
              <Hotel className="w-3.5 h-3.5" /> Hotels
            </TabsTrigger>
            <TabsTrigger
              value="activities"
              className="font-sans text-sm flex items-center gap-1.5"
              data-ocid="masterdata.activities.tab"
            >
              <UtensilsCrossed className="w-3.5 h-3.5" /> Activities
            </TabsTrigger>
            <TabsTrigger
              value="vehicles"
              className="font-sans text-sm flex items-center gap-1.5"
              data-ocid="masterdata.vehicles.tab"
            >
              <Truck className="w-3.5 h-3.5" /> Vehicles
            </TabsTrigger>
            <TabsTrigger
              value="airlines"
              className="font-sans text-sm flex items-center gap-1.5"
              data-ocid="masterdata.airlines.tab"
            >
              <Plane className="w-3.5 h-3.5" /> Airlines
            </TabsTrigger>
            <TabsTrigger
              value="addons"
              className="font-sans text-sm flex items-center gap-1.5"
              data-ocid="masterdata.addons.tab"
            >
              <Tag className="w-3.5 h-3.5" /> Add-ons
            </TabsTrigger>
          </TabsList>

          <TabsContent value="destinations">
            <DestinationsTab />
          </TabsContent>
          <TabsContent value="hotels">
            <HotelsTab />
          </TabsContent>
          <TabsContent value="activities">
            <ActivitiesTab />
          </TabsContent>
          <TabsContent value="vehicles">
            <VehiclesTab />
          </TabsContent>
          <TabsContent value="airlines">
            <AirlinesTab />
          </TabsContent>
          <TabsContent value="addons">
            <AddonsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
