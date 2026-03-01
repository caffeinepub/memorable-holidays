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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calculator,
  CalendarDays,
  Edit,
  Eye,
  Hotel,
  Layout,
  Loader2,
  MapPin,
  Plus,
  Save,
  Trash2,
  User,
  Utensils,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { ItineraryDay } from "../backend.d.ts";
import DragDropEditor from "../components/editor/DragDropEditor";
import GuestDetailsForm from "../components/editor/GuestDetailsForm";
import PackageTemplatePreview from "../components/editor/PackageTemplatePreview";
import RateCalculatorPanel from "../components/editor/RateCalculatorPanel";
import {
  useAddItineraryDay,
  useDeleteItineraryDay,
  useGetItineraryByPackage,
  useSavePackage,
  useUpdateItineraryDay,
} from "../hooks/useQueries";
import { type ContentBlock, packageStore } from "../lib/packageStore";

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

export default function PackageEditorPage() {
  const navigate = useNavigate();
  const [editorState, setEditorState] = useState(packageStore.get());
  const { mutateAsync: savePackage, isPending: isSaving } = useSavePackage();

  // Itinerary state
  const packageId = editorState.packageId
    ? BigInt(editorState.packageId)
    : null;
  const { data: itineraryDays = [] } = useGetItineraryByPackage(packageId);
  const { mutateAsync: addDay, isPending: isAddingDay } = useAddItineraryDay();
  const { mutateAsync: updateDay, isPending: isUpdatingDay } =
    useUpdateItineraryDay();
  const { mutateAsync: deleteDay } = useDeleteItineraryDay();
  const [showDayModal, setShowDayModal] = useState(false);
  const [editingDay, setEditingDay] = useState<ItineraryDay | null>(null);
  const [dayForm, setDayForm] = useState(defaultDayForm);

  const updateState = useCallback((updates: Partial<typeof editorState>) => {
    packageStore.set(updates);
    setEditorState(packageStore.get());
  }, []);

  const updateDayForm = (k: keyof typeof defaultDayForm, v: string) =>
    setDayForm((p) => ({ ...p, [k]: v }));

  const openAddDayModal = () => {
    setEditingDay(null);
    const maxDay =
      itineraryDays.length > 0
        ? Math.max(...itineraryDays.map((d) => Number(d.dayNumber)))
        : 0;
    setDayForm({ ...defaultDayForm, dayNumber: String(maxDay + 1) });
    setShowDayModal(true);
  };

  const openEditDayModal = (day: ItineraryDay) => {
    setEditingDay(day);
    setDayForm({
      dayNumber: String(day.dayNumber),
      date: day.date,
      title: day.title,
      description: day.description,
      activities: day.activities.join("\n"),
      hotel: day.hotel,
      meals: day.meals,
      notes: day.notes,
    });
    setShowDayModal(true);
  };

  const handleDaySubmit = async () => {
    if (!packageId) {
      toast.error("Save the package first to add itinerary days");
      return;
    }
    if (!dayForm.title.trim()) {
      toast.error("Day title is required");
      return;
    }
    const activitiesList = dayForm.activities
      .split("\n")
      .map((a) => a.trim())
      .filter(Boolean);
    try {
      if (editingDay) {
        await updateDay({
          ...editingDay,
          dayNumber: BigInt(dayForm.dayNumber || "1"),
          date: dayForm.date,
          title: dayForm.title,
          description: dayForm.description,
          activities: activitiesList,
          hotel: dayForm.hotel,
          meals: dayForm.meals,
          notes: dayForm.notes,
        });
        toast.success("Day updated!");
      } else {
        await addDay({
          packageId,
          dayNumber: BigInt(dayForm.dayNumber || "1"),
          date: dayForm.date,
          title: dayForm.title,
          description: dayForm.description,
          activities: activitiesList,
          hotel: dayForm.hotel,
          meals: dayForm.meals,
          notes: dayForm.notes,
        });
        toast.success("Day added!");
      }
      setShowDayModal(false);
      setDayForm(defaultDayForm);
      setEditingDay(null);
    } catch {
      toast.error("Failed to save day");
    }
  };

  const handleDeleteDay = async (day: ItineraryDay) => {
    if (!packageId) return;
    try {
      await deleteDay({ dayId: day.id, packageId });
      toast.success("Day removed");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleSave = async () => {
    const state = packageStore.get();
    if (!state.guestName) {
      toast.error("Please enter guest name before saving");
      return;
    }
    const now = BigInt(Date.now() * 1_000_000);
    const pkgId = state.packageId
      ? BigInt(state.packageId)
      : BigInt(Date.now());
    try {
      await savePackage({
        id: pkgId,
        category: state.category,
        templateId: BigInt(state.templateId),
        guest: {
          name: state.guestName,
          contactNumber: state.contactNumber,
          email: state.email,
          whatsapp: state.whatsapp,
          adults: BigInt(state.adults),
          children: BigInt(state.children),
          travelDates: state.travelDates,
          notes: state.notes,
        },
        hotel: state.hotel,
        roomType: state.roomType,
        foodPackage: state.foodPackage,
        travelOption: state.travelOption,
        activities: state.activities,
        boating: state.boating,
        addOns: state.addOns,
        totalCost: BigInt(state.totalCost),
        createdBy: {} as any,
        createdAt: now,
        lastModified: now,
      });
      toast.success("Package saved successfully!");
    } catch {
      toast.error("Failed to save package");
    }
  };

  const handlePreview = () => {
    packageStore.set(editorState);
    navigate({ to: "/preview" });
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-background animate-fade-in">
      {/* Sticky Toolbar */}
      <div className="sticky top-[8.5rem] z-30 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: "/categories" })}
              className="font-sans shrink-0 border-border/60"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-display font-bold text-foreground">
                  Package Editor
                </h2>
                <Badge
                  variant="outline"
                  className="text-xs font-sans capitalize border-border/50 text-muted-foreground hidden sm:flex"
                >
                  {editorState.category}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs font-sans capitalize border-gold/30 text-gold hidden sm:flex"
                >
                  {editorState.templateDesign}
                </Badge>
              </div>
              {editorState.totalCost > 0 && (
                <p className="text-xs text-gold font-mono font-semibold mt-0.5">
                  Total: ₹{editorState.totalCost.toLocaleString()}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreview}
              className="font-sans border-teal/40 text-teal hover:bg-teal/10 hover:border-teal/60"
            >
              <Eye className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Preview</span>
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="font-sans gradient-gold text-sidebar font-medium shadow-gold"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-1" />
              )}
              <span className="hidden sm:inline">Save</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Left: Editor Panels — 2 cols */}
          <div className="xl:col-span-2">
            <Tabs defaultValue="guest" className="w-full">
              <TabsList className="w-full grid grid-cols-4 mb-4 bg-card border border-border/50 h-11">
                <TabsTrigger
                  value="guest"
                  className="font-sans text-xs gap-1.5 data-[state=active]:text-foreground"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Guest</span>
                </TabsTrigger>
                <TabsTrigger
                  value="rates"
                  className="font-sans text-xs gap-1.5 data-[state=active]:text-foreground"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Rates</span>
                </TabsTrigger>
                <TabsTrigger
                  value="content"
                  className="font-sans text-xs gap-1.5 data-[state=active]:text-foreground"
                >
                  <Layout className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Content</span>
                </TabsTrigger>
                <TabsTrigger
                  value="itinerary"
                  className="font-sans text-xs gap-1.5 data-[state=active]:text-foreground"
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Itinerary</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="guest" className="mt-0">
                <GuestDetailsForm state={editorState} onChange={updateState} />
              </TabsContent>
              <TabsContent value="rates" className="mt-0">
                <RateCalculatorPanel
                  state={editorState}
                  onChange={updateState}
                />
              </TabsContent>
              <TabsContent value="content" className="mt-0">
                <DragDropEditor
                  blocks={editorState.contentBlocks}
                  onChange={(blocks: ContentBlock[]) =>
                    updateState({ contentBlocks: blocks })
                  }
                />
              </TabsContent>
              <TabsContent value="itinerary" className="mt-0">
                {!packageId ? (
                  <Card className="premium-card">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <CalendarDays className="w-12 h-12 text-muted-foreground/20 mb-3" />
                      <p className="text-sm text-muted-foreground font-sans text-center">
                        Save the package first to add itinerary days
                      </p>
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="mt-4 gradient-gold text-sidebar font-sans shadow-gold"
                      >
                        {isSaving ? (
                          <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                        ) : (
                          <Save className="w-3.5 h-3.5 mr-1" />
                        )}
                        Save Package
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-sans text-muted-foreground">
                        {itineraryDays.length} day
                        {itineraryDays.length !== 1 ? "s" : ""} planned
                      </p>
                      <Button
                        size="sm"
                        onClick={openAddDayModal}
                        className="gradient-gold text-sidebar font-sans shadow-gold"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        Add Day
                      </Button>
                    </div>
                    {itineraryDays.length === 0 ? (
                      <Card className="premium-card">
                        <CardContent className="flex flex-col items-center justify-center py-10">
                          <CalendarDays className="w-10 h-10 text-muted-foreground/20 mb-3" />
                          <p className="text-sm text-muted-foreground font-sans">
                            No itinerary days yet
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={openAddDayModal}
                            className="mt-3 border-gold/40 text-gold hover:bg-gold/10 font-sans"
                          >
                            <Plus className="w-3.5 h-3.5 mr-1" />
                            Add First Day
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      [...itineraryDays]
                        .sort(
                          (a, b) => Number(a.dayNumber) - Number(b.dayNumber),
                        )
                        .map((day) => (
                          <Card key={String(day.id)} className="premium-card">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
                                    <span className="text-xs font-display font-bold text-gold">
                                      D{Number(day.dayNumber)}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="text-sm font-display font-semibold text-foreground">
                                      {day.title}
                                    </p>
                                    {day.date && (
                                      <p className="text-[10px] text-muted-foreground font-sans">
                                        {day.date}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <button
                                    type="button"
                                    onClick={() => openEditDayModal(day)}
                                    className="text-muted-foreground hover:text-gold transition-colors"
                                    title="Edit"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteDay(day)}
                                    className="text-muted-foreground hover:text-destructive transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                              {day.description && (
                                <p className="text-xs font-sans text-muted-foreground mb-2">
                                  {day.description}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-2">
                                {day.hotel && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-sans bg-sidebar rounded px-2 py-0.5 text-muted-foreground">
                                    <Hotel className="w-2.5 h-2.5" />
                                    {day.hotel}
                                  </span>
                                )}
                                {day.meals && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-sans bg-sidebar rounded px-2 py-0.5 text-muted-foreground">
                                    <Utensils className="w-2.5 h-2.5" />
                                    {day.meals}
                                  </span>
                                )}
                                {day.activities.slice(0, 2).map((a) => (
                                  <span
                                    key={a}
                                    className="inline-flex items-center gap-1 text-[10px] font-sans bg-sidebar rounded px-2 py-0.5 text-muted-foreground"
                                  >
                                    <MapPin className="w-2.5 h-2.5" />
                                    {a}
                                  </span>
                                ))}
                                {day.activities.length > 2 && (
                                  <span className="text-[10px] font-sans text-muted-foreground px-1">
                                    +{day.activities.length - 2} more
                                  </span>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Day Modal */}
          <Dialog open={showDayModal} onOpenChange={setShowDayModal}>
            <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display text-lg">
                  {editingDay ? "Edit Day" : "Add Itinerary Day"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-sans">Day Number *</Label>
                    <Input
                      type="number"
                      value={dayForm.dayNumber}
                      onChange={(e) =>
                        updateDayForm("dayNumber", e.target.value)
                      }
                      min="1"
                      className="font-sans text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-sans">Date</Label>
                    <Input
                      type="date"
                      value={dayForm.date}
                      onChange={(e) => updateDayForm("date", e.target.value)}
                      className="font-sans text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-sans">Title *</Label>
                  <Input
                    value={dayForm.title}
                    onChange={(e) => updateDayForm("title", e.target.value)}
                    placeholder="Arrival & City Tour"
                    className="font-sans text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-sans">Description</Label>
                  <Textarea
                    value={dayForm.description}
                    onChange={(e) =>
                      updateDayForm("description", e.target.value)
                    }
                    rows={2}
                    className="font-sans text-sm resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-sans">
                    Activities (one per line)
                  </Label>
                  <Textarea
                    value={dayForm.activities}
                    onChange={(e) =>
                      updateDayForm("activities", e.target.value)
                    }
                    rows={3}
                    className="font-sans text-sm resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-sans">Hotel</Label>
                    <Input
                      value={dayForm.hotel}
                      onChange={(e) => updateDayForm("hotel", e.target.value)}
                      className="font-sans text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-sans">Meals</Label>
                    <Input
                      value={dayForm.meals}
                      onChange={(e) => updateDayForm("meals", e.target.value)}
                      placeholder="Breakfast, Dinner"
                      className="font-sans text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-sans">Notes</Label>
                  <Textarea
                    value={dayForm.notes}
                    onChange={(e) => updateDayForm("notes", e.target.value)}
                    rows={2}
                    className="font-sans text-sm resize-none"
                  />
                </div>
                <Button
                  onClick={handleDaySubmit}
                  disabled={isAddingDay || isUpdatingDay}
                  className="w-full gradient-gold text-sidebar font-display font-bold"
                >
                  {isAddingDay || isUpdatingDay ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  {editingDay ? "Update Day" : "Add Day"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Right: Live Preview — 3 cols */}
          <div className="hidden xl:block xl:col-span-3">
            <div className="sticky top-[calc(8.5rem+4.5rem+1.5rem)]">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-sans font-semibold text-muted-foreground uppercase tracking-widest">
                  Live Preview
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePreview}
                  className="text-xs text-teal hover:text-teal-light font-sans"
                >
                  Full Preview <ArrowLeft className="w-3 h-3 ml-1 rotate-180" />
                </Button>
              </div>
              <div
                className="border border-border/60 rounded-xl overflow-hidden shadow-2xl"
                style={{ maxHeight: "75vh", overflowY: "auto" }}
              >
                <PackageTemplatePreview state={editorState} scale={0.65} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
