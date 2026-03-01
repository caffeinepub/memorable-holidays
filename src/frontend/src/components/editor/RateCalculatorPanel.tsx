import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import {
  useGetAllActivityRates,
  useGetAllAddOnRates,
  useGetAllBoatingRates,
  useGetAllFoodRates,
  useGetAllTravelRates,
  useGetHotelRates,
} from "../../hooks/useQueries";
import type { PackageEditorState } from "../../lib/packageStore";

interface Props {
  state: PackageEditorState;
  onChange: (updates: Partial<PackageEditorState>) => void;
}

const EMPTY_MSG = "No options available. Please configure rates in Settings.";

// Get unique hotels from hotel rates
function buildHotelMap(
  hotelRates: { hotelName: string; roomType: string; rate: bigint }[],
) {
  const map = new Map<
    string,
    { hotelName: string; roomType: string; rate: bigint }[]
  >();
  for (const r of hotelRates) {
    if (!map.has(r.hotelName)) map.set(r.hotelName, []);
    map.get(r.hotelName)!.push(r);
  }
  return map;
}

export default function RateCalculatorPanel({ state, onChange }: Props) {
  const { data: hotelRates = [], isLoading: loadingHotels } =
    useGetHotelRates();
  const { data: foodRates = [], isLoading: loadingFood } = useGetAllFoodRates();
  const { data: travelRates = [], isLoading: loadingTravel } =
    useGetAllTravelRates();
  const { data: activityRates = [], isLoading: loadingActivities } =
    useGetAllActivityRates();
  const { data: boatingRates = [], isLoading: loadingBoating } =
    useGetAllBoatingRates();
  const { data: addOnRates = [], isLoading: loadingAddOns } =
    useGetAllAddOnRates();

  const hotelMap = buildHotelMap(hotelRates);
  const hotelNames = Array.from(hotelMap.keys());
  const roomTypes = state.hotel ? hotelMap.get(state.hotel) || [] : [];

  const handleHotelChange = (hotelName: string) => {
    const rooms = hotelMap.get(hotelName) || [];
    const firstRoom = rooms[0];
    onChange({
      hotel: hotelName,
      roomType: firstRoom?.roomType || "",
    });
  };

  const handleRoomChange = (roomType: string) => {
    onChange({ roomType });
  };

  const handleFoodChange = (name: string) => {
    const item = foodRates.find((f) => f.name === name);
    onChange({ foodPackage: name, foodRate: item ? Number(item.price) : 0 });
  };

  const handleTravelChange = (name: string) => {
    const item = travelRates.find((t) => t.name === name);
    onChange({ travelOption: name, travelRate: item ? Number(item.price) : 0 });
  };

  const handleBoatingChange = (name: string) => {
    if (name === "none") {
      onChange({ boating: "none", boatingRate: 0 });
      return;
    }
    const item = boatingRates.find((b) => b.name === name);
    onChange({ boating: name, boatingRate: item ? Number(item.price) : 0 });
  };

  const handleActivityToggle = (
    actName: string,
    actRate: number,
    checked: boolean,
  ) => {
    const newActivities = checked
      ? [...state.activities, actName]
      : state.activities.filter((a) => a !== actName);
    const newRates = checked
      ? [...state.activityRates, actRate]
      : state.activityRates.filter((_, i) => state.activities[i] !== actName);
    onChange({ activities: newActivities, activityRates: newRates });
  };

  const handleAddOnToggle = (
    addOnName: string,
    addOnRate: number,
    checked: boolean,
  ) => {
    const newAddOns = checked
      ? [...state.addOns, addOnName]
      : state.addOns.filter((a) => a !== addOnName);
    const newRates = checked
      ? [...state.addOnRates, addOnRate]
      : state.addOnRates.filter((_, i) => state.addOns[i] !== addOnName);
    onChange({ addOns: newAddOns, addOnRates: newRates });
  };

  // Cost calculation
  const hotelRate = state.hotel
    ? Number(roomTypes.find((r) => r.roomType === state.roomType)?.rate || 0)
    : 0;
  const baseRate =
    hotelRate +
    state.foodRate +
    state.travelRate +
    state.boatingRate +
    state.activityRates.reduce((a, b) => a + b, 0) +
    state.addOnRates.reduce((a, b) => a + b, 0);
  const adultTotal = baseRate * state.adults;
  const childTotal = Math.floor((baseRate * state.children) / 2);
  const grandTotal = adultTotal + childTotal;

  // Sync grand total to store whenever it changes
  if (grandTotal !== state.totalCost) {
    onChange({ totalCost: grandTotal });
  }

  const isAnyLoading =
    loadingHotels ||
    loadingFood ||
    loadingTravel ||
    loadingActivities ||
    loadingBoating ||
    loadingAddOns;

  return (
    <Card className="premium-card">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-lg text-foreground flex items-center gap-2">
          Rate Calculator
          {isAnyLoading && (
            <Loader2 className="w-4 h-4 animate-spin text-teal" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hotel */}
        <div className="space-y-2">
          <Label className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Hotel
          </Label>
          {loadingHotels ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-sans">
              <Loader2 className="w-3 h-3 animate-spin" /> Loading hotels…
            </div>
          ) : hotelNames.length === 0 ? (
            <p className="text-xs text-muted-foreground font-sans italic">
              {EMPTY_MSG}
            </p>
          ) : (
            <>
              <Select value={state.hotel} onValueChange={handleHotelChange}>
                <SelectTrigger className="font-sans text-sm">
                  <SelectValue placeholder="Select hotel" />
                </SelectTrigger>
                <SelectContent>
                  {hotelNames.map((h) => (
                    <SelectItem key={h} value={h} className="font-sans text-sm">
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state.hotel && roomTypes.length > 0 && (
                <Select value={state.roomType} onValueChange={handleRoomChange}>
                  <SelectTrigger className="font-sans text-sm">
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map((r) => (
                      <SelectItem
                        key={r.roomType}
                        value={r.roomType}
                        className="font-sans text-sm"
                      >
                        {r.roomType} — ₹{Number(r.rate).toLocaleString()}/night
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </>
          )}
        </div>

        {/* Food */}
        <div className="space-y-2">
          <Label className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Food Package
          </Label>
          {loadingFood ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-sans">
              <Loader2 className="w-3 h-3 animate-spin" /> Loading…
            </div>
          ) : foodRates.length === 0 ? (
            <p className="text-xs text-muted-foreground font-sans italic">
              {EMPTY_MSG}
            </p>
          ) : (
            <Select value={state.foodPackage} onValueChange={handleFoodChange}>
              <SelectTrigger className="font-sans text-sm">
                <SelectValue placeholder="Select food package" />
              </SelectTrigger>
              <SelectContent>
                {foodRates.map((f) => (
                  <SelectItem
                    key={f.name}
                    value={f.name}
                    className="font-sans text-sm"
                  >
                    {f.name} — ₹{Number(f.price).toLocaleString()}/person
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Travel */}
        <div className="space-y-2">
          <Label className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Travel Option
          </Label>
          {loadingTravel ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-sans">
              <Loader2 className="w-3 h-3 animate-spin" /> Loading…
            </div>
          ) : travelRates.length === 0 ? (
            <p className="text-xs text-muted-foreground font-sans italic">
              {EMPTY_MSG}
            </p>
          ) : (
            <Select
              value={state.travelOption}
              onValueChange={handleTravelChange}
            >
              <SelectTrigger className="font-sans text-sm">
                <SelectValue placeholder="Select travel option" />
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

        {/* Boating */}
        <div className="space-y-2">
          <Label className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Boating Package
          </Label>
          {loadingBoating ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-sans">
              <Loader2 className="w-3 h-3 animate-spin" /> Loading…
            </div>
          ) : boatingRates.length === 0 ? (
            <p className="text-xs text-muted-foreground font-sans italic">
              {EMPTY_MSG}
            </p>
          ) : (
            <Select value={state.boating} onValueChange={handleBoatingChange}>
              <SelectTrigger className="font-sans text-sm">
                <SelectValue placeholder="Select boating option" />
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
          )}
        </div>

        {/* Activities */}
        <div className="space-y-2">
          <Label className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Activities
          </Label>
          {loadingActivities ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-sans">
              <Loader2 className="w-3 h-3 animate-spin" /> Loading…
            </div>
          ) : activityRates.length === 0 ? (
            <p className="text-xs text-muted-foreground font-sans italic">
              {EMPTY_MSG}
            </p>
          ) : (
            <div className="space-y-2">
              {activityRates.map((act) => (
                <div
                  key={act.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`act-${act.name}`}
                      checked={state.activities.includes(act.name)}
                      onCheckedChange={(checked) =>
                        handleActivityToggle(
                          act.name,
                          Number(act.price),
                          !!checked,
                        )
                      }
                    />
                    <label
                      htmlFor={`act-${act.name}`}
                      className="text-sm font-sans cursor-pointer"
                    >
                      {act.name}
                    </label>
                  </div>
                  <span className="text-xs text-muted-foreground font-sans">
                    ₹{Number(act.price).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add-ons */}
        <div className="space-y-2">
          <Label className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Add-ons
          </Label>
          {loadingAddOns ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-sans">
              <Loader2 className="w-3 h-3 animate-spin" /> Loading…
            </div>
          ) : addOnRates.length === 0 ? (
            <p className="text-xs text-muted-foreground font-sans italic">
              {EMPTY_MSG}
            </p>
          ) : (
            <div className="space-y-2">
              {addOnRates.map((addon) => (
                <div
                  key={addon.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`addon-${addon.name}`}
                      checked={state.addOns.includes(addon.name)}
                      onCheckedChange={(checked) =>
                        handleAddOnToggle(
                          addon.name,
                          Number(addon.price),
                          !!checked,
                        )
                      }
                    />
                    <label
                      htmlFor={`addon-${addon.name}`}
                      className="text-sm font-sans cursor-pointer"
                    >
                      {addon.name}
                    </label>
                  </div>
                  <span className="text-xs text-muted-foreground font-sans">
                    ₹{Number(addon.price).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Cost Breakdown */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <p className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Cost Breakdown
          </p>
          {state.hotel && hotelRate > 0 && (
            <div className="flex justify-between text-sm font-sans">
              <span className="text-muted-foreground">
                Hotel ({state.roomType})
              </span>
              <span>₹{hotelRate.toLocaleString()}</span>
            </div>
          )}
          {state.foodPackage && state.foodRate > 0 && (
            <div className="flex justify-between text-sm font-sans">
              <span className="text-muted-foreground">Food</span>
              <span>₹{state.foodRate.toLocaleString()}</span>
            </div>
          )}
          {state.travelOption && state.travelRate > 0 && (
            <div className="flex justify-between text-sm font-sans">
              <span className="text-muted-foreground">Travel</span>
              <span>₹{state.travelRate.toLocaleString()}</span>
            </div>
          )}
          {state.boating &&
            state.boating !== "none" &&
            state.boatingRate > 0 && (
              <div className="flex justify-between text-sm font-sans">
                <span className="text-muted-foreground">Boating</span>
                <span>₹{state.boatingRate.toLocaleString()}</span>
              </div>
            )}
          {state.activities.map((act, i) => (
            <div key={act} className="flex justify-between text-sm font-sans">
              <span className="text-muted-foreground">{act}</span>
              <span>₹{(state.activityRates[i] || 0).toLocaleString()}</span>
            </div>
          ))}
          {state.addOns.map((addon, i) => (
            <div key={addon} className="flex justify-between text-sm font-sans">
              <span className="text-muted-foreground">{addon}</span>
              <span>₹{(state.addOnRates[i] || 0).toLocaleString()}</span>
            </div>
          ))}
          <Separator className="my-2" />
          <div className="flex justify-between text-sm font-sans">
            <span className="text-muted-foreground">
              {state.adults} Adults × ₹{baseRate.toLocaleString()}
            </span>
            <span>₹{adultTotal.toLocaleString()}</span>
          </div>
          {state.children > 0 && (
            <div className="flex justify-between text-sm font-sans">
              <span className="text-muted-foreground">
                {state.children} Children (50% off)
              </span>
              <span>₹{childTotal.toLocaleString()}</span>
            </div>
          )}
          <Separator className="my-2" />
          <div className="flex justify-between font-semibold font-sans text-base">
            <span className="text-foreground">Grand Total</span>
            <span className="text-gold font-display font-bold">
              ₹{grandTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
