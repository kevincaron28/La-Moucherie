// La Moucherie's own hatch chart for southern Québec rivers — the Laurentides,
// l'Estrie and the Montérégie freestone/limestone water we actually fish.
//
// Timing is emergence, not spinner fall, and is keyed to water temperature
// rather than the calendar: a cold spring pushes everything back a week or two
// and a warm one pulls it forward. Treat every window as +/- 10 days, and trust
// a thermometer over this table.
//
// Scientific names follow current North American usage — note that the old
// Stenonema genus has been split, so patterns still sold as "March Brown" and
// "Light Cahill" are now Maccaffertium and Stenacron.

export type HatchGroup = "MAYFLY" | "CADDIS" | "STONEFLY" | "MIDGE" | "TERRESTRIAL";

export type TimeOfDay = "MORNING" | "AFTERNOON" | "EVENING" | "NIGHT" | "ALL_DAY";

/** [month 1-12, day of month] */
export type DayRef = readonly [number, number];

export type HatchWindow = { from: DayRef; to: DayRef };

export type Hatch = {
  id: string;
  group: HatchGroup;
  /** Latin binomial, or genus + spp. where several species hatch together. */
  scientific: string;
  nameFr: string;
  nameEn: string;
  /** The whole span you might see it. */
  active: HatchWindow;
  /** The part of that span worth planning a trip around. Some bugs are double-brooded. */
  peaks: HatchWindow[];
  /** Hook sizes that cover the natural, smallest to largest number. */
  sizes: number[];
  timeOfDay: TimeOfDay;
  noteFr: string;
  noteEn: string;
  /** Catalog patterns that cover this hatch. */
  patternSlugs: string[];
};

export const HATCH_GROUPS: HatchGroup[] = [
  "MAYFLY",
  "CADDIS",
  "STONEFLY",
  "MIDGE",
  "TERRESTRIAL",
];

// Cumulative days before each month in a non-leap reference year. Leap day is
// ignored on purpose: a one-day shift is meaningless next to the two-week swing
// a cold spring produces, and ignoring it keeps every bar stable year to year.
const DAYS_BEFORE_MONTH = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

export function dayOfYear([month, day]: DayRef): number {
  return DAYS_BEFORE_MONTH[month - 1] + day;
}

/** 0 at January 1, 1 at December 31 — used to position a bar on the 12-month track. */
export function yearFraction(ref: DayRef): number {
  return (dayOfYear(ref) - 1) / 364;
}

export function windowContains(window: HatchWindow, ref: DayRef): boolean {
  const d = dayOfYear(ref);
  return d >= dayOfYear(window.from) && d <= dayOfYear(window.to);
}

export function dayRefFromDate(date: Date): DayRef {
  return [date.getMonth() + 1, date.getDate()];
}

export function isActiveOn(hatch: Hatch, ref: DayRef): boolean {
  return windowContains(hatch.active, ref);
}

export function isPeakingOn(hatch: Hatch, ref: DayRef): boolean {
  return hatch.peaks.some((p) => windowContains(p, ref));
}

/** "#14-16", or "#14" when a single size covers it. */
export function sizeLabel(sizes: number[]): string {
  const min = Math.min(...sizes);
  const max = Math.max(...sizes);
  return min === max ? `#${min}` : `#${min}-${max}`;
}

export const HATCHES: Hatch[] = [
  // ---------------------------------------------------------------- MAYFLIES
  {
    id: "quill-gordon",
    group: "MAYFLY",
    scientific: "Epeorus pluralis",
    nameFr: "Quill Gordon",
    nameEn: "Quill Gordon",
    active: { from: [4, 10], to: [5, 20] },
    peaks: [{ from: [4, 20], to: [5, 10] }],
    sizes: [12, 14],
    timeOfDay: "AFTERNOON",
    noteFr:
      "La première vraie éphémère de l'année, dès que l'eau touche 10 °C. Elle éclot au fond : la truite prend la nymphe qui monte bien plus souvent que la subimago en surface.",
    noteEn:
      "The first real mayfly of the year, as soon as water touches 10°C. It emerges on the bottom, so trout take the rising nymph far more often than the dun on top.",
    patternSlugs: ["pheasant-tail-nymph", "bead-head-hares-ear", "parachute-adams"],
  },
  {
    id: "blue-quill",
    group: "MAYFLY",
    scientific: "Paraleptophlebia adoptiva",
    nameFr: "Blue Quill",
    nameEn: "Blue Quill",
    active: { from: [4, 20], to: [5, 31] },
    peaks: [{ from: [4, 28], to: [5, 18] }],
    sizes: [16, 18],
    timeOfDay: "AFTERNOON",
    noteFr:
      "Petite éphémère brun-gris des eaux plus lentes, qui chevauche le Quill Gordon. Une journée grise et humide la fait sortir en nombre.",
    noteEn:
      "A small grey-brown mayfly of the slower water, overlapping the Quill Gordon. A grey, damp afternoon brings it off in numbers.",
    patternSlugs: ["parachute-adams", "pheasant-tail-nymph"],
  },
  {
    id: "hendrickson",
    group: "MAYFLY",
    scientific: "Ephemerella subvaria",
    nameFr: "Hendrickson",
    nameEn: "Hendrickson",
    active: { from: [4, 25], to: [6, 5] },
    peaks: [{ from: [5, 5], to: [5, 25] }],
    sizes: [12, 14],
    timeOfDay: "AFTERNOON",
    noteFr:
      "L'éclosion qui ouvre la saison pour vrai. Presque à l'heure : entre 13 h et 16 h, souvent sur une courte fenêtre d'une heure. Le mâle (Red Quill) est plus foncé que la femelle.",
    noteEn:
      "The hatch that really opens the season. Close to clockwork between 1 and 4 p.m., often in a single hour-long window. The male (Red Quill) runs darker than the female.",
    patternSlugs: ["hendrickson", "parachute-adams", "pheasant-tail-nymph"],
  },
  {
    id: "black-quill",
    group: "MAYFLY",
    scientific: "Leptophlebia cupida",
    nameFr: "Black Quill",
    nameEn: "Black Quill",
    active: { from: [4, 25], to: [6, 5] },
    peaks: [{ from: [5, 1], to: [5, 20] }],
    sizes: [12, 14],
    timeOfDay: "AFTERNOON",
    noteFr:
      "Une éphémère sombre des bordures et des eaux mortes, souvent ignorée parce qu'elle sort en même temps que le Hendrickson. Regardez les nymphes ramper vers la rive avant l'éclosion.",
    noteEn:
      "A dark mayfly of margins and backwaters, usually ignored because it comes off alongside the Hendrickson. Watch for nymphs crawling shoreward before the hatch.",
    patternSlugs: ["parachute-adams", "bead-head-hares-ear"],
  },
  {
    id: "blue-winged-olive",
    group: "MAYFLY",
    scientific: "Baetis spp.",
    nameFr: "Blue-Winged Olive",
    nameEn: "Blue-Winged Olive",
    active: { from: [4, 5], to: [11, 5] },
    peaks: [
      { from: [4, 15], to: [5, 20] },
      { from: [9, 5], to: [10, 25] },
    ],
    sizes: [16, 18, 20],
    timeOfDay: "ALL_DAY",
    noteFr:
      "Plusieurs générations par saison : c'est l'éphémère la plus fiable de l'année. Les pires journées — froides, grises, pluvieuses — sont les meilleures. En automne, descendez à un 20.",
    noteEn:
      "Several broods a season, which makes it the most reliable mayfly of the year. The worst days — cold, grey, drizzling — are the best ones. Come autumn, drop to a 20.",
    patternSlugs: ["blue-winged-olive", "pheasant-tail-nymph", "parachute-adams"],
  },
  {
    id: "march-brown",
    group: "MAYFLY",
    scientific: "Maccaffertium vicarium",
    nameFr: "March Brown",
    nameEn: "March Brown",
    active: { from: [5, 10], to: [6, 20] },
    peaks: [{ from: [5, 20], to: [6, 10] }],
    sizes: [10, 12],
    timeOfDay: "AFTERNOON",
    noteFr:
      "Grosse éphémère tachetée qui sort au compte-gouttes tout l'après-midi plutôt qu'en vague. Peu d'insectes à la fois, mais assez gros pour faire monter les grosses truites.",
    noteEn:
      "A big mottled mayfly that trickles off all afternoon instead of coming in a wave. Few bugs at a time, but big enough to move the better fish.",
    patternSlugs: ["march-brown", "bead-head-hares-ear"],
  },
  {
    id: "grey-fox",
    group: "MAYFLY",
    scientific: "Maccaffertium fuscum",
    nameFr: "Grey Fox",
    nameEn: "Grey Fox",
    active: { from: [5, 18], to: [6, 25] },
    peaks: [{ from: [5, 25], to: [6, 15] }],
    sizes: [12, 14],
    timeOfDay: "EVENING",
    noteFr:
      "Proche parente du March Brown, un peu plus pâle et plus petite, qui prend le relais en fin de journée. Les deux se chevauchent : fiez-vous à la taille avant la couleur.",
    noteEn:
      "A close cousin of the March Brown, slightly paler and smaller, taking over late in the day. The two overlap — match size before colour.",
    patternSlugs: ["march-brown", "light-cahill"],
  },
  {
    id: "sulphur",
    group: "MAYFLY",
    scientific: "Ephemerella invaria",
    nameFr: "Sulphur",
    nameEn: "Sulphur",
    active: { from: [5, 15], to: [6, 30] },
    peaks: [{ from: [5, 25], to: [6, 20] }],
    sizes: [14, 16],
    timeOfDay: "EVENING",
    noteFr:
      "La grande éclosion de soirée de juin. Ça commence vers 19 h et ça monte jusqu'à la noirceur ; les truites se placent souvent sur les émergentes plutôt que sur les duns.",
    noteEn:
      "June's big evening hatch. It starts around 7 p.m. and builds until dark; trout often lock onto emergers rather than duns.",
    patternSlugs: ["sulphur-dun", "partridge-orange", "pheasant-tail-nymph"],
  },
  {
    id: "pale-evening-dun",
    group: "MAYFLY",
    scientific: "Ephemerella dorothea",
    nameFr: "Pale Evening Dun",
    nameEn: "Pale Evening Dun",
    active: { from: [5, 25], to: [7, 10] },
    peaks: [{ from: [6, 1], to: [6, 30] }],
    sizes: [16, 18],
    timeOfDay: "EVENING",
    noteFr:
      "Le petit sulphur jaune pâle qui sort juste à la brunante, souvent dans les vingt dernières minutes de clarté. Montez votre bas de ligne avant de ne plus rien voir.",
    noteEn:
      "The small pale-yellow sulphur that comes off right at dusk, often in the last twenty minutes of light. Rig your tippet before you can no longer see it.",
    patternSlugs: ["sulphur-dun", "partridge-orange"],
  },
  {
    id: "green-drake",
    group: "MAYFLY",
    scientific: "Ephemera guttulata",
    nameFr: "Green Drake",
    nameEn: "Green Drake",
    active: { from: [5, 25], to: [6, 25] },
    peaks: [{ from: [6, 1], to: [6, 18] }],
    sizes: [8, 10],
    timeOfDay: "EVENING",
    noteFr:
      "La plus grosse éphémère de l'année et la plus courte : dix jours, parfois moins, sur une rivière donnée. La retombée des imagos (Coffin Fly) vaut souvent mieux que l'éclosion.",
    noteEn:
      "The biggest mayfly of the year and the briefest: ten days on a given river, sometimes less. The spinner fall (Coffin Fly) is often better than the hatch itself.",
    patternSlugs: ["green-drake", "stimulator"],
  },
  {
    id: "brown-drake",
    group: "MAYFLY",
    scientific: "Ephemera simulans",
    nameFr: "Brown Drake",
    nameEn: "Brown Drake",
    active: { from: [5, 28], to: [6, 25] },
    peaks: [{ from: [6, 3], to: [6, 18] }],
    sizes: [10, 12],
    timeOfDay: "EVENING",
    noteFr:
      "Cousin plus foncé du Green Drake, sur les fonds de sable et de gravier fin. Éclosion brève et explosive, juste avant la noirceur.",
    noteEn:
      "The Green Drake's darker cousin, over sand and fine gravel. A short, explosive hatch right before dark.",
    patternSlugs: ["green-drake", "march-brown"],
  },
  {
    id: "grey-drake",
    group: "MAYFLY",
    scientific: "Siphlonurus spp.",
    nameFr: "Grey Drake",
    nameEn: "Grey Drake",
    active: { from: [5, 20], to: [6, 30] },
    peaks: [{ from: [5, 28], to: [6, 20] }],
    sizes: [10, 12],
    timeOfDay: "EVENING",
    noteFr:
      "Les nymphes rampent sur la rive pour éclore, alors on voit rarement l'éclosion — c'est la retombée des imagos au-dessus de l'eau qui compte.",
    noteEn:
      "Nymphs crawl out on the bank to emerge, so you rarely see the hatch — it is the spinner fall over the water that matters.",
    patternSlugs: ["parachute-adams", "slate-drake"],
  },
  {
    id: "pink-lady",
    group: "MAYFLY",
    scientific: "Epeorus vitreus",
    nameFr: "Pink Lady",
    nameEn: "Pink Lady",
    active: { from: [5, 20], to: [7, 5] },
    peaks: [{ from: [6, 1], to: [6, 25] }],
    sizes: [14, 16],
    timeOfDay: "EVENING",
    noteFr:
      "La femelle a l'abdomen rosé, d'où le nom. Eaux vives et oxygénées, en soirée, souvent mêlée aux sulphurs.",
    noteEn:
      "The female carries a pink-washed abdomen, hence the name. Fast, well-oxygenated water in the evening, often mixed in with the sulphurs.",
    patternSlugs: ["sulphur-dun", "light-cahill"],
  },
  {
    id: "light-cahill",
    group: "MAYFLY",
    scientific: "Stenacron interpunctatum",
    nameFr: "Light Cahill",
    nameEn: "Light Cahill",
    active: { from: [6, 5], to: [7, 25] },
    peaks: [{ from: [6, 15], to: [7, 15] }],
    sizes: [12, 14],
    timeOfDay: "EVENING",
    noteFr:
      "L'éphémère crème des soirées de juillet, quand le reste de la rivière se calme. Se pêche bien jusqu'à la noirceur complète.",
    noteEn:
      "The cream mayfly of July evenings, when the rest of the river goes quiet. Fishes well right into full dark.",
    patternSlugs: ["light-cahill", "partridge-orange"],
  },
  {
    id: "drunella",
    group: "MAYFLY",
    scientific: "Drunella cornuta",
    nameFr: "Grande olive (BWO de juin)",
    nameEn: "Large Blue-Winged Olive",
    active: { from: [6, 5], to: [7, 15] },
    peaks: [{ from: [6, 12], to: [7, 5] }],
    sizes: [14, 16],
    timeOfDay: "MORNING",
    noteFr:
      "Une olive nettement plus grosse que les Baetis, qui sort le matin plutôt qu'en soirée — la bonne surprise quand l'eau baisse en juin.",
    noteEn:
      "An olive noticeably bigger than the Baetis, coming off in the morning rather than the evening — the welcome surprise as June water drops.",
    patternSlugs: ["blue-winged-olive", "pheasant-tail-nymph"],
  },
  {
    id: "hexagenia",
    group: "MAYFLY",
    scientific: "Hexagenia limbata",
    nameFr: "Hexagenia",
    nameEn: "Hexagenia",
    active: { from: [6, 20], to: [8, 5] },
    peaks: [{ from: [6, 28], to: [7, 20] }],
    sizes: [6, 8],
    timeOfDay: "NIGHT",
    noteFr:
      "L'éclosion la plus spectaculaire de l'été, sur les fonds vaseux, à la noirceur et souvent après. Peu de mouches, mais les plus grosses truites de l'année.",
    noteEn:
      "The most spectacular hatch of the summer, over silt bottoms, at dark and often well after. Few casts, but the biggest trout of the year.",
    patternSlugs: ["hexagenia-dun", "bunny-leech"],
  },
  {
    id: "golden-drake",
    group: "MAYFLY",
    scientific: "Anthopotamus distinctus",
    nameFr: "Golden Drake",
    nameEn: "Golden Drake",
    active: { from: [7, 5], to: [8, 20] },
    peaks: [{ from: [7, 15], to: [8, 10] }],
    sizes: [10, 12],
    timeOfDay: "EVENING",
    noteFr:
      "Grosse éphémère jaune doré, jamais abondante mais présente tout le mois d'août en soirée. Souvent la seule chose assez grosse pour intéresser un poisson en eau basse.",
    noteEn:
      "A big golden-yellow mayfly, never abundant but around through August evenings. Often the only thing big enough to interest a fish in low water.",
    patternSlugs: ["light-cahill", "stimulator"],
  },
  {
    id: "trico",
    group: "MAYFLY",
    scientific: "Tricorythodes spp.",
    nameFr: "Trico",
    nameEn: "Trico",
    active: { from: [7, 10], to: [9, 30] },
    peaks: [{ from: [7, 25], to: [9, 10] }],
    sizes: [20, 22, 24],
    timeOfDay: "MORNING",
    noteFr:
      "Retombée matinale, entre 7 h et 10 h, par nuées. Des milliers d'insectes minuscules : c'est la présentation et le bas de ligne qui décident, pas le patron.",
    noteEn:
      "A morning spinner fall between 7 and 10 a.m., in clouds. Thousands of tiny insects: presentation and tippet decide the day, not the pattern.",
    patternSlugs: ["trico-spinner", "griffiths-gnat"],
  },
  {
    id: "slate-drake",
    group: "MAYFLY",
    scientific: "Isonychia bicolor",
    nameFr: "Slate Drake (Isonychia)",
    nameEn: "Slate Drake (Isonychia)",
    active: { from: [6, 1], to: [10, 20] },
    peaks: [
      { from: [6, 5], to: [6, 30] },
      { from: [8, 20], to: [10, 10] },
    ],
    sizes: [10, 12],
    timeOfDay: "AFTERNOON",
    noteFr:
      "Deux générations, dont une qui porte la fin de saison. La nymphe est une nageuse rapide qui rampe sur les roches pour éclore : une noyée montée en dérive tendue travaille très bien.",
    noteEn:
      "Two broods, the second of which carries the back end of the season. The nymph is a fast swimmer that crawls out on rocks to emerge — a wet fly on a tight swing works very well.",
    patternSlugs: ["slate-drake", "partridge-orange", "woolly-bugger-black"],
  },
  {
    id: "mahogany-dun",
    group: "MAYFLY",
    scientific: "Paraleptophlebia mollis",
    nameFr: "Mahogany Dun",
    nameEn: "Mahogany Dun",
    active: { from: [6, 5], to: [9, 25] },
    peaks: [
      { from: [6, 10], to: [6, 30] },
      { from: [8, 25], to: [9, 20] },
    ],
    sizes: [16, 18],
    timeOfDay: "AFTERNOON",
    noteFr:
      "Petite éphémère acajou des eaux lentes, discrète mais régulière. La deuxième vague de fin d'été passe souvent inaperçue.",
    noteEn:
      "A small mahogany mayfly of the slow water, quiet but steady. The second, late-summer wave usually goes unnoticed.",
    patternSlugs: ["parachute-adams", "pheasant-tail-nymph"],
  },
  {
    id: "callibaetis",
    group: "MAYFLY",
    scientific: "Callibaetis spp.",
    nameFr: "Callibaetis (lacs)",
    nameEn: "Callibaetis (lakes)",
    active: { from: [5, 25], to: [9, 20] },
    peaks: [{ from: [6, 10], to: [8, 20] }],
    sizes: [14, 16],
    timeOfDay: "MORNING",
    noteFr:
      "L'éphémère des lacs et des étangs, pas des rivières. Plusieurs générations, et les insectes rapetissent au fil de l'été.",
    noteEn:
      "The mayfly of lakes and ponds, not rivers. Several broods, and the bugs get smaller as the summer goes on.",
    patternSlugs: ["parachute-adams", "bead-head-hares-ear"],
  },

  // ------------------------------------------------------------------ CADDIS
  {
    id: "grannom",
    group: "CADDIS",
    scientific: "Brachycentrus spp.",
    nameFr: "Grannom",
    nameEn: "Grannom",
    active: { from: [4, 25], to: [6, 5] },
    peaks: [{ from: [5, 5], to: [5, 25] }],
    sizes: [14, 16],
    timeOfDay: "MORNING",
    noteFr:
      "Le premier gros trichoptère de la saison, souvent en même temps que le Hendrickson. Les femelles retournent à l'eau pour pondre en après-midi : c'est là que ça mord.",
    noteEn:
      "The season's first big caddis, often right alongside the Hendrickson. Females return to the water to lay in the afternoon — that is when the eating happens.",
    patternSlugs: ["black-caddis", "caddis-pupa", "green-rock-worm"],
  },
  {
    id: "little-black-caddis",
    group: "CADDIS",
    scientific: "Chimarra atterrima",
    nameFr: "Little Black Caddis",
    nameEn: "Little Black Caddis",
    active: { from: [4, 25], to: [6, 10] },
    peaks: [{ from: [5, 5], to: [5, 30] }],
    sizes: [18, 20],
    timeOfDay: "AFTERNOON",
    noteFr:
      "Minuscule et tout noir, en essaims au-dessus des rapides. Facile à confondre avec un moucheron — regardez les ailes en toit.",
    noteEn:
      "Tiny and jet black, swarming over the riffles. Easy to mistake for a midge — look for the tented wings.",
    patternSlugs: ["black-caddis", "griffiths-gnat"],
  },
  {
    id: "spotted-sedge",
    group: "CADDIS",
    scientific: "Hydropsyche spp.",
    nameFr: "Spotted Sedge (caddis tan)",
    nameEn: "Spotted Sedge (tan caddis)",
    active: { from: [5, 15], to: [9, 20] },
    peaks: [{ from: [6, 1], to: [8, 15] }],
    sizes: [14, 16],
    timeOfDay: "EVENING",
    noteFr:
      "Le cheval de trait de l'été : présent presque tous les soirs de juin à septembre. Si vous ne devez emporter qu'une sèche, c'est un caddis tan 14.",
    noteEn:
      "The summer workhorse: on the water almost every evening from June to September. If you carry one dry fly, make it a tan caddis 14.",
    patternSlugs: ["elk-wing-caddis", "caddis-pupa"],
  },
  {
    id: "green-rock-worm",
    group: "CADDIS",
    scientific: "Rhyacophila spp.",
    nameFr: "Green Rock Worm",
    nameEn: "Green Rock Worm",
    active: { from: [4, 15], to: [10, 15] },
    peaks: [{ from: [5, 20], to: [7, 20] }],
    sizes: [12, 14, 16],
    timeOfDay: "ALL_DAY",
    noteFr:
      "La larve ne construit pas de fourreau : elle se promène sur les roches toute l'année, et se fait déloger au moindre courant. Une des meilleures nymphes hors éclosion.",
    noteEn:
      "The larva builds no case — it roams the rocks year-round and gets dislodged by any push of current. One of the best nymphs when nothing is hatching.",
    patternSlugs: ["green-rock-worm", "caddis-pupa"],
  },
  {
    id: "little-sister-sedge",
    group: "CADDIS",
    scientific: "Cheumatopsyche spp.",
    nameFr: "Little Sister Sedge",
    nameEn: "Little Sister Sedge",
    active: { from: [6, 1], to: [9, 10] },
    peaks: [{ from: [6, 20], to: [8, 20] }],
    sizes: [16, 18],
    timeOfDay: "EVENING",
    noteFr:
      "Version réduite du Spotted Sedge, souvent mêlée à lui. Quand les truites refusent votre 14, descendez à un 16 ou 18 avant de changer de patron.",
    noteEn:
      "A scaled-down Spotted Sedge, usually mixed in with it. When trout refuse your 14, drop to a 16 or 18 before you change patterns.",
    patternSlugs: ["elk-wing-caddis", "caddis-pupa"],
  },
  {
    id: "october-caddis",
    group: "CADDIS",
    scientific: "Pycnopsyche spp.",
    nameFr: "October Caddis",
    nameEn: "October Caddis",
    active: { from: [9, 1], to: [10, 31] },
    peaks: [{ from: [9, 15], to: [10, 20] }],
    sizes: [8, 10],
    timeOfDay: "AFTERNOON",
    noteFr:
      "Le gros trichoptère orangé de l'automne, le dernier gros repas avant l'hiver. Une sèche qui flotte haut, dérivée le long des berges sous-cavées.",
    noteEn:
      "Autumn's big orange caddis, the last large meal before winter. A high-floating dry drifted tight to undercut banks.",
    patternSlugs: ["stimulator", "elk-wing-caddis"],
  },

  // --------------------------------------------------------------- STONEFLIES
  {
    id: "winter-black-stone",
    group: "STONEFLY",
    scientific: "Allocapnia spp.",
    nameFr: "Plécoptère noir d'hiver",
    nameEn: "Winter Black Stone",
    active: { from: [1, 15], to: [4, 10] },
    peaks: [{ from: [2, 10], to: [3, 25] }],
    sizes: [16, 18],
    timeOfDay: "AFTERNOON",
    noteFr:
      "Oui, il y a une éclosion en février. Par une journée de redoux, cherchez les petits insectes noirs qui marchent sur la neige en bordure — la truite les connaît.",
    noteEn:
      "Yes, there is a February hatch. On a mild day, look for small black insects walking on the snow along the bank — the trout know them.",
    patternSlugs: ["zebra-midge", "black-caddis"],
  },
  {
    id: "early-brown-stone",
    group: "STONEFLY",
    scientific: "Taeniopteryx spp.",
    nameFr: "Early Brown Stone",
    nameEn: "Early Brown Stone",
    active: { from: [3, 20], to: [5, 15] },
    peaks: [{ from: [4, 5], to: [4, 30] }],
    sizes: [14, 16],
    timeOfDay: "ALL_DAY",
    noteFr:
      "Le premier insecte que la truite mange en surface au printemps, souvent avant même le Quill Gordon. Toute la journée, par temps doux.",
    noteEn:
      "The first insect trout take off the top in spring, often before the Quill Gordon. All day, on mild weather.",
    patternSlugs: ["montana-stone", "black-caddis"],
  },
  {
    id: "giant-black-stone",
    group: "STONEFLY",
    scientific: "Pteronarcys dorsata",
    nameFr: "Grand plécoptère noir",
    nameEn: "Giant Black Stone",
    active: { from: [5, 20], to: [6, 30] },
    peaks: [{ from: [6, 1], to: [6, 20] }],
    sizes: [4, 6, 8],
    timeOfDay: "NIGHT",
    noteFr:
      "Le plus gros insecte de nos rivières. Les nymphes rampent sur la rive la nuit pour éclore — la nymphe se pêche toute l'année, l'adulte seulement quelques soirs.",
    noteEn:
      "The largest insect in our rivers. Nymphs crawl out on the bank at night to emerge — the nymph fishes all year, the adult only a few evenings.",
    patternSlugs: ["montana-stone", "stimulator"],
  },
  {
    id: "golden-stone",
    group: "STONEFLY",
    scientific: "Acroneuria spp.",
    nameFr: "Golden Stone",
    nameEn: "Golden Stone",
    active: { from: [6, 1], to: [7, 31] },
    peaks: [{ from: [6, 15], to: [7, 15] }],
    sizes: [6, 8, 10],
    timeOfDay: "NIGHT",
    noteFr:
      "L'adulte éclot la nuit, mais la nymphe vit deux ou trois ans dans le gravier : c'est une des rares mouches qui travaille douze mois par année.",
    noteEn:
      "The adult emerges at night, but the nymph lives two or three years in the gravel — one of the few flies that works twelve months a year.",
    patternSlugs: ["montana-stone", "stimulator"],
  },
  {
    id: "yellow-sally",
    group: "STONEFLY",
    scientific: "Isoperla spp.",
    nameFr: "Yellow Sally",
    nameEn: "Yellow Sally",
    active: { from: [6, 1], to: [7, 25] },
    peaks: [{ from: [6, 10], to: [7, 10] }],
    sizes: [14, 16],
    timeOfDay: "EVENING",
    noteFr:
      "Petit plécoptère jaune vif qui court sur l'eau plutôt que de s'y poser. Une sèche animée d'une petite saccade prend plus que la dérive morte.",
    noteEn:
      "A small bright-yellow stonefly that skitters rather than settles. A dry twitched once takes more fish than a dead drift.",
    patternSlugs: ["stimulator", "elk-wing-caddis"],
  },

  // -------------------------------------------------------------------- MIDGE
  {
    id: "chironomids",
    group: "MIDGE",
    scientific: "Chironomidae",
    nameFr: "Chironomes",
    nameEn: "Midges",
    active: { from: [1, 1], to: [12, 31] },
    peaks: [
      { from: [3, 15], to: [5, 15] },
      { from: [10, 1], to: [11, 20] },
    ],
    sizes: [18, 20, 22, 24],
    timeOfDay: "ALL_DAY",
    noteFr:
      "Le seul insecte disponible à l'année. En mars et en novembre, quand il n'y a rien d'autre, c'est ça ou rien — et la truite s'en nourrit sérieusement.",
    noteEn:
      "The only insect available year-round. In March and November, when there is nothing else, it is this or nothing — and trout feed on it seriously.",
    patternSlugs: ["zebra-midge", "griffiths-gnat"],
  },
  {
    id: "crane-fly",
    group: "MIDGE",
    scientific: "Tipulidae",
    nameFr: "Tipules",
    nameEn: "Crane flies",
    active: { from: [6, 1], to: [9, 30] },
    peaks: [{ from: [6, 15], to: [7, 20] }],
    sizes: [12, 14, 16],
    timeOfDay: "EVENING",
    noteFr:
      "Les grandes pattes qui rebondissent sur l'eau en soirée d'été. Les larves, elles, roulent au fond toute l'année et valent une nymphe lestée.",
    noteEn:
      "The long-legged ones bouncing on the water on summer evenings. The larvae tumble along the bottom year-round and are worth a weighted nymph.",
    patternSlugs: ["bead-head-hares-ear", "stimulator"],
  },

  // -------------------------------------------------------------- TERRESTRIALS
  {
    id: "ants",
    group: "TERRESTRIAL",
    scientific: "Formicidae",
    nameFr: "Fourmis",
    nameEn: "Ants",
    active: { from: [6, 1], to: [10, 5] },
    peaks: [{ from: [7, 15], to: [9, 15] }],
    sizes: [14, 16, 18, 20],
    timeOfDay: "ALL_DAY",
    noteFr:
      "La mouche de secours la plus sous-estimée de l'été. Après une pluie ou un coup de vent, et lors des vols nuptiaux d'août, la truite prend la fourmi avant tout le reste.",
    noteEn:
      "Summer's most underrated fallback. After rain or a blow, and during August's flying-ant days, trout take an ant ahead of anything else.",
    patternSlugs: ["foam-ant", "parachute-adams"],
  },
  {
    id: "beetles",
    group: "TERRESTRIAL",
    scientific: "Coleoptera",
    nameFr: "Coléoptères",
    nameEn: "Beetles",
    active: { from: [6, 1], to: [9, 30] },
    peaks: [{ from: [7, 1], to: [9, 5] }],
    sizes: [12, 14, 16, 18],
    timeOfDay: "ALL_DAY",
    noteFr:
      "Tout l'été le long des berges boisées. Ça coule bas et ça se voit mal : pêchez-le serré contre la végétation et fiez-vous au mouvement du poisson.",
    noteEn:
      "All summer along wooded banks. It sits low and is hard to see — fish it tight to the brush and watch the fish instead of the fly.",
    patternSlugs: ["foam-beetle", "foam-ant"],
  },
  {
    id: "hoppers",
    group: "TERRESTRIAL",
    scientific: "Acrididae",
    nameFr: "Sauterelles",
    nameEn: "Grasshoppers",
    active: { from: [7, 15], to: [10, 5] },
    peaks: [{ from: [8, 5], to: [9, 20] }],
    sizes: [8, 10, 12, 14],
    timeOfDay: "AFTERNOON",
    noteFr:
      "Août, dans les champs qui bordent la rivière, par grand vent et grosse chaleur. Un plouf franc contre la rive fait souvent mieux qu'une pose délicate.",
    noteEn:
      "August, along meadow banks, on hot windy afternoons. A hard splat against the bank usually beats a delicate presentation.",
    patternSlugs: ["foam-hopper", "stimulator"],
  },
  {
    id: "crickets",
    group: "TERRESTRIAL",
    scientific: "Gryllidae",
    nameFr: "Grillons",
    nameEn: "Crickets",
    active: { from: [8, 1], to: [10, 10] },
    peaks: [{ from: [8, 20], to: [9, 30] }],
    sizes: [10, 12, 14],
    timeOfDay: "AFTERNOON",
    noteFr:
      "Prend le relais de la sauterelle en fin de saison, surtout sur les petits cours d'eau boisés. Silhouette noire et basse sur l'eau.",
    noteEn:
      "Takes over from the hopper late in the season, especially on small wooded streams. A black silhouette sitting low in the film.",
    patternSlugs: ["foam-beetle", "foam-hopper"],
  },
];
