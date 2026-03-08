import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Anchor,
  Car,
  Check,
  Hotel,
  Loader2,
  MapPin,
  Pencil,
  Percent,
  Plus,
  Star,
  Trash2,
  Utensils,
  UtensilsCrossed,
  Waves,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { HotelRate, RateOption } from "../../backend";
import { useIsAdmin } from "../../hooks/useIsAdminOrStaff";
import {
  useAddHotelRate,
  useAddOrUpdateActivityRate,
  useAddOrUpdateAddOnRate,
  useAddOrUpdateBoatingRate,
  useAddOrUpdateFoodRate,
  useAddOrUpdateTravelRate,
  useDeleteActivityRate,
  useDeleteAddOnRate,
  useDeleteBoatingRate,
  useDeleteFoodRate,
  useDeleteHotelRate,
  useDeleteTravelRate,
  useGetAllActivityRates,
  useGetAllAddOnRates,
  useGetAllBoatingRates,
  useGetAllFoodRates,
  useGetAllTravelRates,
  useGetHotelRates,
  useUpdateHotelRate,
} from "../../hooks/useQueries";
import type { MarkupRule } from "../../lib/markupStore";
import {
  MARKUP_APPLIES_TO_LABELS,
  MARKUP_TYPE_LABELS,
  markupStore,
} from "../../lib/markupStore";
import type { CabRate, FoodMenuItem } from "../../lib/masterDataStore";
import { masterDataStore } from "../../lib/masterDataStore";

// ─── Reusable RateOption Tab ─────────────────────────────────────────────────

interface RateOptionTabProps {
  label: string;
  items: RateOption[];
  isLoading: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  onAdd: (name: string, price: number) => Promise<void>;
  onUpdate: (name: string, price: number) => Promise<void>;
  onDelete: (name: string) => Promise<void>;
  namePlaceholder: string;
  priceLabel: string;
}

function RateOptionTab({
  label,
  items,
  isLoading,
  isSaving,
  isDeleting,
  onAdd,
  onUpdate,
  onDelete,
  namePlaceholder,
  priceLabel,
}: RateOptionTabProps) {
  const [form, setForm] = useState({ name: "", price: "" });
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", price: "" });

  const handleAdd = async () => {
    if (!form.name.trim() || !form.price) {
      toast.error("Please fill all fields");
      return;
    }
    await onAdd(form.name.trim(), Number.parseInt(form.price));
    setForm({ name: "", price: "" });
  };

  const startEdit = (item: RateOption) => {
    setEditingName(item.name);
    setEditForm({ name: item.name, price: String(Number(item.price)) });
  };

  const cancelEdit = () => {
    setEditingName(null);
    setEditForm({ name: "", price: "" });
  };

  const handleUpdate = async () => {
    if (!editForm.name.trim() || !editForm.price) {
      toast.error("Please fill all fields");
      return;
    }
    await onUpdate(editForm.name.trim(), Number.parseInt(editForm.price));
    setEditingName(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Add Form */}
      <Card className="premium-card lg:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="font-serif text-lg">Add {label}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label className="font-sans text-xs">Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={namePlaceholder}
              className="font-sans text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
          </div>
          <div className="space-y-1">
            <Label className="font-sans text-xs">{priceLabel} (₹)</Label>
            <Input
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="0"
              className="font-sans text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
          </div>
          <Button
            onClick={handleAdd}
            disabled={isSaving}
            className="w-full font-sans bg-teal hover:bg-teal-dark text-white"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-1" />
            )}
            Add {label}
          </Button>
        </CardContent>
      </Card>

      {/* List Table */}
      <Card className="premium-card lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="font-serif text-lg">
            {label} ({items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-teal" />
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-muted-foreground font-sans text-sm py-8">
              No {label.toLowerCase()} added yet
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-sans text-xs">Name</TableHead>
                  <TableHead className="font-sans text-xs text-right">
                    Price
                  </TableHead>
                  <TableHead className="font-sans text-xs text-right w-24">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.name}>
                    {editingName === item.name ? (
                      <>
                        <TableCell>
                          <Input
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm({ ...editForm, name: e.target.value })
                            }
                            className="font-sans text-sm h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            value={editForm.price}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                price: e.target.value,
                              })
                            }
                            className="font-sans text-sm h-8 text-right"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-teal hover:text-teal-dark"
                              onClick={handleUpdate}
                              disabled={isSaving}
                            >
                              {isSaving ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Check className="w-3 h-3" />
                              )}
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-muted-foreground hover:text-foreground"
                              onClick={cancelEdit}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="font-sans text-sm font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell className="font-sans text-sm text-right font-semibold text-teal">
                          ₹{Number(item.price).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-muted-foreground hover:text-foreground"
                              onClick={() => startEdit(item)}
                            >
                              <Pencil className="w-3 h-3" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 text-destructive hover:text-destructive/80"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="font-serif">
                                    Delete Entry
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="font-sans">
                                    Are you sure you want to delete{" "}
                                    <strong>{item.name}</strong>? This action
                                    cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="font-sans">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    className="font-sans bg-destructive hover:bg-destructive/90 text-white"
                                    onClick={() => onDelete(item.name)}
                                    disabled={isDeleting}
                                  >
                                    {isDeleting ? (
                                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                    ) : null}
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Food Menu Tab ────────────────────────────────────────────────────────────

const MEAL_TYPE_LABELS: Record<FoodMenuItem["mealType"], string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
  complimentary: "Complimentary",
};

const MEAL_TYPE_OPTIONS: FoodMenuItem["mealType"][] = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
  "complimentary",
];

function FoodMenuTab() {
  const [data, setData] = useState(() => masterDataStore.get().foodMenuItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    mealType: "breakfast" as FoodMenuItem["mealType"],
    ratePerPerson: "",
    isComplimentary: false,
    notes: "",
  });

  const resetForm = () => {
    setForm({
      name: "",
      mealType: "breakfast",
      ratePerPerson: "",
      isComplimentary: false,
      notes: "",
    });
    setEditingId(null);
  };

  const openEdit = (item: FoodMenuItem) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      mealType: item.mealType,
      ratePerPerson: String(item.ratePerPerson),
      isComplimentary: item.isComplimentary,
      notes: item.notes,
    });
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Item name is required");
      return;
    }
    const payload = {
      name: form.name.trim(),
      mealType: form.isComplimentary
        ? ("complimentary" as FoodMenuItem["mealType"])
        : form.mealType,
      ratePerPerson: form.isComplimentary ? 0 : Number(form.ratePerPerson) || 0,
      isComplimentary: form.isComplimentary,
      notes: form.notes,
    };
    if (editingId) {
      masterDataStore.updateFoodMenuItem(editingId, payload);
      toast.success("Food item updated");
    } else {
      masterDataStore.addFoodMenuItem(payload);
      toast.success("Food item added");
    }
    setData(masterDataStore.get().foodMenuItems);
    resetForm();
  };

  const handleDelete = (id: string) => {
    masterDataStore.deleteFoodMenuItem(id);
    setData(masterDataStore.get().foodMenuItems);
    toast.success("Food item deleted");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Add / Edit Form */}
      <Card className="premium-card lg:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="font-serif text-lg flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-gold" />
            {editingId ? "Edit Food Item" : "Add Food Item"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label className="font-sans text-xs">Item Name *</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Standard Breakfast Buffet"
              className="font-sans text-sm"
              data-ocid="rates.food_menu.input"
            />
          </div>
          <div className="space-y-1">
            <Label className="font-sans text-xs">Meal Type</Label>
            <Select
              value={form.mealType}
              onValueChange={(v) =>
                setForm((f) => ({
                  ...f,
                  mealType: v as FoodMenuItem["mealType"],
                }))
              }
              disabled={form.isComplimentary}
            >
              <SelectTrigger
                className="font-sans text-sm"
                data-ocid="rates.food_menu.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MEAL_TYPE_OPTIONS.map((t) => (
                  <SelectItem key={t} value={t} className="font-sans text-sm">
                    {MEAL_TYPE_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="font-sans text-xs">Rate per Person (₹)</Label>
            <Input
              type="number"
              min="0"
              value={form.isComplimentary ? "0" : form.ratePerPerson}
              onChange={(e) =>
                setForm((f) => ({ ...f, ratePerPerson: e.target.value }))
              }
              disabled={form.isComplimentary}
              placeholder="500"
              className="font-sans text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={form.isComplimentary}
              onCheckedChange={(v) =>
                setForm((f) => ({
                  ...f,
                  isComplimentary: v,
                  mealType: v ? "complimentary" : f.mealType,
                  ratePerPerson: v ? "0" : f.ratePerPerson,
                }))
              }
              data-ocid="rates.food_menu.switch"
            />
            <Label className="font-sans text-xs">Complimentary (Free)</Label>
          </div>
          <div className="space-y-1">
            <Label className="font-sans text-xs">Notes</Label>
            <Textarea
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
              placeholder="Includes fresh juices, eggs, etc."
              rows={2}
              className="font-sans text-sm resize-none"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              className="flex-1 font-sans bg-teal hover:bg-teal-dark text-white"
              data-ocid="rates.food_menu.save_button"
            >
              <Plus className="w-4 h-4 mr-1" />
              {editingId ? "Update" : "Add Item"}
            </Button>
            {editingId && (
              <Button
                variant="outline"
                onClick={resetForm}
                className="font-sans"
                data-ocid="rates.food_menu.cancel_button"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Food Menu Table */}
      <Card className="premium-card lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="font-serif text-lg">
            Food Menu Items ({data.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <p
              className="text-center text-muted-foreground font-sans text-sm py-8"
              data-ocid="rates.food_menu.empty_state"
            >
              No food menu items added yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-sans text-xs">Name</TableHead>
                    <TableHead className="font-sans text-xs">Type</TableHead>
                    <TableHead className="font-sans text-xs text-right">
                      Rate/Person
                    </TableHead>
                    <TableHead className="font-sans text-xs hidden md:table-cell">
                      Notes
                    </TableHead>
                    <TableHead className="font-sans text-xs text-right w-20">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item, idx) => (
                    <TableRow
                      key={item.id}
                      data-ocid={`rates.food_menu.row.${idx + 1}`}
                    >
                      <TableCell className="font-sans text-sm font-medium">
                        {item.name}
                      </TableCell>
                      <TableCell>
                        {item.isComplimentary ? (
                          <span className="inline-flex items-center gap-1 text-xs font-sans text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-2 py-0.5">
                            ✓ Free
                          </span>
                        ) : (
                          <span className="text-xs font-sans text-muted-foreground capitalize">
                            {MEAL_TYPE_LABELS[item.mealType]}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-right text-teal">
                        {item.isComplimentary
                          ? "—"
                          : `₹${item.ratePerPerson.toLocaleString()}`}
                      </TableCell>
                      <TableCell className="font-sans text-xs text-muted-foreground hidden md:table-cell max-w-[160px] truncate">
                        {item.notes || "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={() => openEdit(item)}
                            data-ocid={`rates.food_menu.edit_button.${idx + 1}`}
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-destructive hover:text-destructive/80"
                                data-ocid={`rates.food_menu.delete_button.${idx + 1}`}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="font-serif">
                                  Delete Food Item
                                </AlertDialogTitle>
                                <AlertDialogDescription className="font-sans">
                                  Delete <strong>{item.name}</strong>? This
                                  cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="font-sans">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className="font-sans bg-destructive hover:bg-destructive/90 text-white"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Hotels Tab ───────────────────────────────────────────────────────────────

function HotelsTab() {
  const { data: hotelRates = [], isLoading } = useGetHotelRates();
  const { mutateAsync: addHotel, isPending: isAdding } = useAddHotelRate();
  const { mutateAsync: updateHotel, isPending: isUpdating } =
    useUpdateHotelRate();
  const { mutateAsync: deleteHotel, isPending: isDeleting } =
    useDeleteHotelRate();

  const [form, setForm] = useState({ hotelName: "", roomType: "", rate: "" });
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    hotelName: "",
    roomType: "",
    rate: "",
  });

  const handleAdd = async () => {
    if (!form.hotelName.trim() || !form.roomType.trim() || !form.rate) {
      toast.error("Please fill all hotel fields");
      return;
    }
    try {
      await addHotel({
        hotelName: form.hotelName.trim(),
        roomType: form.roomType.trim(),
        rate: BigInt(Number.parseInt(form.rate)),
      });
      toast.success("Hotel rate added!");
      setForm({ hotelName: "", roomType: "", rate: "" });
    } catch {
      toast.error("Failed to add hotel rate");
    }
  };

  const startEdit = (hr: HotelRate) => {
    setEditingKey(hr.hotelName);
    setEditForm({
      hotelName: hr.hotelName,
      roomType: hr.roomType,
      rate: String(Number(hr.rate)),
    });
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditForm({ hotelName: "", roomType: "", rate: "" });
  };

  const handleUpdate = async () => {
    if (
      !editForm.hotelName.trim() ||
      !editForm.roomType.trim() ||
      !editForm.rate
    ) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      await updateHotel({
        hotelName: editForm.hotelName.trim(),
        roomType: editForm.roomType.trim(),
        rate: BigInt(Number.parseInt(editForm.rate)),
      });
      toast.success("Hotel rate updated!");
      setEditingKey(null);
    } catch {
      toast.error("Failed to update hotel rate");
    }
  };

  const handleDelete = async (hotelName: string) => {
    try {
      await deleteHotel(hotelName);
      toast.success("Hotel rate deleted");
    } catch {
      toast.error("Failed to delete hotel rate");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Add Form */}
      <Card className="premium-card lg:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="font-serif text-lg">Add Hotel Rate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label className="font-sans text-xs">Hotel Name</Label>
            <Input
              value={form.hotelName}
              onChange={(e) => setForm({ ...form, hotelName: e.target.value })}
              placeholder="Grand Palace Hotel"
              className="font-sans text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="font-sans text-xs">Room Type</Label>
            <Input
              value={form.roomType}
              onChange={(e) => setForm({ ...form, roomType: e.target.value })}
              placeholder="Deluxe / Suite / Standard"
              className="font-sans text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="font-sans text-xs">Rate per Night (₹)</Label>
            <Input
              type="number"
              min="0"
              value={form.rate}
              onChange={(e) => setForm({ ...form, rate: e.target.value })}
              placeholder="5000"
              className="font-sans text-sm"
            />
          </div>
          <Button
            onClick={handleAdd}
            disabled={isAdding}
            className="w-full font-sans bg-teal hover:bg-teal-dark text-white"
          >
            {isAdding ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-1" />
            )}
            Add Hotel Rate
          </Button>
        </CardContent>
      </Card>

      {/* Hotel Rates Table */}
      <Card className="premium-card lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="font-serif text-lg">
            Hotel Rates ({hotelRates.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-teal" />
            </div>
          ) : hotelRates.length === 0 ? (
            <p className="text-center text-muted-foreground font-sans text-sm py-8">
              No hotel rates added yet
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-sans text-xs">Hotel</TableHead>
                  <TableHead className="font-sans text-xs">Room Type</TableHead>
                  <TableHead className="font-sans text-xs text-right">
                    Rate/Night
                  </TableHead>
                  <TableHead className="font-sans text-xs text-right w-24">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hotelRates.map((hr) => (
                  <TableRow key={hr.hotelName}>
                    {editingKey === hr.hotelName ? (
                      <>
                        <TableCell>
                          <Input
                            value={editForm.hotelName}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                hotelName: e.target.value,
                              })
                            }
                            className="font-sans text-sm h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={editForm.roomType}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                roomType: e.target.value,
                              })
                            }
                            className="font-sans text-sm h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            value={editForm.rate}
                            onChange={(e) =>
                              setEditForm({ ...editForm, rate: e.target.value })
                            }
                            className="font-sans text-sm h-8 text-right"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-teal hover:text-teal-dark"
                              onClick={handleUpdate}
                              disabled={isUpdating}
                            >
                              {isUpdating ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Check className="w-3 h-3" />
                              )}
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-muted-foreground hover:text-foreground"
                              onClick={cancelEdit}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="font-sans text-sm font-medium">
                          {hr.hotelName}
                        </TableCell>
                        <TableCell className="font-sans text-sm text-muted-foreground">
                          {hr.roomType}
                        </TableCell>
                        <TableCell className="font-sans text-sm text-right font-semibold text-teal">
                          ₹{Number(hr.rate).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-muted-foreground hover:text-foreground"
                              onClick={() => startEdit(hr)}
                            >
                              <Pencil className="w-3 h-3" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 text-destructive hover:text-destructive/80"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="font-serif">
                                    Delete Hotel Rate
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="font-sans">
                                    Are you sure you want to delete{" "}
                                    <strong>{hr.hotelName}</strong>? This action
                                    cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="font-sans">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    className="font-sans bg-destructive hover:bg-destructive/90 text-white"
                                    onClick={() => handleDelete(hr.hotelName)}
                                    disabled={isDeleting}
                                  >
                                    {isDeleting ? (
                                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                    ) : null}
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Cab Rates Tab ─────────────────────────────────────────────────────────────

const CAB_VEHICLE_TYPES: CabRate["vehicleType"][] = [
  "sedan",
  "suv",
  "tempo",
  "bus",
  "jeep",
  "ferry",
  "helicopter",
  "auto",
  "bike",
];

const CAB_TYPE_LABELS: Record<CabRate["vehicleType"], string> = {
  sedan: "AC Sedan",
  suv: "AC SUV / Innova",
  tempo: "Tempo Traveller",
  bus: "Mini Bus",
  jeep: "Open Jeep",
  ferry: "Ferry / Boat",
  helicopter: "Helicopter",
  auto: "Auto Rickshaw",
  bike: "Bike / Scooter",
};

function CabRatesTab() {
  const [data, setData] = useState(() => masterDataStore.get().cabRates);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    vehicleType: "sedan" as CabRate["vehicleType"],
    seatingCapacity: "4",
    perDayRate: "",
    perKmRate: "",
    isFlatRate: false,
    notes: "",
  });

  const resetForm = () => {
    setForm({
      name: "",
      vehicleType: "sedan",
      seatingCapacity: "4",
      perDayRate: "",
      perKmRate: "",
      isFlatRate: false,
      notes: "",
    });
    setEditingId(null);
  };

  const openEdit = (item: CabRate) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      vehicleType: item.vehicleType,
      seatingCapacity: String(item.seatingCapacity),
      perDayRate: String(item.perDayRate),
      perKmRate: String(item.perKmRate),
      isFlatRate: item.isFlatRate,
      notes: item.notes,
    });
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    const payload = {
      name: form.name.trim(),
      vehicleType: form.vehicleType,
      seatingCapacity: Number(form.seatingCapacity) || 4,
      perDayRate: Number(form.perDayRate) || 0,
      perKmRate: Number(form.perKmRate) || 0,
      isFlatRate: form.isFlatRate,
      notes: form.notes,
    };
    if (editingId) {
      masterDataStore.updateCabRate(editingId, payload);
      toast.success("Cab rate updated");
    } else {
      masterDataStore.addCabRate(payload);
      toast.success("Cab rate added");
    }
    setData(masterDataStore.get().cabRates);
    resetForm();
  };

  const handleDelete = (id: string) => {
    masterDataStore.deleteCabRate(id);
    setData(masterDataStore.get().cabRates);
    toast.success("Cab rate deleted");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Add / Edit Form */}
      <Card className="premium-card lg:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="font-serif text-lg flex items-center gap-2">
            <Car className="w-4 h-4 text-gold" />
            {editingId ? "Edit Cab Rate" : "Add Cab / Transport"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label className="font-sans text-xs">Name *</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="AC Sedan (4 Seater)"
              className="font-sans text-sm"
              data-ocid="rates.cab.input"
            />
          </div>
          <div className="space-y-1">
            <Label className="font-sans text-xs">Vehicle Type</Label>
            <Select
              value={form.vehicleType}
              onValueChange={(v) =>
                setForm((f) => ({
                  ...f,
                  vehicleType: v as CabRate["vehicleType"],
                }))
              }
            >
              <SelectTrigger
                className="font-sans text-sm"
                data-ocid="rates.cab.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CAB_VEHICLE_TYPES.map((t) => (
                  <SelectItem key={t} value={t} className="font-sans text-sm">
                    {CAB_TYPE_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="font-sans text-xs">Seating Capacity</Label>
              <Input
                type="number"
                min="1"
                value={form.seatingCapacity}
                onChange={(e) =>
                  setForm((f) => ({ ...f, seatingCapacity: e.target.value }))
                }
                className="font-sans text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="font-sans text-xs">Per Day Rate (₹)</Label>
              <Input
                type="number"
                min="0"
                value={form.perDayRate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, perDayRate: e.target.value }))
                }
                placeholder="2800"
                className="font-sans text-sm"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="font-sans text-xs">
              Per Km Rate (₹) — 0 if flat rate
            </Label>
            <Input
              type="number"
              min="0"
              value={form.perKmRate}
              onChange={(e) =>
                setForm((f) => ({ ...f, perKmRate: e.target.value }))
              }
              placeholder="15"
              className="font-sans text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={form.isFlatRate}
              onCheckedChange={(v) => setForm((f) => ({ ...f, isFlatRate: v }))}
              data-ocid="rates.cab.switch"
            />
            <Label className="font-sans text-xs">
              Flat Rate (fixed, not per km)
            </Label>
          </div>
          <div className="space-y-1">
            <Label className="font-sans text-xs">Notes</Label>
            <Textarea
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
              placeholder="e.g. Innova Crysta / similar"
              rows={2}
              className="font-sans text-sm resize-none"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              className="flex-1 font-sans bg-teal hover:bg-teal-dark text-white"
              data-ocid="rates.cab.save_button"
            >
              <Plus className="w-4 h-4 mr-1" />
              {editingId ? "Update" : "Add Rate"}
            </Button>
            {editingId && (
              <Button
                variant="outline"
                onClick={resetForm}
                className="font-sans"
                data-ocid="rates.cab.cancel_button"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cab Rates Table */}
      <Card className="premium-card lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="font-serif text-lg">
            Cab & Transport Rates ({data.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <p
              className="text-center text-muted-foreground font-sans text-sm py-8"
              data-ocid="rates.cab.empty_state"
            >
              No cab rates added yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-sans text-xs">Name</TableHead>
                    <TableHead className="font-sans text-xs">Type</TableHead>
                    <TableHead className="font-sans text-xs text-right">
                      Seats
                    </TableHead>
                    <TableHead className="font-sans text-xs text-right">
                      Per Day
                    </TableHead>
                    <TableHead className="font-sans text-xs text-right">
                      Per Km
                    </TableHead>
                    <TableHead className="font-sans text-xs hidden md:table-cell">
                      Notes
                    </TableHead>
                    <TableHead className="font-sans text-xs text-right w-20">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item, idx) => (
                    <TableRow
                      key={item.id}
                      data-ocid={`rates.cab.row.${idx + 1}`}
                    >
                      <TableCell className="font-sans text-sm font-medium">
                        {item.name}
                      </TableCell>
                      <TableCell className="font-sans text-xs text-muted-foreground">
                        {CAB_TYPE_LABELS[item.vehicleType]}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-right">
                        {item.seatingCapacity}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-right text-teal">
                        ₹{item.perDayRate.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-right text-muted-foreground">
                        {item.isFlatRate
                          ? "Flat"
                          : item.perKmRate > 0
                            ? `₹${item.perKmRate}`
                            : "–"}
                      </TableCell>
                      <TableCell className="font-sans text-xs text-muted-foreground hidden md:table-cell max-w-[150px] truncate">
                        {item.notes || "–"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={() => openEdit(item)}
                            data-ocid={`rates.cab.edit_button.${idx + 1}`}
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-destructive hover:text-destructive/80"
                                data-ocid={`rates.cab.delete_button.${idx + 1}`}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="font-serif">
                                  Delete Cab Rate
                                </AlertDialogTitle>
                                <AlertDialogDescription className="font-sans">
                                  Delete <strong>{item.name}</strong>? This
                                  cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="font-sans">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className="font-sans bg-destructive hover:bg-destructive/90 text-white"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Destination Rates Tab ─────────────────────────────────────────────────────

const DEST_RATES_KEY = "mh_destination_rates";

interface DestinationRate {
  destinationId: string;
  destinationName: string;
  islandGroup: string;
  entryFee: number;
  permitFee: number;
  guideFee: number;
  ferryCharge: number;
  notes: string;
}

function loadDestinationRates(): Record<string, DestinationRate> {
  try {
    const stored = localStorage.getItem(DEST_RATES_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveDestinationRates(rates: Record<string, DestinationRate>): void {
  try {
    localStorage.setItem(DEST_RATES_KEY, JSON.stringify(rates));
  } catch {}
}

function DestinationRatesTab() {
  const destinations = masterDataStore.get().destinations;
  const [rates, setRates] = useState<Record<string, DestinationRate>>(() =>
    loadDestinationRates(),
  );
  const [selectedDestId, setSelectedDestId] = useState("");
  const [form, setForm] = useState({
    entryFee: "",
    permitFee: "",
    guideFee: "",
    ferryCharge: "",
    notes: "",
  });

  const selectedDest = destinations.find((d) => d.id === selectedDestId);
  const existingRate = selectedDestId ? rates[selectedDestId] : null;

  const handleSelectDest = (id: string) => {
    setSelectedDestId(id);
    const existing = rates[id];
    if (existing) {
      setForm({
        entryFee: String(existing.entryFee),
        permitFee: String(existing.permitFee),
        guideFee: String(existing.guideFee),
        ferryCharge: String(existing.ferryCharge),
        notes: existing.notes,
      });
    } else {
      setForm({
        entryFee: "",
        permitFee: "",
        guideFee: "",
        ferryCharge: "",
        notes: "",
      });
    }
  };

  const handleSave = () => {
    if (!selectedDest) {
      toast.error("Please select a destination");
      return;
    }
    const newRate: DestinationRate = {
      destinationId: selectedDest.id,
      destinationName: selectedDest.name,
      islandGroup: selectedDest.islandGroup || "",
      entryFee: Number(form.entryFee) || 0,
      permitFee: Number(form.permitFee) || 0,
      guideFee: Number(form.guideFee) || 0,
      ferryCharge: Number(form.ferryCharge) || 0,
      notes: form.notes,
    };
    const updated = { ...rates, [selectedDest.id]: newRate };
    saveDestinationRates(updated);
    setRates(updated);
    toast.success(`Rates saved for ${selectedDest.name}`);
  };

  const handleDelete = (id: string) => {
    const updated = { ...rates };
    delete updated[id];
    saveDestinationRates(updated);
    setRates(updated);
    if (selectedDestId === id) {
      setSelectedDestId("");
      setForm({
        entryFee: "",
        permitFee: "",
        guideFee: "",
        ferryCharge: "",
        notes: "",
      });
    }
    toast.success("Destination rate deleted");
  };

  // Group destinations by island group for display
  const ratesList = Object.values(rates);

  // Group destinations for the select dropdown
  const groupedDests = destinations.reduce<Record<string, typeof destinations>>(
    (acc, d) => {
      const group = d.islandGroup || "Other";
      if (!acc[group]) acc[group] = [];
      acc[group].push(d);
      return acc;
    },
    {},
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form */}
      <Card className="premium-card lg:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="font-serif text-lg flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gold" />
            Destination Entry Fees
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label className="font-sans text-xs">Select Destination *</Label>
            <Select value={selectedDestId} onValueChange={handleSelectDest}>
              <SelectTrigger
                className="font-sans text-sm"
                data-ocid="rates.destination.select"
              >
                <SelectValue placeholder="Choose destination..." />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {Object.entries(groupedDests).map(([group, dests]) => (
                  <div key={group}>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide bg-muted/30">
                      {group}
                    </div>
                    {dests.map((d) => (
                      <SelectItem
                        key={d.id}
                        value={d.id}
                        className="font-sans text-sm pl-4"
                      >
                        {d.name}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedDest && (
            <div className="bg-gold/5 border border-gold/20 rounded-lg px-3 py-2">
              <p className="text-xs font-sans text-muted-foreground">
                {selectedDest.islandGroup || "Andaman Islands"}
                {existingRate ? " · Rates configured ✓" : " · No rates yet"}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="font-sans text-xs">Entry Fee ₹/person</Label>
              <Input
                type="number"
                min="0"
                value={form.entryFee}
                onChange={(e) =>
                  setForm((f) => ({ ...f, entryFee: e.target.value }))
                }
                placeholder="200"
                className="font-sans text-sm"
                data-ocid="rates.destination.input"
              />
            </div>
            <div className="space-y-1">
              <Label className="font-sans text-xs">Permit Fee ₹/person</Label>
              <Input
                type="number"
                min="0"
                value={form.permitFee}
                onChange={(e) =>
                  setForm((f) => ({ ...f, permitFee: e.target.value }))
                }
                placeholder="0 (RAP for Nicobar)"
                className="font-sans text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="font-sans text-xs">Guide Fee ₹/day</Label>
              <Input
                type="number"
                min="0"
                value={form.guideFee}
                onChange={(e) =>
                  setForm((f) => ({ ...f, guideFee: e.target.value }))
                }
                placeholder="500"
                className="font-sans text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="font-sans text-xs">Ferry Charge ₹/person</Label>
              <Input
                type="number"
                min="0"
                value={form.ferryCharge}
                onChange={(e) =>
                  setForm((f) => ({ ...f, ferryCharge: e.target.value }))
                }
                placeholder="600"
                className="font-sans text-sm"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="font-sans text-xs">Notes</Label>
            <Textarea
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
              placeholder="Special instructions, permit process..."
              rows={2}
              className="font-sans text-sm resize-none"
            />
          </div>
          <Button
            onClick={handleSave}
            disabled={!selectedDestId}
            className="w-full font-sans bg-teal hover:bg-teal-dark text-white"
            data-ocid="rates.destination.save_button"
          >
            <Check className="w-4 h-4 mr-1" />
            {existingRate ? "Update Rates" : "Save Rates"}
          </Button>
        </CardContent>
      </Card>

      {/* Destination Rates Table */}
      <Card className="premium-card lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="font-serif text-lg">
            Configured Destination Rates ({ratesList.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {ratesList.length === 0 ? (
            <p
              className="text-center text-muted-foreground font-sans text-sm py-8"
              data-ocid="rates.destination.empty_state"
            >
              No destination rates configured yet. Select a destination and set
              entry fees above.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-sans text-xs">
                      Destination
                    </TableHead>
                    <TableHead className="font-sans text-xs text-right">
                      Entry
                    </TableHead>
                    <TableHead className="font-sans text-xs text-right">
                      Permit
                    </TableHead>
                    <TableHead className="font-sans text-xs text-right">
                      Guide
                    </TableHead>
                    <TableHead className="font-sans text-xs text-right">
                      Ferry
                    </TableHead>
                    <TableHead className="font-sans text-xs text-right w-20">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ratesList.map((item, idx) => (
                    <TableRow
                      key={item.destinationId}
                      data-ocid={`rates.destination.row.${idx + 1}`}
                    >
                      <TableCell>
                        <div>
                          <p className="font-sans text-sm font-medium">
                            {item.destinationName}
                          </p>
                          <p className="font-sans text-xs text-muted-foreground">
                            {item.islandGroup}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-right text-teal">
                        {item.entryFee > 0 ? `₹${item.entryFee}` : "–"}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-right text-amber-400">
                        {item.permitFee > 0 ? `₹${item.permitFee}` : "–"}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-right text-muted-foreground">
                        {item.guideFee > 0 ? `₹${item.guideFee}` : "–"}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-right text-muted-foreground">
                        {item.ferryCharge > 0 ? `₹${item.ferryCharge}` : "–"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={() => handleSelectDest(item.destinationId)}
                            data-ocid={`rates.destination.edit_button.${idx + 1}`}
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-destructive hover:text-destructive/80"
                                data-ocid={`rates.destination.delete_button.${idx + 1}`}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="font-serif">
                                  Delete Destination Rate
                                </AlertDialogTitle>
                                <AlertDialogDescription className="font-sans">
                                  Remove rates for{" "}
                                  <strong>{item.destinationName}</strong>? This
                                  cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="font-sans">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className="font-sans bg-destructive hover:bg-destructive/90 text-white"
                                  onClick={() =>
                                    handleDelete(item.destinationId)
                                  }
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Markup Tab ───────────────────────────────────────────────────────────────

const APPLIES_TO_OPTIONS = Object.entries(MARKUP_APPLIES_TO_LABELS) as [
  MarkupRule["appliesTo"],
  string,
][];

const TYPE_OPTIONS = Object.entries(MARKUP_TYPE_LABELS) as [
  MarkupRule["type"],
  string,
][];

function MarkupTab() {
  const isAdmin = useIsAdmin();
  const [rules, setRules] = useState<MarkupRule[]>(() =>
    markupStore.getRules(),
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    type: "percentage" as MarkupRule["type"],
    value: "",
    appliesTo: "all" as MarkupRule["appliesTo"],
    notes: "",
  });

  const resetForm = () => {
    setForm({
      name: "",
      type: "percentage",
      value: "",
      appliesTo: "all",
      notes: "",
    });
    setEditingId(null);
  };

  const openEdit = (rule: MarkupRule) => {
    setEditingId(rule.id);
    setForm({
      name: rule.name,
      type: rule.type,
      value: String(rule.value),
      appliesTo: rule.appliesTo,
      notes: rule.notes,
    });
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Markup name is required");
      return;
    }
    const val = Number(form.value);
    if (Number.isNaN(val) || val <= 0) {
      toast.error("Enter a valid markup value greater than 0");
      return;
    }
    if (form.type === "percentage" && val > 100) {
      toast.error("Percentage markup cannot exceed 100%");
      return;
    }
    if (editingId) {
      markupStore.updateRule(editingId, {
        name: form.name.trim(),
        type: form.type,
        value: val,
        appliesTo: form.appliesTo,
        notes: form.notes,
      });
      toast.success("Markup rule updated");
    } else {
      markupStore.addRule({
        name: form.name.trim(),
        type: form.type,
        value: val,
        appliesTo: form.appliesTo,
        notes: form.notes,
      });
      toast.success("Markup rule created");
    }
    setRules(markupStore.getRules());
    resetForm();
  };

  const handleDelete = (id: string) => {
    markupStore.deleteRule(id);
    setRules(markupStore.getRules());
    toast.success("Markup rule deleted");
  };

  const handleToggle = (id: string) => {
    markupStore.toggleRule(id);
    setRules(markupStore.getRules());
  };

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-3">
        <Percent className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
        <div>
          <p className="font-sans text-sm font-semibold text-amber-300">
            Internal Use Only
          </p>
          <p className="font-sans text-xs text-amber-400/80 mt-0.5">
            Markup rates are visible only to admin and staff. They are never
            shown in guest bills, booking confirmations, or printed/shared
            package documents.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add / Edit Form (admin only) */}
        <Card className="premium-card lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="font-serif text-lg flex items-center gap-2">
              <Percent className="w-4 h-4 text-gold" />
              {editingId ? "Edit Markup Rule" : "New Markup Rule"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!isAdmin && (
              <div className="bg-muted/30 border border-border rounded-md px-3 py-2 text-xs font-sans text-muted-foreground">
                Only the admin can create or edit markup rules.
              </div>
            )}
            <div className="space-y-1">
              <Label className="font-sans text-xs">Rule Name *</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. Agent Commission, Festival Surcharge"
                className="font-sans text-sm"
                disabled={!isAdmin}
                data-ocid="markup.name.input"
              />
            </div>
            <div className="space-y-1">
              <Label className="font-sans text-xs">Markup Type</Label>
              <Select
                value={form.type}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, type: v as MarkupRule["type"] }))
                }
                disabled={!isAdmin}
              >
                <SelectTrigger
                  className="font-sans text-sm"
                  data-ocid="markup.type.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map(([val, label]) => (
                    <SelectItem
                      key={val}
                      value={val}
                      className="font-sans text-sm"
                    >
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="font-sans text-xs">
                {form.type === "percentage"
                  ? "Percentage (%)"
                  : "Fixed Amount (₹)"}
              </Label>
              <Input
                type="number"
                min="0"
                max={form.type === "percentage" ? "100" : undefined}
                step={form.type === "percentage" ? "0.5" : "1"}
                value={form.value}
                onChange={(e) =>
                  setForm((f) => ({ ...f, value: e.target.value }))
                }
                placeholder={form.type === "percentage" ? "15" : "500"}
                className="font-sans text-sm"
                disabled={!isAdmin}
                data-ocid="markup.value.input"
              />
            </div>
            <div className="space-y-1">
              <Label className="font-sans text-xs">Applies To</Label>
              <Select
                value={form.appliesTo}
                onValueChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    appliesTo: v as MarkupRule["appliesTo"],
                  }))
                }
                disabled={!isAdmin}
              >
                <SelectTrigger
                  className="font-sans text-sm"
                  data-ocid="markup.applies_to.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {APPLIES_TO_OPTIONS.map(([val, label]) => (
                    <SelectItem
                      key={val}
                      value={val}
                      className="font-sans text-sm"
                    >
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="font-sans text-xs">Internal Notes</Label>
              <Textarea
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                placeholder="e.g. Applied for corporate bookings"
                rows={2}
                className="font-sans text-sm resize-none"
                disabled={!isAdmin}
              />
            </div>
            {isAdmin && (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  className="flex-1 font-sans bg-gold hover:bg-gold/80 text-background"
                  data-ocid="markup.save_button"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {editingId ? "Update Rule" : "Create Rule"}
                </Button>
                {editingId && (
                  <Button
                    variant="outline"
                    onClick={resetForm}
                    className="font-sans"
                    data-ocid="markup.cancel_button"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rules Table */}
        <Card className="premium-card lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="font-serif text-lg">
              Markup Rules ({rules.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {rules.length === 0 ? (
              <div
                className="text-center py-12"
                data-ocid="markup.rules.empty_state"
              >
                <Percent className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                <p className="font-sans text-sm text-muted-foreground">
                  No markup rules created yet.
                </p>
                <p className="font-sans text-xs text-muted-foreground/60 mt-1">
                  Create a rule above, then apply it to any booking or invoice.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-sans text-xs">Name</TableHead>
                      <TableHead className="font-sans text-xs">Type</TableHead>
                      <TableHead className="font-sans text-xs text-right">
                        Value
                      </TableHead>
                      <TableHead className="font-sans text-xs">
                        Applies To
                      </TableHead>
                      <TableHead className="font-sans text-xs text-center">
                        Active
                      </TableHead>
                      {isAdmin && (
                        <TableHead className="font-sans text-xs text-right w-20">
                          Actions
                        </TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rules.map((rule, idx) => (
                      <TableRow
                        key={rule.id}
                        data-ocid={`markup.rules.row.${idx + 1}`}
                        className={!rule.isActive ? "opacity-50" : ""}
                      >
                        <TableCell>
                          <div>
                            <p className="font-sans text-sm font-medium">
                              {rule.name}
                            </p>
                            {rule.notes && (
                              <p className="font-sans text-xs text-muted-foreground truncate max-w-[180px]">
                                {rule.notes}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`text-xs font-sans px-2 py-0.5 rounded-full border ${
                              rule.type === "percentage"
                                ? "bg-teal/10 text-teal border-teal/20"
                                : "bg-gold/10 text-gold border-gold/20"
                            }`}
                          >
                            {rule.type === "percentage" ? "%" : "₹ Fixed"}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono text-sm text-right font-bold text-amber-400">
                          {rule.type === "percentage"
                            ? `${rule.value}%`
                            : `₹${rule.value.toLocaleString()}`}
                        </TableCell>
                        <TableCell className="font-sans text-xs text-muted-foreground">
                          {MARKUP_APPLIES_TO_LABELS[rule.appliesTo]}
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={rule.isActive}
                            onCheckedChange={() => handleToggle(rule.id)}
                            disabled={!isAdmin}
                            data-ocid={`markup.rules.toggle.${idx + 1}`}
                          />
                        </TableCell>
                        {isAdmin && (
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                onClick={() => openEdit(rule)}
                                data-ocid={`markup.rules.edit_button.${idx + 1}`}
                              >
                                <Pencil className="w-3 h-3" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-destructive hover:text-destructive/80"
                                    data-ocid={`markup.rules.delete_button.${idx + 1}`}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="font-serif">
                                      Delete Markup Rule
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="font-sans">
                                      Delete{" "}
                                      <strong>&quot;{rule.name}&quot;</strong>?
                                      Any applied markups using this rule will
                                      also be removed. This cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="font-sans">
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      className="font-sans bg-destructive hover:bg-destructive/90 text-white"
                                      onClick={() => handleDelete(rule.id)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* How Markup Works info card */}
      <Card className="premium-card border-gold/20">
        <CardHeader className="pb-2">
          <CardTitle className="font-serif text-base text-gold">
            How Markup Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-sans text-muted-foreground">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-gold/20 text-gold flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                1
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">
                  Create Rules Here
                </p>
                <p className="text-xs">
                  Define markup rules as a percentage or fixed amount. Set which
                  booking type they apply to.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-gold/20 text-gold flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                2
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">
                  Apply to Invoices
                </p>
                <p className="text-xs">
                  Go to Invoices and use &quot;Apply Markup&quot; on any invoice
                  to attach a rule. The markup amount is calculated and stored
                  internally.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-gold/20 text-gold flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                3
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">
                  Hidden from Guests
                </p>
                <p className="text-xs">
                  Markup details never appear in the guest bill or printed
                  invoice. Only admin and staff see the internal breakdown.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RateManagementPage() {
  // Food
  const { data: foodRates = [], isLoading: loadingFood } = useGetAllFoodRates();
  const { mutateAsync: addFood, isPending: addingFood } =
    useAddOrUpdateFoodRate();
  const { mutateAsync: deleteFood, isPending: deletingFood } =
    useDeleteFoodRate();

  // Travel
  const { data: travelRates = [], isLoading: loadingTravel } =
    useGetAllTravelRates();
  const { mutateAsync: addTravel, isPending: addingTravel } =
    useAddOrUpdateTravelRate();
  const { mutateAsync: deleteTravel, isPending: deletingTravel } =
    useDeleteTravelRate();

  // Activities
  const { data: activityRates = [], isLoading: loadingActivity } =
    useGetAllActivityRates();
  const { mutateAsync: addActivity, isPending: addingActivity } =
    useAddOrUpdateActivityRate();
  const { mutateAsync: deleteActivity, isPending: deletingActivity } =
    useDeleteActivityRate();

  // Boating
  const { data: boatingRates = [], isLoading: loadingBoating } =
    useGetAllBoatingRates();
  const { mutateAsync: addBoating, isPending: addingBoating } =
    useAddOrUpdateBoatingRate();
  const { mutateAsync: deleteBoating, isPending: deletingBoating } =
    useDeleteBoatingRate();

  // Add-ons
  const { data: addOnRates = [], isLoading: loadingAddOn } =
    useGetAllAddOnRates();
  const { mutateAsync: addAddOn, isPending: addingAddOn } =
    useAddOrUpdateAddOnRate();
  const { mutateAsync: deleteAddOn, isPending: deletingAddOn } =
    useDeleteAddOnRate();

  const makeHandlers = (
    addFn: (args: { name: string; price: bigint }) => Promise<void>,
    deleteFn: (name: string) => Promise<void>,
    label: string,
  ) => ({
    onAdd: async (name: string, price: number) => {
      try {
        await addFn({ name, price: BigInt(price) });
        toast.success(`${label} added!`);
      } catch {
        toast.error(`Failed to add ${label.toLowerCase()}`);
      }
    },
    onUpdate: async (name: string, price: number) => {
      try {
        await addFn({ name, price: BigInt(price) });
        toast.success(`${label} updated!`);
      } catch {
        toast.error(`Failed to update ${label.toLowerCase()}`);
      }
    },
    onDelete: async (name: string) => {
      try {
        await deleteFn(name);
        toast.success(`${label} deleted`);
      } catch {
        toast.error(`Failed to delete ${label.toLowerCase()}`);
      }
    },
  });

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-foreground">
          Rate Management
        </h2>
        <p className="text-sm text-muted-foreground font-sans">
          Configure pricing for hotels, food, travel, activities, boating, and
          add-ons used in package calculations.
        </p>
      </div>

      <Tabs defaultValue="foodmenu" className="w-full">
        <TabsList className="mb-6 flex flex-wrap gap-1 h-auto">
          <TabsTrigger
            value="foodmenu"
            className="font-sans text-xs"
            data-ocid="rates.food_menu.tab"
          >
            <UtensilsCrossed className="w-3.5 h-3.5 mr-1.5" />
            Food Menu
          </TabsTrigger>
          <TabsTrigger value="hotels" className="font-sans text-xs">
            <Hotel className="w-3.5 h-3.5 mr-1.5" />
            Hotels
          </TabsTrigger>
          <TabsTrigger value="food" className="font-sans text-xs">
            <Utensils className="w-3.5 h-3.5 mr-1.5" />
            Food Packages
          </TabsTrigger>
          <TabsTrigger value="travel" className="font-sans text-xs">
            <Car className="w-3.5 h-3.5 mr-1.5" />
            Travel/Transport
          </TabsTrigger>
          <TabsTrigger value="activities" className="font-sans text-xs">
            <Waves className="w-3.5 h-3.5 mr-1.5" />
            Activities
          </TabsTrigger>
          <TabsTrigger value="boating" className="font-sans text-xs">
            <Anchor className="w-3.5 h-3.5 mr-1.5" />
            Boating
          </TabsTrigger>
          <TabsTrigger value="addons" className="font-sans text-xs">
            <Star className="w-3.5 h-3.5 mr-1.5" />
            Add-ons
          </TabsTrigger>
          <TabsTrigger
            value="cabrates"
            className="font-sans text-xs"
            data-ocid="rates.cab.tab"
          >
            <Car className="w-3.5 h-3.5 mr-1.5" />
            Cab Rates
          </TabsTrigger>
          <TabsTrigger
            value="destrates"
            className="font-sans text-xs"
            data-ocid="rates.destination.tab"
          >
            <MapPin className="w-3.5 h-3.5 mr-1.5" />
            Destination Fees
          </TabsTrigger>
          <TabsTrigger
            value="markup"
            className="font-sans text-xs border border-amber-500/30 data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300"
            data-ocid="rates.markup.tab"
          >
            <Percent className="w-3.5 h-3.5 mr-1.5" />
            Markup Rates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="foodmenu">
          <FoodMenuTab />
        </TabsContent>

        <TabsContent value="hotels">
          <HotelsTab />
        </TabsContent>

        <TabsContent value="food">
          <RateOptionTab
            label="Food Package"
            items={foodRates}
            isLoading={loadingFood}
            isSaving={addingFood}
            isDeleting={deletingFood}
            namePlaceholder="e.g. Standard Meals, Premium Buffet"
            priceLabel="Price per Person"
            {...makeHandlers(addFood, deleteFood, "Food package")}
          />
        </TabsContent>

        <TabsContent value="travel">
          <RateOptionTab
            label="Travel Option"
            items={travelRates}
            isLoading={loadingTravel}
            isSaving={addingTravel}
            isDeleting={deletingTravel}
            namePlaceholder="e.g. AC Bus, Private Car, Flight"
            priceLabel="Price per Vehicle"
            {...makeHandlers(addTravel, deleteTravel, "Travel option")}
          />
        </TabsContent>

        <TabsContent value="activities">
          <RateOptionTab
            label="Activity"
            items={activityRates}
            isLoading={loadingActivity}
            isSaving={addingActivity}
            isDeleting={deletingActivity}
            namePlaceholder="e.g. City Tour, Safari, Trekking"
            priceLabel="Price per Person"
            {...makeHandlers(addActivity, deleteActivity, "Activity")}
          />
        </TabsContent>

        <TabsContent value="boating">
          <RateOptionTab
            label="Boating Package"
            items={boatingRates}
            isLoading={loadingBoating}
            isSaving={addingBoating}
            isDeleting={deletingBoating}
            namePlaceholder="e.g. Shikara Ride, Houseboat, Cruise"
            priceLabel="Package Price"
            {...makeHandlers(addBoating, deleteBoating, "Boating package")}
          />
        </TabsContent>

        <TabsContent value="addons">
          <RateOptionTab
            label="Add-on"
            items={addOnRates}
            isLoading={loadingAddOn}
            isSaving={addingAddOn}
            isDeleting={deletingAddOn}
            namePlaceholder="e.g. Travel Insurance, Photography"
            priceLabel="Price"
            {...makeHandlers(addAddOn, deleteAddOn, "Add-on")}
          />
        </TabsContent>

        <TabsContent value="cabrates">
          <CabRatesTab />
        </TabsContent>

        <TabsContent value="destrates">
          <DestinationRatesTab />
        </TabsContent>

        <TabsContent value="markup">
          <MarkupTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
