import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Calculator,
  Calendar,
  Copy,
  ExternalLink,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Printer,
  Users,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  useGetAllActivityRates,
  useGetAllBoatingRates,
  useGetAllFoodRates,
  useGetAllTravelRates,
  useGetCompanySettings,
  useGetHotelRates,
} from "../hooks/useQueries";

export default function QuickQuotePage() {
  const { data: hotelRates = [] } = useGetHotelRates();
  const { data: foodRates = [] } = useGetAllFoodRates();
  const { data: travelRates = [] } = useGetAllTravelRates();
  const { data: activityRates = [] } = useGetAllActivityRates();
  const { data: boatingRates = [] } = useGetAllBoatingRates();
  const { data: companySettings } = useGetCompanySettings();

  const [destination, setDestination] = useState("");
  const [travelDates, setTravelDates] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedHotel, setSelectedHotel] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [selectedFood, setSelectedFood] = useState("");
  const [selectedTravel, setSelectedTravel] = useState("");
  const [selectedBoating, setSelectedBoating] = useState("");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  // Unique hotel names
  const hotelNames = useMemo(
    () => Array.from(new Set(hotelRates.map((h) => h.hotelName))),
    [hotelRates],
  );

  // Room types for selected hotel
  const roomTypes = useMemo(
    () =>
      hotelRates
        .filter((h) => h.hotelName === selectedHotel)
        .map((h) => h.roomType),
    [hotelRates, selectedHotel],
  );

  // Hotel rate for selected hotel + room
  const hotelRate = useMemo(() => {
    const entry = hotelRates.find(
      (h) => h.hotelName === selectedHotel && h.roomType === selectedRoomType,
    );
    return entry ? Number(entry.rate) : 0;
  }, [hotelRates, selectedHotel, selectedRoomType]);

  const foodRate = useMemo(
    () =>
      foodRates.find((f) => f.name === selectedFood)
        ? Number(foodRates.find((f) => f.name === selectedFood)!.price)
        : 0,
    [foodRates, selectedFood],
  );

  const travelRate = useMemo(
    () =>
      travelRates.find((t) => t.name === selectedTravel)
        ? Number(travelRates.find((t) => t.name === selectedTravel)!.price)
        : 0,
    [travelRates, selectedTravel],
  );

  const boatingRate = useMemo(
    () =>
      boatingRates.find((b) => b.name === selectedBoating)
        ? Number(boatingRates.find((b) => b.name === selectedBoating)!.price)
        : 0,
    [boatingRates, selectedBoating],
  );

  const activityTotal = useMemo(
    () =>
      selectedActivities.reduce((sum, name) => {
        const rate = activityRates.find((a) => a.name === name);
        return sum + (rate ? Number(rate.price) : 0);
      }, 0),
    [activityRates, selectedActivities],
  );

  // Cost calculation: baseRate * adults + Math.floor(baseRate * children / 2)
  const calculateForGuests = (baseRate: number): number => {
    return baseRate * adults + Math.floor((baseRate * children) / 2);
  };

  const hotelTotal = calculateForGuests(hotelRate);
  const foodTotal = calculateForGuests(foodRate);
  const travelTotal = calculateForGuests(travelRate);
  const boatingTotal = calculateForGuests(boatingRate);
  const activitiesTotal = calculateForGuests(activityTotal);
  const grandTotal =
    hotelTotal + foodTotal + travelTotal + boatingTotal + activitiesTotal;

  const toggleActivity = (name: string) => {
    setSelectedActivities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name],
    );
  };

  const noRatesConfigured =
    hotelRates.length === 0 &&
    foodRates.length === 0 &&
    travelRates.length === 0;

  const companyName = companySettings?.companyName || "Memorable Holidays";
  const companyWhatsApp = companySettings?.whatsapp || "";
  const companyEmail = companySettings?.email || "";

  const buildQuoteText = () => {
    const lines = [
      `🌟 *${companyName}* — Quick Quote`,
      "",
      destination ? `📍 Destination: ${destination}` : "",
      travelDates ? `📅 Travel Dates: ${travelDates}` : "",
      `👥 Guests: ${adults} Adult${adults !== 1 ? "s" : ""}${children > 0 ? `, ${children} Child${children !== 1 ? "ren" : ""}` : ""}`,
      "",
      selectedHotel
        ? `🏨 Hotel: ${selectedHotel}${selectedRoomType ? ` (${selectedRoomType})` : ""} — ₹${hotelTotal.toLocaleString()}`
        : "",
      selectedFood
        ? `🍽️ Food Package: ${selectedFood} — ₹${foodTotal.toLocaleString()}`
        : "",
      selectedTravel
        ? `🚌 Transport: ${selectedTravel} — ₹${travelTotal.toLocaleString()}`
        : "",
      selectedActivities.length > 0
        ? `✨ Activities: ${selectedActivities.join(", ")} — ₹${activitiesTotal.toLocaleString()}`
        : "",
      selectedBoating
        ? `⛵ Boating: ${selectedBoating} — ₹${boatingTotal.toLocaleString()}`
        : "",
      grandTotal > 0 ? "" : "",
      grandTotal > 0 ? `💰 *TOTAL: ₹${grandTotal.toLocaleString()}*` : "",
      companyWhatsApp ? `\n📱 WhatsApp: ${companyWhatsApp}` : "",
      companyEmail ? `✉️ Email: ${companyEmail}` : "",
    ];
    return lines.filter(Boolean).join("\n");
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(buildQuoteText().replace(/\*/g, ""))
      .then(() => {
        toast.success("Quote copied to clipboard!");
      });
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(buildQuoteText())}`;
    window.open(url, "_blank");
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(
      `Quick Quote — ${destination || "Travel Package"} (₹${grandTotal.toLocaleString()})`,
    );
    const body = encodeURIComponent(buildQuoteText().replace(/\*/g, ""));
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-sidebar border-b border-border px-4 py-5">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center">
              <Zap className="w-4 h-4 text-gold" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              <span className="text-gradient-gold">Quick Quote Generator</span>
            </h2>
          </div>
          <p className="text-sm text-muted-foreground font-sans">
            Instantly calculate and share tour package pricing
          </p>
        </div>
      </div>

      {noRatesConfigured && (
        <div className="container mx-auto px-4 pt-4">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
            <p className="text-sm font-sans text-amber-400">
              ⚠️ No rates configured yet. Go to{" "}
              <a href="/settings/rates" className="underline font-medium">
                Settings → Rate Management
              </a>{" "}
              to add hotels, food packages, travel options, and activities.
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: Inputs */}
          <div className="xl:col-span-2 space-y-4">
            {/* Trip Info */}
            <Card className="premium-card">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold" />
                  Trip Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-sans">Destination</Label>
                    <Input
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Goa, Kerala, Maldives..."
                      className="font-sans text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-sans">Travel Dates</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={travelDates}
                        onChange={(e) => setTravelDates(e.target.value)}
                        placeholder="Dec 20–27, 2025"
                        className="pl-9 font-sans text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-sans flex items-center gap-1">
                      <Users className="w-3 h-3" /> Adults
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      value={adults}
                      onChange={(e) =>
                        setAdults(
                          Math.max(1, Number.parseInt(e.target.value) || 1),
                        )
                      }
                      className="font-sans text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-sans flex items-center gap-1">
                      <Users className="w-3 h-3" /> Children
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      value={children}
                      onChange={(e) =>
                        setChildren(
                          Math.max(0, Number.parseInt(e.target.value) || 0),
                        )
                      }
                      className="font-sans text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hotel & Room */}
            <Card className="premium-card">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-base flex items-center gap-2">
                  🏨 Hotel & Accommodation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {hotelRates.length === 0 ? (
                  <p className="text-sm text-muted-foreground font-sans">
                    No hotels configured.{" "}
                    <a href="/settings/rates" className="text-gold underline">
                      Add hotel rates →
                    </a>
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-sans">Hotel</Label>
                      <Select
                        value={selectedHotel}
                        onValueChange={(v) => {
                          setSelectedHotel(v);
                          setSelectedRoomType("");
                        }}
                      >
                        <SelectTrigger className="font-sans text-sm">
                          <SelectValue placeholder="Select hotel..." />
                        </SelectTrigger>
                        <SelectContent>
                          {hotelNames.map((name) => (
                            <SelectItem
                              key={name}
                              value={name}
                              className="font-sans text-sm"
                            >
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-sans">Room Type</Label>
                      <Select
                        value={selectedRoomType}
                        onValueChange={setSelectedRoomType}
                        disabled={!selectedHotel}
                      >
                        <SelectTrigger className="font-sans text-sm">
                          <SelectValue placeholder="Select room..." />
                        </SelectTrigger>
                        <SelectContent>
                          {roomTypes.map((rt) => (
                            <SelectItem
                              key={rt}
                              value={rt}
                              className="font-sans text-sm"
                            >
                              {rt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                {hotelRate > 0 && (
                  <p className="text-xs text-gold font-mono">
                    Base rate: ₹{hotelRate.toLocaleString()} / person →{" "}
                    <span className="font-bold">
                      ₹{hotelTotal.toLocaleString()} total
                    </span>
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Food & Travel */}
            <Card className="premium-card">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-base flex items-center gap-2">
                  🍽️ Food & Transport
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-sans">Food Package</Label>
                    {foodRates.length === 0 ? (
                      <p className="text-xs text-muted-foreground font-sans">
                        No food rates added
                      </p>
                    ) : (
                      <Select
                        value={selectedFood}
                        onValueChange={setSelectedFood}
                      >
                        <SelectTrigger className="font-sans text-sm">
                          <SelectValue placeholder="Select food..." />
                        </SelectTrigger>
                        <SelectContent>
                          {foodRates.map((f) => (
                            <SelectItem
                              key={f.name}
                              value={f.name}
                              className="font-sans text-sm"
                            >
                              {f.name} — ₹{Number(f.price).toLocaleString()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-sans">Travel Option</Label>
                    {travelRates.length === 0 ? (
                      <p className="text-xs text-muted-foreground font-sans">
                        No travel rates added
                      </p>
                    ) : (
                      <Select
                        value={selectedTravel}
                        onValueChange={setSelectedTravel}
                      >
                        <SelectTrigger className="font-sans text-sm">
                          <SelectValue placeholder="Select transport..." />
                        </SelectTrigger>
                        <SelectContent>
                          {travelRates.map((t) => (
                            <SelectItem
                              key={t.name}
                              value={t.name}
                              className="font-sans text-sm"
                            >
                              {t.name} — ₹{Number(t.price).toLocaleString()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activities & Boating */}
            <Card className="premium-card">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-base flex items-center gap-2">
                  ✨ Activities & Boating
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activityRates.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs font-sans">
                      Activities (select multiple)
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {activityRates.map((activity) => (
                        <div
                          key={activity.name}
                          className="flex items-center gap-2"
                        >
                          <Checkbox
                            id={`activity-${activity.name}`}
                            checked={selectedActivities.includes(activity.name)}
                            onCheckedChange={() =>
                              toggleActivity(activity.name)
                            }
                          />
                          <label
                            htmlFor={`activity-${activity.name}`}
                            className="text-sm font-sans text-foreground cursor-pointer flex-1"
                          >
                            {activity.name}
                            <span className="text-xs text-muted-foreground ml-1">
                              ₹{Number(activity.price).toLocaleString()}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {boatingRates.length > 0 && (
                  <div className="space-y-1">
                    <Label className="text-xs font-sans">Boating</Label>
                    <Select
                      value={selectedBoating}
                      onValueChange={setSelectedBoating}
                    >
                      <SelectTrigger className="font-sans text-sm max-w-xs">
                        <SelectValue placeholder="Select boating option..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none" className="font-sans text-sm">
                          None
                        </SelectItem>
                        {boatingRates.map((b) => (
                          <SelectItem
                            key={b.name}
                            value={b.name}
                            className="font-sans text-sm"
                          >
                            {b.name} — ₹{Number(b.price).toLocaleString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {activityRates.length === 0 && boatingRates.length === 0 && (
                  <p className="text-sm text-muted-foreground font-sans">
                    No activities or boating rates configured.{" "}
                    <a href="/settings/rates" className="text-gold underline">
                      Add rates →
                    </a>
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: Quote Summary */}
          <div className="xl:col-span-1">
            <div className="sticky top-36 space-y-4">
              <Card className="premium-card border-gold/30">
                <CardHeader className="pb-3">
                  <CardTitle className="font-display text-base flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-gold" />
                    Quote Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Guest Info */}
                  <div className="bg-sidebar/60 rounded-lg p-3 space-y-1">
                    <div className="flex items-center gap-2 text-sm font-sans">
                      <Users className="w-3.5 h-3.5 text-teal" />
                      <span className="text-foreground">
                        {adults} Adult{adults !== 1 ? "s" : ""}
                        {children > 0
                          ? ` + ${children} Child${children !== 1 ? "ren" : ""}`
                          : ""}
                      </span>
                    </div>
                    {destination && (
                      <div className="flex items-center gap-2 text-sm font-sans">
                        <MapPin className="w-3.5 h-3.5 text-teal" />
                        <span className="text-foreground">{destination}</span>
                      </div>
                    )}
                    {travelDates && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans">
                        <Calendar className="w-3 h-3" />
                        {travelDates}
                      </div>
                    )}
                  </div>

                  {/* Cost Breakdown */}
                  <div className="space-y-2">
                    {hotelTotal > 0 && (
                      <div className="flex justify-between text-sm font-sans">
                        <span className="text-muted-foreground">
                          🏨 {selectedHotel}
                          {selectedRoomType ? ` (${selectedRoomType})` : ""}
                        </span>
                        <span className="text-foreground font-medium">
                          ₹{hotelTotal.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {foodTotal > 0 && (
                      <div className="flex justify-between text-sm font-sans">
                        <span className="text-muted-foreground">
                          🍽️ {selectedFood}
                        </span>
                        <span className="text-foreground font-medium">
                          ₹{foodTotal.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {travelTotal > 0 && (
                      <div className="flex justify-between text-sm font-sans">
                        <span className="text-muted-foreground">
                          🚌 {selectedTravel}
                        </span>
                        <span className="text-foreground font-medium">
                          ₹{travelTotal.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {activitiesTotal > 0 && (
                      <div className="flex justify-between text-sm font-sans">
                        <span className="text-muted-foreground">
                          ✨ Activities ({selectedActivities.length})
                        </span>
                        <span className="text-foreground font-medium">
                          ₹{activitiesTotal.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {boatingTotal > 0 && (
                      <div className="flex justify-between text-sm font-sans">
                        <span className="text-muted-foreground">
                          ⛵ {selectedBoating}
                        </span>
                        <span className="text-foreground font-medium">
                          ₹{boatingTotal.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {grandTotal > 0 && <Separator />}

                  <div className="flex justify-between items-center">
                    <span className="font-display font-bold text-foreground">
                      Total
                    </span>
                    <span className="text-2xl font-display font-bold text-gold">
                      {grandTotal > 0
                        ? `₹${grandTotal.toLocaleString()}`
                        : "₹0"}
                    </span>
                  </div>

                  {adults > 1 && grandTotal > 0 && (
                    <p className="text-xs text-muted-foreground font-sans text-right">
                      ≈ ₹
                      {Math.round(
                        grandTotal / (adults + children * 0.5),
                      ).toLocaleString()}{" "}
                      per person
                    </p>
                  )}

                  {/* Pricing note */}
                  <div className="bg-gold/5 border border-gold/20 rounded-lg px-3 py-2">
                    <p className="text-[10px] font-sans text-muted-foreground">
                      Rate: (base × adults) + (base × children ÷ 2)
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Share Actions */}
              {grandTotal > 0 && (
                <Card className="premium-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="font-display text-sm text-foreground">
                      Share Quote
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <button
                      type="button"
                      onClick={handleWhatsApp}
                      className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg font-sans text-sm font-medium transition-colors bg-teal hover:bg-teal-dark text-sidebar"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Send via WhatsApp
                      <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
                    </button>
                    <button
                      type="button"
                      onClick={handleEmail}
                      className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg font-sans text-sm font-medium transition-colors bg-gold/20 border border-gold/40 text-gold hover:bg-gold/30"
                    >
                      <Mail className="w-4 h-4" />
                      Send via Email
                      <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
                    </button>
                    <Button
                      variant="outline"
                      className="w-full font-sans text-sm border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
                      onClick={handleCopy}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Quote Text
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full font-sans text-sm border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
                      onClick={() => window.print()}
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Print / Save PDF
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Company Info */}
              {(companySettings?.companyName ||
                companySettings?.whatsapp ||
                companySettings?.phone) && (
                <Card className="premium-card">
                  <CardContent className="pt-4 space-y-2">
                    <p className="text-xs font-sans font-semibold text-muted-foreground uppercase tracking-wide">
                      From
                    </p>
                    <p className="font-display font-bold text-foreground">
                      {companySettings.companyName}
                    </p>
                    {companySettings.tagline && (
                      <p className="text-xs text-muted-foreground font-sans">
                        {companySettings.tagline}
                      </p>
                    )}
                    {companySettings.phone && (
                      <p className="text-xs font-sans text-muted-foreground">
                        📞 {companySettings.phone}
                      </p>
                    )}
                    {companySettings.whatsapp && (
                      <p className="text-xs font-sans text-muted-foreground">
                        📱 {companySettings.whatsapp}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
