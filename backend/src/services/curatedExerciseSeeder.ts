import { CURATED_EXERCISES } from "../data/curatedExercises";
import { prisma } from "../utils/database";

/**
 * Upserts the curated exercise catalog on startup. Idempotent — keyed by slug.
 * Curated rows carry source = "curated"; the program generator prefers them
 * over the noisier wger import.
 */
export async function seedCuratedExercises(): Promise<void> {
  for (const ex of CURATED_EXERCISES) {
    await prisma.exerciseCatalog.upsert({
      where: { slug: ex.slug },
      update: {
        nameEn: ex.nameEn,
        nameRu: ex.nameRu,
        category: ex.category,
        primaryMuscles: ex.primaryMuscles,
        secondaryMuscles: ex.secondaryMuscles,
        equipment: ex.equipment,
        difficulty: ex.difficulty,
        source: "curated"
      },
      create: {
        slug: ex.slug,
        nameEn: ex.nameEn,
        nameRu: ex.nameRu,
        category: ex.category,
        primaryMuscles: ex.primaryMuscles,
        secondaryMuscles: ex.secondaryMuscles,
        equipment: ex.equipment,
        difficulty: ex.difficulty,
        source: "curated"
      }
    });
  }
}
