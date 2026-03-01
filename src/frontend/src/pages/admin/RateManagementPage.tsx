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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import {
  Anchor,
  Car,
  Check,
  Hotel,
  Loader2,
  Pencil,
  Plus,
  Star,
  Trash2,
  Utensils,
  Waves,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { HotelRate, RateOption } from "../../backend";
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
  useGetCallerUserProfile,
  useGetHotelRates,
  useUpdateHotelRate,
} from "../../hooks/useQueries";

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

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RateManagementPage() {
  const { data: userProfile } = useGetCallerUserProfile();
  const navigate = useNavigate();
  const isAdmin = userProfile?.role === "admin";

  useEffect(() => {
    if (userProfile && !isAdmin) {
      navigate({ to: "/" });
    }
  }, [userProfile, isAdmin, navigate]);

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

  if (!isAdmin) return null;

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

      <Tabs defaultValue="hotels" className="w-full">
        <TabsList className="mb-6 flex flex-wrap gap-1 h-auto">
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
        </TabsList>

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
      </Tabs>
    </div>
  );
}
