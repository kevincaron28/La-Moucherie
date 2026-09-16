import {
  PrismaClient,
  ProductCategory,
  type FishSpecies,
  type FishingSeason,
  type WaterType,
  type Technique,
} from "@prisma/client";

const prisma = new PrismaClient();

type VariantSeed = {
  nameFr: string;
  nameEn: string;
  sku: string;
  priceCents?: number;
  stock: number;
};

type ProductSeed = {
  slug: string;
  nameFr: string;
  nameEn: string;
  descriptionFr: string;
  descriptionEn: string;
  category: ProductCategory;
  basePriceCents: number;
  images: string[];
  featured?: boolean;
  // Angler-facing metadata: how a customer actually picks a fly. Starting
  // values from general knowledge of these well-known patterns — refine them as
  // the real lineup is confirmed.
  species?: FishSpecies[];
  seasons?: FishingSeason[];
  waterTypes?: WaterType[];
  techniques?: Technique[];
  imitatesFr?: string[];
  imitatesEn?: string[];
  howToFishFr?: string;
  howToFishEn?: string;
  proTipFr?: string;
  proTipEn?: string;
  waters?: string[];
  variants: VariantSeed[];
};

// This is the real starting catalog (as of the patterns confirmed so far) — six
// patterns, category and target species taken from the packaging. Descriptions
// are written from general fly-fishing knowledge of these well-known patterns.
// Hook sizes, exact pricing, and photos are placeholders until confirmed —
// real product photos are coming once the lightbox is built.
const products: ProductSeed[] = [
  // Curated boxes. Priced below the sum of their parts — that discount is the
  // bundle's whole reason to exist, which is why assortments sit outside the
  // per-fly bulk tiers rather than stacking with them.
  //
  // Contents and prices are a starting point: adjust them in this file (or via
  // `npm run db:studio`) once the real lineup and hook sizes are confirmed.
  {
    slug: "boite-decouverte",
    nameFr: "Boîte Découverte — 6 mouches",
    nameEn: "Discovery Box — 6 flies",
    descriptionFr:
      "Six mouches choisies pour couvrir une journée complète sur une rivière québécoise : une sèche pour l'éclosion du soir, deux nymphes pour pêcher le fond, un streamer pour fouiller les fosses, et deux noyées pour l'entre-deux. La façon la plus simple d'essayer notre montage sans choisir patron par patron.",
    descriptionEn:
      "Six flies chosen to cover a full day on a Québec river: a dry for the evening hatch, two nymphs for working the bottom, a streamer for searching the pools, and two wets for everything in between. The simplest way to try our tying without picking pattern by pattern.",
    category: ProductCategory.ASSORTMENT,
    basePriceCents: 2100,
    images: ["/products/placeholder-fly.svg"],
    featured: true,
    variants: [{ nameFr: "6 mouches assorties", nameEn: "6 assorted flies", sku: "BOX-DEC-06", stock: 12 }],
  },
  {
    slug: "boite-truite-mouchetee",
    nameFr: "Boîte Truite mouchetée — 12 mouches",
    nameEn: "Brook Trout Box — 12 flies",
    descriptionFr:
      "Douze mouches montées pour l'omble de fontaine : les patrons qui travaillent sur nos lacs et nos petites rivières, du printemps à la fermeture. Un assortiment équilibré de sèches, de nymphes et de streamers, dans les tailles qui prennent du poisson ici.",
    descriptionEn:
      "Twelve flies tied for brook trout: the patterns that work on our lakes and small rivers, from spring through to close of season. A balanced spread of dries, nymphs and streamers in the sizes that catch fish here.",
    category: ProductCategory.ASSORTMENT,
    basePriceCents: 4000,
    images: ["/products/placeholder-fly.svg"],
    featured: true,
    variants: [{ nameFr: "12 mouches assorties", nameEn: "12 assorted flies", sku: "BOX-OMB-12", stock: 8 }],
  },
  {
    slug: "boite-streamers",
    nameFr: "Boîte Streamers — 8 mouches",
    nameEn: "Streamer Box — 8 flies",
    descriptionFr:
      "Huit streamers pour chercher les gros poissons : des patrons mobiles, montés sur hameçons solides, pour fouiller les fosses et les bordures en eau haute. Pour le pêcheur qui préfère couvrir de l'eau plutôt qu'attendre l'éclosion.",
    descriptionEn:
      "Eight streamers for hunting bigger fish: mobile patterns on strong hooks, for searching pools and undercut banks in high water. For the angler who would rather cover water than wait on a hatch.",
    category: ProductCategory.ASSORTMENT,
    basePriceCents: 3000,
    images: ["/products/placeholder-fly.svg"],
    featured: false,
    variants: [{ nameFr: "8 streamers assortis", nameEn: "8 assorted streamers", sku: "BOX-STR-08", stock: 10 }],
  },
  {
    slug: "egg-sucking-leech",
    nameFr: "Egg Sucking Leech",
    nameEn: "Egg Sucking Leech",
    descriptionFr:
      "Un patron de sangsue noire terminé par un œuf coloré à la tête — redoutable pendant et après le frai, quand la truite chasse les œufs à la dérive. À pêcher en dérive naturelle ou en tirées lentes dans les fosses profondes.",
    descriptionEn:
      "A black leech pattern trailing a bright egg at the head — deadly during and after the spawn, when trout key in on drifting eggs. Fish it dead-drift or with a slow strip through deeper runs and pools.",
    category: ProductCategory.WET_FLY,
    basePriceCents: 425,
    images: ["/products/placeholder-fly.svg"],
    featured: true,
    species: ["BROOK_TROUT", "BROWN_TROUT", "RAINBOW_TROUT", "LANDLOCKED_SALMON"],
    seasons: ["SPRING", "FALL"],
    waterTypes: ["RIVER", "STREAM"],
    techniques: ["DEAD_DRIFT", "STRIP", "SWING"],
    imitatesFr: ["Sangsue", "Œufs de poisson"],
    imitatesEn: ["Leech", "Fish eggs"],
    waters: ["riviere-jacques-cartier", "riviere-matapedia"],
    howToFishFr:
      "Pêchez-la en dérive naturelle sous un indicateur dans les fosses profondes, ou en tirées lentes le long des bordures. Laissez-la descendre : la touche vient souvent quand la mouche recommence à monter en fin de dérive.",
    howToFishEn:
      "Fish it dead-drift under an indicator through deeper pools, or on slow strips along undercut banks. Let it sink: the take often comes as the fly starts to rise at the end of the drift.",
    proTipFr:
      "Après le frai, quand l'eau est encore haute et teintée, c'est souvent la première mouche à essayer — l'œuf orange donne un point de mire dans l'eau brouillée.",
    proTipEn:
      "After the spawn, with water still high and stained, it's often the first fly to try — that orange egg gives fish something to find in coloured water.",
    variants: [
      { nameFr: "Hameçon #4", nameEn: "Hook #4", sku: "ESL-BLK-04", stock: 18 },
      { nameFr: "Hameçon #6", nameEn: "Hook #6", sku: "ESL-BLK-06", stock: 24 },
      { nameFr: "Hameçon #8", nameEn: "Hook #8", sku: "ESL-BLK-08", stock: 20 },
    ],
  },
  {
    slug: "montana-stone",
    nameFr: "Montana Stone",
    nameEn: "Montana Stone",
    descriptionFr:
      "Une nymphe de perle fortement lestée, imitant les larves de plécoptères recherchées par la truite dans les rivières à fond rocheux. Son corps rayé noir et jaune coule rapidement — une mouche de tête fiable pour pêcher au fond dans les eaux vives.",
    descriptionEn:
      "A heavily-weighted stonefly nymph imitating the large naiads trout key on in freestone rivers. Its black-and-yellow banded body gets down fast — a reliable point fly for bouncing bottom in fast, rocky water.",
    category: ProductCategory.NYMPH,
    basePriceCents: 375,
    images: ["/products/placeholder-fly.svg"],
    featured: true,
    species: ["BROOK_TROUT", "BROWN_TROUT", "RAINBOW_TROUT"],
    seasons: ["SPRING", "SUMMER"],
    waterTypes: ["RIVER", "STREAM"],
    techniques: ["NYMPHING", "DEAD_DRIFT"],
    imitatesFr: ["Larve de plécoptère", "Nymphe de perle"],
    imitatesEn: ["Stonefly nymph", "Large naiad"],
    waters: ["riviere-jacques-cartier"],
    howToFishFr:
      "En mouche de tête sur un montage à deux nymphes, pour emmener l'ensemble au fond dans le courant. Visez les veines de courant et le pied des rapides.",
    howToFishEn:
      "As the point fly on a two-nymph rig, to carry the whole setup to the bottom in fast water. Work the current seams and the tailouts below rapids.",
    proTipFr:
      "Si vous ne touchez pas le fond de temps en temps, vous ne pêchez pas assez creux. Ajoutez du plomb avant de changer de mouche.",
    proTipEn:
      "If you're not ticking bottom now and then, you're not deep enough. Add weight before you change the fly.",
    variants: [
      { nameFr: "Hameçon #6", nameEn: "Hook #6", sku: "MTS-STD-06", stock: 22 },
      { nameFr: "Hameçon #8", nameEn: "Hook #8", sku: "MTS-STD-08", stock: 28 },
      { nameFr: "Hameçon #10", nameEn: "Hook #10", sku: "MTS-STD-10", stock: 20 },
    ],
  },
  {
    slug: "elk-wing-caddis",
    nameFr: "Elk Wing Caddis",
    nameEn: "Elk Wing Caddis",
    descriptionFr:
      "Une mouche sèche flottant haut, avec une aile en poil de wapiti qui résiste bien aux courants agités durant les éclosions de trichoptères. Un patron passe-partout du printemps à l'automne sur les rivières à fond rocheux.",
    descriptionEn:
      "A high-floating dry fly with a buoyant elk-hair wing, built to ride out choppy runs during caddis hatches. A go-to searching pattern from spring through fall on freestone water.",
    category: ProductCategory.DRY_FLY,
    basePriceCents: 350,
    images: ["/products/placeholder-fly.svg"],
    featured: true,
    species: ["BROOK_TROUT", "BROWN_TROUT", "RAINBOW_TROUT"],
    seasons: ["SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM"],
    techniques: ["DEAD_DRIFT", "SKATE"],
    imitatesFr: ["Trichoptère adulte", "Phrygane"],
    imitatesEn: ["Adult caddis", "Sedge"],
    waters: ["riviere-sainte-anne", "riviere-jacques-cartier"],
    howToFishFr:
      "En dérive morte dans les veines de courant à l'éclosion du soir. Quand rien ne monte, une petite tirée sèche qui fait patiner la mouche déclenche souvent la touche.",
    howToFishEn:
      "Dead-drift it through the current seams during the evening hatch. When nothing is rising, a short twitch that skates the fly will often draw the take.",
    proTipFr:
      "Séchez-la souvent et graissez-la bien : une Elk Wing qui flotte haut prend deux fois plus de poissons qu'une qui s'enfonce.",
    proTipEn:
      "Dry it often and keep it greased: an Elk Wing riding high takes twice the fish of one sitting low.",
    variants: [
      { nameFr: "Hameçon #12", nameEn: "Hook #12", sku: "EWC-STD-12", stock: 32 },
      { nameFr: "Hameçon #14", nameEn: "Hook #14", sku: "EWC-STD-14", stock: 40 },
      { nameFr: "Hameçon #16", nameEn: "Hook #16", sku: "EWC-STD-16", stock: 26 },
    ],
  },
  {
    slug: "lefty-deceiver",
    nameFr: "Lefty Deceiver",
    nameEn: "Lefty Deceiver",
    descriptionFr:
      "Le streamer classique de Lefty Kreh, imitant un poisson-appât — un profil élancé en plumes de sellier qui déplace l'eau et garde sa forme à la récupération. Conçu pour les prédateurs : achigan, brochet, et tout ce qui chasse le petit poisson.",
    descriptionEn:
      "Lefty Kreh's classic baitfish streamer — a slim saddle-hackle profile that pushes water and holds its shape on the strip. Built for predators: bass, pike, and anything that eats baitfish.",
    category: ProductCategory.STREAMER,
    basePriceCents: 500,
    images: ["/products/placeholder-fly.svg"],
    species: ["NORTHERN_PIKE", "SMALLMOUTH_BASS", "LARGEMOUTH_BASS", "ATLANTIC_SALMON"],
    seasons: ["SUMMER", "FALL"],
    waterTypes: ["RIVER", "LAKE", "STILLWATER"],
    techniques: ["STRIP", "SWING"],
    imitatesFr: ["Poisson-appât", "Ménés"],
    imitatesEn: ["Baitfish", "Minnows"],
    waters: ["fleuve-saint-laurent", "riviere-richelieu"],
    howToFishFr:
      "En tirées longues et rapides le long des herbiers et des structures. Marquez une pause d'une seconde entre les tirées — c'est presque toujours là que le poisson frappe.",
    howToFishEn:
      "Long, fast strips along weed edges and structure. Pause a full second between strips — that's almost always when the fish hits.",
    proTipFr:
      "Sur le Saint-Laurent, pêchez-la tôt le matin le long des bordures d'herbiers, avant que le vent lève.",
    proTipEn:
      "On the St. Lawrence, fish it early along the weed edges, before the wind gets up.",
    variants: [
      { nameFr: "Hameçon #2", nameEn: "Hook #2", sku: "LD-STD-02", stock: 15 },
      { nameFr: "Hameçon #1/0", nameEn: "Hook #1/0", sku: "LD-STD-10", stock: 12 },
    ],
  },
  {
    slug: "bead-head-hares-ear",
    nameFr: "Bead Head Hare's Ear",
    nameEn: "Bead Head Hare's Ear",
    descriptionFr:
      "La nymphe incontournable de toute boîte à mouches. Un corps en poil de lièvre naturel, texturé et duveteux, lesté d'une bille en laiton — une silhouette translucide qui imite une grande variété d'insectes aquatiques.",
    descriptionEn:
      "The workhorse nymph of the fly box. A buggy dubbed body from natural hare's mask with a brass bead for weight — a loose, translucent silhouette that passes for almost any subsurface insect.",
    category: ProductCategory.NYMPH,
    basePriceCents: 350,
    images: ["/products/placeholder-fly.svg"],
    species: ["BROOK_TROUT", "BROWN_TROUT", "RAINBOW_TROUT", "LANDLOCKED_SALMON"],
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM", "LAKE"],
    techniques: ["NYMPHING", "DEAD_DRIFT"],
    imitatesFr: ["Nymphe d'éphémère", "Larve de trichoptère", "Gammare"],
    imitatesEn: ["Mayfly nymph", "Caddis larva", "Scud"],
    waters: ["riviere-jacques-cartier", "riviere-sainte-anne"],
    howToFishFr:
      "La nymphe passe-partout : en dérive sous indicateur, ou en mouche de pointe derrière une nymphe plus lourde. Elle travaille toute la saison.",
    howToFishEn:
      "The do-everything nymph: drifted under an indicator, or as the dropper behind something heavier. It works all season.",
    proTipFr:
      "Quand vous ne savez pas quoi mettre, mettez ça. Si une seule mouche devait rester dans la boîte, ce serait celle-là.",
    proTipEn:
      "When you don't know what to tie on, tie this on. If one fly had to stay in the box, it would be this one.",
    variants: [
      { nameFr: "Hameçon #12", nameEn: "Hook #12", sku: "BHHE-STD-12", stock: 30 },
      { nameFr: "Hameçon #14", nameEn: "Hook #14", sku: "BHHE-STD-14", stock: 36 },
      { nameFr: "Hameçon #16", nameEn: "Hook #16", sku: "BHHE-STD-16", stock: 24 },
    ],
  },
  {
    slug: "woolly-bugger-black",
    nameFr: "Woolly Bugger Black",
    nameEn: "Woolly Bugger Black",
    descriptionFr:
      "Le Woolly Bugger noir, passe-partout par excellence — queue en marabout, hackle palmé, et assez de mouvement dans l'eau pour imiter une sangsue, une larve ou un poisson-appât selon la présentation. S'il ne fallait garder qu'une seule mouche, ce serait celle-ci.",
    descriptionEn:
      "The all-purpose black Woolly Bugger — marabou tail, palmered hackle, and enough movement in the water to imitate a leech, hellgrammite, or baitfish depending on how you fish it. If you carry only one fly, this is it.",
    category: ProductCategory.WET_FLY,
    basePriceCents: 375,
    images: ["/products/placeholder-fly.svg"],
    species: ["BROOK_TROUT", "BROWN_TROUT", "RAINBOW_TROUT", "SMALLMOUTH_BASS", "NORTHERN_PIKE"],
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM", "LAKE", "STILLWATER"],
    techniques: ["STRIP", "SWING", "DEAD_DRIFT", "TROLLING"],
    imitatesFr: ["Sangsue", "Poisson-appât", "Larve de dobson"],
    imitatesEn: ["Leech", "Baitfish", "Hellgrammite"],
    waters: ["riviere-jacques-cartier", "riviere-richelieu", "fleuve-saint-laurent"],
    howToFishFr:
      "En tirées courtes à travers les fosses et les veines de courant, ou en travers du courant en fin de dérive. En lac, laissez-la couler puis remontez-la lentement.",
    howToFishEn:
      "Short strips through pools and current seams, or swung across the current at the end of the drift. On lakes, let it sink then bring it back slowly.",
    proTipFr:
      "Le noir travaille par eau teintée et par ciel couvert. Si l'eau est claire et le soleil haut, descendez d'une taille avant de changer de couleur.",
    proTipEn:
      "Black works in stained water and under cloud. If the water is clear and the sun is high, drop a size before you change colour.",
    variants: [
      { nameFr: "Hameçon #6", nameEn: "Hook #6", sku: "WBB-STD-06", stock: 26 },
      { nameFr: "Hameçon #8", nameEn: "Hook #8", sku: "WBB-STD-08", stock: 32 },
      { nameFr: "Hameçon #10", nameEn: "Hook #10", sku: "WBB-STD-10", stock: 22 },
    ],
  },
];


// A tying to-do list, not catalog data — patterns worth adding once they're
// actually tied, priced and photographed. Curated from a southwestern
// Montérégie river/species guide (Châteauguay, Richelieu, Yamaska, Yamaska
// Nord), cross-referenced against what's already in `products` above so
// nothing here duplicates a real pattern. Only inserted once, into an empty
// table — see the `plannedFlies.count()` guard in `main()` — since after
// that it's a living list the admin dashboard adds to and clears from.
const plannedFlies: {
  nameFr: string;
  nameEn: string;
  category: ProductCategory;
  species: FishSpecies[];
  notes: string;
}[] = [
  {
    nameFr: "Pheasant Tail",
    nameEn: "Pheasant Tail Nymph",
    category: ProductCategory.NYMPH,
    species: ["BROOK_TROUT", "BROWN_TROUT", "RAINBOW_TROUT"],
    notes: "#14-18. La nymphe passe-partout quand on ne sait pas ce qui éclot.",
  },
  {
    nameFr: "Zebra Midge",
    nameEn: "Zebra Midge",
    category: ProductCategory.NYMPH,
    species: ["BROOK_TROUT", "BROWN_TROUT", "RAINBOW_TROUT"],
    notes: "#16-20. Fin de saison / hiver, Yamaska Nord.",
  },
  {
    nameFr: "Pupe de trichoptère",
    nameEn: "Caddis Pupa",
    category: ProductCategory.NYMPH,
    species: ["BROOK_TROUT", "BROWN_TROUT", "RAINBOW_TROUT"],
    notes: "#12-16. Complète l'Elk Wing Caddis déjà au catalogue — stade pupe/larve.",
  },
  {
    nameFr: "Hendrickson",
    nameEn: "Hendrickson",
    category: ProductCategory.DRY_FLY,
    species: ["BROOK_TROUT", "BROWN_TROUT", "RAINBOW_TROUT"],
    notes: "#10-14. Éclosion de mai, Yamaska Nord.",
  },
  {
    nameFr: "Clouser Minnow",
    nameEn: "Clouser Minnow",
    category: ProductCategory.STREAMER,
    species: ["SMALLMOUTH_BASS", "LARGEMOUTH_BASS", "NORTHERN_PIKE", "WALLEYE"],
    notes:
      "#4-10. Probablement le patron poisson-appât le plus utile localement — Châteauguay, Richelieu, Yamaska.",
  },
  {
    nameFr: "Game Changer",
    nameEn: "Game Changer",
    category: ProductCategory.STREAMER,
    species: ["SMALLMOUTH_BASS", "LARGEMOUTH_BASS", "NORTHERN_PIKE"],
    notes: "2-4po articulé. Piliers de pont et fosses du Richelieu.",
  },
  {
    nameFr: "Pike Deceiver",
    nameEn: "Pike Deceiver",
    category: ProductCategory.STREAMER,
    species: ["NORTHERN_PIKE"],
    notes: "#2-4. Gros profil poisson-appât pour la rivière aux Brochets.",
  },
  {
    nameFr: "Bunny Leech",
    nameEn: "Bunny Leech",
    category: ProductCategory.STREAMER,
    species: ["NORTHERN_PIKE", "SMALLMOUTH_BASS"],
    notes: "#2-4, bande de lapin. Brochet et gros achigans.",
  },
  {
    nameFr: "Sauterelle en mousse",
    nameEn: "Foam Hopper",
    category: ProductCategory.DRY_FLY,
    species: ["SMALLMOUTH_BASS", "LARGEMOUTH_BASS", "BROOK_TROUT", "BROWN_TROUT", "RAINBOW_TROUT"],
    notes: "#8-12. Terrestre, juillet-septembre, en bordure sur Châteauguay et Yamaska Nord.",
  },
  {
    nameFr: "Fourmi en mousse",
    nameEn: "Foam Ant",
    category: ProductCategory.DRY_FLY,
    species: ["SMALLMOUTH_BASS", "BROOK_TROUT", "BROWN_TROUT", "RAINBOW_TROUT"],
    notes: "#12-16, terrestre.",
  },
  {
    nameFr: "Coléoptère en mousse",
    nameEn: "Foam Beetle",
    category: ProductCategory.DRY_FLY,
    species: ["SMALLMOUTH_BASS", "BROOK_TROUT", "BROWN_TROUT", "RAINBOW_TROUT"],
    notes: "#10-14, terrestre, berges ombragées.",
  },
  {
    nameFr: "Popper",
    nameEn: "Popper",
    category: ProductCategory.DRY_FLY,
    species: ["SMALLMOUTH_BASS", "LARGEMOUTH_BASS"],
    notes: "#4-8, mouche de surface. Juin-septembre, pic en eau chaude.",
  },
  {
    nameFr: "Backstabber",
    nameEn: "Backstabber",
    category: ProductCategory.WET_FLY,
    species: [],
    notes: "Mouche à carpe — Châteauguay/Richelieu. La carpe n'est pas encore dans la liste des espèces.",
  },
  {
    nameFr: "Écrevisse pour carpe",
    nameEn: "Carp Crayfish",
    category: ProductCategory.WET_FLY,
    species: [],
    notes: "#6-10. Même lacune : pas d'espèce « carpe » dans l'énumération pour l'instant.",
  },
];

// Named water. The sharpest form of the Québec position — and the strongest SEO
// asset here, because nobody outside the province can credibly claim these.
const waters = [
  {
    slug: "riviere-jacques-cartier",
    nameFr: "Rivière Jacques-Cartier",
    nameEn: "Jacques-Cartier River",
    regionFr: "Capitale-Nationale",
    regionEn: "Capitale-Nationale",
    descriptionFr:
      "Une rivière à fond rocheux, rapide et claire, réputée pour son omble de fontaine et le retour du saumon atlantique. L'eau est froide et bien oxygénée : les nymphes lourdes travaillent au printemps, les sèches prennent le relais à l'éclosion du soir en été.",
    descriptionEn:
      "A fast, clear freestone river known for brook trout and the return of Atlantic salmon. The water is cold and well oxygenated: heavy nymphs earn their keep in spring, dries take over for the evening hatch in summer.",
    featured: true,
  },
  {
    slug: "riviere-sainte-anne",
    nameFr: "Rivière Sainte-Anne",
    nameEn: "Sainte-Anne River",
    regionFr: "Portneuf",
    regionEn: "Portneuf",
    descriptionFr:
      "Des fosses profondes séparées par des rapides courts — une rivière qui récompense le pêcheur qui couvre du terrain. Les éclosions de trichoptères de fin d'été y sont parmi les meilleures de la région.",
    descriptionEn:
      "Deep pools separated by short rapids — a river that rewards covering water. The late-summer caddis hatches here are among the best in the region.",
    featured: true,
  },
  {
    slug: "riviere-matapedia",
    nameFr: "Rivière Matapédia",
    nameEn: "Matapédia River",
    regionFr: "Gaspésie",
    regionEn: "Gaspésie",
    descriptionFr:
      "L'une des grandes rivières à saumon du Québec, célèbre pour son eau limpide et ses longues fosses. Une eau qui demande des présentations soignées et des mouches montées solidement.",
    descriptionEn:
      "One of Québec's great salmon rivers, famous for gin-clear water and long holding pools. Water that asks for careful presentation and flies tied to hold up.",
    featured: true,
  },
  {
    slug: "riviere-richelieu",
    nameFr: "Rivière Richelieu",
    nameEn: "Richelieu River",
    regionFr: "Montérégie",
    regionEn: "Montérégie",
    descriptionFr:
      "Plus lente et plus chaude que les rivières à truite, le Richelieu est un terrain d'achigan et de brochet. Les streamers le long des herbiers, tôt le matin et à la brunante, y font la différence.",
    descriptionEn:
      "Slower and warmer than the trout rivers, the Richelieu is bass and pike water. Streamers along the weed beds, early and at dusk, are what make the difference.",
    featured: false,
  },
  {
    slug: "fleuve-saint-laurent",
    nameFr: "Fleuve Saint-Laurent",
    nameEn: "St. Lawrence River",
    regionFr: "Montréal et Montérégie",
    regionEn: "Montréal and Montérégie",
    descriptionFr:
      "Une eau immense et variée : achigan à petite bouche dans les courants, brochet dans les baies, doré au fil des structures. Des mouches plus grosses et plus mobiles que sur nos rivières à truite.",
    descriptionEn:
      "Big, varied water: smallmouth in the current, pike in the bays, walleye along structure. Bigger, more mobile flies than our trout rivers ask for.",
    featured: true,
  },
];

// One example report so the page isn't empty at launch, and so the shape is
// obvious when you write the next one in db:studio. Unpublished by default:
// publish it once you've checked the conditions against the real river.
const sampleReport = {
  slug: "jacques-cartier-septembre",
  titleFr: "Jacques-Cartier — fin septembre",
  titleEn: "Jacques-Cartier — late September",
  conditionsFr: "Eau claire et basse, 11 °C. Ciel couvert, peu de vent.",
  conditionsEn: "Clear, low water at 11 °C. Overcast, light wind.",
  bodyFr:
    "L'eau est basse et limpide : descendez d'une taille et allongez vos bas de ligne. Les truites se tiennent dans les veines rapides plutôt qu'au fond des fosses.\n\nLes nymphes travaillent tôt, puis les trichoptères sortent en fin de journée. Approchez lentement — par cette eau, elles vous voient venir de loin.",
  bodyEn:
    "The water is low and clear: drop a size and lengthen your leaders. Trout are holding in the faster seams rather than the depths of the pools.\n\nNymphs work early, then caddis come off late in the day. Approach slowly — in this water they see you coming.",
  waterSlug: "riviere-jacques-cartier",
  productSlugs: ["bead-head-hares-ear", "elk-wing-caddis", "montana-stone"],
  published: false,
};

async function main() {
  // Waters first: products reference them by slug when they're linked.
  for (const w of waters) {
    await prisma.fishingWater.upsert({
      where: { slug: w.slug },
      update: w,
      create: w,
    });
  }
  console.log(`Seeded ${waters.length} waters.`);

  // The array above is the source of truth for the catalog — drop any product
  // left over from a previous seed run (old placeholders, discontinued
  // patterns, materials/tools/kits) that's no longer listed here.
  await prisma.product.deleteMany({
    where: { slug: { notIn: products.map((p) => p.slug) } },
  });

  for (const p of products) {
    const { variants, waters, ...productData } = p;
    // `set` rather than `connect`: the seed is the source of truth, so a water
    // removed from this file should also come off the product.
    const waterLink = waters
      ? { waters: { set: waters.map((slug) => ({ slug })) } }
      : {};
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        ...productData,
        ...waterLink,
        variants: {
          deleteMany: {},
          create: variants,
        },
      },
      create: {
        ...productData,
        ...(waters ? { waters: { connect: waters.map((slug) => ({ slug })) } } : {}),
        variants: {
          create: variants,
        },
      },
    });
  }
  console.log(`Seeded ${products.length} products.`);

  // Only ever inserted into an empty table — after that it's a living list
  // the admin dashboard adds to and clears from, so a re-seed must not stomp
  // on it the way products/waters above intentionally do.
  if ((await prisma.plannedFly.count()) === 0) {
    await prisma.plannedFly.createMany({ data: plannedFlies });
    console.log(`Seeded ${plannedFlies.length} planned flies.`);
  }

  // Reports and catches are curated by hand afterwards; this just makes sure
  // one well-formed example exists to edit rather than a blank table.
  const { waterSlug, productSlugs, ...reportData } = sampleReport;
  const water = await prisma.fishingWater.findUnique({ where: { slug: waterSlug } });
  await prisma.fishingReport.upsert({
    where: { slug: sampleReport.slug },
    update: {},
    create: {
      ...reportData,
      waterId: water?.id,
      products: { connect: productSlugs.map((slug) => ({ slug })) },
    },
  });
  console.log("Seeded 1 example fishing report (unpublished).");

  // Demo reviews were removed deliberately: seeding invented customer
  // testimonials onto a live storefront is deceptive advertising. Reviews now
  // come only from signed-in accounts with a matching paid order.
  const removed = await prisma.review.deleteMany({
    where: { email: { endsWith: "@seed.la-moucherie.test" } },
  });
  if (removed.count > 0) {
    console.log(`Removed ${removed.count} leftover demo review(s).`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
