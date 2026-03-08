// Local state store for the package being created/edited
// This is used to pass data between pages without URL params

export interface PackageEditorState {
  category: string;
  templateId: number;
  templateDesign: string;
  templateColorScheme: string;
  guestName: string;
  contactNumber: string;
  email: string;
  whatsapp: string;
  adults: number;
  children: number;
  maleAdults: number;
  femaleAdults: number;
  tgOthers: number;
  kids: number;
  travelDates: string;
  notes: string;
  hotel: string;
  roomType: string;
  foodPackage: string;
  foodRate: number;
  selectedFoodItems: string[];
  travelOption: string;
  travelRate: number;
  activities: string[];
  activityRates: number[];
  boating: string;
  boatingRate: number;
  addOns: string[];
  addOnRates: number[];
  totalCost: number;
  images: string[];
  photos: string[];
  contentBlocks: ContentBlock[];
  packageId?: number;
}

export interface ContentBlock {
  id: string;
  type:
    | "text"
    | "image"
    | "hotel"
    | "events"
    | "rates"
    | "offers"
    | "highlights"
    | "boating";
  title: string;
  content: string;
  imageUrl?: string;
}

const defaultState: PackageEditorState = {
  category: "",
  templateId: 0,
  templateDesign: "classic",
  templateColorScheme: "gold-teal",
  guestName: "",
  contactNumber: "",
  email: "",
  whatsapp: "",
  adults: 2,
  children: 0,
  maleAdults: 0,
  femaleAdults: 0,
  tgOthers: 0,
  kids: 0,
  travelDates: "",
  notes: "",
  hotel: "",
  roomType: "",
  foodPackage: "",
  foodRate: 0,
  selectedFoodItems: [],
  travelOption: "",
  travelRate: 0,
  activities: [],
  activityRates: [],
  boating: "",
  boatingRate: 0,
  addOns: [],
  addOnRates: [],
  totalCost: 0,
  images: [],
  photos: [],
  contentBlocks: [],
};

let currentState: PackageEditorState = { ...defaultState };

export const packageStore = {
  get: (): PackageEditorState => ({ ...currentState }),
  set: (updates: Partial<PackageEditorState>) => {
    currentState = { ...currentState, ...updates };
  },
  reset: () => {
    currentState = { ...defaultState };
  },
  loadFromPackage: (pkg: {
    id: bigint;
    category: string;
    templateId: bigint;
    guest: {
      name: string;
      contactNumber: string;
      email: string;
      whatsapp: string;
      adults: bigint;
      children: bigint;
      travelDates: string;
      notes: string;
    };
    hotel: string;
    roomType: string;
    foodPackage: string;
    travelOption: string;
    activities: string[];
    boating: string;
    addOns: string[];
    totalCost: bigint;
  }) => {
    currentState = {
      ...defaultState,
      packageId: Number(pkg.id),
      category: pkg.category,
      templateId: Number(pkg.templateId),
      guestName: pkg.guest.name,
      contactNumber: pkg.guest.contactNumber,
      email: pkg.guest.email,
      whatsapp: pkg.guest.whatsapp,
      adults: Number(pkg.guest.adults),
      children: Number(pkg.guest.children),
      travelDates: pkg.guest.travelDates,
      notes: pkg.guest.notes,
      hotel: pkg.hotel,
      roomType: pkg.roomType,
      foodPackage: pkg.foodPackage,
      travelOption: pkg.travelOption,
      activities: pkg.activities,
      boating: pkg.boating,
      addOns: pkg.addOns,
      totalCost: Number(pkg.totalCost),
    };
  },
};
