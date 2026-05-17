#!/usr/bin/env node
// One-off tool: match the curated exercise catalog to free-exercise-db
// (public domain, Unlicense) and download one photo per exercise into
// frontend/public/exercises/<slug>.jpg.
//
//   node frontend/scripts/fetch-exercise-images.mjs            review matches
//   node frontend/scripts/fetch-exercise-images.mjs --download download images

import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..", "..");
const curatedPath = join(repoRoot, "backend", "src", "data", "curatedExercises.ts");
const outDir = join(repoRoot, "frontend", "public", "exercises");

const DATASET_URL = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json";
const IMAGE_BASE = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/";

const DOWNLOAD = process.argv.includes("--download");

// Manual fixes: slug -> exact free-exercise-db name. An empty string means
// "no good match in the dataset — skip, exercise stays image-less".
// Slugs not listed here resolve via the automatic name matcher.
const OVERRIDES = {
  "barbell-bench-press": "Barbell Bench Press - Medium Grip",
  "incline-dumbbell-bench-press": "Incline Dumbbell Press",
  "machine-chest-press": "Leverage Chest Press",
  "push-up": "Pushups",
  "chest-dip": "Parallel Bar Dip",
  "dumbbell-fly": "Dumbbell Flyes",
  "pec-deck": "Butterfly",
  "resistance-band-chest-press": "",
  "barbell-overhead-press": "Barbell Shoulder Press",
  "pike-push-up": "",
  "dumbbell-lateral-raise": "Side Lateral Raise",
  "band-lateral-raise": "",
  "cable-triceps-pushdown": "Triceps Pushdown",
  "overhead-dumbbell-triceps-extension": "Standing Dumbbell Triceps Extension",
  "lying-barbell-triceps-extension": "Lying Triceps Press",
  "bench-dip": "Bench Dips",
  "triceps-dip": "Parallel Bar Dip",
  "diamond-push-up": "",
  "band-triceps-pushdown": "",
  "pull-up": "Pullups",
  "lat-pulldown": "Wide-Grip Lat Pulldown",
  "band-lat-pulldown": "",
  "dumbbell-row": "One-Arm Dumbbell Row",
  "seated-cable-row": "Seated Cable Rows",
  "band-seated-row": "",
  "conventional-deadlift": "Barbell Deadlift",
  "dumbbell-rear-delt-fly": "Bent Over Dumbbell Rear Delt Raise With Head On Bench",
  "cable-face-pull": "Face Pull",
  "reverse-pec-deck": "Reverse Flyes",
  "band-face-pull": "",
  "cable-curl": "Standing Biceps Cable Curl",
  "band-curl": "",
  "barbell-back-squat": "Barbell Squat",
  "leg-extension": "Leg Extensions",
  "lying-leg-curl": "Lying Leg Curls",
  "nordic-hamstring-curl": "",
  "bulgarian-split-squat": "Split Squat with Dumbbells",
  "walking-lunge": "Bodyweight Walking Lunge",
  "dumbbell-step-up": "Dumbbell Step Ups",
  "standing-calf-raise": "Standing Calf Raises",
  "bodyweight-calf-raise": "Standing Calf Raises",
  "crunch": "Crunches",
  "ab-wheel-rollout": "Ab Roller",
  "mountain-climber": "Mountain Climbers"
};

function parseCurated(src) {
  const out = [];
  const re = /slug:\s*"([^"]+)"[\s\S]*?nameEn:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(src))) out.push({ slug: m[1], nameEn: m[2] });
  return out;
}

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const tokenize = (s) => new Set(norm(s).split(" ").filter(Boolean));

// Rank dataset entries: prefer covering all of our words, then fewest extra
// words, then shorter name. This beats the "Guillotine/Clock variant" trap.
function rank(ourName, dataset) {
  const ours = tokenize(ourName);
  return dataset
    .map((d) => {
      const theirs = tokenize(d.name);
      let inter = 0;
      for (const t of ours) if (theirs.has(t)) inter++;
      return { d, coverage: inter / (ours.size || 1), extras: theirs.size - inter };
    })
    .sort(
      (a, b) =>
        b.coverage - a.coverage || a.extras - b.extras || a.d.name.length - b.d.name.length
    );
}

async function main() {
  const curated = parseCurated(readFileSync(curatedPath, "utf8"));
  const res = await fetch(DATASET_URL);
  if (!res.ok) throw new Error(`Dataset fetch failed: ${res.status}`);
  const dataset = await res.json();
  const byName = new Map(dataset.map((d) => [d.name, d]));
  console.log(`Curated: ${curated.length} | free-exercise-db: ${dataset.length}\n`);

  const resolved = curated.map((ex) => {
    if (ex.slug in OVERRIDES) {
      const name = OVERRIDES[ex.slug];
      const d = name ? byName.get(name) : null;
      return { ...ex, match: d?.name ?? null, image: d?.images?.[0] ?? null, coverage: 1, override: true };
    }
    const top = rank(ex.nameEn, dataset);
    const best = top[0];
    return {
      ...ex,
      match: best?.d.name ?? null,
      image: best?.d.images?.[0] ?? null,
      coverage: best?.coverage ?? 0,
      alts: top.slice(0, 3)
    };
  });

  if (!DOWNLOAD) {
    const withImage = resolved.filter((r) => r.image);
    const noImage = resolved.filter((r) => !r.image);
    console.log(`=== FINAL MAPPING (${withImage.length} with photo) ===`);
    for (const r of resolved) {
      const tag = r.image ? `-> "${r.match}"` : "-> (no photo)";
      console.log(`  ${r.slug.padEnd(34)} ${tag}`);
    }
    console.log(`\n=== NO PHOTO (${noImage.length}) ===`);
    console.log("  " + noImage.map((r) => r.slug).join(", "));
    console.log(`\nRun with --download to fetch the ${withImage.length} photos.`);
    return;
  }

  mkdirSync(outDir, { recursive: true });
  let ok = 0;
  let skipped = 0;
  for (const r of resolved) {
    if (!r.image) {
      console.log(`skip  ${r.slug} (no match)`);
      skipped++;
      continue;
    }
    const imgRes = await fetch(IMAGE_BASE + r.image);
    if (!imgRes.ok) {
      console.log(`fail  ${r.slug} (${imgRes.status})`);
      skipped++;
      continue;
    }
    writeFileSync(join(outDir, `${r.slug}.jpg`), Buffer.from(await imgRes.arrayBuffer()));
    console.log(`ok    ${r.slug}.jpg  <- "${r.match}"`);
    ok++;
  }
  console.log(`\nDownloaded ${ok}, skipped ${skipped} -> ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
