#!/usr/bin/env node
import { PrismaClient } from "../prisma/app/generated/prisma-client/index.js";

const prisma = new PrismaClient();

const R2_BASE = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev";
const IMAGE_PATH = "nambi-uganda-safaris/images";
const getImageUrl = (filename) => `${R2_BASE}/${IMAGE_PATH}/${filename}`;

// Complete destinations with full data
const allDestinations = [
  {
    id: 6,
    name: "Lake Mburo National Park",
    category: "National Park",
    price: 450.84,
    rating: 5,
    image: getImageUrl("lake-mburo-national-park-uganda-zebras-savannah.webp"),
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
    image: getImageUrl("sipi-falls-uganda-waterfalls-mount-elgon.webp"),
    country: "Uganda",
    shortDesc:
      "Home to the world's largest volcanic base and spectacular Sipi Falls. Trek to the 4,321m Wagagai Peak and explore caves where elephants mine salt.",
    description:
      "Located on the Uganda-Kenya border, Mt Elgon boasts the largest volcanic base in the world, covering an area of 4,000 km². As the oldest and largest solitary volcanic mountain in East Africa, its vast form stretches 60km in diameter, rising over 3,000 meters above the surrounding plains. The cool heights of the mountain provide a respite from the hot plains below, offering a refuge for flora and fauna at higher altitudes. Within the Mount Elgon National Park, there are over 300 species of birds, as well as some antelopes, forest monkeys, elephants, and buffalos that call the mountainside home. The higher slopes are protected by national parks in Uganda and Kenya, creating an extensive transboundary conservation area that has been declared a UNESCO Man and Biosphere Reserve. Accommodation options include: Masai Backpackers (Kapkwai Village), The Crow's Nest (Sipi Falls), Twilight Sipi, and Camseil (Kapckwa).",
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
    image: getImageUrl("rwenzori-mountains-uganda-snow-peaks.webp"),
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
  {
    id: 11,
    name: "Semuliki National Park",
    category: "Wildlife Safari",
    price: 680.0,
    rating: 5,
    image: getImageUrl("uganda-safari-landscape-team-adventure.webp"),
    country: "Uganda",
    shortDesc:
      "East Africa's only lowland tropical rainforest with Central African species. Visit Sempaya Hot Springs and meet the Batwa pygmy community.",
    description:
      "Semuliki National Park sprawls across the floor of the Semliki Valley on the remote western side of the Rwenzori Mountains. The park is dominated by the easternmost extension of the great Ituri Forest of the Congo basin, one of Africa's most ancient and biodiverse forests that survived the last ice age around 12-18,000 years ago. The Semuliki Valley is unique in that it contains numerous features associated with Central rather than Eastern Africa. For example, the thatched huts are shaded by West African oil palms, the Semuliki River which forms the international boundary is a miniature version of the Congo River, and the forest is home to numerous Central African wildlife species. The park provides a rare glimpse into the wildlife of Central Africa without having to leave Uganda. The reserve is home to a total of 53 mammal species and over 400 bird species, with some being endemic to the park and the Congo basin. Wildlife enthusiasts can expect to see primates such as the black-and-white colobus, red-tailed monkey, and grey-cheeked mangabey. The park is also home to forest elephants, buffaloes, bushbucks, and a few species of duikers. The birdlife in the park is particularly impressive, with a variety of raptors, forest and waterbird species, and the elusive shoebill stork. The Batwa pygmy community, who originally come from the Congo, also call this area home. The park's hot springs are another attraction worth visiting. The Sempaya hot springs consist of two separate springs, one male and one female, and are said to have medicinal properties.",
    duration: "2-3 Days",
    groupSize: 12,
    minTravelers: 2,
    maxTravelers: 15,
  },
  {
    id: 7,
    name: "Kibale National Park",
    category: "Primate Tracking",
    price: 890.0,
    rating: 5,
    image: getImageUrl("kibale-forest-chimpanzee-tracking-uganda.webp"),
    country: "Uganda",
    shortDesc: "The primate capital of the world with over 1,500 chimpanzees. Over 90% chimp tracking success rate in beautiful tropical forest.",
    description: "Kibale National Park, located in western Uganda, boasts of being one of the most beautiful and diverse tropical forests in the country. Covering an area of 795 km², the park is home to 13 primate species including over 1,500 chimpanzees. The park is renowned as the 'primate capital of the world' with over 90% chimpanzee sighting success rates. Accommodation options include: Kibale Forest Camp, Primate Lodge, Isunga Lodge, and Turaco Lodge.",
    duration: "2-3 Days",
    groupSize: 6,
    minTravelers: 1,
    maxTravelers: 8,
  },
  {
    id: 12,
    name: "Kidepo Valley National Park",
    category: "Wildlife Safari",
    price: 1450.0,
    rating: 5,
    image: getImageUrl("kidepo-valley-national-park-wildlife.webp"),
    country: "Uganda",
    shortDesc: "Uganda's most isolated and magnificent wilderness. 77 mammal species and 476 bird species in spectacular semi-arid savanna.",
    description: "Located 700km from Kampala, Kidepo Valley lies in the rugged, semi-arid valleys between Uganda's borders with Sudan and Kenya. Gazetted as a national park in 1962, it ranks among Africa's finest wildernesses with over 77 mammal species and 475 bird species. Accommodation options include: Apoka Safari Lodge and Nga'Moru Wilderness Camp.",
    duration: "3-4 Days",
    groupSize: 10,
    minTravelers: 2,
    maxTravelers: 12,
  },
  {
    id: 4,
    name: "Queen Elizabeth National Park",
    category: "Wildlife Safari",
    price: 1203.0,
    rating: 5,
    image: getImageUrl("queen-elizabeth-national-park-tree-climbing-lions.webp"),
    country: "Uganda",
    shortDesc: "Uganda's most popular park. Tree-climbing lions, Kazinga Channel boat safaris, and over 600 bird species.",
    description: "Undoubtedly Uganda's most popular tourist destination, Queen Elizabeth National Park boasts diverse ecosystems including sprawling savanna, forests, lakes, and wetlands. Home to 95 mammal species and over 600 bird species. Famous for tree-climbing lions in Ishasha and the Kazinga Channel.",
    duration: "3-5 Days",
    groupSize: 10,
    minTravelers: 2,
    maxTravelers: 12,
  },
  {
    id: 13,
    name: "Mgahinga Gorilla National Park",
    category: "Gorilla Trekking",
    price: 1850.0,
    rating: 5,
    image: getImageUrl("uganda-gorilla-trekking-adventure.webp"),
    country: "Uganda",
    shortDesc: "High-altitude park with mountain gorillas, golden monkeys, and three volcanic peaks. Part of Virunga Conservation Area.",
    description: "Mgahinga Gorilla National Park sits between 2,227m and 4,127m above sea level. It protects mountain gorillas and endangered golden monkeys across three extinct volcanoes: Muhabura, Gahinga, and Sabyinyo. Experience Batwa Pygmy culture.",
    duration: "2-3 Days",
    groupSize: 8,
    minTravelers: 1,
    maxTravelers: 8,
  },
  {
    id: 1,
    name: "Bwindi Impenetrable National Park",
    category: "Gorilla Trekking",
    price: 3950,
    rating: 5,
    image: getImageUrl("bwindi-impenetrable-forest-mountain-gorillas.webp"),
    images: [
      "/bwindi-impenetrable-forest-mountain-gorillas.jpg",
      "/uganda-mountain-gorillas-bwindi-forest.jpg",
      "/uganda-queen-elizabeth-national-park-safari.jpg",
      "/uganda-murchison-falls-waterfall.jpg",
      "/uganda-lake-victoria-sunset.jpg",
      "/uganda-rwenzori-mountains-snow.jpg",
    ],
    country: "Uganda",
    shortDesc: "Home to 400 mountain gorillas - half the world's population. Ancient 25,000-year-old rainforest and UNESCO World Heritage Site.",
    description: "Located in southwestern Uganda on the edge of the Rift Valley, Bwindi's mist-covered hillsides are blanketed by one of Uganda's oldest rainforests dating back 25,000 years. Protects 400 mountain gorillas - half the world's population. Accommodation options include: Buhoma Lodge, Bwindi Lodge, Cloud Mountain Gorilla Lodge, Silverback Lodge, Gorilla Forest Camp, Mahogany Springs.",
    duration: "3-5 Days",
    groupSize: 8,
    minTravelers: 1,
    maxTravelers: 8,
  },
  {
    id: 2,
    name: "Murchison Falls National Park",
    category: "Wildlife Safari",
    price: 897.31,
    rating: 5,
    image: getImageUrl("murchison-falls-national-park-uganda-waterfall.webp"),
    country: "Uganda",
    shortDesc: "Uganda's largest and oldest park. Spectacular waterfall where the Nile explodes through an 8-meter gorge.",
    description: "Situated at the northern end of the Albertine Rift Valley, Murchison Falls National Park is Uganda's largest park covering 3,893 km². The Victoria Nile cascades 45 meters through a narrow gorge, creating Africa's most powerful waterfall. Home to 144 mammal species and 556 bird species. Accommodation options include: Bakers Lodge, Chobe Safari Lodge, Paraa Safari Lodge.",
    duration: "3-4 Days",
    groupSize: 12,
    minTravelers: 2,
    maxTravelers: 15,
  },
];


export async function seedDestinationsComplete() {
  console.log("🌍 Seeding destinations to database...\n");

  // Use all destinations
  const allDestinationsData = allDestinations;

  let added = 0;
  let skipped = 0;

  for (const dest of allDestinationsData) {
    console.log(`Processing destination: ${dest.name}...`);

    try {
      // Check if destination already exists by name
      const existing = await prisma.destination.findFirst({
        where: { name: dest.name },
      });

      if (existing) {
        console.log(`  ⏭️  Destination ${dest.name} already exists, skipping...`);
        skipped++;
        continue;
      }

      // Prepare destination data for database
      const destinationData = {
        name: dest.name,
        category: dest.category,
        country: dest.country,
        region: null, // Will be set based on location if needed
        price: dest.price,
        rating: dest.rating,
        duration: dest.duration,
        groupSize: dest.groupSize,
        minTravelers: dest.minTravelers,
        maxTravelers: dest.maxTravelers,
        description: dest.description,
        image: dest.image,
        images: dest.images || [],
        featured: dest.category === "Gorilla Trekking" || dest.category === "Wildlife Safari", // Feature gorilla and safari destinations
      };

      const createdDestination = await prisma.destination.create({
        data: destinationData,
      });

      console.log(`  ✅ Created destination: ${createdDestination.name}`);
      added++;
    } catch (error) {
      console.error(`  ❌ Error creating destination ${dest.name}:`, error.message);
    }
  }

  console.log("\n" + "=".repeat(70));
  console.log("Destination Seeding Summary");
  console.log("=".repeat(70));
  console.log(`Total Destinations: ${allDestinationsData.length}`);
  console.log(`Added to Database: ${added}`);
  console.log(`Skipped (existing): ${skipped}`);
  console.log("=".repeat(70));
}

seedDestinationsComplete()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
