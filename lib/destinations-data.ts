export interface Destination {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  country: string;
  description: string;
  duration: string;
  groupSize: number;
  minTravelers?: number;
  maxTravelers?: number;
}

export const allDestinations: Destination[] = [
  {
    id: 1,
    name: "Bwindi Forest",
    category: "Gorilla Trekking",
    price: 1450.84,
    rating: 5,
    image: "/bwindi-impenetrable-forest-mountain-gorillas.jpg",
    country: "Uganda",
    description:
      "Home to nearly half of the world's remaining mountain gorillas, Bwindi Impenetrable Forest offers an unforgettable gorilla trekking experience in ancient rainforest.",
    duration: "3 Days",
    groupSize: 8,
    minTravelers: 1,
    maxTravelers: 8,
  },
  {
    id: 2,
    name: "Murchison Falls",
    category: "National Park",
    price: 897.31,
    rating: 5,
    image: "/murchison-falls-national-park-uganda-waterfall.jpg",
    country: "Uganda",
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
    description:
      "The adventure capital of East Africa at the source of the Nile, offering world-class white water rafting, bungee jumping, kayaking, and stunning river views.",
    duration: "3 Days",
    groupSize: 15,
    minTravelers: 1,
    maxTravelers: 20,
  },
  {
    id: 6,
    name: "Lake Mburo",
    category: "National Park",
    price: 450.84,
    rating: 4,
    image: "/lake-mburo-national-park-uganda-zebras-savannah.jpg",
    country: "Uganda",
    description:
      "The smallest of Uganda's savannah national parks, Lake Mburo is home to zebras, impalas, and over 350 bird species in a stunning lakeside setting.",
    duration: "2 Days",
    groupSize: 8,
    minTravelers: 2,
    maxTravelers: 10,
  },
  {
    id: 7,
    name: "Kibale Forest",
    category: "Gorilla Trekking",
    price: 890.0,
    rating: 5,
    image: "/kibale-forest-chimpanzee-tracking-uganda.jpg",
    country: "Uganda",
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
    description:
      "The legendary Mountains of the Moon, offering challenging treks through unique afro-alpine vegetation to snow-capped peaks and glaciers at the equator.",
    duration: "7 Days",
    groupSize: 6,
    minTravelers: 2,
    maxTravelers: 8,
  },
];
