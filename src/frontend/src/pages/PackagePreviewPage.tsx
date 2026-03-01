import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { useRef } from "react";
import { useState } from "react";
import { toast } from "sonner";
import PackageTemplatePreview from "../components/editor/PackageTemplatePreview";
import SharePanel from "../components/preview/SharePanel";
import { companyStore } from "../lib/companyStore";
import { packageStore } from "../lib/packageStore";

export default function PackagePreviewPage() {
  const navigate = useNavigate();
  const previewRef = useRef<HTMLDivElement>(null);
  const state = packageStore.get();
  const company = companyStore.get();
  const [showShare, setShowShare] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const text = buildShareText(state, company);
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Package details copied to clipboard!");
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: "/editor" })}
            className="font-sans"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Editor
          </Button>
          <div>
            <h2 className="text-xl font-serif font-bold text-foreground">
              Package Preview
            </h2>
            <p className="text-xs text-muted-foreground font-sans">
              {state.guestName || "Guest"} · {state.category}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyText}
            className="font-sans"
          >
            Copy Text
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowShare(!showShare)}
            className="font-sans border-teal text-teal hover:bg-teal/10"
          >
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </Button>
          <Button
            size="sm"
            onClick={handlePrint}
            className="font-sans bg-teal hover:bg-teal-dark text-white"
          >
            <Download className="w-4 h-4 mr-1" />
            Print / Save PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Preview */}
        <div className="xl:col-span-2">
          <div
            ref={previewRef}
            className="border border-border rounded-xl overflow-hidden shadow-lg bg-white"
          >
            <PackageTemplatePreview state={state} />
          </div>
        </div>

        {/* Share Panel */}
        {showShare && (
          <div className="xl:col-span-1 print:hidden">
            <SharePanel state={state} company={company} />
          </div>
        )}
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #package-preview-content, #package-preview-content * { visibility: visible; }
          #package-preview-content { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
}

function buildShareText(
  state: ReturnType<typeof packageStore.get>,
  company: ReturnType<typeof companyStore.get>,
): string {
  const lines = [
    `🌟 ${company.name || "Memorable Holidays"} - ${state.category} Package`,
    "",
    `👤 Guest: ${state.guestName}`,
    `📅 Travel Dates: ${state.travelDates}`,
    `👥 Guests: ${state.adults} Adults, ${state.children} Children`,
    "",
    state.hotel ? `🏨 Hotel: ${state.hotel} (${state.roomType})` : "",
    state.foodPackage ? `🍽️ Food: ${state.foodPackage}` : "",
    state.travelOption ? `🚌 Travel: ${state.travelOption}` : "",
    state.boating && state.boating !== "none"
      ? `⛵ Boating: ${state.boating}`
      : "",
    state.activities.length > 0
      ? `✨ Activities: ${state.activities.join(", ")}`
      : "",
    state.addOns.length > 0 ? `🎁 Add-ons: ${state.addOns.join(", ")}` : "",
    "",
    `💰 Total Cost: ₹${state.totalCost.toLocaleString()}`,
    "",
    company.whatsapp ? `📱 WhatsApp: ${company.whatsapp}` : "",
    company.email ? `✉️ Email: ${company.email}` : "",
    company.phone ? `📞 Phone: ${company.phone}` : "",
  ];
  return lines.filter(Boolean).join("\n");
}
