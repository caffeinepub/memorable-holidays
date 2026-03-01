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
import {
  Bell,
  BellOff,
  Check,
  Clock,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useCreateReminder,
  useDeleteReminder,
  useGetReminders,
  useMarkReminderDone,
} from "../hooks/useQueries";

const REMINDER_TYPES = [
  "FollowUp",
  "Payment",
  "Document",
  "TravelDate",
  "Custom",
];
const TYPE_COLORS: Record<string, string> = {
  FollowUp: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Payment: "bg-green-500/20 text-green-400 border-green-500/30",
  Document: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  TravelDate: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Custom: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const defaultForm = {
  entityId: "0",
  entityType: "Lead",
  reminderDate: "",
  reminderType: "FollowUp",
  message: "",
};

export default function RemindersPage() {
  const { data: reminders = [], isLoading } = useGetReminders();
  const { mutateAsync: createReminder, isPending: isCreating } =
    useCreateReminder();
  const { mutateAsync: markDone } = useMarkReminderDone();
  const { mutateAsync: deleteReminder } = useDeleteReminder();

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [filter, setFilter] = useState<"all" | "pending" | "done" | "overdue">(
    "all",
  );
  const [entityFilter, setEntityFilter] = useState<
    "all" | "Lead" | "Booking" | "Custom"
  >("all");

  const update = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleCreate = async () => {
    if (!form.message.trim() || !form.reminderDate) {
      toast.error("Message and date are required");
      return;
    }
    try {
      await createReminder({
        entityId: BigInt(form.entityId || "0"),
        entityType: form.entityType,
        reminderDate: BigInt(new Date(form.reminderDate).getTime() * 1_000_000),
        reminderType: form.reminderType,
        message: form.message,
      });
      toast.success("Reminder created!");
      setShowModal(false);
      setForm(defaultForm);
    } catch {
      toast.error("Failed to create reminder");
    }
  };

  const handleMarkDone = async (id: bigint) => {
    try {
      await markDone(id);
      toast.success("Marked as done!");
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteReminder(id);
      toast.success("Reminder deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const now = Date.now();
  const sorted = [...reminders].sort(
    (a, b) => Number(a.reminderDate) - Number(b.reminderDate),
  );
  const filtered = sorted.filter((r) => {
    const overdue = isOverdue(r.reminderDate, r.status);
    if (filter === "pending") return r.status === "Pending";
    if (filter === "done") return r.status === "Done";
    if (filter === "overdue") return overdue;
    // entity filter
    if (entityFilter === "Custom") return r.reminderType === "Custom";
    if (entityFilter !== "all") return r.entityType === entityFilter;
    return true;
  });

  const isOverdue = (reminderDate: bigint, status: string) => {
    return status === "Pending" && Number(reminderDate) / 1_000_000 < now;
  };

  const formatDate = (ts: bigint) => {
    const ms = Number(ts) / 1_000_000;
    return new Date(ms).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const pendingCount = reminders.filter((r) => r.status === "Pending").length;
  const overdueCount = reminders.filter((r) =>
    isOverdue(r.reminderDate, r.status),
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-sidebar border-b border-border px-4 py-5">
        <div className="container mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              <span className="text-gradient-gold">Reminders</span>
            </h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-muted-foreground font-sans">
                {pendingCount} pending
              </span>
              {overdueCount > 0 && (
                <span className="text-sm font-sans text-red-400 flex items-center gap-1">
                  <Bell className="w-3.5 h-3.5 animate-pulse" />
                  {overdueCount} overdue
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1">
              {(["all", "pending", "done", "overdue"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded text-xs font-sans font-medium capitalize transition-all ${filter === f ? "bg-gold/20 text-gold" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1">
              {(["all", "Lead", "Booking", "Custom"] as const).map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEntityFilter(e)}
                  className={`px-3 py-1 rounded text-xs font-sans font-medium capitalize transition-all ${entityFilter === e ? "bg-teal/20 text-teal" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {e}
                </button>
              ))}
            </div>
            <Button
              onClick={() => setShowModal(true)}
              className="gradient-gold text-sidebar font-display font-bold shadow-gold"
            >
              <Plus className="w-4 h-4 mr-1" />
              New Reminder
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="premium-card">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <BellOff className="w-14 h-14 text-muted-foreground/20 mb-4" />
              <p className="text-muted-foreground font-sans">
                No {filter !== "all" ? filter : ""} reminders
              </p>
              <Button
                onClick={() => setShowModal(true)}
                variant="outline"
                size="sm"
                className="mt-3 border-gold/40 text-gold hover:bg-gold/10 font-sans"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Create reminder
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((reminder) => {
              const overdue = isOverdue(reminder.reminderDate, reminder.status);
              return (
                <Card
                  key={String(reminder.id)}
                  className={`premium-card transition-all ${overdue ? "border-red-500/40 bg-red-500/5" : "hover:border-gold/30"}`}
                >
                  <CardContent className="p-4 flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${overdue ? "bg-red-500/20" : "bg-gold/10"}`}
                    >
                      {reminder.status === "Done" ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : overdue ? (
                        <Bell className="w-5 h-5 text-red-400 animate-pulse" />
                      ) : (
                        <Clock className="w-5 h-5 text-gold" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p
                          className={`font-display font-semibold text-sm ${overdue ? "text-red-300" : "text-foreground"}`}
                        >
                          {reminder.message}
                        </p>
                        <div className="flex items-center gap-1 shrink-0">
                          {reminder.status === "Pending" && (
                            <button
                              type="button"
                              onClick={() => handleMarkDone(reminder.id)}
                              className="text-muted-foreground hover:text-green-400 transition-colors"
                              title="Mark done"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDelete(reminder.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          className={`text-xs border ${TYPE_COLORS[reminder.reminderType] ?? "border-border"}`}
                        >
                          {reminder.reminderType}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-sans">
                          {reminder.entityType} #{String(reminder.entityId)}
                        </span>
                        <span
                          className={`text-xs font-sans ml-auto ${overdue ? "text-red-400 font-semibold" : "text-muted-foreground"}`}
                        >
                          {overdue && "OVERDUE · "}
                          {formatDate(reminder.reminderDate)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              Create Reminder
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1">
              <Label className="text-xs font-sans">Message *</Label>
              <Input
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="Follow up with client about package"
                className="font-sans text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-sans">Type</Label>
                <Select
                  value={form.reminderType}
                  onValueChange={(v) => update("reminderType", v)}
                >
                  <SelectTrigger className="font-sans text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REMINDER_TYPES.map((t) => (
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
                <Label className="text-xs font-sans">Entity Type</Label>
                <Select
                  value={form.entityType}
                  onValueChange={(v) => update("entityType", v)}
                >
                  <SelectTrigger className="font-sans text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Lead", "Package", "Customer", "Booking"].map((t) => (
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
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-sans">
                Reminder Date & Time *
              </Label>
              <Input
                type="datetime-local"
                value={form.reminderDate}
                onChange={(e) => update("reminderDate", e.target.value)}
                className="font-sans text-sm"
              />
            </div>
            <Button
              onClick={handleCreate}
              disabled={isCreating}
              className="w-full gradient-gold text-sidebar font-display font-bold"
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Bell className="w-4 h-4 mr-2" />
              )}
              Create Reminder
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
