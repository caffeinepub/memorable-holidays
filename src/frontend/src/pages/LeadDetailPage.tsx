import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  Activity,
  ArrowLeft,
  Bell,
  Calendar,
  Clock,
  Loader2,
  Mail,
  MapPin,
  Package,
  Phone,
  Plus,
  Save,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAddLeadActivity,
  useCreateReminder,
  useGetLeadActivities,
  useGetLeadById,
  useUpdateLead,
} from "../hooks/useQueries";
import { packageStore } from "../lib/packageStore";

const STAGES = [
  "NewLead",
  "Contacted",
  "Prospect",
  "QuotationSent",
  "InNegotiation",
  "ReadyToBook",
  "PaymentAwaited",
  "BookingConfirmed",
  "Lost",
  "Cancelled",
];
const STAGE_LABELS: Record<string, string> = {
  NewLead: "New Lead",
  Contacted: "Contacted",
  Prospect: "Prospect",
  QuotationSent: "Quotation Sent",
  InNegotiation: "In Negotiation",
  ReadyToBook: "Ready to Book",
  PaymentAwaited: "Payment Awaited",
  BookingConfirmed: "Booking Confirmed",
  Lost: "Lost",
  Cancelled: "Cancelled",
};
const STAGE_COLORS: Record<string, string> = {
  NewLead: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Contacted: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Prospect: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  QuotationSent: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  InNegotiation: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  ReadyToBook: "bg-teal-500/20 text-teal-400 border-teal-500/30",
  PaymentAwaited: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  BookingConfirmed: "bg-green-500/20 text-green-400 border-green-500/30",
  Lost: "bg-red-500/20 text-red-400 border-red-500/30",
  Cancelled: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export default function LeadDetailPage() {
  const { leadId } = useParams({ from: "/app/leads/$leadId" });
  const navigate = useNavigate();
  const leadIdBig = BigInt(leadId);

  const { data: lead, isLoading } = useGetLeadById(leadIdBig);
  const { data: activities = [], isLoading: activitiesLoading } =
    useGetLeadActivities(leadIdBig);
  const { mutateAsync: updateLead, isPending: isUpdating } = useUpdateLead();
  const { mutateAsync: addActivity, isPending: isAddingActivity } =
    useAddLeadActivity();
  const { mutateAsync: createReminder, isPending: isCreatingReminder } =
    useCreateReminder();

  const [editStage, setEditStage] = useState("");
  const [activityAction, setActivityAction] = useState("");
  const [activityNotes, setActivityNotes] = useState("");
  const [reminderMsg, setReminderMsg] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderType, setReminderType] = useState("FollowUp");

  const handleConvertToPackage = () => {
    if (!lead) return;
    packageStore.reset();
    packageStore.set({
      guestName: lead.guestName,
      contactNumber: lead.phone,
      email: lead.email,
      whatsapp: lead.phone,
      travelDates: lead.travelDates,
      notes: lead.notes,
    });
    navigate({ to: "/categories" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground font-sans">Lead not found.</p>
        <Link
          to="/leads"
          className="text-gold hover:text-gold-light font-sans text-sm mt-2 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Leads
        </Link>
      </div>
    );
  }

  const currentStage = editStage || lead.stage;

  const handleUpdateStage = async () => {
    if (!editStage || editStage === lead.stage) return;
    try {
      await updateLead({ ...lead, stage: editStage });
      toast.success("Stage updated!");
      setEditStage("");
    } catch {
      toast.error("Failed to update stage");
    }
  };

  const handleAddActivity = async () => {
    if (!activityAction.trim()) {
      toast.error("Action is required");
      return;
    }
    try {
      await addActivity({
        leadId: leadIdBig,
        action: activityAction,
        notes: activityNotes,
      });
      toast.success("Activity logged!");
      setActivityAction("");
      setActivityNotes("");
    } catch {
      toast.error("Failed to add activity");
    }
  };

  const handleCreateReminder = async () => {
    if (!reminderMsg.trim() || !reminderDate) {
      toast.error("Message and date required");
      return;
    }
    try {
      const ts = BigInt(new Date(reminderDate).getTime() * 1_000_000);
      await createReminder({
        entityId: leadIdBig,
        entityType: "Lead",
        reminderDate: ts,
        reminderType,
        message: reminderMsg,
      });
      toast.success("Reminder created!");
      setReminderMsg("");
      setReminderDate("");
    } catch {
      toast.error("Failed to create reminder");
    }
  };

  const formatDate = (ts: bigint) =>
    new Date(Number(ts) / 1_000_000).toLocaleString();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl animate-fade-in">
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate({ to: "/leads" })}
          className="font-sans"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-display font-bold text-foreground truncate">
            {lead.guestName}
          </h2>
          <p className="text-xs text-muted-foreground font-sans">
            Lead #{String(lead.id)}
          </p>
        </div>
        <Badge
          className={`border ${STAGE_COLORS[currentStage] ?? "border-border"}`}
        >
          {STAGE_LABELS[currentStage] ?? currentStage}
        </Badge>
        <Button
          onClick={handleConvertToPackage}
          className="gradient-gold text-sidebar font-display font-bold shadow-gold shrink-0"
          size="sm"
        >
          <Package className="w-4 h-4 mr-1.5" />
          Convert to Package
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Info */}
        <div className="space-y-4">
          {/* Contact Details */}
          <Card className="premium-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base">
                Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm font-sans">
              <div className="flex items-center gap-2 text-foreground">
                <Phone className="w-4 h-4 text-teal shrink-0" />
                {lead.phone || "–"}
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <Mail className="w-4 h-4 text-teal shrink-0" />
                {lead.email || "–"}
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <MapPin className="w-4 h-4 text-teal shrink-0" />
                {lead.destination || "–"}
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <Calendar className="w-4 h-4 text-teal shrink-0" />
                {lead.travelDates || "–"}
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1">Budget</p>
                <p className="text-gold font-mono font-semibold text-lg">
                  {Number(lead.budget) > 0
                    ? `₹${Number(lead.budget).toLocaleString()}`
                    : "Not set"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Source</p>
                <p className="text-foreground">{lead.source}</p>
              </div>
              {lead.notes && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Notes</p>
                  <p className="text-foreground text-xs">{lead.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stage Selector */}
          <Card className="premium-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base">
                Update Stage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select value={currentStage} onValueChange={setEditStage}>
                <SelectTrigger className="font-sans text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAGES.map((s) => (
                    <SelectItem key={s} value={s} className="font-sans text-sm">
                      {STAGE_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {editStage && editStage !== lead.stage && (
                <Button
                  onClick={handleUpdateStage}
                  disabled={isUpdating}
                  size="sm"
                  className="w-full gradient-gold text-sidebar font-sans"
                >
                  {isUpdating ? (
                    <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5 mr-1" />
                  )}
                  Save Stage
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Create Reminder */}
          <Card className="premium-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <Bell className="w-4 h-4 text-gold" />
                Set Reminder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs font-sans">Type</Label>
                <Select value={reminderType} onValueChange={setReminderType}>
                  <SelectTrigger className="font-sans text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "FollowUp",
                      "Payment",
                      "Document",
                      "TravelDate",
                      "Custom",
                    ].map((t) => (
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
              <div className="space-y-1">
                <Label className="text-xs font-sans">Message</Label>
                <Input
                  value={reminderMsg}
                  onChange={(e) => setReminderMsg(e.target.value)}
                  placeholder="Follow up with client"
                  className="font-sans text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">Date</Label>
                <Input
                  type="datetime-local"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  className="font-sans text-sm"
                />
              </div>
              <Button
                onClick={handleCreateReminder}
                disabled={isCreatingReminder}
                size="sm"
                className="w-full font-sans border-gold/40 text-gold hover:bg-gold/10"
                variant="outline"
              >
                {isCreatingReminder ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                ) : (
                  <Bell className="w-3.5 h-3.5 mr-1" />
                )}
                Set Reminder
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right: Activities */}
        <div className="lg:col-span-2 space-y-4">
          {/* Add Activity */}
          <Card className="premium-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal" />
                Log Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs font-sans">Action</Label>
                <Input
                  value={activityAction}
                  onChange={(e) => setActivityAction(e.target.value)}
                  placeholder="Called, emailed, met in person..."
                  className="font-sans text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">Notes</Label>
                <Textarea
                  value={activityNotes}
                  onChange={(e) => setActivityNotes(e.target.value)}
                  placeholder="Details about this interaction..."
                  rows={2}
                  className="font-sans text-sm resize-none"
                />
              </div>
              <Button
                onClick={handleAddActivity}
                disabled={isAddingActivity}
                size="sm"
                className="font-sans bg-teal hover:bg-teal-dark text-sidebar"
              >
                {isAddingActivity ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                ) : (
                  <Plus className="w-3.5 h-3.5 mr-1" />
                )}
                Log Activity
              </Button>
            </CardContent>
          </Card>

          {/* Activity Log */}
          <Card className="premium-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base">
                Activity Log
                <span className="ml-2 text-sm font-sans font-normal text-muted-foreground">
                  ({activities.length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activitiesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-gold" />
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-10 h-10 text-muted-foreground/20 mx-auto mb-2" />
                  <p className="text-muted-foreground font-sans text-sm">
                    No activities yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {[...activities].reverse().map((activity, i) => (
                    <div key={String(activity.id)} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-gold mt-2 shrink-0" />
                        {i < activities.length - 1 && (
                          <div className="w-0.5 bg-border flex-1 mt-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-display font-semibold text-foreground">
                            {activity.action}
                          </span>
                          <span className="text-xs text-muted-foreground font-sans">
                            {formatDate(activity.date)}
                          </span>
                        </div>
                        {activity.notes && (
                          <p className="text-sm font-sans text-muted-foreground">
                            {activity.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
