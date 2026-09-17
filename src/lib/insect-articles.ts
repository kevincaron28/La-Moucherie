// Long-form entomology for the insects worth a page of their own.
//
// These exist for search as much as for reading: "éclosion Hexagenia Québec"
// and its cousins have almost no good French-language answer, and a page
// published months before launch has time to be indexed and ranked. Each
// article hangs off a Hatch in `hatches.ts` by id, so the chart stays the single
// source of timing, sizes and pattern matching, and this file only carries prose.
//
// Bilingual strings are `{ fr, en }` pairs rather than the `nameFr`/`nameEn`
// convention used elsewhere: at this volume of prose, keeping both languages of
// one paragraph adjacent is what stops them drifting apart.

import type { Locale } from "@/i18n/routing";

export type Bilingual = { fr: string; en: string };

export function say(text: Bilingual, locale: Locale): string {
  return locale === "fr" ? text.fr : text.en;
}

export type ArticleSection = { heading: Bilingual; body: Bilingual };

export type LifeStage = {
  label: Bilingual;
  /** When this stage is the one the fish are eating. */
  when: Bilingual;
  how: Bilingual;
  patternSlugs: string[];
};

export type InsectArticle = {
  /** Must match a Hatch id in `hatches.ts`. */
  hatchId: string;
  metaTitle: Bilingual;
  metaDescription: Bilingual;
  intro: Bilingual;
  /** Field marks, in the order you'd actually check them on the water. */
  idMarks: Bilingual[];
  confusedWith: Bilingual;
  sections: ArticleSection[];
  stages: LifeStage[];
};

export const INSECT_ARTICLES: InsectArticle[] = [
  // ------------------------------------------------------------------ HEX
  {
    hatchId: "hexagenia",
    metaTitle: {
      fr: "Hexagenia limbata — la plus grosse éphémère du Québec",
      en: "Hexagenia limbata — Québec's biggest mayfly",
    },
    metaDescription: {
      fr: "Identification, cycle de vie et pêche de l'Hexagenia limbata dans le sud du Québec : où la trouver, pourquoi elle éclot à la noirceur, et quoi monter au bout.",
      en: "Identifying, understanding and fishing Hexagenia limbata in southern Québec: where it lives, why it emerges after dark, and what to tie on.",
    },
    intro: {
      fr: "C'est la plus grosse éphémère de nos eaux, et la seule dont l'éclosion se pêche à la lampe frontale. L'Hexagenia limbata sort à la noirceur, sur des fonds de vase que la plupart des pêcheurs à la mouche évitent, et elle fait monter des truites qu'on ne verrait jamais autrement. Une dizaine de soirées par année, pas plus.",
      en: "This is the largest mayfly in our water, and the only hatch you fish with a headlamp. Hexagenia limbata comes off after dark, over the silt bottoms most fly anglers walk past, and it brings up trout you would otherwise never see. Ten evenings a year, no more.",
    },
    idMarks: [
      {
        fr: "Énorme : 25 à 35 mm de corps, ce qui correspond à un hameçon 6 ou 8 en 3XL.",
        en: "Enormous: a 25–35 mm body, which is a 3XL hook in size 6 or 8.",
      },
      {
        fr: "Corps jaune pâle à olive, marqué de brun sur le dessus de l'abdomen.",
        en: "Pale yellow to olive body, marked brown across the top of the abdomen.",
      },
      {
        fr: "Ailes fortement marbrées, tenues droites — on dirait de petites voiles.",
        en: "Heavily mottled wings held upright — they look like small sails.",
      },
      {
        fr: "Trois queues (cerques), plus courtes que le corps chez la subimago.",
        en: "Three tails, shorter than the body on the dun.",
      },
      {
        fr: "La nymphe porte des défenses (tusks) sur la tête et de longues branchies plumeuses le long de l'abdomen.",
        en: "The nymph carries tusks on its head and long feathery gills down the abdomen.",
      },
    ],
    confusedWith: {
      fr: "Litobrancha recurvata (l'ancienne « Hexagenia recurvata ») fait presque la même taille mais sort en juin, plus tôt, et elle est nettement plus foncée. L'Ephemera guttulata (Green Drake) est plus petite, plus crème, et elle vous aura déjà quitté à la mi-juin.",
      en: "Litobrancha recurvata (the old \"Hexagenia recurvata\") runs almost the same size but comes off earlier, in June, and is markedly darker. Ephemera guttulata (the Green Drake) is smaller, creamier, and will have finished by mid-June.",
    },
    sections: [
      {
        heading: { fr: "La nymphe fouisseuse", en: "The burrowing nymph" },
        body: {
          fr: "L'Hexagenia ne vit pas dans le gravier comme la plupart de nos éphémères : elle creuse un terrier en U dans la vase molle et les dépôts fins, et elle y reste un ou deux ans. Ses branchies plumeuses battent en continu pour faire circuler l'eau dans le terrier — c'est un système de ventilation, pas juste un organe respiratoire. Les défenses sur sa tête servent à creuser.\n\nCe détail dicte tout le reste : si le fond est dur, propre et rapide, il n'y a pas d'Hexagenia, peu importe la date. Cherchez plutôt les élargissements lents, les queues de fosse où le sédiment fin se dépose, les baies d'embouchure et les décharges de lac.",
          en: "Hexagenia does not live in gravel like most of our mayflies. It digs a U-shaped burrow in soft silt and fine sediment and stays there for one or two years. Its feathery gills beat constantly to pull water through the burrow — that is a ventilation system, not just a breathing organ. The tusks on its head are digging tools.\n\nThat one detail governs everything else: if the bottom is hard, clean and fast, there is no Hexagenia there, whatever the date says. Look instead for slow widenings, the tailouts of pools where fine sediment settles, river mouths and lake outlets.",
        },
      },
      {
        heading: { fr: "Pourquoi à la noirceur", en: "Why after dark" },
        body: {
          fr: "Une éphémère de cette taille est un repas visible de loin, et elle est sans défense pendant les secondes où elle perce la pellicule et sèche ses ailes. Sortir en pleine noirceur réduit la pression des oiseaux insectivores, qui sont le vrai prédateur d'une subimago — pas la truite.\n\nEn pratique, l'éclosion commence quand la lumière tombe sous un certain seuil, pas à une heure fixe. Fin juin, ça veut dire 21 h 30 ou 22 h ; début août, c'est plus tôt. Un ciel couvert avance le tout de vingt minutes. L'eau doit avoir atteint environ 18 à 21 °C.",
          en: "A mayfly this size is a meal visible from a long way off, and it is defenceless for the seconds it spends breaking through the film and drying its wings. Emerging in full dark cuts the pressure from insect-eating birds, which are the real predator of a dun — not the trout.\n\nIn practice the hatch starts when light drops below a threshold, not at a set hour. In late June that means 9:30 or 10 p.m.; by early August it is earlier. An overcast sky moves the whole thing twenty minutes forward. The water needs to have reached roughly 18–21°C.",
        },
      },
      {
        heading: { fr: "Pêcher ce qu'on ne voit pas", en: "Fishing what you cannot see" },
        body: {
          fr: "Repérez votre poste de jour. Marchez-le, notez où vous êtes debout, où sont les branches derrière vous, et à quelle distance se trouve la veine. À la noirceur, vous ne corrigerez rien de tout ça.\n\nEnsuite, pêchez à l'oreille. Une gobe sur une Hexagenia ne ressemble pas à une gobe ordinaire : c'est un bruit creux, lourd, souvent suivi d'un remous qu'on entend plus qu'on ne le voit. Ferrez sur le son, pas sur ce que vous croyez apercevoir. Et montez en 3X ou 4X : une truite de cette taille, dans le noir, dans un courant que vous ne voyez pas, ne pardonne pas un bas de ligne fin.",
          en: "Scout your lie in daylight. Walk it, note where you will stand, what is behind you, and how far out the seam sits. In the dark you will not be fixing any of that.\n\nThen fish by ear. A rise to a Hexagenia does not sound like an ordinary rise: it is hollow and heavy, often followed by a swirl you hear rather than see. Set on the sound, not on what you think you glimpsed. And fish 3X or 4X — a trout that size, in the dark, in current you cannot read, does not forgive fine tippet.",
        },
      },
    ],
    stages: [
      {
        label: { fr: "Nymphe", en: "Nymph" },
        when: {
          fr: "L'heure qui précède la noirceur, et toute l'année sur les bons fonds.",
          en: "The hour before dark, and year-round over the right bottom.",
        },
        how: {
          fr: "Au fond, près des bordures vaseuses, en remontées lentes. Les nymphes quittent le terrier avant d'éclore et nagent maladroitement vers la surface — c'est le moment le plus facile de leur vie pour une truite.",
          en: "On the bottom along silty margins, on a slow lift. Nymphs leave the burrow before emerging and swim clumsily upward — the easiest moment of their lives from a trout's point of view.",
        },
        patternSlugs: ["montana-stone", "bunny-leech"],
      },
      {
        label: { fr: "Subimago (dun)", en: "Dun" },
        when: { fr: "De la noirceur jusqu'à tard.", en: "From dark until late." },
        how: {
          fr: "En dérive morte, ou avec une très légère animation qui fait un sillage. Une grosse mouche qui flotte haut et qu'on peut suivre au son.",
          en: "Dead drift, or with just enough movement to make a wake. A big fly that floats high and can be tracked by ear.",
        },
        patternSlugs: ["hexagenia-dun"],
      },
    ],
  },

  // ----------------------------------------------------------- HENDRICKSON
  {
    hatchId: "hendrickson",
    metaTitle: {
      fr: "Ephemerella subvaria — le Hendrickson, l'éclosion qui ouvre la saison",
      en: "Ephemerella subvaria — the Hendrickson, the hatch that opens the season",
    },
    metaDescription: {
      fr: "Le Hendrickson dans le sud du Québec : identification, pourquoi il éclot en après-midi, pourquoi le mâle et la femelle ont deux noms de mouche, et comment le pêcher.",
      en: "The Hendrickson in southern Québec: how to identify it, why it emerges in the afternoon, why the male and female carry two different fly names, and how to fish it.",
    },
    intro: {
      fr: "Pour bien des pêcheurs d'ici, la saison ne commence pas à l'ouverture : elle commence le jour où le premier Hendrickson sort. C'est la première éclosion assez dense et assez prévisible pour faire monter la truite en surface de façon fiable, et elle arrive presque à l'heure, quelque part entre le début et la fin de mai.",
      en: "For a lot of anglers here the season does not start on opening day — it starts the afternoon the first Hendrickson comes off. It is the first hatch dense and predictable enough to bring trout up reliably, and it arrives close to on schedule, somewhere between early and late May.",
    },
    idMarks: [
      {
        fr: "Taille 12 à 14, corps de 8 à 11 mm.",
        en: "Size 12 to 14, an 8–11 mm body.",
      },
      {
        fr: "Trois queues — c'est ce qui la sépare du Quill Gordon, qui n'en a que deux.",
        en: "Three tails — which is what separates it from the Quill Gordon, which has two.",
      },
      {
        fr: "Ailes gris ardoise, tenues bien droites, sans marbrure marquée.",
        en: "Slate-grey wings held upright, without strong mottling.",
      },
      {
        fr: "La femelle a le corps brun-rosé à olive ; le mâle est plus foncé, brun-rouge.",
        en: "The female's body runs pinkish-tan to olive; the male is darker, a red-brown.",
      },
      {
        fr: "Nymphe trapue de type « rampante », sur le gravier et dans les amas de feuilles.",
        en: "A stocky crawler nymph, on gravel and in leaf packs.",
      },
    ],
    confusedWith: {
      fr: "L'Epeorus pluralis (Quill Gordon) sort en même temps mais n'a que deux queues et éclot au fond. Le Paraleptophlebia adoptiva (Blue Quill) est plus petit et plus foncé, en 16-18. Et le Leptophlebia cupida (Black Quill) partage la date mais préfère les eaux mortes et les bordures.",
      en: "Epeorus pluralis (the Quill Gordon) overlaps but has only two tails and emerges on the bottom. Paraleptophlebia adoptiva (the Blue Quill) is smaller and darker, a 16 or 18. And Leptophlebia cupida (the Black Quill) shares the date but prefers slack water and margins.",
    },
    sections: [
      {
        heading: {
          fr: "Deux noms de mouche, un seul insecte",
          en: "Two fly names, one insect",
        },
        body: {
          fr: "Le Hendrickson et le Red Quill sont vendus comme deux patrons distincts, et pêchés comme tels. Ce sont pourtant la femelle et le mâle de la même espèce. Le dimorphisme sexuel est assez marqué chez Ephemerella subvaria pour que les monteurs du siècle dernier leur aient donné des noms séparés avant de comprendre qu'ils regardaient un couple.\n\nEn pratique, ça compte : les deux sortent ensemble, et un jour donné la truite peut se fixer sur l'un plutôt que sur l'autre. Si vos refus s'accumulent avec une mouche claire, essayez la version foncée avant de changer de taille.",
          en: "The Hendrickson and the Red Quill are sold as two separate patterns and fished as two separate patterns. They are the female and the male of the same species. The sexual dimorphism in Ephemerella subvaria is pronounced enough that tyers named them separately before anyone worked out they were looking at a pair.\n\nThis matters on the water: both come off together, and on a given day trout can lock onto one and refuse the other. If refusals are piling up on the lighter fly, try the darker one before you change size.",
        },
      },
      {
        heading: {
          fr: "Pourquoi en après-midi (et pourquoi ça change plus tard)",
          en: "Why the afternoon — and why that changes later",
        },
        body: {
          fr: "En mai, l'eau est encore froide. L'éclosion se déclenche autour de 10 à 13 °C, et ce seuil n'est atteint qu'au moment le plus chaud de la journée : le milieu de l'après-midi. C'est pour ça que le Hendrickson sort entre 13 h et 16 h, et qu'une journée froide comprime toute l'éclosion dans une seule heure.\n\nLe même raisonnement explique pourquoi les éclosions glissent vers le soir à mesure que la saison avance. En juin et juillet, l'eau dépasse le seuil dès le matin et reste trop chaude tout l'après-midi ; la fenêtre confortable se déplace à la brunante. Ce n'est pas l'heure qui compte, c'est la température.",
          en: "In May the water is still cold. Emergence triggers somewhere around 10–13°C, and that threshold is only reached at the warmest point of the day — mid-afternoon. That is why the Hendrickson comes off between 1 and 4 p.m., and why a cold day compresses the whole hatch into a single hour.\n\nThe same logic explains why hatches slide toward evening as the season goes on. By June and July the water clears the threshold by morning and stays above it all afternoon, so the comfortable window moves to dusk. It was never the hour — it was the temperature.",
        },
      },
      {
        heading: {
          fr: "La subimago qui ne décolle pas",
          en: "The dun that cannot leave",
        },
        body: {
          fr: "Dans une eau à 11 °C, une subimago met beaucoup plus de temps à sécher ses ailes que dans l'eau tiède de juillet. Elle dérive donc longtemps, parfois sur des dizaines de mètres, bien en vue.\n\nC'est exactement pour ça que le Hendrickson est une si bonne éclosion à la sèche : ce n'est pas qu'il y a plus d'insectes que plus tard dans l'année, c'est qu'ils restent disponibles plus longtemps. Et c'est aussi pourquoi l'émergente, coincée dans la pellicule, fait souvent plus de poissons que la subimago parfaitement montée.",
          en: "In 11°C water a dun takes far longer to dry its wings than it does in warm July water. So it rides, sometimes for tens of metres, in plain view.\n\nThat is precisely why the Hendrickson is such a good dry-fly hatch: not because there are more insects than later in the year, but because each one stays available for longer. It is also why the emerger, stuck in the film, often outfishes the perfectly tied dun.",
        },
      },
    ],
    stages: [
      {
        label: { fr: "Nymphe", en: "Nymph" },
        when: {
          fr: "Deux à trois semaines avant l'éclosion, et tout au long.",
          en: "Two to three weeks before the hatch, and right through it.",
        },
        how: {
          fr: "En dérive morte au fond, dans les courants modérés sur gravier. Les nymphes deviennent agitées et se déplacent avant l'éclosion — c'est le moment de les pêcher.",
          en: "Dead drift on the bottom through moderate gravel runs. Nymphs get restless and move before emergence — that is when to fish them.",
        },
        patternSlugs: ["pheasant-tail-nymph", "bead-head-hares-ear"],
      },
      {
        label: { fr: "Émergente", en: "Emerger" },
        when: { fr: "Pendant l'éclosion, dans la pellicule.", en: "During the hatch, in the film." },
        how: {
          fr: "Une noyée souple en dérive tendue, ou une sèche mal séchée qui s'enfonce. Si les gobes sont molles et que la sèche est refusée, c'est ici qu'il faut aller.",
          en: "A soft-hackle on a tight swing, or a poorly dried dry that sits low. If rises look soft and the dun is refused, this is where to go.",
        },
        patternSlugs: ["partridge-orange"],
      },
      {
        label: { fr: "Subimago (dun)", en: "Dun" },
        when: { fr: "13 h à 16 h, au plus chaud de la journée.", en: "1 to 4 p.m., the warmest part of the day." },
        how: {
          fr: "Dérive morte, 5X. Visez un poisson précis plutôt que la nappe d'insectes.",
          en: "Dead drift on 5X. Pick one fish rather than casting at the drift lane.",
        },
        patternSlugs: ["hendrickson", "parachute-adams"],
      },
    ],
  },

  // ------------------------------------------------------------------ BWO
  {
    hatchId: "blue-winged-olive",
    metaTitle: {
      fr: "Baetis — la Blue-Winged Olive, l'éphémère des mauvaises journées",
      en: "Baetis — the Blue-Winged Olive, the bad-weather mayfly",
    },
    metaDescription: {
      fr: "La Blue-Winged Olive (Baetis) au Québec : pourquoi les journées froides et grises donnent les meilleures éclosions, pourquoi la taille rapetisse en automne, et quoi pêcher.",
      en: "The Blue-Winged Olive (Baetis) in Québec: why cold grey days produce the best hatches, why the flies shrink in autumn, and what to fish.",
    },
    intro: {
      fr: "Si vous ne deviez apprendre qu'un seul insecte, ce serait celui-là. La Blue-Winged Olive est sur l'eau d'avril à novembre, elle produit ses meilleures éclosions exactement les jours où personne n'a envie de sortir, et elle sauve plus de journées que n'importe quelle autre éphémère de nos rivières.",
      en: "If you only ever learn one insect, make it this one. The Blue-Winged Olive is on the water from April to November, produces its heaviest hatches on precisely the days nobody wants to go out, and rescues more days than any other mayfly in our rivers.",
    },
    idMarks: [
      {
        fr: "Petite : taille 16 à 20 au printemps, 20 à 22 en automne.",
        en: "Small: size 16–20 in spring, 20–22 in autumn.",
      },
      {
        fr: "Deux queues seulement — le repère le plus rapide sur l'eau.",
        en: "Two tails only — the fastest thing to check on the water.",
      },
      {
        fr: "Ailes gris-bleu, hautes et arrondies, sans marbrure.",
        en: "Blue-grey wings, tall and rounded, with no mottling.",
      },
      {
        fr: "Corps olive à olive-brun, souvent plus foncé en automne.",
        en: "Olive to olive-brown body, usually darker in autumn.",
      },
      {
        fr: "Nymphe fuselée de type « nageuse » : elle file comme un petit poisson.",
        en: "A slender swimmer nymph that darts like a tiny minnow.",
      },
    ],
    confusedWith: {
      fr: "Les chironomes adultes, qui sont de taille comparable mais n'ont pas d'aile dressée et ne portent pas de queues. Le Paraleptophlebia est plus foncé et porte trois queues. La Drunella cornuta, aussi appelée Blue-Winged Olive, est nettement plus grosse (14-16) et sort le matin en juin.",
      en: "Adult midges, which run a similar size but have no upright wing and no tails. Paraleptophlebia is darker and has three tails. Drunella cornuta, also sold as a Blue-Winged Olive, is noticeably larger (14–16) and comes off in the morning in June.",
    },
    sections: [
      {
        heading: {
          fr: "Plusieurs générations par année",
          en: "Several broods a year",
        },
        body: {
          fr: "La plupart de nos éphémères font une génération par an : une éclosion, une fenêtre, terminé. Les Baetis en font deux ou trois. C'est toute la raison pour laquelle on les voit du dégel jusqu'aux premières neiges, et pourquoi elles réapparaissent en septembre alors que presque tout le reste est fini.\n\nUn effet secondaire utile : les générations tardives sont plus petites que celles du printemps. Une boîte qui ne contient que des 16 vous laissera à court en octobre. Descendez à 20, parfois 22.",
          en: "Most of our mayflies run one generation a year: one hatch, one window, done. Baetis runs two or three. That is the whole reason you see them from ice-out to first snow, and why they reappear in September when nearly everything else has finished.\n\nA useful side effect: the late broods are smaller than the spring ones. A box holding nothing but 16s will leave you short in October. Drop to 20, sometimes 22.",
        },
      },
      {
        heading: {
          fr: "Pourquoi les mauvaises journées sont les bonnes",
          en: "Why the bad days are the good ones",
        },
        body: {
          fr: "Tout le monde répète qu'il faut un temps gris et froid pour une bonne éclosion de Baetis. C'est vrai, et le mécanisme est simple : dans l'air humide et froid, la subimago met beaucoup plus de temps à sécher ses ailes. Elle dérive donc plus longtemps avant de décoller.\n\nLe nombre d'insectes n'a pas forcément changé — c'est leur temps de séjour en surface qui a doublé ou triplé. Résultat : la densité apparente sur l'eau grimpe, les truites se mettent en poste et se fixent. Un beau soleil de mai produit exactement la même éclosion, mais chaque insecte décolle en quelques secondes et le poisson ne s'installe jamais.",
          en: "Everyone repeats that you want a cold grey day for a good Baetis hatch. True — and the mechanism is simple: in cold, humid air the dun takes far longer to dry its wings, so it rides much longer before it can fly.\n\nThe number of insects has not necessarily changed. What has changed is how long each one stays on the surface, which can double or triple. The apparent density goes up, trout move into feeding lies and commit. Bright May sunshine produces the same hatch, but each insect leaves in seconds and the fish never settle.",
        },
      },
      {
        heading: {
          fr: "L'imago que personne ne pêche",
          en: "The spinner nobody fishes",
        },
        body: {
          fr: "Voici le détail qui vaut le déplacement. Chez plusieurs Baetis, la femelle imago ne pond pas en tapotant la surface : elle descend sous l'eau, souvent en rampant le long d'une roche ou d'une branche immergée, et colle ses œufs sur le substrat. Elle y meurt, puis elle repart à la dérive — noyée.\n\nCa veut dire qu'il y a, après chaque éclosion sérieuse, une biomasse d'imagos noyées qui dérive entre deux eaux, et à peu près personne ne la pêche. Une petite noyée olive montée en dérive tendue juste sous la surface, en fin d'éclosion, est une des meilleures cartes cachées de nos rivières.",
          en: "Here is the detail worth the trip. In several Baetis species the female spinner does not lay by tapping the surface. She goes underwater — often crawling down a rock or a submerged branch — and glues her eggs to the substrate. She dies down there, then drifts back out, drowned.\n\nSo after every serious hatch there is a mass of drowned spinners drifting mid-water, and almost nobody fishes it. A small olive soft-hackle swung just under the surface at the tail end of a hatch is one of the better-kept secrets on our water.",
        },
      },
    ],
    stages: [
      {
        label: { fr: "Nymphe", en: "Nymph" },
        when: { fr: "Toute l'année.", en: "Year-round." },
        how: {
          fr: "Une petite nymphe fuselée en dérive morte dans les veines. La nymphe de Baetis est présente en permanence : c'est une des rares mouches qui travaille douze mois par année.",
          en: "A small slim nymph dead-drifted through the seams. The Baetis nymph is permanently available — one of the few flies that works twelve months a year.",
        },
        patternSlugs: ["pheasant-tail-nymph"],
      },
      {
        label: { fr: "Subimago (dun)", en: "Dun" },
        when: {
          fr: "Les journées froides, grises, pluvieuses. De la fin de matinée au milieu de l'après-midi.",
          en: "Cold, grey, drizzling days, from late morning to mid-afternoon.",
        },
        how: {
          fr: "Dérive morte dans les veines lentes et les contre-courants où les insectes s'accumulent. 6X minimum, souvent 7X.",
          en: "Dead drift in slow seams and back-eddies where the naturals collect. 6X at minimum, often 7X.",
        },
        patternSlugs: ["blue-winged-olive", "parachute-adams"],
      },
      {
        label: { fr: "Imago noyée", en: "Drowned spinner" },
        when: { fr: "En fin d'éclosion et après.", en: "At the tail end of the hatch and after." },
        how: {
          fr: "Une noyée souple, juste sous la surface, en dérive tendue. Presque personne ne la pêche.",
          en: "A soft-hackle just under the surface, on a tight swing. Almost nobody fishes it.",
        },
        patternSlugs: ["partridge-orange"],
      },
    ],
  },

  // ---------------------------------------------------------- GREEN DRAKE
  {
    hatchId: "green-drake",
    metaTitle: {
      fr: "Ephemera guttulata — le Green Drake et la Coffin Fly",
      en: "Ephemera guttulata — the Green Drake and the Coffin Fly",
    },
    metaDescription: {
      fr: "Le Green Drake au Québec : dix jours par année, pourquoi l'éclosion est si courte, pourquoi l'imago porte un autre nom, et comment pêcher les deux stades.",
      en: "The Green Drake in Québec: ten days a year, why the hatch is so short, why the spinner has its own name, and how to fish both stages.",
    },
    intro: {
      fr: "Le Green Drake est l'éclosion qu'on planifie une année d'avance. Dix jours, parfois moins, sur une rivière donnée — et pendant ces dix jours, des truites qui n'ont pas levé la tête depuis un mois se mettent à manger en surface comme si c'était la dernière occasion.",
      en: "The Green Drake is the hatch people plan a year around. Ten days on a given river, sometimes fewer — and during those ten days trout that have not looked up in a month start feeding on the surface like it is their last chance.",
    },
    idMarks: [
      {
        fr: "Très grosse : taille 8 à 10, corps de 20 à 25 mm.",
        en: "Very large: size 8 to 10, a 20–25 mm body.",
      },
      {
        fr: "Subimago au corps crème verdâtre, taché de brun foncé.",
        en: "The dun has a creamy-green body blotched with dark brown.",
      },
      {
        fr: "Ailes fortement barrées de brun, très hautes.",
        en: "Wings heavily barred with brown, and very tall.",
      },
      {
        fr: "Trois queues.",
        en: "Three tails.",
      },
      {
        fr: "L'imago (Coffin Fly) est d'un blanc crème presque uni, avec des ailes claires et vitreuses — on dirait un autre insecte.",
        en: "The spinner (Coffin Fly) is an almost plain creamy white with clear, glassy wings — it looks like a different insect entirely.",
      },
    ],
    confusedWith: {
      fr: "L'Ephemera simulans (Brown Drake) sort à peu près en même temps, dans les mêmes fonds, mais elle est plus foncée et un peu plus petite. La Litobrancha recurvata est nettement plus sombre. Et l'Hexagenia, plus grosse encore, ne commencera qu'à la fin juin.",
      en: "Ephemera simulans (the Brown Drake) comes off at roughly the same time over the same bottom, but runs darker and slightly smaller. Litobrancha recurvata is considerably darker. And Hexagenia, larger still, will not start until late June.",
    },
    sections: [
      {
        heading: {
          fr: "Pourquoi dix jours et pas six semaines",
          en: "Why ten days and not six weeks",
        },
        body: {
          fr: "La brièveté de l'éclosion n'est pas un accident : c'est une stratégie. En sortant tous en même temps, sur une fenêtre très étroite, les Ephemera guttulata saturent littéralement leurs prédateurs. Les truites, les oiseaux et les chauves-souris mangent tout ce qu'ils peuvent — et il en reste quand même assez pour se reproduire. Une éclosion étalée sur six semaines serait consommée presque intégralement.\n\nLe corollaire pour le pêcheur est brutal : arriver une semaine trop tôt ou trop tard, c'est manquer l'année complète. Et comme le déclencheur est thermique, la date bouge de dix jours d'une année à l'autre.",
          en: "The brevity is not an accident — it is a strategy. By emerging all at once in a very narrow window, Ephemera guttulata simply saturates its predators. Trout, birds and bats eat all they can, and enough still survives to breed. A hatch spread over six weeks would be eaten almost entirely.\n\nThe corollary for an angler is brutal: turn up a week early or a week late and you have missed the whole year. And because the trigger is thermal, the date moves ten days either way between seasons.",
        },
      },
      {
        heading: {
          fr: "Deux insectes, deux noms, deux pêches",
          en: "Two insects, two names, two kinds of fishing",
        },
        body: {
          fr: "La subimago est le Green Drake : crème verdâtre, mouchetée, ailes barrées. Vingt-quatre à quarante-huit heures plus tard, elle mue une dernière fois et devient l'imago — et elle est méconnaissable. Blanche, lisse, avec des ailes transparentes. Les Anglais l'ont baptisée Coffin Fly, la mouche-cercueil, pour cette pâleur.\n\nLes deux stades se pêchent différemment et souvent mieux au stade imago. La retombée des Coffin Flies a lieu à la noirceur, plus tard que l'éclosion, et elle est plus concentrée : des milliers d'insectes morts, ailes à plat, immobiles sur l'eau. C'est le moment où les plus grosses truites de la fosse se décident.",
          en: "The dun is the Green Drake: creamy green, blotched, barred wings. Twenty-four to forty-eight hours later it moults one last time into the spinner — and becomes unrecognisable. White, smooth, with clear glassy wings. English anglers named it the Coffin Fly for that pallor.\n\nThe two stages fish differently, and often the spinner fishes better. The Coffin Fly fall happens at dark, later than the hatch, and is far more concentrated: thousands of dead insects lying flat and motionless on the surface. That is when the best fish in the pool commit.",
        },
      },
      {
        heading: {
          fr: "La sélectivité du Green Drake",
          en: "Green Drake selectivity",
        },
        body: {
          fr: "C'est une des rares éclosions où une truite peut refuser une mouche énorme et parfaitement dérivée, encore et encore. La raison la plus fréquente : elle ne mange pas la subimago, elle mange l'émergente — l'insecte coincé à moitié sorti de son enveloppe nymphale, incapable de fuir.\n\nSi vous essuyez trois refus francs sur une bonne dérive, ne changez pas de taille : changez d'étage. Une mouche qui flotte plus bas, ou carrément dans la pellicule, règle le problème plus souvent qu'un nouveau patron.",
          en: "This is one of the few hatches where a trout will refuse an enormous, perfectly drifted fly again and again. The usual reason: it is not eating duns at all, it is eating emergers — insects stuck half out of the nymphal shuck and unable to escape.\n\nIf you take three clean refusals on a good drift, do not change size. Change depth. A fly sitting lower, or right down in the film, solves it more often than a new pattern does.",
        },
      },
    ],
    stages: [
      {
        label: { fr: "Nymphe", en: "Nymph" },
        when: {
          fr: "Les deux semaines qui précèdent l'éclosion.",
          en: "The fortnight before the hatch.",
        },
        how: {
          fr: "Au fond, sur les mélanges de gravier et de sable où la nymphe fouisseuse s'enterre. Lourde, en dérive morte.",
          en: "On the bottom over the gravel-and-sand mixes the burrowing nymph digs into. Heavy, dead drift.",
        },
        patternSlugs: ["montana-stone", "bead-head-hares-ear"],
      },
      {
        label: { fr: "Subimago (dun)", en: "Dun" },
        when: { fr: "En soirée, pendant la fenêtre d'éclosion.", en: "Evenings, during the emergence window." },
        how: {
          fr: "Dérive morte, bas de ligne plus fort qu'on pense — 3X ou 4X. Une grosse mouche fait dériver un 6X de travers.",
          en: "Dead drift on heavier tippet than feels right — 3X or 4X. A fly this size drags fine tippet out of line.",
        },
        patternSlugs: ["green-drake"],
      },
      {
        label: { fr: "Imago (Coffin Fly)", en: "Spinner (Coffin Fly)" },
        when: { fr: "À la noirceur, après l'éclosion.", en: "At dark, after the hatch." },
        how: {
          fr: "Immobile, à plat sur la surface. Aucune animation. Restez sur l'eau une demi-heure de plus que ce que vous pensez.",
          en: "Motionless and flat in the surface. No movement at all. Stay on the water half an hour longer than you think you should.",
        },
        patternSlugs: ["green-drake", "parachute-adams"],
      },
    ],
  },
];

export function articleFor(hatchId: string): InsectArticle | undefined {
  return INSECT_ARTICLES.find((a) => a.hatchId === hatchId);
}

export const ARTICLE_IDS = new Set(INSECT_ARTICLES.map((a) => a.hatchId));
