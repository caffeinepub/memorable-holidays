// Master Data Store — persisted in localStorage
// Powers all dropdowns across Package Editor, Quick Quote, etc.

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  popularMonths: string;
  highlights: string;
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

export interface MasterData {
  destinations: Destination[];
  hotels: Hotel[];
  activities: Activity[];
  vehicles: Vehicle[];
  airlines: Airline[];
  addons: Addon[];
}

const STORAGE_KEY = "mh_master_data";

const defaultMasterData: MasterData = {
  destinations: [
    {
      id: "d1",
      name: "Goa",
      country: "India",
      description:
        "Beach paradise with Portuguese heritage and vibrant nightlife",
      popularMonths: "October – March",
      highlights: "Beaches, Old Goa churches, water sports, seafood",
      createdAt: Date.now(),
    },
    {
      id: "d2",
      name: "Kerala",
      country: "India",
      description: "God's Own Country — backwaters, hill stations, and spices",
      popularMonths: "September – March",
      highlights: "Alleppey backwaters, Munnar tea gardens, Periyar wildlife",
      createdAt: Date.now(),
    },
    {
      id: "d3",
      name: "Rajasthan",
      country: "India",
      description: "Land of kings with magnificent forts and desert landscapes",
      popularMonths: "October – February",
      highlights: "Jaipur forts, Udaipur lakes, Jaisalmer desert safari",
      createdAt: Date.now(),
    },
    {
      id: "d4",
      name: "Maldives",
      country: "Maldives",
      description:
        "Tropical island paradise with crystal-clear turquoise waters",
      popularMonths: "November – April",
      highlights: "Overwater bungalows, snorkeling, diving, sunset cruises",
      createdAt: Date.now(),
    },
    {
      id: "d5",
      name: "Bali",
      country: "Indonesia",
      description:
        "Island of the Gods with temples, terraced rice fields and beaches",
      popularMonths: "April – October",
      highlights: "Ubud temples, Kuta beach, Mount Batur, rice terraces",
      createdAt: Date.now(),
    },
  ],
  hotels: [
    {
      id: "h1",
      name: "The Leela Palace Goa",
      city: "Goa",
      category: "5-star",
      perPersonPerNight: 8500,
      singleSupplement: 4000,
      childRate: 2500,
      contact: "+91-832-6711234",
      notes: "Pool-facing rooms recommended",
      createdAt: Date.now(),
    },
    {
      id: "h2",
      name: "Taj Exotica Maldives",
      city: "South Malé Atoll",
      category: "resort",
      perPersonPerNight: 28000,
      singleSupplement: 12000,
      childRate: 8000,
      contact: "+960-664-2200",
      notes: "All-inclusive plan available",
      createdAt: Date.now(),
    },
    {
      id: "h3",
      name: "Kumarakom Lake Resort",
      city: "Kerala",
      category: "5-star",
      perPersonPerNight: 12000,
      singleSupplement: 5500,
      childRate: 3500,
      contact: "+91-481-2524900",
      notes: "Heritage villas with backwater views",
      createdAt: Date.now(),
    },
    {
      id: "h4",
      name: "Rambagh Palace",
      city: "Jaipur",
      category: "5-star",
      perPersonPerNight: 15000,
      singleSupplement: 7000,
      childRate: 4500,
      contact: "+91-141-2211919",
      notes: "Former royal palace, butler service",
      createdAt: Date.now(),
    },
  ],
  activities: [
    {
      id: "a1",
      name: "Water Sports Package",
      destination: "Goa",
      durationHours: 3,
      adultRate: 2500,
      childRate: 1500,
      category: "water",
      description: "Jet ski, parasailing, banana boat, and more",
      createdAt: Date.now(),
    },
    {
      id: "a2",
      name: "Houseboat Cruise",
      destination: "Kerala",
      durationHours: 24,
      adultRate: 4500,
      childRate: 2000,
      category: "leisure",
      description: "Overnight cruise through Alleppey backwaters",
      createdAt: Date.now(),
    },
    {
      id: "a3",
      name: "Desert Safari",
      destination: "Rajasthan",
      durationHours: 5,
      adultRate: 3500,
      childRate: 2000,
      category: "adventure",
      description: "Camel safari with cultural show and dinner",
      createdAt: Date.now(),
    },
    {
      id: "a4",
      name: "Snorkeling & Diving",
      destination: "Maldives",
      durationHours: 4,
      adultRate: 5000,
      childRate: 3000,
      category: "water",
      description: "Coral reef snorkeling and beginners PADI dive",
      createdAt: Date.now(),
    },
  ],
  vehicles: [
    {
      id: "v1",
      type: "sedan",
      seatingCapacity: 4,
      perDayRate: 2500,
      perKmRate: 14,
      driverIncluded: true,
      ac: true,
      notes: "Swift Dzire / similar",
      createdAt: Date.now(),
    },
    {
      id: "v2",
      type: "suv",
      seatingCapacity: 7,
      perDayRate: 4000,
      perKmRate: 18,
      driverIncluded: true,
      ac: true,
      notes: "Innova Crysta / similar",
      createdAt: Date.now(),
    },
    {
      id: "v3",
      type: "minivan",
      seatingCapacity: 12,
      perDayRate: 6500,
      perKmRate: 22,
      driverIncluded: true,
      ac: true,
      notes: "Tempo Traveller",
      createdAt: Date.now(),
    },
    {
      id: "v4",
      type: "bus",
      seatingCapacity: 40,
      perDayRate: 15000,
      perKmRate: 35,
      driverIncluded: true,
      ac: true,
      notes: "Volvo coach for large groups",
      createdAt: Date.now(),
    },
  ],
  airlines: [
    {
      id: "al1",
      name: "IndiGo",
      route: "Delhi – Goa",
      economyFare: 4500,
      businessFare: 0,
      luggageAllowance: "15 kg check-in + 7 kg cabin",
      notes: "Direct flight, ~2h",
      createdAt: Date.now(),
    },
    {
      id: "al2",
      name: "Air India",
      route: "Mumbai – Male (Maldives)",
      economyFare: 18000,
      businessFare: 55000,
      luggageAllowance: "25 kg check-in + 8 kg cabin",
      notes: "Code-share with Maldivian",
      createdAt: Date.now(),
    },
    {
      id: "al3",
      name: "SpiceJet",
      route: "Mumbai – Kochi",
      economyFare: 3800,
      businessFare: 0,
      luggageAllowance: "15 kg check-in + 7 kg cabin",
      notes: "Morning and evening departures",
      createdAt: Date.now(),
    },
  ],
  addons: [
    {
      id: "ad1",
      name: "Travel Insurance",
      unit: "per person",
      rate: 800,
      category: "insurance",
      description: "Comprehensive travel and medical insurance",
      createdAt: Date.now(),
    },
    {
      id: "ad2",
      name: "Visa Assistance (Bali)",
      unit: "per person",
      rate: 2500,
      category: "visa",
      description: "E-visa application and document support",
      createdAt: Date.now(),
    },
    {
      id: "ad3",
      name: "Professional Photography",
      unit: "per trip",
      rate: 8000,
      category: "photography",
      description: "Half-day photo session with edited album",
      createdAt: Date.now(),
    },
    {
      id: "ad4",
      name: "Spa Package",
      unit: "per person",
      rate: 3500,
      category: "spa",
      description: "90-min aromatherapy and full-body massage",
      createdAt: Date.now(),
    },
    {
      id: "ad5",
      name: "Honeymoon Setup",
      unit: "per trip",
      rate: 4500,
      category: "meal-upgrade",
      description: "Room decoration, candle-light dinner, cake",
      createdAt: Date.now(),
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

  generateId,
};
