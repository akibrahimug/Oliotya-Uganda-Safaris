// This matches the Prisma Package model schema
export interface PackageItinerary {
  day: number;
  title: string;
  description: string;
}

export type DifficultyLevel = "EASY" | "MODERATE" | "CHALLENGING";

export interface Package {
  id: number;
  name: string;
  slug: string;
  category: string;
  duration: string;
  price: number;
  description: string;
  image: string;
  images: string[];
  highlights: string[];
  itinerary: PackageItinerary[]; // Stored as JSON in DB
  included: string[];
  excluded: string[];
  minTravelers: number;
  maxTravelers: number;
  difficulty: DifficultyLevel;
  featured?: boolean;
  popular?: boolean;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const allPackages: Package[] = [
  {
    id: 1,
    name: "14-Days North, West & South Uganda",
    slug: "14-days-north-west-south-uganda",
    category: "Grand Tour",
    duration: "14 Days",
    price: 5074,
    image: "/uganda-safari-landscape-team-adventure.jpg",
    images: [
      "/murchison-falls-national-park-uganda-waterfall.jpg",
      "/queen-elizabeth-national-park-tree-climbing-lions.jpg",
      "/bwindi-impenetrable-national-park-uganda-mountain-gorillas.jpg",
      "/lake-mburo-national-park-uganda-zebras-savannah.jpg",
    ],
    description:
      "The ultimate Uganda safari experience! This comprehensive 14-day journey takes you through the best of Uganda's north, west, and south regions. Experience the mighty Murchison Falls, track chimpanzees in Kibale Forest, encounter tree-climbing lions in Ishasha, trek mountain gorillas in Bwindi, and explore the stunning lakes and landscapes of southwestern Uganda.",
    highlights: [
      "Arrival at Entebbe Airport",
      "Entebbe - Murchison Falls National Park",
      "Murchison Falls National Park - Full Day",
      "Murchison Falls National Park - Kibale Forest",
      "Kibale Forest - Chimpanzee Tracking",
      "Kibale Forest - Queen Elizabeth National Park",
      "Queen Elizabeth National Park - Full Day",
      "Queen Elizabeth National Park - Ishasha",
      "Ishasha - Bwindi Impenetrable",
      "Bwindi Impenetrable - Gorilla Trekking",
      "Bwindi Impenetrable - Lake Mutanda",
      "Lake Mutanda - Mgahinga National Park - Lake Bunyonyi",
      "Lake Bunyonyi - Lake Mburo National Park",
      "Lake Mburo National Park - Entebbe Airport",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival at Entebbe Airport",
        description:
          "Arrival at Entebbe Airport. Your guide will be there waiting for you. Pick up and proceed to your accommodation.",
      },
      {
        day: 2,
        title: "Entebbe - Murchison Falls National Park",
        description:
          "After your early breakfast we will drive to Ziwa Sanctuary for a White Rhino bush walk... Expect to see elephants, giraffes, lions, hippos, crocodiles, buffaloes and maybe leopards.",
      },
      {
        day: 3,
        title: "Murchison Falls National Park - Full Day",
        description:
          "Early morning game drive... Afternoon boat ride on the Victoria Nile up to the bottom of the falls and hike to the top of the falls.",
      },
      {
        day: 4,
        title: "Murchison Falls National Park - Kibale Forest",
        description:
          "After breakfast we drive to Kibale Forest. Optional community walk in the afternoon.",
      },
      {
        day: 5,
        title: "Kibale Forest - Chimpanzee Tracking",
        description:
          "Chimpanzee tracking (1 hour; optional upgrade to CHE 4 hours). Optional Bigodi community walk; optional night walk.",
      },
      {
        day: 6,
        title: "Kibale Forest - Queen Elizabeth National Park",
        description:
          "Transfer to Queen Elizabeth NP via the equator. Afternoon game drive.",
      },
      {
        day: 7,
        title: "Queen Elizabeth National Park - Full Day",
        description:
          "Morning game drive. Afternoon boat trip on the Kazinga Channel (highest hippo concentrations).",
      },
      {
        day: 8,
        title: "Queen Elizabeth National Park - Ishasha",
        description:
          "Drive to Ishasha sector. Options: Kyambura/Kalinzu chimps, Maramagambo forest & bat caves. PM game drive for tree-climbing lions.",
      },
      {
        day: 9,
        title: "Ishasha - Bwindi Impenetrable",
        description:
          "AM game drive, then transfer to Bwindi through scenic villages and mountains.",
      },
      {
        day: 10,
        title: "Bwindi Impenetrable - Gorilla Trekking",
        description:
          "Gorilla tracking with ranger guides. Spend one hour with a habituated group.",
      },
      {
        day: 11,
        title: "Bwindi Impenetrable - Lake Mutanda",
        description:
          "Optional second gorilla trek / forest walk / Batwa community / birding. Transfer to Lake Mutanda with one included local activity.",
      },
      {
        day: 12,
        title: "Lake Mutanda - Mgahinga National Park - Lake Bunyonyi",
        description:
          "One included activity in/near Mgahinga (nature walk, birding, golden monkeys, volcano hike). Transfer to Lake Bunyonyi for overnight.",
      },
      {
        day: 13,
        title: "Lake Bunyonyi - Lake Mburo National Park",
        description:
          "Transfer to Lake Mburo. Afternoon boat trip or game drive. Night game drive in search of leopards.",
      },
      {
        day: 14,
        title: "Lake Mburo National Park - Entebbe Airport",
        description:
          "Morning game drive or walking safari. Equator photo stop and transfer to Entebbe Airport.",
      },
    ],
    included: [
      "Airport pick-up and drop-off",
      "4x4 safari vehicle with fuel & professional English-speaking driver/guide",
      "13 nights accommodation (lodges/camps) as per itinerary",
      "Meals as per itinerary (generally breakfast, lunch, dinner)",
      "All national park entrance fees on the itinerary",
      "Ziwa Rhino Sanctuary bush walk",
      "Game drives in Murchison, Queen Elizabeth, Ishasha, and Lake Mburo",
      "Boat cruises: Victoria Nile (Murchison) and Kazinga Channel",
      "Hike to top of Murchison Falls",
      "Chimpanzee trekking permit (Kibale)",
      "Mountain gorilla trekking permit (Bwindi)",
      "One included activity at Lake Mutanda",
      "One included activity at Mgahinga NP (non-premium)",
      "Night game drive in Lake Mburo (where permitted)",
      "Bottled drinking water during drives",
    ],
    excluded: [
      "International flights",
      "Uganda visa fees",
      "Travel/medical insurance",
      "Optional activities not stated as included (e.g., CHE upgrade, second gorilla trek, Kyambura/Kalinzu chimps)",
      "Alcoholic beverages and specialty drinks",
      "Personal expenses (laundry, phone, souvenirs)",
      "Tips/gratuities for guides and lodge staff",
      "PCR/medical tests if required",
    ],
    minTravelers: 2,
    maxTravelers: 32,
    difficulty: "CHALLENGING",
    featured: true,
    popular: true,
    active: true,
  },
  {
    id: 2,
    name: "5-Days Kidepo Valley Safari",
    slug: "5-days-kidepo-valley-safari",
    category: "Wildlife Safari",
    duration: "5 Days",
    price: 1200,
    image: "/uganda-safari-landscape-team-adventure.jpg",
    images: [
      "/murchison-falls-national-park-uganda-waterfall.jpg",
      "/queen-elizabeth-national-park-tree-climbing-lions.jpg",
      "/bwindi-impenetrable-national-park-uganda-mountain-gorillas.jpg",
      "/lake-mburo-national-park-uganda-zebras-savannah.jpg",
    ],
    description:
      "Experience Uganda's most isolated and magnificent national park. Kidepo Valley offers stunning wilderness, abundant wildlife, and unique cultural encounters with the Karamojong people.",
    highlights: [
      "Drive to Gulu - Ziwa Rhino Sanctuary",
      "Drive to Kidepo Valley National Park",
      "Game Drive and Nature Walk - Hot Springs",
      "Game Drive and Community/Cultural Visits",
      "Drive back to Kampala/Entebbe",
    ],
    itinerary: [
      {
        day: 1,
        title: "Drive to Gulu - Ziwa Rhino Sanctuary",
        description:
          "Early start from Kampala/Entebbe. Visit Ziwa Rhino Sanctuary for a rhino tracking walk. Lunch en route and continue to Gulu.",
      },
      {
        day: 2,
        title: "Drive to Kidepo Valley National Park",
        description:
          "Transfer to Kidepo NP. Late afternoon game drive in the Narus/Apoka area.",
      },
      {
        day: 3,
        title: "Game Drive and Nature Walk - Hot Springs",
        description:
          "Morning game drive for elephants, zebras, buffalo, lions, cheetah (rare). Nature walk to the hot springs. Optional night game drive.",
      },
      {
        day: 4,
        title: "Game Drive and Community/Cultural Visits",
        description:
          "Morning game drive. Evening visit to a Karamojong village for cultural interaction.",
      },
      {
        day: 5,
        title: "Drive back to Kampala/Entebbe",
        description:
          "After breakfast, begin the drive south. Scenic stops and lunch en route before evening drop-off.",
      },
    ],
    included: [
      "Transport in a 4x4 safari vehicle with driver/guide",
      "4 nights accommodation (lodges/camps)",
      "Meals as per itinerary",
      "Ziwa Rhino Sanctuary tracking fee",
      "Kidepo NP entrance fees",
      "Game drives and guided nature walk to hot springs",
      "Community visit to a Karamojong village",
      "Bottled water during transfers/game drives",
    ],
    excluded: [
      "International flights",
      "Visa fees",
      "Travel insurance",
      "Optional night game drive if not specified by lodge/park",
      "Alcoholic beverages and soft drinks not mentioned",
      "Personal expenses (laundry, souvenirs)",
      "Tips and gratuities",
    ],
    minTravelers: 2,
    maxTravelers: 32,
    difficulty: "MODERATE",
    featured: true,
    active: true,
  },
  {
    id: 3,
    name: "6-Days Primates & Safari",
    slug: "6-days-primates-safari",
    category: "Luxury Safari",
    duration: "6 Days",
    price: 2300,
    image: "/uganda-safari-landscape-team-adventure.jpg",
    images: [
      "/murchison-falls-national-park-uganda-waterfall.jpg",
      "/queen-elizabeth-national-park-tree-climbing-lions.jpg",
      "/bwindi-impenetrable-national-park-uganda-mountain-gorillas.jpg",
      "/lake-mburo-national-park-uganda-zebras-savannah.jpg",
    ],
    description:
      "A safari breeze from the mountain Gorillas to the deepest lakes. Luxury lodges, gorilla trekking in Bwindi, canoeing on Lake Bunyonyi, and wildlife at Lake Mburo.",
    highlights: [
      "Drive to Lake Bunyonyi",
      "Lake Bunyonyi - Canoeing Experience",
      "Drive to Bwindi Impenetrable Forest",
      "Gorilla Trekking - Drive to Lake Mutanda",
      "Drive to Lake Mburo National Park",
      "Return to Kampala/Entebbe Airport",
    ],
    itinerary: [
      {
        day: 1,
        title: "Drive to Lake Bunyonyi",
        description:
          "Breakfast at the Equator, lunch en route, arrive at Lake Bunyonyi for dinner at your luxury accommodation.",
      },
      {
        day: 2,
        title: "Lake Bunyonyi - Canoeing Experience",
        description:
          "Guided canoeing among the islands. Relax at the lodge with lake views.",
      },
      {
        day: 3,
        title: "Drive to Bwindi Impenetrable Forest",
        description:
          "Transfer to Bwindi. Lunch and relaxation at the lodge before trekking day.",
      },
      {
        day: 4,
        title: "Gorilla Trekking - Drive to Lake Mutanda",
        description:
          "Morning gorilla trekking in Bwindi (1-hour encounter). After lunch, transfer to Lake Mutanda.",
      },
      {
        day: 5,
        title: "Drive to Lake Mburo National Park",
        description:
          "Drive to Lake Mburo, lunch, and evening game drive for zebras, impalas, and more.",
      },
      {
        day: 6,
        title: "Return to Kampala/Entebbe Airport",
        description:
          "Drive back to Kampala/Entebbe with lunch and photo stop at the Equator.",
      },
    ],
    included: [
      "4x4 luxury safari vehicle with professional driver/guide",
      "5 nights luxury accommodation",
      "Meals as per itinerary",
      "Bwindi gorilla trekking permit",
      "Guided canoeing on Lake Bunyonyi",
      "Lake Mburo NP park fees and game drive",
      "All transfers and road transport",
      "Bottled water on travel days",
    ],
    excluded: [
      "International flights",
      "Uganda visa fees",
      "Travel insurance",
      "Optional activities not specified",
      "Alcoholic beverages and premium drinks",
      "Personal expenses (laundry, souvenirs)",
      "Tips/gratuities",
    ],
    minTravelers: 2,
    maxTravelers: 32,
    difficulty: "MODERATE",
    featured: true,
    popular: true,
    active: true,
  },
  {
    id: 4,
    name: "22-Days Deep in Uganda",
    slug: "22-days-deep-in-uganda",
    category: "Ultimate Adventure",
    duration: "22 Days",
    price: 7200,
    image: "/uganda-safari-landscape-team-adventure.jpg",
    images: [
      "/murchison-falls-national-park-uganda-waterfall.jpg",
      "/queen-elizabeth-national-park-tree-climbing-lions.jpg",
      "/bwindi-impenetrable-national-park-uganda-mountain-gorillas.jpg",
      "/lake-mburo-national-park-uganda-zebras-savannah.jpg",
    ],
    description:
      "The most complete Uganda experience: primates, wildlife, culture, and adventure sports across 22 unforgettable days.",
    highlights: [
      "Arrival in Kampala/Entebbe - Boda Tour",
      "Drive to Jinja - Zip Lining",
      "White Water Rafting in Jinja",
      "Drive to Sipi Falls",
      "Hiking in Sipi Falls",
      "Drive to Moroto",
      "Mountain Biking / Karamoja Cultural Tour",
      "Drive to Kidepo Valley - Evening Game Drive",
      "Morning Game Drive in Kidepo",
      "Drive to Murchison Falls - Evening Game Drive",
      "Morning Game Drive and Boat Ride",
      "Drive to Kibale Forest National Park",
      "Chimpanzee Trek and Community Tour",
      "Drive to Queen Elizabeth NP - Evening Game Drive",
      "Morning Game Drive and Boat Ride on Kazinga Channel",
      "Drive to Ishasha - Tree-Climbing Lions",
      "Drive to Bwindi Impenetrable National Park",
      "Gorilla Trekking in Bwindi",
      "Drive to Lake Bunyonyi - Canoeing",
      "Drive to Lake Mburo NP - Evening Game Drive",
      "Mountain Bike Safari and Swimming in Lake Mburo",
      "Return to Kampala/Entebbe",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Kampala/Entebbe - Boda Tour",
        description:
          "Thrilling Boda Boda city tour of Kampala covering landmarks, markets, and cultural sites.",
      },
      {
        day: 2,
        title: "Drive to Jinja - Zip Lining",
        description:
          "Transfer to Jinja and spend the afternoon zip lining in lush forests.",
      },
      {
        day: 3,
        title: "White Water Rafting in Jinja",
        description:
          "Full-day white-water rafting on the Nile with professional river team.",
      },
      {
        day: 4,
        title: "Drive to Sipi Falls",
        description: "Scenic transfer to Sipi Falls region and overnight.",
      },
      {
        day: 5,
        title: "Hiking in Sipi Falls",
        description:
          "Guided hike to the three waterfalls and valley viewpoints.",
      },
      {
        day: 6,
        title: "Drive to Moroto",
        description:
          "Enter Karamoja region; rugged landscapes and cultural immersion.",
      },
      {
        day: 7,
        title: "Mountain Biking / Karamoja Cultural Tour",
        description:
          "Choose mountain biking or a cultural tour learning Karamojong traditions.",
      },
      {
        day: 8,
        title: "Drive to Kidepo Valley - Evening Game Drive",
        description: "Transfer to Kidepo NP; evening game drive for big game.",
      },
      {
        day: 9,
        title: "Morning Game Drive in Kidepo",
        description:
          "Dawn game drive across dramatic savannahs and rocky outcrops.",
      },
      {
        day: 10,
        title: "Drive to Murchison Falls - Evening Game Drive",
        description: "Long drive to Murchison; sunset wildlife viewing.",
      },
      {
        day: 11,
        title: "Morning Game Drive and Boat Ride",
        description:
          "AM game drive; PM boat cruise to the base of Murchison Falls.",
      },
      {
        day: 12,
        title: "Drive to Kibale Forest National Park",
        description: "Transfer to Kibale’s rainforest region.",
      },
      {
        day: 13,
        title: "Chimpanzee Trek and Community Tour",
        description:
          "Chimp trek in Kibale; optional community/cultural experience.",
      },
      {
        day: 14,
        title: "Drive to Queen Elizabeth NP - Evening Game Drive",
        description: "Transfer and evening game drive in the Kasenyi plains.",
      },
      {
        day: 15,
        title: "Morning Game Drive and Boat Ride on Kazinga Channel",
        description: "AM game drive; afternoon Kazinga Channel launch cruise.",
      },
      {
        day: 16,
        title: "Drive to Ishasha - Tree-Climbing Lions",
        description: "Game drive in Ishasha to look for tree-climbing lions.",
      },
      {
        day: 17,
        title: "Drive to Bwindi Impenetrable National Park",
        description: "Scenic transfer to Bwindi. Evening at leisure.",
      },
      {
        day: 18,
        title: "Gorilla Trekking in Bwindi",
        description: "Gorilla trekking day with ranger guides.",
      },
      {
        day: 19,
        title: "Drive to Lake Bunyonyi - Canoeing",
        description:
          "Transfer to Lake Bunyonyi; afternoon canoeing on the islands.",
      },
      {
        day: 20,
        title: "Drive to Lake Mburo NP - Evening Game Drive",
        description: "Transfer to Lake Mburo; evening game drive.",
      },
      {
        day: 21,
        title: "Mountain Bike Safari and Swimming in Lake Mburo",
        description:
          "Guided mountain biking and optional swimming (where designated safe).",
      },
      {
        day: 22,
        title: "Return to Kampala/Entebbe",
        description: "Drive back for departure or extra nights.",
      },
    ],
    included: [
      "All road transfers in a 4x4 safari vehicle with professional driver/guide",
      "21 nights accommodation (lodges/camps) as per itinerary",
      "Meals as per itinerary",
      "All national park entrance fees on the route",
      "Zip lining (Jinja)",
      "Full-day white-water rafting (Jinja)",
      "Sipi Falls guided hike",
      "Karamoja cultural tour or mountain biking in Moroto (one included)",
      "Kidepo, Murchison, Queen Elizabeth, Ishasha & Lake Mburo game drives",
      "Boat cruises: Murchison (base of falls) and Kazinga Channel",
      "Chimpanzee trekking permit (Kibale)",
      "Gorilla trekking permit (Bwindi)",
      "Canoeing on Lake Bunyonyi",
      "Mountain biking in Lake Mburo (as stated)",
      "Bottled drinking water during drives",
    ],
    excluded: [
      "International flights",
      "Visa fees",
      "Travel/medical insurance",
      "Optional/additional adventure activities beyond those listed",
      "Alcoholic beverages and premium drinks",
      "Personal expenses (laundry, souvenirs, phone)",
      "Tips/gratuities for guides and lodge staff",
    ],
    minTravelers: 2,
    maxTravelers: 32,
    difficulty: "CHALLENGING",
    featured: true,
    active: true,
  },
  {
    id: 5,
    name: "6-Days Jinja Town & Sipi Falls",
    slug: "6-days-jinja-town-and-sipi-falls",
    category: "Adventure & Water Sports",
    duration: "6 Days",
    price: 1650,
    image: "/uganda-safari-landscape-team-adventure.jpg",
    images: [
      "/murchison-falls-national-park-uganda-waterfall.jpg",
      "/queen-elizabeth-national-park-tree-climbing-lions.jpg",
      "/bwindi-impenetrable-national-park-uganda-mountain-gorillas.jpg",
      "/lake-mburo-national-park-uganda-zebras-savannah.jpg",
    ],
    description:
      "Adrenaline and scenery: zip lining and rafting in Jinja, quad biking, and hiking the Sipi Falls.",
    highlights: [
      "Drive to Jinja via Mabira Forest - Zip Lining & Boat Cruise",
      "White Water Rafting on the Nile",
      "Quad Biking & Relaxation",
      "Drive to Sipi Falls",
      "Hiking the Sipi Falls",
      "Return to Kampala/Entebbe",
    ],
    itinerary: [
      {
        day: 1,
        title: "Drive to Jinja via Mabira Forest - Zip Lining & Boat Cruise",
        description:
          "Breakfast stop, zip lining in Mabira, continue to Jinja, check-in, and boat cruise to the Source of the Nile.",
      },
      {
        day: 2,
        title: "White Water Rafting on the Nile",
        description:
          "Full-day rafting with lunch break; evening dinner in Jinja.",
      },
      {
        day: 3,
        title: "Quad Biking & Relaxation",
        description: "Half-day quad biking; afternoon at leisure by the pool.",
      },
      {
        day: 4,
        title: "Drive to Sipi Falls",
        description:
          "Transfer to Sipi Falls with lunch en route. Dinner at the lodge.",
      },
      {
        day: 5,
        title: "Hiking the Sipi Falls",
        description:
          "Guided hike to the three Sipi waterfalls; optional local coffee stop.",
      },
      {
        day: 6,
        title: "Return to Kampala/Entebbe",
        description:
          "Drive back with lunch on the way. Drop-off at hotel/airport.",
      },
    ],
    included: [
      "4x4 transport with professional driver/guide",
      "5 nights accommodation (Jinja & Sipi)",
      "Meals as per itinerary",
      "Mabira Forest zip lining",
      "Boat cruise to the Source of the Nile",
      "Full-day white-water rafting (safety gear included)",
      "Quad biking (half-day) with safety gear",
      "Sipi Falls guided hike",
      "Bottled water during activities/transfers",
    ],
    excluded: [
      "International flights",
      "Visa fees",
      "Travel insurance",
      "Personal expenses (laundry, souvenirs)",
      "Alcoholic beverages and soft drinks not mentioned",
      "Optional add-ons (e.g., bungee, kayaking, coffee tour if not included)",
      "Tips/gratuities",
    ],
    minTravelers: 2,
    maxTravelers: 32,
    difficulty: "CHALLENGING",
    featured: true,
    active: true,
  },
  {
    id: 6,
    name: "12-Days North-West Uganda",
    slug: "12-days-north-west-uganda",
    category: "Wildlife & Primate Safari",
    duration: "12 Days",
    price: 3950,
    image: "/uganda-safari-landscape-team-adventure.jpg",
    images: [
      "/murchison-falls-national-park-uganda-waterfall.jpg",
      "/queen-elizabeth-national-park-tree-climbing-lions.jpg",
      "/bwindi-impenetrable-national-park-uganda-mountain-gorillas.jpg",
      "/lake-mburo-national-park-uganda-zebras-savannah.jpg",
    ],
    description:
      "Rhinos, roaring falls, chimps, gorillas, and classic savannahs across Uganda’s North and West.",
    highlights: [
      "Arrival at Entebbe Airport",
      "Ziwa Rhino Sanctuary & Murchison Falls",
      "Murchison Falls - Game Drive & Boat Ride",
      "Drive to Kibale Forest",
      "Chimpanzee Trekking & Bigodi Swamp Walk",
      "Drive to Queen Elizabeth NP",
      "Game Drive & Kazinga Channel Boat Ride",
      "Ishasha Sector & Transfer to Bwindi",
      "Gorilla Trekking in Bwindi",
      "Drive to Lake Mburo NP",
      "Nature Walk & Boat Ride",
      "Return to Kampala/Entebbe",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival at Entebbe Airport",
        description: "Meet and greet, transfer to hotel in Entebbe/Kampala.",
      },
      {
        day: 2,
        title: "Ziwa Rhino Sanctuary & Murchison Falls",
        description:
          "Drive north with a stop for rhino tracking at Ziwa; proceed to Murchison.",
      },
      {
        day: 3,
        title: "Murchison Falls - Game Drive & Boat Ride",
        description:
          "Morning game drive; afternoon boat to the base of the falls (optional hike to top).",
      },
      {
        day: 4,
        title: "Drive to Kibale Forest",
        description: "Scenic transfer via tea country to Kibale.",
      },
      {
        day: 5,
        title: "Chimpanzee Trekking & Bigodi Swamp Walk",
        description:
          "Chimp trek in Kibale; guided Bigodi wetlands walk in the afternoon.",
      },
      {
        day: 6,
        title: "Drive to Queen Elizabeth NP",
        description: "Transfer via the equator and evening game drive.",
      },
      {
        day: 7,
        title: "Game Drive & Kazinga Channel Boat Ride",
        description:
          "Morning game drive; afternoon launch cruise on Kazinga Channel.",
      },
      {
        day: 8,
        title: "Ishasha Sector & Transfer to Bwindi",
        description:
          "Game drive through Ishasha to spot tree-climbing lions; continue to Bwindi.",
      },
      {
        day: 9,
        title: "Gorilla Trekking in Bwindi",
        description: "Gorilla trekking with ranger guides; evening at leisure.",
      },
      {
        day: 10,
        title: "Drive to Lake Mburo NP",
        description: "Transfer to Lake Mburo; evening game drive.",
      },
      {
        day: 11,
        title: "Nature Walk & Boat Ride",
        description:
          "Guided nature walk and afternoon boat cruise on Lake Mburo.",
      },
      {
        day: 12,
        title: "Return to Kampala/Entebbe",
        description: "Drive back with lunch and photo stop at the equator.",
      },
    ],
    included: [
      "4x4 safari vehicle, fuel, and professional driver/guide",
      "11 nights accommodation (lodges/camps)",
      "Meals as per itinerary",
      "All park entrance fees",
      "Ziwa Rhino tracking fee",
      "Game drives (Murchison, QENP, Ishasha, Lake Mburo)",
      "Boat cruises (Murchison base of falls, Kazinga Channel, Lake Mburo)",
      "Chimpanzee trekking permit (Kibale)",
      "Gorilla trekking permit (Bwindi)",
      "Bottled drinking water during road days",
    ],
    excluded: [
      "International flights",
      "Visa fees",
      "Travel insurance",
      "Optional activities (e.g., hike to top of falls if charged separately)",
      "Alcoholic drinks and premium beverages",
      "Personal expenses (laundry, souvenirs)",
      "Tips/gratuities",
    ],
    minTravelers: 2,
    maxTravelers: 32,
    difficulty: "MODERATE",
    featured: true,
    active: true,
  },
  {
    id: 7,
    name: "10-Days Mountain Rwenzori Expedition",
    slug: "10-days-mountain-rwenzori",
    category: "Hiking & Mountains",
    duration: "10 Days",
    price: 1950,
    image: "/uganda-safari-landscape-team-adventure.jpg",
    images: [
      "/murchison-falls-national-park-uganda-waterfall.jpg",
      "/queen-elizabeth-national-park-tree-climbing-lions.jpg",
      "/bwindi-impenetrable-national-park-uganda-mountain-gorillas.jpg",
      "/lake-mburo-national-park-uganda-zebras-savannah.jpg",
    ],
    description:
      "The classic 7-day Rwenzori Central Circuit inside a 10-day expedition—alpine bogs, glaciers, and cloud forests.",
    highlights: [
      "Arrival in Entebbe",
      "Drive to Kasese - Rwenzori Base",
      "Hiking Day 1 - Nyabitaba Hut",
      "Hiking Day 2 - John Matte Hut",
      "Hiking Day 3 - Bujuku Hut",
      "Hiking Day 4 - Kitandara Hut",
      "Hiking Day 5 - Guy Yeoman Hut",
      "Hiking Day 6 - Nyabitaba Hut",
      "Descend to Nyakalengija",
      "Return to Entebbe",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Entebbe",
        description: "Airport pick-up; transfer to Kampala.",
      },
      {
        day: 2,
        title: "Drive to Kasese - Rwenzori Base",
        description: "Transfer to Kasese; gear check and rentals as needed.",
      },
      {
        day: 3,
        title: "Hiking Day 1 - Nyabitaba Hut",
        description:
          "Start at Nyakalengija to Nyabitaba (2,652m) via Mobuku & Mahoma rivers.",
      },
      {
        day: 4,
        title: "Hiking Day 2 - John Matte Hut",
        description:
          "Bamboo zone to John Matte (3,414m); views of Stanley range.",
      },
      {
        day: 5,
        title: "Hiking Day 3 - Bujuku Hut",
        description: "Lower/upper Bigo bogs to Bujuku (3,962m).",
      },
      {
        day: 6,
        title: "Hiking Day 4 - Kitandara Hut",
        description: "Over Scott Elliot Pass (4,372m) to Kitandara (4,023m).",
      },
      {
        day: 7,
        title: "Hiking Day 5 - Guy Yeoman Hut",
        description: "Freshfield Pass descent to Guy Yeoman (3,261m).",
      },
      {
        day: 8,
        title: "Hiking Day 6 - Nyabitaba Hut",
        description: "Traverse valley back to Nyabitaba.",
      },
      {
        day: 9,
        title: "Descend to Nyakalengija",
        description: "Finish trek; transfer to hotel in Kasese.",
      },
      {
        day: 10,
        title: "Return to Entebbe",
        description: "Drive back to Entebbe; optional shopping stop.",
      },
    ],
    included: [
      "Airport transfers",
      "Transfers to/from Rwenzori gate (4x4 where needed)",
      "Professional mountain guide(s) and porters",
      "All park/route entry and camping/hut fees",
      "9 nights accommodation (lodges + mountain huts)",
      "Meals during the trek (trail meals) and as per itinerary in towns",
      "Basic camping equipment (hut mattresses; shared kitchen gear)",
      "Bottled water and/or treated water on trek",
    ],
    excluded: [
      "International flights",
      "Visa and travel insurance (highly recommended for trekking)",
      "Personal technical gear rental (boots, down jacket, sleeping bag, crampons if required)",
      "Hotel meals not specified and snacks/energy foods",
      "Alcoholic beverages",
      "Porter tips and mountain crew gratuities",
    ],
    minTravelers: 1,
    maxTravelers: 32,
    difficulty: "CHALLENGING",
    featured: true,
    active: true,
  },
  {
    id: 8,
    name: "3-Days Murchison Falls National Park",
    slug: "3-days-murchison-falls-national-park",
    category: "Wildlife Safari",
    duration: "3 Days",
    price: 500,
    image: "/uganda-safari-landscape-team-adventure.jpg",
    images: [
      "/murchison-falls-national-park-uganda-waterfall.jpg",
      "/queen-elizabeth-national-park-tree-climbing-lions.jpg",
      "/bwindi-impenetrable-national-park-uganda-mountain-gorillas.jpg",
      "/lake-mburo-national-park-uganda-zebras-savannah.jpg",
    ],
    description:
      "A short, action-packed break to Uganda’s largest park: rhinos, game drives, Nile boat cruise, and the thunder of Murchison Falls.",
    highlights: [
      "Kampala – Murchison Falls via Ziwa Rhino Sanctuary",
      "Morning Game Drive & Nile Boat Cruise",
      "Return to Kampala/Entebbe",
    ],
    itinerary: [
      {
        day: 1,
        title: "Kampala – Murchison Falls via Ziwa Rhino Sanctuary",
        description:
          "Pickup after breakfast; Ziwa Rhino tracking; continue to Murchison; lunch; evening game drive.",
      },
      {
        day: 2,
        title: "Morning Game Drive & Nile Boat Cruise",
        description:
          "Dawn game drive with packed breakfast; afternoon boat to base of falls; guided hike to the top.",
      },
      {
        day: 3,
        title: "Return to Kampala/Entebbe",
        description:
          "Breakfast and drive back to Kampala/Entebbe with lunch en route.",
      },
    ],
    included: [
      "Transport in 4x4 safari vehicle with driver/guide",
      "2 nights accommodation in/near Murchison",
      "Meals as per itinerary",
      "Park entrance fees (Murchison Falls NP)",
      "Ziwa Rhino Sanctuary tracking",
      "Game drives and boat cruise to base of falls",
      "Guided hike to top of falls (where permitted)",
      "Bottled water during transfers/game drives",
    ],
    excluded: [
      "International flights",
      "Uganda visa fees",
      "Travel insurance",
      "Alcoholic drinks and soft drinks not mentioned",
      "Personal expenses (laundry, souvenirs)",
      "Tips/gratuities",
      "Optional activities not listed",
    ],
    minTravelers: 2,
    maxTravelers: 32,
    difficulty: "EASY",
    featured: true,
    active: true,
  },
  {
    id: 9,
    name: "5-Days of Chimps & Queen Elizabeth",
    slug: "5-days-chimps-and-queen-elizabeth",
    category: "Primate & Wildlife Safari",
    duration: "5 Days",
    price: 1300,
    image: "/uganda-safari-landscape-team-adventure.jpg",
    images: [
      "/murchison-falls-national-park-uganda-waterfall.jpg",
      "/queen-elizabeth-national-park-tree-climbing-lions.jpg",
      "/bwindi-impenetrable-national-park-uganda-mountain-gorillas.jpg",
      "/lake-mburo-national-park-uganda-zebras-savannah.jpg",
    ],
    description:
      "Kibale’s chimpanzees and Queen Elizabeth’s big game, crowned with the Kazinga Channel cruise.",
    highlights: [
      "Drive to Kibale Forest National Park",
      "Chimpanzee Trekking & Bigodi Swamp Walk",
      "Drive to Queen Elizabeth National Park",
      "Game Drive & Kazinga Channel Boat Cruise",
      "Return to Kampala/Entebbe",
    ],
    itinerary: [
      {
        day: 1,
        title: "Drive to Kibale Forest National Park",
        description: "Depart via tea estates to Kibale; check in and relax.",
      },
      {
        day: 2,
        title: "Chimpanzee Trekking & Bigodi Swamp Walk",
        description:
          "Morning chimp trek; afternoon guided Bigodi wetland walk.",
      },
      {
        day: 3,
        title: "Drive to Queen Elizabeth National Park",
        description: "Transfer via the equator; evening game drive.",
      },
      {
        day: 4,
        title: "Game Drive & Kazinga Channel Boat Cruise",
        description:
          "Early game drive; afternoon boat cruise along Kazinga Channel.",
      },
      {
        day: 5,
        title: "Return to Kampala/Entebbe",
        description: "Drive back with lunch stop at the equator.",
      },
    ],
    included: [
      "Transport in 4x4 safari vehicle with driver/guide",
      "4 nights accommodation (Kibale & QENP)",
      "Meals as per itinerary",
      "Kibale NP chimp trekking permit",
      "Bigodi Wetland Sanctuary guided walk",
      "Queen Elizabeth NP entrance fees",
      "Game drives and Kazinga Channel boat cruise",
      "Bottled water during transfers/game drives",
    ],
    excluded: [
      "International flights",
      "Uganda visa fees",
      "Travel insurance",
      "Optional activities not listed",
      "Alcoholic beverages",
      "Personal expenses (laundry, souvenirs)",
      "Tips/gratuities",
    ],
    minTravelers: 2,
    maxTravelers: 32,
    difficulty: "MODERATE",
    featured: true,
    popular: true,
    active: true,
  },
  {
    id: 10,
    name: "6-Days Luxury Tour",
    slug: "6-days-luxury-tour",
    category: "Luxury Safari",
    duration: "6 Days",
    price: 2160,
    image: "/uganda-safari-landscape-team-adventure.jpg",
    images: [
      "/murchison-falls-national-park-uganda-waterfall.jpg",
      "/queen-elizabeth-national-park-tree-climbing-lions.jpg",
      "/bwindi-impenetrable-national-park-uganda-mountain-gorillas.jpg",
      "/lake-mburo-national-park-uganda-zebras-savannah.jpg",
    ],
    description:
      "A chic loop through Bunyonyi, Bwindi, Lake Mutanda, and Lake Mburo—canoes, gorillas, and golden hours.",
    highlights: [
      "Drive to Lake Bunyonyi",
      "Canoeing on Lake Bunyonyi",
      "Drive to Bwindi Impenetrable Forest",
      "Gorilla Trekking & Transfer to Lake Mutanda",
      "Drive to Lake Mburo National Park",
      "Return to Kampala/Entebbe",
    ],
    itinerary: [
      {
        day: 1,
        title: "Drive to Lake Bunyonyi",
        description:
          "Breakfast at the Equator; lunch en route; lakeside dinner and overnight.",
      },
      {
        day: 2,
        title: "Canoeing on Lake Bunyonyi",
        description: "Guided canoeing among the islands; lakeside leisure.",
      },
      {
        day: 3,
        title: "Drive to Bwindi Impenetrable Forest",
        description:
          "Transfer to Bwindi; lunch at the lodge; evening at leisure.",
      },
      {
        day: 4,
        title: "Gorilla Trekking & Transfer to Lake Mutanda",
        description:
          "Gorilla trek (1 hour with a habituated group). Drive to Lake Mutanda for overnight.",
      },
      {
        day: 5,
        title: "Drive to Lake Mburo National Park",
        description: "Transfer to Lake Mburo; lunch; evening game drive.",
      },
      {
        day: 6,
        title: "Return to Kampala/Entebbe",
        description: "Drive back with Equator lunch/photo stop.",
      },
    ],
    included: [
      "Luxury lodges/hotels (5 nights)",
      "4x4 transport with English-speaking driver/guide",
      "Meals as per itinerary",
      "Gorilla trekking permit (Bwindi)",
      "Guided canoeing on Lake Bunyonyi",
      "Lake Mburo NP entrance fees and game drive",
      "All transfers on the route",
      "Bottled water during transfers",
    ],
    excluded: [
      "International flights",
      "Visa fees",
      "Travel insurance",
      "Optional activities not listed",
      "Alcohol and premium beverages",
      "Personal expenses (laundry, souvenirs)",
      "Tips/gratuities",
    ],
    minTravelers: 2,
    maxTravelers: 32,
    difficulty: "MODERATE",
    featured: true,
    popular: true,
    active: true,
  },
  {
    id: 11,
    name: "12-Days North-East Uganda",
    slug: "12-days-north-east-uganda",
    category: "Cultural & Adventure Safari",
    duration: "12 Days",
    price: 3350,
    image: "/uganda-safari-landscape-team-adventure.jpg",
    images: [
      "/murchison-falls-national-park-uganda-waterfall.jpg",
      "/queen-elizabeth-national-park-tree-climbing-lions.jpg",
      "/bwindi-impenetrable-national-park-uganda-mountain-gorillas.jpg",
      "/lake-mburo-national-park-uganda-zebras-savannah.jpg",
    ],
    description:
      "Rhinos to Kidepo’s wilderness, Karamoja culture, Sipi’s waterfalls, then cap it off with Nile rafting and Mabira zip lines.",
    highlights: [
      "Drive to Ziwa Rhino Sanctuary & Murchison Falls",
      "Murchison Falls Game Drive & Boat Cruise",
      "Drive to Kidepo Valley National Park",
      "Kidepo Morning & Evening Game Drives",
      "Drive to Moroto – Karamoja Cultural Experience",
      "Mountain Biking / Hiking in Karamoja",
      "Drive to Sipi Falls",
      "Hiking & Coffee Tour at Sipi Falls",
      "Drive to Jinja",
      "Full-Day White Water Rafting on the Nile",
      "Mabira Forest Zip Lining",
      "Return to Kampala/Entebbe",
    ],
    itinerary: [
      {
        day: 1,
        title: "Drive to Ziwa Rhino Sanctuary & Murchison Falls",
        description:
          "Rhino trekking at Ziwa; continue to Murchison; evening game drive.",
      },
      {
        day: 2,
        title: "Murchison Falls Game Drive & Boat Cruise",
        description:
          "Morning game drive; afternoon boat cruise to base of falls.",
      },
      {
        day: 3,
        title: "Drive to Kidepo Valley National Park",
        description: "Long scenic transfer to Kidepo; dinner and overnight.",
      },
      {
        day: 4,
        title: "Kidepo Morning & Evening Game Drives",
        description: "Full day wildlife viewing in Kidepo’s Narus/Apoka areas.",
      },
      {
        day: 5,
        title: "Drive to Moroto – Karamoja Cultural Experience",
        description: "Transfer to Moroto; afternoon Karamojong village visit.",
      },
      {
        day: 6,
        title: "Mountain Biking / Hiking in Karamoja",
        description:
          "Half-day mountain biking through villages or hike Mount Moroto.",
      },
      {
        day: 7,
        title: "Drive to Sipi Falls",
        description:
          "Transfer to Sipi with lunch en route; dinner at the lodge.",
      },
      {
        day: 8,
        title: "Hiking & Coffee Tour at Sipi Falls",
        description: "Guided waterfalls hike and local coffee experience.",
      },
      {
        day: 9,
        title: "Drive to Jinja",
        description: "Transfer to Jinja; dinner and overnight.",
      },
      {
        day: 10,
        title: "Full-Day White Water Rafting on the Nile",
        description: "Professional rafting on the Nile with lunch mid-day.",
      },
      {
        day: 11,
        title: "Mabira Forest Zip Lining",
        description:
          "Breakfast and zip lining in Mabira; overnight near Kampala.",
      },
      {
        day: 12,
        title: "Return to Kampala/Entebbe",
        description: "Drive back and drop-off at hotel or airport.",
      },
    ],
    included: [
      "4x4 transport with professional driver/guide",
      "11 nights accommodation (lodges/camps/guesthouses)",
      "Meals as per itinerary",
      "All park entrance fees (Murchison & Kidepo)",
      "Ziwa Rhino tracking fee",
      "Game drives in Murchison and Kidepo",
      "Boat cruise to base of Murchison Falls",
      "Karamoja cultural village visit",
      "Half-day mountain biking or guided hike in Karamoja (one included)",
      "Sipi Falls guided hike and coffee tour",
      "Full-day white-water rafting in Jinja (safety gear included)",
      "Mabira Forest zip lining",
      "Bottled drinking water during road days",
    ],
    excluded: [
      "International flights",
      "Visa and travel insurance",
      "Optional activities/add-ons beyond those listed",
      "Alcoholic beverages and premium drinks",
      "Personal expenses (laundry, souvenirs)",
      "Tips/gratuities",
    ],
    minTravelers: 2,
    maxTravelers: 32,
    difficulty: "CHALLENGING",
    featured: true,
    active: true,
  },
];
