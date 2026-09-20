// Structural checks on the hand-written content that has no database to keep it
// honest: the hatch chart, the entomology articles and the insect icons.
//
// These three files reference each other by bare string id — a hatch id, a
// product slug — with nothing enforcing that the other side exists. A typo
// doesn't crash anything, it just makes a link, an icon or a whole article
// quietly disappear from the page, which is the kind of thing nobody notices
// for months. Run with `npm run check:content`.
//
// Product slugs are checked against the database only when one is reachable, so
// this still runs (and still catches everything else) in a sandbox without one.
import { HATCHES, dayOfYear, type Hatch } from "../src/lib/hatches";
import { INSECT_ARTICLES } from "../src/lib/insect-articles";
import { INSECT_STYLE } from "../src/components/InsectIcon";

const problems: string[] = [];
const warnings: string[] = [];

function fail(msg: string) {
  problems.push(msg);
}
function warn(msg: string) {
  warnings.push(msg);
}

const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function checkDay(label: string, [month, day]: readonly [number, number]) {
  if (month < 1 || month > 12) fail(`${label}: month ${month} is not 1-12`);
  else if (day < 1 || day > DAYS_IN_MONTH[month - 1]) {
    fail(`${label}: day ${day} is not valid for month ${month}`);
  }
}

// ---------------------------------------------------------------- hatches
const ids = new Set<string>();
for (const h of HATCHES) {
  const at = `hatch "${h.id}"`;
  if (ids.has(h.id)) fail(`${at}: duplicate id`);
  ids.add(h.id);

  if (!/^[a-z0-9-]+$/.test(h.id)) fail(`${at}: id is not a url-safe slug`);
  for (const field of ["scientific", "nameFr", "nameEn", "noteFr", "noteEn"] as const) {
    if (!h[field]?.trim()) fail(`${at}: ${field} is empty`);
  }

  checkDay(`${at} active.from`, h.active.from);
  checkDay(`${at} active.to`, h.active.to);
  if (dayOfYear(h.active.to) < dayOfYear(h.active.from)) {
    fail(`${at}: active window ends before it starts`);
  }

  if (h.peaks.length === 0) warn(`${at}: no peak window`);
  for (const [i, p] of h.peaks.entries()) {
    checkDay(`${at} peak ${i} from`, p.from);
    checkDay(`${at} peak ${i} to`, p.to);
    if (dayOfYear(p.to) < dayOfYear(p.from)) fail(`${at}: peak ${i} ends before it starts`);
    if (
      dayOfYear(p.from) < dayOfYear(h.active.from) ||
      dayOfYear(p.to) > dayOfYear(h.active.to)
    ) {
      fail(`${at}: peak ${i} falls outside the active window`);
    }
  }

  if (h.sizes.length === 0) fail(`${at}: no hook sizes`);
  for (const s of h.sizes) {
    if (!Number.isInteger(s) || s < 1 || s > 32) fail(`${at}: hook size ${s} is out of range`);
  }
  const ascending = [...h.sizes].sort((a, b) => a - b);
  if (h.sizes.join() !== ascending.join()) {
    warn(`${at}: hook sizes are not in ascending order (${h.sizes.join(", ")})`);
  }

  if (h.patternSlugs.length === 0) warn(`${at}: no patterns linked`);
  if (new Set(h.patternSlugs).size !== h.patternSlugs.length) {
    fail(`${at}: duplicate pattern slug`);
  }

  if (!INSECT_STYLE[h.id]) fail(`${at}: no InsectIcon entry — renders as a blank badge`);
}

// --------------------------------------------------------------- articles
const articleIds = new Set<string>();
for (const a of INSECT_ARTICLES) {
  const at = `article "${a.hatchId}"`;
  if (articleIds.has(a.hatchId)) fail(`${at}: duplicate article`);
  articleIds.add(a.hatchId);

  if (!ids.has(a.hatchId)) fail(`${at}: no hatch with this id — the page 404s`);

  for (const [field, value] of [
    ["metaTitle", a.metaTitle],
    ["metaDescription", a.metaDescription],
    ["intro", a.intro],
    ["confusedWith", a.confusedWith],
  ] as const) {
    if (!value.fr?.trim()) fail(`${at}: ${field}.fr is empty`);
    if (!value.en?.trim()) fail(`${at}: ${field}.en is empty`);
  }

  // Search engines truncate past roughly these lengths, so an over-long one is
  // a silently cropped result rather than an error.
  if (a.metaTitle.fr.length > 70) warn(`${at}: metaTitle.fr is ${a.metaTitle.fr.length} chars`);
  if (a.metaTitle.en.length > 70) warn(`${at}: metaTitle.en is ${a.metaTitle.en.length} chars`);
  if (a.metaDescription.fr.length > 175) {
    warn(`${at}: metaDescription.fr is ${a.metaDescription.fr.length} chars`);
  }
  if (a.metaDescription.en.length > 175) {
    warn(`${at}: metaDescription.en is ${a.metaDescription.en.length} chars`);
  }

  if (a.idMarks.length === 0) fail(`${at}: no id marks — the chart shows a bare row`);
  a.idMarks.forEach((m, i) => {
    if (!m.fr?.trim()) fail(`${at}: idMarks[${i}].fr is empty`);
    if (!m.en?.trim()) fail(`${at}: idMarks[${i}].en is empty`);
  });

  if (a.sections.length === 0) fail(`${at}: no sections`);
  a.sections.forEach((s, i) => {
    for (const k of ["heading", "body"] as const) {
      if (!s[k].fr?.trim()) fail(`${at}: sections[${i}].${k}.fr is empty`);
      if (!s[k].en?.trim()) fail(`${at}: sections[${i}].${k}.en is empty`);
    }
  });

  if (a.stages.length === 0) fail(`${at}: no life stages`);
  a.stages.forEach((s, i) => {
    for (const k of ["label", "when", "how"] as const) {
      if (!s[k].fr?.trim()) fail(`${at}: stages[${i}].${k}.fr is empty`);
      if (!s[k].en?.trim()) fail(`${at}: stages[${i}].${k}.en is empty`);
    }
    if (s.patternSlugs.length === 0) warn(`${at}: stages[${i}] links no pattern`);
  });
}

for (const h of HATCHES) {
  if (!articleIds.has(h.id)) warn(`hatch "${h.id}": no article — the name doesn't link out`);
}

// ------------------------------------------------- pattern slugs, if we can
const referencedSlugs = new Set<string>([
  ...HATCHES.flatMap((h: Hatch) => h.patternSlugs),
  ...INSECT_ARTICLES.flatMap((a) => a.stages.flatMap((s) => s.patternSlugs)),
]);

async function checkSlugsAgainstDatabase() {
  if (!process.env.DATABASE_URL) {
    warn(`no DATABASE_URL — skipped checking ${referencedSlugs.size} pattern slugs`);
    return;
  }
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  try {
    const live = await prisma.product.findMany({
      where: { active: true },
      select: { slug: true },
    });
    const active = new Set(live.map((p) => p.slug));
    for (const slug of [...referencedSlugs].sort()) {
      if (!active.has(slug)) {
        fail(`pattern slug "${slug}" is referenced but is not an active product — the link vanishes`);
      }
    }
  } catch {
    warn("could not reach the database — skipped the pattern-slug check");
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  await checkSlugsAgainstDatabase();

  console.log(
    `Checked ${HATCHES.length} hatches, ${INSECT_ARTICLES.length} articles, ` +
      `${referencedSlugs.size} referenced pattern slugs.`
  );
  for (const w of warnings) console.log(`  warning  ${w}`);
  for (const p of problems) console.log(`  PROBLEM  ${p}`);

  if (problems.length > 0) {
    console.log(`\n${problems.length} problem(s).`);
    process.exit(1);
  }
  console.log(
    warnings.length > 0 ? `\n${warnings.length} warning(s), no problems.` : "\nAll good."
  );
}

main();
