import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { packageStore } from "../lib/packageStore";

const categories = [
  {
    name: "Beach",
    image: "/assets/generated/category-beach.dim_128x128.png",
    desc: "Sun, sand & sea escapes",
    color: "from-teal/30 to-blue-900/30",
    iconGlow: "rgba(0,200,200,0.55)",
    iconBg: "from-teal-dark/60 via-teal/20 to-blue-900/40",
  },
  {
    name: "Adventure",
    image: "/assets/generated/category-adventure.dim_128x128.png",
    desc: "Thrilling mountain & outdoor",
    color: "from-green-900/40 to-teal/20",
    iconGlow: "rgba(0,180,120,0.55)",
    iconBg: "from-green-900/70 via-green-800/30 to-teal/20",
  },
  {
    name: "Cultural",
    image: "/assets/generated/category-cultural.dim_128x128.png",
    desc: "Heritage, art & traditions",
    color: "from-orange-900/40 to-gold/20",
    iconGlow: "rgba(201,162,39,0.55)",
    iconBg: "from-orange-900/70 via-orange-800/30 to-gold/20",
  },
  {
    name: "Honeymoon",
    image: "/assets/generated/category-honeymoon.dim_128x128.png",
    desc: "Romantic getaways for couples",
    color: "from-pink-900/40 to-gold/20",
    iconGlow: "rgba(220,100,120,0.55)",
    iconBg: "from-pink-900/70 via-pink-800/30 to-rose-900/40",
  },
  {
    name: "Family",
    image: "/assets/generated/category-family.dim_128x128.png",
    desc: "Fun-filled family vacations",
    color: "from-teal/30 to-cyan-900/30",
    iconGlow: "rgba(0,200,220,0.55)",
    iconBg: "from-cyan-900/70 via-teal/30 to-cyan-800/20",
  },
  {
    name: "Corporate",
    image: "/assets/generated/category-corporate.dim_128x128.png",
    desc: "Business travel & retreats",
    color: "from-slate-700/60 to-teal/20",
    iconGlow: "rgba(100,130,180,0.5)",
    iconBg: "from-slate-700/70 via-slate-600/30 to-teal/20",
  },
  {
    name: "Wildlife",
    image: "/assets/generated/category-wildlife.dim_128x128.png",
    desc: "Safari & nature expeditions",
    color: "from-green-900/50 to-gold/20",
    iconGlow: "rgba(120,180,40,0.5)",
    iconBg: "from-green-900/80 via-green-700/30 to-gold/20",
  },
  {
    name: "Religious",
    image: "/assets/generated/category-religious.dim_128x128.png",
    desc: "Pilgrimage & spiritual journeys",
    color: "from-orange-900/50 to-gold/30",
    iconGlow: "rgba(201,162,39,0.6)",
    iconBg: "from-orange-900/80 via-amber-800/30 to-gold/30",
  },
  {
    name: "Cruise",
    image: "/assets/generated/category-cruise.dim_128x128.png",
    desc: "Luxury ocean & river cruises",
    color: "from-blue-900/50 to-teal/20",
    iconGlow: "rgba(0,100,220,0.55)",
    iconBg: "from-blue-900/80 via-blue-800/30 to-teal/20",
  },
  {
    name: "Hill Station",
    image: "/assets/generated/category-hillstation.dim_128x128.png",
    desc: "Cool mountain retreats & misty valleys",
    color: "from-emerald-900/50 to-green-800/30",
    iconGlow: "rgba(40,160,100,0.5)",
    iconBg: "from-emerald-900/80 via-emerald-700/30 to-green-800/20",
  },
  {
    name: "Backpacking",
    image: "/assets/generated/category-backpacking.dim_128x128.png",
    desc: "Budget adventures & trail exploration",
    color: "from-amber-900/50 to-orange-800/30",
    iconGlow: "rgba(200,120,40,0.55)",
    iconBg: "from-amber-900/80 via-amber-700/30 to-orange-800/20",
  },
  {
    name: "Heritage",
    image: "/assets/generated/category-cultural.dim_128x128.png",
    desc: "UNESCO sites & historical wonders",
    color: "from-yellow-900/50 to-gold/20",
    iconGlow: "rgba(201,162,39,0.6)",
    iconBg: "from-yellow-900/80 via-yellow-800/30 to-gold/20",
  },
];

export default function CategorySelectionPage() {
  const navigate = useNavigate();

  const handleSelect = (category: string) => {
    packageStore.reset();
    packageStore.set({ category });
    navigate({ to: "/templates/$category", params: { category } });
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <p className="text-xs font-sans text-muted-foreground uppercase tracking-widest mb-2">
          Step 1 of 3
        </p>
        <h2 className="text-3xl font-display font-bold text-foreground mb-1">
          Choose Package Category
        </h2>
        <p className="text-muted-foreground font-sans text-sm">
          Select the type of tourism experience you want to create
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl">
        {categories.map(({ name, image, desc, color, iconGlow, iconBg }) => (
          <button
            key={name}
            type="button"
            onClick={() => handleSelect(name)}
            className={`group relative overflow-hidden rounded-2xl border border-border/60 hover:border-gold/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-gold text-left bg-gradient-to-br ${color}`}
          >
            <div className="absolute inset-0 bg-card/60" />
            {/* Subtle shimmer sweep on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
            <div className="relative p-5 flex flex-col gap-3">
              {/* Gradient border wrapper */}
              <div
                className="w-16 h-16 rounded-2xl p-[1.5px] shadow-lg transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${iconGlow.replace("0.55", "0.6")}, transparent 60%, rgba(0,200,200,0.2))`,
                  boxShadow: `0 0 0 0 ${iconGlow}`,
                }}
              >
                {/* Icon container with radial gradient bg */}
                <div
                  className={`w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br ${iconBg} relative transition-all duration-300`}
                >
                  {/* Radial glow behind icon */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at center, ${iconGlow} 0%, transparent 70%)`,
                    }}
                  />
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 relative z-10"
                    style={{
                      filter: "drop-shadow(0 0 0px transparent)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLImageElement).style.filter =
                        `drop-shadow(0 0 8px ${iconGlow})`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLImageElement).style.filter =
                        "drop-shadow(0 0 0px transparent)";
                    }}
                  />
                </div>
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-foreground mb-0.5">
                  {name}
                </h3>
                <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                  {desc}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-gold opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 mt-auto" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
