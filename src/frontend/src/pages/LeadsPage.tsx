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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Kanban,
  List,
  Loader2,
  MapPin,
  Phone,
  Plus,
  Trash2,
  User2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Lead } from "../backend.d.ts";
import {
  useCreateLead,
  useDeleteLead,
  useGetLeads,
  useUpdateLeadStage,
} from "../hooks/useQueries";

const STAGES = [
  {
    id: "NewLead",
    label: "New Lead",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  {
    id: "Contacted",
    label: "Contacted",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
  {
    id: "Prospect",
    label: "Prospect",
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
  {
    id: "QuotationSent",
    label: "Quotation Sent",
    color: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  },
  {
    id: "InNegotiation",
    label: "In Negotiation",
    color: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  },
  {
    id: "ReadyToBook",
    label: "Ready to Book",
    color: "bg-teal-500/20 text-teal-400 border-teal-500/30",
  },
  {
    id: "PaymentAwaited",
    label: "Payment Awaited",
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  {
    id: "BookingConfirmed",
    label: "Booking Confirmed",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  {
    id: "Lost",
    label: "Lost",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  {
    id: "Cancelled",
    label: "Cancelled",
    color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  },
];

const SOURCES = [
  "WhatsApp",
  "Instagram",
  "Facebook",
  "Walk-in",
  "Website",
  "Referral",
  "Email",
  "Other",
];

const defaultForm = {
  guestName: "",
  phone: "",
  email: "",
  destination: "",
  travelDates: "",
  budget: "",
  source: "WhatsApp",
  notes: "",
};

export default function LeadsPage() {
  const { data: leads = [], isLoading } = useGetLeads();
  const { mutateAsync: createLead, isPending: isCreating } = useCreateLead();
  const { mutateAsync: updateStage } = useUpdateLeadStage();
  const { mutateAsync: deleteLead } = useDeleteLead();

  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [draggedLeadId, setDraggedLeadId] = useState<bigint | null>(null);

  const update = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleCreate = async () => {
    if (!form.guestName.trim() || !form.phone.trim()) {
      toast.error("Name and phone are required");
      return;
    }
    try {
      await createLead({
        guestName: form.guestName,
        phone: form.phone,
        email: form.email,
        destination: form.destination,
        travelDates: form.travelDates,
        budget: BigInt(Math.round(Number(form.budget) || 0)),
        source: form.source,
        notes: form.notes,
      });
      toast.success("Lead created!");
      setShowModal(false);
      setForm(defaultForm);
    } catch {
      toast.error("Failed to create lead");
    }
  };

  const handleDragStart = (leadId: bigint) => {
    setDraggedLeadId(leadId);
  };

  const handleDrop = async (stageId: string) => {
    if (draggedLeadId === null) return;
    const lead = leads.find((l) => l.id === draggedLeadId);
    if (!lead || lead.stage === stageId) {
      setDraggedLeadId(null);
      return;
    }
    try {
      await updateStage({ leadId: draggedLeadId, stage: stageId });
      toast.success(`Moved to ${STAGES.find((s) => s.id === stageId)?.label}`);
    } catch {
      toast.error("Failed to update stage");
    }
    setDraggedLeadId(null);
  };

  const handleDelete = async (leadId: bigint) => {
    try {
      await deleteLead(leadId);
      toast.success("Lead deleted");
    } catch {
      toast.error("Failed to delete lead");
    }
  };

  const getStageStyle = (stageId: string) =>
    STAGES.find((s) => s.id === stageId)?.color ??
    "bg-muted text-muted-foreground border-border";

  const getLeadsForStage = (stageId: string) =>
    leads.filter((l) => l.stage === stageId);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-sidebar border-b border-border px-4 py-5">
        <div className="container mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              Leads <span className="text-gradient-gold">Pipeline</span>
            </h2>
            <p className="text-sm text-muted-foreground font-sans mt-0.5">
              {leads.length} leads across {STAGES.length} stages
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1">
              <button
                type="button"
                onClick={() => setViewMode("kanban")}
                className={`p-1.5 rounded transition-all ${viewMode === "kanban" ? "bg-gold/20 text-gold" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Kanban className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded transition-all ${viewMode === "list" ? "bg-gold/20 text-gold" : "text-muted-foreground hover:text-foreground"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <Button
              onClick={() => setShowModal(true)}
              className="gradient-gold text-sidebar font-display font-bold shadow-gold"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Lead
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : viewMode === "kanban" ? (
          <div className="overflow-x-auto pb-4">
            <div
              className="flex gap-4"
              style={{ minWidth: `${STAGES.length * 280}px` }}
            >
              {STAGES.map((stage) => {
                const stageLeads = getLeadsForStage(stage.id);
                return (
                  <div
                    key={stage.id}
                    className="flex-shrink-0 w-64"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(stage.id)}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span
                        className={`text-xs font-sans font-semibold px-2.5 py-1 rounded-full border ${stage.color}`}
                      >
                        {stage.label}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {stageLeads.length}
                      </span>
                    </div>
                    <div className="space-y-2 min-h-24 bg-card/30 rounded-xl p-2 border border-border/40">
                      {stageLeads.map((lead) => (
                        <KanbanCard
                          key={String(lead.id)}
                          lead={lead}
                          onDragStart={() => handleDragStart(lead.id)}
                          onDelete={() => handleDelete(lead.id)}
                        />
                      ))}
                      {stageLeads.length === 0 && (
                        <div className="flex items-center justify-center h-16 text-xs text-muted-foreground/40 font-sans">
                          Drop here
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-5 gap-4 px-4 py-2 text-xs font-sans font-semibold text-muted-foreground uppercase tracking-wide">
              <span>Guest</span>
              <span>Destination</span>
              <span>Budget</span>
              <span>Stage</span>
              <span>Actions</span>
            </div>
            {leads.length === 0 ? (
              <Card className="premium-card">
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <User2 className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                    <p className="text-muted-foreground font-sans">
                      No leads yet. Add your first lead!
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              leads.map((lead) => (
                <Card
                  key={String(lead.id)}
                  className="premium-card hover:border-gold/30 transition-all"
                >
                  <CardContent className="p-4 grid grid-cols-5 gap-4 items-center">
                    <div>
                      <p className="font-display font-semibold text-sm text-foreground">
                        {lead.guestName}
                      </p>
                      <p className="text-xs text-muted-foreground font-sans flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        {lead.phone}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-sans text-foreground">
                      <MapPin className="w-3 h-3 text-teal shrink-0" />
                      <span className="truncate">
                        {lead.destination || "–"}
                      </span>
                    </div>
                    <div className="text-sm font-mono text-gold font-semibold">
                      {Number(lead.budget) > 0
                        ? `₹${Number(lead.budget).toLocaleString()}`
                        : "–"}
                    </div>
                    <Badge
                      className={`text-xs border w-fit ${getStageStyle(lead.stage)}`}
                    >
                      {STAGES.find((s) => s.id === lead.stage)?.label ??
                        lead.stage}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Link
                        to="/leads/$leadId"
                        params={{ leadId: String(lead.id) }}
                        className="text-xs text-gold hover:text-gold-light font-sans flex items-center gap-1"
                      >
                        View <ChevronRight className="w-3 h-3" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(lead.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* Add Lead Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-card border-border max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-lg text-foreground">
              Add New Lead
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-sans">Guest Name *</Label>
                <Input
                  value={form.guestName}
                  onChange={(e) => update("guestName", e.target.value)}
                  placeholder="John Doe"
                  className="font-sans text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">Phone *</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="font-sans text-sm"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-sans">Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="john@example.com"
                className="font-sans text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-sans">Destination</Label>
                <Input
                  value={form.destination}
                  onChange={(e) => update("destination", e.target.value)}
                  placeholder="Goa, India"
                  className="font-sans text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">Budget (₹)</Label>
                <Input
                  type="number"
                  value={form.budget}
                  onChange={(e) => update("budget", e.target.value)}
                  placeholder="50000"
                  className="font-sans text-sm"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-sans">Travel Dates</Label>
              <Input
                value={form.travelDates}
                onChange={(e) => update("travelDates", e.target.value)}
                placeholder="15 Jan – 20 Jan 2026"
                className="font-sans text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-sans">Source</Label>
              <Select
                value={form.source}
                onValueChange={(v) => update("source", v)}
              >
                <SelectTrigger className="font-sans text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SOURCES.map((s) => (
                    <SelectItem key={s} value={s} className="font-sans text-sm">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-sans">Notes</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                placeholder="Any special requirements..."
                rows={2}
                className="font-sans text-sm resize-none"
              />
            </div>
            <Button
              onClick={handleCreate}
              disabled={isCreating}
              className="w-full gradient-gold text-sidebar font-display font-bold shadow-gold"
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Create Lead
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function KanbanCard({
  lead,
  onDragStart,
  onDelete,
}: {
  lead: Lead;
  onDragStart: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="bg-card border border-border/60 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-gold/30 transition-all group"
    >
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm font-display font-semibold text-foreground truncate">
          {lead.guestName}
        </p>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            to="/leads/$leadId"
            params={{ leadId: String(lead.id) }}
            className="text-muted-foreground hover:text-gold transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={onDelete}
            className="text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {lead.destination && (
        <p className="text-xs text-muted-foreground font-sans flex items-center gap-1 mb-1">
          <MapPin className="w-3 h-3 text-teal shrink-0" />
          <span className="truncate">{lead.destination}</span>
        </p>
      )}
      <p className="text-xs text-muted-foreground font-sans flex items-center gap-1 mb-2">
        <Phone className="w-3 h-3" />
        {lead.phone}
      </p>
      {Number(lead.budget) > 0 && (
        <p className="text-xs font-mono font-semibold text-gold">
          ₹{Number(lead.budget).toLocaleString()}
        </p>
      )}
    </div>
  );
}
