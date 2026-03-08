// Andaman & Nicobar Islands — comprehensive tourism data
// Used as default master data for the Memorable Holidays application

export interface AndamanDestination {
  id: string;
  name: string;
  islandGroup: string;
  description: string;
  popularMonths: string;
  highlights: string;
  permitRequired: boolean;
}

export interface AndamanHotel {
  id: string;
  name: string;
  city: string;
  category: "3-star" | "4-star" | "5-star" | "resort" | "budget";
  perPersonPerNight: number;
  childRate: number;
}

export interface AndamanActivity {
  id: string;
  name: string;
  destination: string;
  adultRate: number;
  childRate: number;
  category: "adventure" | "cultural" | "leisure" | "water" | "wildlife";
  activityType: "water" | "trekking" | "sightseeing" | "cultural" | "wildlife";
}

export interface AndamanCabType {
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
}

// ─── Destinations ─────────────────────────────────────────────────────────────

export const ANDAMAN_DESTINATIONS: AndamanDestination[] = [
  // South Andaman
  {
    id: "and-d1",
    name: "Port Blair",
    islandGroup: "South Andaman",
    description:
      "Capital city of Andaman & Nicobar Islands — gateway to the archipelago",
    popularMonths: "October – May",
    highlights:
      "Cellular Jail, Ross Island, North Bay, Aberdeen Bazaar, Water Sports",
    permitRequired: false,
  },
  {
    id: "and-d2",
    name: "Cellular Jail (National Memorial)",
    islandGroup: "South Andaman",
    description:
      "Historic colonial prison, now a national monument with Light & Sound Show",
    popularMonths: "October – May",
    highlights:
      "Light & Sound Show, Museum, Freedom fighters' cells, Photography",
    permitRequired: false,
  },
  {
    id: "and-d3",
    name: "Ross Island (Netaji Subhash Chandra Bose Island)",
    islandGroup: "South Andaman",
    description:
      "Former British administrative HQ — atmospheric ruins surrounded by jungle",
    popularMonths: "October – May",
    highlights:
      "British-era ruins, Deer park, Peacocks, Chief Commissioner's House",
    permitRequired: false,
  },
  {
    id: "and-d4",
    name: "North Bay Island (Coral Island)",
    islandGroup: "South Andaman",
    description:
      "Premier water sports hub with vibrant coral reefs visible through glass bottom boats",
    popularMonths: "October – May",
    highlights:
      "Sea Walk, Glass Bottom Boat, Snorkeling, Scuba Diving, Lighthouse",
    permitRequired: false,
  },
  {
    id: "and-d5",
    name: "Viper Island",
    islandGroup: "South Andaman",
    description:
      "Small island with ruins of the first jail built by British colonial powers",
    popularMonths: "October – April",
    highlights: "Gallows ruins, Old jail, Scenic ferry ride, Historical tour",
    permitRequired: false,
  },
  {
    id: "and-d6",
    name: "Corbyn's Cove Beach",
    islandGroup: "South Andaman",
    description:
      "Closest beach to Port Blair — palm-fringed sandy shore popular for water sports",
    popularMonths: "October – May",
    highlights: "Swimming, Jet Ski, Banana Boat, Coconut trees, Sunset views",
    permitRequired: false,
  },
  {
    id: "and-d7",
    name: "Chidiya Tapu (Sunset Point & Bird Watching)",
    islandGroup: "South Andaman",
    description:
      "Southernmost tip of South Andaman — 'Bird Island' with stunning sunset views",
    popularMonths: "October – May",
    highlights:
      "Sunset Point, 150+ bird species, Trekking trails, Mangroves, Munda Pahad Beach",
    permitRequired: false,
  },
  {
    id: "and-d8",
    name: "Wandoor Beach (Mahatma Gandhi Marine National Park)",
    islandGroup: "South Andaman",
    description:
      "Gateway to the protected marine national park with pristine coral ecosystems",
    popularMonths: "October – April",
    highlights:
      "Jolly Buoy Island, Red Skin Island, Coral reefs, Sea turtles, Snorkeling",
    permitRequired: false,
  },
  {
    id: "and-d9",
    name: "Jolly Buoy Island",
    islandGroup: "South Andaman",
    description:
      "Uninhabited island inside the marine national park — pristine coral gardens",
    popularMonths: "November – April",
    highlights:
      "Snorkeling, Glass bottom boat, White sand beaches, No plastics zone",
    permitRequired: false,
  },
  {
    id: "and-d10",
    name: "Red Skin Island",
    islandGroup: "South Andaman",
    description:
      "Alternative to Jolly Buoy open during monsoon months — superb coral reefs",
    popularMonths: "May – October",
    highlights: "Snorkeling, Pristine beaches, Coral ecosystems, Sea turtles",
    permitRequired: false,
  },
  {
    id: "and-d11",
    name: "Cinque Island",
    islandGroup: "South Andaman",
    description:
      "Two pristine islands connected by a sand bar — among the most beautiful in Andaman",
    popularMonths: "November – April",
    highlights: "Scuba Diving, Snorkeling, Turtle nesting, Crystal clear water",
    permitRequired: false,
  },
  {
    id: "and-d12",
    name: "Rutland Island",
    islandGroup: "South Andaman",
    description:
      "Remote island south of South Andaman with untouched beaches and mangroves",
    popularMonths: "October – April",
    highlights: "Untouched beaches, Mangrove forests, Bird watching, Solitude",
    permitRequired: false,
  },
  {
    id: "and-d13",
    name: "Little Andaman (Hut Bay)",
    islandGroup: "South Andaman",
    description:
      "Remote island with surfing beaches, waterfalls and tribal territory",
    popularMonths: "October – April",
    highlights:
      "Butler Bay Beach, White Surf Waterfall, Surfing, Elephant rehabilitation camp",
    permitRequired: false,
  },
  // Havelock Island
  {
    id: "and-d14",
    name: "Radhanagar Beach (Beach No. 7)",
    islandGroup: "Havelock Island (Swaraj Dweep)",
    description:
      "Ranked among Asia's best beaches — pristine white sand with turquoise waters",
    popularMonths: "October – May",
    highlights:
      "Sunset views, Swimming, Photography, Beach walks, World-class beauty",
    permitRequired: false,
  },
  {
    id: "and-d15",
    name: "Elephant Beach (Havelock)",
    islandGroup: "Havelock Island (Swaraj Dweep)",
    description:
      "Remote beach accessible by boat or trek — excellent snorkeling destination",
    popularMonths: "October – May",
    highlights:
      "Snorkeling, Coral reefs, Sea Walk, Trekking trail through forest",
    permitRequired: false,
  },
  {
    id: "and-d16",
    name: "Kalapathar Beach",
    islandGroup: "Havelock Island (Swaraj Dweep)",
    description:
      "Named after black rocks lining the shore — peaceful sunrise beach",
    popularMonths: "October – May",
    highlights: "Sunrise views, Black rocks, Peaceful atmosphere, Photography",
    permitRequired: false,
  },
  {
    id: "and-d17",
    name: "Vijaypur Beach (Havelock)",
    islandGroup: "Havelock Island (Swaraj Dweep)",
    description:
      "Long stretch of white sand near the jetty — first beach you see on Havelock",
    popularMonths: "October – May",
    highlights: "Swimming, Snorkeling near jetty, Water sports, Easy access",
    permitRequired: false,
  },
  {
    id: "and-d18",
    name: "Govindnagar Beach (Havelock)",
    islandGroup: "Havelock Island (Swaraj Dweep)",
    description:
      "Quiet and less crowded beach on the eastern side of Havelock island",
    popularMonths: "October – April",
    highlights: "Peaceful beach, Fishing boats, Local village, Sunrise views",
    permitRequired: false,
  },
  // Neil Island
  {
    id: "and-d19",
    name: "Bharatpur Beach (Neil Island)",
    islandGroup: "Neil Island (Shaheed Dweep)",
    description:
      "Main beach of Neil Island — calm lagoon waters ideal for snorkeling",
    popularMonths: "October – May",
    highlights:
      "Snorkeling, Glass bottom boat, Water sports, Coral viewing, Shallow lagoon",
    permitRequired: false,
  },
  {
    id: "and-d20",
    name: "Laxmanpur Beach (Neil Island)",
    islandGroup: "Neil Island (Shaheed Dweep)",
    description: "Wide open beach — best sunset point on Neil Island",
    popularMonths: "October – May",
    highlights:
      "Sunset views, Natural rock formation, Shell collecting, Beach walks",
    permitRequired: false,
  },
  {
    id: "and-d21",
    name: "Natural Bridge (Neil Island)",
    islandGroup: "Neil Island (Shaheed Dweep)",
    description:
      "Iconic natural coral rock bridge formation at Laxmanpur Beach",
    popularMonths: "October – May",
    highlights:
      "Natural arch formation, Low-tide exploration, Photography, Tidal pools",
    permitRequired: false,
  },
  {
    id: "and-d22",
    name: "Sitapur Beach (Neil Island)",
    islandGroup: "Neil Island (Shaheed Dweep)",
    description: "Remote sunrise beach on the eastern tip of Neil Island",
    popularMonths: "October – April",
    highlights: "Sunrise views, Secluded beach, Cycling trail, Fishing village",
    permitRequired: false,
  },
  // North & Middle Andaman
  {
    id: "and-d23",
    name: "Rangat (Amkunj Beach)",
    islandGroup: "North & Middle Andaman",
    description:
      "Coastal town in Middle Andaman with peaceful mangrove-lined beaches",
    popularMonths: "October – April",
    highlights:
      "Amkunj Beach, Mangroves, Freshwater streams, Sea turtles nesting",
    permitRequired: false,
  },
  {
    id: "and-d24",
    name: "Long Island (Lalaji Bay)",
    islandGroup: "North & Middle Andaman",
    description:
      "Remote island accessible only by boat — pristine freshwater stream meets the sea",
    popularMonths: "October – April",
    highlights:
      "Lalaji Bay Beach, Freshwater stream, Jungle trekking, Remote getaway",
    permitRequired: false,
  },
  {
    id: "and-d25",
    name: "Baratang Island (Limestone Caves & Mud Volcano)",
    islandGroup: "North & Middle Andaman",
    description:
      "Unique island with natural limestone caves, mud volcanoes and mangrove creeks",
    popularMonths: "October – April",
    highlights:
      "Limestone Caves, Mud Volcano, Mangrove creek boat ride, Parrot Island",
    permitRequired: false,
  },
  {
    id: "and-d26",
    name: "Mayabunder",
    islandGroup: "North & Middle Andaman",
    description:
      "Quiet town in North Andaman — base for visits to remote islands",
    popularMonths: "October – April",
    highlights:
      "Karmatang Beach, Avis Island, Mangroves, Tribal village visits",
    permitRequired: false,
  },
  {
    id: "and-d27",
    name: "Karmatang Beach",
    islandGroup: "North & Middle Andaman",
    description:
      "Sea turtle nesting beach near Mayabunder — peaceful and pristine",
    popularMonths: "October – April",
    highlights: "Turtle nesting, Sunrise views, Pristine sands, No crowds",
    permitRequired: false,
  },
  {
    id: "and-d28",
    name: "Ross & Smith Islands (Twin Islands)",
    islandGroup: "North & Middle Andaman",
    description:
      "Two islands connected by a natural sand bar — stunning and unique",
    popularMonths: "October – April",
    highlights:
      "Twin island walk, Sand bar at low tide, Snorkeling, Photography",
    permitRequired: false,
  },
  {
    id: "and-d29",
    name: "Diglipur (Kalipur Beach & Saddle Peak)",
    islandGroup: "North & Middle Andaman",
    description:
      "Northernmost major town — base for Saddle Peak trek and turtle nesting beaches",
    popularMonths: "October – April",
    highlights:
      "Saddle Peak trek, Kalipur beach turtles, Alfred Caves, Ram Nagar Beach",
    permitRequired: false,
  },
  {
    id: "and-d30",
    name: "Saddle Peak National Park",
    islandGroup: "North & Middle Andaman",
    description:
      "Highest peak in Andaman — rainforest trekking with panoramic views",
    popularMonths: "October – April",
    highlights:
      "Trek to summit (732m), Rainforest, Endemic birds, Panoramic views",
    permitRequired: false,
  },
  {
    id: "and-d31",
    name: "Interview Island Wildlife Sanctuary",
    islandGroup: "North & Middle Andaman",
    description:
      "Protected island sanctuary — home to feral elephants and diverse wildlife",
    popularMonths: "October – April",
    highlights:
      "Feral elephants, Salt licks, Dense forest, Wildlife photography",
    permitRequired: false,
  },
  {
    id: "and-d32",
    name: "Guitar Island & Panchavati Bay",
    islandGroup: "North & Middle Andaman",
    description:
      "Remote islands accessible by boat with unspoiled beaches and reefs",
    popularMonths: "November – April",
    highlights:
      "Guitar-shaped island, Snorkeling, Coral reefs, Camping, Solitude",
    permitRequired: false,
  },
  // Little Andaman
  {
    id: "and-d33",
    name: "Butler Bay Beach (Little Andaman)",
    islandGroup: "Little Andaman",
    description:
      "Surfing beach on Little Andaman — powerful waves attract surf enthusiasts",
    popularMonths: "October – April",
    highlights: "Surfing, Pristine beach, Coconut groves, Solitude",
    permitRequired: false,
  },
  {
    id: "and-d34",
    name: "White Surf Waterfall (Little Andaman)",
    islandGroup: "Little Andaman",
    description:
      "Scenic waterfall cascading to the sea — surrounded by lush tropical forest",
    popularMonths: "October – April",
    highlights: "Waterfall swimming, Trekking, Photography, Tropical forest",
    permitRequired: false,
  },
  {
    id: "and-d35",
    name: "Whisper Wave Waterfall (Little Andaman)",
    islandGroup: "Little Andaman",
    description:
      "Tranquil waterfall in the forested interior of Little Andaman island",
    popularMonths: "October – April",
    highlights: "Forest trek, Peaceful waterfall, Bird watching, Photography",
    permitRequired: false,
  },
  // Nicobar Islands
  {
    id: "and-d36",
    name: "Car Nicobar",
    islandGroup: "Nicobar Islands (Restricted — RAP Required)",
    description:
      "Main inhabited Nicobar island with Air Force base — restricted entry",
    popularMonths: "November – March",
    highlights:
      "Traditional Nicobarese culture, Coconut plantations, Air Force base",
    permitRequired: true,
  },
  {
    id: "and-d37",
    name: "Great Nicobar Island (Indira Point)",
    islandGroup: "Nicobar Islands (Restricted — RAP Required)",
    description:
      "Southernmost tip of India — remote biosphere reserve with rich biodiversity",
    popularMonths: "November – February",
    highlights:
      "Indira Point lighthouse, Giant leatherback turtles, Saltwater crocodiles, Shompen tribe",
    permitRequired: true,
  },
  {
    id: "and-d38",
    name: "Campbell Bay (Great Nicobar)",
    islandGroup: "Nicobar Islands (Restricted — RAP Required)",
    description:
      "Main settlement on Great Nicobar — gateway to Galathea National Park",
    popularMonths: "November – February",
    highlights:
      "Galathea National Park, River safari, Giant robber crabs, Pristine beaches",
    permitRequired: true,
  },
  {
    id: "and-d39",
    name: "Kamorta Island (Nancowry Group)",
    islandGroup: "Nicobar Islands (Restricted — RAP Required)",
    description:
      "One of the more accessible Nicobar islands with natural harbour",
    popularMonths: "November – February",
    highlights: "Natural harbour, Tribal villages, Coconut palms, Diving",
    permitRequired: true,
  },
  // Barren & Volcanic Islands
  {
    id: "and-d40",
    name: "Barren Island (Active Volcano)",
    islandGroup: "Barren & Volcanic Islands",
    description:
      "India's only active volcano — dramatic volcanic landscape rising from the sea",
    popularMonths: "November – April",
    highlights:
      "Active lava flows, Volcanic crater, Dive sites, Unique marine life",
    permitRequired: false,
  },
  {
    id: "and-d41",
    name: "Narcondam Island (Hornbill Sanctuary)",
    islandGroup: "Barren & Volcanic Islands",
    description:
      "Extinct volcanic island — sanctuary for the endemic Narcondam hornbill",
    popularMonths: "December – March",
    highlights:
      "Narcondam hornbill, Pristine coral reefs, Diving, Bird watching",
    permitRequired: false,
  },
];

// ─── Hotels ───────────────────────────────────────────────────────────────────

export const ANDAMAN_HOTELS: AndamanHotel[] = [
  {
    id: "and-h1",
    name: "Sea Shell Port Blair",
    city: "Port Blair",
    category: "4-star",
    perPersonPerNight: 4500,
    childRate: 2200,
  },
  {
    id: "and-h2",
    name: "Fortune Resort Bay Island",
    city: "Port Blair",
    category: "5-star",
    perPersonPerNight: 7500,
    childRate: 3500,
  },
  {
    id: "and-h3",
    name: "Sinclairs Bayview Port Blair",
    city: "Port Blair",
    category: "3-star",
    perPersonPerNight: 3200,
    childRate: 1500,
  },
  {
    id: "and-h4",
    name: "Peerless Resort Port Blair",
    city: "Port Blair",
    category: "4-star",
    perPersonPerNight: 5500,
    childRate: 2500,
  },
  {
    id: "and-h5",
    name: "Summer Sands Beach Resort",
    city: "Corbyn's Cove",
    category: "3-star",
    perPersonPerNight: 3800,
    childRate: 1800,
  },
  {
    id: "and-h6",
    name: "Hotel Sentinel Port Blair",
    city: "Port Blair",
    category: "3-star",
    perPersonPerNight: 2800,
    childRate: 1200,
  },
  {
    id: "and-h7",
    name: "Welcomhotel Bay Island ITC",
    city: "Port Blair",
    category: "5-star",
    perPersonPerNight: 8500,
    childRate: 4000,
  },
  {
    id: "and-h8",
    name: "SeaView Guest House",
    city: "Port Blair",
    category: "budget",
    perPersonPerNight: 1500,
    childRate: 700,
  },
  {
    id: "and-h9",
    name: "TSG Grand Port Blair",
    city: "Port Blair",
    category: "5-star",
    perPersonPerNight: 9000,
    childRate: 4200,
  },
  {
    id: "and-h10",
    name: "Havelock Island Beach Resort",
    city: "Havelock Island",
    category: "4-star",
    perPersonPerNight: 5000,
    childRate: 2500,
  },
  {
    id: "and-h11",
    name: "Symphony Palms Beach Resort",
    city: "Havelock Island",
    category: "4-star",
    perPersonPerNight: 6500,
    childRate: 3000,
  },
  {
    id: "and-h12",
    name: "Barefoot at Havelock",
    city: "Havelock Island",
    category: "resort",
    perPersonPerNight: 9500,
    childRate: 4500,
  },
  {
    id: "and-h13",
    name: "Wild Orchid Resort Havelock",
    city: "Havelock Island",
    category: "3-star",
    perPersonPerNight: 4200,
    childRate: 2000,
  },
  {
    id: "and-h14",
    name: "Silver Sand Beach Resort Havelock",
    city: "Havelock Island",
    category: "3-star",
    perPersonPerNight: 3500,
    childRate: 1600,
  },
  {
    id: "and-h15",
    name: "Sea Princess Beach Resort Neil",
    city: "Neil Island",
    category: "budget",
    perPersonPerNight: 2500,
    childRate: 1200,
  },
  {
    id: "and-h16",
    name: "Pearl Park Beach Resort Neil",
    city: "Neil Island",
    category: "3-star",
    perPersonPerNight: 3000,
    childRate: 1400,
  },
  {
    id: "and-h17",
    name: "Garden View Resort Neil Island",
    city: "Neil Island",
    category: "budget",
    perPersonPerNight: 1800,
    childRate: 800,
  },
  {
    id: "and-h18",
    name: "Pristine Beach Resort Long Island",
    city: "Long Island",
    category: "4-star",
    perPersonPerNight: 4500,
    childRate: 2200,
  },
  {
    id: "and-h19",
    name: "Hotel Sunrise Rangat",
    city: "Rangat",
    category: "budget",
    perPersonPerNight: 1500,
    childRate: 600,
  },
  {
    id: "and-h20",
    name: "Hotel Valley Diglipur",
    city: "Diglipur",
    category: "budget",
    perPersonPerNight: 1400,
    childRate: 600,
  },
];

// ─── Activities ───────────────────────────────────────────────────────────────

export const ANDAMAN_ACTIVITIES: AndamanActivity[] = [
  // Water Activities
  {
    id: "and-a1",
    name: "Scuba Diving (Havelock)",
    destination: "Havelock Island (Swaraj Dweep)",
    adultRate: 3500,
    childRate: 2000,
    category: "water",
    activityType: "water",
  },
  {
    id: "and-a2",
    name: "Snorkeling Package (Havelock)",
    destination: "Havelock Island (Swaraj Dweep)",
    adultRate: 800,
    childRate: 500,
    category: "water",
    activityType: "water",
  },
  {
    id: "and-a3",
    name: "Glass Bottom Boat Ride (North Bay)",
    destination: "South Andaman",
    adultRate: 600,
    childRate: 300,
    category: "water",
    activityType: "water",
  },
  {
    id: "and-a4",
    name: "Sea Walk (North Bay Island)",
    destination: "South Andaman",
    adultRate: 3500,
    childRate: 2000,
    category: "water",
    activityType: "water",
  },
  {
    id: "and-a5",
    name: "Kayaking (Andaman Waters)",
    destination: "South Andaman",
    adultRate: 1200,
    childRate: 700,
    category: "water",
    activityType: "water",
  },
  {
    id: "and-a6",
    name: "Jet Ski Ride (Port Blair)",
    destination: "South Andaman",
    adultRate: 1500,
    childRate: 0,
    category: "water",
    activityType: "water",
  },
  {
    id: "and-a7",
    name: "Banana Boat Ride (Corbyn's Cove)",
    destination: "South Andaman",
    adultRate: 500,
    childRate: 300,
    category: "water",
    activityType: "water",
  },
  {
    id: "and-a8",
    name: "Speed Boat Ride (Port Blair)",
    destination: "South Andaman",
    adultRate: 800,
    childRate: 400,
    category: "water",
    activityType: "water",
  },
  {
    id: "and-a9",
    name: "Parasailing (Havelock)",
    destination: "Havelock Island (Swaraj Dweep)",
    adultRate: 2000,
    childRate: 0,
    category: "water",
    activityType: "water",
  },
  {
    id: "and-a10",
    name: "Houseboat Cruise (Neil Island)",
    destination: "Neil Island (Shaheed Dweep)",
    adultRate: 2000,
    childRate: 1000,
    category: "leisure",
    activityType: "water",
  },
  {
    id: "and-a11",
    name: "Sunset Cruise (Port Blair)",
    destination: "South Andaman",
    adultRate: 1200,
    childRate: 600,
    category: "leisure",
    activityType: "water",
  },
  {
    id: "and-a12",
    name: "Island Hopping Tour (Port Blair)",
    destination: "South Andaman",
    adultRate: 2500,
    childRate: 1200,
    category: "leisure",
    activityType: "water",
  },
  // Trekking Activities
  {
    id: "and-a13",
    name: "Chidiya Tapu Bird Watching Trek",
    destination: "South Andaman",
    adultRate: 500,
    childRate: 250,
    category: "adventure",
    activityType: "trekking",
  },
  {
    id: "and-a14",
    name: "Mount Harriet National Park Trek",
    destination: "South Andaman",
    adultRate: 800,
    childRate: 400,
    category: "adventure",
    activityType: "trekking",
  },
  {
    id: "and-a15",
    name: "Saddle Peak Trekking (Diglipur)",
    destination: "North & Middle Andaman",
    adultRate: 1000,
    childRate: 500,
    category: "adventure",
    activityType: "trekking",
  },
  {
    id: "and-a16",
    name: "Limestone Caves Trek (Baratang)",
    destination: "North & Middle Andaman",
    adultRate: 1500,
    childRate: 800,
    category: "adventure",
    activityType: "trekking",
  },
  {
    id: "and-a17",
    name: "Mangrove Creek Boat + Trek (Baratang)",
    destination: "North & Middle Andaman",
    adultRate: 1200,
    childRate: 600,
    category: "adventure",
    activityType: "trekking",
  },
  {
    id: "and-a18",
    name: "Elephant Beach Jungle Trek (Havelock)",
    destination: "Havelock Island (Swaraj Dweep)",
    adultRate: 500,
    childRate: 300,
    category: "adventure",
    activityType: "trekking",
  },
  // Sightseeing & Cultural
  {
    id: "and-a19",
    name: "Cellular Jail Light & Sound Show",
    destination: "South Andaman",
    adultRate: 500,
    childRate: 250,
    category: "cultural",
    activityType: "sightseeing",
  },
  {
    id: "and-a20",
    name: "Ross Island Sightseeing Tour",
    destination: "South Andaman",
    adultRate: 1000,
    childRate: 500,
    category: "cultural",
    activityType: "sightseeing",
  },
  {
    id: "and-a21",
    name: "Marine National Park (Wandoor)",
    destination: "South Andaman",
    adultRate: 1500,
    childRate: 750,
    category: "wildlife",
    activityType: "sightseeing",
  },
  {
    id: "and-a22",
    name: "Barren Island Volcano Day Tour",
    destination: "Barren & Volcanic Islands",
    adultRate: 4500,
    childRate: 0,
    category: "adventure",
    activityType: "sightseeing",
  },
  {
    id: "and-a23",
    name: "Narcondam Island Birdwatching",
    destination: "Barren & Volcanic Islands",
    adultRate: 5000,
    childRate: 2500,
    category: "wildlife",
    activityType: "wildlife",
  },
  {
    id: "and-a24",
    name: "Anthropological Museum Visit",
    destination: "South Andaman",
    adultRate: 200,
    childRate: 100,
    category: "cultural",
    activityType: "cultural",
  },
  {
    id: "and-a25",
    name: "Samudrika Naval Marine Museum",
    destination: "South Andaman",
    adultRate: 250,
    childRate: 100,
    category: "cultural",
    activityType: "cultural",
  },
];

// ─── Cab / Transport Types ────────────────────────────────────────────────────

export const ANDAMAN_CAB_TYPES: AndamanCabType[] = [
  {
    id: "and-c1",
    name: "AC Sedan (4 Seater)",
    vehicleType: "sedan",
    seatingCapacity: 4,
    perDayRate: 2800,
    perKmRate: 15,
    isFlatRate: false,
    notes: "Swift Dzire / Honda Amaze / similar",
  },
  {
    id: "and-c2",
    name: "AC SUV / Innova (7 Seater)",
    vehicleType: "suv",
    seatingCapacity: 7,
    perDayRate: 4200,
    perKmRate: 20,
    isFlatRate: false,
    notes: "Innova Crysta / Ertiga / similar",
  },
  {
    id: "and-c3",
    name: "Tempo Traveller (12 Seater)",
    vehicleType: "tempo",
    seatingCapacity: 12,
    perDayRate: 7000,
    perKmRate: 25,
    isFlatRate: false,
    notes: "Force Traveller / similar",
  },
  {
    id: "and-c4",
    name: "Mini Bus (20 Seater)",
    vehicleType: "bus",
    seatingCapacity: 20,
    perDayRate: 12000,
    perKmRate: 30,
    isFlatRate: false,
    notes: "For large group transfers",
  },
  {
    id: "and-c5",
    name: "Open Jeep (6 Seater)",
    vehicleType: "jeep",
    seatingCapacity: 6,
    perDayRate: 3500,
    perKmRate: 18,
    isFlatRate: false,
    notes: "Mahindra Thar / similar — forest & beach routes",
  },
  {
    id: "and-c6",
    name: "Private Ferry Transfer",
    vehicleType: "ferry",
    seatingCapacity: 20,
    perDayRate: 8000,
    perKmRate: 0,
    isFlatRate: true,
    notes: "Port Blair to Havelock/Neil — charter basis",
  },
  {
    id: "and-c7",
    name: "Government Ferry (Economy Class)",
    vehicleType: "ferry",
    seatingCapacity: 1,
    perDayRate: 350,
    perKmRate: 0,
    isFlatRate: true,
    notes: "Per person per trip — Makruzz/Nautika/Govt service",
  },
  {
    id: "and-c8",
    name: "Helicopter Transfer (Port Blair–Havelock)",
    vehicleType: "helicopter",
    seatingCapacity: 5,
    perDayRate: 7500,
    perKmRate: 0,
    isFlatRate: true,
    notes: "Per person one-way — subject to availability",
  },
  {
    id: "and-c9",
    name: "Auto Rickshaw (3 Seater)",
    vehicleType: "auto",
    seatingCapacity: 3,
    perDayRate: 800,
    perKmRate: 8,
    isFlatRate: false,
    notes: "Local city transfers in Port Blair",
  },
  {
    id: "and-c10",
    name: "Bike / Scooter Rental",
    vehicleType: "bike",
    seatingCapacity: 2,
    perDayRate: 600,
    perKmRate: 0,
    isFlatRate: true,
    notes: "Self-drive — ideal for Havelock & Neil Island",
  },
];
