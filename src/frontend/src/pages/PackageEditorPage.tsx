import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calculator,
  Eye,
  Layout,
  Loader2,
  Save,
  User,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import DragDropEditor from "../components/editor/DragDropEditor";
import GuestDetailsForm from "../components/editor/GuestDetailsForm";
import PackageTemplatePreview from "../components/editor/PackageTemplatePreview";
import RateCalculatorPanel from "../components/editor/RateCalculatorPanel";
import { useSavePackage } from "../hooks/useQueries";
import { type ContentBlock, packageStore } from "../lib/packageStore";

export default function PackageEditorPage() {
  const navigate = useNavigate();
  const [editorState, setEditorState] = useState(packageStore.get());
  const { mutateAsync: savePackage, isPending: isSaving } = useSavePackage();

  const updateState = useCallback((updates: Partial<typeof editorState>) => {
    packageStore.set(updates);
    setEditorState(packageStore.get());
  }, []);

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
              <TabsList className="w-full grid grid-cols-3 mb-4 bg-card border border-border/50 h-11">
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
            </Tabs>
          </div>

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
