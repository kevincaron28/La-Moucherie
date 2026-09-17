// Standard published dressings for the catalogue, used to seed Material and
// ProductMaterial.
//
// These are the canonical recipes for well-known patterns, NOT a record of how
// this bench actually ties them — substitutions, thread colours and hook models
// are personal. That's why every product seeds with materialsPublic = false:
// nothing reaches a customer until someone has read that fly's recipe and
// turned it on.
//
// Material rows are deliberately generic ("Brown hackle", not "Whiting brown
// saddle #14") so that two patterns needing brown hackle point at the SAME row
// and the run sheet's shopping list can collapse them into one line. The
// per-pattern detail belongs in the spec field of the recipe line.

import type { MaterialCategory } from "@prisma/client";

export type MaterialSeed = {
  key: string;
  category: MaterialCategory;
  nameEn: string;
  nameFr: string;
};

export type RecipeLine = {
  key: string;
  specEn?: string;
  specFr?: string;
  /** Only for things consumed exactly N per fly — hooks, beads, eyes. */
  perFlyQty?: number;
};

export const MATERIALS: MaterialSeed[] = [
  // Hooks
  { key: "hook-dry", category: "HOOK", nameEn: "Dry-fly hook", nameFr: "Hameçon à mouche sèche" },
  { key: "hook-nymph", category: "HOOK", nameEn: "Nymph hook", nameFr: "Hameçon à nymphe" },
  { key: "hook-scud", category: "HOOK", nameEn: "Curved scud/pupa hook", nameFr: "Hameçon courbé (scud)" },
  { key: "hook-wet", category: "HOOK", nameEn: "Wet-fly hook", nameFr: "Hameçon à mouche noyée" },
  { key: "hook-streamer", category: "HOOK", nameEn: "Streamer hook", nameFr: "Hameçon à streamer" },
  { key: "hook-popper", category: "HOOK", nameEn: "Popper / bass-bug hook", nameFr: "Hameçon à popper" },

  // Weight
  { key: "bead-brass", category: "BEAD_WEIGHT", nameEn: "Brass bead", nameFr: "Bille de laiton" },
  { key: "bead-tungsten", category: "BEAD_WEIGHT", nameEn: "Tungsten bead", nameFr: "Bille de tungstène" },
  { key: "lead-wire", category: "BEAD_WEIGHT", nameEn: "Lead-free weighting wire", nameFr: "Fil de lestage sans plomb" },
  { key: "dumbbell-eyes", category: "BEAD_WEIGHT", nameEn: "Dumbbell eyes", nameFr: "Yeux haltères" },

  // Thread
  { key: "thread-black", category: "THREAD", nameEn: "Black thread", nameFr: "Fil de montage noir" },
  { key: "thread-brown", category: "THREAD", nameEn: "Brown thread", nameFr: "Fil de montage brun" },
  { key: "thread-olive", category: "THREAD", nameEn: "Olive thread", nameFr: "Fil de montage olive" },
  { key: "thread-tan", category: "THREAD", nameEn: "Tan thread", nameFr: "Fil de montage beige" },
  { key: "thread-yellow", category: "THREAD", nameEn: "Yellow thread", nameFr: "Fil de montage jaune" },
  { key: "thread-orange", category: "THREAD", nameEn: "Orange thread", nameFr: "Fil de montage orangé" },
  { key: "thread-white", category: "THREAD", nameEn: "White thread", nameFr: "Fil de montage blanc" },
  { key: "silk-orange", category: "THREAD", nameEn: "Orange tying silk", nameFr: "Soie de montage orangée" },

  // Tails
  { key: "hackle-fibres", category: "TAIL", nameEn: "Hackle fibres", nameFr: "Barbes de hackle" },
  { key: "microfibbets", category: "TAIL", nameEn: "Microfibetts", nameFr: "Microfibetts" },
  { key: "moose-hair", category: "TAIL", nameEn: "Moose body hair", nameFr: "Poil de corps d'orignal" },
  { key: "pheasant-tail", category: "TAIL", nameEn: "Pheasant tail fibres", nameFr: "Barbes de queue de faisan" },
  { key: "marabou", category: "TAIL", nameEn: "Marabou", nameFr: "Marabout" },
  { key: "bunny-strip", category: "TAIL", nameEn: "Rabbit zonker strip", nameFr: "Bande de lapin (zonker)" },

  // Bodies
  { key: "dubbing-grey", category: "BODY", nameEn: "Grey / muskrat dubbing", nameFr: "Dubbing gris (rat musqué)" },
  { key: "dubbing-olive", category: "BODY", nameEn: "Olive dubbing", nameFr: "Dubbing olive" },
  { key: "dubbing-yellow", category: "BODY", nameEn: "Pale yellow dubbing", nameFr: "Dubbing jaune pâle" },
  { key: "dubbing-cream", category: "BODY", nameEn: "Cream dubbing", nameFr: "Dubbing crème" },
  { key: "dubbing-black", category: "BODY", nameEn: "Black dubbing", nameFr: "Dubbing noir" },
  { key: "dubbing-hares", category: "BODY", nameEn: "Hare's ear dubbing", nameFr: "Dubbing d'oreille de lièvre" },
  { key: "peacock-herl", category: "BODY", nameEn: "Peacock herl", nameFr: "Herl de paon" },
  { key: "chenille", category: "BODY", nameEn: "Chenille", nameFr: "Chenille" },
  { key: "gc-chenille", category: "BODY", nameEn: "Game Changer chenille", nameFr: "Chenille Game Changer" },
  { key: "floss", category: "BODY", nameEn: "Floss", nameFr: "Floss" },
  { key: "foam-2mm", category: "BODY", nameEn: "2mm closed-cell foam", nameFr: "Mousse à cellules fermées 2 mm" },
  { key: "popper-head", category: "BODY", nameEn: "Preformed popper head", nameFr: "Tête de popper préformée" },
  { key: "deer-hair", category: "BODY", nameEn: "Deer body hair", nameFr: "Poil de corps de chevreuil" },
  { key: "antron-green", category: "BODY", nameEn: "Green Antron / Z-lon", nameFr: "Antron vert" },
  { key: "fish-spine", category: "BODY", nameEn: "Articulated shanks", nameFr: "Tiges articulées" },

  // Ribbing
  { key: "wire-copper", category: "RIB", nameEn: "Copper wire", nameFr: "Fil de cuivre" },
  { key: "wire-gold", category: "RIB", nameEn: "Gold wire", nameFr: "Fil d'or" },
  { key: "wire-silver", category: "RIB", nameEn: "Silver wire", nameFr: "Fil d'argent" },
  { key: "tinsel-flat", category: "RIB", nameEn: "Flat tinsel", nameFr: "Tinsel plat" },

  // Hackle
  { key: "hackle-grizzly", category: "HACKLE", nameEn: "Grizzly hackle", nameFr: "Hackle grizzly" },
  { key: "hackle-brown", category: "HACKLE", nameEn: "Brown hackle", nameFr: "Hackle brun" },
  { key: "hackle-dun", category: "HACKLE", nameEn: "Blue dun hackle", nameFr: "Hackle dun" },
  { key: "hackle-cream", category: "HACKLE", nameEn: "Cream hackle", nameFr: "Hackle crème" },
  { key: "hackle-ginger", category: "HACKLE", nameEn: "Ginger hackle", nameFr: "Hackle ginger" },
  { key: "hackle-black", category: "HACKLE", nameEn: "Black hackle", nameFr: "Hackle noir" },
  { key: "partridge", category: "HACKLE", nameEn: "Partridge hackle", nameFr: "Plume de perdrix" },

  // Wings & flash
  { key: "elk-hair", category: "WING", nameEn: "Elk hair", nameFr: "Poil de wapiti" },
  { key: "calf-tail", category: "WING", nameEn: "Calf body hair", nameFr: "Poil de veau" },
  { key: "poly-yarn", category: "WING", nameEn: "Poly yarn", nameFr: "Poly yarn" },
  { key: "wood-duck", category: "WING", nameEn: "Wood duck flank", nameFr: "Flanc de canard branchu" },
  { key: "hen-hackle-tips", category: "WING", nameEn: "Hen / saddle hackle tips", nameFr: "Pointes de hackle de poule" },
  { key: "bucktail", category: "WING", nameEn: "Bucktail", nameFr: "Bucktail" },
  { key: "krystal-flash", category: "WING", nameEn: "Krystal Flash", nameFr: "Krystal Flash" },
  { key: "flashabou", category: "WING", nameEn: "Flashabou", nameFr: "Flashabou" },

  // Heads & finishing
  { key: "stick-on-eyes", category: "HEAD", nameEn: "Stick-on eyes", nameFr: "Yeux autocollants" },
  { key: "egg-yarn", category: "HEAD", nameEn: "Egg yarn", nameFr: "Fil à œuf" },
  { key: "uv-resin", category: "ADHESIVE", nameEn: "UV resin", nameFr: "Résine UV" },
  { key: "rubber-legs", category: "OTHER", nameEn: "Rubber legs", nameFr: "Pattes de caoutchouc" },
];

/** Keyed by Product.slug. Array order is tying order. */
export const RECIPES: Record<string, RecipeLine[]> = {
  // ------------------------------------------------------------- DRY FLIES
  "parachute-adams": [
    { key: "hook-dry", specEn: "standard, #12-18", specFr: "standard, #12-18", perFlyQty: 1 },
    { key: "thread-black", specEn: "8/0", specFr: "8/0" },
    { key: "poly-yarn", specEn: "white, parachute post", specFr: "blanc, poste parachute" },
    { key: "hackle-fibres", specEn: "grizzly and brown, mixed", specFr: "grizzly et brun, mélangés" },
    { key: "dubbing-grey", specEn: "adams grey", specFr: "gris adams" },
    { key: "hackle-grizzly", specEn: "wound around the post", specFr: "enroulé autour du poste" },
  ],
  "blue-winged-olive": [
    { key: "hook-dry", specEn: "standard, #16-20", specFr: "standard, #16-20", perFlyQty: 1 },
    { key: "thread-olive", specEn: "14/0 on the small sizes", specFr: "14/0 dans les petites tailles" },
    { key: "microfibbets", specEn: "dun, split tail", specFr: "dun, queue séparée" },
    { key: "dubbing-olive", specEn: "olive-grey, sparse", specFr: "olive-gris, clairsemé" },
    { key: "poly-yarn", specEn: "dun, upright post", specFr: "dun, poste droit" },
    { key: "hackle-dun", specEn: "parachute", specFr: "parachute" },
  ],
  "light-cahill": [
    { key: "hook-dry", specEn: "standard, #12-16", specFr: "standard, #12-16", perFlyQty: 1 },
    { key: "thread-tan", specEn: "8/0 cream", specFr: "8/0 crème" },
    { key: "hackle-fibres", specEn: "cream", specFr: "crème" },
    { key: "dubbing-cream", specEn: "cream-yellow", specFr: "crème-jaune" },
    { key: "wood-duck", specEn: "upright and divided", specFr: "droites et séparées" },
    { key: "hackle-cream", specEn: "cream", specFr: "crème" },
  ],
  "sulphur-dun": [
    { key: "hook-dry", specEn: "standard, #14-18", specFr: "standard, #14-18", perFlyQty: 1 },
    { key: "thread-yellow", specEn: "8/0", specFr: "8/0" },
    { key: "microfibbets", specEn: "split tail", specFr: "queue séparée" },
    { key: "dubbing-yellow", specEn: "pale yellow with a touch of orange", specFr: "jaune pâle, une pointe d'orangé" },
    { key: "poly-yarn", specEn: "pale dun post", specFr: "poste dun pâle" },
    { key: "hackle-ginger", specEn: "light ginger", specFr: "ginger pâle" },
  ],
  "march-brown": [
    { key: "hook-dry", specEn: "standard, #10-14", specFr: "standard, #10-14", perFlyQty: 1 },
    { key: "thread-brown", specEn: "8/0", specFr: "8/0" },
    { key: "hackle-fibres", specEn: "brown, long", specFr: "brun, longues" },
    { key: "dubbing-hares", specEn: "amber hare's ear", specFr: "oreille de lièvre ambrée" },
    { key: "wire-gold", specEn: "fine, counter-wrapped", specFr: "fin, enroulé à contresens" },
    { key: "wood-duck", specEn: "mottled, divided", specFr: "marbrées, séparées" },
    { key: "hackle-brown", specEn: "brown and grizzly mixed", specFr: "brun et grizzly mélangés" },
  ],
  "green-drake": [
    { key: "hook-dry", specEn: "2XL, #8-12", specFr: "2XL, #8-12", perFlyQty: 1 },
    { key: "thread-olive", specEn: "6/0", specFr: "6/0" },
    { key: "moose-hair", specEn: "three fibres, long", specFr: "trois barbes, longues" },
    { key: "dubbing-cream", specEn: "pale olive-cream", specFr: "crème olivacé" },
    { key: "thread-brown", specEn: "rib, segmenting the body", specFr: "côte, segmente le corps" },
    { key: "calf-tail", specEn: "white, upright", specFr: "blanc, droit" },
    { key: "hackle-grizzly", specEn: "grizzly dyed olive", specFr: "grizzly teint olive" },
  ],
  "hexagenia-dun": [
    { key: "hook-dry", specEn: "3XL, #6-8", specFr: "3XL, #6-8", perFlyQty: 1 },
    { key: "thread-yellow", specEn: "6/0, strong", specFr: "6/0, solide" },
    { key: "moose-hair", specEn: "long tail fibres", specFr: "longues barbes de queue" },
    { key: "deer-hair", specEn: "spun or extended body", specFr: "corps filé ou prolongé" },
    { key: "dubbing-yellow", specEn: "golden yellow thorax", specFr: "thorax jaune doré" },
    { key: "calf-tail", specEn: "white, tall — you fish this in the dark", specFr: "blanc, haut — ça se pêche à la noirceur" },
    { key: "hackle-grizzly", specEn: "heavy, for flotation", specFr: "fourni, pour la flottaison" },
  ],
  "slate-drake": [
    { key: "hook-dry", specEn: "standard, #10-14", specFr: "standard, #10-14", perFlyQty: 1 },
    { key: "thread-black", specEn: "8/0", specFr: "8/0" },
    { key: "moose-hair", specEn: "dark, two or three fibres", specFr: "foncé, deux ou trois barbes" },
    { key: "dubbing-grey", specEn: "slate grey", specFr: "gris ardoise" },
    { key: "floss", specEn: "white, single pale rib", specFr: "blanc, une seule côte pâle" },
    { key: "poly-yarn", specEn: "dark dun post", specFr: "poste dun foncé" },
    { key: "hackle-dun", specEn: "dark dun", specFr: "dun foncé" },
  ],
  "trico-spinner": [
    { key: "hook-dry", specEn: "fine wire, #20-24", specFr: "fil fin, #20-24", perFlyQty: 1 },
    { key: "thread-black", specEn: "14/0 — bulk is the enemy here", specFr: "14/0 — le volume est l'ennemi ici" },
    { key: "microfibbets", specEn: "white, long and widely split", specFr: "blancs, longs et bien séparés" },
    { key: "poly-yarn", specEn: "white, tied spent", specFr: "blanc, monté en spent" },
  ],
  "griffiths-gnat": [
    { key: "hook-dry", specEn: "standard, #18-22", specFr: "standard, #18-22", perFlyQty: 1 },
    { key: "thread-black", specEn: "14/0", specFr: "14/0" },
    { key: "peacock-herl", specEn: "one strand, twisted with the thread", specFr: "un brin, torsadé avec le fil" },
    { key: "hackle-grizzly", specEn: "undersized, palmered the full body", specFr: "sous-dimensionné, palmé sur tout le corps" },
  ],
  stimulator: [
    { key: "hook-dry", specEn: "2XL-3XL, #8-14", specFr: "2XL-3XL, #8-14", perFlyQty: 1 },
    { key: "thread-orange", specEn: "6/0", specFr: "6/0" },
    { key: "elk-hair", specEn: "short clump, tail", specFr: "petite touffe, queue" },
    { key: "dubbing-yellow", specEn: "abdomen", specFr: "abdomen" },
    { key: "hackle-brown", specEn: "palmered over the abdomen", specFr: "palmé sur l'abdomen" },
    { key: "dubbing-olive", specEn: "thorax, orange or olive", specFr: "thorax, orangé ou olive" },
    { key: "hackle-grizzly", specEn: "thorax hackle", specFr: "hackle de thorax" },
  ],
  "black-caddis": [
    { key: "hook-dry", specEn: "standard, #14-18", specFr: "standard, #14-18", perFlyQty: 1 },
    { key: "thread-black", specEn: "8/0", specFr: "8/0" },
    { key: "dubbing-black", specEn: "fine, slim body", specFr: "fin, corps mince" },
    { key: "deer-hair", specEn: "dark, tented wing", specFr: "foncé, aile en toit" },
    { key: "hackle-black", specEn: "sparse, trimmed flat underneath", specFr: "clairsemé, taillé à plat dessous" },
  ],
  "elk-wing-caddis": [
    { key: "hook-dry", specEn: "standard, #12-16", specFr: "standard, #12-16", perFlyQty: 1 },
    { key: "thread-tan", specEn: "8/0", specFr: "8/0" },
    { key: "dubbing-hares", specEn: "tan", specFr: "beige" },
    { key: "hackle-brown", specEn: "palmered, then trimmed level underneath", specFr: "palmé, puis taillé au ras dessous" },
    { key: "elk-hair", specEn: "natural, flared over the body", specFr: "naturel, évasé sur le corps" },
  ],
  hendrickson: [
    { key: "hook-dry", specEn: "standard, #12-14", specFr: "standard, #12-14", perFlyQty: 1 },
    { key: "thread-brown", specEn: "8/0", specFr: "8/0" },
    { key: "hackle-fibres", specEn: "medium dun", specFr: "dun moyen" },
    { key: "dubbing-grey", specEn: "pinkish grey — the classic urine-stained fox shade", specFr: "gris rosé — la teinte classique" },
    { key: "wood-duck", specEn: "upright and divided", specFr: "droites et séparées" },
    { key: "hackle-dun", specEn: "medium dun", specFr: "dun moyen" },
  ],
  "foam-ant": [
    { key: "hook-dry", specEn: "standard, #12-16", specFr: "standard, #12-16", perFlyQty: 1 },
    { key: "thread-black", specEn: "8/0", specFr: "8/0" },
    { key: "foam-2mm", specEn: "black, two segments", specFr: "noire, deux segments" },
    { key: "hackle-black", specEn: "sparse, at the waist", specFr: "clairsemé, à la taille" },
    { key: "poly-yarn", specEn: "orange sighter", specFr: "repère orangé" },
  ],
  "foam-beetle": [
    { key: "hook-dry", specEn: "standard, #10-14", specFr: "standard, #10-14", perFlyQty: 1 },
    { key: "thread-black", specEn: "8/0", specFr: "8/0" },
    { key: "peacock-herl", specEn: "underbody", specFr: "sous-corps" },
    { key: "foam-2mm", specEn: "black shellback", specFr: "carapace noire" },
    { key: "rubber-legs", specEn: "black, three per side", specFr: "noires, trois par côté" },
    { key: "poly-yarn", specEn: "orange sighter", specFr: "repère orangé" },
  ],
  "foam-hopper": [
    { key: "hook-dry", specEn: "2XL, #8-12", specFr: "2XL, #8-12", perFlyQty: 1 },
    { key: "thread-tan", specEn: "6/0", specFr: "6/0" },
    { key: "foam-2mm", specEn: "tan, layered body", specFr: "beige, corps en couches" },
    { key: "elk-hair", specEn: "underwing", specFr: "sous-aile" },
    { key: "rubber-legs", specEn: "barred, knotted", specFr: "barrées, nouées" },
    { key: "poly-yarn", specEn: "sighter", specFr: "repère" },
  ],
  popper: [
    { key: "hook-popper", specEn: "kink-shank, #4-8", specFr: "hampe coudée, #4-8", perFlyQty: 1 },
    { key: "popper-head", specEn: "foam or cork, painted", specFr: "mousse ou liège, peinte", perFlyQty: 1 },
    { key: "thread-white", specEn: "3/0, strong", specFr: "3/0, solide" },
    { key: "marabou", specEn: "tail", specFr: "queue" },
    { key: "flashabou", specEn: "a few strands in the tail", specFr: "quelques brins dans la queue" },
    { key: "rubber-legs", specEn: "splayed at the collar", specFr: "étalées au collet" },
    { key: "stick-on-eyes", specEn: "sealed with resin", specFr: "scellés à la résine", perFlyQty: 2 },
  ],

  // ---------------------------------------------------------------- NYMPHS
  "pheasant-tail-nymph": [
    { key: "hook-nymph", specEn: "1XL, #14-18", specFr: "1XL, #14-18", perFlyQty: 1 },
    { key: "bead-tungsten", specEn: "optional, 2-2.5mm", specFr: "optionnelle, 2-2,5 mm", perFlyQty: 1 },
    { key: "thread-brown", specEn: "8/0", specFr: "8/0" },
    { key: "pheasant-tail", specEn: "tail, body and wingcase all from the same bunch", specFr: "queue, corps et fourreau, tous de la même touffe" },
    { key: "wire-copper", specEn: "fine, counter-wrapped", specFr: "fin, enroulé à contresens" },
    { key: "peacock-herl", specEn: "thorax", specFr: "thorax" },
  ],
  "bead-head-hares-ear": [
    { key: "hook-nymph", specEn: "1XL, #12-16", specFr: "1XL, #12-16", perFlyQty: 1 },
    { key: "bead-brass", specEn: "gold, 2.5-3mm", specFr: "dorée, 2,5-3 mm", perFlyQty: 1 },
    { key: "thread-brown", specEn: "8/0", specFr: "8/0" },
    { key: "pheasant-tail", specEn: "short tail", specFr: "queue courte" },
    { key: "dubbing-hares", specEn: "body and picked-out thorax", specFr: "corps et thorax ébouriffé" },
    { key: "wire-gold", specEn: "fine", specFr: "fin" },
  ],
  "caddis-pupa": [
    { key: "hook-scud", specEn: "#12-16", specFr: "#12-16", perFlyQty: 1 },
    { key: "bead-tungsten", specEn: "2.5-3mm", specFr: "2,5-3 mm", perFlyQty: 1 },
    { key: "thread-olive", specEn: "8/0", specFr: "8/0" },
    { key: "dubbing-olive", specEn: "bright olive abdomen", specFr: "abdomen olive vif" },
    { key: "wire-gold", specEn: "fine rib", specFr: "côte fine" },
    { key: "peacock-herl", specEn: "thorax", specFr: "thorax" },
    { key: "partridge", specEn: "a single turn, sparse legs", specFr: "un seul tour, pattes clairsemées" },
  ],
  "montana-stone": [
    { key: "hook-nymph", specEn: "3XL, #6-10", specFr: "3XL, #6-10", perFlyQty: 1 },
    { key: "lead-wire", specEn: "10-12 turns under the thorax", specFr: "10-12 tours sous le thorax" },
    { key: "thread-black", specEn: "6/0", specFr: "6/0" },
    { key: "hackle-fibres", specEn: "black, short forked tail", specFr: "noires, queue courte fourchue" },
    { key: "chenille", specEn: "black abdomen, yellow thorax", specFr: "abdomen noir, thorax jaune" },
    { key: "hackle-black", specEn: "palmered through the thorax", specFr: "palmé dans le thorax" },
  ],
  "zebra-midge": [
    { key: "hook-scud", specEn: "#16-20", specFr: "#16-20", perFlyQty: 1 },
    { key: "bead-tungsten", specEn: "silver, 1.5-2mm", specFr: "argentée, 1,5-2 mm", perFlyQty: 1 },
    { key: "thread-black", specEn: "70 denier, the whole body", specFr: "70 denier, tout le corps" },
    { key: "wire-silver", specEn: "extra-fine rib", specFr: "côte extra-fine" },
  ],
  "green-rock-worm": [
    { key: "hook-scud", specEn: "#12-16", specFr: "#12-16", perFlyQty: 1 },
    { key: "bead-tungsten", specEn: "optional, 2-2.5mm black", specFr: "optionnelle, 2-2,5 mm noire", perFlyQty: 1 },
    { key: "thread-olive", specEn: "8/0", specFr: "8/0" },
    { key: "antron-green", specEn: "bright caddis green", specFr: "vert caddis vif" },
    { key: "wire-gold", specEn: "fine, segmenting", specFr: "fin, pour segmenter" },
    { key: "dubbing-hares", specEn: "dark thorax", specFr: "thorax foncé" },
  ],

  // ------------------------------------------------------------- WET FLIES
  "partridge-orange": [
    { key: "hook-wet", specEn: "#12-16", specFr: "#12-16", perFlyQty: 1 },
    { key: "silk-orange", specEn: "body and head — waxed", specFr: "corps et tête — cirée" },
    { key: "dubbing-hares", specEn: "one pinch at the thorax", specFr: "une pincée au thorax" },
    { key: "partridge", specEn: "grey or brown, one and a half turns", specFr: "grise ou brune, un tour et demi" },
  ],
  "woolly-bugger-black": [
    { key: "hook-streamer", specEn: "3XL, #6-10", specFr: "3XL, #6-10", perFlyQty: 1 },
    { key: "bead-brass", specEn: "or lead wire, for depth", specFr: "ou fil de lestage, pour la profondeur", perFlyQty: 1 },
    { key: "thread-black", specEn: "6/0", specFr: "6/0" },
    { key: "marabou", specEn: "black, tail as long as the shank", specFr: "noir, queue aussi longue que la hampe" },
    { key: "flashabou", specEn: "a few strands through the tail", specFr: "quelques brins dans la queue" },
    { key: "chenille", specEn: "black", specFr: "noire" },
    { key: "hackle-black", specEn: "palmered the full body", specFr: "palmé sur tout le corps" },
  ],
  "egg-sucking-leech": [
    { key: "hook-streamer", specEn: "3XL, #4-8", specFr: "3XL, #4-8", perFlyQty: 1 },
    { key: "bead-brass", specEn: "optional", specFr: "optionnelle", perFlyQty: 1 },
    { key: "thread-black", specEn: "6/0", specFr: "6/0" },
    { key: "marabou", specEn: "black tail", specFr: "queue noire" },
    { key: "chenille", specEn: "black body", specFr: "corps noir" },
    { key: "hackle-black", specEn: "palmered", specFr: "palmé" },
    { key: "egg-yarn", specEn: "hot pink or orange head", specFr: "tête rose vif ou orangée" },
  ],
  backstabber: [
    { key: "hook-nymph", specEn: "heavy wire, #6-10", specFr: "fil fort, #6-10", perFlyQty: 1 },
    { key: "dumbbell-eyes", specEn: "tied so it rides hook-point-up", specFr: "montés pour que la mouche nage pointe en haut", perFlyQty: 1 },
    { key: "thread-brown", specEn: "6/0", specFr: "6/0" },
    { key: "marabou", specEn: "rust or black, long tail", specFr: "rouille ou noir, longue queue" },
    { key: "krystal-flash", specEn: "sparse", specFr: "clairsemé" },
    { key: "chenille", specEn: "body", specFr: "corps" },
    { key: "hackle-brown", specEn: "palmered", specFr: "palmé" },
  ],
  "carp-crayfish": [
    { key: "hook-nymph", specEn: "heavy wire, #6-10", specFr: "fil fort, #6-10", perFlyQty: 1 },
    { key: "dumbbell-eyes", specEn: "hook-point-up", specFr: "pointe en haut", perFlyQty: 1 },
    { key: "thread-brown", specEn: "6/0", specFr: "6/0" },
    { key: "bunny-strip", specEn: "claws, split", specFr: "pinces, séparées" },
    { key: "dubbing-hares", specEn: "rusty brown carapace", specFr: "carapace brun rouille" },
    { key: "wire-copper", specEn: "segmenting the tail", specFr: "segmente la queue" },
    { key: "rubber-legs", specEn: "barred", specFr: "barrées" },
  ],

  // ------------------------------------------------------------- STREAMERS
  "clouser-minnow": [
    { key: "hook-streamer", specEn: "#4-10", specFr: "#4-10", perFlyQty: 1 },
    { key: "dumbbell-eyes", specEn: "sized to the water you're fishing", specFr: "dimensionnés selon l'eau pêchée", perFlyQty: 1 },
    { key: "thread-white", specEn: "3/0", specFr: "3/0" },
    { key: "bucktail", specEn: "white belly, chartreuse or olive back", specFr: "ventre blanc, dos chartreuse ou olive" },
    { key: "krystal-flash", specEn: "between the two wings", specFr: "entre les deux ailes" },
  ],
  "lefty-deceiver": [
    { key: "hook-streamer", specEn: "#1/0-2", specFr: "#1/0-2", perFlyQty: 1 },
    { key: "thread-white", specEn: "3/0", specFr: "3/0" },
    { key: "hen-hackle-tips", specEn: "4-6 saddles, paired, tail", specFr: "4-6 saddles, appairées, queue" },
    { key: "tinsel-flat", specEn: "silver body", specFr: "corps argenté" },
    { key: "bucktail", specEn: "collar, all round the shank", specFr: "collet, tout autour de la hampe" },
    { key: "flashabou", specEn: "sparse", specFr: "clairsemé" },
  ],
  "pike-deceiver": [
    { key: "hook-streamer", specEn: "#2/0-4/0, heavy wire", specFr: "#2/0-4/0, fil fort", perFlyQty: 1 },
    { key: "thread-white", specEn: "3/0 or GSP", specFr: "3/0 ou GSP" },
    { key: "hen-hackle-tips", specEn: "long saddles, paired", specFr: "longues saddles, appairées" },
    { key: "bucktail", specEn: "built up in layers", specFr: "monté en couches" },
    { key: "flashabou", specEn: "generous — this is a visibility fly", specFr: "généreux — c'est une mouche de visibilité" },
    { key: "stick-on-eyes", specEn: "large", specFr: "gros", perFlyQty: 2 },
    { key: "uv-resin", specEn: "over the head and eyes", specFr: "sur la tête et les yeux" },
  ],
  "bunny-leech": [
    { key: "hook-streamer", specEn: "4XL, #2-4", specFr: "4XL, #2-4", perFlyQty: 1 },
    { key: "dumbbell-eyes", specEn: "for a jigging action", specFr: "pour une nage en dents de scie", perFlyQty: 1 },
    { key: "thread-black", specEn: "3/0", specFr: "3/0" },
    { key: "bunny-strip", specEn: "tail plus a palmered collar", specFr: "queue plus un collet palmé" },
    { key: "krystal-flash", specEn: "a few strands", specFr: "quelques brins" },
  ],
  "game-changer": [
    { key: "hook-streamer", specEn: "trailing hook, #1-4", specFr: "hameçon arrière, #1-4", perFlyQty: 1 },
    { key: "fish-spine", specEn: "4-7 shanks, graduated", specFr: "4-7 tiges, en dégradé" },
    { key: "thread-white", specEn: "GSP — this fly takes tension", specFr: "GSP — cette mouche demande de la tension" },
    { key: "gc-chenille", specEn: "brushed out between each shank", specFr: "brossée entre chaque tige" },
    { key: "flashabou", specEn: "through the body", specFr: "dans tout le corps" },
    { key: "stick-on-eyes", specEn: "set in resin", specFr: "fixés à la résine", perFlyQty: 2 },
    { key: "uv-resin", specEn: "head only", specFr: "tête seulement" },
  ],
};
