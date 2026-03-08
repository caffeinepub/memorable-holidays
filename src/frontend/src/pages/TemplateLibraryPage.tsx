import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useAddTemplate,
  useGetCallerUserProfile,
  useGetTemplatesByCategory,
} from "../hooks/useQueries";
import { packageStore } from "../lib/packageStore";

const BUILT_IN_TEMPLATES = [
  {
    design: "classic",
    colorScheme: "gold-teal",
    layout: "single-column",
    sections: "header,highlights,rates,contact",
  },
  {
    design: "modern",
    colorScheme: "teal-white",
    layout: "two-column",
    sections: "header,gallery,rates,highlights,contact",
  },
  {
    design: "luxury",
    colorScheme: "dark-gold",
    layout: "full-bleed",
    sections: "hero,highlights,hotel,rates,contact",
  },
  {
    design: "minimal",
    colorScheme: "white-teal",
    layout: "card-grid",
    sections: "header,rates,contact",
  },
  {
    design: "vibrant",
    colorScheme: "coral-teal",
    layout: "magazine",
    sections: "hero,gallery,highlights,rates,offers,contact",
  },
  {
    design: "elegant",
    colorScheme: "navy-gold",
    layout: "centered",
    sections: "header,hotel,events,rates,contact",
  },
  {
    design: "adventure",
    colorScheme: "forest-gold",
    layout: "split",
    sections: "hero,activities,rates,highlights,contact",
  },
  {
    design: "tropical",
    colorScheme: "ocean-sand",
    layout: "mosaic",
    sections: "hero,gallery,boating,rates,contact",
  },
  {
    design: "heritage",
    colorScheme: "terracotta-gold",
    layout: "scroll",
    sections: "header,cultural,events,rates,contact",
  },
  {
    design: "premium",
    colorScheme: "black-gold",
    layout: "luxury-grid",
    sections: "hero,hotel,highlights,rates,offers,contact",
  },
];

const TEMPLATE_THEMES: Record<
  string,
  { bg: string; header: string; accent: string; text: string; tag: string }
> = {
  "gold-teal": {
    bg: "#0f1f1f",
    header: "#c9a227",
    accent: "#c9a227",
    text: "#f5f0e8",
    tag: "Classic",
  },
  "teal-white": {
    bg: "#0a1a1a",
    header: "#008080",
    accent: "#00b3b3",
    text: "#e0f0f0",
    tag: "Modern",
  },
  "dark-gold": {
    bg: "#0a0a14",
    header: "#d4af37",
    accent: "#d4af37",
    text: "#f5f0e8",
    tag: "Luxury",
  },
  "white-teal": {
    bg: "#f0fafa",
    header: "#20b2aa",
    accent: "#20b2aa",
    text: "#1a3a3a",
    tag: "Minimal",
  },
  "coral-teal": {
    bg: "#1a0a08",
    header: "#e07060",
    accent: "#008080",
    text: "#fff5f0",
    tag: "Vibrant",
  },
  "navy-gold": {
    bg: "#080e1c",
    header: "#d4af37",
    accent: "#d4af37",
    text: "#e8ecf8",
    tag: "Elegant",
  },
  "forest-gold": {
    bg: "#081408",
    header: "#c9a227",
    accent: "#c9a227",
    text: "#e8f0e8",
    tag: "Adventure",
  },
  "ocean-sand": {
    bg: "#081018",
    header: "#0077b6",
    accent: "#00a6e0",
    text: "#e0f0ff",
    tag: "Tropical",
  },
  "terracotta-gold": {
    bg: "#140802",
    header: "#d4af37",
    accent: "#d4af37",
    text: "#fdf5f0",
    tag: "Heritage",
  },
  "black-gold": {
    bg: "#050505",
    header: "#d4af37",
    accent: "#d4af37",
    text: "#f8f8f8",
    tag: "Premium",
  },
};

function TemplateThumbnail({
  colorScheme,
  design,
  category,
}: { design?: string; colorScheme: string; category: string }) {
  const t = TEMPLATE_THEMES[colorScheme] || TEMPLATE_THEMES["gold-teal"];
  const isLight = colorScheme === "white-teal";

  return (
    <div
      className="w-full aspect-[3/4] rounded-t-lg overflow-hidden relative"
      style={{ backgroundColor: t.bg }}
    >
      {/* Watermark diagonal pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, ${t.accent} 0px, ${t.accent} 1px, transparent 1px, transparent 12px)`,
        }}
      />

      {/* Hero image simulation — tall gradient header */}
      <div
        className="absolute top-0 left-0 right-0 h-16"
        style={{
          background: `linear-gradient(160deg, ${t.header}cc 0%, ${t.bg} 100%)`,
          borderBottom: `1px solid ${t.accent}33`,
        }}
      >
        {/* Overlay texture */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(ellipse at 70% 50%, ${t.accent}55, transparent 70%)`,
          }}
        />
        {/* Logo placeholder: circle + text lines */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center shadow-md"
            style={{
              background: `linear-gradient(135deg, ${t.accent}, ${t.header}bb)`,
              border: `1.5px solid ${t.accent}99`,
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: isLight ? t.bg : `${t.text}cc` }}
            />
          </div>
          <div className="space-y-0.5">
            <div
              className="h-1.5 w-14 rounded"
              style={{ backgroundColor: `${t.text}cc` }}
            />
            <div
              className="h-1 w-9 rounded"
              style={{ backgroundColor: `${t.text}55` }}
            />
          </div>
        </div>
        {/* Top-right design badge */}
        <div
          className="absolute right-2 top-2 px-1.5 py-0.5 rounded-full"
          style={{
            backgroundColor: `${t.accent}33`,
            border: `1px solid ${t.accent}66`,
          }}
        >
          <span
            style={{
              color: t.accent,
              fontSize: "6px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.8px",
            }}
          >
            {design ?? t.tag}
          </span>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute left-0 right-0" style={{ top: "60px" }}>
        <svg
          aria-hidden="true"
          viewBox="0 0 100 8"
          preserveAspectRatio="none"
          style={{ width: "100%", height: "8px", display: "block" }}
        >
          <path d="M0,4 C25,8 75,0 100,4 L100,8 L0,8 Z" fill={t.bg} />
        </svg>
      </div>

      {/* Content area */}
      <div
        className="absolute left-3 right-3 space-y-2"
        style={{ top: "72px" }}
      >
        {/* Category label + title lines */}
        <div className="flex items-center gap-1.5 mb-1">
          <div
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: t.accent }}
          />
          <div
            className="h-1.5 w-10 rounded"
            style={{ backgroundColor: `${t.accent}77`, fontSize: "5px" }}
          />
        </div>
        <div
          className="h-3 rounded font-bold"
          style={{ backgroundColor: `${t.accent}bb`, width: "72%" }}
        />
        <div
          className="h-1.5 rounded"
          style={{ backgroundColor: `${t.text}44`, width: "90%" }}
        />
        <div
          className="h-1.5 rounded"
          style={{ backgroundColor: `${t.text}2a`, width: "65%" }}
        />

        {/* Photo grid simulation */}
        <div className="grid grid-cols-3 gap-1 mt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded"
              style={{
                height: "22px",
                background:
                  i === 0
                    ? `linear-gradient(135deg, ${t.header}99, ${t.accent}55)`
                    : i === 1
                      ? `linear-gradient(135deg, ${t.accent}66, ${t.header}44)`
                      : `linear-gradient(135deg, ${t.bg}ff, ${t.accent}33)`,
                border: `1px solid ${t.accent}22`,
              }}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="pt-1 border-t" style={{ borderColor: `${t.accent}20` }}>
          {/* Package info grid */}
          <div className="grid grid-cols-2 gap-1 mt-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded p-1"
                style={{
                  backgroundColor: `${t.accent}12`,
                  border: `1px solid ${t.accent}1e`,
                }}
              >
                <div
                  className="h-1.5 rounded mb-0.5"
                  style={{ backgroundColor: `${t.accent}88`, width: "55%" }}
                />
                <div
                  className="h-1 rounded"
                  style={{ backgroundColor: `${t.text}2e`, width: "75%" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Tag pills */}
        <div className="flex gap-1 flex-wrap">
          {[category, "Andaman", "Luxury"].slice(0, 3).map((tag) => (
            <div
              key={tag}
              className="rounded-full px-1.5 py-0.5"
              style={{
                backgroundColor: `${t.accent}1e`,
                border: `1px solid ${t.accent}33`,
              }}
            >
              <div
                className="h-1.5 rounded"
                style={{
                  backgroundColor: `${t.accent}66`,
                  width: `${tag.length * 3.5}px`,
                  maxWidth: "24px",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom price bar — gradient + prominent price badge */}
      <div
        className="absolute bottom-0 left-0 right-0 h-11 flex items-center justify-between px-3"
        style={{
          background: `linear-gradient(90deg, ${t.header}ee, ${t.accent}cc)`,
          borderTop: `1px solid ${t.accent}55`,
        }}
      >
        <div className="space-y-0.5">
          <div
            className="h-1.5 w-12 rounded"
            style={{ backgroundColor: `${t.text}55` }}
          />
          <div
            className="h-1 w-16 rounded"
            style={{ backgroundColor: `${t.text}33` }}
          />
        </div>
        {/* Price badge */}
        <div
          className="px-2 py-1 rounded-full shadow-md"
          style={{
            background: `linear-gradient(135deg, ${t.accent}, ${t.header}dd)`,
            border: `1px solid ${t.text}22`,
          }}
        >
          <div
            className="h-2 w-10 rounded"
            style={{ backgroundColor: isLight ? t.bg : `${t.text}dd` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function TemplateLibraryPage() {
  const { category } = useParams({ from: "/app/templates/$category" });
  const navigate = useNavigate();
  const { data: backendTemplates = [], isLoading } =
    useGetTemplatesByCategory(category);
  const { mutateAsync: addTemplate, isPending: isAdding } = useAddTemplate();
  const { data: userProfile } = useGetCallerUserProfile();
  const isAdmin = userProfile?.role === "admin";
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && backendTemplates.length === 0 && isAdmin) {
      const seedTemplates = async () => {
        for (let i = 0; i < BUILT_IN_TEMPLATES.length; i++) {
          const t = BUILT_IN_TEMPLATES[i];
          try {
            await addTemplate({
              id: BigInt(Date.now() + i),
              category,
              design: t.design,
              layout: t.layout,
              colorScheme: t.colorScheme,
              sections: t.sections,
            });
          } catch {
            /* ignore */
          }
        }
      };
      seedTemplates();
    }
  }, [isLoading, backendTemplates.length, isAdmin, category, addTemplate]);

  const displayTemplates =
    backendTemplates.length > 0
      ? backendTemplates
      : BUILT_IN_TEMPLATES.map((t, i) => ({
          id: BigInt(i + 1),
          category,
          ...t,
        }));

  const handleSelectTemplate = (template: (typeof displayTemplates)[0]) => {
    setSelectedId(String(template.id));
    packageStore.set({
      templateId: Number(template.id),
      templateDesign: template.design,
      templateColorScheme: template.colorScheme,
    });
    setTimeout(() => navigate({ to: "/editor" }), 300);
  };

  const tagColors: Record<string, string> = {
    Classic: "bg-gold/15 text-gold border-gold/30",
    Modern: "bg-teal/15 text-teal border-teal/30",
    Luxury: "bg-gold/20 text-gold-light border-gold/40",
    Minimal: "bg-muted text-muted-foreground border-border",
    Vibrant: "bg-orange-900/30 text-orange-300 border-orange-800/40",
    Elegant: "bg-blue-900/30 text-blue-300 border-blue-800/40",
    Adventure: "bg-green-900/30 text-green-300 border-green-800/40",
    Tropical: "bg-cyan-900/30 text-cyan-300 border-cyan-800/40",
    Heritage: "bg-orange-900/30 text-amber-300 border-amber-800/40",
    Premium: "bg-gold/20 text-gold border-gold/40",
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate({ to: "/categories" })}
          className="font-sans border-border/60"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <div>
          <p className="text-xs font-sans text-muted-foreground uppercase tracking-widest mb-0.5">
            Step 2 of 3
          </p>
          <h2 className="text-2xl font-display font-bold text-foreground">
            {category} Templates
          </h2>
        </div>
      </div>

      {isLoading || isAdding ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
          <p className="text-muted-foreground font-sans text-sm">
            Loading premium templates...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {displayTemplates.map((template) => {
            const themeInfo =
              TEMPLATE_THEMES[template.colorScheme] ||
              TEMPLATE_THEMES["gold-teal"];
            const tag = themeInfo.tag;
            const isSelected = selectedId === String(template.id);
            return (
              <button
                key={String(template.id)}
                type="button"
                className={`group cursor-pointer rounded-xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 text-left w-full ${
                  isSelected
                    ? "border-gold shadow-glow-gold scale-[1.02]"
                    : "border-border/60 hover:border-gold/40 hover:shadow-gold"
                }`}
                onClick={() => handleSelectTemplate(template)}
              >
                <TemplateThumbnail
                  design={template.design}
                  colorScheme={template.colorScheme}
                  category={category}
                />
                <div className="p-3 bg-card border-t border-border/50">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-display font-bold text-sm text-foreground capitalize">
                      {template.design}
                    </p>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-gold" />
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge
                      variant="outline"
                      className={`text-[9px] font-sans h-4 px-1.5 capitalize ${tagColors[tag] || "bg-muted text-muted-foreground"}`}
                    >
                      {tag}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-[9px] font-sans h-4 px-1.5 capitalize border-border/50 text-muted-foreground"
                    >
                      {template.layout}
                    </Badge>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
