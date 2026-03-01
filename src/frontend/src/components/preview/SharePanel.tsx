import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Copy,
  ExternalLink,
  Facebook,
  Instagram,
  Mail,
  MessageCircle,
  Twitter,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { CompanySettings } from "../../lib/companyStore";
import type { PackageEditorState } from "../../lib/packageStore";

interface Props {
  state: PackageEditorState;
  company: CompanySettings;
}

function buildMessage(
  state: PackageEditorState,
  company: CompanySettings,
): string {
  const lines = [
    `🌟 *${company.name || "Memorable Holidays"}* - ${state.category} Package`,
    "",
    `👤 *Guest:* ${state.guestName}`,
    `📅 *Travel Dates:* ${state.travelDates}`,
    `👥 *Guests:* ${state.adults} Adults, ${state.children} Children`,
    "",
    state.hotel ? `🏨 *Hotel:* ${state.hotel} (${state.roomType})` : "",
    state.foodPackage ? `🍽️ *Food:* ${state.foodPackage}` : "",
    state.travelOption ? `🚌 *Travel:* ${state.travelOption}` : "",
    state.boating && state.boating !== "none"
      ? `⛵ *Boating:* ${state.boating}`
      : "",
    state.activities.length > 0
      ? `✨ *Activities:* ${state.activities.join(", ")}`
      : "",
    state.addOns.length > 0 ? `🎁 *Add-ons:* ${state.addOns.join(", ")}` : "",
    "",
    `💰 *Total Cost: ₹${state.totalCost.toLocaleString()}*`,
    "",
    "Contact us:",
    company.whatsapp ? `📱 WhatsApp: ${company.whatsapp}` : "",
    company.email ? `✉️ Email: ${company.email}` : "",
    company.phone ? `📞 Phone: ${company.phone}` : "",
  ];
  return lines.filter(Boolean).join("\n");
}

export default function SharePanel({ state, company }: Props) {
  const [customPhone, setCustomPhone] = useState(state.whatsapp || "");
  const [customEmail, setCustomEmail] = useState(state.email || "");

  const message = buildMessage(state, company);
  const encodedMessage = encodeURIComponent(message);
  const subject = encodeURIComponent(
    `${state.category} Package for ${state.guestName} - ₹${state.totalCost.toLocaleString()}`,
  );
  const emailBody = encodeURIComponent(message.replace(/\*/g, ""));

  const guestWhatsapp = state.whatsapp || "";
  const whatsappNumber = customPhone || company.whatsapp || "";
  const emailAddress = customEmail || company.email || "";

  // Guest's WhatsApp link
  const guestWhatsappUrl = guestWhatsapp
    ? `https://wa.me/${guestWhatsapp.replace(/[^0-9]/g, "")}?text=${encodedMessage}`
    : "";

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodedMessage}`
    : `https://wa.me/?text=${encodedMessage}`;

  const mailtoUrl = `mailto:${emailAddress}?subject=${subject}&body=${emailBody}`;

  const twitterText = encodeURIComponent(
    `✈️ ${state.category} Package for ${state.guestName} - ₹${state.totalCost.toLocaleString()} | ${company.name || "Memorable Holidays"}`,
  );
  const twitterUrl = `https://twitter.com/intent/tweet?text=${twitterText}`;

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodedMessage}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(message.replace(/\*/g, "")).then(() => {
      toast.success("Package details copied to clipboard!");
    });
  };

  const handleInstagram = () => {
    navigator.clipboard.writeText(message.replace(/\*/g, "")).then(() => {
      toast.success("Message copied! Opening Instagram DMs...");
      window.open("https://www.instagram.com/direct/new/", "_blank");
    });
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-lg text-foreground">
          Share Package
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Guest WhatsApp */}
        {guestWhatsapp && (
          <>
            <div className="space-y-1">
              <Label className="font-sans text-xs text-muted-foreground uppercase tracking-wide">
                Send to Guest
              </Label>
              <a
                href={guestWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg font-sans text-sm font-medium transition-colors bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <MessageCircle className="w-4 h-4" />
                Send to Guest WhatsApp
                <span className="text-xs opacity-70 ml-1">{guestWhatsapp}</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
              </a>
            </div>
            <Separator />
          </>
        )}

        {/* Custom recipient */}
        <div className="space-y-3">
          <Label className="font-sans text-xs text-muted-foreground uppercase tracking-wide">
            Custom Recipient
          </Label>
          <div className="space-y-1">
            <Label className="font-sans text-xs">WhatsApp Number</Label>
            <Input
              value={customPhone}
              onChange={(e) => setCustomPhone(e.target.value)}
              placeholder={company.whatsapp || "+91 XXXXX XXXXX"}
              className="font-sans text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="font-sans text-xs">Email Address</Label>
            <Input
              type="email"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              placeholder={company.email || "customer@email.com"}
              className="font-sans text-sm"
            />
          </div>
        </div>

        <Separator />

        {/* Share buttons */}
        <div className="space-y-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg font-sans text-sm font-medium transition-colors bg-teal hover:bg-teal-dark text-sidebar"
          >
            <MessageCircle className="w-4 h-4" />
            Share via WhatsApp
            <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
          </a>
          <a
            href={mailtoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg font-sans text-sm font-medium transition-colors bg-gold/20 border border-gold/40 text-gold hover:bg-gold/30"
          >
            <Mail className="w-4 h-4" />
            Share via Email
            <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
          </a>
          <button
            type="button"
            onClick={handleInstagram}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg font-sans text-sm font-medium transition-colors bg-secondary hover:bg-accent text-foreground"
          >
            <Instagram className="w-4 h-4" />
            Copy & Open Instagram DM
            <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
          </button>
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg font-sans text-sm font-medium transition-colors bg-secondary hover:bg-accent text-foreground"
          >
            <Twitter className="w-4 h-4" />
            Share via Twitter / X
            <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
          </a>
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg font-sans text-sm font-medium transition-colors bg-secondary hover:bg-accent text-foreground"
          >
            <Facebook className="w-4 h-4" />
            Share via Facebook
            <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
          </a>
        </div>

        <Separator />

        {/* Copy to clipboard */}
        <Button
          variant="outline"
          className="w-full font-sans border-teal text-teal hover:bg-teal/10"
          onClick={handleCopy}
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy Package Details
        </Button>

        {/* Company social handles */}
        {(company.instagram || company.twitter || company.facebook) && (
          <>
            <Separator />
            <div className="space-y-1">
              <p className="text-xs font-sans font-semibold text-muted-foreground uppercase tracking-wide">
                Company Handles
              </p>
              {company.instagram && (
                <p className="text-xs font-sans text-muted-foreground">
                  <Instagram className="w-3 h-3 inline mr-1" />
                  {company.instagram}
                </p>
              )}
              {company.twitter && (
                <p className="text-xs font-sans text-muted-foreground">
                  <Twitter className="w-3 h-3 inline mr-1" />
                  {company.twitter}
                </p>
              )}
              {company.facebook && (
                <p className="text-xs font-sans text-muted-foreground">
                  <Facebook className="w-3 h-3 inline mr-1" />
                  {company.facebook}
                </p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
