import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  CalendarDays,
  Edit,
  Hotel,
  Loader2,
  MapPin,
  Plus,
  Trash2,
  Utensils,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ItineraryDay } from "../backend.d.ts";
import {
  useAddItineraryDay,
  useDeleteItineraryDay,
  useGetItineraryByPackage,
  useGetPackages,
  useUpdateItineraryDay,
} from "../hooks/useQueries";

const defaultDayForm = {
  dayNumber: "1",
  date: "",
  title: "",
  description: "",
  activities: "",
  hotel: "",
  meals: "",
  notes: "",
};

export default function ItineraryBuilderPage() {
  const { data: packages = [], isLoading: pkgsLoading } = useGetPackages();
  const [selectedPackageId, setSelectedPackageId] = useState<bigint | null>(
    null,
  );
  const { data: days = [], isLoading: daysLoading } =
    useGetItineraryByPackage(selectedPackageId);
  const { mutateAsync: addDay, isPending: isAdding } = useAddItineraryDay();
  const { mutateAsync: updateDay, isPending: isUpdating } =
    useUpdateItineraryDay();
  const { mutateAsync: deleteDay } = useDeleteItineraryDay();

  const [showModal, setShowModal] = useState(false);
  const [editingDay, setEditingDay] = useState<ItineraryDay | null>(null);
  const [form, setForm] = useState(defaultDayForm);

  const update = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const openAddModal = () => {
    setEditingDay(null);
    const maxDay =
      days.length > 0 ? Math.max(...days.map((d) => Number(d.dayNumber))) : 0;
    setForm({ ...defaultDayForm, dayNumber: String(maxDay + 1) });
    setShowModal(true);
  };

  const openEditModal = (day: ItineraryDay) => {
    setEditingDay(day);
    setForm({
      dayNumber: String(day.dayNumber),
      date: day.date,
      title: day.title,
      description: day.description,
      activities: day.activities.join("\n"),
      hotel: day.hotel,
      meals: day.meals,
      notes: day.notes,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!selectedPackageId) {
      toast.error("Select a package first");
      return;
    }
    if (!form.title.trim()) {
      toast.error("Day title is required");
      return;
    }
    const activitiesList = form.activities
      .split("\n")
      .map((a) => a.trim())
      .filter(Boolean);

    try {
      if (editingDay) {
        await updateDay({
          ...editingDay,
          dayNumber: BigInt(form.dayNumber || "1"),
          date: form.date,
          title: form.title,
          description: form.description,
          activities: activitiesList,
          hotel: form.hotel,
          meals: form.meals,
          notes: form.notes,
        });
        toast.success("Itinerary day updated!");
      } else {
        await addDay({
          packageId: selectedPackageId,
          dayNumber: BigInt(form.dayNumber || "1"),
          date: form.date,
          title: form.title,
          description: form.description,
          activities: activitiesList,
          hotel: form.hotel,
          meals: form.meals,
          notes: form.notes,
        });
        toast.success("Itinerary day added!");
      }
      setShowModal(false);
      setForm(defaultDayForm);
      setEditingDay(null);
    } catch {
      toast.error("Failed to save itinerary day");
    }
  };

  const handleDelete = async (day: ItineraryDay) => {
    if (!selectedPackageId) return;
    try {
      await deleteDay({ dayId: day.id, packageId: selectedPackageId });
      toast.success("Day removed");
    } catch {
      toast.error("Failed to delete day");
    }
  };

  const sortedDays = [...days].sort(
    (a, b) => Number(a.dayNumber) - Number(b.dayNumber),
  );

  const selectedPackage = packages.find((p) => p.id === selectedPackageId);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-sidebar border-b border-border px-4 py-5">
        <div className="container mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              <span className="text-gradient-gold">Itinerary Builder</span>
            </h2>
            <p className="text-sm text-muted-foreground font-sans mt-0.5">
              Build day-by-day travel itineraries for your packages
            </p>
          </div>
          {selectedPackageId && (
            <Button
              onClick={openAddModal}
              className="gradient-gold text-sidebar font-display font-bold shadow-gold"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Day
            </Button>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Package Selector */}
        <Card className="premium-card">
          <CardContent className="pt-5">
            <div className="space-y-2">
              <Label className="text-xs font-sans text-muted-foreground uppercase tracking-wide">
                Select Package
              </Label>
              {pkgsLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-sans">Loading packages...</span>
                </div>
              ) : packages.length === 0 ? (
                <p className="text-sm text-muted-foreground font-sans">
                  No packages found. Create a package first.
                </p>
              ) : (
                <Select
                  value={selectedPackageId ? String(selectedPackageId) : ""}
                  onValueChange={(v) => setSelectedPackageId(BigInt(v))}
                >
                  <SelectTrigger className="font-sans text-sm max-w-md">
                    <SelectValue placeholder="Choose a package to build itinerary for..." />
                  </SelectTrigger>
                  <SelectContent>
                    {packages.map((pkg) => (
                      <SelectItem
                        key={String(pkg.id)}
                        value={String(pkg.id)}
                        className="font-sans text-sm"
                      >
                        {pkg.guest.name} — {pkg.category}
                        {pkg.guest.travelDates
                          ? ` (${pkg.guest.travelDates})`
                          : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            {selectedPackage && (
              <div className="flex gap-3 mt-3 flex-wrap">
                <Badge
                  variant="outline"
                  className="font-sans text-xs border-gold/30 text-gold bg-gold/5"
                >
                  {selectedPackage.category}
                </Badge>
                {selectedPackage.guest.travelDates && (
                  <Badge
                    variant="outline"
                    className="font-sans text-xs border-border text-muted-foreground"
                  >
                    <CalendarDays className="w-3 h-3 mr-1" />
                    {selectedPackage.guest.travelDates}
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className="font-sans text-xs border-teal/30 text-teal bg-teal/5"
                >
                  {days.length} days planned
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Itinerary Days */}
        {selectedPackageId &&
          (daysLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
          ) : sortedDays.length === 0 ? (
            <Card className="premium-card">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <CalendarDays className="w-14 h-14 text-muted-foreground/20 mb-4" />
                <h3 className="font-display font-semibold text-foreground mb-1">
                  No itinerary days yet
                </h3>
                <p className="text-sm text-muted-foreground font-sans mb-4 text-center max-w-xs">
                  Start building the day-by-day schedule for this package
                </p>
                <Button
                  onClick={openAddModal}
                  className="gradient-gold text-sidebar font-display font-bold shadow-gold"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add First Day
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sortedDays.map((day, idx) => (
                <Card
                  key={String(day.id)}
                  className="premium-card hover:border-gold/30 transition-all"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
                          <span className="text-sm font-display font-bold text-gold">
                            D{Number(day.dayNumber)}
                          </span>
                        </div>
                        <div>
                          <CardTitle className="font-display text-base text-foreground">
                            {day.title}
                          </CardTitle>
                          {day.date && (
                            <p className="text-xs text-muted-foreground font-sans mt-0.5">
                              {day.date}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditModal(day)}
                          className="font-sans text-xs border-gold/30 text-gold hover:bg-gold/10"
                        >
                          <Edit className="w-3.5 h-3.5 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(day)}
                          className="font-sans text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    {day.description && (
                      <p className="text-sm font-sans text-foreground/90">
                        {day.description}
                      </p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {day.hotel && (
                        <div className="flex items-start gap-2 bg-sidebar/60 rounded-lg p-2.5">
                          <Hotel className="w-3.5 h-3.5 text-gold mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[10px] text-muted-foreground font-sans uppercase tracking-wide">
                              Hotel
                            </p>
                            <p className="text-xs font-sans text-foreground">
                              {day.hotel}
                            </p>
                          </div>
                        </div>
                      )}
                      {day.meals && (
                        <div className="flex items-start gap-2 bg-sidebar/60 rounded-lg p-2.5">
                          <Utensils className="w-3.5 h-3.5 text-teal mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[10px] text-muted-foreground font-sans uppercase tracking-wide">
                              Meals
                            </p>
                            <p className="text-xs font-sans text-foreground">
                              {day.meals}
                            </p>
                          </div>
                        </div>
                      )}
                      {day.activities.length > 0 && (
                        <div className="flex items-start gap-2 bg-sidebar/60 rounded-lg p-2.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[10px] text-muted-foreground font-sans uppercase tracking-wide">
                              Activities
                            </p>
                            <p className="text-xs font-sans text-foreground">
                              {day.activities.join(", ")}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {day.notes && (
                      <p className="text-xs font-sans text-muted-foreground bg-sidebar/40 rounded-lg px-3 py-2 italic">
                        📝 {day.notes}
                      </p>
                    )}

                    {/* Timeline connector */}
                    {idx < sortedDays.length - 1 && (
                      <div className="flex items-center gap-2 pt-1">
                        <div className="w-0.5 h-4 bg-border/60 mx-5" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ))}

        {!selectedPackageId && packages.length > 0 && (
          <div className="text-center py-16">
            <CalendarDays className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground font-sans">
              Select a package above to view or build its itinerary
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Day Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              {editingDay ? "Edit Itinerary Day" : "Add Itinerary Day"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-sans">Day Number *</Label>
                <Input
                  type="number"
                  value={form.dayNumber}
                  onChange={(e) => update("dayNumber", e.target.value)}
                  min="1"
                  className="font-sans text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">Date</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                  className="font-sans text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-sans">Day Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Arrival & City Tour"
                className="font-sans text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-sans">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Brief overview of the day's plan..."
                rows={2}
                className="font-sans text-sm resize-none"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-sans">
                Activities (one per line)
              </Label>
              <Textarea
                value={form.activities}
                onChange={(e) => update("activities", e.target.value)}
                placeholder={"Visit Taj Mahal\nLocal shopping\nEvening cruise"}
                rows={3}
                className="font-sans text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-sans">Hotel</Label>
                <Input
                  value={form.hotel}
                  onChange={(e) => update("hotel", e.target.value)}
                  placeholder="Taj Palace Hotel"
                  className="font-sans text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">Meals Included</Label>
                <Input
                  value={form.meals}
                  onChange={(e) => update("meals", e.target.value)}
                  placeholder="Breakfast, Dinner"
                  className="font-sans text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-sans">Notes</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                placeholder="Any special notes for this day..."
                rows={2}
                className="font-sans text-sm resize-none"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isAdding || isUpdating}
              className="w-full gradient-gold text-sidebar font-display font-bold"
            >
              {isAdding || isUpdating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              {editingDay ? "Update Day" : "Add Day"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
