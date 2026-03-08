// Master Data Store — persisted in localStorage
// Powers all dropdowns across Package Editor, Quick Quote, etc.

import {
  ANDAMAN_ACTIVITIES,
  ANDAMAN_CAB_TYPES,
  ANDAMAN_DESTINATIONS,
  ANDAMAN_HOTELS,
} from "./andamanData";

export interface FoodMenuItem {
  id: string;
  name: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack" | "complimentary";
  ratePerPerson: number;
  isComplimentary: boolean;
  notes: string;
  createdAt: number;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  popularMonths: string;
  highlights: string;
  islandGroup?: string;
  specialtyNotes?: string;
  createdAt: number;
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  category: "3-star" | "4-star" | "5-star" | "resort" | "budget";
  perPersonPerNight: number;
  singleSupplement: number;
  childRate: number;
  contact: string;
  notes: string;
  createdAt: number;
}

export interface Activity {
  id: string;
  name: string;
  destination: string;
  durationHours: number;
  adultRate: number;
  childRate: number;
  category: "adventure" | "cultural" | "leisure" | "water" | "wildlife";
  description: string;
  createdAt: number;
}

export interface Vehicle {
  id: string;
  type: "sedan" | "suv" | "minivan" | "bus" | "boat";
  seatingCapacity: number;
  perDayRate: number;
  perKmRate: number;
  driverIncluded: boolean;
  ac: boolean;
  notes: string;
  createdAt: number;
}

export interface Airline {
  id: string;
  name: string;
  route: string;
  economyFare: number;
  businessFare: number;
  luggageAllowance: string;
  notes: string;
  createdAt: number;
}

export interface Addon {
  id: string;
  name: string;
  unit: "per person" | "per night" | "per trip";
  rate: number;
  category:
    | "insurance"
    | "visa"
    | "photography"
    | "spa"
    | "meal-upgrade"
    | "other";
  description: string;
  createdAt: number;
}

export interface CabRate {
  id: string;
  name: string;
  vehicleType:
    | "sedan"
    | "suv"
    | "tempo"
    | "bus"
    | "jeep"
    | "ferry"
    | "helicopter"
    | "auto"
    | "bike";
  seatingCapacity: number;
  perDayRate: number;
  perKmRate: number;
  isFlatRate: boolean;
  notes: string;
  createdAt: number;
}

export interface MasterData {
  destinations: Destination[];
  hotels: Hotel[];
  activities: Activity[];
  vehicles: Vehicle[];
  airlines: Airline[];
  addons: Addon[];
  cabRates: CabRate[];
  foodMenuItems: FoodMenuItem[];
}

const STORAGE_KEY = "mh_master_data";

const TS = 1700000000000; // fixed timestamp for default data (not Date.now() to avoid rerenders)

const SPECIALTY_NOTES_MAP: Record<string, string> = {
  "Radhanagar Beach":
    "Asia's best beach — arrive early morning for pristine water. No plastic allowed. Entry free, sunrise views spectacular.",
  "Cellular Jail":
    "UNESCO Heritage site. Sound & Light show every evening at 6PM. Book light show tickets in advance.",
  "Elephant Beach":
    "Accessible by boat or trek. Best snorkeling spot in Havelock. Glass-bottom boat rides available on site.",
  "Barren Island Volcano":
    "Only active volcano in South Asia. Chartered boats from Port Blair — day trip only, no stay permitted.",
  "Ross & Smith Islands":
    "Twin islands connected by a natural sandbar. Entry via permit only. Limited daily visitors — book early.",
  "Jolly Buoy Island":
    "Coral reserve — plastic free zone. Closed alternate months for ecological recovery. Boat timings 9AM–4PM.",
  "North Bay Island":
    "Sea Walk activity base. Coral gardens visible from glass-bottom boats. SCUBA certification not required for Sea Walk.",
};

const defaultMasterData: MasterData = {
  destinations: ANDAMAN_DESTINATIONS.map((d) => ({
    id: d.id,
    name: d.name,
    country: "India",
    description: d.description,
    popularMonths: d.popularMonths,
    highlights: d.highlights,
    islandGroup: d.islandGroup,
    specialtyNotes: SPECIALTY_NOTES_MAP[d.name] || "",
    createdAt: TS,
  })),

  hotels: ANDAMAN_HOTELS.map((h) => ({
    id: h.id,
    name: h.name,
    city: h.city,
    category: h.category,
    perPersonPerNight: h.perPersonPerNight,
    singleSupplement: 0,
    childRate: h.childRate,
    contact: "",
    notes: "",
    createdAt: TS,
  })),

  activities: ANDAMAN_ACTIVITIES.map((a) => ({
    id: a.id,
    name: a.name,
    destination: a.destination,
    durationHours: 3,
    adultRate: a.adultRate,
    childRate: a.childRate,
    category: a.category,
    description: "",
    createdAt: TS,
  })),

  vehicles: [
    {
      id: "v1",
      type: "sedan",
      seatingCapacity: 4,
      perDayRate: 2800,
      perKmRate: 15,
      driverIncluded: true,
      ac: true,
      notes: "AC Sedan — Swift Dzire / similar",
      createdAt: TS,
    },
    {
      id: "v2",
      type: "suv",
      seatingCapacity: 7,
      perDayRate: 4200,
      perKmRate: 20,
      driverIncluded: true,
      ac: true,
      notes: "AC SUV — Innova Crysta / similar",
      createdAt: TS,
    },
    {
      id: "v3",
      type: "minivan",
      seatingCapacity: 12,
      perDayRate: 7000,
      perKmRate: 25,
      driverIncluded: true,
      ac: true,
      notes: "Tempo Traveller — 12 seater",
      createdAt: TS,
    },
    {
      id: "v4",
      type: "bus",
      seatingCapacity: 20,
      perDayRate: 12000,
      perKmRate: 30,
      driverIncluded: true,
      ac: true,
      notes: "Mini Bus — 20 seater for groups",
      createdAt: TS,
    },
    {
      id: "v5",
      type: "boat",
      seatingCapacity: 20,
      perDayRate: 8000,
      perKmRate: 0,
      driverIncluded: true,
      ac: false,
      notes: "Ferry Charter — Port Blair to Islands",
      createdAt: TS,
    },
  ],

  airlines: [
    {
      id: "al1",
      name: "IndiGo",
      route: "Chennai / Kolkata – Port Blair",
      economyFare: 6500,
      businessFare: 0,
      luggageAllowance: "15 kg check-in + 7 kg cabin",
      notes: "Most frequent flights to Andaman",
      createdAt: TS,
    },
    {
      id: "al2",
      name: "Air India",
      route: "Delhi / Mumbai – Port Blair",
      economyFare: 9500,
      businessFare: 22000,
      luggageAllowance: "25 kg check-in + 8 kg cabin",
      notes: "Direct and connecting flights available",
      createdAt: TS,
    },
    {
      id: "al3",
      name: "SpiceJet",
      route: "Kolkata / Chennai – Port Blair",
      economyFare: 5800,
      businessFare: 0,
      luggageAllowance: "15 kg check-in + 7 kg cabin",
      notes: "Budget carrier — early booking recommended",
      createdAt: TS,
    },
    {
      id: "al4",
      name: "GoFirst / Vistara",
      route: "Mumbai / Delhi – Port Blair",
      economyFare: 8000,
      businessFare: 18000,
      luggageAllowance: "15 kg check-in + 7 kg cabin",
      notes: "Premium economy available on select routes",
      createdAt: TS,
    },
  ],

  addons: [
    {
      id: "ad1",
      name: "Travel Insurance (Andaman)",
      unit: "per person",
      rate: 800,
      category: "insurance",
      description:
        "Comprehensive travel and medical insurance for island trips",
      createdAt: TS,
    },
    {
      id: "ad2",
      name: "Professional Photography Package",
      unit: "per trip",
      rate: 8000,
      category: "photography",
      description: "Half-day photo session with edited digital album",
      createdAt: TS,
    },
    {
      id: "ad3",
      name: "Underwater Photography (Scuba)",
      unit: "per person",
      rate: 2500,
      category: "photography",
      description:
        "Professional underwater photos during scuba/snorkel session",
      createdAt: TS,
    },
    {
      id: "ad4",
      name: "Spa & Wellness Package",
      unit: "per person",
      rate: 3500,
      category: "spa",
      description: "90-min aromatherapy and full-body massage at resort spa",
      createdAt: TS,
    },
    {
      id: "ad5",
      name: "Honeymoon Decoration & Dinner",
      unit: "per trip",
      rate: 5000,
      category: "meal-upgrade",
      description: "Room decoration, candle-light beach dinner, cake, flowers",
      createdAt: TS,
    },
    {
      id: "ad6",
      name: "RAP Permit Assistance (Restricted Area)",
      unit: "per person",
      rate: 1500,
      category: "visa",
      description: "Restricted Area Permit processing for Nicobar Islands",
      createdAt: TS,
    },
  ],

  cabRates: ANDAMAN_CAB_TYPES.map((c) => ({
    id: c.id,
    name: c.name,
    vehicleType: c.vehicleType,
    seatingCapacity: c.seatingCapacity,
    perDayRate: c.perDayRate,
    perKmRate: c.perKmRate,
    isFlatRate: c.isFlatRate,
    notes: c.notes,
    createdAt: TS,
  })),

  foodMenuItems: [
    {
      id: "fm1",
      name: "Complimentary Welcome Breakfast",
      mealType: "complimentary",
      ratePerPerson: 0,
      isComplimentary: true,
      notes: "Served on arrival day — includes fruit, juice, and light snacks",
      createdAt: TS,
    },
    {
      id: "fm2",
      name: "Standard Breakfast Buffet",
      mealType: "breakfast",
      ratePerPerson: 350,
      isComplimentary: false,
      notes: "Eggs, bread, cereals, fruit, tea/coffee",
      createdAt: TS,
    },
    {
      id: "fm3",
      name: "Continental Breakfast",
      mealType: "breakfast",
      ratePerPerson: 500,
      isComplimentary: false,
      notes: "Full continental with fresh juices and pastries",
      createdAt: TS,
    },
    {
      id: "fm4",
      name: "Complimentary Breakfast (Premium)",
      mealType: "complimentary",
      ratePerPerson: 0,
      isComplimentary: true,
      notes: "Included in resort packages — full buffet breakfast",
      createdAt: TS,
    },
    {
      id: "fm5",
      name: "Seafood Lunch",
      mealType: "lunch",
      ratePerPerson: 800,
      isComplimentary: false,
      notes: "Fresh Andaman seafood — grilled fish, prawn curry, crab",
      createdAt: TS,
    },
    {
      id: "fm6",
      name: "Standard Lunch Buffet",
      mealType: "lunch",
      ratePerPerson: 500,
      isComplimentary: false,
      notes: "North Indian, South Indian, and local dishes",
      createdAt: TS,
    },
    {
      id: "fm7",
      name: "Beach BBQ Dinner",
      mealType: "dinner",
      ratePerPerson: 1200,
      isComplimentary: false,
      notes: "Beachside BBQ with live cooking — seafood and vegetarian options",
      createdAt: TS,
    },
    {
      id: "fm8",
      name: "Candle-light Honeymoon Dinner",
      mealType: "dinner",
      ratePerPerson: 2000,
      isComplimentary: false,
      notes: "Private beach table, 3-course meal, mocktails included",
      createdAt: TS,
    },
    {
      id: "fm9",
      name: "Standard Dinner Buffet",
      mealType: "dinner",
      ratePerPerson: 650,
      isComplimentary: false,
      notes: "Multi-cuisine dinner buffet at hotel restaurant",
      createdAt: TS,
    },
    {
      id: "fm10",
      name: "Complimentary Welcome Dinner",
      mealType: "complimentary",
      ratePerPerson: 0,
      isComplimentary: true,
      notes: "Courtesy dinner on first night — included in deluxe packages",
      createdAt: TS,
    },
    {
      id: "fm11",
      name: "Packed Lunch Box (Day Trips)",
      mealType: "lunch",
      ratePerPerson: 300,
      isComplimentary: false,
      notes: "Convenient packed lunch for beach/island day trips",
      createdAt: TS,
    },
    {
      id: "fm12",
      name: "High Tea & Snacks",
      mealType: "snack",
      ratePerPerson: 250,
      isComplimentary: false,
      notes: "Afternoon snack platter — sandwiches, samosa, tea/coffee",
      createdAt: TS,
    },
    {
      id: "fm13",
      name: "Fresh Coconut & Tropical Snacks",
      mealType: "snack",
      ratePerPerson: 150,
      isComplimentary: false,
      notes: "Local Andaman fruits, tender coconut water, roasted snacks",
      createdAt: TS,
    },
    {
      id: "fm14",
      name: "Full Board (Breakfast + Lunch + Dinner)",
      mealType: "complimentary",
      ratePerPerson: 1500,
      isComplimentary: false,
      notes: "All-inclusive meal plan for entire stay duration",
      createdAt: TS,
    },
    {
      id: "fm15",
      name: "Half Board (Breakfast + Dinner)",
      mealType: "breakfast",
      ratePerPerson: 950,
      isComplimentary: false,
      notes: "Morning and evening meals included in stay",
      createdAt: TS,
    },
  ],
};

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const masterDataStore = {
  get: (): MasterData => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as MasterData;
        return {
          destinations: parsed.destinations || defaultMasterData.destinations,
          hotels: parsed.hotels || defaultMasterData.hotels,
          activities: parsed.activities || defaultMasterData.activities,
          vehicles: parsed.vehicles || defaultMasterData.vehicles,
          airlines: parsed.airlines || defaultMasterData.airlines,
          addons: parsed.addons || defaultMasterData.addons,
          cabRates: parsed.cabRates || defaultMasterData.cabRates,
          foodMenuItems:
            parsed.foodMenuItems || defaultMasterData.foodMenuItems,
        };
      }
    } catch {}
    return { ...defaultMasterData };
  },

  save: (data: MasterData): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  },

  // Destinations
  addDestination: (
    item: Omit<Destination, "id" | "createdAt">,
  ): Destination => {
    const data = masterDataStore.get();
    const newItem: Destination = {
      ...item,
      id: generateId(),
      createdAt: Date.now(),
    };
    data.destinations.push(newItem);
    masterDataStore.save(data);
    return newItem;
  },
  updateDestination: (id: string, updates: Partial<Destination>): void => {
    const data = masterDataStore.get();
    data.destinations = data.destinations.map((d) =>
      d.id === id ? { ...d, ...updates } : d,
    );
    masterDataStore.save(data);
  },
  deleteDestination: (id: string): void => {
    const data = masterDataStore.get();
    data.destinations = data.destinations.filter((d) => d.id !== id);
    masterDataStore.save(data);
  },

  // Hotels
  addHotel: (item: Omit<Hotel, "id" | "createdAt">): Hotel => {
    const data = masterDataStore.get();
    const newItem: Hotel = { ...item, id: generateId(), createdAt: Date.now() };
    data.hotels.push(newItem);
    masterDataStore.save(data);
    return newItem;
  },
  updateHotel: (id: string, updates: Partial<Hotel>): void => {
    const data = masterDataStore.get();
    data.hotels = data.hotels.map((h) =>
      h.id === id ? { ...h, ...updates } : h,
    );
    masterDataStore.save(data);
  },
  deleteHotel: (id: string): void => {
    const data = masterDataStore.get();
    data.hotels = data.hotels.filter((h) => h.id !== id);
    masterDataStore.save(data);
  },

  // Activities
  addActivity: (item: Omit<Activity, "id" | "createdAt">): Activity => {
    const data = masterDataStore.get();
    const newItem: Activity = {
      ...item,
      id: generateId(),
      createdAt: Date.now(),
    };
    data.activities.push(newItem);
    masterDataStore.save(data);
    return newItem;
  },
  updateActivity: (id: string, updates: Partial<Activity>): void => {
    const data = masterDataStore.get();
    data.activities = data.activities.map((a) =>
      a.id === id ? { ...a, ...updates } : a,
    );
    masterDataStore.save(data);
  },
  deleteActivity: (id: string): void => {
    const data = masterDataStore.get();
    data.activities = data.activities.filter((a) => a.id !== id);
    masterDataStore.save(data);
  },

  // Vehicles
  addVehicle: (item: Omit<Vehicle, "id" | "createdAt">): Vehicle => {
    const data = masterDataStore.get();
    const newItem: Vehicle = {
      ...item,
      id: generateId(),
      createdAt: Date.now(),
    };
    data.vehicles.push(newItem);
    masterDataStore.save(data);
    return newItem;
  },
  updateVehicle: (id: string, updates: Partial<Vehicle>): void => {
    const data = masterDataStore.get();
    data.vehicles = data.vehicles.map((v) =>
      v.id === id ? { ...v, ...updates } : v,
    );
    masterDataStore.save(data);
  },
  deleteVehicle: (id: string): void => {
    const data = masterDataStore.get();
    data.vehicles = data.vehicles.filter((v) => v.id !== id);
    masterDataStore.save(data);
  },

  // Airlines
  addAirline: (item: Omit<Airline, "id" | "createdAt">): Airline => {
    const data = masterDataStore.get();
    const newItem: Airline = {
      ...item,
      id: generateId(),
      createdAt: Date.now(),
    };
    data.airlines.push(newItem);
    masterDataStore.save(data);
    return newItem;
  },
  updateAirline: (id: string, updates: Partial<Airline>): void => {
    const data = masterDataStore.get();
    data.airlines = data.airlines.map((a) =>
      a.id === id ? { ...a, ...updates } : a,
    );
    masterDataStore.save(data);
  },
  deleteAirline: (id: string): void => {
    const data = masterDataStore.get();
    data.airlines = data.airlines.filter((a) => a.id !== id);
    masterDataStore.save(data);
  },

  // Add-ons
  addAddon: (item: Omit<Addon, "id" | "createdAt">): Addon => {
    const data = masterDataStore.get();
    const newItem: Addon = { ...item, id: generateId(), createdAt: Date.now() };
    data.addons.push(newItem);
    masterDataStore.save(data);
    return newItem;
  },
  updateAddon: (id: string, updates: Partial<Addon>): void => {
    const data = masterDataStore.get();
    data.addons = data.addons.map((a) =>
      a.id === id ? { ...a, ...updates } : a,
    );
    masterDataStore.save(data);
  },
  deleteAddon: (id: string): void => {
    const data = masterDataStore.get();
    data.addons = data.addons.filter((a) => a.id !== id);
    masterDataStore.save(data);
  },

  // Cab Rates
  addCabRate: (item: Omit<CabRate, "id" | "createdAt">): CabRate => {
    const data = masterDataStore.get();
    const newItem: CabRate = {
      ...item,
      id: generateId(),
      createdAt: Date.now(),
    };
    data.cabRates.push(newItem);
    masterDataStore.save(data);
    return newItem;
  },
  updateCabRate: (id: string, updates: Partial<CabRate>): void => {
    const data = masterDataStore.get();
    data.cabRates = data.cabRates.map((c) =>
      c.id === id ? { ...c, ...updates } : c,
    );
    masterDataStore.save(data);
  },
  deleteCabRate: (id: string): void => {
    const data = masterDataStore.get();
    data.cabRates = data.cabRates.filter((c) => c.id !== id);
    masterDataStore.save(data);
  },

  // Food Menu Items
  addFoodMenuItem: (
    item: Omit<FoodMenuItem, "id" | "createdAt">,
  ): FoodMenuItem => {
    const data = masterDataStore.get();
    const newItem: FoodMenuItem = {
      ...item,
      id: generateId(),
      createdAt: Date.now(),
    };
    data.foodMenuItems.push(newItem);
    masterDataStore.save(data);
    return newItem;
  },
  updateFoodMenuItem: (id: string, updates: Partial<FoodMenuItem>): void => {
    const data = masterDataStore.get();
    data.foodMenuItems = data.foodMenuItems.map((f) =>
      f.id === id ? { ...f, ...updates } : f,
    );
    masterDataStore.save(data);
  },
  deleteFoodMenuItem: (id: string): void => {
    const data = masterDataStore.get();
    data.foodMenuItems = data.foodMenuItems.filter((f) => f.id !== id);
    masterDataStore.save(data);
  },

  generateId,
};
