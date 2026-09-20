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
  // The 14 patterns formerly tracked in `plannedFlies` below, now tied and
  // published as real cards — out of stock (stock: 0 on every variant) until
  // real inventory is confirmed, same as the rest of the catalog above.
  {
    slug: "pheasant-tail-nymph",
    nameFr: "Pheasant Tail",
    nameEn: "Pheasant Tail Nymph",
    descriptionFr:
      "La nymphe passe-partout par excellence — un corps fin en fibres de queue de faisan, cuivré et discret, qui imite à peu près n'importe quelle éphémère en dérive. Quand on ne sait pas ce qui éclot, c'est celle qu'on attache.",
    descriptionEn:
      "The ultimate go-anywhere nymph — a slim, coppery pheasant-tail-fibre body that passes for almost any drifting mayfly. When you don't know what's hatching, this is what goes on.",
    category: ProductCategory.NYMPH,
    basePriceCents: 350,
    images: ["/products/placeholder-fly.svg"],
    species: ["BROOK_TROUT", "BROWN_TROUT", "RAINBOW_TROUT"],
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM"],
    techniques: ["NYMPHING", "DEAD_DRIFT"],
    imitatesFr: ["Nymphe d'éphémère"],
    imitatesEn: ["Mayfly nymph"],
    variants: [
      { nameFr: "Hameçon #14", nameEn: "Hook #14", sku: "PTN-STD-14", stock: 0 },
      { nameFr: "Hameçon #16", nameEn: "Hook #16", sku: "PTN-STD-16", stock: 0 },
      { nameFr: "Hameçon #18", nameEn: "Hook #18", sku: "PTN-STD-18", stock: 0 },
    ],
  },
  {
    slug: "zebra-midge",
    nameFr: "Zebra Midge",
    nameEn: "Zebra Midge",
    descriptionFr:
      "Une minuscule nymphe de fil et de bille, montée pour imiter les larves de chironomes qui restent actives même en plein hiver. Petite, discrète, et redoutable quand rien d'autre ne travaille.",
    descriptionEn:
      "A tiny wire-and-bead nymph tied to imitate midge larvae that stay active even in the dead of winter. Small, subtle, and deadly when nothing else is working.",
    category: ProductCategory.NYMPH,
    basePriceCents: 325,
    images: ["/products/placeholder-fly.svg"],
    species: ["BROOK_TROUT", "BROWN_TROUT", "RAINBOW_TROUT"],
    seasons: ["FALL"],
    waterTypes: ["RIVER", "STREAM"],
    techniques: ["NYMPHING", "DEAD_DRIFT"],
    imitatesFr: ["Larve de chironome"],
    imitatesEn: ["Midge larva"],
    variants: [
      { nameFr: "Hameçon #16", nameEn: "Hook #16", sku: "ZM-STD-16", stock: 0 },
      { nameFr: "Hameçon #18", nameEn: "Hook #18", sku: "ZM-STD-18", stock: 0 },
      { nameFr: "Hameçon #20", nameEn: "Hook #20", sku: "ZM-STD-20", stock: 0 },
    ],
  },
  {
    slug: "caddis-pupa",
    nameFr: "Pupe de trichoptère",
    nameEn: "Caddis Pupa",
    descriptionFr:
      "Le complément logique de notre Elk Wing Caddis : une imitation de la pupe qui remonte vers la surface juste avant l'éclosion. Efficace dans les minutes qui précèdent une sortie de trichoptères en surface.",
    descriptionEn:
      "The logical companion to our Elk Wing Caddis: an imitation of the pupa rising toward the surface just before it hatches. Deadly in the minutes right before caddis start popping on top.",
    category: ProductCategory.NYMPH,
    basePriceCents: 350,
    images: ["/products/placeholder-fly.svg"],
    species: ["BROOK_TROUT", "BROWN_TROUT", "RAINBOW_TROUT"],
    seasons: ["SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM"],
    techniques: ["NYMPHING", "SWING"],
    imitatesFr: ["Pupe de trichoptère"],
    imitatesEn: ["Caddis pupa"],
    variants: [
      { nameFr: "Hameçon #12", nameEn: "Hook #12", sku: "CP-STD-12", stock: 0 },
      { nameFr: "Hameçon #14", nameEn: "Hook #14", sku: "CP-STD-14", stock: 0 },
      { nameFr: "Hameçon #16", nameEn: "Hook #16", sku: "CP-STD-16", stock: 0 },
    ],
  },
  {
    slug: "hendrickson",
    nameFr: "Hendrickson",
    nameEn: "Hendrickson",
    descriptionFr:
      "Une sèche classique montée pour l'éclosion de mai, quand les grandes éphémères Hendrickson sortent en nombre. Silhouette fine, hackle bien réparti, pour flotter juste dans le courant.",
    descriptionEn:
      "A classic dry tied for the May Hendrickson hatch, when the big mayflies come off in numbers. A slim profile and evenly-wound hackle to ride right in the film.",
    category: ProductCategory.DRY_FLY,
    basePriceCents: 375,
    images: ["/products/placeholder-fly.svg"],
    species: ["BROOK_TROUT", "BROWN_TROUT", "RAINBOW_TROUT"],
    seasons: ["SPRING"],
    waterTypes: ["RIVER", "STREAM"],
    techniques: ["DEAD_DRIFT"],
    imitatesFr: ["Éphémère Hendrickson"],
    imitatesEn: ["Hendrickson mayfly"],
    variants: [
      { nameFr: "Hameçon #10", nameEn: "Hook #10", sku: "HDK-STD-10", stock: 0 },
      { nameFr: "Hameçon #12", nameEn: "Hook #12", sku: "HDK-STD-12", stock: 0 },
      { nameFr: "Hameçon #14", nameEn: "Hook #14", sku: "HDK-STD-14", stock: 0 },
    ],
  },
  {
    slug: "clouser-minnow",
    nameFr: "Clouser Minnow",
    nameEn: "Clouser Minnow",
    descriptionFr:
      "Probablement le streamer poisson-appât le plus polyvalent qui existe — des yeux plombés qui font nager la mouche en jig, efficaces autant pour l'achigan que pour le doré ou le brochet. Un incontournable de toute boîte à streamers.",
    descriptionEn:
      "Probably the most versatile baitfish streamer there is — weighted eyes that give it a jigging action, just as effective on bass, walleye, or pike. A must in any streamer box.",
    category: ProductCategory.STREAMER,
    basePriceCents: 475,
    images: ["/products/placeholder-fly.svg"],
    species: ["SMALLMOUTH_BASS", "LARGEMOUTH_BASS", "NORTHERN_PIKE", "WALLEYE"],
    seasons: ["SUMMER", "FALL"],
    waterTypes: ["RIVER", "LAKE", "STILLWATER"],
    techniques: ["STRIP", "TROLLING"],
    imitatesFr: ["Poisson-appât", "Ménés"],
    imitatesEn: ["Baitfish", "Minnows"],
    variants: [
      { nameFr: "Hameçon #4", nameEn: "Hook #4", sku: "CLM-STD-04", stock: 0 },
      { nameFr: "Hameçon #6", nameEn: "Hook #6", sku: "CLM-STD-06", stock: 0 },
      { nameFr: "Hameçon #8", nameEn: "Hook #8", sku: "CLM-STD-08", stock: 0 },
      { nameFr: "Hameçon #10", nameEn: "Hook #10", sku: "CLM-STD-10", stock: 0 },
    ],
  },
  {
    slug: "game-changer",
    nameFr: "Game Changer",
    nameEn: "Game Changer",
    descriptionFr:
      "Un streamer articulé au mouvement très réaliste — le corps segmenté ondule dans l'eau comme un vrai poisson-appât, même au repos. Redoutable autour des piliers de pont et dans les fosses profondes.",
    descriptionEn:
      "An articulated streamer with an unusually lifelike swim — the segmented body undulates like a real baitfish even at rest. Deadly around bridge pilings and deep holding pools.",
    category: ProductCategory.STREAMER,
    basePriceCents: 650,
    images: ["/products/placeholder-fly.svg"],
    species: ["SMALLMOUTH_BASS", "LARGEMOUTH_BASS", "NORTHERN_PIKE"],
    seasons: ["SUMMER", "FALL"],
    waterTypes: ["RIVER", "LAKE"],
    techniques: ["STRIP"],
    imitatesFr: ["Poisson-appât articulé"],
    imitatesEn: ["Articulated baitfish"],
    variants: [
      { nameFr: "2 po", nameEn: '2"', sku: "GC-STD-02", stock: 0 },
      { nameFr: "3 po", nameEn: '3"', sku: "GC-STD-03", stock: 0 },
      { nameFr: "4 po", nameEn: '4"', sku: "GC-STD-04", stock: 0 },
    ],
  },
  {
    slug: "pike-deceiver",
    nameFr: "Pike Deceiver",
    nameEn: "Pike Deceiver",
    descriptionFr:
      "Une version agrandie du Deceiver, montée large et haute pour offrir un gros profil aux brochets. Du mouvement, de la présence, et assez de flash pour se faire voir en eau teintée.",
    descriptionEn:
      "A scaled-up Deceiver, tied wide and tall to give pike a big profile to key on. Plenty of movement, presence, and enough flash to get noticed in stained water.",
    category: ProductCategory.STREAMER,
    basePriceCents: 550,
    images: ["/products/placeholder-fly.svg"],
    species: ["NORTHERN_PIKE"],
    seasons: ["SPRING", "SUMMER"],
    waterTypes: ["RIVER", "LAKE"],
    techniques: ["STRIP"],
    imitatesFr: ["Poisson-appât"],
    imitatesEn: ["Baitfish"],
    variants: [
      { nameFr: "Hameçon #4", nameEn: "Hook #4", sku: "PD-STD-04", stock: 0 },
      { nameFr: "Hameçon #2", nameEn: "Hook #2", sku: "PD-STD-02", stock: 0 },
    ],
  },
  {
    slug: "bunny-leech",
    nameFr: "Bunny Leech",
    nameEn: "Bunny Leech",
    descriptionFr:
      "Une bande de fourrure de lapin montée en queue — un mouvement dans l'eau qu'aucun matériel synthétique n'égale vraiment. Simple, increvable, et efficace sur le brochet comme sur les gros achigans.",
    descriptionEn:
      "A strip of rabbit fur tied in as the tail — movement in the water that no synthetic really matches. Simple, tough, and just as effective on pike as on big bass.",
    category: ProductCategory.STREAMER,
    basePriceCents: 500,
    images: ["/products/placeholder-fly.svg"],
    species: ["NORTHERN_PIKE", "SMALLMOUTH_BASS"],
    seasons: ["SUMMER", "FALL"],
    waterTypes: ["RIVER", "LAKE"],
    techniques: ["STRIP"],
    imitatesFr: ["Sangsue", "Poisson-appât"],
    imitatesEn: ["Leech", "Baitfish"],
    variants: [
      { nameFr: "Hameçon #4", nameEn: "Hook #4", sku: "BL-STD-04", stock: 0 },
      { nameFr: "Hameçon #2", nameEn: "Hook #2", sku: "BL-STD-02", stock: 0 },
    ],
  },
  {
    slug: "foam-hopper",
    nameFr: "Sauterelle en mousse",
    nameEn: "Foam Hopper",
    descriptionFr:
      "Une imitation de sauterelle en mousse, increvable, qui flotte quelle que soit la dérive. Terrestre par excellence : à lancer en bordure les jours chauds et secs de la fin de l'été.",
    descriptionEn:
      "A foam grasshopper imitation, tough enough to survive any drift, that floats no matter what. The classic terrestrial: cast it along the banks on hot, dry late-summer days.",
    category: ProductCategory.DRY_FLY,
    basePriceCents: 400,
    images: ["/products/placeholder-fly.svg"],
    species: ["SMALLMOUTH_BASS", "LARGEMOUTH_BASS", "BROOK_TROUT", "BROWN_TROUT", "RAINBOW_TROUT"],
    seasons: ["SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM", "LAKE"],
    techniques: ["DEAD_DRIFT", "SKATE"],
    imitatesFr: ["Sauterelle"],
    imitatesEn: ["Grasshopper"],
    variants: [
      { nameFr: "Hameçon #8", nameEn: "Hook #8", sku: "FH-STD-08", stock: 0 },
      { nameFr: "Hameçon #10", nameEn: "Hook #10", sku: "FH-STD-10", stock: 0 },
      { nameFr: "Hameçon #12", nameEn: "Hook #12", sku: "FH-STD-12", stock: 0 },
    ],
  },
  {
    slug: "foam-ant",
    nameFr: "Fourmi en mousse",
    nameEn: "Foam Ant",
    descriptionFr:
      "Une petite fourmi en mousse, discrète mais diablement efficace en pleine canicule, quand les insectes terrestres tombent dans l'eau depuis les branches basses.",
    descriptionEn:
      "A small foam ant, unassuming but brutally effective at the height of summer, when terrestrials keep dropping into the water from overhanging branches.",
    category: ProductCategory.DRY_FLY,
    basePriceCents: 350,
    images: ["/products/placeholder-fly.svg"],
    species: ["SMALLMOUTH_BASS", "BROOK_TROUT", "BROWN_TROUT", "RAINBOW_TROUT"],
    seasons: ["SUMMER"],
    waterTypes: ["RIVER", "STREAM"],
    techniques: ["DEAD_DRIFT"],
    imitatesFr: ["Fourmi"],
    imitatesEn: ["Ant"],
    variants: [
      { nameFr: "Hameçon #12", nameEn: "Hook #12", sku: "FA-STD-12", stock: 0 },
      { nameFr: "Hameçon #14", nameEn: "Hook #14", sku: "FA-STD-14", stock: 0 },
      { nameFr: "Hameçon #16", nameEn: "Hook #16", sku: "FA-STD-16", stock: 0 },
    ],
  },
  {
    slug: "foam-beetle",
    nameFr: "Coléoptère en mousse",
    nameEn: "Foam Beetle",
    descriptionFr:
      "Un coléoptère en mousse, monté bas sur l'eau, pour les truites qui se tiennent sous les branches en bordure. Petite mouche, grosse confiance quand la truite regarde vers le haut.",
    descriptionEn:
      "A foam beetle, tied to sit low in the film, for trout holding under overhanging branches. A small fly that earns a lot of confidence once trout start looking up.",
    category: ProductCategory.DRY_FLY,
    basePriceCents: 350,
    images: ["/products/placeholder-fly.svg"],
    species: ["SMALLMOUTH_BASS", "BROOK_TROUT", "BROWN_TROUT", "RAINBOW_TROUT"],
    seasons: ["SUMMER"],
    waterTypes: ["RIVER", "STREAM"],
    techniques: ["DEAD_DRIFT"],
    imitatesFr: ["Coléoptère"],
    imitatesEn: ["Beetle"],
    variants: [
      { nameFr: "Hameçon #10", nameEn: "Hook #10", sku: "FB-STD-10", stock: 0 },
      { nameFr: "Hameçon #12", nameEn: "Hook #12", sku: "FB-STD-12", stock: 0 },
      { nameFr: "Hameçon #14", nameEn: "Hook #14", sku: "FB-STD-14", stock: 0 },
    ],
  },
  {
    slug: "popper",
    nameFr: "Popper",
    nameEn: "Popper",
    descriptionFr:
      "Une mouche de surface en mousse dure, avec une tête concave qui fait un vrai « pop » à la récupération. L'achigan qui frappe dessus, c'est le moment le plus excitant de l'été.",
    descriptionEn:
      'A hard-foam topwater fly with a concave face that makes a real "pop" on the strip. A bass exploding on this is the most exciting take of the summer.',
    category: ProductCategory.DRY_FLY,
    basePriceCents: 450,
    images: ["/products/placeholder-fly.svg"],
    species: ["SMALLMOUTH_BASS", "LARGEMOUTH_BASS"],
    seasons: ["SUMMER"],
    waterTypes: ["LAKE", "STILLWATER", "RIVER"],
    techniques: ["STRIP", "SKATE"],
    imitatesFr: ["Grenouille", "Insecte de surface"],
    imitatesEn: ["Frog", "Surface bug"],
    variants: [
      { nameFr: "Hameçon #4", nameEn: "Hook #4", sku: "POP-STD-04", stock: 0 },
      { nameFr: "Hameçon #6", nameEn: "Hook #6", sku: "POP-STD-06", stock: 0 },
      { nameFr: "Hameçon #8", nameEn: "Hook #8", sku: "POP-STD-08", stock: 0 },
    ],
  },
  {
    slug: "backstabber",
    nameFr: "Backstabber",
    nameEn: "Backstabber",
    descriptionFr:
      "Une mouche à carpe montée pointe vers le haut, pour éviter de s'accrocher au fond en pêchant à vue dans les hauts-fonds. Discrète, elle imite une petite proie qui fuit devant le poisson.",
    descriptionEn:
      "A carp fly tied hook-point-up to avoid snagging bottom while sight-fishing the shallows. A subtle pattern that reads as small prey fleeing in front of a feeding fish.",
    category: ProductCategory.WET_FLY,
    basePriceCents: 450,
    images: ["/products/placeholder-fly.svg"],
    // Carp isn't in the FishSpecies enum yet — see the note this pattern
    // carried on the planned-flies list.
    species: [],
    seasons: ["SUMMER"],
    waterTypes: ["RIVER", "LAKE"],
    techniques: ["DEAD_DRIFT"],
    imitatesFr: ["Petite proie", "Larve"],
    imitatesEn: ["Small prey", "Larva"],
    variants: [
      { nameFr: "Hameçon #6", nameEn: "Hook #6", sku: "BS-STD-06", stock: 0 },
      { nameFr: "Hameçon #8", nameEn: "Hook #8", sku: "BS-STD-08", stock: 0 },
      { nameFr: "Hameçon #10", nameEn: "Hook #10", sku: "BS-STD-10", stock: 0 },
    ],
  },
  {
    slug: "carp-crayfish",
    nameFr: "Écrevisse pour carpe",
    nameEn: "Carp Crayfish",
    descriptionFr:
      "Une imitation d'écrevisse montée pour la carpe, avec des pinces mobiles et un lest orienté pour se poser pinces en avant. À présenter tranquillement devant un poisson repéré, jamais en pleine face.",
    descriptionEn:
      "A crayfish imitation tied for carp, with mobile claws and weight positioned to land claws-first. Presented quietly in front of a spotted fish, never right in its face.",
    category: ProductCategory.WET_FLY,
    basePriceCents: 475,
    images: ["/products/placeholder-fly.svg"],
    species: [],
    seasons: ["SUMMER"],
    waterTypes: ["RIVER", "LAKE"],
    techniques: ["DEAD_DRIFT"],
    imitatesFr: ["Écrevisse"],
    imitatesEn: ["Crayfish"],
    variants: [
      { nameFr: "Hameçon #6", nameEn: "Hook #6", sku: "CCR-STD-06", stock: 0 },
      { nameFr: "Hameçon #8", nameEn: "Hook #8", sku: "CCR-STD-08", stock: 0 },
      { nameFr: "Hameçon #10", nameEn: "Hook #10", sku: "CCR-STD-10", stock: 0 },
    ],
  },
];


// A tying to-do list, not catalog data — patterns worth adding once they're
// actually tied, priced and photographed. Starts empty: the 14 patterns
// originally curated here (from a southwestern Montérégie river/species
// guide) have all since been tied and moved into `products` above. Only
// inserted once, into an empty table — see the `plannedFlies.count()` guard
// in `main()` — since after that it's a living list the admin dashboard
// adds to and clears from.
const plannedFlies: {
  nameFr: string;
  nameEn: string;
  category: ProductCategory;
  species: FishSpecies[];
  notes: string;
}[] = [];

// Named water. The sharpest form of the Québec position — and the strongest SEO
// asset here, because nobody outside the province can credibly claim these.
const waters = [
  // The seven the bench actually fishes, then three destination rivers worth
  // naming. Regions are the grouping the /shop/water index reads, so a region
  // qualified with a sub-area ("Montérégie — Haute-Yamaska") still files under
  // its region there.
  {
    slug: "fleuve-saint-laurent",
    nameFr: "Fleuve Saint-Laurent",
    nameEn: "St. Lawrence River",
    regionFr: "Montérégie",
    regionEn: "Montérégie",
    descriptionFr:
      "Le plus grand plan d'eau qu'on pêche, et le plus varié : achigan à petite et à grande bouche, brochet, doré et carpe, souvent à quelques minutes de la maison. Les herbiers et les battures des secteurs calmes se pêchent très bien à la mouche.",
    descriptionEn:
      "The biggest water we fish and the most varied: smallmouth and largemouth bass, pike, walleye and carp, often minutes from home. The weed beds and shallow flats of the slower stretches fish very well on a fly.",
    featured: true,
  },
  {
    slug: "riviere-richelieu",
    nameFr: "Rivière Richelieu",
    nameEn: "Richelieu River",
    regionFr: "Montérégie",
    regionEn: "Montérégie",
    descriptionFr:
      "Du lac Champlain jusqu'à Sorel, une grande rivière lente et riche. Achigan à petite bouche, brochet, doré et carpe ; les rapides de Chambly sont un secteur à part.",
    descriptionEn:
      "From Lake Champlain down to Sorel, a large, slow, fertile river. Smallmouth bass, pike, walleye and carp — and the Chambly rapids are their own kind of water.",
    featured: true,
  },
  {
    slug: "riviere-chateauguay",
    nameFr: "Rivière Châteauguay",
    nameEn: "Châteauguay River",
    regionFr: "Montérégie",
    regionEn: "Montérégie",
    descriptionFr:
      "Une rivière de la Montérégie qui prend sa source dans l'État de New York avant de se jeter dans le lac Saint-Louis. Eaux chaudes sur la majeure partie de son cours : achigan, brochet et doré.",
    descriptionEn:
      "A Montérégie river rising in New York State before emptying into Lac Saint-Louis. Warmwater along most of its length: bass, pike and walleye.",
    featured: true,
  },
  {
    slug: "riviere-yamaska-nord",
    nameFr: "Rivière Yamaska Nord",
    nameEn: "Yamaska Nord River",
    regionFr: "Montérégie — Haute-Yamaska",
    regionEn: "Montérégie — Haute-Yamaska",
    descriptionFr:
      "Plus petite et plus intime que les autres, elle traverse le secteur de Waterloo et de Granby. Les portions hautes gardent de l'eau fraîche et de la truite.",
    descriptionEn:
      "Smaller and more intimate than the others, running through the Waterloo and Granby area. The upper reaches hold cooler water and trout.",
    featured: false,
  },
  {
    slug: "riviere-du-nord",
    nameFr: "Rivière du Nord",
    nameEn: "Rivière du Nord",
    regionFr: "Laurentides",
    regionEn: "Laurentides",
    descriptionFr:
      "La rivière des Laurentides qui traverse Saint-Jérôme et Prévost avant de rejoindre l'Outaouais. Truite dans les secteurs frais, achigan plus bas.",
    descriptionEn:
      "The Laurentian river running through Saint-Jérôme and Prévost before joining the Ottawa. Trout in the cooler stretches, bass further down.",
    featured: false,
  },
  {
    slug: "riviere-rouge",
    nameFr: "Rivière Rouge",
    nameEn: "Rivière Rouge",
    regionFr: "Laurentides",
    regionEn: "Laurentides",
    descriptionFr:
      "Plus au nord et plus sauvage, connue pour ses rapides autant que pour sa pêche. Truite brune et mouchetée dans les secteurs frais, achigan et doré vers l'embouchure.",
    descriptionEn:
      "Further north and wilder, as well known for its whitewater as its fishing. Brown and brook trout in the cooler stretches, bass and walleye toward the mouth.",
    featured: false,
  },
  {
    slug: "riviere-nicolet",
    nameFr: "Rivière Nicolet",
    nameEn: "Nicolet River",
    regionFr: "Centre-du-Québec",
    regionEn: "Centre-du-Québec",
    descriptionFr:
      "Elle descend des Appalaches vers le lac Saint-Pierre. Les branches supérieures sont des eaux à truite ; le bas de la rivière se réchauffe et donne de l'achigan.",
    descriptionEn:
      "Draining the Appalachians toward Lac Saint-Pierre. The upper branches are trout water; the lower river warms and gives up bass.",
    featured: false,
  },
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
    featured: false,
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
    featured: false,
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
    featured: false,
  },
];

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

  // Anything in the database that this file doesn't list. That used to be
  // deleted outright, on the theory that this array is the catalog's source of
  // truth. It stopped being true the moment a pattern was added straight to the
  // database — and 14 of them had been, so the documented `npm run db:seed`
  // would have silently destroyed a third of the live catalog, its variants and
  // its material links. A seed script must not be able to do that by accident,
  // so removal is now opt-in and always names what it would take.
  const strays = await prisma.product.findMany({
    where: { slug: { notIn: products.map((p) => p.slug) } },
    select: { slug: true },
  });
  if (strays.length > 0) {
    if (process.env.SEED_DELETE_STRAYS === "1") {
      await prisma.product.deleteMany({
        where: { slug: { in: strays.map((p) => p.slug) } },
      });
      console.log(`Deleted ${strays.length} product(s) not listed here.`);
    } else {
      console.log(
        `\nLeaving ${strays.length} product(s) in place that this file doesn't list:\n` +
          strays.map((p) => `  ${p.slug}`).join("\n") +
          `\nAdd them to this file, or re-run with SEED_DELETE_STRAYS=1 to remove them.\n`
      );
    }
  }

  for (const p of products) {
    const { variants, waters, ...productData } = p;
    // `set` rather than `connect`: the seed is the source of truth, so a water
    // removed from this file should also come off the product.
    const waterLink = waters
      ? { waters: { set: waters.map((slug) => ({ slug })) } }
      : {};
    const saved = await prisma.product.upsert({
      where: { slug: p.slug },
      update: { ...productData, ...waterLink },
      create: {
        ...productData,
        ...(waters ? { waters: { connect: waters.map((slug) => ({ slug })) } } : {}),
      },
    });

    // Variants are matched on their SKU rather than deleted and recreated.
    // Recreating them reset every stock count to the seed's number and broke
    // the `OrderItem.variantId` link on past orders — so re-running the seed to
    // refresh a description would also have wiped the inventory. `stock` is
    // therefore only ever set when the variant is first created; after that it
    // belongs to whoever counts the flies, not to this file.
    for (const v of variants) {
      await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: {
          nameFr: v.nameFr,
          nameEn: v.nameEn,
          priceCents: v.priceCents ?? null,
          productId: saved.id,
        },
        create: { ...v, productId: saved.id },
      });
    }
    await prisma.productVariant.deleteMany({
      where: { productId: saved.id, sku: { notIn: variants.map((v) => v.sku) } },
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
