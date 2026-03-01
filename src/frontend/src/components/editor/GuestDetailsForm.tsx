import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PackageEditorState } from "../../lib/packageStore";

interface Props {
  state: PackageEditorState;
  onChange: (updates: Partial<PackageEditorState>) => void;
}

export default function GuestDetailsForm({ state, onChange }: Props) {
  return (
    <Card className="premium-card">
      <CardHeader className="pb-3">
        <div className="mb-0.5">
          <p className="text-[10px] font-sans text-muted-foreground uppercase tracking-widest mb-1">
            Step 3 of 3 — Guest Details
          </p>
          <CardTitle className="font-display text-lg text-foreground">
            Guest Information
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 space-y-1">
            <Label className="font-sans text-xs">Guest Name *</Label>
            <Input
              value={state.guestName}
              onChange={(e) => onChange({ guestName: e.target.value })}
              placeholder="Full name"
              className="font-sans text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="font-sans text-xs">Contact Number</Label>
            <Input
              value={state.contactNumber}
              onChange={(e) => onChange({ contactNumber: e.target.value })}
              placeholder="+91 XXXXX XXXXX"
              className="font-sans text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="font-sans text-xs">WhatsApp</Label>
            <Input
              value={state.whatsapp}
              onChange={(e) => onChange({ whatsapp: e.target.value })}
              placeholder="+91 XXXXX XXXXX"
              className="font-sans text-sm"
            />
          </div>
          <div className="col-span-2 space-y-1">
            <Label className="font-sans text-xs">Email</Label>
            <Input
              type="email"
              value={state.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="guest@email.com"
              className="font-sans text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="font-sans text-xs">Adults</Label>
            <Input
              type="number"
              min={1}
              value={state.adults}
              onChange={(e) =>
                onChange({ adults: Number.parseInt(e.target.value) || 1 })
              }
              className="font-sans text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="font-sans text-xs">Children</Label>
            <Input
              type="number"
              min={0}
              value={state.children}
              onChange={(e) =>
                onChange({ children: Number.parseInt(e.target.value) || 0 })
              }
              className="font-sans text-sm"
            />
          </div>
          <div className="col-span-2 space-y-1">
            <Label className="font-sans text-xs">Travel Dates</Label>
            <Input
              value={state.travelDates}
              onChange={(e) => onChange({ travelDates: e.target.value })}
              placeholder="e.g. 15 Mar 2026 – 22 Mar 2026"
              className="font-sans text-sm"
            />
          </div>
          <div className="col-span-2 space-y-1">
            <Label className="font-sans text-xs">Special Notes</Label>
            <Textarea
              value={state.notes}
              onChange={(e) => onChange({ notes: e.target.value })}
              placeholder="Any special requirements or notes..."
              rows={3}
              className="font-sans text-sm resize-none"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
