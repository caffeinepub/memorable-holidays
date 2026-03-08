import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Copy,
  Download,
  FileImage,
  Instagram,
  Mail,
  MessageCircle,
  Printer,
  Share2,
} from "lucide-react";
import { useRef, useState } from "react";
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
  const [showShare, setShowShare] = useState(true);

  const handleDownloadPdf = () => {
    toast.info(
      "Opening print dialog — choose 'Save as PDF' as the destination in your browser's print dialog.",
      { duration: 4000 },
    );
    setTimeout(() => window.print(), 300);
  };

  const handleDownloadImage = () => {
    toast.info(
      "To save as image: use Print → Save as PDF, or take a screenshot of the preview below.",
      { duration: 5000 },
    );
  };

  const handleCopyText = () => {
    const text = buildShareText(state, company);
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Package details copied to clipboard!");
    });
  };

  const handleWhatsApp = () => {
    const text = buildShareText(state, company);
    const guestWhatsApp = state.whatsapp?.replace(/\D/g, "");
    if (guestWhatsApp) {
      window.open(
        `https://wa.me/${guestWhatsApp}?text=${encodeURIComponent(text)}`,
        "_blank",
      );
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  const handleEmail = () => {
    const text = buildShareText(state, company);
    const subject = `${company.name || "Memorable Holidays"} — ${state.category || "Tour"} Package for ${state.guestName || "Guest"}`;
    const guestEmail = state.email || "";
    window.open(
      `mailto:${guestEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`,
      "_blank",
    );
  };

  const handleInstagram = () => {
    const text = buildShareText(state, company);
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Package text copied! Opening Instagram…");
      setTimeout(
        () => window.open("https://www.instagram.com/direct/inbox/", "_blank"),
        800,
      );
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 print:hidden">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: "/editor" })}
            className="font-sans border-border/60"
            data-ocid="preview.back.button"
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

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          {/* Copy Text */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyText}
            className="font-sans border-border/60 text-xs"
            data-ocid="preview.copy.button"
          >
            <Copy className="w-3.5 h-3.5 mr-1.5" />
            Copy Text
          </Button>

          {/* WhatsApp */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleWhatsApp}
            className="font-sans border-green-500/40 text-green-400 hover:bg-green-500/10 text-xs"
            data-ocid="preview.whatsapp.button"
          >
            <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
            WhatsApp
          </Button>

          {/* Email */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleEmail}
            className="font-sans border-blue-400/40 text-blue-400 hover:bg-blue-400/10 text-xs"
            data-ocid="preview.email.button"
          >
            <Mail className="w-3.5 h-3.5 mr-1.5" />
            Email
          </Button>

          {/* Instagram */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleInstagram}
            className="font-sans border-pink-400/40 text-pink-400 hover:bg-pink-400/10 text-xs"
            data-ocid="preview.instagram.button"
          >
            <Instagram className="w-3.5 h-3.5 mr-1.5" />
            Instagram
          </Button>

          {/* Share panel toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowShare(!showShare)}
            className="font-sans border-teal/40 text-teal hover:bg-teal/10 text-xs"
            data-ocid="preview.share.button"
          >
            <Share2 className="w-3.5 h-3.5 mr-1.5" />
            Share
          </Button>

          {/* Download Image */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadImage}
            className="font-sans border-gold/40 text-gold hover:bg-gold/10 text-xs"
            data-ocid="preview.download_image.button"
          >
            <FileImage className="w-3.5 h-3.5 mr-1.5" />
            Save Image
          </Button>

          {/* Print / PDF */}
          <Button
            size="sm"
            onClick={handleDownloadPdf}
            className="font-sans bg-teal hover:bg-teal-dark text-white text-xs"
            data-ocid="preview.print.button"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            Print / PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Preview */}
        <div className="xl:col-span-2">
          <div
            ref={previewRef}
            id="package-preview-root"
            className="border border-border rounded-xl overflow-hidden shadow-lg bg-white print-preview-wrapper"
          >
            <PackageTemplatePreview state={state} />
          </div>
        </div>

        {/* Share Panel — visible by default */}
        <div
          className={`xl:col-span-1 print:hidden ${showShare ? "" : "hidden xl:hidden"}`}
        >
          <SharePanel state={state} company={company} />
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          .print\\:hidden { display: none !important; }
          #package-preview-root,
          #package-preview-root * {
            visibility: visible !important;
          }
          #package-preview-root {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            z-index: 99999 !important;
            background: white !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
          @page {
            margin: 0;
            size: A4;
          }
        }
      `}</style>
    </div>
  );
}

function buildShareText(
  state: ReturnType<typeof packageStore.get>,
  company: ReturnType<typeof companyStore.get>,
): string {
  const maleAdults = state.maleAdults ?? 0;
  const femaleAdults = state.femaleAdults ?? 0;
  const tgOthers = state.tgOthers ?? 0;
  const kids = state.kids ?? 0;
  const hasDetailedGuests =
    maleAdults > 0 || femaleAdults > 0 || tgOthers > 0 || kids > 0;

  const guestLine = hasDetailedGuests
    ? [
        maleAdults > 0
          ? `${maleAdults} Male Adult${maleAdults > 1 ? "s" : ""}`
          : "",
        femaleAdults > 0
          ? `${femaleAdults} Female Adult${femaleAdults > 1 ? "s" : ""}`
          : "",
        tgOthers > 0 ? `${tgOthers} TG/Other${tgOthers > 1 ? "s" : ""}` : "",
        kids > 0 ? `${kids} Kid${kids > 1 ? "s" : ""}` : "",
      ]
        .filter(Boolean)
        .join(", ")
    : `${state.adults} Adults, ${state.children} Children`;

  const lines = [
    `🌟 ${company.name || "Memorable Holidays"} — ${state.category || "Tour"} Package`,
    "",
    `👤 Guest: ${state.guestName}`,
    `📅 Travel Dates: ${state.travelDates || "TBD"}`,
    `👥 Guests: ${guestLine}`,
    "",
    state.hotel
      ? `🏨 Hotel: ${state.hotel}${state.roomType ? ` (${state.roomType})` : ""}`
      : "",
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
    `💰 *Total Cost: ₹${state.totalCost.toLocaleString()}*`,
    "",
    company.whatsapp ? `📱 WhatsApp: ${company.whatsapp}` : "",
    company.email ? `✉️ Email: ${company.email}` : "",
    company.phone ? `📞 Phone: ${company.phone}` : "",
    company.website ? `🌐 ${company.website}` : "",
  ];
  return lines.filter(Boolean).join("\n");
}
