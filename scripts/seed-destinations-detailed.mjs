#!/usr/bin/env node
import { PrismaClient } from "../prisma/app/generated/prisma-client/index.js";

const prisma = new PrismaClient();

const destinationsData = [
  {
    id: 28,
    name: "Bwindi Impenetrable National Park",
    historyTitle: "A 25,000-Year-Old Rainforest Sanctuary",
    historyContent: [
      "In 1932, two blocks of the forest were designated as Crown Forest Reserves (Kayonza and Kasatora), which were combined and enlarged in 1942 and renamed the Impenetrable Central Crown Forest.",
      "The forest earned its national park status in 1991 when it was designated as Bwindi Impenetrable National Park to protect its exceptional biodiversity and the critically endangered mountain gorillas.",
      "Gorilla tracking became a tourist activity in April 1993, revolutionizing conservation tourism in Uganda. In 1994, the park was inscribed on the World Heritage List in recognition of its outstanding universal value.",
      "This ancient rainforest, dating back over 25,000 years, is one of the most biologically diverse areas in East Africa, having survived the last ice age when most of Africa's forests disappeared."
    ],
    geographyDescription: "Located in southwestern Uganda on the edge of the Rift Valley, Bwindi's mist-covered hillsides span 331 square kilometers of ancient montane and lowland forest. The park's terrain is characterized by steep ridges and narrow valleys, with elevations ranging from 1,160 to 2,607 meters above sea level. This diverse topography creates multiple ecological zones within the forest.",
    geographyClimate: "Bwindi experiences a tropical climate with temperatures averaging 11-23°C (52-73°F). The park receives high rainfall, with an annual average of 1,400-1,900mm. The climate is influenced by the altitude, with higher elevations experiencing cooler temperatures and heavier mist cover, creating the mystical atmosphere the park is famous for.",
    wildlifeDescription: "Bwindi is home to 400 mountain gorillas—nearly half of the world's remaining population—distributed across 14 habituated family groups in four sectors: Buhoma, Ruhijja, Rushaga, and Nkuringo. The park's biodiversity is staggering, representing one of the richest faunal communities in East Africa with species that have adapted to this ancient ecosystem over millennia.",
    wildlifeMammals: [
      "Mountain Gorillas (400 individuals, half the world's population)",
      "Chimpanzees",
      "L'Hoest's Monkeys",
      "Black-and-white Colobus Monkeys",
      "African Elephants (forest subspecies)",
      "Giant Forest Hogs",
      "African Golden Cats",
      "Duikers (multiple species)",
      "Bushbucks",
      "Leopards"
    ],
    wildlifeBirds: [
      "African Green Broadbill",
      "Grauer's Rush Warbler",
      "Shelley's Crimsonwing",
      "Ruwenzori Turaco",
      "African Wood Owl",
      "Handsome Francolin",
      "Short-tailed Warbler",
      "Western Green Tinkerbird",
      "Yellow-eyed Black Flycatcher",
      "Kivu Ground Thrush"
    ],
    wildlifeFlora: [
      "Over 200 tree species (including 10 endemic species)",
      "Giant Tree Ferns",
      "African Mahogany",
      "Wild Banana Trees",
      "Hagenia Trees",
      "104 species of Ferns",
      "Orchids (multiple species)",
      "Lianas and Vines",
      "Mosses and Lichens",
      "Bamboo Stands (at higher elevations)"
    ],
    cultureDescription: "The Batwa people, often called the 'Keepers of the Forest,' are the original inhabitants of Bwindi, having lived as hunter-gatherers in this forest for thousands of years. When the area was designated as a national park in 1991, the Batwa were evicted from their ancestral home without compensation, fundamentally changing their way of life. Despite this displacement, they remain culturally connected to the forest and its gorillas.",
    cultureExperiences: [
      "Batwa Cultural Trail - Experience traditional hunting techniques, fire-making, and forest medicine gathering",
      "Traditional Batwa dance performances showcasing their rich musical heritage",
      "Learn about the Batwa's spiritual connection to the forest and their traditional conservation practices",
      "Visit Batwa community settlements and support sustainable livelihood projects",
      "Hear oral histories and legends passed down through generations about life in the forest",
      "Participate in traditional pottery and basket weaving workshops"
    ],
    bestTimeDescription: "Bwindi Impenetrable National Park can be visited year-round for gorilla trekking, with each season offering unique experiences. The park's accessibility and trekking conditions vary significantly between dry and wet seasons.",
    drySeasonTitle: "Dry Season (June-August & December-February)",
    drySeasonDescription: "The dry season offers the best trekking conditions with less muddy trails and easier navigation through the steep forest terrain. This is the peak tourist season with higher demand for gorilla permits. Vegetation is less dense, making gorilla photography somewhat easier, though the gorillas may range further in search of food.",
    wetSeasonTitle: "Wet Season (March-May & September-November)",
    wetSeasonDescription: "The wet season sees fewer tourists and lush, vibrant vegetation. Trails can be slippery and challenging, requiring good fitness levels. Gorillas tend to stay closer to lower elevations where food is more abundant, potentially making treks shorter. The forest is at its most beautiful with blooming flowers and active wildlife, perfect for photographers willing to brave the rain."
  },

  {
    id: 29,
    name: "Murchison Falls National Park",
    historyTitle: "Uganda's Oldest and Largest Conservation Area",
    historyContent: [
      "Explorers John Speke and James Grant were the first Europeans to visit the area in 1862. The falls were more thoroughly explored by Samuel and Florence Baker in 1863-64, who named them Murchison Falls after geologist Roderick Murchison, then president of the Royal Geographical Society.",
      "In 1910, the Bunyoro Game Reserve was created south of the River Nile, marking the beginning of formal conservation in the area. The park was officially established as a national park in 1952, becoming Uganda's first and largest protected area.",
      "During the 1960s, Murchison Falls was the most-visited park in Uganda and among Africa's most popular wildlife destinations. However, during Uganda's civil wars in the 1970s and early 1980s, wildlife populations collapsed with only 200 elephants (1.3% of pre-war numbers) surviving by 1995.",
      "Since the restoration of peace, the park has undergone remarkable recovery. Wildlife populations have rebounded significantly, and Murchison Falls has reclaimed its position as one of East Africa's premier safari destinations, demonstrating the resilience of nature when given protection."
    ],
    geographyDescription: "Murchison Falls National Park is Uganda's largest protected area, covering approximately 3,893 square kilometers in northwestern Uganda. The park is bisected by the Victoria Nile, which flows east to west for about 115 kilometers before reaching Lake Albert. The landscape features rolling savanna grasslands, riverine forests, and wooded valleys creating diverse habitats for abundant wildlife.",
    geographyClimate: "The park sits at a relatively low elevation with hot weather year-round. Average daily temperatures peak at 32-33°C (90-91°F), with cooler mornings and evenings. The park is drier than Uganda's forested highlands, creating ideal conditions for savanna wildlife. Two distinct seasons characterize the climate, though the park can be visited year-round.",
    wildlifeDescription: "Murchison Falls hosts one of East Africa's most spectacular wildlife concentrations. The park is home to 144 mammal species and 556 bird species. The Victoria Nile supports Uganda's largest Nile crocodile population and massive pods of hippos. The park contains four of the 'Big Five' (buffalo, leopard, lion, and elephant) and has three-quarters of the world's Rothschild giraffe population.",
    wildlifeMammals: [
      "Rothschild Giraffes (three-quarters of world population)",
      "African Elephants (populations recovering strongly)",
      "Lions (including tree-climbing pride)",
      "Leopards",
      "African Buffalo (large herds)",
      "Nile Crocodiles (largest population in Uganda)",
      "Hippopotamus (massive concentrations)",
      "Ugandan Kob",
      "Jackson's Hartebeest",
      "Oribis",
      "Waterbuck",
      "Bushbucks",
      "Warthogs"
    ],
    wildlifeBirds: [
      "Shoebill Stork (Albert Delta)",
      "Goliath Heron",
      "African Fish Eagle",
      "Malachite Kingfisher",
      "Pied Kingfisher",
      "Giant Kingfisher",
      "Abyssinian Ground Hornbill",
      "Grey Crowned Crane",
      "Saddle-billed Stork",
      "Marabou Stork",
      "African Jacana",
      "Red-throated Bee-eater (thousands migrate here)"
    ],
    wildlifeFlora: [
      "Borassus Palm forests",
      "Acacia trees (various species)",
      "Combretum woodland",
      "Riverine Fig trees",
      "Sausage trees (Kigelia africana)",
      "Savanna grasslands (Themeda and Hyparrhenia species)",
      "Candelabra Euphorbia",
      "Papyrus swamps (especially at Albert Delta)",
      "Tamarind trees",
      "Wild Date Palms"
    ],
    cultureDescription: "The Murchison Falls area has deep cultural significance to the Bunyoro Kingdom and the Alur people. Local communities living around the park maintain traditional lifestyles including fishing on Lake Albert and agriculture. The park's recovery has been supported by community conservation initiatives that benefit local people through tourism revenue and employment.",
    cultureExperiences: [
      "Visit Bunyoro-Kitara Kingdom palace and learn about this ancient monarchy's history",
      "Experience traditional Banyoro and Alur dances and drumming performances",
      "Tour fishing villages along Lake Albert and learn traditional fishing methods",
      "Participate in community-led nature walks with local guides who share indigenous ecological knowledge",
      "Visit local craft markets featuring traditional Bunyoro basket weaving and pottery",
      "Engage with community conservation projects that protect wildlife corridors"
    ],
    bestTimeDescription: "Murchison Falls can be visited year-round, though wildlife viewing quality and accessibility vary with the seasons. The park's low elevation creates hot conditions throughout the year.",
    drySeasonTitle: "Dry Season (December-February & June-July)",
    drySeasonDescription: "The dry season offers the best wildlife viewing as animals concentrate around the Nile and permanent waterholes. Roads are in excellent condition, making game drives more comfortable. Vegetation is less dense, providing better visibility for spotting predators and large herbivores. The spectacular Murchison Falls can be fully appreciated with lower water flow creating clearer views. This is peak season for boat safaris on the Nile.",
    wetSeasonTitle: "Wet Season (March-May & August-November)",
    wetSeasonDescription: "The wet season transforms the park with lush green vegetation and migrating bird species, making it paradise for bird watchers. Wildlife disperses across the park as water becomes available everywhere, making sightings more challenging but more rewarding. The falls are at their most powerful with high water volumes creating dramatic spray. Some roads may become difficult to navigate, limiting access to certain areas. Fewer tourists mean a more exclusive safari experience."
  },

  {
    id: 26,
    name: "Queen Elizabeth National Park",
    historyTitle: "From Royal Visit to Conservation Icon",
    historyContent: [
      "The park was founded in 1952 as Kazinga National Park by combining the Lake George and Lake Edward Game Reserves. These areas had been protected since the early colonial period to preserve the exceptional wildlife populations.",
      "In 1954, following Queen Elizabeth II's visit to Uganda, the park was renamed Queen Elizabeth National Park in her honor. This royal connection brought international attention to Uganda's conservation efforts.",
      "The park has weathered several crises including poaching during Uganda's civil wars in the 1970s and 1980s. Wildlife populations declined dramatically, but dedicated conservation efforts since the 1990s have restored the park to its former glory.",
      "Today, Queen Elizabeth National Park stands as one of Africa's greatest wildlife havens and Uganda's most popular safari destination, showcasing successful conservation and community partnerships."
    ],
    geographyDescription: "Spanning approximately 1,978 square kilometers in southwestern Uganda, Queen Elizabeth National Park encompasses remarkable ecological diversity. Nestled between the majestic Rwenzori Mountains and the shores of Lake Edward, the park features savannahs, wetlands, lowland forests, and volcanic crater lakes. The park sits astride the equator, with monuments marking this unique geographical position.",
    geographyClimate: "The park enjoys a pleasant climate with moderate temperatures year-round, cooled by its proximity to the Rwenzori Mountains and the Great Rift Valley lakes. Average temperatures range from 18-28°C (64-82°F). The region receives bimodal rainfall with two wet and two dry seasons, creating dynamic seasonal changes in the landscape and wildlife behavior.",
    wildlifeDescription: "Queen Elizabeth National Park is home to over 95 mammal species and an astonishing 600+ bird species, making it one of the highest biodiversity areas in Africa. The park is famous for its tree-climbing lions in the Ishasha sector, large elephant herds, and the highest concentration of hippos along the Kazinga Channel—one of nature's greatest wildlife spectacles.",
    wildlifeMammals: [
      "Tree-climbing Lions (Ishasha sector)",
      "African Elephants (large herds)",
      "Hippopotamus (highest concentration in East Africa)",
      "African Buffalo",
      "Leopards",
      "Uganda Kob (tens of thousands)",
      "Giant Forest Hogs",
      "Chimpanzees (Kyambura Gorge)",
      "Warthogs",
      "Waterbuck",
      "Topi",
      "Bushbuck",
      "Spotted Hyena"
    ],
    wildlifeBirds: [
      "African Skimmer",
      "Shoebill Stork",
      "Pink-backed Pelican",
      "Great White Pelican",
      "African Fish Eagle",
      "Martial Eagle",
      "Grey Crowned Crane",
      "Papyrus Gonolek",
      "White-winged Warbler",
      "Papyrus Canary",
      "Malachite Kingfisher",
      "Pied Kingfisher",
      "Yellow-throated Longclaw"
    ],
    wildlifeFlora: [
      "Acacia woodlands",
      "Candelabra Euphorbia forests",
      "Papyrus swamps (extensive along Kazinga Channel)",
      "Fig trees (favorite of tree-climbing lions)",
      "Savanna grasses",
      "Marantaceae forest (Maramagambo Forest)",
      "Salt-resistant vegetation (near crater lakes)",
      "Wild Date Palms",
      "Phoenix Palms",
      "Ficus species (various)"
    ],
    cultureDescription: "The park is surrounded by vibrant communities including the Basongora, Banyabindi, and Bakonzo people. These communities have traditional connections to the land and its resources. Community conservation programs have created positive relationships between local people and wildlife conservation.",
    cultureExperiences: [
      "Visit traditional Basongora cattle-keeping communities and learn about their nomadic heritage",
      "Experience Kikorongo community cultural performances featuring traditional dances and music",
      "Tour local craft villages specializing in basket weaving and traditional pottery",
      "Participate in community-led nature walks through buffer zones with indigenous guides",
      "Visit salt works at Lake Katwe where salt has been harvested for centuries using traditional methods",
      "Engage with women's cooperatives producing crafts from sustainable materials"
    ],
    bestTimeDescription: "Queen Elizabeth National Park offers excellent wildlife viewing year-round, though experiences vary significantly between seasons. The park's diverse ecosystems remain productive throughout the year.",
    drySeasonTitle: "Dry Season (June-September & December-January)",
    drySeasonDescription: "The dry months provide optimal wildlife viewing as animals concentrate around permanent water sources like the Kazinga Channel and crater lakes. Roads are in excellent condition for game drives. The famous tree-climbing lions are easier to spot as they seek shade in fig trees. Chimpanzee tracking in Kyambura Gorge is more comfortable. Boat cruises on Kazinga Channel reveal massive hippo pods and diverse birdlife along the shores.",
    wetSeasonTitle: "Wet Season (March-May & October-November)",
    wetSeasonDescription: "The wet season transforms the park into a verdant paradise with lush vegetation and blooming wildflowers. Migratory bird species arrive, creating spectacular birding opportunities with over 600 species possible. Wildlife disperses across the park, making sightings more challenging but rewarding. The Ishasha plains are particularly beautiful. Fewer tourists mean more exclusive safari experiences and better rates at lodges. Some roads may require 4x4 vehicles."
  },

  {
    id: 24,
    name: "Kibale National Park",
    historyTitle: "The Evolution of the Primate Capital",
    historyContent: [
      "Kibale Forest was gazetted as a Crown Forest Reserve in 1932 during British colonial rule, primarily for timber production. However, logging practices in the following decades, while extensive, never completely destroyed the forest's ecological integrity.",
      "Recognizing the forest's exceptional biodiversity and importance for primate conservation, the Kibale Forest Reserve was transferred to Uganda National Parks in 1993. It was amalgamated with the nearby Forest Corridor Game Reserve to form the present Kibale National Park.",
      "Since 1993, the Kanyanchu chimpanzee community has been intensively studied and habituated to human presence through the Kibale Chimpanzee Project, one of Africa's longest-running primate research programs. This habituation has made Kibale the premier destination for chimpanzee tracking in East Africa.",
      "Today, Kibale National Park represents one of Africa's finest examples of successful forest conservation, balancing scientific research, tourism, and community development while protecting one of the continent's most important primate populations."
    ],
    geographyDescription: "Covering 795 square kilometers in western Uganda, Kibale National Park protects one of Africa's most beautiful and diverse tropical forests. The park consists primarily of mid-altitude moist evergreen forest in the north, which gradually transitions into woodland and savanna in the south. This varied terrain creates multiple ecological niches that support exceptional biodiversity.",
    geographyClimate: "Kibale enjoys a pleasant tropical climate with relatively constant temperatures year-round. Daytime temperatures average around 27°C (81°F), dropping to approximately 15°C (59°F) at night. The forest receives significant rainfall, particularly during two wet seasons, maintaining its lush character. Morning mists are common, creating the ethereal atmosphere that makes forest walks magical.",
    wildlifeDescription: "Kibale National Park is globally renowned as the 'Primate Capital of the World' due to its exceptional primate diversity and density. The park is home to over 1,200 East African chimpanzees, with habituation success rates exceeding 90% for the tourism groups. Thirteen primate species coexist in this forest, along with diverse mammals, 325 bird species, and over 250 butterfly species.",
    wildlifeMammals: [
      "East African Chimpanzees (over 1,200 individuals)",
      "Red Colobus Monkeys",
      "L'Hoest's Monkeys",
      "Black-and-white Colobus",
      "Red-tailed Monkeys",
      "Blue Monkeys",
      "Grey-cheeked Mangabeys",
      "Olive Baboons",
      "African Elephants (forest population)",
      "African Buffalo",
      "Giant Forest Hogs",
      "Bushbucks",
      "Sitatungas",
      "Red and Blue Duikers",
      "Leopards (elusive)"
    ],
    wildlifeBirds: [
      "Kibale Ground Thrush (endemic subspecies)",
      "Green-breasted Pitta",
      "African Pitta",
      "Black Bee-eater",
      "Yellow-spotted Barbet",
      "African Grey Parrot",
      "Blue-headed Sunbird",
      "Nahan's Francolin",
      "White-naped Pigeon",
      "Western Tinkerbird",
      "Olive Long-tailed Cuckoo",
      "Purple-headed Starling"
    ],
    wildlifeFlora: [
      "Mahogany trees (some reaching 55 meters)",
      "Giant Fig trees (Ficus species)",
      "African Olive trees",
      "Ironwood trees",
      "Wild Rubber trees",
      "Tree Ferns",
      "Strangler Figs",
      "Polita forest undergrowth",
      "Orchids (numerous species)",
      "Lianas and climbing vines",
      "Forest floor herbs and ferns"
    ],
    cultureDescription: "The communities surrounding Kibale, including the Batooro and Bakiga people, have traditional connections to the forest and its resources. Community conservation programs have created partnerships that benefit both local livelihoods and forest protection. The Bigodi Wetland Sanctuary, managed by local communities, demonstrates successful community-based conservation.",
    cultureExperiences: [
      "Visit Bigodi Wetland Sanctuary - a community-run ecotourism project with excellent birding",
      "Participate in traditional Batooro cultural performances featuring royal dances and music",
      "Tour tea plantations surrounding the park and learn about tea production from local farmers",
      "Engage with community craft cooperatives producing baskets, jewelry, and traditional textiles",
      "Join village walks to experience rural Ugandan life and traditional homesteads",
      "Support women's groups involved in sustainable harvesting of forest products"
    ],
    bestTimeDescription: "Kibale National Park can be visited year-round for chimpanzee tracking, with each season offering different advantages. The park's evergreen forest remains lush and productive throughout the year, though trekking conditions vary seasonally.",
    drySeasonTitle: "Dry Season (December-February & June-July)",
    drySeasonDescription: "The drier months provide the most comfortable conditions for chimpanzee trekking with less muddy trails and clearer forest paths. Chimpanzees are somewhat easier to locate as they frequent fruit trees that are more concentrated during this period. Photography conditions are favorable with better lighting filtering through the canopy. This is peak tourist season, so booking permits well in advance is essential.",
    wetSeasonTitle: "Wet Season (March-May & September-November)",
    wetSeasonDescription: "The wet season sees the forest at its most lush and productive. Chimpanzees have abundant food distributed throughout the forest, which can make tracking more challenging but also more adventurous. Trails can be muddy and slippery, requiring good fitness and waterproof gear. Bird watching is exceptional with resident species joined by migrants. Fewer tourists mean more intimate wildlife encounters and readily available tracking permits."
  },

  {
    id: 20,
    name: "Lake Mburo National Park",
    historyTitle: "A Park Shaped by Pastoralism and Conservation",
    historyContent: [
      "Lake Mburo was originally gazetted in 1933 as a controlled hunting area, reflecting early colonial conservation approaches. In 1963, it was upgraded to a game reserve to provide greater protection to the area's unique savanna wildlife.",
      "In 1983, the reserve was elevated to national park status. However, this created conflict with the Banyankole Bahima pastoralists who had traditionally grazed their Ankole cattle in the area for generations. These communities were expelled from their ancestral lands, causing deep resentment.",
      "In 1985, following political changes in Uganda, the previous residents re-occupied the park, expelling staff, destroying infrastructure, and killing wildlife. Less than half of the park's original area was eventually re-gazetted by the government in 1986.",
      "Today, Lake Mburo represents a unique model of conservation where Ankole cattle graze peacefully alongside wild zebras and antelopes, demonstrating that traditional pastoralism and wildlife can coexist when managed appropriately."
    ],
    geographyDescription: "Lake Mburo National Park, located in Kiruhura District in western Uganda, is the smallest of Uganda's savanna parks but remarkably diverse. Situated approximately 30 kilometers east of Mbarara and 240 kilometers west of Kampala, the park's 260 square kilometers encompass acacia woodlands, rocky ridges, seasonal and permanent swamps, and five picturesque lakes. Wetlands cover 20% of the park, forming part of a 50-kilometer wetland system.",
    geographyClimate: "The park lies in a rain shadow between Lake Victoria and the Rwenzori Mountains, resulting in lower rainfall than surrounding areas. This creates ideal savanna conditions. The climate is tropical with bimodal rainfall patterns. Temperatures range between 23-25°C (73-77°F), making it pleasant year-round for game viewing and outdoor activities.",
    wildlifeDescription: "Despite its small size, Lake Mburo hosts impressive biodiversity that cannot be found together anywhere else in Uganda. The park is Uganda's only location for impalas and the best place to see zebras, with over 5,000 individuals. The wetlands support healthy populations of hippos and crocodiles, while the savanna sustains diverse antelope species and predators.",
    wildlifeMammals: [
      "Burchell's Zebras (over 5,000 - largest population in Uganda)",
      "Impalas (only population in Uganda)",
      "African Buffalo",
      "Hippopotamus",
      "Eland (Africa's largest antelope)",
      "Topi",
      "Defassa Waterbuck",
      "Klipspringers",
      "Oribi",
      "Bushbucks",
      "Leopards",
      "Spotted Hyenas",
      "Side-striped Jackals",
      "Rothschild Giraffes (recently reintroduced)"
    ],
    wildlifeBirds: [
      "African Finfoot (rare wetland species)",
      "Shoebill Stork (occasional sightings)",
      "Papyrus Yellow Warbler",
      "African Fish Eagle",
      "Saddle-billed Stork",
      "Brown-chested Lapwing",
      "African Wattled Lapwing",
      "Red-faced Barbet",
      "Green Wood-hoopoe",
      "Rufous-bellied Heron",
      "Bare-faced Go-away-bird",
      "Nubian Woodpecker"
    ],
    wildlifeFlora: [
      "Acacia woodlands (dominant vegetation)",
      "Papyrus swamps",
      "Thicket vegetation on rocky hillsides",
      "Savanna grasslands",
      "Euphorbia candelabra trees",
      "Wild Sisal plants",
      "Combretum woodland",
      "Ficus trees near water sources",
      "Whistling Thorn Acacias",
      "Lake shore aquatic vegetation"
    ],
    cultureDescription: "The Banyankole people, particularly the Bahima pastoralist clan, have deep cultural connections to this landscape. They are famous for raising Ankole cattle, a magnificent long-horned breed that has been central to their identity for centuries. The relationship between the park and local communities has evolved from conflict to cooperation.",
    cultureExperiences: [
      "Visit Bahima communities and learn about traditional Ankole cattle rearing practices",
      "Experience Ankole long-horned cattle - some of Africa's most beautiful cattle with horns spanning up to 2.4 meters",
      "Participate in traditional milk processing and taste local dairy products",
      "Learn about the cultural significance of cattle in Ankole society and bride price traditions",
      "Engage with community conservation initiatives around the park",
      "Visit local craft markets featuring traditional basket weaving and pottery"
    ],
    bestTimeDescription: "Lake Mburo National Park can be visited comfortably year-round due to its moderate climate and relatively low rainfall. The park's small size makes it an excellent destination for short safaris from Kampala or as an add-on to western circuit itineraries.",
    drySeasonTitle: "Dry Season (June-August & December-February)",
    drySeasonDescription: "The dry season offers excellent game viewing as wildlife concentrates around the lakes and permanent water sources. The park's extensive network of tracks becomes easily accessible, perfect for game drives and guided nature walks. Boat safaris on Lake Mburo provide exceptional opportunities to see hippos, crocodiles, and water birds. The dry plains make it easier to spot predators and the large zebra herds are particularly visible.",
    wetSeasonTitle: "Wet Season (March-May & September-November)",
    wetSeasonDescription: "During the wet season, the park transforms with lush green vegetation and abundant wildflowers. Migratory bird species arrive, boosting the park's bird count significantly - a paradise for ornithologists. Wildlife disperses across the expanded grazing areas, making sightings more distributed but rewarding. The landscape becomes particularly photogenic with dramatic skies and vibrant scenery. Some tracks may become challenging after heavy rains, but the main circuits remain accessible."
  },

  {
    id: 22,
    name: "Rwenzori Mountains National Park",
    historyTitle: "The Legendary Mountains of the Moon",
    historyContent: [
      "The Rwenzori Mountains were first documented by the ancient geographer Ptolemy in AD 150, who referred to them as the 'Mountains of the Moon,' believing them to be the source of the Nile River. This mysterious name captured imaginations for centuries.",
      "On May 24, 1888, the explorer Henry Stanley officially placed the Rwenzoris on the world map, recording the name 'Ruwenzori,' which he documented as meaning 'Rain-Maker' or 'Cloud-King' in the local language—a fitting description for these perpetually mist-shrouded peaks.",
      "The park was gazetted in 1991 to protect the extraordinary mountain ecosystem. In 1994, it was declared a UNESCO World Heritage Site in recognition of its outstanding natural beauty and unique biodiversity. In 2008, it was further designated a Ramsar Wetland of International Importance.",
      "History was made in 2010 when Ms. Beryl Park, at age 78, became the oldest recorded climber to reach Margherita Peak at 5,109 meters, demonstrating that the Rwenzoris continue to challenge and inspire adventurers of all ages."
    ],
    geographyDescription: "The Rwenzori Mountains form a 120-kilometer-long and 65-kilometer-wide massif straddling the Uganda-Congo border. Unlike East Africa's volcanic mountains (Kilimanjaro, Mount Kenya, Elgon), the Rwenzoris were formed by tectonic uplift, with massive crystalline rock blocks thrust upward from the Western Rift Valley floor. The range features dramatic glaciated peaks, deep valleys, and pristine mountain lakes, with elevations from 1,670 to 5,109 meters creating multiple distinct ecological zones.",
    geographyClimate: "The Rwenzoris experience an equatorial mountain climate with nearly constant temperatures year-round at each altitude zone. Heavy rainfall and persistent mist create the perpetually wet conditions that sustain the mountains' unique vegetation. At higher elevations, dramatic temperature fluctuations between day and night can exceed 40°C. The summit zone experiences freezing conditions with glaciers, though these are rapidly receding due to climate change.",
    wildlifeDescription: "The Rwenzoris harbor exceptional biodiversity across their altitudinal gradient. The mountains support 70 mammal species and 217 bird species, including numerous Albertine Rift endemics found nowhere else on Earth. The vegetation is the star attraction—an otherworldly botanical paradise where giant forms of familiar plants create an Alice-in-Wonderland landscape draped in moss and lichens.",
    wildlifeMammals: [
      "Rwenzori Colobus Monkeys",
      "L'Hoest's Monkeys",
      "Blue Monkeys",
      "Forest Elephants (occasional)",
      "Rwenzori Duikers",
      "Hyraxes (Rock and Tree)",
      "Giant Forest Hogs",
      "Leopards",
      "African Golden Cats",
      "Bushbucks"
    ],
    wildlifeBirds: [
      "Rwenzori Turaco",
      "Handsome Francolin",
      "Rwenzori Batis",
      "Rwenzori Double-collared Sunbird",
      "Golden-winged Sunbird",
      "Stripe-breasted Tit",
      "Montane Masked Apalis",
      "Kivu Ground Thrush",
      "Scarlet-tufted Malachite Sunbird",
      "Lammergeier (Bearded Vulture)",
      "Western Green Tinkerbird",
      "Ruwenzori Hill Babblers"
    ],
    wildlifeFlora: [
      "Giant Groundsels (Dendrosenecio - up to 8 meters tall)",
      "Giant Lobelias (up to 3 meters tall)",
      "Giant Heathers (tree heathers reaching 15 meters)",
      "Everlasting Flowers (Helichrysum)",
      "Bamboo forests (2,500-3,000m elevation)",
      "Hagenia-Rapanea montane forest",
      "Tussock grasses",
      "Sphagnum moss bogs",
      "Multiple orchid species",
      "Tree ferns and ground ferns (104 species)",
      "Lichens and mosses (creating the 'mossy wonderland' effect)"
    ],
    cultureDescription: "The Bakonzo people have lived on the lower slopes of the Rwenzoris for centuries, developing intimate knowledge of the mountain ecosystem. Their traditional beliefs include spirits residing in the mountains, and they have historically used the forest for hunting, gathering, and traditional medicine. Community partnerships now integrate local knowledge with conservation efforts.",
    cultureExperiences: [
      "Learn about Bakonzo traditional beliefs regarding the mountain spirits and creation myths",
      "Experience traditional Bakonzo dances and music performances at cultural centers",
      "Tour community-run campsites that provide employment and revenue for local families",
      "Participate in traditional medicine plant walks with Bakonzo elders",
      "Visit local schools and community projects supported by tourism revenue",
      "Engage with women's cooperatives producing crafts and providing porter services"
    ],
    bestTimeDescription: "The Rwenzoris can be climbed year-round, but conditions vary dramatically between seasons. The mountains' position in the Congo Basin weather system means rain is possible any day of the year, though some periods are significantly drier.",
    drySeasonTitle: "Dry Season (January & June-July)",
    drySeasonDescription: "The drier months offer the best conditions for mountaineering, with relatively less rainfall making trails less muddy and river crossings safer. Clear weather windows are more frequent, providing better views and photography opportunities. However, even during the 'dry' season, trekkers should expect rain and prepare accordingly. These are the most popular months for summit attempts to Margherita Peak. The unique vegetation is at its most accessible with drier trails through the moorland and bog zones.",
    wetSeasonTitle: "Wet Season (February-May & August-December)",
    wetSeasonDescription: "The wet season sees heavy rainfall creating extremely challenging trekking conditions with muddy, slippery trails and flooded river crossings. However, the vegetation is at its most lush and magnificent, with giant lobelias and groundsels in full bloom. Waterfalls are spectacular with high volumes. Fewer trekkers mean more solitude in this pristine wilderness. Only experienced mountaineers should attempt summit climbs during these months. The mystical atmosphere created by constant mist and clouds gives the mountains their legendary character."
  },

  {
    id: 21,
    name: "Mount Elgon National Park",
    historyTitle: "Africa's Ancient Volcanic Frontier",
    historyContent: [
      "Mount Elgon is an extinct shield volcano and one of Uganda's oldest geological formations, with its first eruption occurring approximately 24 million years ago. This makes it significantly older than other East African mountains like Kilimanjaro and Mount Kenya.",
      "The mountain has been a critical water source for local communities for millennia. Archaeological evidence shows that caves on the mountain, particularly the famous elephant caves, have been used by humans and animals for thousands of years to mine salt and minerals.",
      "Mount Elgon National Park was established as a protected area in 1993, creating a transboundary conservation area with Kenya's Mount Elgon National Park. This cross-border cooperation protects the mountain's unique ecosystem and allows wildlife to move freely across the international boundary.",
      "The park's conservation is enhanced by its designation as a UNESCO Man and Biosphere Reserve, recognizing its exceptional biodiversity and the successful integration of conservation with sustainable community development on the lower slopes."
    ],
    geographyDescription: "Mount Elgon boasts the largest volcanic base in the world, covering an area of approximately 4,000 square kilometers. The mountain's vast form stretches 60 kilometers in diameter, rising over 3,000 meters above the surrounding plains. The summit is not a peak but rather one of the world's largest intact volcanic calderas, spanning 40 square kilometers—large enough to hold the entire Mount Longonot National Park. Wagagai Peak, at 4,321 meters, is Uganda's second-highest mountain.",
    geographyClimate: "Mount Elgon experiences a montane climate with temperature variation based on altitude. The lower slopes are warm, while higher elevations become progressively cooler. The mountain receives high rainfall, particularly on the windward western slopes, supporting lush montane forests. The caldera creates its own microclimate with unique weather patterns. Clear mornings are common, with clouds typically forming by afternoon.",
    wildlifeDescription: "Mount Elgon's diverse elevation zones from 2,000 to 4,321 meters create varied habitats supporting over 300 bird species and numerous mammals. The mountain is famous for its elephants that enter deep caves to mine salt from the volcanic rock walls—a behavior documented nowhere else in Africa. The park's wildlife has adapted to the challenging mountain terrain and cooler temperatures.",
    wildlifeMammals: [
      "Forest Elephants (famous cave-dwelling population)",
      "African Buffalo",
      "Black-and-white Colobus Monkeys",
      "Blue Monkeys",
      "Red-tailed Monkeys",
      "Olive Baboons",
      "Bushbucks",
      "Duikers",
      "Giant Forest Hogs",
      "Leopards (rarely seen)",
      "Serval Cats",
      "Rock Hyrax",
      "Spotted Hyenas"
    ],
    wildlifeBirds: [
      "Lammergeier (Bearded Vulture)",
      "Jackson's Francolin (endemic subspecies)",
      "Moorland Francolin",
      "Alpine Chat",
      "Hunter's Cisticola",
      "Tacazze Sunbird",
      "Black-collared Apalis",
      "White-starred Robin",
      "African Goshawk",
      "Mountain Buzzard",
      "Hartlaub's Turaco",
      "Bronze Sunbird"
    ],
    wildlifeFlora: [
      "Podocarpus forest (dominant at mid-elevation)",
      "Juniper trees",
      "Bamboo forests (extensive zones)",
      "Giant Groundsels (in moorland zones)",
      "Giant Lobelias",
      "Hagenia trees",
      "St. John's Wort trees",
      "Tree ferns",
      "Helichrysum (Everlasting flowers)",
      "Tussock grasses (upper slopes)",
      "Moss and lichens",
      "Dendrosenecio elgonensis (endemic giant groundsel species)"
    ],
    cultureDescription: "The Bagisu people on the Uganda side and the Kalenjin (Sabaot) on the Kenyan side have profound cultural connections to Mount Elgon. The Bagisu are famous for their Imbalu circumcision ceremony, one of East Africa's most significant cultural rites. The mountain is central to their cultural identity and traditional practices.",
    cultureExperiences: [
      "Learn about the Imbalu circumcision ceremony - a UNESCO-recognized cultural practice of the Bagisu people",
      "Experience traditional Bagisu dance and drumming performances",
      "Visit Sipi Falls area and tour coffee plantations, learning the bean-to-cup process",
      "Participate in rock climbing and abseiling at Sipi Falls with local guides",
      "Engage with the Sabiny people and learn about their honey harvesting traditions",
      "Visit local craft markets featuring traditional basket weaving and woodcarving",
      "Tour community schools and development projects supported by park tourism"
    ],
    bestTimeDescription: "Mount Elgon can be climbed year-round, though the dry seasons offer the most comfortable trekking conditions. The mountain's position on the Uganda-Kenya border means it receives weather from both regions, creating somewhat unpredictable conditions.",
    drySeasonTitle: "Dry Season (June-August & December-February)",
    drySeasonDescription: "The dry season provides ideal conditions for hiking and trekking with less muddy trails and clearer skies for panoramic views. The famous Sipi Falls is still impressive but more accessible for viewing and photography. Wildlife is more easily spotted as animals concentrate around remaining water sources. Summit attempts to Wagagai Peak have higher success rates with more stable weather. The spectacular caldera is more frequently visible without cloud cover. Local guides report these months as best for exploring the unique elephant caves.",
    wetSeasonTitle: "Wet Season (March-May & September-November)",
    wetSeasonDescription: "The wet season transforms Mount Elgon into a verdant paradise with lush vegetation and spectacular waterfalls at maximum flow. Sipi Falls and other cascades are at their most dramatic and photogenic. Birding is exceptional with both resident and migratory species active. Trails become challenging with muddy, slippery conditions requiring good fitness and waterproof gear. The caldera often fills with mist, creating an ethereal atmosphere. Fewer trekkers mean more solitude and intimate encounters with nature. Local communities are busy with agricultural activities, offering authentic cultural experiences."
  },

  {
    id: 25,
    name: "Kidepo Valley National Park",
    historyTitle: "Uganda's Remote Wilderness Jewel",
    historyContent: [
      "Kidepo Valley National Park was gazetted in 1962 during the final years of British colonial rule, established to protect the exceptional wildlife populations in Uganda's remote northeast corner. The park's isolation has been both its blessing and its curse.",
      "During Uganda's civil conflicts in the 1970s and 1980s, the park suffered severely from poaching and lack of management. Wildlife populations plummeted, and infrastructure was destroyed. For many years, Kidepo was Uganda's forgotten park, visited by fewer than 100 tourists annually.",
      "Since the restoration of security in the Karamoja region in the mid-2000s, Kidepo has undergone remarkable recovery. Wildlife populations have rebounded dramatically—elephants increased from just 200 in the 1990s to between 650-1,000 today, while lion numbers have grown to approximately 132 individuals.",
      "Despite remaining Uganda's most isolated national park, approximately 520 kilometers from Kampala, Kidepo is now recognized as one of Africa's finest wilderness areas. Those who make the journey are rewarded with pristine savanna landscapes and wildlife experiences reminiscent of East Africa's golden age of safari."
    ],
    geographyDescription: "Kidepo Valley National Park lies in the rugged, semi-arid valleys between Uganda's borders with South Sudan and Kenya, covering 1,442 square kilometers. The park features two valley systems: the Kidepo and Narus valleys, separated by mountain ranges. The landscape is characterized by open savanna plains, rocky outcrops, and seasonal rivers that only flow during the rainy season. Mount Morungole rises dramatically from the plains, reaching 2,750 meters.",
    geographyClimate: "Kidepo experiences a semi-arid climate with hot days and cool nights. Daytime temperatures can exceed 35°C (95°F), while nights can drop to 15°C (59°F). The park receives lower rainfall than most Ugandan parks, averaging 700-900mm annually, concentrated in two rainy seasons. During the dry season, the Narus Valley's permanent waterholes become the only water source for miles, concentrating wildlife in spectacular densities.",
    wildlifeDescription: "Kidepo boasts 77 mammal species including many found nowhere else in Uganda. The park offers East Africa's most spectacular predator viewing, with 20 carnivore species including healthy populations of lions, leopards, cheetahs, and spotted hyenas. The park's isolation has preserved wildlife behaviors rarely seen elsewhere. During the dry season, the Narus Valley becomes one of Uganda's premier wildlife viewing destinations.",
    wildlifeMammals: [
      "Lions (approximately 132 individuals - best lion viewing in Uganda)",
      "Elephants (650-1,000, recovering population)",
      "African Buffalo (large herds)",
      "Rothschild Giraffes",
      "Cheetahs (only population in Uganda)",
      "Leopards",
      "Spotted Hyenas",
      "Black-backed Jackals",
      "Bat-eared Foxes",
      "Caracals",
      "Aardwolves",
      "Greater and Lesser Kudus",
      "Eland",
      "Oryx (beisa)",
      "Jackson's Hartebeest",
      "Bohor Reedbuck",
      "Klipspringers",
      "Zebras"
    ],
    wildlifeBirds: [
      "Ostrich (only park in Uganda with wild ostriches)",
      "Kori Bustard",
      "Secretary Bird",
      "Abyssinian Ground Hornbill",
      "Karamoja Apalis (endemic)",
      "Black-breasted Barbet",
      "Jackson's Hornbill",
      "Pygmy Falcon",
      "Egyptian Vulture",
      "Verreaux's Eagle",
      "Fox's Weaver",
      "Golden Pipit"
    ],
    wildlifeFlora: [
      "Umbrella Acacia trees (iconic savanna trees)",
      "Desert Date trees",
      "Whistling Thorn Acacias",
      "Borassus Palms (along seasonal rivers)",
      "Commiphora species (myrrh trees)",
      "Combretum woodland",
      "Semi-arid savanna grasses",
      "Euphorbia candelabra",
      "Aloe species",
      "Acacia drepanolobium",
      "Baobabs (occasional)",
      "Terminalia species"
    ],
    cultureDescription: "The Karamojong people are one of Uganda's most traditional communities, having maintained their pastoral lifestyle and distinctive culture into the modern era. They are cattle herders who have lived in the region for centuries, with cattle being central to their social, economic, and spiritual life. The nearby Ik people, living on Mount Morungole, represent one of Uganda's smallest ethnic groups.",
    cultureExperiences: [
      "Visit traditional Karamojong manyatta (homesteads) and learn about their pastoral lifestyle",
      "Experience Karamojong cultural dances, including the spectacular edonga dance ritual",
      "Learn about the importance of cattle in Karamojong society and traditional cattle keeping practices",
      "Observe traditional crafts including beadwork, pottery, and basketry",
      "Meet the Ik people - one of Uganda's most isolated communities on Mount Morungole",
      "Participate in cultural ceremonies and celebrations (when permitted)",
      "Support community tourism initiatives that benefit local villages"
    ],
    bestTimeDescription: "Wildlife viewing in Kidepo varies dramatically with the seasons. During the dry season, the park ranks among Africa's finest safari destinations, while the wet season transforms the landscape but disperses wildlife.",
    drySeasonTitle: "Dry Season (September-March, especially January-March)",
    drySeasonDescription: "The dry season is the absolute best time to visit Kidepo, particularly the late dry season from January to March when the Narus Valley becomes the only reliable water source for wildlife for many miles. Animals concentrate around the permanent waterholes in spectacular numbers—hundreds of buffalo, elephant herds, and exceptional predator viewing with lions visible almost daily. The sparse vegetation provides excellent visibility for photography and game viewing. Road conditions are optimal for exploring the entire park. This is when Kidepo truly shines as one of Africa's great wilderness destinations.",
    wetSeasonTitle: "Wet Season (April-August, peak in April-May)",
    wetSeasonDescription: "The wet season transforms Kidepo's semi-arid landscape into a green paradise with wildflowers blooming across the plains. Migratory birds arrive, boosting the park's bird count significantly with spectacular birding opportunities. Wildlife disperses across the park as temporary waterholes fill, making game viewing more challenging but rewarding for those who venture further. The dramatic skies and transformed landscape create stunning photographic opportunities. Some remote areas may become inaccessible due to flooding of seasonal rivers. Fewer tourists mean more exclusive wilderness experiences. The Karamojong manyattas are particularly active with agricultural and pastoral activities."
  },

  {
    id: 23,
    name: "Semuliki National Park",
    historyTitle: "Uganda's Gateway to Central African Biodiversity",
    historyContent: [
      "Semuliki Forest represents the easternmost extension of the great Ituri Forest of the Congo Basin, one of Africa's most ancient forests that survived the last ice age 12,000-18,000 years ago. This makes it one of the oldest and most biodiverse forests in Africa.",
      "The area was initially protected as a forest reserve during the colonial period, recognized for its unique flora and fauna that differed markedly from typical East African ecosystems. Local communities, including the Batwa pygmies originally from the Congo, had long inhabited and used the forest sustainably.",
      "In 1993, Semuliki Forest Reserve was upgraded to national park status, becoming Uganda's newest national park at that time. This designation aimed to protect the forest's exceptional biodiversity and its importance as a refuge for Central African species at the eastern limit of their range.",
      "The park's name comes from the Semuliki River, which forms the international boundary with the Democratic Republic of Congo. The park serves as a critical link in the Congo-Nile watershed, making it ecologically significant beyond Uganda's borders."
    ],
    geographyDescription: "Semuliki National Park sprawls across 220 square kilometers on the remote western side of the Rwenzori Mountains in Uganda's Albertine Rift Valley. The park is dominated by lowland tropical rainforest—the only true lowland tropical forest in East Africa. The Semuliki River meanders through the park, forming the Uganda-Congo border. The landscape includes riverine forests, grassland savanna patches, and the remarkable Sempaya hot springs formed by geothermal activity along the rift valley fault lines.",
    geographyClimate: "The park experiences an equatorial climate with high temperatures and humidity year-round. Average temperatures range from 18-30°C (64-86°F). Rainfall is substantial with an average of 1,250mm annually, concentrated in two wet seasons. The forest remains lush throughout the year, creating the steamy, humid conditions characteristic of Congo Basin forests. Morning mists are common, and the air is heavy with moisture.",
    wildlifeDescription: "Semuliki's wildlife is unique in Uganda, featuring numerous Central African species found nowhere else in East Africa. The park is home to over 53 mammal species and an exceptional 441 bird species—more than any other protected area in Uganda. The forest elephants, Central African red colobus, and numerous bird species are typical of the Ituri Forest rather than East African ecosystems.",
    wildlifeMammals: [
      "Forest Elephants (Central African subspecies)",
      "Central African Red Colobus (only East African population)",
      "Dent's Mona Monkey (only East African population)",
      "Black-and-white Colobus",
      "Blue Monkeys",
      "Red-tailed Monkeys",
      "Olive Baboons",
      "Forest Buffalo",
      "Water Chevrotain",
      "Sitatungas",
      "Bay Duikers",
      "Bushbucks",
      "Leopards",
      "African Civets"
    ],
    wildlifeBirds: [
      "African Piculet (only site in East Africa)",
      "Red-billed Dwarf Hornbill",
      "Lyre-tailed Honeyguide",
      "Spot-breasted Ibis",
      "Hartlaub's Duck",
      "White-crested Hornbill",
      "Red-rumped Tinkerbird",
      "Forest Ground Thrush",
      "Western Bronze-naped Pigeon",
      "Congo Serpent Eagle",
      "Yellow-throated Cuckoo",
      "Nkulengu Rail"
    ],
    wildlifeFlora: [
      "Ironwood trees (valuable hardwood)",
      "Mahogany trees",
      "Tropical lowland forest canopy species",
      "Strangler figs",
      "Raffia palms (swamp areas)",
      "Lianas and climbing vines",
      "Wild banana plants",
      "Forest floor herbs",
      "Epiphytic orchids",
      "Mosses and ferns",
      "River bank vegetation"
    ],
    cultureDescription: "The Batwa pygmies, traditionally hunter-gatherers from the Congo's Ituri Forest, live on the forest edges. They possess intimate knowledge of the forest's resources, including medicinal plants, hunting techniques, and forest navigation. Local Bakonjo communities also utilize forest resources in sustainable ways, maintaining traditional practices that have coexisted with the forest for generations.",
    cultureExperiences: [
      "Meet the Batwa pygmy community and learn about their traditional forest lifestyle",
      "Participate in Batwa-guided forest walks learning about medicinal plants and traditional hunting methods",
      "Experience traditional Batwa music, dance, and storytelling",
      "Learn about the spiritual significance of the forest in Batwa culture",
      "Visit the spectacular Sempaya hot springs - the 'Male' and 'Female' springs with local legends",
      "Watch eggs being boiled in the 100°C hot springs",
      "Engage with Bakonjo communities and their forest-edge agricultural practices"
    ],
    bestTimeDescription: "Semuliki National Park can be visited year-round, though the wet season brings challenging conditions. The forest's equatorial location means high humidity and potential for rain even during drier months.",
    drySeasonTitle: "Dry Season (June-August & January-February)",
    drySeasonDescription: "The drier months offer the most comfortable forest exploration with somewhat reduced rainfall, though the forest never truly dries out. Trails are less muddy, making wildlife tracking and birding more pleasant. The Sempaya hot springs are more easily accessed without having to navigate waterlogged paths. Primate viewing is excellent as animals are more active in cooler conditions. Bird watching remains productive year-round, but drier weather makes extended forest walks more comfortable. The Semuliki River is lower, exposing more sandy banks where forest elephants and buffalo sometimes come to drink.",
    wetSeasonTitle: "Wet Season (March-May & September-December)",
    wetSeasonDescription: "The wet season intensifies the forest's tropical character with heavy rainfall and high humidity. Trails become muddy and challenging, requiring waterproof gear and good boots. However, the forest is at its most verdant and alive—birds are particularly vocal and active during mating season. The increased rain makes the hot springs even more dramatic with steam rising in dense clouds. Butterflies are abundant and spectacular. Fewer tourists mean more exclusive forest experiences and better opportunities for patient wildlife watchers. The forest canopy is lush, though this can make wildlife spotting more challenging."
  },

  {
    id: 27,
    name: "Mgahinga Gorilla National Park",
    historyTitle: "Where Gold Meets Silver in the Virungas",
    historyContent: [
      "Mgahinga Gorilla National Park was established in 1991, making it one of Uganda's newer national parks. Its creation was specifically aimed at protecting mountain gorillas and their habitat in the Ugandan portion of the Virunga Mountains.",
      "Before 1991, the area was inhabited by the Batwa pygmy people who had lived in the forest for generations as hunter-gatherers. The park's establishment led to their eviction from their ancestral lands, fundamentally changing their traditional lifestyle and creating ongoing social challenges.",
      "The park is part of the larger Virunga Conservation Area, a transboundary initiative shared with Rwanda's Volcanoes National Park and the Democratic Republic of Congo's Virunga National Park. This regional cooperation is essential for gorilla conservation since the animals move freely across international borders.",
      "Despite being Uganda's smallest national park at just 33.7 square kilometers, Mgahinga plays a critical role in mountain gorilla conservation and is the only place in Uganda where golden monkeys can be tracked, making it unique in the country's protected area network."
    ],
    geographyDescription: "Mgahinga Gorilla National Park occupies the Ugandan slopes of three extinct volcanoes in the Virunga Mountains: Mount Muhabura (4,127m), Mount Gahinga (3,474m), and Mount Sabyinyo (3,645m). The park sits at elevations between 2,227m and 4,127m, creating dramatic mountainous terrain. The volcanic soils support lush vegetation zones from montane forest through bamboo to alpine moorland. The park's position at the convergence of Uganda, Rwanda, and DRC creates a unique tri-border wilderness.",
    geographyClimate: "Mgahinga experiences a cool mountain climate with temperatures varying significantly by altitude. Daytime temperatures average 15-20°C (59-68°F) at lower elevations, dropping near freezing at the summits. The park receives high rainfall throughout the year, with slightly drier periods in June-August and December-January. Dense mist and fog are common, especially in the afternoon, creating the atmospheric conditions that define the Virunga Mountains.",
    wildlifeDescription: "Mgahinga's high-altitude ecosystem supports specialized species adapted to mountain conditions. The park is home to one habituated mountain gorilla family, the Nyakagezi group with 9 members. The park is Uganda's only location for golden monkey tracking, with two habituated troops available for tourism. The volcanic mountain environment creates unique wildlife viewing opportunities in bamboo forests and montane vegetation.",
    wildlifeMammals: [
      "Mountain Gorillas (Nyakagezi family: 4 silverbacks, 2 females, 1 juvenile, 2 infants)",
      "Golden Monkeys (two habituated troops)",
      "African Buffalo (in bamboo and montane forest zones)",
      "African Elephants (rare, occasional visitors)",
      "Black-and-white Colobus Monkeys",
      "L'Hoest's Monkeys",
      "Bushbucks",
      "Duikers (several species)",
      "Giant Forest Hogs",
      "Leopards (rarely seen)"
    ],
    wildlifeBirds: [
      "Rwenzori Turaco",
      "Scarlet-tufted Malachite Sunbird",
      "Dusky Crimsonwing",
      "Kivu Ground Thrush",
      "Rwenzori Batis",
      "Archer's Robin-chat",
      "Montane Double-collared Sunbird",
      "Olive Woodpecker",
      "Alpine Chat (on higher volcanic slopes)",
      "Handsome Francolin",
      "Cinnamon-chested Bee-eater"
    ],
    wildlifeFlora: [
      "Bamboo forests (extensive zones - primary golden monkey habitat)",
      "Hagenia-Hypericum montane forest",
      "Giant Lobelias (on upper volcanic slopes)",
      "Giant Groundsels (alpine zones)",
      "Helichrysum (Everlasting flowers)",
      "Senecio species",
      "Mountain Heathers",
      "Wild Celery (gorilla food)",
      "Thistle plants",
      "Mountain Bamboo (Sinarundinaria alpina)",
      "Mosses and lichens (abundant)"
    ],
    cultureDescription: "The Batwa pygmy people are intimately connected to Mgahinga's history and forests. As the original inhabitants, they lived in the Virunga forests for thousands of years before being displaced when the park was created in 1991. Today, they live on the park's edges, struggling to adapt to a sedentary lifestyle while trying to preserve their cultural identity and forest knowledge.",
    cultureExperiences: [
      "Batwa Trail - a moving cultural experience led by Batwa guides through their former forest home",
      "Learn traditional Batwa hunting techniques, including bow and arrow demonstrations",
      "Discover medicinal plants and their uses as explained by Batwa elders",
      "Experience sacred Batwa caves, including Garama Cave where the Batwa king once lived",
      "Participate in traditional Batwa music, dance, and fire-making ceremonies",
      "Hear oral histories and legends about life in the forest before displacement",
      "Support Batwa community craft cooperatives and cultural preservation initiatives"
    ],
    bestTimeDescription: "Mgahinga's high-altitude location means visitors should prepare for rain at any time of year. However, rainfall patterns do create periods when conditions are somewhat more favorable for gorilla tracking and volcano hiking.",
    drySeasonTitle: "Dry Season (December-January & June-August)",
    drySeasonDescription: "The drier months offer the best conditions for both gorilla tracking and volcano climbing. While rain is still possible, it's generally less frequent and intense. The steep volcanic slopes are more easily navigable when less muddy, making the challenging terrain somewhat safer for trekking. Golden monkey tracking is more comfortable with drier bamboo forest trails. Summit hikes to the three volcanoes have better success rates with clearer weather providing spectacular views across the Virunga chain. Photography opportunities improve with better light and visibility.",
    wetSeasonTitle: "Wet Season (February-May & September-November)",
    wetSeasonDescription: "The wet season sees heavy rainfall making the already steep volcanic slopes extremely challenging and potentially dangerous when muddy. However, the bamboo forests are lush and beautiful—ideal habitat for golden monkeys which are highly active. Gorilla tracking continues year-round, though trekkers should prepare for difficult conditions with proper waterproof gear. The reduced number of visitors means more intimate wildlife encounters. The dramatic weather creates spectacular photographic opportunities for those willing to brave the elements. The volcanoes are frequently shrouded in mist, creating the mystical atmosphere the Virungas are famous for."
  }
];

async function updateDestinations() {
  console.log("🌍 Updating destinations with detailed information...\n");

  let updated = 0;
  let failed = 0;

  for (const destData of destinationsData) {
    console.log(`Processing: ${destData.name}...`);

    try {
      await prisma.destination.update({
        where: { id: destData.id },
        data: {
          historyTitle: destData.historyTitle,
          historyContent: destData.historyContent,
          geographyDescription: destData.geographyDescription,
          geographyClimate: destData.geographyClimate,
          wildlifeDescription: destData.wildlifeDescription,
          wildlifeMammals: destData.wildlifeMammals,
          wildlifeBirds: destData.wildlifeBirds,
          wildlifeFlora: destData.wildlifeFlora,
          cultureDescription: destData.cultureDescription,
          cultureExperiences: destData.cultureExperiences,
          bestTimeDescription: destData.bestTimeDescription,
          drySeasonTitle: destData.drySeasonTitle,
          drySeasonDescription: destData.drySeasonDescription,
          wetSeasonTitle: destData.wetSeasonTitle,
          wetSeasonDescription: destData.wetSeasonDescription,
        },
      });

      console.log(`  ✅ Updated: ${destData.name}`);
      updated++;
    } catch (error) {
      console.error(`  ❌ Failed to update ${destData.name}:`, error.message);
      failed++;
    }
  }

  console.log("\n" + "=".repeat(70));
  console.log("Destination Update Summary");
  console.log("=".repeat(70));
  console.log(`Successfully Updated: ${updated}`);
  console.log(`Failed: ${failed}`);
  console.log("=".repeat(70));
}

updateDestinations()
  .catch((e) => {
    console.error("❌ Error during update:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
