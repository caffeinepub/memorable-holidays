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
import { masterDataStore } from "../lib/masterDataStore";

// ─── Destination rates from localStorage ─────────────────────────────────────

const DEST_RATES_KEY = "mh_destination_rates";

interface DestinationRate {
  destinationId: string;
  destinationName: string;
  islandGroup: string;
  entryFee: number;
  permitFee: number;
  guideFee: number;
  ferryCharge: number;
  notes: string;
}

function loadDestinationRates(): Record<string, DestinationRate> {
  try {
    const stored = localStorage.getItem(DEST_RATES_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

// ─── Guest Category Input ─────────────────────────────────────────────────────

interface GuestCounterProps {
  label: string;
  icon: string;
  value: number;
  min?: number;
  onChange: (v: number) => void;
  ocid: string;
}

function GuestCounter({
  label,
  icon,
  value,
  min = 0,
  onChange,
  ocid,
}: GuestCounterProps) {
  return (
    <div className="flex items-center justify-between gap-2 bg-sidebar/50 rounded-lg px-3 py-2 border border-border/40">
      <div className="flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <Label className="text-xs font-sans text-foreground cursor-pointer">
          {label}
        </Label>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-6 h-6 rounded-md border border-border/50 text-muted-foreground hover:text-foreground hover:border-gold/50 transition-colors flex items-center justify-center text-sm font-bold"
        >
          −
        </button>
        <Input
          type="number"
          min={min}
          value={value}
          onChange={(e) =>
            onChange(Math.max(min, Number.parseInt(e.target.value) || 0))
          }
          className="w-12 h-6 font-mono text-sm text-center p-0 border-none bg-transparent focus-visible:ring-0"
          data-ocid={ocid}
        />
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="w-6 h-6 rounded-md border border-border/50 text-muted-foreground hover:text-foreground hover:border-gold/50 transition-colors flex items-center justify-center text-sm font-bold"
        >
          +
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function QuickQuotePage() {
  const { data: hotelRates = [] } = useGetHotelRates();
  const { data: foodRates = [] } = useGetAllFoodRates();
  const { data: travelRates = [] } = useGetAllTravelRates();
  const { data: activityRates = [] } = useGetAllActivityRates();
  const { data: boatingRates = [] } = useGetAllBoatingRates();
  const { data: companySettings } = useGetCompanySettings();

  // All master data destinations (for Andaman grouped dropdown)
  const allDestinations = useMemo(() => masterDataStore.get().destinations, []);
  const destinationRates = useMemo(() => loadDestinationRates(), []);

  const [selectedDestId, setSelectedDestId] = useState("");
  const [travelDates, setTravelDates] = useState("");
  const [nights, setNights] = useState(3);

  // ── Detailed guest categories ─────────────────────────────────────────────
  const [maleAdults, setMaleAdults] = useState(1);
  const [femaleAdults, setFemaleAdults] = useState(1);
  const [tgAdults, setTgAdults] = useState(0);
  const [kids, setKids] = useState(0); // age 5–12, 60% adult rate
  const [infants, setInfants] = useState(0); // age 0–4, flat ₹500 each

  const [selectedHotel, setSelectedHotel] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [selectedFood, setSelectedFood] = useState("");
  const [selectedTravel, setSelectedTravel] = useState("");
  const [selectedBoating, setSelectedBoating] = useState("");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  // Derived counts
  const totalAdults = maleAdults + femaleAdults + tgAdults;
  const totalGuests = totalAdults + kids + infants;

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

  // ── Cost calculation with detailed guest categories ───────────────────────
  // Adults pay full rate, kids pay 60%, infants pay flat ₹500 each
  const calculateForGuests = (baseRate: number): number => {
    return (
      baseRate * totalAdults + Math.floor(baseRate * 0.6) * kids + 500 * infants
    );
  };

  const hotelTotal = calculateForGuests(hotelRate) * nights;
  const foodTotal = calculateForGuests(foodRate);
  const travelTotal = calculateForGuests(travelRate);
  const boatingTotal = calculateForGuests(boatingRate);
  const activitiesTotal = calculateForGuests(activityTotal);

  // Destination fees (entry + permit + ferry) per person × total adults + kids
  const selectedDestination = allDestinations.find(
    (d) => d.id === selectedDestId,
  );
  const destRate = selectedDestId ? destinationRates[selectedDestId] : null;
  const destFeesTotal = destRate
    ? (destRate.entryFee + destRate.permitFee + destRate.ferryCharge) *
        (totalAdults + kids) +
      destRate.guideFee
    : 0;

  const grandTotal =
    hotelTotal +
    foodTotal +
    travelTotal +
    boatingTotal +
    activitiesTotal +
    destFeesTotal;

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

  // Group destinations by island group for the dropdown
  const groupedDestinations = useMemo(() => {
    return allDestinations.reduce<Record<string, typeof allDestinations>>(
      (acc, d) => {
        const group = d.islandGroup || "Other";
        if (!acc[group]) acc[group] = [];
        acc[group].push(d);
        return acc;
      },
      {},
    );
  }, [allDestinations]);

  const buildQuoteText = () => {
    const destName = selectedDestination?.name || "";
    const lines = [
      `🌟 *${companyName}* — Quick Quote`,
      "",
      destName ? `📍 Destination: ${destName}` : "",
      selectedDestination?.islandGroup
        ? `🏝️ Island Group: ${selectedDestination.islandGroup}`
        : "",
      travelDates ? `📅 Travel Dates: ${travelDates}` : "",
      nights > 0
        ? `🌙 Duration: ${nights} Night${nights !== 1 ? "s" : ""}`
        : "",
      "",
      "👥 *Guest Details:*",
      maleAdults > 0 ? `  ♂ Male Adults: ${maleAdults}` : "",
      femaleAdults > 0 ? `  ♀ Female Adults: ${femaleAdults}` : "",
      tgAdults > 0 ? `  ⚧ TG/Others: ${tgAdults}` : "",
      kids > 0 ? `  👧 Kids (5–12 yrs): ${kids}` : "",
      infants > 0 ? `  🍼 Infants (0–4 yrs): ${infants}` : "",
      `  📊 Total: ${totalGuests} person${totalGuests !== 1 ? "s" : ""}`,
      "",
      selectedHotel
        ? `🏨 Hotel: ${selectedHotel}${selectedRoomType ? ` (${selectedRoomType})` : ""} × ${nights}N — ₹${hotelTotal.toLocaleString()}`
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
      destFeesTotal > 0
        ? `🎫 Destination Fees (Entry/Ferry/Permit): ₹${destFeesTotal.toLocaleString()}`
        : "",
      grandTotal > 0 ? "" : "",
      grandTotal > 0 ? `💰 *TOTAL: ₹${grandTotal.toLocaleString()}*` : "",
      totalGuests > 1 && grandTotal > 0
        ? `   (₹${Math.round(grandTotal / totalGuests).toLocaleString()} per person approx.)`
        : "",
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
      `Quick Quote — ${selectedDestination?.name || "Andaman Package"} (₹${grandTotal.toLocaleString()})`,
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
            Instantly calculate and share tour package pricing for Andaman &amp;
            Nicobar Islands
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
            {/* Trip Information */}
            <Card className="premium-card">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold" />
                  Trip Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Destination Dropdown — Andaman grouped */}
                <div className="space-y-1">
                  <Label className="text-xs font-sans">
                    Destination / Tourist Spot
                  </Label>
                  <Select
                    value={selectedDestId}
                    onValueChange={setSelectedDestId}
                  >
                    <SelectTrigger
                      className="font-sans text-sm"
                      data-ocid="quote.destination.select"
                    >
                      <SelectValue placeholder="Select Andaman destination..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      {Object.entries(groupedDestinations).map(
                        ([group, dests]) => (
                          <div key={group}>
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border/30 bg-sidebar/40">
                              🏝️ {group}
                            </div>
                            {dests.map((d) => (
                              <SelectItem
                                key={d.id}
                                value={d.id}
                                className="font-sans text-sm pl-5"
                              >
                                {d.name}
                                {destinationRates[d.id] && (
                                  <span className="ml-1 text-[10px] text-teal">
                                    ★ fees
                                  </span>
                                )}
                              </SelectItem>
                            ))}
                          </div>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  {selectedDestination && (
                    <p className="text-xs text-muted-foreground font-sans mt-1">
                      🏝️ {selectedDestination.islandGroup} ·{" "}
                      {selectedDestination.popularMonths}
                    </p>
                  )}
                  {destRate && destFeesTotal > 0 && (
                    <div className="flex items-center gap-2 bg-teal/5 border border-teal/20 rounded-lg px-3 py-1.5 mt-1">
                      <span className="text-xs text-teal font-sans">
                        🎫 Destination fees auto-applied: Entry ₹
                        {destRate.entryFee} + Ferry ₹{destRate.ferryCharge}
                        {destRate.permitFee > 0
                          ? ` + Permit ₹${destRate.permitFee}`
                          : ""}
                        {destRate.guideFee > 0
                          ? ` + Guide ₹${destRate.guideFee}`
                          : ""}{" "}
                        per relevant guest
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-sans">Travel Dates</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={travelDates}
                        onChange={(e) => setTravelDates(e.target.value)}
                        placeholder="Dec 20–27, 2025"
                        className="pl-9 font-sans text-sm"
                        data-ocid="quote.dates.input"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-sans">
                      Number of Nights
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      value={nights}
                      onChange={(e) =>
                        setNights(
                          Math.max(1, Number.parseInt(e.target.value) || 1),
                        )
                      }
                      className="font-sans text-sm"
                      data-ocid="quote.nights.input"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guest Categories */}
            <Card className="premium-card">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-gold" />
                  Guest Details
                  {totalGuests > 0 && (
                    <Badge
                      variant="outline"
                      className="ml-auto text-xs font-sans border-gold/40 text-gold"
                    >
                      {totalGuests} Guest{totalGuests !== 1 ? "s" : ""}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <GuestCounter
                    label="Male Adults"
                    icon="♂"
                    value={maleAdults}
                    min={0}
                    onChange={setMaleAdults}
                    ocid="quote.male_adults.input"
                  />
                  <GuestCounter
                    label="Female Adults"
                    icon="♀"
                    value={femaleAdults}
                    min={0}
                    onChange={setFemaleAdults}
                    ocid="quote.female_adults.input"
                  />
                  <GuestCounter
                    label="TG / Others"
                    icon="⚧"
                    value={tgAdults}
                    min={0}
                    onChange={setTgAdults}
                    ocid="quote.tg_adults.input"
                  />
                  <GuestCounter
                    label="Kids (5–12 yrs)"
                    icon="👧"
                    value={kids}
                    min={0}
                    onChange={setKids}
                    ocid="quote.kids.input"
                  />
                  <GuestCounter
                    label="Infants (0–4 yrs)"
                    icon="🍼"
                    value={infants}
                    min={0}
                    onChange={setInfants}
                    ocid="quote.infants.input"
                  />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="bg-sidebar/50 rounded-lg py-2 px-3">
                    <p className="text-xs text-muted-foreground font-sans">
                      Adults
                    </p>
                    <p className="text-lg font-display font-bold text-foreground">
                      {totalAdults}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-sans">
                      Full rate
                    </p>
                  </div>
                  <div className="bg-sidebar/50 rounded-lg py-2 px-3">
                    <p className="text-xs text-muted-foreground font-sans">
                      Kids
                    </p>
                    <p className="text-lg font-display font-bold text-teal">
                      {kids}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-sans">
                      60% rate
                    </p>
                  </div>
                  <div className="bg-sidebar/50 rounded-lg py-2 px-3">
                    <p className="text-xs text-muted-foreground font-sans">
                      Infants
                    </p>
                    <p className="text-lg font-display font-bold text-gold">
                      {infants}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-sans">
                      ₹500 flat
                    </p>
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
                        <SelectTrigger
                          className="font-sans text-sm"
                          data-ocid="quote.hotel.select"
                        >
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
                        <SelectTrigger
                          className="font-sans text-sm"
                          data-ocid="quote.roomtype.select"
                        >
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
                    Base rate: ₹{hotelRate.toLocaleString()} / person/night →{" "}
                    <span className="font-bold">
                      ₹{hotelTotal.toLocaleString()} for {nights}N
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
                        <SelectTrigger
                          className="font-sans text-sm"
                          data-ocid="quote.food.select"
                        >
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
                        <SelectTrigger
                          className="font-sans text-sm"
                          data-ocid="quote.travel.select"
                        >
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
                            data-ocid="quote.activity.checkbox"
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
                      <SelectTrigger
                        className="font-sans text-sm max-w-xs"
                        data-ocid="quote.boating.select"
                      >
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
                  {/* Guest Breakdown */}
                  <div className="bg-sidebar/60 rounded-lg p-3 space-y-2">
                    <p className="text-xs font-sans font-semibold text-muted-foreground uppercase tracking-wide">
                      Guest Breakdown
                    </p>
                    {maleAdults > 0 && (
                      <div className="flex items-center justify-between text-xs font-sans">
                        <span className="text-muted-foreground">
                          ♂ Male Adults
                        </span>
                        <span className="text-foreground font-medium">
                          {maleAdults}
                        </span>
                      </div>
                    )}
                    {femaleAdults > 0 && (
                      <div className="flex items-center justify-between text-xs font-sans">
                        <span className="text-muted-foreground">
                          ♀ Female Adults
                        </span>
                        <span className="text-foreground font-medium">
                          {femaleAdults}
                        </span>
                      </div>
                    )}
                    {tgAdults > 0 && (
                      <div className="flex items-center justify-between text-xs font-sans">
                        <span className="text-muted-foreground">
                          ⚧ TG/Others
                        </span>
                        <span className="text-foreground font-medium">
                          {tgAdults}
                        </span>
                      </div>
                    )}
                    {kids > 0 && (
                      <div className="flex items-center justify-between text-xs font-sans">
                        <span className="text-muted-foreground">
                          👧 Kids (5–12)
                        </span>
                        <span className="text-teal font-medium">
                          {kids} × 60%
                        </span>
                      </div>
                    )}
                    {infants > 0 && (
                      <div className="flex items-center justify-between text-xs font-sans">
                        <span className="text-muted-foreground">
                          🍼 Infants
                        </span>
                        <span className="text-gold font-medium">
                          {infants} × ₹500
                        </span>
                      </div>
                    )}
                    <div className="border-t border-border/30 pt-1 flex items-center justify-between text-xs font-sans">
                      <span className="text-muted-foreground font-semibold">
                        Total Guests
                      </span>
                      <span className="text-foreground font-bold">
                        {totalGuests}
                      </span>
                    </div>
                    {selectedDestination && (
                      <div className="flex items-center gap-1.5 text-xs font-sans text-muted-foreground border-t border-border/30 pt-1">
                        <MapPin className="w-3 h-3" />
                        {selectedDestination.name}
                      </div>
                    )}
                    {travelDates && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-sans">
                        <Calendar className="w-3 h-3" />
                        {travelDates} · {nights}N
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
                    {destFeesTotal > 0 && (
                      <div className="flex justify-between text-sm font-sans">
                        <span className="text-muted-foreground">
                          🎫 Destination Fees
                        </span>
                        <span className="text-teal font-medium">
                          ₹{destFeesTotal.toLocaleString()}
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

                  {totalGuests > 1 && grandTotal > 0 && (
                    <p className="text-xs text-muted-foreground font-sans text-right">
                      ≈ ₹{Math.round(grandTotal / totalGuests).toLocaleString()}{" "}
                      per person
                    </p>
                  )}

                  {/* Rate formula note */}
                  <div className="bg-gold/5 border border-gold/20 rounded-lg px-3 py-2">
                    <p className="text-[10px] font-sans text-muted-foreground">
                      Adults × full rate · Kids (5–12) × 60% · Infants ₹500 flat
                      each
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
                      data-ocid="quote.whatsapp.button"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Send via WhatsApp
                      <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
                    </button>
                    <button
                      type="button"
                      onClick={handleEmail}
                      className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg font-sans text-sm font-medium transition-colors bg-gold/20 border border-gold/40 text-gold hover:bg-gold/30"
                      data-ocid="quote.email.button"
                    >
                      <Mail className="w-4 h-4" />
                      Send via Email
                      <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
                    </button>
                    <Button
                      variant="outline"
                      className="w-full font-sans text-sm border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
                      onClick={handleCopy}
                      data-ocid="quote.copy.button"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Quote Text
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full font-sans text-sm border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
                      onClick={() => window.print()}
                      data-ocid="quote.print.button"
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
