const R2_BASE = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev";
const IMAGE_PATH = "nambi-uganda-safaris/images";
const getImageUrl = (filename: string) => `${R2_BASE}/${IMAGE_PATH}/${filename}`;

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
    image: getImageUrl("lake-mburo-national-park-uganda-zebras-savannah.webp"),
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
    image: getImageUrl("sipi-falls-uganda-waterfalls-mount-elgon.webp"),
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
    image: getImageUrl("rwenzori-mountains-uganda-snow-peaks.webp"),
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
  {
    id: 11,
    name: "Semuliki National Park",
    category: "National Park",
    image: getImageUrl("uganda-safari-landscape-team-adventure.webp"),
    images: [
      "/uganda-safari-landscape-team-adventure.jpg",
    ],
    country: "Uganda",
    region: "Western Uganda",
    description:
      "Semuliki National Park sprawls across the floor of the Semliki Valley on the remote western side of the Rwenzori Mountains. The park is dominated by the easternmost extension of the great Ituri Forest of the Congo basin, one of Africa's most ancient and biodiverse forests that survived the last ice age around 12-18,000 years ago. The Semuliki Valley is unique in that it contains numerous features associated with Central rather than Eastern Africa. For example, the thatched huts are shaded by West African oil palms, the Semuliki River which forms the international boundary is a miniature version of the Congo River, and the forest is home to numerous Central African wildlife species. The park provides a rare glimpse into the wildlife of Central Africa without having to leave Uganda. The reserve is home to a total of 53 mammal species and over 400 bird species, with some being endemic to the park and the Congo basin. Wildlife enthusiasts can expect to see primates such as the black-and-white colobus, red-tailed monkey, and grey-cheeked mangabey. The park is also home to forest elephants, buffaloes, bushbucks, and a few species of duikers. The birdlife in the park is particularly impressive, with a variety of raptors, forest and waterbird species, and the elusive shoebill stork. The Batwa pygmy community, who originally come from the Congo, also call this area home. The park's hot springs are another attraction worth visiting. The Sempaya hot springs consist of two separate springs, one male and one female, and are said to have medicinal properties.",
    history: {
      title: "History & Background",
      content: [
        "From 1932 to 1993, the area covered by Semuliki National Park was managed as a forest reserve, initially by the colonial government and then by the Ugandan government's Forest Department. It was made a national park by the government in October 1993 to protect the forests as an integral part of the protected areas of the Western Rift Valley.",
        "Semuliki is one of Africa's most ancient forests. During the dry conditions of the last ice age, 12-18,000 years ago, most of Africa's forests shrank and disappeared, with only a few patches like Semuliki surviving. This great age has enhanced its biodiversity, making it a critical refuge for species that would otherwise have disappeared.",
        "The park is dominated by the easternmost extension of the vast Ituri Forest of the Congo Basin. Semuliki represents the eastern limit of the Congo's Ituri Forest and contains numerous Congo-Guinea species at the eastern limit of their ranges, making it a unique biogeographical zone in East Africa.",
        "Managed by the Uganda Wildlife Authority, the park was established to protect East Africa's only lowland tropical rainforest and its extraordinary Central African wildlife species that occur nowhere else in Uganda or East Africa."
      ]
    },
    geography: {
      description: "Semuliki National Park is located in Bwamba County, Bundibugyo District in the Western Region of Uganda, encompassing 219 km² of East Africa's only lowland tropical rainforest. The park lies on Uganda's border with the Democratic Republic of the Congo, with the Rwenzori Mountains to the south-east and Lake Albert to the north. The park lies within the Albertine Rift, the western arm of the East African Rift, on a flat to gently undulating landform that ranges from 670 to 760 meters above sea level. The Semuliki River forms the international boundary with the DRC and is a miniature version of the mighty Congo River.",
      climate: "Semuliki is a lowland rainforest close to the equator, which means it is hot year-round with temperatures varying from 18 to 30°C, with relatively small daily variations. The park experiences an average rainfall of 1,250mm, with peaks from March to May and from September to December. Many areas of the park experience flooding during the wet season. The best time to visit is during the dry season from June to August and December to February, though another recommended period is between January to March and June to September when there are fewer rains."
    },
    wildlife: {
      description: "Semuliki is one of Uganda's premier wildlife destinations, home to 53 mammal species (27 large mammals) and over 435 bird species - representing 40% of Uganda's total bird species and 66% of the country's forest bird species. The park is particularly significant for harboring Central African species that occur nowhere else in East Africa. Eleven mammal species are endemic to the park, including the pygmy antelope and two flying squirrel species.",
      mammals: [
        "Forest elephants - smaller than savannah elephants",
        "Forest buffaloes - smaller versions of savannah buffalo",
        "Water chevrotain - the peculiar 'fanged deer'",
        "Eight primate species: chimpanzees, grey-cheeked mangabey, black-and-white colobus, Central African red colobus, blue monkey, red-tailed monkey, de Brazza's monkey, vervet monkey, and Dent's mona monkey",
        "Pygmy antelope - endemic",
        "Two species of flying squirrels - endemic",
        "Hippos and crocodiles along the Semliki River",
        "Various duiker species",
        "Bushbucks",
        "Five species of large mammals not recorded in other Ugandan parks"
      ],
      birds: [
        "Over 435 bird species recorded (40% of Uganda's total)",
        "46 Guinea-Congo biome species found nowhere else in East Africa",
        "35 species found in only two or three other places in Uganda",
        "Five Albertine Rift endemic species",
        "Spot-breasted ibis",
        "Hartlaub's duck",
        "Congo serpent eagle",
        "Chestnut-flanked goshawk",
        "Red-thighed sparrowhawk",
        "Western bronze-naped pigeon",
        "Yellow-throated cuckoo",
        "Various hornbill species",
        "Shoebill stork"
      ],
      flora: [
        "East Africa's only lowland tropical rainforest",
        "Eastern extension of Congo Basin's Ituri Forest",
        "West African oil palms",
        "Ancient forest that survived the last ice age (12-18,000 years ago)",
        "Congo-Guinea forest species at eastern limit of their range",
        "Dense tropical vegetation characteristic of Central Africa"
      ]
    },
    culture: {
      description: "The Batwa pygmies originally from the Ituri Forest reside on the forest edges of Semuliki National Park, preserving their ancient traditions. These hunter-gatherers were displaced when the park was gazetted in 1993, after depending on the forest for centuries for food, shelter, medicine, and tools. They have since resettled in villages around the park boundaries, particularly in Ntandi and Boma villages. The park is also surrounded by four distinct tribes: the Bwamba farmers at the base of Rwenzori Mountains, the Bakonjo cultivators on mountain slopes, Batuku cattle keepers, and the Batwa pygmies from the Ituri forest.",
      experiences: [
        "Visit Ntandi and Boma villages to meet the Batwa pygmy community",
        "Experience traditional Batwa music, dance, and storytelling",
        "Learn about the Batwa's traditional hunter-gatherer lifestyle and forest knowledge",
        "Discover how the Batwa are adapting to life outside the forest",
        "Purchase handmade crafts created by Batwa artisans",
        "Engage with elder community members to learn about Batwa history and culture",
        "Visit Sempaya Hot Springs - male and female springs with medicinal properties",
        "Witness eggs boiling in the 103°C hot springs within 5-10 minutes",
        "Experience the unique blend of Central African culture in East Africa"
      ]
    },
    bestTimeToVisit: {
      description: "Semuliki National Park can be visited year-round as a tropical rainforest, but the dry seasons offer the best conditions for wildlife viewing, birdwatching, and exploring the hot springs.",
      drySeason: {
        title: "Dry Season (June-August & December-February)",
        description: "The best time to visit is during the dry season from June to August and December to February when weather is most favorable. Another highly recommended period is between January to March and June to September when there are fewer rains. During these months, trails are more accessible, flooding is minimal, and wildlife is easier to spot as animals congregate around water sources. This is the peak tourist season for Uganda safaris, offering optimal conditions for visiting the Sempaya Hot Springs, birdwatching, and primate tracking."
      },
      wetSeason: {
        title: "Wet Season (March-May & September-December)",
        description: "The wet season brings peaks in rainfall from March to May and September to December, with many areas of the park experiencing flooding. Rain is possible at any time in this equatorial lowland rainforest. While more challenging for access, the wet season offers lush, verdant landscapes and excellent birdwatching opportunities as forest birds are more active. The hot springs remain accessible year-round. Visitors should be prepared with waterproof gear and expect muddy, slippery trails."
      }
    }
  },
  {
    id: 7,
    name: "Kibale National Park",
    category: "National Park",
    image: getImageUrl("kibale-forest-chimpanzee-tracking-uganda.webp"),
    images: ["/kibale-forest-chimpanzee-tracking-uganda.jpg", "/kibale-forest-national-park-chimpanzees.jpg"],
    country: "Uganda",
    region: "Western Uganda",
    description: "Kibale National Park, located in western Uganda, boasts of being one of the most beautiful and diverse tropical forests in the country. Covering an area of 795 km², the northern and central parts of the park are dominated by a mix of forest cover interspersed with patches of grassland and swamp, all resting on an elevated plateau. The park is home to an impressive 70 mammal species, with the most famous being the 13 species of primates that include the chimpanzee, red colobus, and black-and-white colobus. Kibale supports one of the largest populations of wild chimpanzees in Uganda, estimated at over 1,500 individuals. The park is renowned as the 'primate capital of the world' with over 90% chimpanzee sighting success rates. Kibale also has a rich birdlife with over 375 species. The park's close proximity to Queen Elizabeth National Park to the south has created a 180km-long corridor for wildlife. Accommodation options include: Kibale Forest Camp, Primate Lodge, Isunga Lodge, and Turaco Lodge.",
    history: { title: "History & Background", content: ["Kibale was gazetted as a Crown Forest by the British in 1932 and designated a Forest Reserve in 1948. The area was formally established as Kibale National Park in 1993 to protect a large area of forest previously managed as a logged forest reserve.", "Chimpanzee trekking was introduced in 1993 and has continued successfully to this day, starting at the Kanyanchu area. Since 1993, the Kanyanchu chimpanzee community has been intensively monitored and habituated to human presence, significantly improving the chances of sightings to over 90% success rate.", "In 1994, the park was managed by Uganda National Parks, and in 1996, Uganda National Parks merged to form the present Uganda Wildlife Authority (UWA), which continues to manage the park today.", "The park has become internationally recognized as the 'primate capital of the world' due to its exceptional diversity and concentration of primates in Africa."] },
    geography: { description: "Kibale National Park is located in western Uganda, covering 795 square kilometers of primarily moist evergreen and semi-deciduous forest. The northern and central parts of the park are dominated by a mix of forest cover interspersed with patches of grassland and swamp, all resting on an elevated plateau. The park lies close to the Fort Portal area, known for its stunning crater lakes and tea plantations.", climate: "Kibale experiences a tropical climate with two wet seasons from March to May and September to November. The dry seasons from December to February and June to August are the best times for chimpanzee tracking, though the park can be visited year-round." },
    wildlife: { description: "Kibale National Park is home to 70 mammal species and 375 bird species. The park is most famous for its 13 primate species, with an estimated 1,500 wild chimpanzees distributed across at least 12 distinct communities, making it one of the largest chimpanzee populations in Uganda.", mammals: ["Over 1,500 chimpanzees in 12+ communities", "Red colobus monkey", "Black-and-white colobus monkey", "L'Hoest's monkey", "Blue monkey", "Red-tailed monkey", "Grey-cheeked mangabey", "Olive baboon", "Bush babies", "Forest elephants", "Buffaloes", "Bush pigs", "Duikers"], birds: ["Over 375 bird species", "African grey parrot", "Great blue turaco", "Yellow-spotted nicator", "Little greenbul", "African pitta (rare)", "Green-breasted pitta"], flora: ["Moist evergreen forest", "Semi-deciduous forest", "Grassland patches", "Swamp areas", "Ancient forest ecosystem"] },
    culture: { description: "The Kibale-Fort Portal area offers rich cultural experiences with local communities. The region is known for its vibrant traditions, crater lakes, and extensive tea plantations that shape the local economy and lifestyle.", experiences: ["Traditional dance performances", "Cultural workshops", "Village walks", "Tea plantation tours", "Crater lake exploration", "Community-based conservation initiatives", "Interaction with local farmers and communities"] },
    bestTimeToVisit: { description: "Kibale National Park can be visited year-round, but certain seasons offer optimal conditions for primate tracking and wildlife viewing.", drySeason: { title: "Dry Season (December-February & June-August)", description: "The best time to visit is during the dry seasons when trails are less muddy and more accessible. Chimpanzee tracking success rates are consistently high (over 90%) during these periods. The weather is pleasant for forest walks and primate observation. These months are also ideal for birdwatching and exploring the surrounding Fort Portal crater lakes." }, wetSeason: { title: "Wet Season (March-May & September-November)", description: "The wet seasons bring lush vegetation and active wildlife. While trails can be muddy and slippery, chimpanzee tracking continues with high success rates. This period is excellent for birdwatching as many species are breeding. The forest is particularly beautiful with vibrant green foliage, though waterproof gear is essential." } }
  },
  {
    id: 12,
    name: "Kidepo Valley National Park",
    category: "National Park",
    image: getImageUrl("kidepo-valley-national-park-wildlife.webp"),
    images: ["/kidepo-valley-national-park-wildlife.jpg"],
    country: "Uganda",
    region: "Northeastern Uganda (Karamoja)",
    description: "Located 700km from Kampala, Kidepo Valley lies in the rugged, semi-arid valleys between Uganda's borders with Sudan and Kenya. Gazetted as a national park in 1962, it boasts a profusion of big game and hosts over 77 mammal species, as well as around 475 bird species. Despite being Uganda's most isolated national park, those who make the long journey north through the wild frontier region of Karamoja would agree that it is also the most magnificent, as Kidepo ranks among Africa's finest wildernesses. From Apoka, situated in the heart of the park, a savannah landscape extends far beyond the gazetted area, towards horizons outlined by distant mountain ranges. During the dry season, the only permanent water in the park is found in wetlands and remnant pools in the broad Narus Valley near Apoka. These seasonal oases, combined with the open savannah terrain, make the Narus Valley the park's prime game viewing location. Accommodation options include: Apoka Safari Lodge and Nga'Moru Wilderness Camp.",
    history: { title: "History & Background", content: ["The park was gazetted as a game reserve by the British colonial government in 1958, and the newly independent government of Uganda under Milton Obote converted the reserve into Kidepo Valley National Park in 1962.", "The first chief warden was Ian Ross, a Briton, who was replaced by Paul Ssali, a Ugandan, in 1972. The park has been managed by the Uganda Wildlife Authority since its inception.", "Kidepo consists of the two major valley systems of the Kidepo and Narus Rivers. The park covers 1,442 square kilometres in the semi-arid valleys of Karamoja, making it one of Uganda's largest protected areas.", "While historically affected by banditry, Karamoja has been safe for several years and is now a growing center of community-based tourism, with the Uganda Wildlife Authority implementing collaborative management zones where local communities can harvest resources."] },
    geography: { description: "Kidepo Valley National Park is located in the Karamoja region in northeast Uganda, approximately 700km from Kampala. The park covers 1,442 square kilometres of semi-arid savannah landscape. It borders South Sudan to the northwest and Kenya just 5km to the east. The park consists of two major valley systems: the Kidepo and Narus Rivers, with valley floors lying between 910m and 1,200m above sea level. The landscape features open savannah extending to distant mountain ranges.", climate: "Kidepo experiences a semi-arid climate with two rainy seasons. The dry season from September to March offers the best wildlife viewing as animals congregate around the permanent water sources in the Narus Valley. Temperatures can be quite high during the day, with cooler evenings." },
    wildlife: { description: "Kidepo Valley National Park is home to over 77 mammal species and an impressive 476 bird species, making it a prime destination for wildlife enthusiasts and birders alike. The park offers some of the best big game viewing in Uganda, with its open savannah terrain providing excellent visibility.", mammals: ["Lions", "Leopards", "Cheetahs (occasionally)", "Elephants", "Buffaloes", "Giraffes", "Zebras", "Greater and lesser kudu", "Eland", "Jackson's hartebeest", "Oribis", "Klipspringer", "Dik-dik", "Bat-eared fox", "Caracal", "Aardwolf"], birds: ["476 bird species recorded", "Ostriches", "Kori bustard", "Secretary bird", "Abyssinian ground hornbill", "Karamoja apalis (endemic)", "Various raptors", "Carmine bee-eaters"], flora: ["Semi-arid savannah grasslands", "Acacia woodlands", "Seasonal wetlands", "Riverine vegetation along Kidepo and Narus valleys"] },
    culture: { description: "The park is located in the Karamoja region, home to the Karamojong people, a pastoralist community with rich cultural traditions. The area has transformed from past insecurity to become a safe and welcoming destination for community-based tourism.", experiences: ["Meet the Karamojong people and learn about their pastoralist lifestyle", "Experience traditional Karamojong dances and ceremonies", "Visit local manyattas (traditional homesteads)", "Learn about cattle culture and traditional practices", "Community-based tourism initiatives", "Cultural performances and crafts"] },
    bestTimeToVisit: { description: "Kidepo Valley National Park can be visited year-round, but the dry season offers the best wildlife viewing opportunities as animals concentrate around permanent water sources.", drySeason: { title: "Dry Season (September-March)", description: "The dry season is the best time to visit Kidepo Valley National Park. During this period, wildlife congregates around the permanent water sources in the Narus Valley, making game viewing exceptional. The open savannah terrain combined with concentrated wildlife offers spectacular viewing opportunities. The weather is clear with excellent visibility for photography. This is the prime season for spotting big game including lions, elephants, giraffes, and the rare greater kudu." }, wetSeason: { title: "Wet Season (April-August)", description: "The wet season brings some rainfall, causing wildlife to disperse across the park as water becomes available throughout the landscape. While game viewing is more challenging, the park transforms into a lush green environment. Birdwatching is excellent during this period with migratory species present. The landscape is particularly beautiful, though some areas may have restricted access due to muddy conditions." } }
  },
  {
    id: 4,
    name: "Queen Elizabeth National Park",
    category: "National Park",
    image: getImageUrl("queen-elizabeth-national-park-tree-climbing-lions.webp"),
    images: ["/queen-elizabeth-national-park-tree-climbing-lions.jpg", "/uganda-queen-elizabeth-national-park-safari.jpg"],
    country: "Uganda",
    region: "Western Uganda",
    description: "Undoubtedly Uganda's most popular tourist destination, the Queen Elizabeth National Park boasts an impressive array of diverse ecosystems, including sprawling savanna, shady humid forests, sparkling lakes, and fertile wetlands. This makes it an ideal habitat for classic big game, ten primate species (including chimpanzees), and over 600 species of birds. Against the backdrop of the jagged Rwenzori Mountains, the park offers magnificent vistas, including dozens of enormous craters carved dramatically into rolling green hills, panoramic views of the Kazinga Channel with its banks lined with hippos, buffalo, and elephants, and the endless Ishasha plains, whose fig trees hide lions ready to pounce on unsuspecting Uganda kob herds. The park's gazette status has ensured the conservation of its ecosystems, which benefits surrounding communities. Accommodation options include: River Ishasha Jungle Lodge, Ntungwe River Camp, Ishasha Wilderness Camp, Jacana Safari Lodge, Katara Lodge, Kasenyi Safari Camp, Kingfisher Lodge, Mweya Safari Lodge, Queen Elizabeth Bush Lodge, Tembo Safari Lodge, and Irungu Forest Safari Lodge.",
    history: { title: "History & Background", content: ["Queen Elizabeth National Park was established in 1952 and originally named Kazinga National Park. It was renamed two years later after a visit by Queen Elizabeth II of the United Kingdom.", "The park is managed by the Uganda Wildlife Authority and is one of Uganda's oldest and most visited national parks, covering approximately 1,978 square kilometres.", "The park has played a crucial role in Uganda's conservation efforts and tourism industry for over 70 years, protecting diverse ecosystems from savannah to wetlands.", "Queen Elizabeth National Park has a fascinating cultural history with many opportunities for visitors to meet local communities, contributing to sustainable tourism and community development."] },
    geography: { description: "Queen Elizabeth National Park is located in western Uganda, spanning the districts of Kasese, Kamwenge, Rubirizi, and Rukungiri. The park covers approximately 1,978 square kilometres and features diverse ecosystems including savanna, forests, wetlands, and crater lakes. The 40km-long Kazinga Channel connects Lake Edward and Lake George, serving as the park's centerpiece. Against the backdrop of the Rwenzori Mountains, the landscape includes dozens of volcanic craters carved into rolling hills. The Ishasha sector in the south is famous for its fig tree forests.", climate: "The park experiences a tropical climate with two rainy seasons from March to May and September to November. The dry seasons from June to August and December to February are the best times for game viewing. Temperatures are generally warm year-round." },
    wildlife: { description: "Queen Elizabeth National Park is home to over 95 mammal species and an astonishing 600+ bird species, making it one of the most biodiverse parks in Africa. The park is particularly famous for its tree-climbing lions in the Ishasha sector, one of only two places in Africa where this behavior occurs.", mammals: ["Tree-climbing lions in Ishasha sector", "Leopards", "Elephants", "Buffaloes", "Hippos (hundreds along Kazinga Channel)", "Nile crocodiles", "Uganda kobs", "Waterbucks", "Warthogs", "Ten primate species including chimpanzees in Kyambura Gorge", "Topi", "Bushbucks"], birds: ["Over 600 bird species", "African fish eagle", "Pied kingfisher", "Malachite kingfisher", "Yellow-billed stork", "Saddle-billed stork", "Great white pelican", "Pink-backed pelican", "African skimmer", "Martial eagle"], flora: ["Savannah grasslands", "Acacia woodlands", "Fig trees in Ishasha sector", "Papyrus swamps", "Euphobia forest", "Maramagambo Forest"] },
    culture: { description: "Queen Elizabeth National Park has a rich cultural history with opportunities to engage with local communities living around the park. Visitors can experience traditional storytelling, dance, music, and learn about the symbiotic relationship between the park and surrounding communities.", experiences: ["Traditional dance and music performances", "Village walks and community visits", "Storytelling sessions", "Cultural workshops", "Learn about conservation and community partnerships", "Interact with fishing communities on Lake Edward", "Experience local crafts and art"] },
    bestTimeToVisit: { description: "Queen Elizabeth National Park can be visited year-round, but different seasons offer varying wildlife viewing experiences.", drySeason: { title: "Dry Season (June-August & December-February)", description: "The dry seasons are the best time to visit for optimal game viewing. Wildlife congregates around water sources, particularly along the Kazinga Channel, making animals easier to spot. The tree-climbing lions in Ishasha are more easily found during this period. Boat cruises on the Kazinga Channel offer exceptional wildlife viewing with hundreds of hippos, elephants, buffaloes, and diverse waterbirds. The weather is pleasant for game drives and photography." }, wetSeason: { title: "Wet Season (March-May & September-November)", description: "The wet seasons bring lush vegetation and excellent birdwatching opportunities as migratory species arrive. The landscape is particularly beautiful with green rolling hills and full crater lakes. While wildlife is more dispersed, the park remains accessible and offers good viewing opportunities. The wet season is ideal for photography enthusiasts seeking dramatic landscapes and for birders looking to add species to their lists." } }
  },
  {
    id: 13,
    name: "Mgahinga Gorilla National Park",
    category: "National Park",
    image: getImageUrl("uganda-gorilla-trekking-adventure.webp"),
    images: ["/uganda-gorilla-trekking-adventure.jpg"],
    country: "Uganda",
    region: "Southwestern Uganda",
    description: "Mgahinga Gorilla National Park is a high-altitude park, sitting between 2,227m and 4,127m above sea level. It was established primarily to protect the mountain gorillas that call its dense forests home, as well as the endangered golden monkey. The park also holds great cultural significance, particularly for the indigenous Batwa Pygmies. As the forest's first people, their ancient knowledge of its secrets remains unparalleled. Mgahinga Gorilla National Park is dominated by three conical, extinct volcanoes which are part of the breathtaking Virunga Range that spans across the border region of Uganda, Congo, and Rwanda. Mgahinga is just a small part of the much larger Virunga Conservation Area, which includes adjacent parks in these countries. The slopes of these volcanoes are home to various ecosystems, making them biologically diverse and visually stunning. The park's unique combination of high-altitude forests, volcanic peaks, and diverse wildlife make it a must-visit destination for nature lovers and adventure seekers. Accommodation options include: Amajambere IWACU Camp (Ntebeko) and Bird Nest at Bunyonyi Resort (Bunyonyi).",
    history: { title: "History & Background", content: ["Mgahinga Gorilla National Park was created in 1991 by the Uganda Wildlife Authority, covering an area of 33.9 km². It is located about 15 kilometres south of Kisoro town in southwestern Uganda.", "The park was established primarily to protect the rare mountain gorillas and endangered golden monkeys that inhabit its high-altitude forests.", "Mgahinga forms part of the much larger Virunga Conservation Area, which is contiguous with Rwanda's Volcanoes National Park and the southern sector of Virunga National Park in the Democratic Republic of the Congo.", "The park includes three conical extinct volcanoes that are part of the Virunga Range along the borders of Uganda, Congo, and Rwanda: Mount Muhabura (4,127m), Mount Gahinga (3,474m), and Mount Sabyinyo (3,645m)."] },
    geography: { description: "Mgahinga Gorilla National Park is located in southwestern Uganda at the borders with Congo and Rwanda. The park sits at high altitude between 2,227m and 4,127m above sea level, covering 33.9 km². It features three extinct volcanoes: Mount Muhabura (4,127m), Mount Gahinga (3,474m), and Mount Sabyinyo (3,645m), which are part of the Virunga Range. The slopes support various ecosystems from bamboo forests to alpine vegetation.", climate: "Mgahinga experiences a cool mountain climate due to its high altitude. Temperatures can drop significantly, especially at night. The park has two rainy seasons from March to May and September to November. The dry seasons from June to August and December to February offer the best conditions for gorilla trekking and volcano hiking." },
    wildlife: { description: "Mgahinga Gorilla National Park protects approximately 30 mountain gorillas divided between one habituated and two unhabituated groups. The park also has a significant population of endangered golden monkeys, with about 60 being habituated to human contact. These Albertine Rift endemics have their range restricted to the Virungas.", mammals: ["Mountain gorillas (about 30 individuals)", "Nyakagezi gorilla family (habituated group)", "Golden monkeys (3,000-4,000 in Virungas, 60 habituated in Mgahinga)", "Elephants (occasional visitors)", "Buffaloes", "Forest duikers", "Bushbucks", "Giant forest hogs"], birds: ["180+ bird species", "Rwenzori turaco", "Crowned hornbill", "Black kite", "Crowned crane", "Albertine Rift endemics"], flora: ["Bamboo forests", "Afro-montane forest", "Alpine vegetation on volcano slopes", "Hagenia-Hypericum woodlands", "Giant lobelias at higher altitudes"] },
    culture: { description: "Mgahinga Gorilla National Park holds great cultural significance for the indigenous Batwa Pygmies, who were the forest's first people. Their ancient knowledge of the forest's secrets remains unparalleled. The Batwa lived as hunter-gatherers in the forest for thousands of years before being relocated when the park was created.", experiences: ["Batwa Trail cultural experience", "Learn about Batwa history and traditional forest life", "Experience traditional Batwa hunting and gathering techniques", "Visit sacred Batwa sites", "Traditional fire-making demonstrations", "Batwa music and dance performances", "Listen to Batwa elders share ancient forest knowledge"] },
    bestTimeToVisit: { description: "Mgahinga Gorilla National Park can be visited year-round, but the dry seasons offer the best conditions for gorilla trekking and volcano hiking due to less muddy trails.", drySeason: { title: "Dry Season (June-August & December-February)", description: "The dry seasons are the best time to visit for gorilla trekking and golden monkey tracking. Trails are less muddy and slippery, making the steep terrain more manageable. The weather is cooler and clearer, offering better views of the volcanoes. This is the peak season for volcano climbing, with all three peaks (Muhabura, Gahinga, and Sabyinyo) accessible. Wildlife viewing is optimal as animals are easier to track." }, wetSeason: { title: "Wet Season (March-May & September-November)", description: "The wet seasons bring heavy rainfall to the park, making trails muddy and challenging. However, gorilla trekking continues year-round, and the forest is lush and beautiful. The wet season offers a more intimate experience with fewer tourists. Proper rain gear and sturdy hiking boots are essential. The cooler, misty conditions are typical of mountain gorilla habitat, adding to the authentic rainforest experience." } }
  },
  {
    id: 1,
    name: "Bwindi Impenetrable National Park",
    category: "National Park",
    image: getImageUrl("bwindi-impenetrable-forest-mountain-gorillas.webp"),
    images: ["/bwindi-impenetrable-forest-mountain-gorillas.jpg", "/uganda-mountain-gorillas-bwindi-forest.jpg"],
    country: "Uganda",
    region: "Southwestern Uganda",
    description: "Located in southwestern Uganda on the edge of the Rift Valley, Bwindi Impenetrable National Park's mist-covered hillsides are blanketed by one of Uganda's oldest and most biologically diverse rainforests, which dates back over 25,000 years and contains almost 400 species of plants. More famously, this 'impenetrable forest' also protects an estimated 400 mountain gorillas – roughly half of the world's population, including several habituated groups that can be tracked. This biologically diverse region also provides shelter to a further 120 mammals, including several primate species such as baboons and chimpanzees, as well as elephants and antelopes. The forest is also home to around 350 species of birds, including 23 Albertine Rift endemics. The neighboring towns of Buhoma and Nkuringo both offer an impressive array of luxury lodges, rustic bandas, and budget campsites, as well as restaurants, craft stalls, and guiding services. Visitors can also discover the local Bakiga and Batwa Pygmy cultures through performances, workshops, and village walks. Accommodation options include: Buhoma Lodge, Bwindi Lodge, Cloud Mountain Gorilla Lodge, Silverback Lodge, Gorilla Forest Camp, Mahogany Springs, Bwindi View Rest Camp, Nkuringo Gorilla Campsite, and Wagtail Eco Safari Camp.",
    history: { title: "History & Background", content: ["Bwindi Impenetrable National Park was established as a national park in 1991 and declared a UNESCO World Heritage Site in 1994, recognizing its outstanding universal value.", "The forest dates back over 25,000 years, making it one of Uganda's oldest and most biologically diverse rainforests. It survived the ice ages when other forests disappeared, serving as a refuge for countless species.", "The park is managed by the Uganda Wildlife Authority and is situated along the Democratic Republic of Congo border next to Virunga National Park, on the edge of the Albertine Rift.", "Bwindi protects approximately 400 mountain gorillas - about half of the world's population. Fourteen habituated gorilla groups live in four different sectors: Buhoma, Ruhijja, Rushaga, and Nkuringo, all under UWA management."] },
    geography: { description: "Bwindi Impenetrable National Park is located in southwestern Uganda on the edge of the Albertine Rift, the western branch of the East African Rift. The park covers 331 square kilometres of rugged, mist-covered hillsides blanketed in dense rainforest. Elevations range from 1,160m to 2,607m above sea level. The forest is situated in the districts of Kanungu, Kabale, and Kisoro. Due to its location at the intersection of the Albertine, Congo Basin, and Eastern Africa ecological zones, Bwindi has exceptional biodiversity.", climate: "Bwindi experiences a tropical climate with two rainy seasons from March to May and September to November. The dry seasons from June to August and December to February offer the best trekking conditions. Due to its high altitude, temperatures are generally cool, and mist is common throughout the year, creating the atmospheric conditions that give the forest its mystical appearance." },
    wildlife: { description: "Bwindi Impenetrable National Park is most notable for protecting approximately 400 mountain gorillas - about half of the world's remaining population of this critically endangered species. The park shelters over 120 mammal species and 350 bird species, featuring 23 Albertine Rift endemics. Due to its diverse habitats ranging from 1,160m to 2,706m in altitude, Bwindi is the most important area in Uganda for species diversity.", mammals: ["400 mountain gorillas (half the world's population)", "14 habituated gorilla families for trekking", "Chimpanzees", "L'Hoest's monkey", "Black-and-white colobus", "Blue monkey", "Red-tailed monkey", "Olive baboons", "Forest elephants", "Duikers", "Bushbucks", "Giant forest hogs"], birds: ["350 bird species including 23 Albertine Rift endemics", "African green broadbill", "Shelley's crimsonwing", "Grauer's swamp warbler", "Short-tailed warbler", "Blue-headed sunbird", "Regal sunbird", "Handsome francolin", "Various hornbill species"], flora: ["One of Uganda's oldest rainforests (25,000+ years)", "Almost 400 plant species", "Ancient trees and ferns", "Epiphytic orchids", "Tree ferns", "Dense undergrowth characteristic of 'impenetrable' forest"] },
    culture: { description: "Bwindi Impenetrable National Park is surrounded by communities including the Bakiga people and the indigenous Batwa Pygmies. The Batwa were the original inhabitants of the forest, living as hunter-gatherers for thousands of years before being relocated when the park was created. Their deep knowledge of the forest remains unmatched.", experiences: ["Batwa cultural experience and trail", "Learn about traditional Batwa forest life and survival skills", "Bakiga community visits and cultural performances", "Traditional dance and music shows", "Village walks in Buhoma and Nkuringo", "Craft workshops and local artisan markets", "Community-based tourism initiatives", "Forest walks with local guides"] },
    bestTimeToVisit: { description: "Bwindi Impenetrable National Park can be visited year-round for gorilla trekking, but different seasons offer varying conditions for the experience.", drySeason: { title: "Dry Season (June-August & December-February)", description: "The dry seasons are the most popular time for gorilla trekking as trails are less muddy and more manageable. However, 'dry season' is relative in this rainforest environment - rain is still possible. The forest is less slippery, making the challenging hikes somewhat easier. Gorilla permits are in higher demand during these months, so advance booking (6-12 months) is recommended. Wildlife viewing is excellent as gorillas are still active and relatively easy to locate. The cooler temperatures at this high altitude make trekking more comfortable." }, wetSeason: { title: "Wet Season (March-May & September-November)", description: "The wet seasons bring heavy rainfall, making trails muddy, steep, and slippery. However, this is when the forest is at its most lush and beautiful, living up to its name as an 'impenetrable' jungle. Gorilla trekking continues during these months with fewer tourists, offering a more intimate experience. The wet season offers the most atmospheric and mystical forest experience with mist-shrouded mountains. Proper rain gear and sturdy waterproof boots are essential. Gorilla permits may be easier to obtain during this period." } }
  },
  {
    id: 2,
    name: "Murchison Falls National Park",
    category: "National Park",
    image: getImageUrl("murchison-falls-national-park-uganda-waterfall.webp"),
    images: ["/murchison-falls-national-park-uganda-waterfall.jpg", "/uganda-murchison-falls-waterfall.jpg"],
    country: "Uganda",
    region: "Northwestern Uganda",
    description: "Situated at the northern end of the Albertine Rift Valley, where the sweeping Bunyoro escarpment meets vast, palm-dotted savanna, lies Murchison Falls National Park. Established as a game reserve in 1926, this conservation area is the largest and oldest in Uganda, covering approximately 3,893 square kilometres and boasting a diverse array of wildlife, including 76 species of mammals and 451 species of birds. The park is traversed by the Victoria Nile, which cascades 45 meters over the remnant rift valley wall through a narrow 8-meter-wide gorge, forming the breathtaking Murchison Falls – the park's centerpiece and one of Africa's most powerful waterfalls. The falls mark the point where the river transforms into a wide, tranquil stream that meanders across the rift valley floor before emptying into Lake Albert. This stretch of river is renowned for incredible wildlife sightings, with frequent visitors including elephants, giraffes, and buffaloes. Hippos, Nile crocodiles, and a variety of aquatic birds are permanent residents. Accommodation options include: Bakers Lodge, Budongo Eco Lodge, Chobe Safari Lodge, Kabalega Wilderness Lodge, Murchison River Lodge, Nile Safari Lodge, Pakuba Safari Lodge, Paraa Safari Lodge, Red Chili Hideaway, Yebo Safari Camp, Sambiya River Lodge, and Shoebill Campsite.",
    history: { title: "History & Background", content: ["Murchison Falls National Park was established as a game reserve in 1926 and formally became a national park in 1952, making it the largest and oldest national park in Uganda.", "The park is named after the spectacular Murchison Falls, where the Victoria Nile forces through a narrow 8-meter-wide gorge before plunging 45 meters into the 'Devil's Cauldron' below, creating one of the world's most powerful waterfalls.", "The park covers approximately 3,893 square kilometres in northwestern Uganda and is managed by the Uganda Wildlife Authority. It is part of the larger Murchison Falls Conservation Area, which is 384,000 hectares.", "The Victoria Nile bisects the park from east to west for about 115 kilometres, creating diverse ecosystems and serving as a vital water source for the abundant wildlife."] },
    geography: { description: "Murchison Falls National Park is located in northwestern Uganda, spreading inland from the shores of Lake Albert around the Victoria Nile up to Karuma Falls. The park covers 3,893 square kilometres, making it Uganda's largest national park. It lies at the northern end of the Albertine Rift Valley, where the Bunyoro escarpment meets vast palm-dotted savanna. The Victoria Nile traverses the park for 115 kilometres before flowing into Lake Albert. The landscape features rolling grasslands, riverine forests, and patches of woodland.", climate: "The park experiences a tropical savanna climate with two rainy seasons from March to May and August to November. The dry seasons from December to February and June to July are the best times for game viewing as animals congregate around water sources. Temperatures are generally warm, with cooler conditions near the river and in higher elevations." },
    wildlife: { description: "Murchison Falls National Park is home to a remarkable 144 mammal species, 556 bird species, 51 reptiles, and 51 amphibians. The park hosts significant populations of elephants, giraffes, buffaloes, hippos, Nile crocodiles, and Uganda kobs. The Victoria Nile is lined with wildlife, making boat cruises one of the park's premier attractions.", mammals: ["Elephants", "Rothschild's giraffes (translocated population)", "Buffaloes", "Lions", "Leopards", "Spotted hyenas", "Uganda kobs", "Jackson's hartebeests", "Oribis", "Waterbucks", "Bushbucks", "Warthogs", "Hippos (hundreds along the Victoria Nile)", "Nile crocodiles"], birds: ["556 bird species recorded", "Shoebill stork (rare and sought-after)", "Goliath heron", "African fish eagle", "Malachite kingfisher", "Pied kingfisher", "Grey crowned crane", "Saddle-billed stork", "Yellow-billed stork", "African jacana", "Abyssinian ground hornbill"], flora: ["Palm-dotted savanna grasslands", "Acacia woodlands", "Riverine forest along the Victoria Nile", "Budongo Forest (separate sector with mahogany trees)", "Borassus palm trees"] },
    culture: { description: "Murchison Falls National Park is surrounded by local communities who have lived alongside wildlife for generations. The park area is historically significant to the Bunyoro kingdom, and visitors can learn about the region's rich cultural heritage.", experiences: ["Visit local communities around the park", "Learn about the Bunyoro kingdom history", "Cultural performances and traditional dances", "Community walks and village visits", "Interact with local fishermen on Lake Albert", "Experience traditional crafts and local markets", "Community conservation initiatives"] },
    bestTimeToVisit: { description: "Murchison Falls National Park can be visited year-round, but different seasons offer varying wildlife viewing experiences and conditions.", drySeason: { title: "Dry Season (December-February & June-July)", description: "The dry seasons are the best time to visit for optimal game viewing. Wildlife congregates around the Victoria Nile and permanent water sources, making animals much easier to spot during game drives. The vegetation is shorter and less dense, improving visibility. Boat cruises on the Victoria Nile offer exceptional wildlife viewing with hippos, crocodiles, elephants, buffaloes, and numerous waterbirds. The weather is ideal for photographing Murchison Falls and enjoying the spray and permanent rainbow. Roads are in better condition, making all areas of the park easily accessible." }, wetSeason: { title: "Wet Season (March-May & August-November)", description: "The wet seasons bring lush green landscapes and abundant birdlife, making it an excellent time for birdwatchers as migratory species arrive. Wildlife is more dispersed as water is available throughout the park, making game viewing more challenging but still rewarding. The falls are at their most powerful with increased water flow. Roads can become muddy and challenging, particularly in remote areas. Fewer tourists visit during this period, offering a more exclusive safari experience. The scenery is particularly beautiful with dramatic skies and vibrant vegetation." } }
  },
];

// Placeholder destinations - to be updated with complete information
export const placeholderDestinationsOnly: DestinationOnly[] = [
  {
    id: 1,
    name: "Bwindi Impenetrable Forest",
    category: "National Park",
    image: getImageUrl("bwindi-impenetrable-forest-mountain-gorillas.webp"),
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
    image: getImageUrl("murchison-falls-national-park-uganda-waterfall.webp"),
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
    image: getImageUrl("kampala-uganda-city-skyline.webp"),
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
    image: getImageUrl("uganda-queen-elizabeth-national-park-safari.webp"),
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
    image: getImageUrl("uganda-lake-victoria-sunset.webp"),
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
    image: getImageUrl("uganda-rwenzori-mountains-snow.webp"),
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
    image: getImageUrl("kibale-forest-national-park-chimpanzees.webp"),
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
    image: getImageUrl("jinja-uganda-nile-river-rapids.webp"),
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
    image: getImageUrl("kidepo-valley-national-park-wildlife.webp"),
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
    image: getImageUrl("sipi-falls-uganda-waterfalls.webp"),
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
