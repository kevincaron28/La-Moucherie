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

  // ------------------------------------------------------------------ TRICO
  {
    hatchId: "trico",
    metaTitle: {
      fr: "Tricorythodes — le Trico, l'éclosion du matin qui obsède les puristes",
      en: "Tricorythodes — the Trico, the morning hatch that obsesses purists",
    },
    metaDescription: {
      fr: "Le Trico (Tricorythodes) au Québec : pourquoi la retombée matinale attire des nuées d'insectes minuscules, et pourquoi le bas de ligne compte plus que le patron.",
      en: "The Trico (Tricorythodes) in Québec: why the morning spinner fall comes off in clouds of tiny insects, and why tippet matters more than the fly pattern.",
    },
    intro: {
      fr: "Aucune éclosion ne punit autant les erreurs de présentation que celle-ci. Le Trico sort en nuées si denses qu'on croirait de la fumée au-dessus de l'eau, mais chaque insecte fait à peine la taille d'un grain de riz. Les truites s'installent, comptent les calories une à la fois, et refusent tout ce qui dérive un peu de travers.",
      en: "No hatch punishes a sloppy presentation like this one. The Trico comes off in clouds so dense they can look like smoke over the water, but each insect is barely the size of a grain of rice. Trout settle into a rhythm, counting calories one at a time, and refuse anything that drags even slightly.",
    },
    idMarks: [
      {
        fr: "Minuscule : taille 20 à 24, un corps de 3 à 4 mm à peine.",
        en: "Tiny: size 20–24, a body barely 3–4 mm long.",
      },
      {
        fr: "Thorax presque noir chez le mâle; abdomen pâle, crème à olive, chez la femelle — vu de loin, l'essaim paraît tout noir.",
        en: "Near-black thorax on the male; pale cream-to-olive abdomen on the female — from a distance, the swarm just looks black.",
      },
      {
        fr: "Deux queues seulement, pas trois — inhabituel chez une éphémère de cette allure.",
        en: "Only two tails, not three — unusual for a mayfly built like this.",
      },
      {
        fr: "Une seule paire d'ailes vraiment fonctionnelle; les ailes postérieures sont réduites ou absentes.",
        en: "Only one functional pair of wings; the hindwings are reduced or missing.",
      },
      {
        fr: "Nymphe aplatie, agrippée aux roches et à la végétation immergée dans les portions calmes et un peu limoneuses.",
        en: "A flattened, clinging nymph found on rock and submerged vegetation in slower, slightly silty stretches.",
      },
    ],
    confusedWith: {
      fr: "Le Caenis, tout aussi minuscule et aux ailes tout aussi réduites, mais qui émerge plutôt en soirée et dont la chute est éparse, jamais la nuée dense qu'on voit avec le Trico le matin. Un très petit Baetis peut aussi tromper au premier coup d'œil, mais celui-ci garde trois queues et deux paires d'ailes bien visibles.",
      en: "Caenis, just as tiny and just as reduced in the hindwing, but it emerges toward evening and its fall is thin and scattered — never the dense morning cloud a Trico produces. A very small Baetis can also fool you at a glance, but it keeps three tails and two clearly visible pairs of wings.",
    },
    sections: [
      {
        heading: { fr: "Une émergence-éclair", en: "A lightning-fast turnaround" },
        body: {
          fr: "La plupart de nos éphémères prennent une journée, parfois plus, entre la sortie de l'eau (subimago) et la mue finale en imago. Le Trico fait ça en une heure, parfois moins. La nymphe grimpe à la surface avant l'aube ou tôt le matin, mue presque aussitôt, et se transforme en imago avant même que la plupart des pêcheurs aient fini leur café.\n\nConséquence pratique : on rate presque toujours la subimago. Ce qu'on voit sur l'eau, dans la grande majorité des cas, c'est déjà la retombée des imagos — la vraie éclosion s'est produite pendant que personne ne regardait.",
          en: "Most of our mayflies take a full day, sometimes more, between the dun stage and the final molt to the spinner. A Trico does it in about an hour, sometimes less. The nymph climbs to the surface before dawn or early in the morning, molts almost immediately, and is already a spinner before most anglers have finished their coffee.\n\nThe practical result: you almost never see the dun. What you actually see on the water, in the vast majority of cases, is already the spinner fall — the real emergence happened while nobody was watching.",
        },
      },
      {
        heading: { fr: "Pourquoi le matin", en: "Why mornings" },
        body: {
          fr: "La retombée des imagos suit la chaleur, pas l'horloge. Elle démarre une fois que l'air s'est réchauffé assez pour que les mâles forment leurs essaims nuptiaux au-dessus de l'eau — typiquement entre 7 h et 10 h, une fois la rosée disparue. Plus tard dans l'été, quand les matinées sont déjà chaudes dès le lever du soleil, tout le spectacle peut se produire une heure plus tôt.\n\nLe Trico produit plusieurs générations entre juillet et la fin septembre, ce qui explique pourquoi la fenêtre active dure trois mois complets plutôt qu'une ou deux semaines comme la plupart des grandes éphémères.",
          en: "The spinner fall follows temperature, not the clock. It starts once the air has warmed enough for males to form their mating swarms over the water — typically between 7 and 10 a.m., once the dew has burned off. Later in summer, when mornings are already warm at sunrise, the whole show can happen an hour earlier.\n\nTrico runs several generations between July and the end of September, which is why the active window lasts three full months rather than the one or two weeks typical of most of our larger mayflies.",
        },
      },
      {
        heading: { fr: "Une question de bas de ligne, pas de patron", en: "A tippet question, not a fly-pattern one" },
        body: {
          fr: "Avec un insecte aussi uniforme et aussi abondant, les truites se bâtissent une image très précise de ce qu'elles cherchent, et n'importe quel écart dans la silhouette de votre mouche ressort. Ce qui les fait refuser, dans la grande majorité des cas, ce n'est pas le patron : c'est le 5X qui crée un sillage visible à cette taille.\n\nDescendez à 6X, parfois 7X, et cherchez les remous discrets — les nageoires caudales qui se lèvent avec un mouvement très retenu, signe d'un poisson qui sipe sans bouger de sa position. C'est le meilleur indice qu'il est réellement sur les imagos et non en train de gober au hasard.",
          en: "With an insect this uniform and this abundant, trout build a very precise search image, and any deviation in your fly's silhouette stands out. In the vast majority of refusals, it is not the pattern — it is 5X leaving a visible wake at this size.\n\nDrop to 6X, sometimes 7X, and watch for quiet dorsal-and-tail rises — a very restrained sipping motion from a fish that never moves off its lie. That is the best sign it is genuinely keyed on the spinners rather than gulping at random.",
        },
      },
    ],
    stages: [
      {
        label: { fr: "Nymphe", en: "Nymph" },
        when: { fr: "Avant l'aube et tôt le matin, sur le fond.", en: "Before dawn and early morning, on the bottom." },
        how: {
          fr: "Une petite nymphe sombre en dérive morte près du fond, dans les portions à courant modéré. Utile surtout comme mouche de fond hors éclosion — la vraie action se joue en surface.",
          en: "A small dark nymph dead-drifted near bottom in moderate current. Mostly useful as a searching pattern outside the fall — the real action happens on top.",
        },
        patternSlugs: ["pheasant-tail-nymph"],
      },
      {
        label: { fr: "Imago (chute)", en: "Spinner (the fall)" },
        when: { fr: "De 7 h à 10 h environ, une fois la rosée disparue.", en: "Roughly 7 to 10 a.m., once the dew has burned off." },
        how: {
          fr: "Une imago étalée qui repose à plat dans la pellicule, en dérive tendue sur 6X ou 7X. Le Griffith's Gnat imite aussi bien un amas de plusieurs imagos collées ensemble qu'un insecte seul.",
          en: "A spent-wing spinner lying flat in the film, drifted drag-free on 6X or 7X. A Griffith's Gnat also works well as a cluster of several stuck-together spinners rather than a single insect.",
        },
        patternSlugs: ["trico-spinner", "griffiths-gnat"],
      },
    ],
  },

  // ------------------------------------------------------------ MARCH BROWN
  {
    hatchId: "march-brown",
    metaTitle: {
      fr: "Maccaffertium vicarium — le March Brown, la grosse éphémère de l'après-midi",
      en: "Maccaffertium vicarium — the March Brown, the big afternoon mayfly",
    },
    metaDescription: {
      fr: "Le March Brown (Maccaffertium vicarium) au Québec : pourquoi cette éclosion sort au compte-gouttes tout l'après-midi, et comment la distinguer du Grey Fox qui prend la relève en soirée.",
      en: "The March Brown (Maccaffertium vicarium) in Québec: why this hatch trickles off all afternoon instead of coming in a wave, and how to tell it from the Grey Fox that takes over in the evening.",
    },
    intro: {
      fr: "C'est une des rares grosses éphémères qui sort en plein jour plutôt qu'au crépuscule, et elle le fait sans se presser : quelques insectes à la fois, étalés sur des heures, plutôt qu'une vague concentrée. Ça demande de la patience, mais elle est assez grosse pour faire sortir les truites les plus prudentes de leur poste.",
      en: "This is one of the few big mayflies that comes off in broad daylight instead of at dusk, and it does it unhurried: a handful of insects at a time, spread across hours, rather than one concentrated wave. It takes patience, but it is big enough to pull the most cautious trout out of their lie.",
    },
    idMarks: [
      {
        fr: "Grosse : taille 10 à 12, avec des ailes antérieures fortement tachetées de brun.",
        en: "Large: size 10–12, with heavily brown-mottled forewings.",
      },
      {
        fr: "Corps brun tacheté, pattes annelées de brun foncé.",
        en: "Mottled brown body, legs banded in dark brown.",
      },
      {
        fr: "Nymphe aplatie et large, typique des insectes qui vivent agrippés aux roches en eau vive : tête large, yeux écartés sur le dessus.",
        en: "A broad, flattened nymph typical of insects that cling to rock in fast water: a wide head with eyes set far apart on top.",
      },
      {
        fr: "Émerge en pleine journée, généralement entre 11 h et 15 h — inhabituel pour une éphémère de cette taille.",
        en: "Emerges in broad daylight, generally between 11 a.m. and 3 p.m. — unusual for a mayfly this size.",
      },
      {
        fr: "Trois queues, comme la plupart des éphémères.",
        en: "Three tails, like most mayflies.",
      },
    ],
    confusedWith: {
      fr: "Le Grey Fox (Maccaffertium fuscum), du même genre et souvent traité par les taxonomistes comme une simple forme du March Brown. Sur l'eau, la distinction est pratique plutôt que génétique : le Grey Fox est un cran plus petit (12-14 contre 10-12), plus pâle, et il prend la relève en fin de journée plutôt qu'en après-midi.",
      en: "The Grey Fox (Maccaffertium fuscum), from the same genus and often treated by taxonomists as just a form of the March Brown. On the water the distinction is practical rather than genetic: the Grey Fox runs a size smaller (12–14 versus 10–12), paler, and takes over late in the day rather than in the afternoon.",
    },
    sections: [
      {
        heading: { fr: "Une nymphe d'eau vive", en: "A fast-water nymph" },
        body: {
          fr: "Le corps aplati et les pattes largement écartées de la nymphe ne sont pas décoratifs : c'est l'équipement d'un insecte qui vit agrippé aux roches, en pleine veine de courant, là où l'eau est la mieux oxygénée. Elle s'y nourrit en broutant les algues et le biofilm qui recouvrent les cailloux.\n\nÇa dicte l'habitat à chercher : les rapides et les radiers à fond de roche propre et de gros gravier, pas les portions lentes et limoneuses. C'est presque l'inverse de l'Hexagenia, qui a besoin de vase molle pour creuser son terrier.",
          en: "The nymph's flattened body and widely splayed legs are not decorative — they are the equipment of an insect that lives clinging to rock, right in the current seam, where the water carries the most oxygen. It feeds there by grazing algae and biofilm off the stones.\n\nThat dictates the habitat to look for: riffles and runs over clean rock and coarse gravel, not slow silty water. It is almost the opposite of Hexagenia, which needs soft silt to dig its burrow.",
        },
      },
      {
        heading: { fr: "Une éclosion en après-midi, au compte-gouttes", en: "An afternoon hatch, a trickle at a time" },
        body: {
          fr: "Contrairement à une émergence synchronisée déclenchée par la tombée de la lumière, celle du March Brown s'étale sur des heures en plein jour, quelques insectes à la fois. Il n'y a presque jamais de vague visible ni de truites qui montent en série.\n\nÇa change la stratégie : plutôt que d'attendre un pod de poissons qui montent, il faut prospecter les postes probables avec une sèche assez grosse et assez flottante pour rester visible longtemps, en acceptant que les touches viennent une à la fois, espacées.",
          en: "Unlike a synchronized emergence triggered by falling light, the March Brown's stretches across hours in broad daylight, a few insects at a time. There is almost never a visible wave or a pod of steadily rising fish.\n\nThat changes the approach: rather than waiting for a pod of risers, prospect the likely lies with a dry big and buoyant enough to stay visible a long time, and accept that the takes come one at a time, spaced apart.",
        },
      },
      {
        heading: { fr: "Deux insectes, une saison", en: "Two insects, one season" },
        body: {
          fr: "March Brown et Grey Fox partagent la même rivière et se chevauchent sur près de six semaines. En pratique, ça veut dire garder les deux tailles en boîte et suivre l'horloge plus que le calendrier : un 10 ou 12 tacheté brun en après-midi, puis un 12 ou 14 plus pâle — souvent un Light Cahill — quand la lumière baisse en fin de journée.",
          en: "March Brown and Grey Fox share the same water and overlap for nearly six weeks. In practice that means carrying both sizes and following the clock more than the calendar: a brown-mottled 10 or 12 in the afternoon, then a paler 12 or 14 — often a Light Cahill — once the light starts to drop toward evening.",
        },
      },
    ],
    stages: [
      {
        label: { fr: "Nymphe", en: "Nymph" },
        when: { fr: "Toute la journée, surtout avant l'éclosion de l'après-midi.", en: "All day, especially ahead of the afternoon hatch." },
        how: {
          fr: "Une nymphe robuste en dérive morte dans les veines rapides, près du fond, là où l'insecte vit réellement.",
          en: "A sturdy nymph dead-drifted near bottom in fast seams, exactly where the insect actually lives.",
        },
        patternSlugs: ["bead-head-hares-ear"],
      },
      {
        label: { fr: "Subimago (dun)", en: "Dun" },
        when: { fr: "De 11 h à 15 h environ.", en: "Roughly 11 a.m. to 3 p.m." },
        how: {
          fr: "Une grosse sèche tachetée, en dérive morte dans les veines et le long des cassures de courant. Restez patient : les touches s'étalent, elles ne s'accumulent pas.",
          en: "A big mottled dry, dead-drifted through seams and along current breaks. Stay patient — the takes are spread out, not stacked up.",
        },
        patternSlugs: ["march-brown"],
      },
    ],
  },

  // ----------------------------------------------------------------- GRANNOM
  {
    hatchId: "grannom",
    metaTitle: {
      fr: "Brachycentrus — le Grannom, le premier gros trichoptère du printemps",
      en: "Brachycentrus — the Grannom, spring's first big caddis",
    },
    metaDescription: {
      fr: "Le Grannom (Brachycentrus) au Québec : le fourreau carré qui le distingue des autres trichoptères, pourquoi il sort en même temps que le Hendrickson, et pourquoi l'après-midi compte autant que le matin.",
      en: "The Grannom (Brachycentrus) in Québec: the square case that sets it apart from other caddis, why it overlaps with the Hendrickson, and why the afternoon matters as much as the morning.",
    },
    intro: {
      fr: "C'est le signal que le printemps est vraiment arrivé : le premier gros trichoptère de l'année, souvent le même jour que le Hendrickson. Les essaims noirs au-dessus des rapides sont difficiles à manquer, mais la vraie action se joue deux fois — une fois le matin à l'émergence, une fois l'après-midi quand les femelles reviennent pondre.",
      en: "This is the signal that spring has really arrived: the year's first big caddis, often on the very same day as the Hendrickson. The black swarms over the riffles are hard to miss, but the real action happens twice — once in the morning at emergence, once in the afternoon when the females come back to lay.",
    },
    idMarks: [
      {
        fr: "Adulte brun très foncé à noir, taille 14 à 16, ailes tenues en toit au repos comme tous les trichoptères.",
        en: "A very dark brown to black adult, size 14–16, wings held tent-like at rest like all caddisflies.",
      },
      {
        fr: "Une des premières grosses éclosions de trichoptères, souvent en même temps que le Hendrickson fin avril-début mai.",
        en: "One of the season's first big caddis hatches, often right alongside the Hendrickson in late April–early May.",
      },
      {
        fr: "La larve construit un fourreau conique à quatre faces, fait de fragments de plantes cimentés ensemble — la coupe carrée est le repère le plus rapide, bien différente des fourreaux ronds de galets d'autres trichoptères porteurs de fourreau.",
        en: "The larva builds a four-sided, tapering case cemented from plant fragments — that square cross-section is the fastest tell, quite different from the round, pebble-built cases of many other case-making caddis.",
      },
      {
        fr: "Vols en essaims denses et voletants au-dessus des rapides et de la végétation riveraine au pic de l'éclosion.",
        en: "Dense, fluttering swarms over riffles and streamside vegetation at the peak of the hatch.",
      },
    ],
    confusedWith: {
      fr: "Le Little Black Caddis (Chimarra aterrima), présent à la même période au-dessus des mêmes rapides, mais deux fois plus petit (18-20) — facile à prendre pour un moucheron. Le Grannom, en comparaison, est nettement plus gros et plus facile à identifier à l'œil nu.",
      en: "The Little Black Caddis (Chimarra aterrima), on the water at the same time over the same riffles, but roughly half the size (18–20) — easy to mistake for a midge. The Grannom, by comparison, is clearly bigger and easy to pick out with the naked eye.",
    },
    sections: [
      {
        heading: { fr: "Le fourreau carré", en: "The square case" },
        body: {
          fr: "La larve du Grannom se déplace enfermée dans un fourreau conique à section carrée, fait de petits fragments de plantes cimentés avec de la soie — un détail qui la distingue au premier coup d'œil des trichoptères à fourreau rond ou des espèces qui vivent librement, sans abri. Elle s'en sert pour brouter et filtrer la matière organique fine dans les portions à courant modéré et bien oxygéné.\n\nOn la trouve typiquement collée à la végétation immergée et aux débris ligneux, pas sur la roche nue — c'est là qu'elle trouve à la fois de quoi construire son fourreau et de quoi se nourrir.",
          en: "The Grannom larva moves around sealed inside a tapering, square-cross-section case built from small plant fragments cemented with silk — a detail that sets it apart at a glance from round-cased caddis or species that live free without any shelter. It uses the case while grazing and filtering fine organic matter in moderate, well-oxygenated current.\n\nYou typically find it clinging to submerged vegetation and woody debris rather than bare rock — that is where it finds both its building material and its food.",
        },
      },
      {
        heading: { fr: "Les premières grosses sèches du printemps", en: "Spring's first big dries" },
        body: {
          fr: "Arriver aussi tôt dans la saison a un avantage : peu d'autres gros insectes se disputent l'attention des truites, qui sortent d'un hiver maigre. Contrairement au March Brown qui s'étale au compte-gouttes, le Grannom émerge souvent en vraie vague synchronisée, surtout les matins doux et couverts — ce qui produit des envols massifs et bien visibles.\n\nSur une rivière où le Hendrickson et le Grannom se chevauchent, les deux éclosions peuvent se confondre en une seule montée de truites qui gobent indifféremment l'un ou l'autre — un des rares moments de l'année où le patron compte vraiment moins que d'habitude.",
          en: "Coming this early in the season has an advantage: few other large insects are competing for the attention of trout coming out of a lean winter. Unlike the March Brown's steady trickle, the Grannom often emerges in a genuine synchronized wave, especially on mild, overcast mornings — producing dense, unmistakable flights.\n\nOn a river where Hendrickson and Grannom overlap, the two hatches can blur into one rise of fish taking either indifferently — one of the few times all year the exact pattern matters a little less than usual.",
        },
      },
      {
        heading: { fr: "Le retour en après-midi", en: "The afternoon return" },
        body: {
          fr: "Une fois accouplées, les femelles ne se contentent pas de pondre en tapotant la surface : elles reviennent l'après-midi et plongent ou rampent carrément sous l'eau pour coller leurs œufs sur un support immergé. C'est un comportement qui ouvre une deuxième fenêtre de pêche, distincte de l'émergence du matin.\n\nÀ ce moment-là, les truites guettent autant l'insecte qui nage activement sous la surface que celui qui flotte dessus. Une mouche animée, remuée par petites tirées, imite ce mouvement bien mieux qu'une dérive parfaitement morte.",
          en: "Once mated, the females do not just tap the surface to lay — they come back in the afternoon and actually dive or crawl underwater to glue their eggs onto a submerged surface. That behaviour opens a second fishing window, distinct from the morning emergence.\n\nAt that point trout are watching for the insect swimming actively underwater just as much as the one floating on top. A fly given a little movement — small twitches or strips — imitates that far better than a perfectly dead drift.",
        },
      },
    ],
    stages: [
      {
        label: { fr: "Pupe / émergente", en: "Pupa / emerger" },
        when: { fr: "Le matin, à l'émergence.", en: "Morning, at emergence." },
        how: {
          fr: "Une pupe en dérive montante vers la surface, ou juste sous la pellicule au moment de l'éclosion.",
          en: "A pupa fished on a rising drift toward the surface, or just under the film right at emergence.",
        },
        patternSlugs: ["caddis-pupa"],
      },
      {
        label: { fr: "Adulte", en: "Adult" },
        when: { fr: "Le matin en sèche, l'après-midi pour la ponte.", en: "Dry in the morning, for egg-laying in the afternoon." },
        how: {
          fr: "Une sèche foncée en dérive morte le matin. L'après-midi, une mouche noyée animée en tirées imite la femelle qui plonge pondre — n'importe quelle nymphe verdâtre remuée activement fait la job, elle n'a pas besoin d'être une imitation exacte.",
          en: "A dark dry dead-drifted in the morning. In the afternoon, a wet fly worked with small strips imitates the diving, egg-laying female — any greenish nymph fished with real movement does the job; it does not need to be an exact imitation.",
        },
        patternSlugs: ["black-caddis", "green-rock-worm"],
      },
    ],
  },

  // ----------------------------------------------------------- OCTOBER CADDIS
  {
    hatchId: "october-caddis",
    metaTitle: {
      fr: "Pycnopsyche — l'October Caddis, le dernier gros trichoptère avant l'hiver",
      en: "Pycnopsyche — the October Caddis, the last big caddis before winter",
    },
    metaDescription: {
      fr: "L'October Caddis (Pycnopsyche) au Québec : pourquoi c'est le plus gros trichoptère de l'année, pourquoi il vole en dansant plutôt qu'en ligne droite, et comment le pêcher le long des berges sous-cavées.",
      en: "The October Caddis (Pycnopsyche) in Québec: why it is the year's biggest caddis, why it flies in an erratic flutter rather than a straight line, and how to fish it tight to undercut banks.",
    },
    intro: {
      fr: "C'est le dernier gros repas de la saison. Quand presque tout le reste a fini de voler, ce gros trichoptère orangé sort encore, l'après-midi, le long des berges — et les truites, qui savent que l'hiver approche, ne se font pas prier pour monter dessus.",
      en: "This is the season's last big meal. When almost everything else has stopped flying, this big orange caddis is still coming off, in the afternoon, along the banks — and trout, sensing winter closing in, do not need much convincing to come up for it.",
    },
    idMarks: [
      {
        fr: "Le plus gros trichoptère de l'année : taille 8 à 10.",
        en: "The year's biggest caddis: size 8–10.",
      },
      {
        fr: "Corps orange à orange brûlé, ailes brun-tan tachetées, tenues en toit au repos.",
        en: "Orange to burnt-orange body, mottled tan-brown wings held tent-like at rest.",
      },
      {
        fr: "Vol voletant et un peu maladroit, en petits bonds, très différent du vol direct de la plupart des trichoptères.",
        en: "A fluttering, slightly clumsy flight in short bursts, quite different from the direct flight of most caddis.",
      },
      {
        fr: "Longues antennes filiformes, aussi longues ou plus longues que le corps — un repère qui sépare tout de suite un trichoptère d'un plécoptère ou d'un papillon d'apparence similaire.",
        en: "Long, thread-like antennae as long as or longer than the body — a mark that instantly separates a caddis from a similar-looking stonefly or moth.",
      },
      {
        fr: "La larve construit un fourreau grossier de fragments d'écorce et de feuilles, souvent complété de petits cailloux à l'approche de la nymphose.",
        en: "The larva builds a coarse case of bark and leaf fragments, often finished off with small pebbles as it nears pupation.",
      },
    ],
    confusedWith: {
      fr: "Par sa taille et sa saison, il est pratiquement seul parmi nos trichoptères en octobre. La seule confusion courante vient des dernières phryganes dorées (perles) encore actives : celles-ci replient leurs ailes bien à plat plutôt qu'en toit, portent deux queues et de courtes antennes, plutôt que les longues antennes filiformes du trichoptère.",
      en: "By size and season it is nearly alone among our caddis in October. The one common mix-up is with the season's last golden stoneflies: those fold their wings flat against the body rather than tent-like, carry two tails, and have short antennae rather than the caddis's long, thread-like ones.",
    },
    sections: [
      {
        heading: { fr: "Une larve qui déménage", en: "A larva that keeps moving house" },
        body: {
          fr: "Jeune, la larve construit un fourreau léger de fragments de feuilles dans les portions plus lentes, riches en litière végétale — bordures, embâcles, sous les berges. En vieillissant, à l'approche de la nymphose en fin d'été, elle reconstruit un fourreau plus robuste, souvent renforcé de petits cailloux, et se déplace vers un substrat un peu plus grossier avant de se sceller pour l'hiver.\n\nÇa veut dire que l'habitat change selon la saison : cherchez les jeunes larves dans la litière des berges calmes en été, et les adultes de fin de saison plutôt près des structures et des berges sous-cavées, là où elles ont fini leur développement.",
          en: "As a young larva it builds a light case from leaf fragments in slower, litter-rich stretches — margins, log jams, undercut banks. As it ages toward pupation in late summer, it rebuilds a sturdier case, often reinforced with small pebbles, and shifts toward slightly coarser substrate before sealing itself in for winter.\n\nThat means the habitat shifts with the season: look for young larvae in the leaf litter of quiet margins in summer, and late-season adults closer to structure and undercut banks, where they finished developing.",
        },
      },
      {
        heading: { fr: "La dernière grosse sèche avant l'hiver", en: "The last big dry before winter" },
        body: {
          fr: "À mesure que l'activité des insectes aquatiques ralentit vers l'hiver, ce gros trichoptère reste l'un des derniers repas de belle taille encore disponibles. Les truites, qui n'ont pas la sélectivité pointilleuse d'une éclosion de Trico à régler, montent souvent dessus avec une vraie confiance plutôt qu'en sipant prudemment.\n\nC'est l'inverse presque parfait du Trico : ici, la taille et l'abondance relative de l'insecte comptent plus que la précision du patron.",
          en: "As aquatic insect activity slows down heading into winter, this big caddis remains one of the last sizeable meals still available. Trout, without the pinpoint selectivity a Trico hatch demands, often come up for it with real confidence rather than a cautious sip.\n\nIt is nearly the mirror image of the Trico: here, the insect's size and relative abundance matter more than precision in the pattern.",
        },
      },
      {
        heading: { fr: "Une sèche qui bouge", en: "A dry fly in motion" },
        body: {
          fr: "Dérivez-la serré le long des berges sous-cavées et des structures, là où les truites d'automne se tiennent. Mais gardez en tête que l'adulte naturel continue souvent de voleter et de patiner un peu une fois posé sur l'eau — une dérive parfaitement morte n'est pas toujours ce qui déclenche la touche.\n\nUn petit remous ou un skate discret imite ce comportement, et un Stimulator, flottant et touffu, est justement construit pour ce genre d'animation sans couler.",
          en: "Drift it tight to undercut banks and structure, where autumn trout are holding. But keep in mind that the natural adult often keeps fluttering and skittering a little once it lands on the water — a perfectly dead drift is not always what triggers the take.\n\nA small twitch or a subtle skate imitates that behaviour, and a Stimulator, buoyant and bushy, is built for exactly that kind of movement without sinking.",
        },
      },
    ],
    stages: [
      {
        label: { fr: "Adulte en dérive morte", en: "Adult, dead-drifted" },
        when: { fr: "L'après-midi, le long des berges.", en: "Afternoon, tight to the banks." },
        how: {
          fr: "Une sèche orangée bien flottante, dérivée serré contre les berges sous-cavées et les structures.",
          en: "A high-floating orange dry, drifted tight against undercut banks and structure.",
        },
        patternSlugs: ["elk-wing-caddis"],
      },
      {
        label: { fr: "Adulte animé", en: "Adult, given movement" },
        when: { fr: "Le même après-midi, quand la dérive morte ne suffit pas.", en: "Same afternoon, when the dead drift alone is not enough." },
        how: {
          fr: "Un petit remous ou un skate discret imite le vol voletant de l'insecte une fois posé sur l'eau.",
          en: "A small twitch or a subtle skate imitates the insect's fluttering once it lands on the water.",
        },
        patternSlugs: ["stimulator"],
      },
    ],
  },

  // ----------------------------------------------------------------- SULPHUR
  {
    hatchId: "sulphur",
    metaTitle: {
      fr: "Ephemerella invaria — le Sulphur, la grande éclosion de soirée de juin",
      en: "Ephemerella invaria — the Sulphur, June's big evening hatch",
    },
    metaDescription: {
      fr: "Le Sulphur (Ephemerella invaria) au Québec : pourquoi tant de duns restent pris dans leur mue, et pourquoi l'émergente compte plus que la sèche classique.",
      en: "The Sulphur (Ephemerella invaria) in Québec: why so many duns get stuck half out of their shuck, and why the emerger outfishes the classic dry.",
    },
    intro: {
      fr: "C'est la grande éclosion de soirée de juin, celle qui fait sortir tout le monde sur la rivière entre 19 h et la noirceur. Mais une bonne partie des insectes qui comptent le plus ne flottent jamais vraiment : ils restent coincés à moitié dans leur ancienne peau, et c'est exactement ce détail qui décide quelle mouche fonctionne.",
      en: "This is June's big evening hatch, the one that brings everyone out between 7 p.m. and dark. But a large share of the insects that matter most never really float free — they stay half-stuck in their old nymphal skin, and that single detail decides which fly actually works.",
    },
    idMarks: [
      {
        fr: "Taille 14 à 16, corps jaune pâle à jaune-olive — la couleur « sulphur » classique.",
        en: "Size 14–16, a pale yellow to yellow-olive body — the classic \"sulphur\" colour.",
      },
      {
        fr: "Ailes gris pâle, trois queues.",
        en: "Pale grey wings, three tails.",
      },
      {
        fr: "Émerge de façon fiable en soirée, généralement entre 19 h et 21 h.",
        en: "Emerges reliably in the evening, generally between 7 and 9 p.m.",
      },
      {
        fr: "Nymphe de type « rampante » : robuste sans être aplatie, elle vit dans les herbiers et le gravier des portions à courant modéré et fertile.",
        en: "A \"crawler\"-type nymph: sturdy but not flattened, living among weeds and gravel in moderate, fertile current.",
      },
      {
        fr: "Une grande partie des duns ne se dégagent jamais complètement de leur exuvie et dérivent à moitié pris dedans.",
        en: "A large share of duns never fully clear their nymphal shuck and drift half-trapped inside it.",
      },
    ],
    confusedWith: {
      fr: "Le Pale Evening Dun (Ephemerella dorothea), du même genre : plus petit (16-18 contre 14-16) et il ne sort que dans les vingt dernières minutes de clarté, alors que le Sulphur commence dès 19 h et dure plus longtemps.",
      en: "The Pale Evening Dun (Ephemerella dorothea), from the same genus: smaller (16–18 versus 14–16) and it only comes off in the last twenty minutes of daylight, while the Sulphur starts around 7 p.m. and runs longer.",
    },
    sections: [
      {
        heading: { fr: "Une nymphe rampante, pas une nageuse ni une fouisseuse", en: "A crawler, not a swimmer or a burrower" },
        body: {
          fr: "La nymphe du Sulphur n'a ni le corps aplati d'un insecte de rapide ni le terrier d'un insecte de vase : elle rampe parmi les herbiers aquatiques et le gravier fin, dans des portions à courant modéré et bien fertilisées. C'est un profil intermédiaire, ce qui explique pourquoi on la trouve sur une gamme de types d'eau plus large que la plupart des éphémères de ce chapitre.\n\nCherchez-la dans les longs radiers peu profonds à végétation aquatique, plutôt que dans les rapides les plus rapides ou les fosses les plus lentes.",
          en: "The Sulphur nymph has neither the flattened body of a fast-water insect nor the burrow of a silt-dweller: it crawls among aquatic weeds and fine gravel, in moderate, fertile current. That's an in-between profile, which is why it turns up across a wider range of water types than most of the mayflies in this chapter.\n\nLook for it in long, shallow runs with aquatic vegetation, rather than the fastest riffles or the slowest pools.",
        },
      },
      {
        heading: { fr: "Coincé dans l'exuvie", en: "Stuck in the shuck" },
        body: {
          fr: "C'est le détail qui change tout. Chez le Sulphur, une proportion inhabituellement élevée de duns n'arrive pas à se dégager complètement de leur peau de nymphe au moment de l'émergence. L'insecte reste pris par l'abdomen, à moitié sorti, et dérive ainsi — incapable de voler, incapable de couler.\n\nPour une truite, c'est une proie immobilisée et sans défense pendant beaucoup plus longtemps qu'un dun normal. Résultat : dans une vraie éclosion de Sulphur, une émergente montée avec une exuvie traînante attrape souvent plus de poissons qu'une sèche classique bien tenue sur l'eau, même quand les duns adultes sont visibles partout.",
          en: "This is the detail that changes everything. In the Sulphur, an unusually high share of duns fail to fully clear their nymphal skin at emergence. The insect stays caught by the abdomen, half out, and drifts like that — unable to fly, unable to sink.\n\nTo a trout, that's a helpless, trapped meal available for far longer than a clean dun ever is. The result: in a real Sulphur hatch, an emerger tied with a trailing shuck often out-fishes a perfectly good, high-floating dry, even while adult duns are visible everywhere on the water.",
        },
      },
      {
        heading: { fr: "Le compte à rebours de la lumière", en: "Racing the light" },
        body: {
          fr: "L'éclosion démarre vers 19 h et s'intensifie à mesure que la lumière baisse, pour culminer souvent dans la dernière demi-heure avant la noirceur — exactement le moment où il devient difficile de voir sa mouche. Préparez votre bas de ligne, vos mouches et vos nœuds avant que ça commence : il n'y a pas de temps à perdre une fois que les truites se mettent à monter en série.",
          en: "The hatch starts around 7 p.m. and builds as the light drops, often peaking in the last half hour before dark — exactly when it gets hard to see your fly. Rig your leader, flies and knots before it starts; there is no time to spare once trout begin rising steadily.",
        },
      },
    ],
    stages: [
      {
        label: { fr: "Nymphe", en: "Nymph" },
        when: { fr: "Toute la journée, dans les herbiers et le gravier.", en: "All day, among weeds and gravel." },
        how: {
          fr: "Une nymphe rampante en dérive morte près du fond, dans les portions fertiles à courant modéré.",
          en: "A crawler nymph dead-drifted near bottom, in fertile, moderate current.",
        },
        patternSlugs: ["pheasant-tail-nymph"],
      },
      {
        label: { fr: "Émergente (exuvie traînante)", en: "Emerger (trailing shuck)" },
        when: { fr: "Dès le début de l'éclosion, vers 19 h.", en: "From the start of the hatch, around 7 p.m." },
        how: {
          fr: "Dans la pellicule, immobile ou en dérive très lente. C'est souvent la mouche la plus payante de toute l'éclosion.",
          en: "In the film, motionless or on a very slow drift. This is often the single most productive fly of the whole hatch.",
        },
        patternSlugs: ["sulphur-dun", "partridge-orange"],
      },
    ],
  },

  // ----------------------------------------------------------- SPOTTED SEDGE
  {
    hatchId: "spotted-sedge",
    metaTitle: {
      fr: "Hydropsyche — le Spotted Sedge, le cheval de trait de l'été",
      en: "Hydropsyche — the Spotted Sedge, summer's workhorse",
    },
    metaDescription: {
      fr: "Le Spotted Sedge (Hydropsyche) au Québec : la larve filandière qui ne construit pas de fourreau, et pourquoi un caddis tan 14 fonctionne presque tous les soirs de juin à septembre.",
      en: "The Spotted Sedge (Hydropsyche) in Québec: the net-spinning larva that builds no portable case, and why a tan 14 caddis works almost every evening from June to September.",
    },
    intro: {
      fr: "Si une seule mouche devait rester dans la boîte de l'été, ce serait celle-ci. Présente presque tous les soirs de juin à septembre, cette larve ne construit ni terrier ni fourreau qu'elle transporte : elle tisse un filet fixé aux roches et attend que le courant lui apporte à manger.",
      en: "If only one fly had to stay in the summer box, it would be this one. On the water almost every evening from June to September, this larva builds neither a burrow nor a portable case: it spins a fixed net anchored to the rocks and waits for the current to deliver its meal.",
    },
    idMarks: [
      {
        fr: "Corps et ailes brun tacheté à tan, taille 14 à 16 — le « caddis tan » classique.",
        en: "Tan to mottled-brown body and wings, size 14–16 — the classic \"tan caddis.\"",
      },
      {
        fr: "Longues antennes filiformes, comme tous les trichoptères.",
        en: "Long, thread-like antennae, like all caddisflies.",
      },
      {
        fr: "Présent presque tous les soirs de juin à septembre, plutôt que sur une fenêtre étroite comme la plupart des éclosions.",
        en: "On the water almost every evening from June to September, rather than in a narrow window like most hatches.",
      },
      {
        fr: "La larve ne transporte pas de fourreau : elle tisse une retraite de soie fixe et un filet de capture tendu dans le courant.",
        en: "The larva carries no case: it spins a fixed silk retreat and a capture net stretched across the current.",
      },
      {
        fr: "On la trouve accrochée directement aux roches et aux débris ligneux submergés, dans les portions à courant soutenu.",
        en: "Found clinging directly to rock and submerged woody debris, in stretches with steady current.",
      },
    ],
    confusedWith: {
      fr: "Le Little Sister Sedge (Cheumatopsyche spp.), du même genre de trichoptères filandiers et souvent mêlé au Spotted Sedge sur la même eau — mais nettement plus petit (16-18 contre 14-16). Quand les truites refusent votre 14, descendez d'abord en taille avant de changer de patron.",
      en: "The Little Sister Sedge (Cheumatopsyche spp.), a closely related net-spinning caddis often mixed in on the same water — but clearly smaller (16–18 versus 14–16). When trout refuse your 14, drop the size before you change the pattern.",
    },
    sections: [
      {
        heading: { fr: "Une larve filandière", en: "A net-spinning larva" },
        body: {
          fr: "Contrairement au Grannom, qui transporte un fourreau carré, ou à l'October Caddis, qui en construit un d'écorce, la larve du Spotted Sedge reste au même endroit : elle fixe une retraite de soie à une roche et tisse devant l'entrée un filet qui capture les particules organiques emportées par le courant.\n\nÇa dicte l'habitat très précisément : il faut un courant continu et bien oxygéné pour que le filet fonctionne, donc cherchez-la accrochée aux roches et aux débris ligneux dans les radiers et les veines de courant soutenu — jamais dans l'eau stagnante.",
          en: "Unlike the Grannom, which carries a square case, or the October Caddis, which builds one from bark, the Spotted Sedge larva stays put: it anchors a silk retreat to a rock and spins a net across the entrance that filters organic particles out of the passing current.\n\nThat dictates the habitat precisely: the net needs continuous, well-oxygenated flow to work, so look for it clinging to rock and woody debris in riffles and steady current seams — never in still water.",
        },
      },
      {
        heading: { fr: "Le cheval de trait de l'été", en: "Summer's workhorse" },
        body: {
          fr: "La plupart des éclosions de ce chapitre durent deux à six semaines. Le Spotted Sedge, lui, reste actif plus de quatre mois parce que la population n'émerge pas en une seule cohorte synchronisée : plusieurs générations qui se chevauchent maintiennent des insectes disponibles chaque soir tout l'été.\n\nEn pratique, ça veut dire qu'on n'a jamais vraiment besoin de deviner si « c'est le bon soir » : un caddis tan 14 se justifie n'importe quel soir d'été, ce qui en fait le choix par défaut le plus fiable de toute la saison.",
          en: "Most hatches in this chapter run two to six weeks. The Spotted Sedge stays active for more than four months because the population doesn't emerge as one synchronized cohort — several overlapping generations keep insects available on the water every evening all summer.\n\nIn practice that means you never really have to guess whether \"tonight is the night\": a tan 14 caddis is justified on any summer evening, which makes it the most reliable default choice of the whole season.",
        },
      },
      {
        heading: { fr: "Deux tailles, une rivière", en: "Two sizes, one river" },
        body: {
          fr: "Le Little Sister Sedge partage presque exactement le même habitat et le même horaire, mais dans un format réduit. Sur une même veine, il n'est pas rare de voir les deux mêlés — ce qui explique pourquoi une truite qui refuse un 14 répété prend souvent la même mouche dès qu'elle descend d'un ou deux crans, sans qu'il soit nécessaire de changer de patron du tout.",
          en: "The Little Sister Sedge shares almost exactly the same habitat and schedule, just at a smaller scale. On the same seam it's not unusual to see both mixed together — which is why a trout refusing a repeated 14 will often take the very same pattern once it drops a size or two, with no need to change the fly itself.",
        },
      },
    ],
    stages: [
      {
        label: { fr: "Pupe", en: "Pupa" },
        when: { fr: "En fin de journée, avant l'envol des adultes.", en: "Late in the day, ahead of the adult flights." },
        how: {
          fr: "En dérive montante vers la surface, ou juste sous la pellicule.",
          en: "On a rising drift toward the surface, or just under the film.",
        },
        patternSlugs: ["caddis-pupa"],
      },
      {
        label: { fr: "Adulte", en: "Adult" },
        when: { fr: "Le soir, de juin à septembre.", en: "Evening, June through September." },
        how: {
          fr: "Une sèche tan en dérive morte, avec un léger remous en fin de dérive pour imiter l'insecte qui décolle.",
          en: "A tan dry dead-drifted, with a light twitch at the end of the drift to imitate the insect lifting off.",
        },
        patternSlugs: ["elk-wing-caddis"],
      },
    ],
  },

  // ------------------------------------------------------------ GOLDEN STONE
  {
    hatchId: "golden-stone",
    metaTitle: {
      fr: "Acroneuria — le Golden Stone, la nymphe qui ne nage jamais",
      en: "Acroneuria — the Golden Stone, the nymph that never swims",
    },
    metaDescription: {
      fr: "Le Golden Stone (Acroneuria) au Québec : pourquoi la nymphe vit deux ou trois ans sans jamais nager, pourquoi l'adulte n'émerge jamais sur l'eau, et comment pêcher ce qu'on ne voit jamais éclore.",
      en: "The Golden Stone (Acroneuria) in Québec: why the nymph lives two or three years without ever swimming, why the adult never emerges on the water, and how to fish a hatch you never actually see happen.",
    },
    intro: {
      fr: "C'est notre premier plécoptère de ce chapitre, et il fonctionne selon des règles complètement différentes des éphémères et des trichoptères vus jusqu'ici. Sa nymphe vit deux ou trois ans agrippée aux roches sans jamais nager, et son adulte n'émerge jamais sur l'eau — ce qui veut dire qu'on ne voit littéralement jamais cette « éclosion » se produire.",
      en: "This is the first stonefly in this chapter, and it runs on completely different rules from every mayfly and caddis covered so far. Its nymph lives two or three years clinging to rock without ever swimming, and its adult never emerges on the water — which means this \"hatch\" is one you will literally never watch happen.",
    },
    idMarks: [
      {
        fr: "Gros : taille 6 à 10, une des plus grosses sèches de l'année.",
        en: "Large: size 6–10, one of the biggest dries of the year.",
      },
      {
        fr: "Corps doré à ambré, ailes tachetées repliées bien à plat sur le dos — pas en toit comme un trichoptère.",
        en: "Golden to amber body, mottled wings folded flat against the back — not tent-like as on a caddis.",
      },
      {
        fr: "Deux queues, antennes courtes — l'inverse du trichoptère, qui a de longues antennes et pas de queues visibles.",
        en: "Two tails, short antennae — the opposite of a caddis, which has long antennae and no visible tails.",
      },
      {
        fr: "Nymphe robuste et aplatie, avec des touffes de branchies près des pattes — construite pour s'agripper au fond des rapides les plus froids et les mieux oxygénés.",
        en: "A sturdy, flattened nymph with gill tufts near the legs — built to grip the bottom of the coldest, most oxygenated riffles.",
      },
      {
        fr: "L'adulte sort en rampant complètement hors de l'eau, sur une roche ou une branche, avant de fendre sa peau de nymphe — il n'y a jamais de dun flottant.",
        en: "The adult emerges by crawling entirely out of the water, onto a rock or a branch, before splitting its nymphal skin — there is never a floating dun.",
      },
    ],
    confusedWith: {
      fr: "L'October Caddis, à cause de sa taille et de ses teintes orangées, mais ses ailes tenues en toit et ses longues antennes le trahissent aussitôt. Le Yellow Sally (Isoperla spp.), un autre plécoptère présent à la même période, est nettement plus petit (14-16) et jaune vif plutôt que doré.",
      en: "The October Caddis, thanks to its size and orange tones, but its tented wings and long antennae give it away immediately. The Yellow Sally (Isoperla spp.), another stonefly present at the same time, is clearly smaller (14–16) and bright yellow rather than golden.",
    },
    sections: [
      {
        heading: { fr: "Une nymphe qui ne nage jamais", en: "A nymph that never swims" },
        body: {
          fr: "Contrairement à une nymphe d'éphémère, qui peut nager ou dériver vers la surface, la nymphe de plécoptère se déplace uniquement en rampant. Elle vit agrippée sous les roches des rapides les plus froids et les mieux oxygénés, se nourrissant d'algues, de débris et de petits invertébrés selon son stade.\n\nCette exigence en oxygène en fait un des meilleurs indicateurs de la santé d'une rivière : là où on trouve des plécoptères en abondance, l'eau est propre. Le corollaire est aussi vrai — leur absence sur un secteur autrefois fréquenté vaut la peine d'être notée.",
          en: "Unlike a mayfly nymph, which can swim or drift to the surface, a stonefly nymph moves only by crawling. It lives clinging under rock in the coldest, most oxygenated riffles, feeding on algae, detritus and small invertebrates depending on its stage.\n\nThat oxygen requirement makes it one of the better indicators of a river's health: where stoneflies are abundant, the water is clean. The reverse is worth noting too — their disappearance from a stretch that once held them is a real signal.",
        },
      },
      {
        heading: { fr: "Deux ou trois ans, puis une nuit", en: "Two or three years, then one night" },
        body: {
          fr: "La plupart des insectes de ce chapitre vivent moins d'un an sous l'eau. Le Golden Stone en prend deux ou trois, passant par de nombreuses mues avant d'être prêt. Puis, une nuit d'été, la nymphe quitte l'eau pour de bon — elle rampe hors du courant, sur une roche exposée ou dans la végétation riveraine, et c'est là, à l'air libre, qu'elle fend sa peau et devient adulte.\n\nIl n'y a donc jamais de subimago flottante à observer, et l'émergence elle-même se produit presque toujours hors de la vue, la nuit, loin de l'eau. Ce qu'on pêche n'est jamais l'éclosion — c'est ce qui vient après.",
          en: "Most insects in this chapter live under a year in the water. The Golden Stone takes two or three, passing through many molts before it's ready. Then, on a summer night, the nymph leaves the water for good — it crawls out of the current onto an exposed rock or into streamside vegetation, and there, in open air, splits its skin and becomes an adult.\n\nSo there is never a floating dun to watch for, and the emergence itself almost always happens out of sight, at night, away from the water. What actually gets fished is never the hatch — it's what comes after.",
        },
      },
      {
        heading: { fr: "L'imago qui revient pondre", en: "The adult, coming back to lay" },
        body: {
          fr: "Puisqu'il n'y a rien à intercepter à l'émergence, toute l'occasion de pêche vient de l'adulte qui revient sur l'eau plus tard — une femelle qui pond, ou un insecte maladroit tombé des broussailles riveraines. Une grosse sèche touffue et flottante, animée d'un petit remous, imite bien mieux un adulte en difficulté qu'une dérive parfaitement morte ne le ferait.\n\nLes meilleures fenêtres sont la nuit et les heures de faible luminosité, près des berges broussailleuses où les adultes se rassemblent le jour.",
          en: "Since there's nothing to intercept at emergence, the entire fishing opportunity comes from the adult returning to the water later — an egg-laying female, or a clumsy adult that fell in from streamside brush. A big, bushy, buoyant dry given a small twitch imitates a struggling adult far better than a perfectly dead drift ever would.\n\nThe best windows are night and low light, close to the brushy banks where adults gather during the day.",
        },
      },
    ],
    stages: [
      {
        label: { fr: "Nymphe", en: "Nymph" },
        when: { fr: "Toute l'année — elle est toujours dans le substrat.", en: "Year-round — it's always in the substrate." },
        how: {
          fr: "Une grosse nymphe robuste en dérive morte près du fond, dans les rapides les plus froids. Utile douze mois par année.",
          en: "A large, sturdy nymph dead-drifted near bottom in the coldest riffles. Useful twelve months a year.",
        },
        patternSlugs: ["montana-stone"],
      },
      {
        label: { fr: "Adulte", en: "Adult" },
        when: { fr: "La nuit et en faible luminosité, près des berges broussailleuses.", en: "Night and low light, near brushy banks." },
        how: {
          fr: "Une grosse sèche touffue, animée d'un petit remous, dérivée serré contre la végétation riveraine.",
          en: "A big, bushy dry, given a small twitch, drifted tight against streamside vegetation.",
        },
        patternSlugs: ["stimulator"],
      },
    ],
  },

  // --------------------------------------------------------------- CHIRONOMIDS
  {
    hatchId: "chironomids",
    metaTitle: {
      fr: "Chironomidae — le seul insecte qui tient toute l'année",
      en: "Chironomidae — the only insect that lasts all year",
    },
    metaDescription: {
      fr: "Les chironomes (moucherons) au Québec : pourquoi ils survivent là où rien d'autre ne le peut, pourquoi la pupe suspendue verticalement décide tout, et comment pêcher un insecte minuscule avec précision.",
      en: "Chironomids (midges) in Québec: why they survive where nothing else can, why the vertically hanging pupa decides everything, and how to fish a tiny insect with real precision.",
    },
    intro: {
      fr: "C'est le seul insecte de ce chapitre disponible à l'année, y compris en plein cœur de l'hiver sous la glace. En mars et en novembre, quand rien d'autre n'a encore commencé ou n'est déjà plus là, c'est ça ou rien — et les truites s'en nourrissent avec un sérieux qu'on ne leur voit pas ailleurs.",
      en: "This is the only insect in this chapter available year-round, including in the dead of winter under the ice. In March and November, when nothing else has started yet or is already finished, it's this or nothing — and trout feed on it with a seriousness you don't see anywhere else.",
    },
    idMarks: [
      {
        fr: "Minuscule : taille 18 à 24, parmi les plus petits insectes de tout le chapitre.",
        en: "Tiny: size 18–24, among the smallest insects in this whole chapter.",
      },
      {
        fr: "Plan corporel de mouche vraie : seulement deux ailes, aucune queue — contrairement à tous les autres insectes vus jusqu'ici.",
        en: "A true-fly body plan: only two wings, no tails at all — unlike every other insect covered so far.",
      },
      {
        fr: "La larve (souvent appelée « ver de vase ») vit dans la vase, parfois teintée de rouge par une hémoglobine qui lui permet de survivre en eau pauvre en oxygène.",
        en: "The larva (often called a \"bloodworm\") lives in mud, sometimes tinted red by a hemoglobin that lets it survive in low-oxygen water.",
      },
      {
        fr: "La pupe reste suspendue à la verticale, juste sous la pellicule de surface, souvent de longues minutes avant que l'adulte ne s'en dégage.",
        en: "The pupa hangs vertically, just under the surface film, often for long minutes before the adult breaks free.",
      },
      {
        fr: "Les adultes forment des nuées d'accouplement denses juste au-dessus de l'eau, surtout les jours calmes et doux des saisons intermédiaires.",
        en: "Adults form dense mating swarms just above the water, especially on calm, mild days in the shoulder seasons.",
      },
    ],
    confusedWith: {
      fr: "L'imago du Trico, tout aussi minuscule et aussi souvent en nuée, mais qui garde deux queues bien visibles alors que le chironome n'en a aucune. Une pupe de trichoptère est beaucoup plus grosse et porte quatre ailes en toit plutôt que deux ailes plates.",
      en: "The Trico spinner, just as tiny and just as often swarming, but it keeps two clearly visible tails while a chironomid has none at all. A caddis pupa is much larger and carries four tent-like wings rather than two flat ones.",
    },
    sections: [
      {
        heading: { fr: "Le seul insecte qui tient tout l'hiver", en: "The only insect that lasts all winter" },
        body: {
          fr: "La larve de chironome vit dans la vase et le limon des portions calmes, et chez plusieurs espèces, elle produit une hémoglobine qui lui permet d'extraire de l'oxygène même là où presque rien d'autre ne survit — c'est ce qui lui donne sa teinte rougeâtre de « ver de vase ». Cette tolérance est la raison pour laquelle le chironome reste actif toute l'année, alors que la majorité des insectes de ce chapitre disparaissent complètement une bonne partie de l'année.\n\nLes deux fenêtres de pointe (mi-mars à mi-mai, puis octobre à la mi-novembre) ne sont pas un hasard : ce sont exactement les moments où les truites n'ont rien d'autre à manger, et où le chironome fait toute la différence entre un poisson nourri et un poisson qui ne l'est pas.",
          en: "The chironomid larva lives in the mud and silt of calm stretches, and in several species it produces a hemoglobin that lets it pull oxygen from water where almost nothing else can survive — that's what gives it its reddish \"bloodworm\" colour. That tolerance is the whole reason it stays active year-round, while most of the insects in this chapter vanish entirely for a good part of the year.\n\nThe two peak windows (mid-March to mid-May, then October to mid-November) are no accident: those are exactly the stretches when trout have nothing else to eat, and when a chironomid makes the entire difference between a fed fish and an unfed one.",
        },
      },
      {
        heading: { fr: "La suspension verticale", en: "The vertical hang" },
        body: {
          fr: "Voici le détail qui gouverne toute la pêche au chironome. La pupe nage vers la surface, puis se suspend à la verticale, la tête juste sous la pellicule, parfois de longues minutes avant que l'adulte ne s'en dégage. Elle ne dérive pas, elle ne nage pas activement — elle reste là, immobile, mi-dedans mi-dehors.\n\nC'est exactement ce qui en fait une proie à faible risque et haut rendement pour une truite : immobile, prévisible, disponible longtemps. Une mouche fixe, présentée verticale et immobile dans la pellicule, imite bien mieux ce comportement qu'une dérive à la mode éphémère — et c'est souvent pour cette raison précise que des patrons « parfaits » à l'œil échouent devant des chironomes actifs.",
          en: "Here is the detail that governs all chironomid fishing. The pupa swims toward the surface, then hangs vertically, head just under the film, sometimes for long minutes before the adult breaks free. It doesn't drift, it doesn't swim actively — it just sits there, motionless, half in and half out.\n\nThat is exactly what makes it a low-risk, high-value meal for a trout: still, predictable, available for a long stretch. A fly fished static and vertical in the film imitates that behaviour far better than a mayfly-style drift — and that specific mismatch is often why an otherwise \"perfect\" pattern fails in front of active chironomids.",
        },
      },
      {
        heading: { fr: "Minuscule, donc précis", en: "Tiny, so it's about precision" },
        body: {
          fr: "À taille 18-24, la présentation et la silhouette exacte comptent énormément — le même principe que pour le Trico, mais sur douze mois plutôt que trois. Un bas de ligne fin (6X, parfois 7X) et une pause complète pendant la présentation font souvent plus de différence que le choix précis du patron.\n\nComme le chironome éclot quelque part sur l'eau à peu près tous les jours de l'année, ça vaut la peine d'en garder toujours dans la boîte — pas seulement pour les mois creux, mais pour n'importe quelle journée calme où rien d'autre ne semble se passer.",
          en: "At size 18–24, presentation and exact silhouette matter enormously — the same principle as with the Trico, just stretched across twelve months instead of three. Fine tippet (6X, sometimes 7X) and a genuine pause in the presentation often matter more than the precise pattern chosen.\n\nSince a chironomid hatch is happening somewhere on the water almost every day of the year, it's worth always carrying a few — not just for the lean months, but for any quiet day when nothing else seems to be happening.",
        },
      },
    ],
    stages: [
      {
        label: { fr: "Pupe", en: "Pupa" },
        when: { fr: "Toute l'année, avec des pointes en mars-mai et en octobre-novembre.", en: "Year-round, with peaks in March–May and October–November." },
        how: {
          fr: "Fixe et verticale dans la pellicule, ou sur une dérive lente. Ne l'animez pas — c'est justement son immobilité qui la rend efficace.",
          en: "Static and vertical in the film, or on a slow drift. Don't animate it — its stillness is exactly what makes it work.",
        },
        patternSlugs: ["zebra-midge"],
      },
      {
        label: { fr: "Adulte (amas)", en: "Adult (cluster)" },
        when: { fr: "Les jours calmes et doux, au-dessus de l'eau.", en: "Calm, mild days, just above the water." },
        how: {
          fr: "Un amas de plusieurs adultes plutôt qu'un seul insecte — à cette taille, une imitation isolée est souvent trop discrète pour être vue ou trop délicate à monter.",
          en: "A cluster of several adults rather than a single insect — at this size, a lone imitation is often too faint to see or too fiddly to tie effectively.",
        },
        patternSlugs: ["griffiths-gnat"],
      },
    ],
  },

  // ------------------------------------------------------------ QUILL GORDON
  {
    hatchId: "quill-gordon",
    metaTitle: {
      fr: "Epeorus pluralis — le Quill Gordon, l'éphémère qui éclot sous l'eau",
      en: "Epeorus pluralis — the Quill Gordon, the mayfly that hatches underwater",
    },
    metaDescription: {
      fr: "Identification et pêche du Quill Gordon (Epeorus pluralis) au Québec : pourquoi cette éphémère quitte sa mue de nymphe sous l'eau plutôt qu'en surface, et pourquoi la nymphe qui monte compte plus que le dun.",
      en: "Identifying and fishing the Quill Gordon (Epeorus pluralis) in Québec: why this mayfly splits its nymphal shuck underwater instead of at the surface, and why the rising nymph matters more than the dun.",
    },
    intro: {
      fr: "C'est la première vraie éphémère de l'année, dès que l'eau touche 10 °C — mais c'est aussi une des rares qui n'émerge jamais vraiment en surface. Le Quill Gordon quitte sa peau de nymphe sous l'eau, et le dun qu'on voit flotter a déjà fini l'essentiel du travail avant même de percer la pellicule.",
      en: "This is the first real mayfly of the year, as soon as water touches 10°C — but it's also one of the rare ones that never truly emerges at the surface. The Quill Gordon splits its nymphal shuck underwater, and the dun you see floating has already finished the hard part before it ever breaks the film.",
    },
    idMarks: [
      {
        fr: "Deux queues seulement — la plupart de nos autres éphémères en ont trois, ce qui identifie le genre Epeorus au premier coup d'œil.",
        en: "Only two tails — most of our other mayflies carry three, which identifies the genus Epeorus at a glance.",
      },
      {
        fr: "Corps gris ardoise à brun-rouille, ailes gris fumé tenues bien droites, taille 12-14.",
        en: "Slate-grey to rust-brown body, smoke-grey wings held upright, size 12–14.",
      },
      {
        fr: "Nymphe aplatie et large, accrochée aux roches des rapides propres et rapides — un vrai « clinger ».",
        en: "A broad, flattened nymph clinging to rock in clean, fast riffles — a true \"clinger.\"",
      },
      {
        fr: "Le dun flottant n'a plus de fourreau de nymphe attaché : il a déjà quitté sa mue avant d'atteindre la surface.",
        en: "The floating dun carries no trailing nymphal shuck — it has already shed it before ever reaching the surface.",
      },
    ],
    confusedWith: {
      fr: "Le Hendrickson (Ephemerella subvaria), qui sort à peu près à la même période et à la même taille, mais qui porte trois queues et un corps plus brun-olive sans le ton ardoise. Le Blue Quill (Paraleptophlebia adoptiva), plus petit (16-18) et dans les eaux plus lentes, chevauche parfois la fin de son éclosion.",
      en: "The Hendrickson (Ephemerella subvaria), which comes off around the same time and size, but carries three tails and a browner-olive body without the slate cast. The Blue Quill (Paraleptophlebia adoptiva), smaller (16–18) and in slower water, sometimes overlaps the tail end of its emergence.",
    },
    sections: [
      {
        heading: { fr: "Une émergence sous l'eau", en: "An emergence underwater" },
        body: {
          fr: "Chez la plupart de nos éphémères, la nymphe nage ou dérive jusqu'à la pellicule et c'est là, à la surface, qu'elle fend sa peau pour devenir subimago — ce moment de transition, vulnérable et lent, est justement celui que la truite guette. Le genre Epeorus fait les choses autrement : la nymphe fend sa mue directement sous l'eau, souvent tout près du fond, et c'est déjà un dun ailé, prisonnier d'une bulle de gaz sous sa cuticule, qui remonte vers la surface.\n\nÇa change tout pour le pêcheur. Le moment vulnérable n'est plus à la pellicule — il est sous l'eau, pendant la remontée. Une nymphe ou une émergente pêchée en dérive montante, proche du fond, imite bien mieux ce qui se passe réellement qu'une sèche posée à la surface au bon moment.",
          en: "In most of our mayflies, the nymph swims or drifts up to the film and it's right there, at the surface, that it splits its skin to become a dun — that slow, vulnerable transition is exactly what a trout watches for. The genus Epeorus does it differently: the nymph splits its shuck directly underwater, often close to the bottom, and what rises toward the surface is already a winged dun, trapped in a gas bubble under its old cuticle.\n\nThat changes everything for an angler. The vulnerable moment isn't at the film anymore — it's underwater, during the rise. A nymph or emerger fished on a rising drift near bottom imitates what's actually happening far better than a dry fly perfectly timed at the surface.",
        },
      },
      {
        heading: { fr: "Une nymphe bâtie pour l'eau vive", en: "A nymph built for fast water" },
        body: {
          fr: "Le corps aplati et élargi de la nymphe n'est pas un hasard : c'est une adaptation classique des « clingers », qui réduit la prise du courant et leur permet de rester agrippées aux roches dans les rapides les plus rapides et les mieux oxygénés de la rivière — exactement là où la plupart des autres nymphes ne tiendraient pas.\n\nÇa veut dire chercher le Quill Gordon dans les radiers à fond dur et les têtes de fosse à courant soutenu, jamais dans les baies calmes ou les fonds vaseux. Si le courant n'est pas assez vif pour vous faire perdre pied, il y a de bonnes chances que la nymphe n'y soit pas non plus.",
          en: "The nymph's flattened, widened body is no accident — it's a classic \"clinger\" adaptation that cuts the current's grip and lets it hold tight to rock in the fastest, most oxygenated riffles on the river, exactly where most other nymphs couldn't hang on.\n\nThat means looking for the Quill Gordon in hard-bottomed riffles and the fast-water heads of pools, never in calm bays or silty flats. If the current isn't strong enough to threaten your footing, there's a good chance the nymph isn't there either.",
        },
      },
      {
        heading: { fr: "La première éclosion, sur une eau encore froide", en: "The first hatch, on still-cold water" },
        body: {
          fr: "Dès que l'eau atteint environ 10 °C, généralement mi-avril dans le sud du Québec, le Quill Gordon devient la première vraie fenêtre de pêche à la sèche de l'année. L'éclosion se concentre en après-midi, quand l'eau a eu le temps de se réchauffer de quelques degrés sous le soleil — une truite qui vient de passer l'hiver à se nourrir au fond n'ignore pas cette occasion.\n\nParce que l'émergence a déjà eu lieu sous l'eau, beaucoup de pêcheurs pêchent une sèche « trop tôt » dans la séquence et se demandent pourquoi les touches restent rares malgré des insectes bien visibles en surface. Essayez une nymphe ou une émergente dans la première demi-heure de l'éclosion visible, avant de monter en sèche une fois que les duns s'accumulent vraiment.",
          en: "As soon as the water hits roughly 10°C, usually mid-April in southern Québec, the Quill Gordon becomes the year's first real dry-fly window. The hatch concentrates in the afternoon, once the water has had a few hours of sun to warm it slightly — a trout that just spent the winter feeding on the bottom doesn't pass that up.\n\nBecause the emergence already happened underwater, a lot of anglers fish a dry \"too early\" in the sequence and wonder why takes stay scarce despite visible bugs on top. Try a nymph or emerger through the first half hour of a visible hatch, then move up to a dry once duns are genuinely piling up.",
        },
      },
    ],
    stages: [
      {
        label: { fr: "Nymphe / émergente", en: "Nymph / emerger" },
        when: { fr: "Juste avant et pendant l'éclosion, en après-midi.", en: "Just before and during the hatch, in the afternoon." },
        how: {
          fr: "En dérive montante près du fond, dans les rapides à courant soutenu — c'est là que se joue la vraie émergence.",
          en: "On a rising drift near bottom, in steady-current riffles — that's where the real emergence happens.",
        },
        patternSlugs: ["pheasant-tail-nymph", "bead-head-hares-ear"],
      },
      {
        label: { fr: "Dun", en: "Dun" },
        when: { fr: "En après-midi, une fois les insectes visibles en nombre.", en: "In the afternoon, once bugs are visibly piling up." },
        how: {
          fr: "Une sèche grise en dérive morte, une fois que la truite a clairement basculé vers la surface.",
          en: "A grey dry dead-drifted, once trout have clearly switched their attention to the top.",
        },
        patternSlugs: ["parachute-adams"],
      },
    ],
  },

  // -------------------------------------------------------------- BLUE QUILL
  {
    hatchId: "blue-quill",
    metaTitle: {
      fr: "Paraleptophlebia adoptiva — le Blue Quill, l'éphémère des eaux lentes",
      en: "Paraleptophlebia adoptiva — the Blue Quill, mayfly of the slow water",
    },
    metaDescription: {
      fr: "Identification et pêche du Blue Quill (Paraleptophlebia adoptiva) au Québec : une petite éphémère grise des eaux lentes, qui sort le mieux par temps gris et humide.",
      en: "Identifying and fishing the Blue Quill (Paraleptophlebia adoptiva) in Québec: a small grey mayfly of slow water, at its best on grey, damp afternoons.",
    },
    intro: {
      fr: "Elle passe souvent inaperçue à côté du Quill Gordon, dont elle partage presque le nom sans partager la famille. Le Blue Quill est une petite éphémère discrète des eaux lentes et des marges, qui attend justement les pires journées de printemps — froides, grises, humides — pour sortir en nombre.",
      en: "It often goes unnoticed alongside the Quill Gordon, whose name it nearly shares without sharing its family. The Blue Quill is a small, quiet mayfly of slow water and margins, one that waits for the worst spring days — cold, grey, damp — to come off in real numbers.",
    },
    idMarks: [
      {
        fr: "Petite : taille 16-18, nettement plus fine que le Quill Gordon malgré la ressemblance du nom.",
        en: "Small: size 16–18, distinctly finer than the Quill Gordon despite the similar name.",
      },
      {
        fr: "Corps brun-gris à ardoise, trois queues — contrairement à l'Epeorus, qui n'en a que deux.",
        en: "Grey-brown to slate body, three tails — unlike Epeorus, which carries only two.",
      },
      {
        fr: "Nymphe fine et cylindrique, du type « fouisseuse-rampante », trouvée parmi les débris organiques des courants modérés à lents.",
        en: "A slim, cylindrical \"crawler\" nymph, found among organic debris in moderate to slow current.",
      },
      {
        fr: "Sort en nombre surtout par ciel couvert et air humide — les belles journées ensoleillées produisent une éclosion beaucoup plus discrète.",
        en: "Comes off in numbers mostly under grey skies and damp air — a bright sunny day produces a far thinner hatch.",
      },
    ],
    confusedWith: {
      fr: "Le Black Quill (Leptophlebia cupida), de la même famille (Leptophlebiidae) et actif à la même période, mais nettement plus gros (12-14) et plus foncé. Les deux noms de « Quill » portent à confusion alors qu'ils n'ont rien à voir avec le Quill Gordon, un Heptageniidae d'une tout autre famille.",
      en: "The Black Quill (Leptophlebia cupida), from the same family (Leptophlebiidae) and active at the same time, but clearly larger (12–14) and darker. Both \"Quill\" names invite confusion even though neither is related to the Quill Gordon, a Heptageniidae from an entirely different family.",
    },
    sections: [
      {
        heading: { fr: "Une nymphe de litière, pas de courant vif", en: "A nymph of leaf litter, not fast current" },
        body: {
          fr: "Contrairement à la nymphe aplatie et « agrippante » du Quill Gordon, celle du Blue Quill est fine, cylindrique et bâtie pour ramper plutôt que pour résister au courant. Elle vit parmi les débris organiques, les feuilles mortes accumulées et la végétation submergée des eaux modérées à lentes — un habitat presque à l'opposé du radier à fond dur.\n\nÇa veut dire chercher l'éclosion dans les élargissements calmes, les fosses à courant modéré et les bordures végétalisées plutôt que dans les rapides. Deux éphémères actives à la même date, dans la même rivière, mais rarement au même endroit.",
          en: "Unlike the Quill Gordon's flattened, clinging nymph, the Blue Quill's is slim, cylindrical, and built for crawling rather than resisting current. It lives among organic debris, accumulated dead leaves and submerged vegetation in moderate-to-slow water — nearly the opposite habitat from a hard-bottomed riffle.\n\nThat means looking for the hatch in calm widenings, moderate-current pools and vegetated margins rather than riffles. Two mayflies active on the same date, on the same river, but rarely in the same spot.",
        },
      },
      {
        heading: { fr: "Pourquoi le mauvais temps aide", en: "Why bad weather helps" },
        body: {
          fr: "Une petite éphémère à corps mince perd de l'eau très vite une fois à l'air libre, et le risque de dessèchement pendant le séchage des ailes est réel par temps chaud et sec. Un ciel couvert et un air humide ralentissent cette perte et allongent la fenêtre pendant laquelle l'insecte peut sécher ses ailes en sécurité — ce qui se traduit, à l'échelle de toute la population, par une éclosion plus synchronisée et plus dense.\n\nEn pratique : gardez un œil sur le ciel plus que sur l'horloge. Une après-midi grise et humide de fin avril produit souvent la meilleure sortie de Blue Quill de la saison, alors qu'une journée ensoleillée à la même date peut sembler presque vide.",
          en: "A small, thin-bodied mayfly loses water very quickly once it's out in the open air, and the risk of drying out mid-wing-dry is real on a hot, dry day. An overcast sky and damp air slow that loss and stretch the window during which the insect can dry its wings safely — which, across the whole population, translates into a more synchronized, denser hatch.\n\nIn practice: watch the sky more than the clock. A grey, damp late-April afternoon often produces the season's best Blue Quill emergence, while a sunny day at the same date can look nearly empty.",
        },
      },
      {
        heading: { fr: "Une petite mouche pour une grosse rivière calme", en: "A small fly for a big, quiet river" },
        body: {
          fr: "Parce qu'elle vit dans l'eau lente, le Blue Quill se pêche souvent sur une pellicule presque immobile, où le moindre faux mouvement du bas de ligne se voit. Un bas de ligne fin (5X-6X) et une présentation posée avec soin comptent plus que le choix exact du patron à cette taille.\n\nRestez attentif aux petites bulles d'air et aux légers remous en surface plutôt qu'aux éclaboussures : une gobe sur un insecte de cette taille, dans une eau plate, est souvent discrète.",
          en: "Because it lives in slow water, the Blue Quill is often fished over an almost still film, where the slightest tippet drag shows. Fine tippet (5X–6X) and a carefully placed presentation matter more than the exact pattern at this size.\n\nWatch for small air bubbles and faint surface dimples rather than splashy rises — a take on an insect this small, in flat water, is usually a quiet one.",
        },
      },
    ],
    stages: [
      {
        label: { fr: "Nymphe", en: "Nymph" },
        when: { fr: "Toute la fenêtre d'éclosion, dans les eaux lentes et végétalisées.", en: "Throughout the hatch window, in slow, vegetated water." },
        how: {
          fr: "En dérive lente près du fond, parmi les débris — imitez le déplacement d'une nymphe qui rampe plutôt qu'une dérive rapide.",
          en: "On a slow drift near bottom, among debris — imitate a crawling nymph rather than a fast drift.",
        },
        patternSlugs: ["pheasant-tail-nymph"],
      },
      {
        label: { fr: "Dun", en: "Dun" },
        when: { fr: "L'après-midi, surtout par temps gris et humide.", en: "Afternoon, especially on grey, damp days." },
        how: {
          fr: "Une petite sèche grise, posée avec soin sur une eau plate, avec un bas de ligne fin.",
          en: "A small grey dry, placed carefully on flat water, with fine tippet.",
        },
        patternSlugs: ["parachute-adams"],
      },
    ],
  },

  // ------------------------------------------------------------- BLACK QUILL
  {
    hatchId: "black-quill",
    metaTitle: {
      fr: "Leptophlebia cupida — le Black Quill, l'éphémère des bordures",
      en: "Leptophlebia cupida — the Black Quill, mayfly of the margins",
    },
    metaDescription: {
      fr: "Identification et pêche du Black Quill (Leptophlebia cupida) au Québec : pourquoi cette éphémère sombre des eaux calmes se pêche dans les bordures plutôt qu'au centre du courant.",
      en: "Identifying and fishing the Black Quill (Leptophlebia cupida) in Québec: why this dark mayfly of quiet water is fished at the margins rather than mid-current.",
    },
    intro: {
      fr: "Elle sort presque toujours en même temps que le Hendrickson, ce qui lui a valu d'être largement ignorée — tout le monde regarde le courant principal pendant que le Black Quill émerge tranquillement dans les bordures et les baies calmes juste à côté.",
      en: "It almost always comes off alongside the Hendrickson, which has earned it a reputation for being ignored — everyone watches the main current while the Black Quill quietly emerges in the backwaters and calm bays right beside it.",
    },
    idMarks: [
      {
        fr: "Corps sombre, presque noir-brunâtre, avec des ailes gris foncé fortement teintées — le nom n'exagère pas.",
        en: "Dark, almost blackish-brown body, with heavily tinted dark-grey wings — the name isn't an exaggeration.",
      },
      {
        fr: "Taille 12-14, sensiblement plus grosse que le Blue Quill malgré le nom similaire.",
        en: "Size 12–14, noticeably bigger than the Blue Quill despite the similar name.",
      },
      {
        fr: "Trois queues, corps cylindrique et mince — typique des Leptophlebiidae.",
        en: "Three tails, slim cylindrical body — typical of the Leptophlebiidae.",
      },
      {
        fr: "Nymphe trouvée dans les bordures et les eaux mortes, jamais dans le courant principal — elle rampe vers la rive avant d'éclore.",
        en: "Nymph found in margins and dead water, never in the main current — it crawls shoreward before emerging.",
      },
    ],
    confusedWith: {
      fr: "Le Hendrickson, qui partage presque exactement sa fenêtre et sa taille, mais dont le corps reste brun-olive plutôt que noir-brunâtre et qui émerge dans le courant, pas dans les bordures. Le Blue Quill, plus petit (16-18) et plus pâle, de la même famille.",
      en: "The Hendrickson, which shares almost exactly its window and size, but keeps an olive-brown body rather than blackish-brown and emerges in the current, not the margins. The Blue Quill, smaller (16–18) and paler, from the same family.",
    },
    sections: [
      {
        heading: { fr: "Une migration vers la rive", en: "A migration toward shore" },
        body: {
          fr: "Le détail le plus utile sur cette éphémère n'est pas visuel, c'est comportemental : dans les jours précédant l'éclosion, les nymphes de Black Quill quittent progressivement les zones plus profondes pour se rassembler dans les eaux peu profondes et calmes en bordure — souvent dans quelques centimètres d'eau à peine.\n\nC'est pourquoi l'éclosion elle-même se voit rarement au centre du courant. Elle se passe dans les petites baies, le long des berges herbeuses et dans les remous calmes juste en aval des obstacles — des endroits que la plupart des pêcheurs traversent pour atteindre la veine principale.",
          en: "The most useful thing about this mayfly isn't visual, it's behavioural: in the days before the hatch, Black Quill nymphs gradually leave deeper water and gather in shallow, calm water along the margins — often in just a few centimetres of water.\n\nThat's why the hatch itself is rarely seen mid-current. It happens in small bays, along grassy banks, and in the quiet eddies just below obstructions — exactly the spots most anglers wade through on their way to the main seam.",
        },
      },
      {
        heading: { fr: "Pourquoi tout le monde la manque", en: "Why everyone misses it" },
        body: {
          fr: "Le Hendrickson sort presque à la même date, à la même taille, dans la même rivière — et c'est une éclosion spectaculaire, concentrée sur une heure précise en plein courant. Un pêcheur qui voit des duns brun-olive dans la veine principale suppose naturellement qu'il s'agit tous de Hendricksons, et il n'a pas tort la plupart du temps.\n\nMais si vous regardez les bordures calmes pendant que tout le monde fixe le courant, vous trouverez souvent une population de Black Quill qui éclot sans compétition — et des truites qui s'en nourrissent sans avoir vu une seule mouche artificielle de la journée.",
          en: "The Hendrickson comes off almost the same date, the same size, on the same river — and it's a spectacular hatch, concentrated in a precise one-hour window right in the current. An angler seeing olive-brown duns in the main seam naturally assumes they're all Hendricksons, and is right most of the time.\n\nBut look at the calm margins while everyone else stares at the current, and you'll often find a Black Quill population hatching with zero competition — and trout feeding on it having never seen a single artificial fly all day.",
        },
      },
      {
        heading: { fr: "Pêcher la bordure comme le courant principal", en: "Fishing the margin like the main event" },
        body: {
          fr: "Une baie calme ou une eau morte demande une approche différente d'un radier : pas de courant pour cacher une mauvaise dérive, donc une approche discrète et une présentation posée comptent double. Repérez les gobes légères près de la végétation avant de vous avancer — dans une eau aussi plate, une truite qui vous sent partira sans jamais monter.\n\nUne petite sèche sombre, posée en douceur le long de l'herbe ou d'une branche submergée, imite bien ce dun qui vient d'émerger à quelques centimètres de la rive.",
          en: "A calm bay or dead water asks for a different approach than a riffle: no current to hide a bad drift, so a quiet approach and a soft presentation both count double. Spot the light rises near vegetation before wading in — in water this flat, a trout that senses you will simply never rise.\n\nA small dark dry, placed gently along grass or a submerged branch, imitates well a dun that just emerged a few inches off the bank.",
        },
      },
    ],
    stages: [
      {
        label: { fr: "Nymphe", en: "Nymph" },
        when: { fr: "Dans les jours précédant l'éclosion, en migration vers les bordures peu profondes.", en: "In the days before the hatch, migrating toward shallow margins." },
        how: {
          fr: "Près du fond, en eau peu profonde et calme, tout contre la rive.",
          en: "Near bottom, in shallow calm water, right against the bank.",
        },
        patternSlugs: ["bead-head-hares-ear"],
      },
      {
        label: { fr: "Dun", en: "Dun" },
        when: { fr: "En après-midi, en même temps que le Hendrickson mais dans les bordures.", en: "Afternoon, alongside the Hendrickson but in the margins." },
        how: {
          fr: "Une petite sèche sombre, posée en douceur près de la végétation submergée.",
          en: "A small dark dry, placed gently near submerged vegetation.",
        },
        patternSlugs: ["parachute-adams"],
      },
    ],
  },

  // --------------------------------------------------------------- GREY FOX
  {
    hatchId: "grey-fox",
    metaTitle: {
      fr: "Maccaffertium fuscum — le Grey Fox, le March Brown du soir",
      en: "Maccaffertium fuscum — the Grey Fox, the March Brown's evening half",
    },
    metaDescription: {
      fr: "Identification et pêche du Grey Fox (Maccaffertium fuscum) au Québec : pourquoi ce proche parent du March Brown attend le soir pour éclore, et comment les deux se partagent la même rivière sans jamais vraiment se croiser.",
      en: "Identifying and fishing the Grey Fox (Maccaffertium fuscum) in Québec: why this close relative of the March Brown waits until evening to hatch, and how the two share the same river without ever really overlapping.",
    },
    intro: {
      fr: "Les taxonomistes la considèrent souvent comme une simple forme du March Brown, et génétiquement, la frontière entre les deux est effectivement mince. Mais sur l'eau, ce sont deux insectes différents : plus pâle, plus petit, et surtout, décalé de plusieurs heures dans la journée.",
      en: "Taxonomists often treat it as just a form of the March Brown, and genetically the line between the two really is thin. On the water, though, these are two different insects — paler, smaller, and above all, shifted hours later in the day.",
    },
    idMarks: [
      {
        fr: "Corps crème-tan pâle, nettement plus clair que le brun tacheté du March Brown.",
        en: "Pale cream-tan body, noticeably lighter than the March Brown's mottled brown.",
      },
      {
        fr: "Taille 12-14, un cran plus petite que le March Brown (10-12).",
        en: "Size 12–14, a notch smaller than the March Brown (10–12).",
      },
      {
        fr: "Ailes marbrées mais plus pâles, pattes crème.",
        en: "Mottled wings, but paler, with cream legs.",
      },
      {
        fr: "Sort en fin de journée et en soirée, jamais en pleine après-midi comme son cousin.",
        en: "Comes off late in the day and into the evening, never in full afternoon like its cousin.",
      },
      {
        fr: "Nymphe aplatie de type « clinger », presque identique à celle du March Brown, dans les mêmes radiers rapides.",
        en: "A flattened \"clinger\" nymph, nearly identical to the March Brown's, in the same fast riffles.",
      },
    ],
    confusedWith: {
      fr: "Le March Brown lui-même, dont il est génétiquement si proche que certains taxonomistes ne le traitent pas comme une espèce distincte — fiez-vous d'abord à l'heure de la journée, ensuite à la taille et à la couleur. Le Light Cahill, plus pâle encore et actif un peu plus tard dans l'été, dans les mêmes eaux du soir.",
      en: "The March Brown itself, genetically close enough that some taxonomists don't treat it as a separate species at all — trust the time of day first, then size and colour. The Light Cahill, paler still and active a bit later in summer, in the same evening water.",
    },
    sections: [
      {
        heading: { fr: "Une espèce, ou une heure de la journée", en: "One species, or one time of day" },
        body: {
          fr: "Le March Brown et le Grey Fox partagent la même rivière, le même type de fond et souvent le même genre — au point que la question de savoir s'il s'agit de deux espèces distinctes ou d'une seule avec deux formes reste ouverte chez les taxonomistes. Pour le pêcheur, la distinction la plus fiable n'est pas microscopique, elle est horaire : le March Brown sort en après-midi, le Grey Fox attend la fin de journée et la soirée.\n\nCe genre de partage du temps entre insectes très proches n'est pas un hasard. Deux populations qui exploitent la même ressource — les mêmes radiers, le même fond — réduisent la compétition directe en décalant simplement le moment où elles éclosent.",
          en: "The March Brown and the Grey Fox share the same river, the same bottom type, and often the same genus — enough that whether they're two species or one with two forms remains an open taxonomic question. For an angler, the most reliable distinction isn't microscopic, it's the clock: the March Brown comes off in the afternoon, the Grey Fox waits for late day and evening.\n\nThis kind of time-sharing between closely related insects isn't accidental. Two populations exploiting the same resource — the same riffles, the same bottom — cut down on direct competition simply by shifting when they emerge.",
        },
      },
      {
        heading: { fr: "La même nymphe, la même eau rapide", en: "The same nymph, the same fast water" },
        body: {
          fr: "Sous l'eau, les deux insectes sont presque impossibles à distinguer : une nymphe aplatie, large, agrippée aux roches des radiers rapides et bien oxygénés. Ça veut dire qu'une seule nymphe bien choisie couvre les deux espèces sans qu'il soit nécessaire de deviner laquelle est active.\n\nC'est seulement une fois à la surface, comme adulte, que la différence de couleur et de taille devient utile — et à ce moment-là, l'heure de la journée vous a déjà dit laquelle des deux vous regardez.",
          en: "Underwater, the two insects are almost impossible to tell apart: a broad, flattened nymph clinging to rock in fast, well-oxygenated riffles. That means one well-chosen nymph pattern covers both species without needing to guess which one is active.\n\nIt's only once it's on the surface, as an adult, that the colour and size difference becomes useful — and by then, the time of day has already told you which of the two you're looking at.",
        },
      },
      {
        heading: { fr: "La dernière heure avant la noirceur", en: "The last hour before dark" },
        body: {
          fr: "Le Grey Fox prend le relais exactement quand l'activité du March Brown ralentit, souvent entre 18 h et la noirceur. C'est une fenêtre courte mais fiable, qui coïncide avec la baisse de lumière plutôt qu'avec une heure fixe — elle avance ou recule légèrement selon la saison et la couverture nuageuse.\n\nComme il sort en même temps que d'autres éphémères de soirée sur certaines rivières, une sèche crème-tan de taille 12-14 reste un choix sûr même quand l'identification précise devient difficile dans la lumière tombante.",
          en: "The Grey Fox picks up right as March Brown activity fades, usually somewhere between 6 p.m. and dark. It's a short but reliable window, tied to falling light rather than a fixed hour — it shifts slightly earlier or later depending on the season and cloud cover.\n\nSince it can overlap with other evening mayflies on some rivers, a cream-tan size 12–14 dry stays a safe bet even when precise identification gets hard in fading light.",
        },
      },
    ],
    stages: [
      {
        label: { fr: "Nymphe", en: "Nymph" },
        when: { fr: "Toute la journée, dans les radiers rapides — indistincte de celle du March Brown.", en: "All day, in fast riffles — indistinguishable from the March Brown's." },
        how: {
          fr: "Près du fond, dans le courant soutenu, en dérive naturelle.",
          en: "Near bottom, in steady current, on a natural drift.",
        },
        patternSlugs: ["march-brown"],
      },
      {
        label: { fr: "Dun", en: "Dun" },
        when: { fr: "Fin de journée et soirée, quand le March Brown ralentit.", en: "Late day and evening, as the March Brown activity fades." },
        how: {
          fr: "Une sèche crème-tan, taille 12-14, en dérive morte dans la lumière tombante.",
          en: "A cream-tan dry, size 12–14, dead-drifted in fading light.",
        },
        patternSlugs: ["light-cahill"],
      },
    ],
  },

  // ------------------------------------------------------- PALE EVENING DUN
  {
    hatchId: "pale-evening-dun",
    metaTitle: {
      fr: "Ephemerella dorothea — le Pale Evening Dun, les vingt dernières minutes",
      en: "Ephemerella dorothea — the Pale Evening Dun, the last twenty minutes",
    },
    metaDescription: {
      fr: "Identification et pêche du Pale Evening Dun (Ephemerella dorothea) au Québec : le petit cousin du Sulphur qui attend la toute dernière lumière du jour pour éclore.",
      en: "Identifying and fishing the Pale Evening Dun (Ephemerella dorothea) in Québec: the Sulphur's small cousin, waiting for the very last light of the day to hatch.",
    },
    intro: {
      fr: "Le Sulphur a déjà fini de monter quand celle-ci commence. Le Pale Evening Dun est son petit cousin, plus pâle et plus fin, qui attend délibérément les vingt dernières minutes de lumière avant de sortir — une fenêtre si courte qu'il faut être prêt avant de ne plus rien voir.",
      en: "The Sulphur has already finished its rise by the time this one starts. The Pale Evening Dun is its smaller, paler cousin, one that deliberately waits for the last twenty minutes of light before coming off — a window so short you need to be ready before you can no longer see.",
    },
    idMarks: [
      {
        fr: "Petite : taille 16-18, sensiblement plus fine que le Sulphur (14-16).",
        en: "Small: size 16–18, distinctly finer than the Sulphur (14–16).",
      },
      {
        fr: "Corps jaune très pâle, presque crème, plus délavé que le jaune-soufre franc du Sulphur.",
        en: "Very pale yellow body, almost cream, washed out compared to the Sulphur's true sulphur-yellow.",
      },
      {
        fr: "Même genre Ephemerella que le Sulphur — même silhouette générale, en plus petit et plus pâle.",
        en: "Same genus, Ephemerella, as the Sulphur — same general silhouette, just smaller and paler.",
      },
      {
        fr: "Sort exactement à la brunante, souvent dans les vingt dernières minutes de clarté utilisable.",
        en: "Comes off right at dusk, often in the last twenty minutes of usable light.",
      },
    ],
    confusedWith: {
      fr: "Le Sulphur lui-même, dont il partage le genre — la taille et l'heure tranchent : le Sulphur commence vers 19 h en gros insectes, le Pale Evening Dun attend la toute fin du jour en format réduit. La petite Blue-Winged Olive, active toute la saison, reste plus verte que jaune.",
      en: "The Sulphur itself, which shares its genus — size and timing settle it: the Sulphur starts around 7 p.m. in a bigger size, the Pale Evening Dun waits for the very end of the day in a smaller one. The small Blue-Winged Olive, active all season, stays greener than yellow.",
    },
    sections: [
      {
        heading: { fr: "Le petit cousin du Sulphur", en: "The Sulphur's small cousin" },
        body: {
          fr: "Ephemerella dorothea et Ephemerella invaria (le Sulphur) partagent le même genre, la même silhouette générale et presque la même rivière — mais la première sort systématiquement plus tard et plus petite que la seconde. Sur une soirée de juin, il n'est pas rare de voir le Sulphur finir sa montée pendant que le Pale Evening Dun commence tout juste la sienne.\n\nCe décalage n'est pas dû au hasard : deux espèces très proches, qui exploitent le même type d'eau, réduisent leur compétition directe en émergeant à des moments légèrement différents de la même fenêtre de soirée.",
          en: "Ephemerella dorothea and Ephemerella invaria (the Sulphur) share a genus, a general silhouette, and nearly the same river — but the first one consistently comes off later and smaller than the second. On a June evening it's not unusual to watch the Sulphur's rise wind down just as the Pale Evening Dun's is getting started.\n\nThat gap isn't accidental: two closely related species exploiting the same kind of water cut down on direct competition by emerging at slightly different points in the same evening window.",
        },
      },
      {
        heading: { fr: "Pourquoi la toute dernière lumière", en: "Why the very last light" },
        body: {
          fr: "Émerger à la brunante plutôt qu'en pleine lumière du jour réduit la pression des prédateurs visuels — oiseaux insectivores, surtout — sans exiger l'attente jusqu'à la pleine noirceur comme le fait l'Hexagenia. C'est une fenêtre de compromis : assez sombre pour être plus sûre, encore assez claire pour qu'un insecte de cette taille arrive à s'orienter.\n\nLe problème, c'est que cette fenêtre dure à peine vingt minutes, et qu'elle se referme vite une fois entamée.",
          en: "Emerging at dusk rather than in full daylight cuts pressure from visual predators — insect-eating birds especially — without requiring the wait until full dark the way Hexagenia does. It's a compromise window: dark enough to be safer, still light enough for an insect this size to find its way.\n\nThe catch is that window barely lasts twenty minutes, and it closes fast once it opens.",
        },
      },
      {
        heading: { fr: "Se préparer avant de ne plus voir", en: "Rig up before you can't see" },
        body: {
          fr: "Avec une fenêtre aussi courte, il n'y a pas de temps pour changer de bas de ligne ou fouiller la boîte à mouches une fois l'éclosion commencée. Montez votre pointe fine, choisissez votre mouche et repérez votre poste pendant qu'il fait encore clair — puis attendez.\n\nUne fois la brunante installée, fiez-vous davantage au bruit de la gobe et à la position connue de votre mouche qu'à ce que vous pouvez réellement voir flotter sur l'eau.",
          en: "With a window that short, there's no time to change tippet or dig through the fly box once the hatch actually starts. Rig your fine tippet, pick your fly, and read your lie while it's still light — then wait.\n\nOnce dusk sets in, trust the sound of the rise and where you know your fly to be more than what you can actually see riding the water.",
        },
      },
    ],
    stages: [
      {
        label: { fr: "Nymphe / émergente", en: "Nymph / emerger" },
        when: { fr: "En fin d'après-midi, dans les courants modérés.", en: "Late afternoon, in moderate current." },
        how: {
          fr: "Près du fond puis en dérive montante à l'approche de la brunante.",
          en: "Near bottom, then on a rising drift as dusk approaches.",
        },
        patternSlugs: ["partridge-orange"],
      },
      {
        label: { fr: "Dun", en: "Dun" },
        when: { fr: "Les vingt dernières minutes de lumière utilisable.", en: "The last twenty minutes of usable light." },
        how: {
          fr: "Une petite sèche pâle, montée et repérée avant que la lumière ne manque tout à fait.",
          en: "A small pale dry, rigged and spotted before the light gives out entirely.",
        },
        patternSlugs: ["sulphur-dun"],
      },
    ],
  },

  // ------------------------------------------------------------ BROWN DRAKE
  {
    hatchId: "brown-drake",
    metaTitle: {
      fr: "Ephemera simulans — le Brown Drake, l'explosion juste avant la noirceur",
      en: "Ephemera simulans — the Brown Drake, the explosion right before dark",
    },
    metaDescription: {
      fr: "Identification et pêche du Brown Drake (Ephemera simulans) au Québec : le cousin fouisseur du Green Drake, sur fond de sable, dans une éclosion brève et explosive.",
      en: "Identifying and fishing the Brown Drake (Ephemera simulans) in Québec: the Green Drake's burrowing cousin, over sand bottom, in a brief, explosive hatch.",
    },
    intro: {
      fr: "Le Green Drake a sa réputation. Son cousin plus foncé, lui, passe presque inaperçu — parce que toute son éclosion tient dans une poignée de minutes explosives juste avant la noirceur, sur des fonds de sable que la plupart des pêcheurs ne remarquent même pas.",
      en: "The Green Drake gets the reputation. Its darker cousin goes almost unnoticed — because its entire hatch fits into a handful of explosive minutes right before dark, over sand bottoms most anglers never even clock.",
    },
    idMarks: [
      {
        fr: "Grosse éphémère, taille 10-12, corps brun-tan nettement plus foncé que le Green Drake.",
        en: "A big mayfly, size 10–12, brown-tan body noticeably darker than the Green Drake.",
      },
      {
        fr: "Trois queues, ailes marbrées crème-tan.",
        en: "Three tails, cream-tan mottled wings.",
      },
      {
        fr: "Nymphe fouisseuse avec défenses et branchies plumeuses, comme l'Hexagenia — mais dans le sable et le gravier fin plutôt que la vase profonde.",
        en: "A burrowing nymph with tusks and feathery gills, like Hexagenia — but in sand and fine gravel rather than deep silt.",
      },
      {
        fr: "Éclot en une explosion brève juste avant la noirceur, et c'est terminé presque aussitôt commencé.",
        en: "Hatches in one short burst right before dark, and it's over almost as soon as it starts.",
      },
    ],
    confusedWith: {
      fr: "Le Green Drake (Ephemera guttulata), même famille et même genre, mais plus pâle, plus verdâtre et généralement un peu plus grosse, sur du gravier plutôt que du sable. Les deux éclosions se chevauchent en juin sur certaines rivières.",
      en: "The Green Drake (Ephemera guttulata), same family and genus, but paler, greener and generally a touch bigger, over gravel rather than sand. The two hatches overlap in June on some rivers.",
    },
    sections: [
      {
        heading: { fr: "Le genre fouisseur, version sable", en: "The burrowing genus, sand edition" },
        body: {
          fr: "Le Brown Drake appartient au même genre Ephemera que le Green Drake et l'Hexagenia : une nymphe fouisseuse, munie de défenses pour creuser et de branchies plumeuses pour faire circuler l'eau dans son terrier. Mais là où l'Hexagenia exige une vase profonde et le Green Drake un gravier fin, le Brown Drake se contente de sable et de gravier très fin — un habitat un peu plus tolérant, qu'on trouve dans des veines légèrement plus rapides que celles de ses cousins.\n\nCherchez-le dans les élargissements à fond sablonneux, souvent juste en aval d'un radier plutôt que dans les fosses profondes et lentes typiques de l'Hexagenia.",
          en: "The Brown Drake shares the genus Ephemera with the Green Drake and Hexagenia: a burrowing nymph, equipped with digging tusks and feathery gills to circulate water through its burrow. But where Hexagenia needs deep silt and the Green Drake needs fine gravel, the Brown Drake settles for sand and very fine gravel — a slightly more tolerant habitat, found in seams a touch faster than its cousins prefer.\n\nLook for it in sandy-bottomed widenings, often just downstream of a riffle rather than in the deep, slow pools typical of Hexagenia water.",
        },
      },
      {
        heading: { fr: "Une éclosion explosive et brève", en: "A short, explosive hatch" },
        body: {
          fr: "Contrairement à un caddis qui trickle toute la soirée, le genre Ephemera émerge en masse et de façon fortement synchronisée : des milliers de nymphes quittent leur terrier presque au même moment, souvent dans les dix à vingt minutes précédant la noirceur.\n\nCette synchronisation dilue le risque pour chaque insecte individuel — trop de proies en même temps pour que les prédateurs en profitent toutes — mais elle laisse au pêcheur une fenêtre extrêmement courte. Ratez ces vingt minutes et l'éclosion du soir est terminée, pas seulement ralentie.",
          en: "Unlike a caddis that trickles off all evening, the genus Ephemera emerges in a mass, tightly synchronized burst: thousands of nymphs leave their burrows almost at once, often in the ten to twenty minutes before dark.\n\nThat synchrony dilutes the risk for any one insect — too much prey at once for predators to make a dent — but it leaves an angler an extremely short window. Miss those twenty minutes and the evening's hatch isn't just slower, it's over.",
        },
      },
      {
        heading: { fr: "Le cousin qui arrive un peu plus tard", en: "The cousin that shows up a bit later" },
        body: {
          fr: "Sur une rivière où les deux se chevauchent, le Green Drake a tendance à sortir un peu plus tôt en soirée que le Brown Drake, qui attend que la lumière soit vraiment basse. La couleur et le fond aident à trancher : plus pâle et sur gravier, c'est probablement le Green Drake ; plus foncé et sur sable, plus tard dans la soirée, c'est le Brown Drake.\n\nDans la pratique, la distinction compte moins que d'être sur l'eau et prêt au bon moment — les deux se pêchent essentiellement de la même façon.",
          en: "On a river where both overlap, the Green Drake tends to come off a bit earlier in the evening than the Brown Drake, which waits until light is genuinely low. Colour and bottom type help sort them out: paler and over gravel, it's probably the Green Drake; darker and over sand, later in the evening, it's the Brown Drake.\n\nIn practice the distinction matters less than being on the water and ready at the right moment — the two fish almost identically.",
        },
      },
    ],
    stages: [
      {
        label: { fr: "Nymphe", en: "Nymph" },
        when: { fr: "Dans l'heure précédant la noirceur, sur fond de sable et de gravier fin.", en: "In the hour before dark, over sand and fine gravel." },
        how: {
          fr: "Près du fond, en remontée lente à l'approche de l'explosion d'éclosion.",
          en: "Near bottom, on a slow lift as the emergence burst approaches.",
        },
        patternSlugs: ["march-brown"],
      },
      {
        label: { fr: "Dun", en: "Dun" },
        when: { fr: "Une fenêtre brève, juste avant la noirceur.", en: "A short window, right before dark." },
        how: {
          fr: "Une grosse sèche brun-tan, prête avant que l'explosion ne commence — il n'y aura pas de temps pour improviser.",
          en: "A big brown-tan dry, ready before the burst begins — there won't be time to improvise once it starts.",
        },
        patternSlugs: ["green-drake"],
      },
    ],
  },

  // ------------------------------------------------------------- GREY DRAKE
  {
    hatchId: "grey-drake",
    metaTitle: {
      fr: "Siphlonurus spp. — le Grey Drake, l'éclosion qu'on ne voit jamais",
      en: "Siphlonurus spp. — the Grey Drake, the hatch you never actually see",
    },
    metaDescription: {
      fr: "Identification et pêche du Grey Drake (Siphlonurus spp.) au Québec : une nymphe nageuse qui sort de l'eau pour éclore, et pourquoi c'est la retombée des imagos, pas l'éclosion, qui compte.",
      en: "Identifying and fishing the Grey Drake (Siphlonurus spp.) in Québec: a swimming nymph that crawls ashore to hatch, and why the spinner fall, not the hatch, is what actually matters.",
    },
    intro: {
      fr: "C'est une éphémère dont vous ne verrez presque jamais l'éclosion, peu importe le temps passé au bord de l'eau. La nymphe du Grey Drake rampe sur la rive pour se transformer, loin de l'eau et de vos yeux — toute l'occasion de pêche vient plus tard, quand les imagos reviennent pondre.",
      en: "This is a mayfly whose hatch you will almost never see, no matter how much time you spend streamside. The Grey Drake nymph crawls out on the bank to transform, well away from the water and your eyes — the entire fishing opportunity comes later, when the spinners return to lay.",
    },
    idMarks: [
      {
        fr: "Grosse éphémère grise, taille 10-12, corps et ailes teintés de gris uniforme.",
        en: "A large grey mayfly, size 10–12, body and wings in a uniform grey cast.",
      },
      {
        fr: "Longues queues, corps effilé — construite pour nager, pas pour s'agripper.",
        en: "Long tails, a slim tapered body — built for swimming, not clinging.",
      },
      {
        fr: "Nymphe nageuse agile, dans les eaux lentes, les baies et les bordures herbeuses des lacs — jamais dans le courant vif.",
        en: "An agile swimming nymph, in slow water, bays and grassy lake margins — never in fast current.",
      },
      {
        fr: "La nymphe quitte l'eau et rampe sur la végétation ou les roches de la rive pour éclore.",
        en: "The nymph leaves the water and crawls out onto shoreline vegetation or rock to emerge.",
      },
    ],
    confusedWith: {
      fr: "Le Slate Drake (Isonychia bicolor), aussi gris et de taille similaire, mais un nageur d'eau vive plutôt que d'eau calme — les deux vivent dans des mondes différents malgré l'allure comparable. Assurez-vous d'abord du type d'eau avant de vous fier à la seule couleur.",
      en: "The Slate Drake (Isonychia bicolor), also grey and similar in size, but a fast-water swimmer rather than a slow-water one — the two live in different worlds despite a comparable look. Check the type of water first, before trusting colour alone.",
    },
    sections: [
      {
        heading: { fr: "Une nageuse qui sort à terre", en: "A swimmer that leaves the water to emerge" },
        body: {
          fr: "La plupart des éphémères de ce chapitre émergent d'une façon ou d'une autre sur l'eau — à la surface, sous la pellicule, ou tout près. Le genre Siphlonurus fait exception : c'est une nageuse rapide et agile, capable de filer sur de bonnes distances dans l'eau libre, mais qui choisit néanmoins de ramper hors de l'eau, sur la végétation riveraine ou une roche exposée, pour y devenir subimago.\n\nCe comportement est plus proche de celui d'un plécoptère que de la plupart des éphémères — une bonne raison de ne jamais présumer qu'un insecte donné se comporte « comme une éphémère typique » sans vérifier.",
          en: "Most mayflies in this chapter emerge on the water in one way or another — at the surface, under the film, or close to it. The genus Siphlonurus is the exception: a fast, agile swimmer capable of covering real distance in open water, yet one that still chooses to crawl out onto streamside vegetation or an exposed rock to become a dun.\n\nThat behaviour has more in common with a stonefly than with most mayflies — good reason never to assume any given insect acts \"like a typical mayfly\" without checking.",
        },
      },
      {
        heading: { fr: "Pourquoi on ne voit jamais l'éclosion", en: "Why you never see the hatch" },
        body: {
          fr: "Puisque la transformation se produit hors de l'eau, souvent dissimulée dans la végétation, il n'y a rien à intercepter au moment de l'émergence elle-même — pas de nymphe qui monte en surface, pas de dun qui sèche ses ailes sur la pellicule. Le pêcheur qui attend une « éclosion visible » sur cette espèce attendra pour rien.\n\nToute la logique de la pêche change en conséquence : ce n'est pas l'insecte en transformation qui compte, mais l'adulte déjà formé qui revient plus tard.",
          en: "Since the transformation happens out of the water, often hidden in vegetation, there's nothing to intercept at the moment of emergence itself — no nymph rising to the film, no dun drying its wings on the surface. An angler waiting for a \"visible hatch\" on this species will wait for nothing.\n\nThe whole fishing logic shifts as a result: it isn't the insect mid-transformation that matters, it's the fully formed adult coming back later.",
        },
      },
      {
        heading: { fr: "La retombée, la vraie occasion", en: "The spinner fall, the real event" },
        body: {
          fr: "Les imagos reviennent au-dessus de l'eau en soirée pour l'accouplement et la ponte, et c'est cette retombée d'imagos morts ou mourants, étalés à plat sur l'eau, qui déclenche l'intérêt sérieux de la truite. Cherchez les remous calmes et les bordures — les mêmes endroits où la nageuse vivait — plutôt que le centre du courant.\n\nUne imitation de spinner étalée, présentée en dérive morte dans ces zones tranquilles, imite bien mieux ce qui se passe réellement qu'une sèche montée haut sur l'eau.",
          en: "Adults return over the water in the evening to mate and lay, and it's that fall of dead and dying spinners, spread flat on the surface, that triggers serious trout interest. Look to calm eddies and margins — the same water the swimming nymph lived in — rather than mid-current.\n\nA spent-spinner pattern, dead-drifted through those quiet zones, imitates what's actually happening far better than a fly riding high on the water.",
        },
      },
    ],
    stages: [
      {
        label: { fr: "Nymphe", en: "Nymph" },
        when: { fr: "Toute la saison, dans l'eau lente et végétalisée.", en: "All season, in slow, vegetated water." },
        how: {
          fr: "En dérive active, imitant une nageuse agile plutôt qu'une dérive passive.",
          en: "On an active retrieve, imitating an agile swimmer rather than a passive drift.",
        },
        patternSlugs: ["slate-drake"],
      },
      {
        label: { fr: "Retombée (spinner)", en: "Spinner fall" },
        when: { fr: "En soirée, sur l'eau calme et les bordures.", en: "Evening, over calm water and margins." },
        how: {
          fr: "Une imitation étalée, en dérive morte dans les remous et les baies tranquilles.",
          en: "A spent pattern, dead-drifted through eddies and quiet bays.",
        },
        patternSlugs: ["parachute-adams"],
      },
    ],
  },

  // -------------------------------------------------------------- PINK LADY
  {
    hatchId: "pink-lady",
    metaTitle: {
      fr: "Epeorus vitreus — le Pink Lady, la femelle qui trahit son genre",
      en: "Epeorus vitreus — the Pink Lady, the female that gives away her genus",
    },
    metaDescription: {
      fr: "Identification et pêche du Pink Lady (Epeorus vitreus) au Québec : pourquoi la femelle seule porte le rose qui donne son nom à l'espèce, et sa parenté avec le Quill Gordon.",
      en: "Identifying and fishing the Pink Lady (Epeorus vitreus) in Québec: why only the female carries the pink wash that gives the species its name, and its kinship with the Quill Gordon.",
    },
    intro: {
      fr: "Le mâle et la femelle de cette éphémère ne se ressemblent presque pas, et c'est la femelle — plus grosse, à l'abdomen rosé — qui a donné son nom à l'espèce. C'est aussi une proche cousine du Quill Gordon, du même genre Epeorus, avec le même secret : elle émerge déjà sous l'eau.",
      en: "The male and female of this mayfly barely look alike, and it's the female — bigger, with a rose-washed abdomen — who gave the species its name. It's also a close cousin of the Quill Gordon, same genus Epeorus, carrying the same secret: it emerges already underwater.",
    },
    idMarks: [
      {
        fr: "La femelle porte un abdomen lavé de rose-saumon, unique parmi nos éphémères.",
        en: "The female carries a salmon-pink washed abdomen, unique among our mayflies.",
      },
      {
        fr: "Le mâle est beaucoup plus pâle, olive-tan, et pourrait presque passer pour une autre espèce si on ne connaît que la femelle.",
        en: "The male is far paler, olive-tan, and could almost pass for a different species if you only know the female.",
      },
      {
        fr: "Deux queues seulement — même genre Epeorus que le Quill Gordon.",
        en: "Only two tails — same genus, Epeorus, as the Quill Gordon.",
      },
      {
        fr: "Taille 14-16, dans l'eau vive et bien oxygénée, en soirée.",
        en: "Size 14–16, in fast, well-oxygenated water, in the evening.",
      },
    ],
    confusedWith: {
      fr: "Le Sulphur, avec qui elle se mêle souvent sur la même eau de soirée — mais le Sulphur porte trois queues et jamais le lavis rosé. Le Quill Gordon, même genre, mais plus tôt en saison et sans la teinte rose.",
      en: "The Sulphur, with which it often mixes on the same evening water — but the Sulphur carries three tails and never the pink wash. The Quill Gordon, same genus, but earlier in the season and without the pink cast.",
    },
    sections: [
      {
        heading: { fr: "Même genre, même truc sous l'eau", en: "Same genus, same underwater trick" },
        body: {
          fr: "Le Pink Lady partage le genre Epeorus avec le Quill Gordon, et donc le même mécanisme d'émergence : la nymphe fend sa mue sous l'eau plutôt qu'à la surface, et c'est déjà un dun ailé qui remonte. Comme pour son cousin de printemps, ça déplace le moment vulnérable de la pellicule vers la remontée — une nymphe ou une émergente pêchée en profondeur, avant que les duns n'apparaissent en surface, reste souvent le choix le plus productif.",
          en: "The Pink Lady shares the genus Epeorus with the Quill Gordon, and with it the same emergence trick: the nymph splits its shuck underwater rather than at the surface, and what rises is already a winged dun. As with its spring cousin, that moves the vulnerable moment from the film to the rise — a nymph or emerger fished deep, before duns show up on top, often stays the most productive choice.",
        },
      },
      {
        heading: { fr: "Pourquoi la femelle seule est rose", en: "Why only the female is pink" },
        body: {
          fr: "Chez plusieurs espèces d'éphémères, le mâle et la femelle divergent en couleur et en taille — un vrai dimorphisme sexuel, pas une simple variation individuelle. Le mâle, dont le rôle principal est de former des essaims nuptiaux bien visibles pour attirer une partenaire, reste souvent plus pâle et plus effilé. La femelle, qui porte les œufs, est généralement plus grosse et plus colorée.\n\nChez le Pink Lady, cette différence est particulièrement frappante : le lavis rosé de l'abdomen féminin n'a pas d'équivalent chez le mâle, au point qu'un pêcheur qui ne connaît que l'un des deux sexes pourrait croire à deux espèces distinctes.",
          en: "In several mayfly species, males and females diverge in colour and size — genuine sexual dimorphism, not just individual variation. The male, whose main job is forming a visible mating swarm to attract a partner, tends to stay paler and slimmer. The female, who carries the eggs, is usually bigger and more coloured.\n\nIn the Pink Lady that difference is especially striking: the female's pink abdominal wash has no real equivalent on the male, to the point that an angler who only knows one sex could mistake them for two different species.",
        },
      },
      {
        heading: { fr: "Mêlée aux sulphurs", en: "Mixed in with the sulphurs" },
        body: {
          fr: "Le Pink Lady partage son horaire de soirée et souvent sa rivière avec le Sulphur, ce qui rend l'identification en vol difficile dans la lumière tombante. Le nombre de queues (deux contre trois) tranche à coup sûr, mais demande un coup d'œil rapproché.\n\nEn pratique, cherchez le Pink Lady spécifiquement dans les veines les plus vives et les mieux oxygénées — son besoin en oxygène du genre Epeorus la limite à une eau plus rapide que ce que le Sulphur tolère facilement.",
          en: "The Pink Lady shares its evening schedule, and often its river, with the Sulphur, which makes on-the-wing identification hard in fading light. Tail count (two versus three) settles it for certain, but takes a close look.\n\nIn practice, look for the Pink Lady specifically in the fastest, best-oxygenated seams — its genus Epeorus oxygen requirement keeps it in swifter water than the Sulphur comfortably tolerates.",
        },
      },
    ],
    stages: [
      {
        label: { fr: "Nymphe / émergente", en: "Nymph / emerger" },
        when: { fr: "En fin d'après-midi, dans l'eau vive et oxygénée.", en: "Late afternoon, in fast, oxygenated water." },
        how: {
          fr: "En dérive montante près du fond, comme pour le Quill Gordon.",
          en: "On a rising drift near bottom, same as the Quill Gordon.",
        },
        patternSlugs: ["light-cahill"],
      },
      {
        label: { fr: "Dun", en: "Dun" },
        when: { fr: "En soirée, souvent mêlée aux sulphurs.", en: "Evening, often mixed in with the sulphurs." },
        how: {
          fr: "Une sèche crème à rosée en dérive morte dans les veines les plus vives.",
          en: "A cream-to-pink dry dead-drifted through the fastest seams.",
        },
        patternSlugs: ["sulphur-dun"],
      },
    ],
  },

  // ----------------------------------------------------------- LIGHT CAHILL
  {
    hatchId: "light-cahill",
    metaTitle: {
      fr: "Stenacron interpunctatum — le Light Cahill, la mouche crème de juillet",
      en: "Stenacron interpunctatum — the Light Cahill, July's cream mayfly",
    },
    metaDescription: {
      fr: "Identification et pêche du Light Cahill (Stenacron interpunctatum) au Québec : pourquoi cette éphémère crème reste la valeur sûre des soirées calmes de juillet, et pourquoi elle dure des semaines plutôt que quelques jours.",
      en: "Identifying and fishing the Light Cahill (Stenacron interpunctatum) in Québec: why this cream mayfly stays the safe bet on quiet July evenings, and why it lasts for weeks rather than a few days.",
    },
    intro: {
      fr: "Juin donne son lot de grosses éclosions spectaculaires, puis la rivière se calme brusquement. Le Light Cahill prend le relais exactement à ce moment-là — une éphémère crème et discrète qui tient bon tout juillet, quand la plupart des autres insectes de la saison ont déjà fini.",
      en: "June delivers its share of big, spectacular hatches, then the river goes abruptly quiet. The Light Cahill picks up right at that moment — a quiet cream mayfly that holds on through all of July, once most of the season's other insects have already finished.",
    },
    idMarks: [
      {
        fr: "Corps crème à jaune très pâle, ailes crème, taille 12-14.",
        en: "Cream to very pale yellow body, cream wings, size 12–14.",
      },
      {
        fr: "Nymphe aplatie de type « clinger », dans le même genre de radiers que le March Brown et le Grey Fox, mais un genre différent (Stenacron).",
        en: "A flattened \"clinger\" nymph, in the same kind of riffles as the March Brown and Grey Fox, but a different genus (Stenacron).",
      },
      {
        fr: "Sort en soirée, souvent la seule éclosion visible sur une rivière calme de milieu d'été.",
        en: "Comes off in the evening, often the only visible hatch on a quiet midsummer river.",
      },
      {
        fr: "Plusieurs générations qui se chevauchent, ce qui l'étire sur des semaines plutôt que sur une fenêtre courte.",
        en: "Several overlapping broods, stretching it across weeks rather than a short window.",
      },
    ],
    confusedWith: {
      fr: "Le Grey Fox et le Pale Evening Dun, deux autres éphémères pâles de soirée, mais actives plus tôt dans l'année (mai-juin). Passé la fin juin, une éphémère crème en soirée est presque toujours un Light Cahill.",
      en: "The Grey Fox and the Pale Evening Dun, two other pale evening mayflies, but active earlier in the year (May–June). Past late June, a cream evening mayfly is almost always a Light Cahill.",
    },
    sections: [
      {
        heading: { fr: "Le calme après les grosses éclosions", en: "The quiet after the big hatches" },
        body: {
          fr: "Le Hendrickson, le Sulphur, le Green Drake : les grosses éclosions de mai et juin marquent le calendrier, mais elles finissent toutes avant la fin juin. Il en résulte une période de creux réel en tout début juillet, où une rivière peut sembler presque vide d'insectes même si elle regorgeait de duns trois semaines plus tôt.\n\nLe Light Cahill comble précisément ce vide. Ce n'est pas l'éclosion la plus spectaculaire de l'année, mais c'est celle qui garde les truites intéressées par la surface pendant que le reste du calendrier reste silencieux.",
          en: "The Hendrickson, the Sulphur, the Green Drake — May and June's big hatches mark the calendar, but they all wrap up before the end of June. That leaves a real lull in early July, when a river can look almost empty of insects even though it was thick with duns three weeks earlier.\n\nThe Light Cahill fills that gap precisely. It isn't the year's most spectacular hatch, but it's the one that keeps trout interested in the surface while the rest of the calendar stays quiet.",
        },
      },
      {
        heading: { fr: "Plusieurs générations qui se chevauchent", en: "Several overlapping broods" },
        body: {
          fr: "La plupart de nos éphémères produisent une seule génération synchronisée par année, ce qui explique pourquoi leurs éclosions durent typiquement deux à trois semaines. Le Light Cahill fait exception avec plusieurs générations qui se chevauchent dans le temps — un mécanisme plus commun chez les trichoptères comme le Spotted Sedge que chez les éphémères.\n\nEn pratique, ça veut dire une présence étirée sur cinq à six semaines plutôt qu'une fenêtre courte et intense — moins spectaculaire un soir donné, mais beaucoup plus fiable sur l'ensemble de juillet.",
          en: "Most of our mayflies produce a single synchronized generation a year, which is why their hatches typically run two to three weeks. The Light Cahill is an exception, with several broods overlapping in time — a mechanism more common in caddisflies like the Spotted Sedge than in mayflies.\n\nIn practice that means a presence stretched across five or six weeks rather than one short, intense window — less spectacular on any given evening, but far more reliable across the whole of July.",
        },
      },
      {
        heading: { fr: "Jusqu'à la pleine noirceur", en: "Right into full dark" },
        body: {
          fr: "Sa couleur crème reste visible dans une lumière où un insecte plus foncé disparaîtrait complètement, ce qui permet de suivre l'éclosion — et de continuer à pêcher — bien après que la plupart des autres mouches de soirée soient devenues invisibles. L'eau plus fraîche en soirée de juillet rend aussi les truites plus actives que pendant la chaleur de l'après-midi.\n\nRestez sur l'eau au-delà de votre heure habituelle d'arrêt : le Light Cahill se pêche souvent aussi bien, sinon mieux, dans les dernières minutes avant la noirceur complète.",
          en: "Its cream colour stays visible in light where a darker insect would vanish entirely, which lets you track the hatch — and keep fishing — well after most other evening flies have gone invisible. Cooler evening water in July also makes trout more active than they were through the afternoon heat.\n\nStay on the water past your usual stopping time — the Light Cahill often fishes just as well, if not better, in the last few minutes before full dark.",
        },
      },
    ],
    stages: [
      {
        label: { fr: "Nymphe", en: "Nymph" },
        when: { fr: "Toute la journée, dans les radiers — même habitat que le March Brown.", en: "All day, in riffles — the same habitat as the March Brown." },
        how: {
          fr: "Près du fond, en dérive naturelle dans le courant soutenu.",
          en: "Near bottom, on a natural drift in steady current.",
        },
        patternSlugs: ["partridge-orange"],
      },
      {
        label: { fr: "Dun", en: "Dun" },
        when: { fr: "En soirée, de fin juin à la mi-août.", en: "Evening, late June through mid-August." },
        how: {
          fr: "Une sèche crème en dérive morte, efficace jusqu'à la pleine noirceur.",
          en: "A cream dry dead-drifted, effective right into full dark.",
        },
        patternSlugs: ["light-cahill"],
      },
    ],
  },

  // -------------------------------------------------------------- DRUNELLA
  {
    hatchId: "drunella",
    metaTitle: {
      fr: "Drunella cornuta — la grande olive qui sort le matin",
      en: "Drunella cornuta — the large olive that comes off in the morning",
    },
    metaDescription: {
      fr: "Identification et pêche de Drunella cornuta au Québec : pourquoi cette grosse éphémère olive n'a rien à voir avec la Blue-Winged Olive malgré la couleur, et pourquoi elle sort le matin plutôt qu'en soirée.",
      en: "Identifying and fishing Drunella cornuta in Québec: why this big olive mayfly has nothing to do with the Blue-Winged Olive despite the colour, and why it hatches in the morning rather than the evening.",
    },
    intro: {
      fr: "On l'appelle souvent « grosse BWO » par habitude, mais Drunella cornuta n'est même pas de la même famille que la Baetis. C'est une éphémère nettement plus grosse, qui émerge le matin plutôt qu'en soirée, sur une fenêtre de trois semaines à peine — la bonne surprise de la mi-juin, quand l'eau commence tout juste à baisser.",
      en: "It often gets called a \"big BWO\" out of habit, but Drunella cornuta isn't even in the same family as the Baetis. It's a distinctly bigger mayfly, emerging in the morning rather than the evening, in a window barely three weeks long — the welcome surprise of mid-June, just as the water starts to drop.",
    },
    idMarks: [
      {
        fr: "Nettement plus grosse qu'un Baetis typique, taille 14-16 contre 16 à 22 pour la Blue-Winged Olive.",
        en: "Distinctly bigger than a typical Baetis, size 14–16 versus 16–22 for the Blue-Winged Olive.",
      },
      {
        fr: "Petites protubérances (cornes) visibles sur le thorax de la nymphe — d'où le nom cornuta.",
        en: "Small horn-like tubercles visible on the nymph's thorax — hence the name cornuta.",
      },
      {
        fr: "Corps olive foncé à brun-olive, plus sombre qu'un Baetis.",
        en: "Dark olive to olive-brown body, darker than a Baetis.",
      },
      {
        fr: "Émerge le matin plutôt qu'en soirée, sur une fenêtre étroite de trois semaines en juin-juillet.",
        en: "Emerges in the morning rather than evening, in a narrow three-week window in June–July.",
      },
    ],
    confusedWith: {
      fr: "La Blue-Winged Olive (Baetis spp.), avec qui on la confond par simple habitude de tout appeler « olive » — mais la Baetis est nettement plus petite, active toute la saison, et sort n'importe quand plutôt qu'exclusivement le matin.",
      en: "The Blue-Winged Olive (Baetis spp.), which gets lumped in out of sheer habit of calling anything olive-coloured a \"BWO\" — but the Baetis is distinctly smaller, active all season, and comes off any time of day rather than mornings only.",
    },
    sections: [
      {
        heading: { fr: "Pas juste une grosse Baetis", en: "Not just a big Baetis" },
        body: {
          fr: "Les pêcheurs regroupent souvent toute éphémère de teinte olive sous le nom générique de BWO, mais Drunella cornuta n'appartient même pas à la même famille que la Baetis : elle fait partie des Ephemerellidae, la même famille que le Sulphur et le Pale Evening Dun, plutôt que des Baetidae. La nymphe porte de petites protubérances cornues sur le thorax, un trait distinctif des Ephemerellidae qu'on ne trouve pas chez la Baetis.\n\nLa confusion vient surtout de la couleur et du fait que les deux éclosions peuvent se chevaucher en juin — mais la taille à elle seule (14-16 contre 16-22) devrait suffire à trancher avant même de sortir la loupe.",
          en: "Anglers often lump any olive-toned mayfly under the generic \"BWO,\" but Drunella cornuta isn't even in the same family as the Baetis — it belongs to the Ephemerellidae, the same family as the Sulphur and the Pale Evening Dun, rather than the Baetidae. The nymph carries small horned tubercles on its thorax, a distinguishing trait of the Ephemerellidae not found on Baetis.\n\nThe mix-up mostly comes down to colour and the fact that the two hatches can overlap in June — but size alone (14–16 versus 16–22) should settle it before you ever reach for a hand lens.",
        },
      },
      {
        heading: { fr: "Pourquoi le matin, en plein été", en: "Why morning, in the heart of summer" },
        body: {
          fr: "La plupart de nos grosses éphémères d'été sortent en soirée, quand la lumière baisse. Drunella cornuta fait l'inverse : elle émerge le matin, généralement entre la mi-juin et le début juillet, juste au moment où l'eau commence à se réchauffer sérieusement.\n\nÉmerger tôt le matin, avant que l'eau n'atteigne son maximum de température quotidien, garde la nymphe et le dun naissant dans une fenêtre où l'oxygène dissous reste plus élevé — un avantage réel pour un insecte qui vit dans une eau qui se réchauffe rapidement à cette période de l'année.",
          en: "Most of our big summer mayflies come off in the evening, as light fades. Drunella cornuta does the opposite: it emerges in the morning, generally mid-June into early July, right as the water starts warming up seriously.\n\nEmerging early in the day, before water hits its daily temperature peak, keeps the nymph and newly emerged dun in a window where dissolved oxygen stays higher — a real advantage for an insect living in water that warms quickly at this time of year.",
        },
      },
      {
        heading: { fr: "Une fenêtre courte à ne pas manquer", en: "A short window not to miss" },
        body: {
          fr: "Trois semaines, le matin seulement : c'est une fenêtre bien plus étroite que celle de la Baetis, qui s'étend sur presque toute la saison. Si vous pêchez une rivière que vous connaissez bien en juin et que vous remarquez une grosse olive inhabituelle en avant-midi, il y a de bonnes chances que ce soit celle-ci plutôt qu'une Baetis attardée.\n\nParce que la fenêtre est courte et matinale, c'est une éclosion facile à manquer complètement si l'habitude est de pêcher plutôt en soirée l'été — vaut la peine de sortir tôt au moins une fois pendant ces trois semaines.",
          en: "Three weeks, mornings only: a far narrower window than the Baetis, which runs across nearly the whole season. If you fish a river you know well in June and spot an unusually large olive in mid-morning, there's a good chance it's this one rather than a late-running Baetis.\n\nBecause the window is short and morning-only, it's an easy hatch to miss entirely if your summer habit is fishing evenings instead — worth getting out early at least once during those three weeks.",
        },
      },
    ],
    stages: [
      {
        label: { fr: "Nymphe", en: "Nymph" },
        when: { fr: "Le matin, dans les courants modérés à rapides, à l'approche de l'éclosion.", en: "Morning, in moderate-to-fast current, as the hatch approaches." },
        how: {
          fr: "Près du fond, en dérive naturelle.",
          en: "Near bottom, on a natural drift.",
        },
        patternSlugs: ["pheasant-tail-nymph"],
      },
      {
        label: { fr: "Dun", en: "Dun" },
        when: { fr: "Le matin, de la mi-juin au début juillet.", en: "Morning, mid-June into early July." },
        how: {
          fr: "Une sèche olive foncé, plus grosse qu'un patron habituel de BWO, en dérive morte.",
          en: "A dark olive dry, bigger than a usual BWO pattern, dead-drifted.",
        },
        patternSlugs: ["blue-winged-olive"],
      },
    ],
  },

  // ----------------------------------------------------------- GOLDEN DRAKE
  {
    hatchId: "golden-drake",
    metaTitle: {
      fr: "Anthopotamus distinctus — le Golden Drake, rare mais fiable",
      en: "Anthopotamus distinctus — the Golden Drake, scarce but reliable",
    },
    metaDescription: {
      fr: "Identification et pêche du Golden Drake (Anthopotamus distinctus) au Québec : pourquoi cette grosse éphémère jamais abondante reste souvent le seul vrai repas d'une truite en eau basse d'août.",
      en: "Identifying and fishing the Golden Drake (Anthopotamus distinctus) in Québec: why this never-abundant big mayfly is often the only real meal a trout gets in low August water.",
    },
    intro: {
      fr: "Elle n'éclot jamais en vague, seulement au compte-gouttes, un insecte à la fois. Mais le Golden Drake reste présent tout le mois d'août, en soirée — et dans une rivière basse et réchauffée où presque plus rien d'autre n'éclot, quelques gros insectes valent parfois mieux qu'une vague de petits.",
      en: "It never hatches in a wave, only a trickle, one insect at a time. But the Golden Drake stays present all through August evenings — and on a low, warm river where almost nothing else is hatching, a handful of big insects sometimes beats a wave of small ones.",
    },
    idMarks: [
      {
        fr: "Grosse éphémère jaune doré, taille 10-12.",
        en: "Large golden-yellow mayfly, size 10–12.",
      },
      {
        fr: "Jamais abondante — quelques insectes espacés plutôt qu'une vague.",
        en: "Never abundant — a scattered few insects rather than a wave.",
      },
      {
        fr: "Nymphe semi-fouisseuse, dans le gravier grossier et les débris des rivières plus grandes.",
        en: "A semi-burrowing nymph, in coarse gravel and debris of bigger rivers.",
      },
      {
        fr: "Présente tout le mois d'août en soirée, sans grosse pointe précise.",
        en: "Around all through August evenings, without one sharp peak.",
      },
    ],
    confusedWith: {
      fr: "Le Golden Stone (Acroneuria spp.), un plécoptère du même « doré » de nom mais d'une classe d'insecte entièrement différente — ailes repliées à plat, deux queues courtes plutôt que trois longues. Le Light Cahill, plus pâle et plus commun à la même période.",
      en: "The Golden Stone (Acroneuria spp.), a stonefly sharing only the \"golden\" name but an entirely different insect order — wings folded flat, two short tails rather than three long ones. The Light Cahill, paler and far more common at the same time.",
    },
    sections: [
      {
        heading: { fr: "Rare, mais fiable", en: "Scarce, but reliable" },
        body: {
          fr: "Le Golden Drake ne produit jamais une éclosion dense : on parle de quelques insectes par soirée, jamais d'une vague. Mais contrairement à une éclosion ponctuelle qui dure deux semaines, celle-ci reste présente, en petite quantité, pendant tout le mois d'août — un insecte fiable plutôt qu'un insecte spectaculaire.\n\nCette présence discrète et continue, plutôt qu'une pointe marquée, en fait un pari sûr n'importe quel soir d'août sans qu'il soit nécessaire de deviner le bon moment.",
          en: "The Golden Drake never produces a dense hatch — a handful of bugs a night, never a wave. But unlike a sharp hatch that lasts two weeks, this one stays present, in small numbers, right through August — a reliable insect rather than a spectacular one.\n\nThat quiet, steady presence rather than one marked peak makes it a safe bet on any August evening without needing to guess the right moment.",
        },
      },
      {
        heading: { fr: "Le seul gros repas en eau basse", en: "The only big meal in low water" },
        body: {
          fr: "Août amène presque toujours des niveaux d'eau bas et une rivière qui se réchauffe, ce qui concentre les truites dans les fosses les plus profondes et réduit sérieusement la nourriture disponible. Dans ce contexte, un insecte de cette taille — même en petit nombre — devient disproportionnellement important : c'est souvent le seul repas assez gros pour justifier l'effort d'une truite qui économise son énergie en eau basse et chaude.\n\nC'est pourquoi une sèche de taille 10-12 peut prendre du poisson en plein mois d'août même quand rien d'autre ne semble se passer à la surface.",
          en: "August almost always brings low water and a warming river, which concentrates trout in the deepest pools and seriously cuts the food available. In that context, an insect this size — even in small numbers — becomes disproportionately important: it's often the only meal big enough to justify the effort for a trout conserving energy in low, warm water.\n\nThat's why a size 10–12 dry can take fish in the middle of August even when nothing else seems to be happening on the surface.",
        },
      },
      {
        heading: { fr: "Deux « dorés », deux insectes", en: "Two \"goldens,\" two different bugs" },
        body: {
          fr: "Le nom « Golden » se retrouve chez deux insectes complètement différents sur nos rivières : cette éphémère et le Golden Stone, un plécoptère. Les deux sont dorés, présents en été, et de taille comparable — ce qui prête à confusion chez qui ne regarde que la couleur.\n\nLa différence se voit au premier coup d'œil sur les ailes : repliées bien à plat sur le dos chez le plécoptère, tenues droites comme de petites voiles chez l'éphémère. Comptez aussi les queues — deux courtes contre trois longues — si le doute persiste.",
          en: "The name \"Golden\" attaches to two completely different insects on our rivers: this mayfly and the Golden Stone, a stonefly. Both are golden, both around in summer, both roughly the same size — which invites confusion from anyone going by colour alone.\n\nThe wings settle it at a glance: folded flat against the back on the stonefly, held upright like small sails on the mayfly. Count tails too — two short versus three long — if any doubt remains.",
        },
      },
    ],
    stages: [
      {
        label: { fr: "Nymphe", en: "Nymph" },
        when: { fr: "Tout l'été, dans le gravier grossier des rivières plus grandes.", en: "All summer, in the coarse gravel of bigger rivers." },
        how: {
          fr: "Près du fond, en dérive naturelle dans le courant modéré.",
          en: "Near bottom, on a natural drift in moderate current.",
        },
        patternSlugs: ["stimulator"],
      },
      {
        label: { fr: "Dun", en: "Dun" },
        when: { fr: "En soirée, tout le mois d'août.", en: "Evening, all through August." },
        how: {
          fr: "Une grosse sèche dorée, en dérive morte — souvent le seul insecte assez gros pour intéresser une truite en eau basse.",
          en: "A big golden dry, dead-drifted — often the only insect big enough to interest a trout in low water.",
        },
        patternSlugs: ["light-cahill"],
      },
    ],
  },

  // ------------------------------------------------------------ SLATE DRAKE
  {
    hatchId: "slate-drake",
    metaTitle: {
      fr: "Isonychia bicolor — le Slate Drake, la nageuse d'eau vive",
      en: "Isonychia bicolor — the Slate Drake, the fast-water swimmer",
    },
    metaDescription: {
      fr: "Identification et pêche du Slate Drake (Isonychia bicolor) au Québec : une nymphe nageuse musclée d'eau vive, deux générations par année, et pourquoi la noyée en dérive tendue fonctionne si bien.",
      en: "Identifying and fishing the Slate Drake (Isonychia bicolor) in Québec: a muscular fast-water swimming nymph, two broods a year, and why a tight-swing wet fly works so well.",
    },
    intro: {
      fr: "Elle partage le comportement d'émergence du Grey Drake — ramper hors de l'eau plutôt que d'éclore en surface — mais dans un monde complètement différent : le courant vif plutôt que la baie calme. Deux générations par année en font aussi une des rares grosses mouches encore actives à l'automne.",
      en: "It shares the Grey Drake's emergence habit — crawling out of the water rather than hatching at the surface — but in a completely different world: fast current rather than a calm bay. Two broods a year also make it one of the few big flies still active come fall.",
    },
    idMarks: [
      {
        fr: "Corps gris ardoise à brun-rouge, avec une fine bande pâle caractéristique sous le thorax.",
        en: "Slate-grey to reddish-brown body, with a distinctive pale stripe under the thorax.",
      },
      {
        fr: "Nageuse rapide et musclée, taille 10-12, trois longues queues.",
        en: "A fast, muscular swimmer, size 10–12, three long tails.",
      },
      {
        fr: "Nymphe trouvée dans le courant vif, agrippée aux roches entre les efforts de nage — jamais en eau morte.",
        en: "Nymph found in fast current, clinging to rock between bursts of swimming — never in dead water.",
      },
      {
        fr: "Rampe hors de l'eau sur les roches exposées pour éclore, comme le Grey Drake mais en eau vive plutôt que calme.",
        en: "Crawls out onto exposed rock to emerge, like the Grey Drake but in fast water rather than calm.",
      },
    ],
    confusedWith: {
      fr: "Le Grey Drake (Siphlonurus spp.), qui partage le même comportement d'émergence hors de l'eau et une couleur similaire, mais qui vit en eau calme et lente plutôt que dans le courant vif. Vérifiez le type d'eau avant la couleur.",
      en: "The Grey Drake (Siphlonurus spp.), which shares the same out-of-water emergence behaviour and a similar colour, but lives in slow, calm water rather than fast current. Check the water type before the colour.",
    },
    sections: [
      {
        heading: { fr: "Une nageuse d'eau vive", en: "A fast-water swimmer" },
        body: {
          fr: "Contrairement au Grey Drake, une nageuse de baies et d'eaux calmes, l'Isonychia vit dans le courant vif — elle alterne entre s'agripper aux roches et de courtes poussées de nage puissante pour se maintenir en place. C'est une des rares nymphes d'éphémère capable de tenir sa position dans un courant que la plupart des autres espèces ne pourraient pas affronter directement.\n\nCherchez-la dans les veines de courant soutenu et les radiers profonds, jamais dans l'eau morte où vit sa cousine du même genre de comportement.",
          en: "Unlike the Grey Drake, a swimmer of bays and calm water, Isonychia lives in fast current — alternating between clinging to rock and short bursts of powerful swimming to hold position. It's one of the few mayfly nymphs able to hold its ground in current most other species couldn't face head-on.\n\nLook for it in steady-current seams and deep riffles, never in the dead water where its behavioural cousin lives.",
        },
      },
      {
        heading: { fr: "Même sortie à terre, en eau vive", en: "The same out-of-water exit, in fast water" },
        body: {
          fr: "Comme le Grey Drake, la nymphe d'Isonychia rampe hors de l'eau pour éclore plutôt que de le faire en surface — mais elle le fait sur les roches exposées des rapides plutôt que sur la végétation des bordures calmes. C'est le même comportement, adapté à un habitat complètement différent.\n\nÇa veut dire que, comme pour le Grey Drake, l'émergence elle-même se voit rarement — mais contrairement à lui, la nymphe d'Isonychia se pêche très bien pendant sa migration vers la rive, en dérive tendue près du fond dans le courant vif.",
          en: "Like the Grey Drake, the Isonychia nymph crawls out of the water to emerge rather than doing so at the surface — but it does so on exposed rock in the riffles rather than on calm-water vegetation. Same behaviour, adapted to a completely different habitat.\n\nThat means, as with the Grey Drake, the emergence itself is rarely seen — but unlike it, the Isonychia nymph fishes very well during its migration toward shore, on a tight drift near bottom in fast current.",
        },
      },
      {
        heading: { fr: "Deux générations, deux saisons", en: "Two broods, two seasons" },
        body: {
          fr: "L'Isonychia produit deux générations par année : une au début de l'été, une seconde qui s'étale d'août à octobre et qui porte la toute fin de la saison de pêche à la mouche sèche. Cette deuxième génération est particulièrement précieuse — par une journée fraîche d'automne où presque plus rien n'éclot, c'est souvent la seule grosse mouche encore active.\n\nUne noyée montée en dérive tendue, laissée balancer en fin de dérive, imite bien la nymphe qui nage activement vers la rive avant d'éclore — et ça fonctionne particulièrement bien pendant cette poussée finale de fin de saison.",
          en: "Isonychia runs two broods a year: one in early summer, a second that stretches from August into October and carries the very tail end of the dry-fly season. That second brood is especially valuable — on a cool fall day when almost nothing else is hatching, it's often the only big fly still active.\n\nA wet fly fished on a tight drift, left to swing at the end of the presentation, imitates well a nymph actively swimming toward shore before it emerges — and it works especially well during that late-season final push.",
        },
      },
    ],
    stages: [
      {
        label: { fr: "Nymphe / émergente", en: "Nymph / emerger" },
        when: { fr: "Toute la saison, en migration vers la rive avant l'éclosion.", en: "All season, migrating toward shore ahead of the hatch." },
        how: {
          fr: "En dérive tendue près du fond, avec un léger balancement en fin de dérive qui imite la nage.",
          en: "On a tight drift near bottom, with a light swing at the end that imitates the swim.",
        },
        patternSlugs: ["partridge-orange"],
      },
      {
        label: { fr: "Dun", en: "Dun" },
        when: { fr: "En après-midi l'été, et jusqu'en octobre pour la deuxième génération.", en: "Afternoon in summer, and into October for the second brood." },
        how: {
          fr: "Une sèche grise dérivée dans les veines de courant soutenu.",
          en: "A grey dry drifted through steady-current seams.",
        },
        patternSlugs: ["slate-drake"],
      },
    ],
  },

  // ----------------------------------------------------------- MAHOGANY DUN
  {
    hatchId: "mahogany-dun",
    metaTitle: {
      fr: "Paraleptophlebia mollis — le Mahogany Dun, deux fenêtres, une seule remarquée",
      en: "Paraleptophlebia mollis — the Mahogany Dun, two windows, only one noticed",
    },
    metaDescription: {
      fr: "Identification et pêche du Mahogany Dun (Paraleptophlebia mollis) au Québec : le cousin acajou du Blue Quill, et sa deuxième génération de septembre que presque personne ne remarque.",
      en: "Identifying and fishing the Mahogany Dun (Paraleptophlebia mollis) in Québec: the Blue Quill's mahogany-coloured cousin, and its September brood that almost nobody notices.",
    },
    intro: {
      fr: "Elle sort deux fois par année, discrètement les deux fois — une petite éphémère acajou des eaux lentes, cousine du Blue Quill, dont la deuxième génération de fin d'été passe presque toujours inaperçue derrière les fourmis et les sauterelles.",
      en: "It comes off twice a year, quietly both times — a small mahogany mayfly of slow water, a cousin of the Blue Quill, whose late-summer second brood almost always goes unnoticed behind the ants and grasshoppers.",
    },
    idMarks: [
      {
        fr: "Corps acajou-brun rougeâtre, taille 16-18 — même genre que le Blue Quill (Paraleptophlebia), mais teinte plus chaude.",
        en: "Reddish mahogany-brown body, size 16–18 — same genus as the Blue Quill (Paraleptophlebia), but a warmer tone.",
      },
      {
        fr: "Trois queues, nymphe fine du type rampant, dans les eaux lentes et la litière de feuilles.",
        en: "Three tails, a slim crawler-type nymph, in slow water and leaf litter.",
      },
      {
        fr: "Deux générations distinctes : une en juin, une seconde discrète de la fin août à la mi-septembre.",
        en: "Two distinct broods: one in June, a quiet second one from late August to mid-September.",
      },
      {
        fr: "La deuxième vague passe souvent complètement inaperçue, noyée dans l'attention portée aux terrestres de fin d'été.",
        en: "The second wave usually goes completely unnoticed, lost in the attention paid to late-summer terrestrials.",
      },
    ],
    confusedWith: {
      fr: "Le Blue Quill, même genre et taille comparable, mais grisâtre plutôt qu'acajou et actif seulement au printemps. La petite Blue-Winged Olive, plus verte, active toute la saison.",
      en: "The Blue Quill, same genus and comparable size, but grey rather than mahogany and active only in spring. The small Blue-Winged Olive, greener, active all season.",
    },
    sections: [
      {
        heading: { fr: "Le cousin acajou du Blue Quill", en: "The Blue Quill's mahogany cousin" },
        body: {
          fr: "Le Mahogany Dun partage le genre Paraleptophlebia avec le Blue Quill : même silhouette fine, même nymphe rampante des eaux lentes et de la litière de feuilles, même sensibilité au temps gris. La différence la plus fiable reste la couleur — un brun-acajou chaud plutôt que le gris-bleu du Blue Quill — et la saison, puisque le Mahogany Dun s'étire bien après que le Blue Quill ait terminé sa seule génération du printemps.\n\nComme pour son cousin, cherchez-le dans les eaux modérées à lentes plutôt que dans le courant vif.",
          en: "The Mahogany Dun shares the genus Paraleptophlebia with the Blue Quill: same slim silhouette, same crawling nymph of slow water and leaf litter, same sensitivity to grey weather. The most reliable difference is colour — a warm mahogany-brown rather than the Blue Quill's grey-blue — and season, since the Mahogany Dun stretches well past when the Blue Quill has finished its single spring generation.\n\nAs with its cousin, look for it in moderate-to-slow water rather than fast current.",
        },
      },
      {
        heading: { fr: "Deux générations, une seule qu'on remarque", en: "Two broods, only one anyone notices" },
        body: {
          fr: "La première génération sort en juin, en même temps que plusieurs autres éphémères plus voyantes, et passe déjà relativement inaperçue. La seconde, de la fin août à la mi-septembre, l'est encore davantage : à cette période, l'attention des pêcheurs se tourne vers les fourmis, les sauterelles et les criquets plutôt que vers une petite éphémère discrète.\n\nC'est pourtant une occasion réelle. Une rivière qui semble n'offrir que des terrestres en septembre peut très bien avoir une éclosion de Mahogany Dun en cours, simplement ignorée.",
          en: "The first brood comes off in June, alongside several flashier mayflies, and already goes relatively unnoticed. The second, from late August to mid-September, goes even more so: by then, angler attention has shifted to ants, hoppers and crickets rather than a quiet little mayfly.\n\nIt's a real opportunity all the same. A river that seems to offer nothing but terrestrials in September may well have a Mahogany Dun hatch running, simply overlooked.",
        },
      },
      {
        heading: { fr: "Une petite mouche discrète, deux fois par année", en: "A quiet small fly, twice a year" },
        body: {
          fr: "La pêche elle-même ne change pas beaucoup entre les deux générations : une petite sèche acajou, présentée avec soin sur une eau lente, avec un bas de ligne fin. La vraie clé est de savoir que la deuxième fenêtre existe et de garder l'œil ouvert en septembre plutôt que de supposer que la saison des éphémères est terminée.\n\nUne poignée de mouches dans la boîte suffit — ce n'est jamais une éclosion qui demande un arsenal, seulement de l'attention.",
          en: "The fishing itself doesn't change much between the two broods: a small mahogany dry, presented carefully over slow water, with fine tippet. The real key is knowing the second window exists and keeping an eye out in September instead of assuming mayfly season is over.\n\nA handful of flies in the box is enough — this was never a hatch that demands an arsenal, only attention.",
        },
      },
    ],
    stages: [
      {
        label: { fr: "Nymphe", en: "Nymph" },
        when: { fr: "Avant chacune des deux fenêtres, dans l'eau lente.", en: "Ahead of each of the two windows, in slow water." },
        how: {
          fr: "En dérive lente près du fond, parmi les débris.",
          en: "On a slow drift near bottom, among debris.",
        },
        patternSlugs: ["pheasant-tail-nymph"],
      },
      {
        label: { fr: "Dun", en: "Dun" },
        when: { fr: "En juin, puis de nouveau de la fin août à la mi-septembre.", en: "In June, then again from late August to mid-September." },
        how: {
          fr: "Une petite sèche acajou, posée avec soin sur une eau lente.",
          en: "A small mahogany dry, placed carefully over slow water.",
        },
        patternSlugs: ["parachute-adams"],
      },
    ],
  },

  // ------------------------------------------------------------- CALLIBAETIS
  {
    hatchId: "callibaetis",
    metaTitle: {
      fr: "Callibaetis spp. — la seule éphémère de lac de ce chapitre",
      en: "Callibaetis spp. — the only lake mayfly in this chapter",
    },
    metaDescription: {
      fr: "Identification et pêche du Callibaetis au Québec : la seule éphémère qui vit uniquement en lac, pourquoi les insectes rapetissent l'été, et comment pêcher une truite qui croise plutôt qu'elle ne tient.",
      en: "Identifying and fishing Callibaetis in Québec: the only mayfly that lives exclusively in lakes, why the bugs shrink through summer, and how to fish a trout that cruises instead of holding.",
    },
    intro: {
      fr: "Toutes les autres éphémères de ce guide dépendent du courant d'une façon ou d'une autre. Le Callibaetis fait exception : il vit uniquement dans les lacs et les étangs, où ni la nymphe ni la truite qui s'en nourrit ne se comportent tout à fait comme en rivière.",
      en: "Every other mayfly in this guide depends on current in one way or another. Callibaetis is the exception: it lives only in lakes and ponds, where neither the nymph nor the trout feeding on it behaves quite the way it would in a river.",
    },
    idMarks: [
      {
        fr: "Corps brun-olive à gris, taille 14-16 en début d'été, plus petite (jusqu'à 18) en fin de saison.",
        en: "Olive-brown to grey body, size 14–16 early summer, smaller (down to 18) later in the season.",
      },
      {
        fr: "Nymphe nageuse agile, avec des marques sombres caractéristiques sur l'abdomen, dans la végétation submergée des lacs et étangs.",
        en: "An agile swimming nymph, with characteristic dark abdominal markings, in the submerged vegetation of lakes and ponds.",
      },
      {
        fr: "Seule éphémère de ce chapitre qui vit exclusivement en eau stagnante — jamais en rivière.",
        en: "The only mayfly in this chapter that lives exclusively in still water — never in a river.",
      },
      {
        fr: "Plusieurs générations qui se succèdent tout l'été, chacune plus petite que la précédente.",
        en: "Several broods through the summer, each one smaller than the last.",
      },
    ],
    confusedWith: {
      fr: "La Blue-Winged Olive en rivière, de couleur similaire, mais le Callibaetis ne se trouve tout simplement jamais en courant — l'habitat seul règle la question.",
      en: "The river Blue-Winged Olive, similar in colour, but Callibaetis simply never turns up in moving water — habitat alone settles the question.",
    },
    sections: [
      {
        heading: { fr: "La seule éphémère de lac de ce chapitre", en: "The only lake mayfly in this chapter" },
        body: {
          fr: "Toutes les autres éphémères de ce guide vivent en rivière, portées et nourries par le courant. Le Callibaetis fait bande à part : il passe tout son cycle en eau stagnante, dans les lacs et les étangs, où sa nymphe doit nager activement pour trouver sa nourriture plutôt que de la laisser venir à elle.\n\nÇa change la façon de la pêcher du tout au tout. Sans courant pour guider une dérive, une nymphe de Callibaetis se présente en la ramenant par petites tirées, imitant une nage active plutôt qu'une dérive passive.",
          en: "Every other mayfly in this guide lives in a river, carried and fed by current. Callibaetis stands apart: it spends its whole life cycle in still water, in lakes and ponds, where its nymph has to swim actively to find food rather than letting the current deliver it.\n\nThat changes how it's fished entirely. With no current to guide a drift, a Callibaetis nymph gets fished on a retrieve, in short strips that imitate active swimming rather than a passive drift.",
        },
      },
      {
        heading: { fr: "Pourquoi les insectes rapetissent l'été", en: "Why the bugs get smaller through summer" },
        body: {
          fr: "Le Callibaetis produit plusieurs générations qui se succèdent de la fin mai à septembre, et chaque nouvelle génération éclôt un peu plus petite que la précédente. Ce n'est pas un hasard : une eau plus chaude accélère le développement larvaire, ce qui laisse moins de temps à chaque génération pour accumuler de la masse avant l'émergence.\n\nEn pratique, ça veut dire ajuster la taille de mouche au fil de l'été — un 14 en juin devient un 16 en juillet, et parfois un 18 d'ici septembre, sur le même plan d'eau.",
          en: "Callibaetis produces several successive broods from late May into September, and each new generation hatches a little smaller than the last. That's no accident: warmer water speeds up larval development, leaving each generation less time to put on mass before emerging.\n\nIn practice that means sizing down as the summer goes on — a 14 in June becomes a 16 in July, and sometimes an 18 by September, on the very same water.",
        },
      },
      {
        heading: { fr: "Pêcher une truite qui croise plutôt qu'elle ne tient", en: "Fishing a trout that cruises instead of holding" },
        body: {
          fr: "En rivière, une truite tient un poste et attend que la nourriture dérive vers elle. En lac, elle croise activement à la recherche de nourriture — ce qui veut dire repérer le poisson avant de présenter la mouche, plutôt que de couvrir simplement l'eau.\n\nUne sèche posée devant la trajectoire prévue d'une truite qui croise, ou une nymphe animée près de la végétation submergée, fonctionne mieux qu'une dérive statique dans un endroit choisi au hasard.",
          en: "In a river, a trout holds a lie and waits for food to drift to it. In a lake, it cruises actively looking for food — which means spotting the fish before presenting the fly, rather than simply covering water.\n\nA dry placed ahead of a cruising trout's expected path, or a nymph twitched near submerged weed, works better than a static drift fished in a spot picked at random.",
        },
      },
    ],
    stages: [
      {
        label: { fr: "Nymphe", en: "Nymph" },
        when: { fr: "Tout l'été, dans la végétation submergée des lacs.", en: "All summer, in the submerged vegetation of lakes." },
        how: {
          fr: "En petites tirées près de la végétation, pour imiter une nage active.",
          en: "In short strips near vegetation, to imitate active swimming.",
        },
        patternSlugs: ["bead-head-hares-ear"],
      },
      {
        label: { fr: "Dun", en: "Dun" },
        when: { fr: "Le matin, de la fin mai à septembre.", en: "Morning, late May through September." },
        how: {
          fr: "Une petite sèche posée devant une truite qui croise, en ajustant la taille au fil de l'été.",
          en: "A small dry placed ahead of a cruising trout, sizing down as the summer goes on.",
        },
        patternSlugs: ["parachute-adams"],
      },
    ],
  },

  // ------------------------------------------------------ LITTLE BLACK CADDIS
  {
    hatchId: "little-black-caddis",
    metaTitle: {
      fr: "Chimarra aterrima — le Little Black Caddis, le filet en doigt de gant",
      en: "Chimarra aterrima — the Little Black Caddis, the finger-net weaver",
    },
    metaDescription: {
      fr: "Identification et pêche du Little Black Caddis (Chimarra aterrima) au Québec : une larve minuscule qui tisse un filet en doigt de gant dans les rapides les plus propres, et pourquoi on la confond souvent avec un moucheron.",
      en: "Identifying and fishing the Little Black Caddis (Chimarra aterrima) in Québec: a tiny larva that spins a finger-shaped net in the cleanest riffles, and why it's so often mistaken for a midge.",
    },
    intro: {
      fr: "À cette taille et dans un essaim au-dessus d'un rapide, le premier réflexe est de crier « moucheron ». Le Little Black Caddis est pourtant bien un trichoptère, minuscule et tout noir, dont la larve tisse un filet en forme de doigt de gant dans l'eau la plus vive et la plus propre de la rivière.",
      en: "At this size, swarming over a riffle, the first instinct is to call it a midge. The Little Black Caddis is a genuine caddisfly all the same, tiny and jet black, whose larva spins a finger-shaped net in the fastest, cleanest water on the river.",
    },
    idMarks: [
      {
        fr: "Minuscule, taille 18-20, corps et ailes entièrement noirs.",
        en: "Tiny, size 18–20, entirely black body and wings.",
      },
      {
        fr: "Ailes tenues en toit au repos — le trait qui la distingue d'un moucheron à ce format.",
        en: "Wings held tent-like at rest — the trait that separates it from a midge at this size.",
      },
      {
        fr: "Antennes longues et filiformes, contrairement aux antennes courtes d'un chironome.",
        en: "Long, thread-like antennae, unlike a chironomid's short ones.",
      },
      {
        fr: "Larve filandière qui tisse un tube de soie en doigt de gant, fixé dans les rapides les plus rapides et les plus propres.",
        en: "A net-spinning larva that spins a finger-like silk tube, anchored in the fastest, cleanest rapids.",
      },
      {
        fr: "Vole en essaims denses au-dessus de l'eau vive, souvent confondue de loin avec un nuage de moucherons.",
        en: "Flies in dense swarms over fast water, often mistaken from a distance for a cloud of midges.",
      },
    ],
    confusedWith: {
      fr: "Un chironome de bonne taille, à cause du format minuscule et des essaims — regardez les ailes en toit et les longues antennes pour trancher. Le Spotted Sedge, même ordre mais beaucoup plus gros et de couleur tan.",
      en: "A larger chironomid, thanks to the tiny size and the swarming — check for tented wings and long antennae to settle it. The Spotted Sedge, same order but much bigger and tan-coloured.",
    },
    sections: [
      {
        heading: { fr: "Un filet en doigt de gant", en: "A finger-shaped net" },
        body: {
          fr: "La larve du Little Black Caddis tisse un tube de soie fine, fermé à une extrémité et ouvert à l'autre face au courant — un peu comme un doigt de gant fixé à une roche. L'eau qui traverse le tube y dépose des particules organiques que la larve récolte régulièrement.\n\nCe type de filet exige une eau exceptionnellement propre et rapide pour bien fonctionner, ce qui confine la larve aux rapides les plus vifs et les mieux oxygénés — souvent le tronçon le plus turbulent d'une rivière, là où peu d'autres insectes filandiers s'installent.",
          en: "The Little Black Caddis larva spins a fine silk tube, closed at one end and open to the current at the other — something like a glove finger anchored to a rock. Water passing through deposits organic particles that the larva harvests regularly.\n\nThat kind of net needs exceptionally clean, fast water to work well, which confines the larva to the swiftest, best-oxygenated riffles — often the most turbulent stretch of a river, where few other net-spinning insects bother to settle.",
        },
      },
      {
        heading: { fr: "Minuscule, donc facilement mal identifiée", en: "Tiny, so it's easy to misidentify" },
        body: {
          fr: "À cette taille, la première impression est presque toujours « moucheron » plutôt que « trichoptère » — et c'est une erreur facile à faire de loin, surtout en essaim dense au-dessus d'un rapide. Deux détails règlent la question rapidement : les ailes, tenues bien droites comme un toit chez le trichoptère plutôt qu'à plat comme chez le chironome, et les antennes, longues et filiformes plutôt que courtes.\n\nÇa vaut la peine de vérifier, parce que la nymphe qui imite chacun des deux insectes n'a rien à voir.",
          en: "At this size, the first impression is almost always \"midge\" rather than \"caddis\" — an easy mistake from a distance, especially in a dense swarm over a riffle. Two details settle it fast: the wings, held tent-like on the caddis rather than flat as on a chironomid, and the antennae, long and thread-like rather than short.\n\nIt's worth checking, because the imitation for each insect looks nothing like the other.",
        },
      },
      {
        heading: { fr: "Pêcher une eau que peu d'autres insectes tolèrent", en: "Fishing water few other insects can handle" },
        body: {
          fr: "Parce que la larve exige une eau exceptionnellement rapide et propre, sa présence dans un secteur donné est un bon signe de la qualité de cette eau. Une petite nymphe ou pupe noire, pêchée près du fond dans les rapides les plus vifs, couvre bien cette espèce même hors éclosion.\n\nEn surface, une minuscule sèche noire, presque invisible à l'œil dans le courant blanc d'un rapide, reste malgré tout repérable par la truite — fiez-vous à la zone plutôt qu'à ce que vous voyez réellement flotter.",
          en: "Because the larva demands exceptionally fast, clean water, its presence in a given stretch is a good sign of that water's quality. A small black nymph or pupa, fished near bottom in the fastest riffles, covers this species well even outside a hatch.\n\nOn the surface, a tiny black dry, nearly invisible to the eye in a riffle's white water, still gets spotted by trout — trust the zone rather than what you can actually see floating.",
        },
      },
    ],
    stages: [
      {
        label: { fr: "Pupe", en: "Pupa" },
        when: { fr: "En fin d'avant-midi et en après-midi, dans les rapides.", en: "Late morning and afternoon, in riffles." },
        how: {
          fr: "Une petite nymphe ou pupe noire, près du fond dans le courant le plus vif.",
          en: "A small black nymph or pupa, near bottom in the fastest current.",
        },
        patternSlugs: ["black-caddis"],
      },
      {
        label: { fr: "Adulte", en: "Adult" },
        when: { fr: "En après-midi, en essaims au-dessus de l'eau vive.", en: "Afternoon, in swarms over fast water." },
        how: {
          fr: "Une minuscule sèche noire, dérivée dans le courant blanc.",
          en: "A tiny black dry, drifted through the white water.",
        },
        patternSlugs: ["griffiths-gnat"],
      },
    ],
  },

  // ------------------------------------------------------- GREEN ROCK WORM
  {
    hatchId: "green-rock-worm",
    metaTitle: {
      fr: "Rhyacophila spp. — le Green Rock Worm, la larve qui ne construit rien",
      en: "Rhyacophila spp. — the Green Rock Worm, the larva that builds nothing",
    },
    metaDescription: {
      fr: "Identification et pêche du Green Rock Worm (Rhyacophila spp.) au Québec : la seule larve de trichoptère prédatrice et sans abri de ce guide, et pourquoi elle reste une des meilleures nymphes hors éclosion.",
      en: "Identifying and fishing the Green Rock Worm (Rhyacophila spp.) in Québec: the only shelterless, predatory caddis larva in this guide, and why it stays one of the best nymphs between hatches.",
    },
    intro: {
      fr: "Toutes les autres larves de trichoptère de ce guide construisent quelque chose — un fourreau, un filet, une retraite. Le Green Rock Worm ne construit rien du tout : elle chasse à découvert sur les roches, et c'est justement ce qui en fait une des nymphes les plus fiables de toute l'année.",
      en: "Every other caddis larva in this guide builds something — a case, a net, a retreat. The Green Rock Worm builds nothing at all: it hunts out in the open on bare rock, and that's exactly what makes it one of the most reliable nymphs of the whole year.",
    },
    idMarks: [
      {
        fr: "Larve verte vif à olive, sans fourreau ni retraite d'aucune sorte — nue sur la roche.",
        en: "Bright green to olive larva, with no case or shelter of any kind — bare on the rock.",
      },
      {
        fr: "Corps arqué et robuste, pattes bien développées pour se déplacer activement plutôt que rester fixe.",
        en: "A robust, arched body, with well-developed legs for actively moving rather than staying put.",
      },
      {
        fr: "Présente toute l'année, dans presque tous les types de courant — pas liée à une seule éclosion précise.",
        en: "Present year-round, in almost every type of current — not tied to one specific hatch.",
      },
      {
        fr: "Larve prédatrice, contrairement à la plupart des autres trichoptères qui filtrent ou broutent.",
        en: "A predatory larva, unlike most other caddisflies, which filter-feed or graze.",
      },
    ],
    confusedWith: {
      fr: "Une larve de Little Black Caddis délogée de son tube, mais celle-ci est bien plus petite et jamais aussi verte. Ne pas confondre avec une larve de trichoptère porte-fourreau — le Green Rock Worm n'en construit jamais.",
      en: "A dislodged Little Black Caddis larva, but that one is much smaller and never as green. Don't confuse it with a case-building caddis larva — the Green Rock Worm never builds one at all.",
    },
    sections: [
      {
        heading: { fr: "Une chasseuse, pas une filtreuse", en: "A hunter, not a filter-feeder" },
        body: {
          fr: "Contrairement au Spotted Sedge, qui tisse un filet, ou au Grannom, qui transporte un fourreau, la larve du genre Rhyacophila ne construit rien du tout. Elle se déplace librement sur les roches et chasse activement d'autres petits invertébrés — un comportement de prédateur, rare chez les trichoptères, qui en fait presque un petit équivalent aquatique d'une chenille chasseuse.\n\nCette absence totale d'abri la rend particulièrement vulnérable au courant : au moindre coup d'eau, elle se fait déloger et emporter dans la dérive, bien plus souvent qu'une larve protégée dans son fourreau ou son filet.",
          en: "Unlike the Spotted Sedge, which spins a net, or the Grannom, which carries a case, the genus Rhyacophila's larva builds nothing at all. It moves freely over the rocks and actively hunts other small invertebrates — predatory behaviour that's rare among caddisflies, making it almost a small aquatic equivalent of a hunting caterpillar.\n\nThat total lack of shelter leaves it especially exposed to current: the smallest surge of water dislodges it and sweeps it into the drift, far more often than a larva protected inside a case or a net.",
        },
      },
      {
        heading: { fr: "Toujours dans la dérive, jamais dans une éclosion précise", en: "Always in the drift, never tied to one hatch" },
        body: {
          fr: "Parce qu'elle n'a pas de retraite fixe, cette larve se retrouve régulièrement emportée dans le courant toute l'année, sans lien avec une émergence synchronisée précise. Ça en fait une nymphe fiable douze mois par année plutôt qu'une imitation à sortir pour une fenêtre de deux semaines.\n\nOn la trouve dans à peu près tous les types de courant — rapides, radiers, veines modérées — ce qui en fait un choix polyvalent quand rien de spécifique ne semble éclore.",
          en: "Because it has no fixed retreat, this larva regularly ends up swept into the current year-round, with no tie to a specific synchronized emergence. That makes it a reliable nymph twelve months a year rather than a pattern you pull out for a two-week window.\n\nIt turns up in almost every kind of current — rapids, riffles, moderate seams — which makes it a versatile choice when nothing specific seems to be hatching.",
        },
      },
      {
        heading: { fr: "Une des meilleures nymphes hors éclosion", en: "One of the best nymphs between hatches" },
        body: {
          fr: "Quand rien n'éclot visiblement et que la truite se nourrit malgré tout sous la surface, une nymphe verte de type Green Rock Worm couvre une bonne partie de ce qui dérive réellement — puisque cette larve se retrouve dans le courant en continu plutôt qu'en réponse à un signal précis.\n\nPêchez-la près du fond, dans les mêmes veines de courant soutenu où elle vit, en dérive naturelle sans animation particulière.",
          en: "When nothing is visibly hatching and trout are still feeding below the surface, a green Rock Worm–style nymph covers a good share of what's actually drifting — since this larva ends up in the current continuously rather than in response to one specific trigger.\n\nFish it near bottom, in the same steady-current seams it lives in, on a natural drift with no particular animation.",
        },
      },
    ],
    stages: [
      {
        label: { fr: "Larve", en: "Larva" },
        when: { fr: "Toute l'année, dans presque tous les types de courant.", en: "Year-round, in nearly every kind of current." },
        how: {
          fr: "Près du fond, en dérive naturelle, sans animation.",
          en: "Near bottom, on a natural drift, with no animation.",
        },
        patternSlugs: ["green-rock-worm"],
      },
      {
        label: { fr: "Pupe", en: "Pupa" },
        when: { fr: "Du printemps à l'été, en fin de journée.", en: "Spring through summer, late in the day." },
        how: {
          fr: "En dérive montante vers la surface.",
          en: "On a rising drift toward the surface.",
        },
        patternSlugs: ["caddis-pupa"],
      },
    ],
  },

  // ------------------------------------------------------ LITTLE SISTER SEDGE
  {
    hatchId: "little-sister-sedge",
    metaTitle: {
      fr: "Cheumatopsyche spp. — le Little Sister Sedge, le format de secours",
      en: "Cheumatopsyche spp. — the Little Sister Sedge, the fallback size",
    },
    metaDescription: {
      fr: "Identification et pêche du Little Sister Sedge (Cheumatopsyche spp.) au Québec : le proche parent du Spotted Sedge, et pourquoi descendre d'une taille règle souvent le problème sans changer de patron.",
      en: "Identifying and fishing the Little Sister Sedge (Cheumatopsyche spp.) in Québec: the Spotted Sedge's close relative, and why dropping a size solves the problem more often than changing the pattern.",
    },
    intro: {
      fr: "Elle partage presque tout avec le Spotted Sedge — la famille, le comportement, l'horaire de soirée — sauf la taille. Sur une eau où les deux se mêlent, c'est souvent ce détail-là, plus que le patron lui-même, qui décide si une truite mord ou refuse.",
      en: "It shares almost everything with the Spotted Sedge — the family, the behaviour, the evening schedule — except size. On water where the two mix, that detail, more than the pattern itself, often decides whether a trout eats or refuses.",
    },
    idMarks: [
      {
        fr: "Corps brun-tan tacheté, ailes en toit — quasi identique au Spotted Sedge, mais taille 16-18.",
        en: "Mottled tan-brown body, tented wings — nearly identical to the Spotted Sedge, but size 16–18.",
      },
      {
        fr: "Même famille filandière (Hydropsychidae) que le Spotted Sedge, mais un genre distinct (Cheumatopsyche).",
        en: "Same net-spinning family (Hydropsychidae) as the Spotted Sedge, but a distinct genus (Cheumatopsyche).",
      },
      {
        fr: "Larve qui tisse aussi un filet fixe, dans des veines légèrement plus douces que celles du Spotted Sedge.",
        en: "Also spins a fixed net, in seams a touch gentler than the Spotted Sedge prefers.",
      },
      {
        fr: "Actif en soirée de juin à septembre, presque toujours mêlé à son plus gros cousin sur la même eau.",
        en: "Active evenings June through September, almost always mixed in with its bigger cousin on the same water.",
      },
    ],
    confusedWith: {
      fr: "Le Spotted Sedge (Hydropsyche spp.), presque identique en forme et en couleur mais nettement plus gros (14-16 contre 16-18) — les deux partagent si souvent la même eau qu'il vaut la peine de vérifier la taille avant de conclure à une seule espèce.",
      en: "The Spotted Sedge (Hydropsyche spp.), nearly identical in shape and colour but clearly bigger (14–16 versus 16–18) — the two share the same water so often it's worth checking size before assuming there's only one species present.",
    },
    sections: [
      {
        heading: { fr: "Deux genres, une seule famille", en: "Two genera, one family" },
        body: {
          fr: "Cheumatopsyche et Hydropsyche (le Spotted Sedge) appartiennent tous deux à la famille des Hydropsychidae, le grand groupe des trichoptères filandiers — mais ce sont deux genres distincts, pas simplement une grande et une petite version du même insecte. Les deux tissent un filet fixe pour capturer les particules du courant, avec la même stratégie générale, mais dans des veines légèrement différentes : le Little Sister Sedge tolère un courant un peu plus doux et un fond un peu plus fin que son cousin.\n\nC'est une distinction subtile sur l'eau, mais utile pour comprendre pourquoi les deux se trouvent souvent côte à côte sans jamais occuper exactement le même centimètre carré de rivière.",
          en: "Cheumatopsyche and Hydropsyche (the Spotted Sedge) both belong to the Hydropsychidae, the big family of net-spinning caddis — but they're two distinct genera, not simply a big and small version of the same insect. Both spin a fixed net to capture particles from the current, using the same general strategy, but in slightly different seams: the Little Sister Sedge tolerates a touch gentler current and a slightly finer bottom than its cousin.\n\nIt's a subtle distinction on the water, but a useful one for understanding why the two so often turn up side by side without ever occupying exactly the same square foot of river.",
        },
      },
      {
        heading: { fr: "Le format de secours", en: "The fallback size" },
        body: {
          fr: "Sur une eau où les deux espèces se mêlent, une truite qui refuse un caddis tan 14 à répétition prend souvent la toute même mouche une fois qu'elle descend d'un ou deux crans — pas parce que le patron était mauvais, mais parce qu'elle avait basculé son attention sur le format du Little Sister Sedge sans qu'on s'en aperçoive.\n\nC'est une des rares situations où changer la taille règle le problème plus souvent que changer complètement de patron.",
          en: "On water where both species mix, a trout refusing a repeated tan 14 caddis will often take the exact same fly once it drops a size or two — not because the pattern was wrong, but because its attention had quietly shifted to the Little Sister Sedge's size without anyone noticing.\n\nIt's one of the rare situations where changing size solves the problem more often than changing the pattern entirely.",
        },
      },
      {
        heading: { fr: "Presque toujours en renfort, rarement seule", en: "Almost always backup, rarely alone" },
        body: {
          fr: "Le Little Sister Sedge se pêche rarement comme une éclosion à part entière : elle vient plutôt renforcer la présence globale de caddis du soir, aux côtés du Spotted Sedge, sur la même période de juin à septembre. Gardez simplement les deux tailles dans la même case de boîte à mouches plutôt que d'essayer de deviner à l'avance laquelle des deux sera active un soir donné.",
          en: "Little Sister Sedge rarely fishes as a standalone hatch — it mostly reinforces the overall evening caddis presence alongside the Spotted Sedge, over the same June-to-September stretch. Just keep both sizes in the same fly box compartment rather than trying to guess in advance which of the two will be active on a given evening.",
        },
      },
    ],
    stages: [
      {
        label: { fr: "Pupe", en: "Pupa" },
        when: { fr: "En fin de journée, avant l'envol des adultes.", en: "Late in the day, ahead of the adult flights." },
        how: {
          fr: "En dérive montante vers la surface, ou juste sous la pellicule.",
          en: "On a rising drift toward the surface, or just under the film.",
        },
        patternSlugs: ["caddis-pupa"],
      },
      {
        label: { fr: "Adulte", en: "Adult" },
        when: { fr: "Le soir, de juin à septembre.", en: "Evening, June through September." },
        how: {
          fr: "Une sèche tan, un cran plus petite que pour le Spotted Sedge, en dérive morte.",
          en: "A tan dry, a size smaller than for the Spotted Sedge, dead-drifted.",
        },
        patternSlugs: ["elk-wing-caddis"],
      },
    ],
  },

  // -------------------------------------------------------- WINTER BLACK STONE
  {
    hatchId: "winter-black-stone",
    metaTitle: {
      fr: "Allocapnia spp. — le plécoptère qui marche sur la neige",
      en: "Allocapnia spp. — the stonefly that walks on snow",
    },
    metaDescription: {
      fr: "Identification et pêche du plécoptère noir d'hiver (Allocapnia spp.) au Québec : comment un insecte aquatique reste actif près du point de congélation, en plein cœur de février.",
      en: "Identifying and fishing the Winter Black Stone (Allocapnia spp.) in Québec: how an aquatic insect stays active near freezing, right in the middle of February.",
    },
    intro: {
      fr: "Oui, il y a bel et bien une éclosion en février. Par un après-midi de redoux, cherchez de petits insectes noirs qui marchent sur la neige en bordure de rivière — la truite, elle, les connaît déjà.",
      en: "Yes, there really is a hatch in February. On a mild afternoon, look for small black insects walking across the snow along the riverbank — trout already know them well.",
    },
    idMarks: [
      {
        fr: "Minuscule, taille 16-18, corps entièrement noir.",
        en: "Tiny, size 16–18, entirely black body.",
      },
      {
        fr: "Ailes courtes, souvent réduites — plusieurs individus, surtout les femelles, sont presque incapables de voler.",
        en: "Short, often reduced wings — many individuals, especially females, are nearly flightless.",
      },
      {
        fr: "Actif seulement par temps doux en plein hiver, marchant sur la neige et la glace en bordure de rivière.",
        en: "Active only in mild winter weather, walking on snow and ice along the riverbank.",
      },
      {
        fr: "Nymphe qui tolère une eau proche du point de congélation, contrairement à presque tous les autres insectes aquatiques.",
        en: "A nymph that tolerates water near freezing, unlike almost every other aquatic insect.",
      },
    ],
    confusedWith: {
      fr: "Rien d'autre n'est actif à cette période — la vraie question n'est pas de le confondre avec un autre insecte, mais de croire qu'aucun insecte n'est actif du tout en février.",
      en: "Nothing else is active at this time of year — the real risk isn't confusing it with another insect, it's assuming no insect is active at all in February.",
    },
    sections: [
      {
        heading: { fr: "Un insecte bâti pour le froid", en: "An insect built for the cold" },
        body: {
          fr: "La plupart des insectes aquatiques cessent toute activité de surface bien avant que l'eau n'approche du point de congélation. Les plécoptères d'hiver comme l'Allocapnia font exception : certaines espèces produisent des composés semblables à un antigel qui protègent leurs tissus contre le froid extrême, ce qui leur permet de rester actifs — et même d'émerger — à des températures qui immobiliseraient à peu près tout le reste de la faune aquatique.\n\nC'est une adaptation rare, et c'est elle qui explique pourquoi on peut littéralement voir des insectes marcher sur la neige en plein cœur de l'hiver québécois.",
          en: "Most aquatic insects shut down all surface activity long before water gets close to freezing. Winter stoneflies like Allocapnia are the exception: some species produce antifreeze-like compounds that protect their tissues from extreme cold, letting them stay active — and even emerge — at temperatures that would immobilize almost everything else in the water.\n\nIt's a rare adaptation, and it's the reason you can literally watch insects walking on snow in the dead of a Québec winter.",
        },
      },
      {
        heading: { fr: "Pourquoi elle marche plutôt qu'elle ne vole", en: "Why it walks instead of flies" },
        body: {
          fr: "Le vol exige des muscles chauds pour fonctionner efficacement, une contrainte sérieuse quand l'air ambiant frôle le point de congélation. Plusieurs plécoptères d'hiver, surtout les femelles, ont des ailes réduites et se déplacent presque exclusivement en marchant — sur la glace, la neige et les roches en bordure, plutôt qu'en volant d'un endroit à l'autre.\n\nC'est ce comportement, précisément, qui les rend visibles : cherchez de petits points noirs qui se déplacent sur la neige propre près de l'eau, un jour de redoux.",
          en: "Flight needs warm muscles to work efficiently, a real constraint when the air is hovering around freezing. Several winter stoneflies, especially females, have reduced wings and get around almost entirely on foot — over ice, snow and streamside rock, rather than flying from place to place.\n\nThat exact behaviour is what makes them visible: look for small black dots moving across clean snow near the water on a mild day.",
        },
      },
      {
        heading: { fr: "Ou rien, ou la seule mouche qui compte", en: "Either nothing, or the only fly that matters" },
        body: {
          fr: "En février, la truite n'a essentiellement rien d'autre à manger en surface — ce qui veut dire que sur les rares journées douces où l'Allocapnia devient active, elle représente une part disproportionnée de tout ce qui se présente à elle. Une petite mouche noire, montée en surface ou juste sous la pellicule, mérite d'être essayée n'importe quel après-midi doux de la mi-hiver, même quand tout semble mort.\n\nCe n'est jamais une éclosion spectaculaire, mais c'est parfois la seule qui compte vraiment à cette période de l'année.",
          en: "In February, trout have essentially nothing else to eat on the surface — which means that on the rare mild days when Allocapnia gets active, it accounts for a disproportionate share of everything on offer. A small black fly, fished on top or just under the film, is worth trying on any mild mid-winter afternoon, even when everything looks dead.\n\nIt's never a spectacular hatch, but sometimes it's the only one that actually matters at that time of year.",
        },
      },
    ],
    stages: [
      {
        label: { fr: "Nymphe", en: "Nymph" },
        when: { fr: "Toute la saison froide, dans le substrat.", en: "All through the cold season, in the substrate." },
        how: {
          fr: "Une petite nymphe noire près du fond, en dérive lente.",
          en: "A small black nymph near bottom, on a slow drift.",
        },
        patternSlugs: ["zebra-midge"],
      },
      {
        label: { fr: "Adulte", en: "Adult" },
        when: { fr: "Les après-midis doux de janvier à avril.", en: "Mild afternoons, January through April." },
        how: {
          fr: "Une minuscule mouche noire, en surface ou juste sous la pellicule.",
          en: "A tiny black fly, on top or just under the film.",
        },
        patternSlugs: ["black-caddis"],
      },
    ],
  },

  // -------------------------------------------------------- EARLY BROWN STONE
  {
    hatchId: "early-brown-stone",
    metaTitle: {
      fr: "Taeniopteryx spp. — l'Early Brown Stone, la vraie première surface du printemps",
      en: "Taeniopteryx spp. — the Early Brown Stone, spring's real first surface bite",
    },
    metaDescription: {
      fr: "Identification et pêche de l'Early Brown Stone (Taeniopteryx spp.) au Québec : souvent le tout premier insecte que la truite mange en surface au printemps, avant même le Quill Gordon.",
      en: "Identifying and fishing the Early Brown Stone (Taeniopteryx spp.) in Québec: often the very first insect trout take off the surface in spring, ahead of even the Quill Gordon.",
    },
    intro: {
      fr: "Le Quill Gordon a la réputation d'ouvrir la saison de la sèche, mais ce plécoptère discret arrive habituellement en premier — souvent avant même que l'eau n'atteigne la température qui déclenche l'éclosion du Quill Gordon.",
      en: "The Quill Gordon gets the credit for opening dry-fly season, but this quiet stonefly usually shows up first — often before the water even reaches the temperature that triggers the Quill Gordon hatch.",
    },
    idMarks: [
      {
        fr: "Taille 14-16, corps brun terne, ailes brun-gris repliées à plat.",
        en: "Size 14–16, dull brown body, grey-brown wings folded flat.",
      },
      {
        fr: "Nymphe robuste dans le gravier, tolérante au froid mais un peu moins extrême que les vrais plécoptères d'hiver.",
        en: "A sturdy gravel nymph, cold-tolerant but a notch less extreme than true winter stoneflies.",
      },
      {
        fr: "Actif toute la journée plutôt qu'à une heure précise, dès que l'air est doux.",
        en: "Active all day rather than at one set hour, as soon as the air turns mild.",
      },
      {
        fr: "Souvent le tout premier insecte que la truite prend en surface au printemps — avant même le Quill Gordon.",
        en: "Often the very first insect trout take off the surface in spring — even before the Quill Gordon.",
      },
    ],
    confusedWith: {
      fr: "Le Quill Gordon, qui suit de près mais reste plus gris et concentré en après-midi plutôt que toute la journée. Le plécoptère noir d'hiver, plus petit et actif encore plus tôt, en plein cœur de l'hiver.",
      en: "The Quill Gordon, which follows close behind but stays greyer and concentrated in the afternoon rather than all day. The winter black stone, smaller and active even earlier, in the dead of winter.",
    },
    sections: [
      {
        heading: { fr: "La vraie première surface du printemps", en: "Spring's real first surface bite" },
        body: {
          fr: "Le Quill Gordon a la réputation d'ouvrir la saison de la sèche, mais l'Early Brown Stone arrive habituellement en premier, souvent avant même que l'eau n'atteigne les 10 °C qui déclenchent l'éclosion du Quill Gordon. C'est le vrai signal que la truite recommence à surveiller la surface après l'hiver — pas encore une éclosion abondante, mais la toute première fenêtre réelle.\n\nSurveillez les jours de redoux dès la fin mars plutôt que d'attendre la mi-avril traditionnellement associée au début de la saison.",
          en: "The Quill Gordon gets the credit for opening dry-fly season, but the Early Brown Stone usually shows up first, often before the water even hits the 10°C that triggers the Quill Gordon hatch. It's the real signal that trout have started watching the surface again after winter — not yet a heavy hatch, but the very first genuine window.\n\nWatch for mild days starting in late March rather than waiting for the mid-April date traditionally tied to the season's start.",
        },
      },
      {
        heading: { fr: "Tolérante au froid, mais pas extrême", en: "Cold-tolerant, but not extreme" },
        body: {
          fr: "Comme le plécoptère noir d'hiver, l'Early Brown Stone supporte une eau froide bien avant que la plupart des autres insectes ne redeviennent actifs — mais elle attend tout de même un redoux, contrairement à l'Allocapnia qui peut sortir en plein cœur de février. Sa nymphe, robuste et logée dans le gravier, passe l'hiver sans problème et n'attend qu'un signal de température pour se mettre en mouvement.\n\nC'est une tolérance au froid réelle, simplement un peu moins extrême que celle de son cousin qui marche sur la neige.",
          en: "Like the winter black stone, the Early Brown Stone handles cold water well before most other insects come back to life — but it still waits for a mild spell, unlike Allocapnia, which can come off in the dead of February. Its nymph, sturdy and tucked into the gravel, rides out the winter without trouble and just needs a temperature cue to get moving.\n\nThat's a real cold tolerance, just a notch less extreme than its snow-walking cousin's.",
        },
      },
      {
        heading: { fr: "Toute la journée, pas juste l'après-midi", en: "All day, not just the afternoon" },
        body: {
          fr: "Contrairement au Quill Gordon, concentré en après-midi une fois que l'eau a eu le temps de se réchauffer, l'Early Brown Stone reste actif toute la journée dès que l'air est doux. Le début du printemps n'a pas encore l'écart de température marqué entre le matin et l'après-midi qu'on observe plus tard en saison, ce qui explique pourquoi cet insecte n'a pas besoin d'attendre un moment précis.\n\nÇa veut dire qu'une journée douce de fin mars ou début avril mérite d'être pêchée du matin au soir, pas seulement pendant une fenêtre étroite.",
          en: "Unlike the Quill Gordon, concentrated in the afternoon once the water has had time to warm, the Early Brown Stone stays active all day as soon as the air turns mild. Early spring doesn't yet have the sharp morning-to-afternoon temperature swing seen later in the season, which is why this insect doesn't need to wait for one specific moment.\n\nThat means a mild late-March or early-April day is worth fishing morning through evening, not just during one narrow window.",
        },
      },
    ],
    stages: [
      {
        label: { fr: "Nymphe", en: "Nymph" },
        when: { fr: "Tout l'hiver et le début du printemps, dans le gravier.", en: "All winter and early spring, in the gravel." },
        how: {
          fr: "Près du fond, en dérive naturelle dès qu'un redoux s'installe.",
          en: "Near bottom, on a natural drift as soon as a mild spell sets in.",
        },
        patternSlugs: ["montana-stone"],
      },
      {
        label: { fr: "Adulte", en: "Adult" },
        when: { fr: "Toute la journée, par temps doux de fin mars à la mi-avril.", en: "All day, mild weather from late March to mid-April." },
        how: {
          fr: "Une petite sèche brune, dérivée toute la journée plutôt qu'à une heure précise.",
          en: "A small brown dry, fished all day rather than at one set hour.",
        },
        patternSlugs: ["black-caddis"],
      },
    ],
  },

  // -------------------------------------------------------- GIANT BLACK STONE
  {
    hatchId: "giant-black-stone",
    metaTitle: {
      fr: "Pteronarcys dorsata — le plus gros insecte de la rivière",
      en: "Pteronarcys dorsata — the biggest bug in the river",
    },
    metaDescription: {
      fr: "Identification et pêche du grand plécoptère noir (Pteronarcys dorsata) au Québec : trois ans sous l'eau, une seule nuit d'émergence, et pourquoi la nymphe se pêche toute l'année.",
      en: "Identifying and fishing the Giant Black Stone (Pteronarcys dorsata) in Québec: three years underwater, one night of emergence, and why the nymph fishes year-round.",
    },
    intro: {
      fr: "Rien d'autre dans nos rivières n'approche sa taille. Le Pteronarcys dorsata passe jusqu'à trois ans sous l'eau avant de devenir, pour une poignée de nuits seulement, le plus gros repas qu'une truite puisse trouver en surface de toute l'année.",
      en: "Nothing else in our rivers comes close to its size. Pteronarcys dorsata spends up to three years underwater before becoming, for a handful of nights only, the biggest meal a trout can find on the surface all year.",
    },
    idMarks: [
      {
        fr: "Le plus gros insecte de nos rivières : nymphe et adulte peuvent dépasser 5 cm, hameçon 4 à 8 en 3XL.",
        en: "The biggest insect in our rivers: nymph and adult can top 5 cm, a size 4–8 hook in 3XL.",
      },
      {
        fr: "Corps noir-brunâtre trapu, ailes repliées à plat sur le dos.",
        en: "A stocky blackish-brown body, wings folded flat against the back.",
      },
      {
        fr: "Nymphe massive et robuste, agrippée sous les grosses roches des rapides — vit jusqu'à trois ans avant d'émerger.",
        en: "A massive, sturdy nymph clinging under large rocks in riffles — lives up to three years before emerging.",
      },
      {
        fr: "L'adulte rampe hors de l'eau la nuit pour éclore, comme la plupart des plécoptères — l'émergence elle-même ne se voit presque jamais.",
        en: "The adult crawls out at night to emerge, like most stoneflies — the emergence itself is almost never seen.",
      },
    ],
    confusedWith: {
      fr: "Le Golden Stone, comportement général similaire mais nettement plus petit et doré plutôt que noir. À cette taille, rien d'autre sur nos rivières ne s'en approche vraiment.",
      en: "The Golden Stone, similar overall behaviour but clearly smaller and golden rather than black. At this size, nothing else on our rivers really comes close.",
    },
    sections: [
      {
        heading: { fr: "Le plus gros insecte de la rivière", en: "The biggest bug in the river" },
        body: {
          fr: "Rien d'autre dans ce guide n'approche la taille du Pteronarcys dorsata — nymphe et adulte peuvent dépasser 5 cm, ce qui correspond à un hameçon 4 ou 6 en 3XL. Pour une truite, un insecte de cette taille représente un repas d'un tout autre ordre de grandeur qu'une éphémère ou un petit trichoptère : le rapport énergie gagnée sur énergie dépensée pour l'attraper est nettement plus favorable.\n\nC'est pourquoi une grosse truite, normalement sélective et économe de ses efforts, va parfois rompre sa routine pour un seul de ces insectes.",
          en: "Nothing else in this guide comes close to Pteronarcys dorsata's size — nymph and adult can top 5 cm, which is a size 4 or 6 hook in 3XL. For a trout, an insect this size is a meal in a whole different order of magnitude from a mayfly or a small caddis: the energy gained versus energy spent catching it tilts sharply in the fish's favour.\n\nThat's why a big trout, normally selective and careful with its effort, will sometimes break routine for just one of these bugs.",
        },
      },
      {
        heading: { fr: "Trois ans sous l'eau, avant une seule nuit", en: "Three years underwater, then one night" },
        body: {
          fr: "La nymphe de Pteronarcys dorsata passe jusqu'à trois ans dans la rivière avant d'être prête à émerger — un des cycles de vie les plus longs de toute la faune aquatique de nos rivières. Ça veut dire qu'à n'importe quel moment de l'année, il y a toujours des nymphes de tous âges présentes sous les roches, ce qui en fait une ressource alimentaire fiable douze mois par année plutôt qu'une population qui apparaît et disparaît selon la saison.\n\nComme pour le Golden Stone, l'adulte rampe hors de l'eau la nuit pour se transformer — l'émergence elle-même reste pratiquement invisible, et ce qui se pêche vraiment, c'est la nymphe, presque toute l'année.",
          en: "The Pteronarcys dorsata nymph spends up to three years in the river before it's ready to emerge — one of the longest life cycles of any aquatic insect in our rivers. That means at any point in the year, nymphs of every age are present under the rocks, making it a reliable food source twelve months a year rather than a population that comes and goes with the season.\n\nAs with the Golden Stone, the adult crawls out of the water at night to transform — the emergence itself stays essentially unseen, and what actually gets fished is the nymph, almost year-round.",
        },
      },
      {
        heading: { fr: "Une nymphe pour l'année, une sèche pour de rares soirs", en: "A year-round nymph, a rare-night dry" },
        body: {
          fr: "Parce que la population est toujours présente sous une forme ou une autre, une grosse nymphe noire pêchée près du fond, dans les mêmes rapides à grosses roches, reste productive n'importe quel mois. L'adulte, lui, ne mérite une sèche que sur les quelques soirées de fin mai à juin où l'émergence bat réellement son plein — et même là, la meilleure fenêtre reste la nuit ou juste avant.\n\nGardez une grosse nymphe noire dans la boîte à l'année longue ; réservez la sèche géante pour les rares soirs où vous savez que ça se passe.",
          en: "Because the population is always present in some form, a big black nymph fished near bottom, in the same boulder-strewn riffles, stays productive any month of the year. The adult only earns a dry on the handful of late-May-to-June evenings when the emergence is genuinely in full swing — and even then, the best window stays night or just before it.\n\nKeep a big black nymph in the box year-round; save the giant dry for the rare evenings you know it's actually happening.",
        },
      },
    ],
    stages: [
      {
        label: { fr: "Nymphe", en: "Nymph" },
        when: { fr: "Toute l'année, sous les grosses roches des rapides.", en: "Year-round, under the large rocks of riffles." },
        how: {
          fr: "Une grosse nymphe noire, près du fond, en dérive naturelle.",
          en: "A big black nymph, near bottom, on a natural drift.",
        },
        patternSlugs: ["montana-stone"],
      },
      {
        label: { fr: "Adulte", en: "Adult" },
        when: { fr: "Quelques soirées seulement, de fin mai à juin, la nuit.", en: "Only a handful of evenings, late May into June, at night." },
        how: {
          fr: "Une grosse sèche noire touffue, dérivée serré contre la végétation riveraine.",
          en: "A big bushy black dry, drifted tight against streamside vegetation.",
        },
        patternSlugs: ["stimulator"],
      },
    ],
  },
];

export function articleFor(hatchId: string): InsectArticle | undefined {
  return INSECT_ARTICLES.find((a) => a.hatchId === hatchId);
}

export const ARTICLE_IDS = new Set(INSECT_ARTICLES.map((a) => a.hatchId));
