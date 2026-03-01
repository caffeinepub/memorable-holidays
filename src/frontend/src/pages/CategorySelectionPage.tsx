import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { packageStore } from "../lib/packageStore";

const categories = [
  {
    name: "Beach",
    image: "/assets/generated/category-beach.dim_128x128.png",
    desc: "Sun, sand & sea escapes",
    color: "from-teal/30 to-blue-900/30",
  },
  {
    name: "Adventure",
    image: "/assets/generated/category-adventure.dim_128x128.png",
    desc: "Thrilling mountain & outdoor",
    color: "from-green-900/40 to-teal/20",
  },
  {
    name: "Cultural",
    image: "/assets/generated/category-cultural.dim_128x128.png",
    desc: "Heritage, art & traditions",
    color: "from-orange-900/40 to-gold/20",
  },
  {
    name: "Honeymoon",
    image: "/assets/generated/category-honeymoon.dim_128x128.png",
    desc: "Romantic getaways for couples",
    color: "from-pink-900/40 to-gold/20",
  },
  {
    name: "Family",
    image: "/assets/generated/category-family.dim_128x128.png",
    desc: "Fun-filled family vacations",
    color: "from-teal/30 to-cyan-900/30",
  },
  {
    name: "Corporate",
    image: "/assets/generated/category-corporate.dim_128x128.png",
    desc: "Business travel & retreats",
    color: "from-slate-700/60 to-teal/20",
  },
  {
    name: "Wildlife",
    image: "/assets/generated/category-wildlife.dim_128x128.png",
    desc: "Safari & nature expeditions",
    color: "from-green-900/50 to-gold/20",
  },
  {
    name: "Religious",
    image: "/assets/generated/category-religious.dim_128x128.png",
    desc: "Pilgrimage & spiritual journeys",
    color: "from-orange-900/50 to-gold/30",
  },
  {
    name: "Cruise",
    image: "/assets/generated/category-cruise.dim_128x128.png",
    desc: "Luxury ocean & river cruises",
    color: "from-blue-900/50 to-teal/20",
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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 max-w-4xl">
        {categories.map(({ name, image, desc, color }) => (
          <button
            key={name}
            type="button"
            onClick={() => handleSelect(name)}
            className={`group relative overflow-hidden rounded-2xl border border-border/60 hover:border-gold/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-gold text-left bg-gradient-to-br ${color}`}
          >
            <div className="absolute inset-0 bg-card/60" />
            <div className="relative p-5 flex flex-col gap-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-border/60 group-hover:border-gold/50 transition-colors shadow-md">
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
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
