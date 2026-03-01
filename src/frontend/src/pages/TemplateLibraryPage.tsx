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
  category,
}: { design?: string; colorScheme: string; category: string }) {
  const t = TEMPLATE_THEMES[colorScheme] || TEMPLATE_THEMES["gold-teal"];

  return (
    <div
      className="w-full aspect-[3/4] rounded-t-lg overflow-hidden relative"
      style={{ backgroundColor: t.bg }}
    >
      {/* Header bar */}
      <div
        className="absolute top-0 left-0 right-0 h-9 flex items-center px-3 gap-2"
        style={{
          backgroundColor: `${t.header}22`,
          borderBottom: `1px solid ${t.header}44`,
        }}
      >
        <div
          className="w-5 h-5 rounded-full"
          style={{ backgroundColor: `${t.accent}cc` }}
        />
        <div
          className="h-2 rounded flex-1"
          style={{ backgroundColor: `${t.accent}55` }}
        />
        <div className="text-right">
          <div
            className="h-1.5 w-10 rounded"
            style={{ backgroundColor: `${t.accent}44` }}
          />
        </div>
      </div>

      {/* Content area */}
      <div className="absolute top-11 left-3 right-3 space-y-2">
        <div
          className="h-4 rounded"
          style={{ backgroundColor: `${t.accent}aa`, width: "65%" }}
        />
        <div
          className="h-2 rounded"
          style={{ backgroundColor: `${t.text}33`, width: "90%" }}
        />
        <div
          className="h-2 rounded"
          style={{ backgroundColor: `${t.text}22`, width: "75%" }}
        />

        <div
          className="mt-2 pt-2 border-t"
          style={{ borderColor: `${t.accent}22` }}
        >
          {/* Simulated package info grid */}
          <div className="grid grid-cols-2 gap-1.5 mt-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded p-1.5"
                style={{
                  backgroundColor: `${t.accent}15`,
                  border: `1px solid ${t.accent}22`,
                }}
              >
                <div
                  className="h-1.5 rounded mb-1"
                  style={{ backgroundColor: `${t.accent}88`, width: "60%" }}
                />
                <div
                  className="h-1 rounded"
                  style={{ backgroundColor: `${t.text}33`, width: "80%" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Activities row */}
        <div className="flex gap-1 flex-wrap mt-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-4 rounded-full px-2"
              style={{
                backgroundColor: `${t.accent}25`,
                border: `1px solid ${t.accent}33`,
              }}
            >
              <div
                className="h-1.5 w-8 rounded mt-1"
                style={{ backgroundColor: `${t.accent}66` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Cost summary bar at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-10 flex items-center justify-between px-3"
        style={{ backgroundColor: `${t.header}dd` }}
      >
        <div
          className="h-2 w-16 rounded"
          style={{ backgroundColor: `${t.accent}88` }}
        />
        <div
          className="h-3 w-12 rounded"
          style={{ backgroundColor: t.accent }}
        />
      </div>

      {/* Design label overlay */}
      <div
        className="absolute top-10 right-2 opacity-30"
        style={{
          color: t.accent,
          fontSize: "7px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        {category}
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
