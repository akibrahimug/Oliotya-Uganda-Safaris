export interface Destination {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  images?: string[];
  country: string;
  shortDesc: string; // Short description for cards
  description: string; // Full description for detail page
  duration: string;
  groupSize: number;
  minTravelers?: number;
  maxTravelers?: number;
}

// Complete destinations with full data
export const allDestinations: Destination[] = [
  {
    id: 6,
    name: "Lake Mburo National Park",
    category: "National Park",
    price: 450.84,
    rating: 5,
    image: "/lake-mburo-national-park-uganda-zebras-savannah.jpg",
    country: "Uganda",
    shortDesc:
      "A charming savannah park in Western Uganda, home to 350 bird species and diverse wildlife including zebras, impalas, and the magnificent Ankole cattle.",
    description:
      "A small but charming Savannah national park located in Western Uganda, approximately 30 kilometers east of Mbarara and 240 kilometers west of Kampala. Despite its small size, LMNP is home to a wide variety of wildlife, including 350 bird species and species such as zebra, impala, eland, buffalo, oribi, defassa waterbuck, leopard, hippo, hyena, and reedbuck. Once part of the continuous plains of Northern Tanzania, Lake Mburo National Park hosts a diversity of species that cannot be found anywhere else in Uganda. The park is fed by the Ruizi River, which supports 14 lakes and wetlands that provide abundant grazing for herds of antelope. The enchanting Acacia woodland is an increasingly important part of the park's landscape. The park is also home to the magnificent Ankole cattle, traditionally carried by the Bahima pastoralists, which graze peacefully alongside the wildlife, creating a unique blend of pastoral and wildlife landscapes. Accommodation options include: Mihingo Safari Lodge, Rwakobo Rock, Mburo Safari Lodge, Kimbala, Arcadia Cottages, Leopard Rest Camp, and Mburo Eagles Nest.",
    duration: "2-3 Days",
    groupSize: 8,
    minTravelers: 2,
    maxTravelers: 10,
  },
  {
    id: 10,
    name: "Mount Elgon National Park",
    category: "Mountain Trekking",
    price: 850.0,
    rating: 5,
    image: "/sipi-falls-uganda-waterfalls-mount-elgon.jpg",
    country: "Uganda",
    shortDesc:
      "Home to the world's largest volcanic base and spectacular Sipi Falls. Trek to the 4,321m Wagagai Peak and explore caves where elephants mine salt.",
    description:
      "Located on the Uganda-Kenya border, Mt Elgon boasts the largest volcanic base in the world, covering an area of 4,000 km². As the oldest and largest solitary volcanic mountain in East Africa, its vast form stretches 60km in diameter, rising over 3,000 meters above the surrounding plains. The cool heights of the mountain provide a respite from the hot plains below, offering a refuge for flora and fauna at higher altitudes. Within the Mount Elgon National Park, there are over 300 species of birds, including the endangered Lammergeyer, as well as some antelopes, forest monkeys, elephants, and buffalos that call the mountainside home. The higher slopes are protected by national parks in Uganda and Kenya, creating an extensive transboundary conservation area that has been declared a UNESCO Man and Biosphere Reserve. Accommodation options include: Masai Backpackers (Kapkwai Village), The Crow's Nest (Sipi Falls), Twilight Sipi, and Camseil (Kapckwa).",
    duration: "4-6 Days",
    groupSize: 10,
    minTravelers: 2,
    maxTravelers: 12,
  },
  {
    id: 9,
    name: "Rwenzori Mountains National Park",
    category: "Mountain Trekking",
    price: 1650.0,
    rating: 5,
    image: "/rwenzori-mountains-uganda-snow-peaks.jpg",
    country: "Uganda",
    shortDesc:
      "The legendary Mountains of the Moon with Africa's third-highest peak. Trek through fairy-tale landscapes of giant lobelias and snow-capped peaks.",
    description:
      "The Rwenzori Mountains, also known as the fabled Mountains of the Moon, are located on the border between Western Uganda and Congo. The mountain range boasts equatorial snow peaks, including the third-highest point in Africa at 5,109m (Margherita Peak), while the lower slopes are covered in moorland, bamboo, and lush montane forest. Huge tree heathers and colorful mosses drape across the mountainside, while giant lobelias and everlasting flowers create an enchanting, fairy tale scene. Rwenzori Mountains National Park protects the highest parts of the 120km long and 65km-wide Rwenzori mountain range. The national park is home to 70 mammal species and 217 bird species, including 19 Albertine Rift endemics, as well as some of the rarest vegetation in the world. The Rwenzoris are a world-class hiking and mountaineering destination. A nine to twelve-day trek will take skilled climbers to the summit of Margherita, the highest peak, though shorter, non-technical treks are possible to scale the surrounding peaks. Accommodation options include: Camp Norway and Ruboni Community Campsite.",
    duration: "7-12 Days",
    groupSize: 6,
    minTravelers: 2,
    maxTravelers: 8,
  },
];

// Placeholder destinations - to be updated with complete information
export const placeholderDestinations: Destination[] = [
  {
    id: 1,
    name: "12 Days North - West Uganda",
    category: "Gorilla Trekking",
    price: 3950,
    rating: 5,
    image: "/bwindi-impenetrable-forest-mountain-gorillas.jpg",
    images: [
      "/bwindi-impenetrable-forest-mountain-gorillas.jpg",
      "/uganda-mountain-gorillas-bwindi-forest.jpg",
      "/uganda-queen-elizabeth-national-park-safari.jpg",
      "/uganda-murchison-falls-waterfall.jpg",
      "/uganda-lake-victoria-sunset.jpg",
      "/uganda-rwenzori-mountains-snow.jpg",
    ],
    country: "Uganda",
    shortDesc:
      "Home to nearly half of the world's remaining mountain gorillas, Bwindi Impenetrable Forest offers an unforgettable gorilla trekking experience in ancient rainforest.",
    description:
      "Home to nearly half of the world's remaining mountain gorillas, Bwindi Impenetrable Forest offers an unforgettable gorilla trekking experience in ancient rainforest.",
    duration: "12 Days",
    groupSize: 20,
    minTravelers: 4,
    maxTravelers: 20,
  },
  {
    id: 2,
    name: "Murchison Falls",
    category: "National Park",
    price: 897.31,
    rating: 5,
    image: "/murchison-falls-national-park-uganda-waterfall.jpg",
    country: "Uganda",
    shortDesc:
      "Uganda's largest national park, where the Nile explodes through a narrow gorge creating the world's most powerful waterfall. Home to lions, elephants, and hippos.",
    description:
      "Uganda's largest national park, where the Nile explodes through a narrow gorge creating the world's most powerful waterfall. Home to lions, elephants, and hippos.",
    duration: "4 Days",
    groupSize: 12,
    minTravelers: 2,
    maxTravelers: 15,
  },
  {
    id: 3,
    name: "Kampala",
    category: "Cultural Center",
    price: 450.0,
    rating: 4,
    image: "/kampala-city-uganda-skyline-sunset.jpg",
    country: "Uganda",
    shortDesc:
      "Uganda's vibrant capital city, offering rich cultural experiences, historical sites, bustling markets, and a thriving arts scene on the shores of Lake Victoria.",
    description:
      "Uganda's vibrant capital city, offering rich cultural experiences, historical sites, bustling markets, and a thriving arts scene on the shores of Lake Victoria.",
    duration: "2 Days",
    groupSize: 10,
    minTravelers: 1,
    maxTravelers: 20,
  },
  {
    id: 4,
    name: "Queen Elizabeth",
    category: "Wildlife Safari",
    price: 1203.0,
    rating: 5,
    image: "/queen-elizabeth-national-park-tree-climbing-lions.jpg",
    country: "Uganda",
    shortDesc:
      "Famous for its tree-climbing lions and diverse ecosystems, this park offers boat safaris on the Kazinga Channel with abundant hippos, crocodiles, and birdlife.",
    description:
      "Famous for its tree-climbing lions and diverse ecosystems, this park offers boat safaris on the Kazinga Channel with abundant hippos, crocodiles, and birdlife.",
    duration: "5 Days",
    groupSize: 10,
    minTravelers: 2,
    maxTravelers: 12,
  },
  {
    id: 5,
    name: "Jinja",
    category: "Adventure Sports",
    price: 675.5,
    rating: 5,
    image: "/jinja-source-of-nile-white-water-rafting.jpg",
    country: "Uganda",
    shortDesc:
      "The adventure capital of East Africa at the source of the Nile, offering world-class white water rafting, bungee jumping, kayaking, and stunning river views.",
    description:
      "The adventure capital of East Africa at the source of the Nile, offering world-class white water rafting, bungee jumping, kayaking, and stunning river views.",
    duration: "3 Days",
    groupSize: 15,
    minTravelers: 1,
    maxTravelers: 20,
  },
  {
    id: 7,
    name: "Kibale Forest",
    category: "Gorilla Trekking",
    price: 890.0,
    rating: 5,
    image: "/kibale-forest-chimpanzee-tracking-uganda.jpg",
    country: "Uganda",
    shortDesc:
      "Known as the primate capital of the world, Kibale Forest is home to 13 primate species including habituated chimpanzees for unforgettable tracking experiences.",
    description:
      "Known as the primate capital of the world, Kibale Forest is home to 13 primate species including habituated chimpanzees for unforgettable tracking experiences.",
    duration: "3 Days",
    groupSize: 6,
    minTravelers: 1,
    maxTravelers: 8,
  },
  {
    id: 8,
    name: "Sipi Falls",
    category: "Adventure Sports",
    price: 320.5,
    rating: 4,
    image: "/sipi-falls-uganda-waterfalls-mount-elgon.jpg",
    country: "Uganda",
    shortDesc:
      "A series of three stunning waterfalls on the foothills of Mount Elgon, offering breathtaking views, coffee tours, and adventurous hiking trails.",
    description:
      "A series of three stunning waterfalls on the foothills of Mount Elgon, offering breathtaking views, coffee tours, and adventurous hiking trails.",
    duration: "2 Days",
    groupSize: 12,
    minTravelers: 1,
    maxTravelers: 15,
  },
  {
    id: 9,
    name: "Rwenzori Mountains",
    category: "Wildlife Safari",
    price: 1650.0,
    rating: 5,
    image: "/rwenzori-mountains-uganda-snow-peaks.jpg",
    country: "Uganda",
    shortDesc:
      "The legendary Mountains of the Moon, offering challenging treks through unique afro-alpine vegetation to snow-capped peaks and glaciers at the equator.",
    description:
      "The legendary Mountains of the Moon, offering challenging treks through unique afro-alpine vegetation to snow-capped peaks and glaciers at the equator.",
    duration: "7 Days",
    groupSize: 6,
    minTravelers: 2,
    maxTravelers: 8,
  },
];
