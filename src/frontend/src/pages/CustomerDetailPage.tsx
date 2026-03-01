import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Clock,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { InteractionLog } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddInteractionLog,
  useGetGuestRecords,
  useGetInteractionLog,
} from "../hooks/useQueries";

const CHANNELS = [
  "WhatsApp",
  "Email",
  "Phone",
  "Instagram",
  "Twitter",
  "Facebook",
  "In-Person",
];
const INTERACTION_TYPES = [
  "Inquiry",
  "Booking",
  "Follow-up",
  "Complaint",
  "Feedback",
  "Payment",
  "Other",
];

export default function CustomerDetailPage() {
  const { customerName } = useParams({ from: "/app/customers/$customerName" });
  const decodedName = decodeURIComponent(customerName);
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();

  const { data: customers = [] } = useGetGuestRecords();
  const customer = customers.find((c) => c.name === decodedName);

  const { data: logs = [], isLoading: logsLoading } =
    useGetInteractionLog(decodedName);
  const { mutateAsync: addLog, isPending: isAdding } = useAddInteractionLog();

  const [newNote, setNewNote] = useState("");
  const [channel, setChannel] = useState("WhatsApp");
  const [interactionType, setInteractionType] = useState("Inquiry");

  const handleAddLog = async () => {
    if (!newNote.trim()) {
      toast.error("Please enter a note");
      return;
    }
    if (!identity) {
      toast.error("Not authenticated");
      return;
    }
    const log: InteractionLog = {
      date: BigInt(Date.now() * 1_000_000),
      interactionType,
      channel,
      notes: newNote.trim(),
      createdBy: identity.getPrincipal(),
    };
    try {
      await addLog({ customerName: decodedName, log });
      toast.success("Interaction logged!");
      setNewNote("");
    } catch {
      toast.error("Failed to add log");
    }
  };

  const formatDate = (timestamp: bigint) => {
    const ms = Number(timestamp) / 1_000_000;
    return new Date(ms).toLocaleString();
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate({ to: "/customers" })}
          className="font-sans"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground">
            {decodedName}
          </h2>
          <p className="text-sm text-muted-foreground font-sans">
            Customer Profile & Interaction History
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="lg:col-span-1">
          <Card className="premium-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-lg">
                Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {customer ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-teal/10 border-2 border-teal/30 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-serif font-bold text-teal">
                      {decodedName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-center font-serif font-semibold text-lg text-foreground">
                    {customer.name}
                  </h3>
                  <p className="text-center text-sm text-muted-foreground font-sans">
                    {Number(customer.adults)} Adults ·{" "}
                    {Number(customer.children)} Children
                  </p>
                  <Separator />
                  {customer.contactNumber && (
                    <div className="flex items-center gap-2 text-sm font-sans">
                      <Phone className="w-4 h-4 text-teal shrink-0" />
                      <span>{customer.contactNumber}</span>
                    </div>
                  )}
                  {customer.email && (
                    <div className="flex items-center gap-2 text-sm font-sans">
                      <Mail className="w-4 h-4 text-teal shrink-0" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                  )}
                  {customer.whatsapp && (
                    <div className="flex items-center gap-2 text-sm font-sans">
                      <MessageCircle className="w-4 h-4 text-teal shrink-0" />
                      <span>{customer.whatsapp}</span>
                    </div>
                  )}
                  {customer.travelDates && (
                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground font-sans uppercase tracking-wide mb-1">
                        Travel Dates
                      </p>
                      <p className="text-sm font-sans">
                        {customer.travelDates}
                      </p>
                    </div>
                  )}
                  {customer.notes && (
                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground font-sans uppercase tracking-wide mb-1">
                        Notes
                      </p>
                      <p className="text-sm font-sans text-muted-foreground">
                        {customer.notes}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground font-sans text-sm text-center py-4">
                  Customer not found
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Interaction Log */}
        <div className="lg:col-span-2 space-y-4">
          {/* Add New Log */}
          <Card className="premium-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-lg">
                Add Interaction Note
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="font-sans text-xs">Channel</Label>
                  <Select value={channel} onValueChange={setChannel}>
                    <SelectTrigger className="font-sans text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CHANNELS.map((c) => (
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
                  <Label className="font-sans text-xs">Type</Label>
                  <Select
                    value={interactionType}
                    onValueChange={setInteractionType}
                  >
                    <SelectTrigger className="font-sans text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INTERACTION_TYPES.map((t) => (
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
                <Label className="font-sans text-xs">Notes</Label>
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Enter interaction details..."
                  rows={3}
                  className="font-sans text-sm resize-none"
                />
              </div>
              <Button
                onClick={handleAddLog}
                disabled={isAdding}
                className="font-sans bg-teal hover:bg-teal-dark text-white"
              >
                {isAdding ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-1" />
                )}
                Add Note
              </Button>
            </CardContent>
          </Card>

          {/* Log Timeline */}
          <Card className="premium-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-lg">
                Interaction History
                <span className="ml-2 text-sm font-sans font-normal text-muted-foreground">
                  ({logs.length} entries)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {logsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-teal" />
                </div>
              ) : logs.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-muted-foreground font-sans text-sm">
                    No interactions logged yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {[...logs].reverse().map((log, i) => (
                    <div
                      key={`${String(log.date)}-${i}`}
                      className="flex gap-3"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-teal mt-2 shrink-0" />
                        {i < logs.length - 1 && (
                          <div className="w-0.5 bg-border flex-1 mt-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-3">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-medium font-sans bg-teal/10 text-teal px-2 py-0.5 rounded-full">
                            {log.channel}
                          </span>
                          <span className="text-xs font-sans bg-gold/10 text-gold-dark px-2 py-0.5 rounded-full">
                            {log.interactionType}
                          </span>
                          <span className="text-xs text-muted-foreground font-sans ml-auto">
                            {formatDate(log.date)}
                          </span>
                        </div>
                        <p className="text-sm font-sans text-foreground">
                          {log.notes}
                        </p>
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
