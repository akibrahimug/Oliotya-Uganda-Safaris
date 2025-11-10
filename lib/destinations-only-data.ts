export interface DestinationOnly {
  id: number;
  name: string;
  category: string;
  image: string;
  images?: string[];
  country: string;
  description: string;
  region: string;
  history?: {
    title: string;
    content: string[];
  };
  geography?: {
    description: string;
    climate: string;
  };
  wildlife?: {
    description: string;
    mammals: string[];
    birds: string[];
    flora: string[];
  };
  culture?: {
    description: string;
    experiences: string[];
  };
  bestTimeToVisit?: {
    description: string;
    drySeason: {
      title: string;
      description: string;
    };
    wetSeason: {
      title: string;
      description: string;
    };
  };
}

// Complete destinations with full data
export const allDestinationsOnly: DestinationOnly[] = [
  {
    id: 6,
    name: "Lake Mburo National Park",
    category: "National Park",
    image: "/lake-mburo-national-park-uganda-zebras-savannah.jpg",
    images: [
      "/lake-mburo-national-park-uganda-zebras-savannah.jpg",
    ],
    country: "Uganda",
    region: "Western Uganda",
    description:
      "A small but charming Savannah national park located in Western Uganda, approximately 30 kilometers east of Mbarara and 240 kilometers west of Kampala. Despite its small size, LMNP is home to a wide variety of wildlife, including 350 bird species and species such as zebra, impala, eland, buffalo, oribi, defassa waterbuck, leopard, hippo, hyena, and reedbuck. Once part of the continuous plains of Northern Tanzania, Lake Mburo National Park hosts a diversity of species that cannot be found anywhere else in Uganda. The park is fed by the Ruizi River, which supports 14 lakes and wetlands that provide abundant grazing for herds of antelope. The enchanting Acacia woodland is an increasingly important part of the park's landscape. The park is also home to the magnificent Ankole cattle, traditionally carried by the Bahima pastoralists, which graze peacefully alongside the wildlife, creating a unique blend of pastoral and wildlife landscapes. Accommodation options include: Mihingo Safari Lodge, Rwakobo Rock, Mburo Safari Lodge, Kimbala, Arcadia Cottages, Leopard Rest Camp, and Mburo Eagles Nest.",
    history: {
      title: "History & Background",
      content: [
        "Lake Mburo National Park was originally gazetted in 1933 as a controlled hunting area and upgraded to a game reserve in 1963. It was finally declared a national park in 1983 by the Uganda Wildlife Authority, the official government body responsible for the park's conservation and operations.",
        "Before becoming a protected area, the park was known as 'Karo Kurungi' (translated as 'beautiful land') by the Bahima pastoralists who roamed its plains and hills. When the park was gazetted in 1983, residents were evicted from the land with little consultation and no compensation, effectively disconnecting the Bahima from their homeland and pastoralist identity.",
        "The park faced several challenges throughout its history, with wildlife being nearly wiped out multiple times due to attempts to eliminate tsetse flies, conversion of land into ranches, and subsistence poaching. However, the state reopened the park and degazetted some of the land in 1986. Today, Lake Mburo National Park is unfenced and managed to include the values of the Banyankole culture as well as the protection of wildlife, creating a unique partnership in conservation."
      ]
    },
    geography: {
      description: "Lake Mburo National Park is located in Kiruhura District in the Western Region of Uganda, about 30 kilometers east of Mbarara and about 240 kilometers by road west of Kampala. The park covers approximately 260-370 square kilometers, making it Uganda's smallest savanna park. Wetlands cover 20% of the park's surface, forming part of a 50-kilometer-long wetland system connected by swamps. Together with 13 other lakes in the area, Lake Mburo forms part of this extensive wetland system, with five lakes lying within the park's borders. The landscape features diverse terrain including rolling hills, rocky outcrops, acacia woodland, and open savanna.",
      climate: "Lake Mburo National Park lies in a rain shadow between Lake Victoria and the Rwenzori Mountains, receiving an average of 800mm of rain yearly. The park experiences a mild climate with daily temperatures around 27°C/81°F and nightly temperatures of 14°C/57°F on average. The park has a bimodal rainfall pattern with long rains from March to June and short rains from September to December."
    },
    wildlife: {
      description: "Lake Mburo National Park is home to more than 68 mammal species and 315 bird species. The park holds Uganda's largest zebra population with over 5,000 zebras, and is the only park in Uganda where impala can be found. It is also one of only two places in Uganda where zebras can be easily seen.",
      mammals: [
        "Over 5,000 zebras - the largest zebra population in Uganda",
        "Impala (only location in Uganda), eland, and klipspringer",
        "Buffalo herds of up to 100 animals",
        "Eland - the largest savannah antelope in Africa",
        "Topi, waterbuck, oribi, reedbuck, and bush buck",
        "Leopard, hyena, jackal, and white-tailed mongoose",
        "About 300 hippos and numerous Nile crocodiles",
        "Warthogs, bush pigs, and genets",
        "Recently introduced giraffes from Murchison Falls National Park"
      ],
      birds: [
        "315 bird species including rare species",
        "Shoebill stork",
        "Papyrus yellow warbler and African fin foot",
        "Saddle-billed stork",
        "Brown-chested wattled plover",
        "Ground hornbill",
        "White-winged warbler"
      ],
      flora: [
        "Acacia woodland covering significant portions of the park",
        "Savanna grasslands supporting diverse herbivore populations",
        "Wetland vegetation around the 14 lakes and swamps",
        "Rocky hillside vegetation adapted to drier conditions"
      ]
    },
    culture: {
      description: "The Bahima pastoralists have a deep connection to Lake Mburo, calling it their 'Beautiful Land'. The Bahima community's identity is intertwined with the park and their Ankole cattle. Ankole cattle, a breed of Sanga long-horned cattle, are well-adapted to living on sparse forage and minimal water, providing meat and very rich milk. The Bahima believed they had been charged with the care of the Ankole and that their cattle's success depended on the land remaining beautiful – unfarmed, uncropped and unfenced. Today, the park has become a partner in the conservation of the Long Horned Ankole Cow, itself a threatened breed, and its ancient values, creating a cultural bridge between conservation and pastoralist traditions.",
      experiences: [
        "Community walks to visit the Bahima people and experience their traditional culture",
        "Tours to see Ankole cattle and opportunity to milk them",
        "Learn about traditional pastoralist practices and customs",
        "Experience the unique blend of wildlife conservation and cattle grazing",
        "Interact with local communities and support community-based tourism initiatives"
      ]
    },
    bestTimeToVisit: {
      description: "While Lake Mburo National Park can be visited year-round, different seasons offer unique experiences and optimal conditions for various activities.",
      drySeason: {
        title: "Dry Season (January-February & June-August)",
        description: "The dry seasons bring the best weather and are ideal for wildlife viewing. Animals congregate around water sources, making them easier to spot. The weather is comfortable and relatively cool for outdoor activities. Trails are drier and more accessible for game drives, walking safaris, and horseback riding. This is the most popular time to visit."
      },
      wetSeason: {
        title: "Wet Season (March-May & September-December)",
        description: "The wet seasons offer a different perspective as the valleys turn lush green and the air loses its dry-weather haziness. This is the best time for bird watching as migratory species arrive, and the landscape is at its most beautiful. The park is less crowded, offering a more intimate experience. The beginning of the rainy season in March or September is considered particularly rewarding by many visitors."
      }
    }
  },
  {
    id: 10,
    name: "Mount Elgon National Park",
    category: "National Park",
    image: "/sipi-falls-uganda-waterfalls-mount-elgon.jpg",
    images: [
      "/sipi-falls-uganda-waterfalls-mount-elgon.jpg",
      "/sipi-falls-uganda-waterfalls.jpg",
    ],
    country: "Uganda",
    region: "Eastern Uganda",
    description:
      "Located on the Uganda-Kenya border, Mt Elgon boasts the largest volcanic base in the world, covering an area of 4,000 km². As the oldest and largest solitary volcanic mountain in East Africa, its vast form stretches 60km in diameter, rising over 3,000 meters above the surrounding plains. The cool heights of the mountain provide a respite from the hot plains below, offering a refuge for flora and fauna at higher altitudes. Within the Mount Elgon National Park, there are over 300 species of birds, including the endangered Lammergeyer, as well as some antelopes, forest monkeys, elephants, and buffalos that call the mountainside home. The higher slopes are protected by national parks in Uganda and Kenya, creating an extensive transboundary conservation area that has been declared a UNESCO Man and Biosphere Reserve. Accommodation options include: Masai Backpackers (Kapkwai Village), The Crow's Nest (Sipi Falls), Twilight Sipi, and Camseil (Kapckwa).",
    history: {
      title: "History & Background",
      content: [
        "The Uganda Protectorate administration gazetted its side of Mount Elgon as a Forest Reserve in 1929. In 1940, the area became the Mount Elgon Crown Forest and in 1951 a Central Forest Reserve. The Ugandan part of the park was gazetted in 1992 and promoted to national park status in October 1993.",
        "Mount Elgon is an extinct shield volcano with its first eruption occurring around 24 million years ago. It now stands at 4,321m (Wagagai Peak), ranking it as the 4th highest peak in East Africa. The mountain has one of the largest intact volcanic calderas in the world, measuring 40km² in diameter.",
        "The cross-border park has been designated a UNESCO Man & Biosphere Reserve, recognizing its importance as a transboundary conservation area jointly managed by the Uganda Wildlife Authority (UWA) and Kenya Wildlife Service (KWS). This collaboration ensures the protection of the mountain's unique ecosystems and cultural heritage."
      ]
    },
    geography: {
      description: "Mount Elgon National Park lies 140 kilometres northeast of Lake Victoria. The Ugandan part of the park covers 1,110 km². The mountain stretches 60km in diameter with a massive volcanic base covering 4,000 km², making it the largest volcanic base in the world. The mountain features diverse terrain from tropical rainforest at lower elevations through bamboo zones to heath and moorland, culminating in the spectacular 40km² caldera at the summit. Mount Elgon is an important water catchment for the Nzoia River, which flows to Lake Victoria, and for the Turkwel River.",
      climate: "Mount Elgon's weather is moist to moderate dry, with annual rainfall of 1,270mm. The best time to visit is during the dry seasons between June to August and December to March, with June to August being particularly ideal. Average temperatures during these periods range from 15-25°C during the day and can drop to as low as 5°C at night, especially at higher elevations. Mornings are often sunny on the lower flanks, but the higher you climb, the chillier it gets. Rain gear and warm clothing are necessary year-round due to abrupt weather changes. Mount Elgon's mild climate and lower elevation present a low risk of altitude sickness, making it accessible for most hikers with reasonable fitness levels."
    },
    wildlife: {
      description: "Mount Elgon National Park supports over 300 bird species and diverse wildlife adapted to mountain habitats. The park is particularly renowned for its unique elephant population, the only one in the world known to venture deep into caves to mine salt from volcanic ash by gouging the walls with their tusks. The caves - Kitum, Chepnyali, and Mackingeny - have been partly formed by elephants and other mammals that frequently visit at night to lick the natural salt from the cave walls.",
      mammals: [
        "Elephants - known for unique cave salt-mining behavior",
        "Buffalo herds on the lower slopes",
        "Forest monkeys including black-and-white colobus and blue monkey",
        "Small antelope and duiker species",
        "Defassa waterbucks at lower altitudes",
        "Oribis, bushbucks, and various duiker species",
        "Leopards, civet, and serval cats",
        "Spotted hyenas throughout the park"
      ],
      birds: [
        "Over 300 bird species recorded",
        "Endangered Lammergeyer (bearded vulture)",
        "Jackson's francolin and Jackson's spurfowl",
        "Tacazze sunbird",
        "Eastern bronze-naped pigeon",
        "Hartlaub's turaco",
        "Many species with restricted ranges"
      ],
      flora: [
        "Tropical montane forest at lower elevations",
        "Bamboo zones in middle altitudes",
        "Afro-alpine moorland at higher elevations",
        "Unique vegetation zones supporting diverse ecosystems",
        "Giant groundsels and lobelias in alpine areas"
      ]
    },
    culture: {
      description: "Mount Elgon is home to four tribes: Bagisu, Sabiny, Sabaot, and Ndorobo. The Bagisu (Bamasaba) inhabit the western and southern slopes and consider Mount Elgon to be the embodiment of their founding Father Masaba, referring to the mountain by this name. The Sabiny (Sebei) people live on the northern and northwestern slopes. Both tribes have rich cultural traditions and have lived in harmony with the mountain for generations. While there have been historical tensions, the communities now live together peacefully in the serene Elgon mountains.",
      experiences: [
        "Witness the famous Imbalu circumcision ceremony of the Bagisu people held every two years in August",
        "Taste Malewa, the traditional cuisine of the Bagisu people",
        "Sebei cultural tours exploring traditional customs and practices",
        "Learn about the communities' traditional knowledge of mountain ecosystems",
        "Experience local hospitality in mountain villages like Kapkwai and Sipi",
        "Visit local markets and interact with mountain communities"
      ]
    },
    bestTimeToVisit: {
      description: "Mount Elgon National Park can be visited year-round, and mountain climbing can be done throughout the year. However, certain seasons offer optimal conditions for hiking and wildlife viewing.",
      drySeason: {
        title: "Dry Season (June-August & December-March)",
        description: "The best time to visit is during the dry seasons, with June to August being particularly ideal. During these periods, the weather is generally clear, making for better visibility and safer hiking conditions. Trails are more accessible and less muddy. Average temperatures range from 15-25°C during the day and can drop to as low as 5°C at night at higher elevations. These months are perfect for summit attempts to Wagagai Peak (4,321m) and exploring the vast 40km caldera."
      },
      wetSeason: {
        title: "Wet Season (March-May & September-November)",
        description: "The rainy season brings lush vegetation and is excellent for waterfall viewing, particularly the spectacular Sipi Falls. It gets extremely cold during this season, and snow and hailstorms are common at higher elevations. While more challenging for hiking, this period offers dramatic landscapes and fewer tourists. The waterfalls are at their most impressive. Even during wet months, experienced hikers can still summit with proper gear and preparation. Rain gear and warm clothing are essential."
      }
    }
  },
  {
    id: 9,
    name: "Rwenzori Mountains National Park",
    category: "National Park",
    image: "/rwenzori-mountains-uganda-snow-peaks.jpg",
    images: [
      "/rwenzori-mountains-uganda-snow-peaks.jpg",
      "/uganda-rwenzori-mountains-snow.jpg",
    ],
    country: "Uganda",
    region: "Western Uganda",
    description:
      "The Rwenzori Mountains, also known as the fabled Mountains of the Moon, are located on the border between Western Uganda and Congo. The mountain range boasts equatorial snow peaks, including the third-highest point in Africa at 5,109m (Margherita Peak), while the lower slopes are covered in moorland, bamboo, and lush montane forest. Huge tree heathers and colorful mosses drape across the mountainside, while giant lobelias and everlasting flowers create an enchanting, fairy tale scene. Rwenzori Mountains National Park protects the highest parts of the 120km long and 65km-wide Rwenzori mountain range. The national park is home to 70 mammal species and 217 bird species, including 19 Albertine Rift endemics, as well as some of the rarest vegetation in the world. The Rwenzoris are a world-class hiking and mountaineering destination. A nine to twelve-day trek will take skilled climbers to the summit of Margherita, the highest peak, though shorter, non-technical treks are possible to scale the surrounding peaks. Accommodation options include: Camp Norway and Ruboni Community Campsite.",
    history: {
      title: "History & Background",
      content: [
        "The Rwenzoris were first documented by the Alexandrine geographer Ptolemy in AD 150, who referred to them as the 'Mountains of the Moon'. This ancient name has captivated explorers and adventurers for centuries.",
        "Rwenzori Mountains National Park was established in 1991 by the Uganda Wildlife Authority and was designated a UNESCO World Heritage Site in 1994 because of its outstanding natural beauty and exceptional biodiversity. The park was later designated a Ramsar Wetland of International Importance in 2008.",
        "The park faced challenges when rebel militias occupied the Rwenzori Mountains from 1997 to June 2001. During this period, the park was inscribed on UNESCO's List of World Heritage in Danger between 1999 and 2004 due to insecurity and lack of resources. Since then, the park has been successfully restored and is now safely accessible to visitors.",
        "Unlike East Africa's volcanic giants such as Kilimanjaro and Mount Elgon, the Rwenzoris were formed by tectonic activity, creating a unique non-volcanic mountain range with permanent snow and glaciers near the equator."
      ]
    },
    geography: {
      description: "Rwenzori Mountains National Park is located in south-western Uganda along the Uganda-Democratic Republic of Congo border, on the east side of the western (Albertine) African rift valley. The park covers 995 km² and protects the highest parts of the 120km-long and 65km-wide Rwenzori mountain range. The highest point is Margherita Peak (5,109m) on Mount Stanley, making it Africa's third-highest peak. The range rises majestically from the rift valley floor, creating dramatic elevation changes. The park borders the DRC's Virunga National Park for 50km, forming an important transboundary conservation area.",
      climate: "The Rwenzori Mountains lie near the Equator and experience unique weather characterized by high rainfall, cold temperatures, and snow-capped peaks. The area records two rainy seasons: the long wet season from March to May and the short wet season in November. The best time to visit is from June to August and December to February, with July, August, and September being optimal for mountaineering. At altitudes of 3,000-4,000m, daytime temperatures range from 10-15°C, dropping to 2-6°C at night. In the alpine zone, temperatures can plummet below freezing, ranging from -5°C to 5°C. Due to the nearly constant temperatures, humidity, and high insolation near the equator, the mountains support extraordinarily diverse ecosystems."
    },
    wildlife: {
      description: "Rwenzori Mountains National Park shelters over 70 mammal species and 217 bird species, including 19 Albertine Rift endemics. The park contains the second-highest number of Albertine Rift endemics of any Important Bird Area in Uganda. Because of their altitudinal range and unique climatic conditions, the mountains support the richest montane flora in Africa, with many species endemic to the Albertine Rift and bizarre in appearance.",
      mammals: [
        "Forest elephants (Endangered)",
        "Chimpanzees (Endangered)",
        "Rwenzori otters - endemic dwarf otter-shrew",
        "Leopards",
        "Rwenzori colobus monkey (Vulnerable) - endemic subspecies",
        "L'Hoest's monkey",
        "Blue monkey - endemic subspecies",
        "Rock hyrax - endemic subspecies",
        "Various small mammals and rodents",
        "Duikers and other forest antelopes"
      ],
      birds: [
        "217 bird species recorded with more expected",
        "19 Albertine Rift endemic species",
        "Rwenzori Turaco - endemic",
        "Rwenzori Batis - endemic",
        "Handsome Francolin",
        "Archer's Robin-Chat",
        "Montane specialist species",
        "High-altitude adapted species"
      ],
      flora: [
        "Giant heathers reaching up to 12 meters tall",
        "Giant groundsels (Senecio species) - endemic candelabra-like plants",
        "Giant lobelias creating fairy-tale landscapes",
        "Everlasting flowers",
        "Tree heathers draped with colorful mosses",
        "Five distinct vegetation zones from montane forest to afro-alpine moorland",
        "Richest montane flora in Africa",
        "Rare afro-alpine moorland above 3,500m",
        "Bamboo forests at middle elevations",
        "Lush montane rainforest on lower slopes"
      ]
    },
    culture: {
      description: "The Bakonzo (also spelled Bakonjo or Konzo) are a Bantu ethnic group of 850,000+ people living in the Rwenzori region, inhabiting the plains, hills, and mountain slopes up to 2,200 meters. The Rwenzori Mountains have a strong cultural and spiritual attachment with the Bakonzo and Bamba peoples. The mountains are believed to be the home of Kithasamba, the overall god of Bakonzo human life and natural environment. Traditional rituals are performed within the park, including construction of hunters' shrines for animal sacrifices, ceremonies for exorcism of evil spirits, and human burials.",
      experiences: [
        "Visit Ruboni Community for cultural immersion and traditional activities",
        "Learn about Bakonzo naming traditions based on birth order",
        "Experience traditional agricultural practices - yams, beans, coffee, and more",
        "Discover traditional spiritual beliefs and deities (Kithasamba, Nyabibuya, Kalisya)",
        "Participate in community-led conservation initiatives",
        "Stay at community campsites like Ruboni Community Campsite",
        "Learn about efforts to revive traditional ceremonies like Olhusumba"
      ]
    },
    bestTimeToVisit: {
      description: "The Rwenzori Mountains can be visited year-round, but certain seasons offer optimal conditions for trekking and mountaineering. The challenging terrain and unpredictable mountain weather make timing crucial for successful summit attempts.",
      drySeason: {
        title: "Dry Season (June-August & December-February)",
        description: "The best time to visit is from June to August and December to February, with July, August, and September being the prime months for mountaineering. These are considered the high season for Rwenzori trekking. During these months, trails are less muddy, rocks are less slippery, and weather is more predictable. This is the optimal window for attempting Margherita Peak (5,109m), which requires 9-12 days for skilled climbers. The dry season offers the best chances for clear views of the spectacular snow-capped peaks and the unique afro-alpine vegetation."
      },
      wetSeason: {
        title: "Wet Season (March-May & September-November)",
        description: "The wet seasons are characterized by heavy rainfall, making Mount Rwenzori cold and trails muddy and slippery. March, April, May, and October-November are the low months and considered the worst time to visit. The heavy rains create very challenging conditions for trekking, with increased risk of hypothermia at higher elevations. However, the mountains are incredibly lush and green during this period, and the waterfalls are at their most spectacular. Only experienced mountaineers with proper equipment should attempt summit treks during the wet season."
      }
    }
  },
];

// Placeholder destinations - to be updated with complete information
export const placeholderDestinationsOnly: DestinationOnly[] = [
  {
    id: 1,
    name: "Bwindi Impenetrable Forest",
    category: "National Park",
    image: "/bwindi-impenetrable-forest-mountain-gorillas.jpg",
    images: [
      "/bwindi-impenetrable-forest-mountain-gorillas.jpg",
      "/uganda-mountain-gorillas-bwindi-forest.jpg",
      "/kibale-forest-chimpanzee-tracking-uganda.jpg",
      "/uganda-safari-landscape-team-adventure.jpg",
      "/uganda-gorilla-trekking-adventure.jpg",
    ],
    country: "Uganda",
    region: "Southwestern Uganda",
    description:
      "Home to nearly half of the world's remaining mountain gorillas, Bwindi Impenetrable Forest is a UNESCO World Heritage Site offering unforgettable gorilla trekking experiences in ancient rainforest.",
  },
  {
    id: 2,
    name: "Murchison Falls National Park",
    category: "National Park",
    image: "/murchison-falls-national-park-uganda-waterfall.jpg",
    images: [
      "/murchison-falls-national-park-uganda-waterfall.jpg",
      "/uganda-murchison-falls-waterfall.jpg",
      "/uganda-queen-elizabeth-national-park-safari.jpg",
      "/lake-mburo-national-park-uganda-zebras-savannah.jpg",
    ],
    country: "Uganda",
    region: "Northwestern Uganda",
    description:
      "Uganda's largest national park, where the Nile explodes through a narrow gorge creating the world's most powerful waterfall. Home to lions, elephants, giraffes, and hippos.",
  },
  {
    id: 3,
    name: "Kampala",
    category: "City",
    image: "/kampala-uganda-city-skyline.jpg",
    images: [
      "/kampala-uganda-city-skyline.jpg",
      "/kampala-city-uganda-skyline-sunset.jpg",
    ],
    country: "Uganda",
    region: "Central Uganda",
    description:
      "Uganda's vibrant capital city, a bustling hub of culture, history, and modern life. Explore colorful markets, historical sites, and experience authentic East African urban culture.",
  },
  {
    id: 4,
    name: "Queen Elizabeth National Park",
    category: "National Park",
    image: "/uganda-queen-elizabeth-national-park-safari.jpg",
    images: [
      "/uganda-queen-elizabeth-national-park-safari.jpg",
      "/queen-elizabeth-national-park-tree-climbing-lions.jpg",
      "/lake-mburo-national-park-uganda-zebras-savannah.jpg",
      "/kidepo-valley-national-park-wildlife.jpg",
    ],
    country: "Uganda",
    region: "Western Uganda",
    description:
      "Uganda's most visited national park, famous for its tree-climbing lions, diverse ecosystems, and the stunning backdrop of the Rwenzori Mountains. Home to over 95 mammal species and 600 bird species.",
  },
  {
    id: 5,
    name: "Lake Victoria",
    category: "Lake",
    image: "/uganda-lake-victoria-sunset.jpg",
    images: [
      "/uganda-lake-victoria-sunset.jpg",
      "/jinja-source-of-nile-white-water-rafting.jpg",
      "/jinja-uganda-nile-river-rapids.jpg",
    ],
    country: "Uganda",
    region: "Southern Uganda",
    description:
      "Africa's largest lake and the world's second-largest freshwater lake. Discover pristine beaches, fishing villages, stunning sunsets, and the source of the Nile River.",
  },
  {
    id: 6,
    name: "Rwenzori Mountains",
    category: "Mountain Range",
    image: "/uganda-rwenzori-mountains-snow.jpg",
    images: [
      "/uganda-rwenzori-mountains-snow.jpg",
      "/rwenzori-mountains-uganda-snow-peaks.jpg",
      "/sipi-falls-uganda-waterfalls-mount-elgon.jpg",
      "/sipi-falls-uganda-waterfalls.jpg",
    ],
    country: "Uganda",
    region: "Western Uganda",
    description:
      "The legendary Mountains of the Moon with snow-capped peaks near the equator. A UNESCO World Heritage Site offering challenging treks through unique Afro-alpine vegetation.",
  },
  {
    id: 7,
    name: "Kibale National Park",
    category: "National Park",
    image: "/kibale-forest-national-park-chimpanzees.jpg",
    images: [
      "/kibale-forest-national-park-chimpanzees.jpg",
      "/kibale-forest-chimpanzee-tracking-uganda.jpg",
      "/bwindi-impenetrable-forest-mountain-gorillas.jpg",
    ],
    country: "Uganda",
    region: "Western Uganda",
    description:
      "The primate capital of the world with the highest density of primates in Africa. Famous for chimpanzee tracking and home to 13 primate species including red colobus and L'Hoest's monkeys.",
  },
  {
    id: 8,
    name: "Jinja",
    category: "Town",
    image: "/jinja-uganda-nile-river-rapids.jpg",
    images: [
      "/jinja-uganda-nile-river-rapids.jpg",
      "/jinja-source-of-nile-white-water-rafting.jpg",
      "/uganda-lake-victoria-sunset.jpg",
    ],
    country: "Uganda",
    region: "Eastern Uganda",
    description:
      "The adventure capital of East Africa, located at the source of the Nile. Offers world-class white water rafting, bungee jumping, kayaking, and boat tours on the mighty Nile River.",
  },
  {
    id: 9,
    name: "Kidepo Valley National Park",
    category: "National Park",
    image: "/kidepo-valley-national-park-wildlife.jpg",
    images: [
      "/kidepo-valley-national-park-wildlife.jpg",
      "/queen-elizabeth-national-park-tree-climbing-lions.jpg",
      "/lake-mburo-national-park-uganda-zebras-savannah.jpg",
    ],
    country: "Uganda",
    region: "Northeastern Uganda",
    description:
      "One of Africa's most spectacular wilderness areas with stunning landscapes and incredible wildlife. Remote and pristine, offering a true off-the-beaten-path safari experience.",
  },
  {
    id: 10,
    name: "Sipi Falls",
    category: "Waterfall",
    image: "/sipi-falls-uganda-waterfalls.jpg",
    images: [
      "/sipi-falls-uganda-waterfalls.jpg",
      "/sipi-falls-uganda-waterfalls-mount-elgon.jpg",
      "/uganda-rwenzori-mountains-snow.jpg",
    ],
    country: "Uganda",
    region: "Eastern Uganda",
    description:
      "A series of three stunning waterfalls on the foothills of Mount Elgon. Perfect for hiking, coffee tours, and experiencing beautiful landscapes and local culture.",
  },
];
