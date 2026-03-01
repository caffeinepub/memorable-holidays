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
  const [customPhone, setCustomPhone] = useState("");
  const [customEmail, setCustomEmail] = useState("");

  const message = buildMessage(state, company);
  const encodedMessage = encodeURIComponent(message);
  const subject = encodeURIComponent(
    `${state.category} Package for ${state.guestName} - ₹${state.totalCost.toLocaleString()}`,
  );
  const emailBody = encodeURIComponent(message.replace(/\*/g, ""));

  const whatsappNumber = customPhone || company.whatsapp || "";
  const emailAddress = customEmail || company.email || "";

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
    navigator.clipboard.writeText(message).then(() => {
      toast.success("Package details copied to clipboard!");
    });
  };

  const shareChannels = [
    {
      label: "WhatsApp",
      icon: MessageCircle,
      color: "bg-teal hover:bg-teal-dark text-sidebar",
      url: whatsappUrl,
    },
    {
      label: "Email",
      icon: Mail,
      color: "bg-gold/20 border border-gold/40 text-gold hover:bg-gold/30",
      url: mailtoUrl,
    },
    {
      label: "Twitter / X",
      icon: Twitter,
      color: "bg-secondary hover:bg-accent text-foreground",
      url: twitterUrl,
    },
    {
      label: "Facebook",
      icon: Facebook,
      color: "bg-secondary hover:bg-accent text-foreground",
      url: facebookUrl,
    },
  ];

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-lg text-foreground">
          Share Package
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Custom recipient */}
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="font-sans text-xs">Send to WhatsApp Number</Label>
            <Input
              value={customPhone}
              onChange={(e) => setCustomPhone(e.target.value)}
              placeholder={company.whatsapp || "+91 XXXXX XXXXX"}
              className="font-sans text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="font-sans text-xs">Send to Email</Label>
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
          {shareChannels.map(({ label, icon: Icon, color, url }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg font-sans text-sm font-medium transition-colors ${color}`}
            >
              <Icon className="w-4 h-4" />
              Share via {label}
              <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
            </a>
          ))}
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
