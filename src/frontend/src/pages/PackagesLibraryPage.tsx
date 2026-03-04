import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "@tanstack/react-router";
import {
  Calendar,
  CalendarDays,
  Copy,
  Edit,
  Eye,
  FileText,
  FolderOpen,
  Loader2,
  PlusCircle,
  Scale,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Package } from "../backend";
import {
  useDeletePackage,
  useGetAllPackages,
  useGetPackages,
} from "../hooks/useQueries";
import { useGetCallerUserProfile } from "../hooks/useQueries";
import { packageStore } from "../lib/packageStore";

export default function PackagesLibraryPage() {
  const navigate = useNavigate();
  const { data: userProfile } = useGetCallerUserProfile();
  const isAdmin = userProfile?.role === "admin";

  const { data: allPackages = [], isLoading: loadingAll } = useGetAllPackages();
  const { data: myPackages = [], isLoading: loadingMy } = useGetPackages();
  const { mutateAsync: deletePackage, isPending: isDeleting } =
    useDeletePackage();

  const packages = isAdmin ? allPackages : myPackages;
  const isLoading = isAdmin ? loadingAll : loadingMy;

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [compareMode, setCompareMode] = useState(false);
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const [showCompare, setShowCompare] = useState(false);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 3) {
        next.add(id);
      } else {
        return prev;
      }
      return next;
    });
  };

  const comparePkgs = packages.filter((p) => compareIds.has(String(p.id)));

  const categories = Array.from(new Set(packages.map((p) => p.category)));

  const filtered = packages.filter((p) => {
    const matchSearch =
      !search ||
      p.guest.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !categoryFilter || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const handleEdit = (pkg: Package) => {
    packageStore.loadFromPackage(pkg);
    navigate({ to: "/editor" });
  };

  const handlePreview = (pkg: Package) => {
    packageStore.loadFromPackage(pkg);
    navigate({ to: "/preview" });
  };

  const handleDuplicate = (pkg: Package) => {
    const duplicated = { ...pkg, id: BigInt(Date.now()) };
    packageStore.loadFromPackage(duplicated);
    navigate({ to: "/editor" });
    toast.success("Package duplicated — edit and save to create a copy");
  };

  const handleViewItinerary = (pkg: Package) => {
    packageStore.loadFromPackage(pkg);
    navigate({ to: "/itinerary" });
  };

  const handleCreateInvoice = (pkg: Package) => {
    packageStore.loadFromPackage(pkg);
    navigate({ to: "/invoices" });
  };

  const handleDelete = async (packageId: bigint) => {
    try {
      await deletePackage(packageId);
      toast.success("Package deleted");
    } catch {
      toast.error("Failed to delete package");
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="bg-sidebar border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-display font-bold text-foreground">
                  Packages Library
                </h2>
                <Badge
                  variant="outline"
                  className="font-sans text-xs border-gold/30 text-gold bg-gold/10"
                >
                  {packages.length} total
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground font-sans">
                Browse, edit, preview and share your tourism packages
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setCompareMode((m) => !m);
                if (compareMode) setCompareIds(new Set());
              }}
              className={`font-sans ${compareMode ? "border-gold/60 text-gold bg-gold/10" : "border-border/60 text-muted-foreground hover:text-foreground"}`}
              data-ocid="packages.compare.toggle"
            >
              <Scale className="w-4 h-4 mr-2" />
              {compareMode ? "Exit Compare" : "Compare"}
            </Button>
            <Button
              onClick={() => navigate({ to: "/categories" })}
              className="gradient-gold text-sidebar font-display font-bold shadow-gold hover:shadow-glow-gold transition-all"
              data-ocid="packages.new.primary_button"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              New Package
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by guest name or category..."
              className="pl-9 font-sans bg-card border-border/60 focus:border-gold/50"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={categoryFilter === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter("")}
              className={`font-sans text-xs ${categoryFilter === "" ? "gradient-gold text-sidebar shadow-gold" : "border-border/60 text-muted-foreground hover:border-gold/40 hover:text-gold"}`}
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={categoryFilter === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(cat)}
                className={`font-sans text-xs ${categoryFilter === cat ? "gradient-gold text-sidebar shadow-gold" : "border-border/60 text-muted-foreground hover:border-gold/40 hover:text-gold"}`}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
            <p className="text-muted-foreground font-sans text-sm">
              Loading packages...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-5">
              <FolderOpen className="w-10 h-10 text-gold/40" />
            </div>
            <h3 className="text-lg font-display font-semibold text-foreground mb-2">
              {packages.length === 0 ? "No packages yet" : "No matches found"}
            </h3>
            <p className="text-muted-foreground font-sans text-sm mb-6 max-w-xs mx-auto">
              {packages.length === 0
                ? "Create your first tourism package to get started"
                : "Try adjusting your search or filter criteria"}
            </p>
            {packages.length === 0 && (
              <Button
                onClick={() => navigate({ to: "/categories" })}
                className="gradient-gold text-sidebar font-display font-bold shadow-gold hover:shadow-glow-gold"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Create First Package
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((pkg) => (
              <Card
                key={String(pkg.id)}
                className={`premium-card hover:border-gold/40 hover:shadow-gold transition-all duration-300 group ${compareMode && compareIds.has(String(pkg.id)) ? "ring-2 ring-gold/60" : ""}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {compareMode && (
                        <Checkbox
                          checked={compareIds.has(String(pkg.id))}
                          onCheckedChange={() => toggleCompare(String(pkg.id))}
                          className="border-gold/50 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                          data-ocid="packages.compare.checkbox"
                        />
                      )}
                      <Badge
                        variant="outline"
                        className="font-sans text-xs border-teal/30 text-teal bg-teal/5"
                      >
                        {pkg.category}
                      </Badge>
                    </div>
                    <span className="text-base font-display font-bold text-gold">
                      ₹{Number(pkg.totalCost).toLocaleString()}
                    </span>
                  </div>

                  <h3 className="font-display font-semibold text-foreground text-lg mb-2 leading-tight">
                    {pkg.guest.name}
                  </h3>

                  <div className="space-y-1 mb-3">
                    {pkg.guest.travelDates && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans">
                        <Calendar className="w-3 h-3 shrink-0 text-gold/50" />
                        {pkg.guest.travelDates}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans">
                      <Users className="w-3 h-3 shrink-0 text-gold/50" />
                      {Number(pkg.guest.adults)} Adults ·{" "}
                      {Number(pkg.guest.children)} Children
                    </div>
                    {pkg.hotel && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans">
                        <span className="text-gold/50">🏨</span>
                        {pkg.hotel}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-border/50 space-y-2">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePreview(pkg)}
                        className="flex-1 font-sans text-xs border-border/60 hover:border-teal/40 hover:text-teal hover:bg-teal/5"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(pkg)}
                        className="flex-1 font-sans text-xs border-gold/30 text-gold hover:bg-gold/10 hover:border-gold/50"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDuplicate(pkg)}
                        className="font-sans text-xs border-border/60 text-muted-foreground hover:border-teal/40 hover:text-teal"
                        title="Duplicate"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="font-sans text-xs border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/60"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-card border-border">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="font-display text-foreground">
                              Delete Package?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="font-sans text-muted-foreground">
                              This will permanently delete the package for{" "}
                              <strong className="text-foreground">
                                {pkg.guest.name}
                              </strong>
                              . This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="font-sans">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(pkg.id)}
                              className="font-sans bg-destructive hover:bg-destructive/90"
                              disabled={isDeleting}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewItinerary(pkg)}
                        className="flex-1 font-sans text-xs border-border/60 text-muted-foreground hover:border-blue-400/40 hover:text-blue-400"
                      >
                        <CalendarDays className="w-3 h-3 mr-1" />
                        Itinerary
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCreateInvoice(pkg)}
                        className="flex-1 font-sans text-xs border-border/60 text-muted-foreground hover:border-orange-400/40 hover:text-orange-400"
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Invoice
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Floating Compare Button */}
      {compareMode && compareIds.size > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <Button
            onClick={() => setShowCompare(true)}
            className="gradient-gold text-sidebar font-display font-bold shadow-gold px-6 py-2.5 text-sm"
            data-ocid="packages.compare.primary_button"
          >
            <Scale className="w-4 h-4 mr-2" />
            Compare ({compareIds.size})
          </Button>
        </div>
      )}

      {/* Compare Dialog */}
      <Dialog open={showCompare} onOpenChange={setShowCompare}>
        <DialogContent
          className="bg-card border-border max-w-5xl max-h-[90vh] overflow-y-auto"
          data-ocid="packages.compare.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              Package Comparison
            </DialogTitle>
          </DialogHeader>
          {comparePkgs.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="font-sans text-xs text-muted-foreground uppercase w-32">
                      Field
                    </TableHead>
                    {comparePkgs.map((p) => (
                      <TableHead
                        key={String(p.id)}
                        className="font-sans text-xs font-semibold text-foreground"
                      >
                        {p.guest.name}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      label: "Category",
                      fn: (p: (typeof comparePkgs)[0]) => p.category,
                    },
                    {
                      label: "Destination",
                      fn: (p: (typeof comparePkgs)[0]) =>
                        p.guest.travelDates
                          ? `Travel: ${p.guest.travelDates}`
                          : "–",
                    },
                    {
                      label: "Adults",
                      fn: (p: (typeof comparePkgs)[0]) =>
                        String(Number(p.guest.adults)),
                    },
                    {
                      label: "Children",
                      fn: (p: (typeof comparePkgs)[0]) =>
                        String(Number(p.guest.children)),
                    },
                    {
                      label: "Travel Dates",
                      fn: (p: (typeof comparePkgs)[0]) =>
                        p.guest.travelDates || "–",
                    },
                    {
                      label: "Hotel",
                      fn: (p: (typeof comparePkgs)[0]) => p.hotel || "–",
                    },
                    {
                      label: "Total Cost",
                      fn: (p: (typeof comparePkgs)[0]) =>
                        `₹${Number(p.totalCost).toLocaleString()}`,
                    },
                  ].map((row) => (
                    <TableRow
                      key={row.label}
                      className="border-border hover:bg-accent/20"
                    >
                      <TableCell className="font-sans text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                        {row.label}
                      </TableCell>
                      {comparePkgs.map((p) => (
                        <TableCell
                          key={String(p.id)}
                          className={`font-sans text-sm ${row.label === "Total Cost" ? "text-gold font-mono font-bold" : "text-foreground"}`}
                        >
                          {row.fn(p)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
