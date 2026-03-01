import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Loader2, Percent, Plus, Tag, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Promotion } from "../backend.d.ts";
import {
  useCreatePromotion,
  useDeletePromotion,
  useGetPromotions,
  useUpdatePromotion,
} from "../hooks/useQueries";

const CATEGORIES = [
  "Beach",
  "Adventure",
  "Cultural",
  "Honeymoon",
  "Family",
  "Corporate",
  "Wildlife",
  "Hill Station",
  "Religious",
  "International",
];

const defaultForm = {
  name: "",
  discountPercent: "",
  validFrom: "",
  validTo: "",
  description: "",
  isActive: true,
  categories: [] as string[],
};

export default function PromotionsPage() {
  const { data: promotions = [], isLoading } = useGetPromotions();
  const { mutateAsync: createPromotion, isPending: isCreating } =
    useCreatePromotion();
  const { mutateAsync: updatePromotion, isPending: isUpdating } =
    useUpdatePromotion();
  const { mutateAsync: deletePromotion } = useDeletePromotion();

  const [showModal, setShowModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [form, setForm] = useState(defaultForm);

  const update = (
    k: keyof Omit<typeof form, "categories">,
    v: string | boolean,
  ) => setForm((p) => ({ ...p, [k]: v }));

  const toggleCategory = (cat: string) => {
    setForm((p) => ({
      ...p,
      categories: p.categories.includes(cat)
        ? p.categories.filter((c) => c !== cat)
        : [...p.categories, cat],
    }));
  };

  const openCreate = () => {
    setEditingPromo(null);
    setForm(defaultForm);
    setShowModal(true);
  };
  const openEdit = (promo: Promotion) => {
    setEditingPromo(promo);
    const from = new Date(Number(promo.validFrom) / 1_000_000)
      .toISOString()
      .slice(0, 10);
    const to = new Date(Number(promo.validTo) / 1_000_000)
      .toISOString()
      .slice(0, 10);
    setForm({
      name: promo.name,
      discountPercent: String(Number(promo.discountPercent)),
      validFrom: from,
      validTo: to,
      description: promo.description,
      isActive: promo.isActive,
      categories: promo.categories,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.validFrom || !form.validTo) {
      toast.error("Name and dates are required");
      return;
    }
    try {
      const validFrom = BigInt(new Date(form.validFrom).getTime() * 1_000_000);
      const validTo = BigInt(new Date(form.validTo).getTime() * 1_000_000);
      if (editingPromo) {
        await updatePromotion({
          ...editingPromo,
          name: form.name,
          discountPercent: BigInt(
            Math.round(Number(form.discountPercent) || 0),
          ),
          validFrom,
          validTo,
          description: form.description,
          isActive: form.isActive,
          categories: form.categories,
        });
        toast.success("Promotion updated!");
      } else {
        await createPromotion({
          name: form.name,
          discountPercent: BigInt(
            Math.round(Number(form.discountPercent) || 0),
          ),
          validFrom,
          validTo,
          categories: form.categories,
          description: form.description,
        });
        toast.success("Promotion created!");
      }
      setShowModal(false);
      setForm(defaultForm);
    } catch {
      toast.error("Failed to save promotion");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deletePromotion(id);
      toast.success("Promotion deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const formatDate = (ts: bigint) =>
    new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const now = Date.now();
  const isExpired = (validTo: bigint) => Number(validTo) / 1_000_000 < now;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-sidebar border-b border-border px-4 py-5">
        <div className="container mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              <span className="text-gradient-gold">Promotions</span>
            </h2>
            <p className="text-sm text-muted-foreground font-sans mt-0.5">
              {promotions.filter((p) => p.isActive).length} active promotions
            </p>
          </div>
          <Button
            onClick={openCreate}
            className="gradient-gold text-sidebar font-display font-bold shadow-gold"
          >
            <Plus className="w-4 h-4 mr-1" />
            Create Promotion
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : promotions.length === 0 ? (
          <Card className="premium-card">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Tag className="w-14 h-14 text-muted-foreground/20 mb-4" />
              <p className="text-muted-foreground font-sans">
                No promotions yet.
              </p>
              <Button
                onClick={openCreate}
                variant="outline"
                size="sm"
                className="mt-3 border-gold/40 text-gold hover:bg-gold/10 font-sans"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Create first promotion
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {promotions.map((promo) => {
              const expired = isExpired(promo.validTo);
              return (
                <Card
                  key={String(promo.id)}
                  className={`premium-card hover:border-gold/30 transition-all group ${!promo.isActive || expired ? "opacity-60" : ""}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-bold text-foreground truncate">
                          {promo.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            className={`text-xs border ${promo.isActive && !expired ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-gray-500/20 text-gray-400 border-gray-500/30"}`}
                          >
                            {expired
                              ? "Expired"
                              : promo.isActive
                                ? "Active"
                                : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => openEdit(promo)}
                          className="text-muted-foreground hover:text-gold transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(promo.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                        <Percent className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <p className="text-2xl font-display font-bold text-gold">
                          {Number(promo.discountPercent)}%
                        </p>
                        <p className="text-xs text-muted-foreground font-sans">
                          discount
                        </p>
                      </div>
                    </div>
                    {promo.description && (
                      <p className="text-xs text-muted-foreground font-sans line-clamp-2">
                        {promo.description}
                      </p>
                    )}
                    <div className="text-xs font-sans text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {formatDate(promo.validFrom)}
                      </span>{" "}
                      —{" "}
                      <span className="font-medium text-foreground">
                        {formatDate(promo.validTo)}
                      </span>
                    </div>
                    {promo.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {promo.categories.map((c) => (
                          <span
                            key={c}
                            className="text-xs font-sans bg-teal/10 text-teal px-1.5 py-0.5 rounded border border-teal/20"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              {editingPromo ? "Edit Promotion" : "Create Promotion"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-sans">Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Summer Special"
                  className="font-sans text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">Discount (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={form.discountPercent}
                  onChange={(e) => update("discountPercent", e.target.value)}
                  placeholder="15"
                  className="font-sans text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-sans">Valid From *</Label>
                <Input
                  type="date"
                  value={form.validFrom}
                  onChange={(e) => update("validFrom", e.target.value)}
                  className="font-sans text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">Valid To *</Label>
                <Input
                  type="date"
                  value={form.validTo}
                  onChange={(e) => update("validTo", e.target.value)}
                  className="font-sans text-sm"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-sans">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Describe this promotion..."
                rows={2}
                className="font-sans text-sm resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-sans">Applicable Categories</Label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => (
                  <div key={cat} className="flex items-center gap-2">
                    <Checkbox
                      id={`cat-${cat}`}
                      checked={form.categories.includes(cat)}
                      onCheckedChange={() => toggleCategory(cat)}
                    />
                    <label
                      htmlFor={`cat-${cat}`}
                      className="text-xs font-sans text-foreground cursor-pointer"
                    >
                      {cat}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {editingPromo && (
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(v) => update("isActive", v)}
                />
                <Label className="text-xs font-sans cursor-pointer">
                  {form.isActive ? "Active" : "Inactive"}
                </Label>
              </div>
            )}
            <Button
              onClick={handleSave}
              disabled={isCreating || isUpdating}
              className="w-full gradient-gold text-sidebar font-display font-bold"
            >
              {isCreating || isUpdating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Tag className="w-4 h-4 mr-2" />
              )}
              {editingPromo ? "Update Promotion" : "Create Promotion"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
