import { db } from "@/lib/db";
import { recipes, ingredients, recipeIngredients } from "@/drizzle/schema";
import { inArray, eq } from "drizzle-orm";

// ─── Recipes ─────────────────────────────────────────────────────────────────

export async function getAllRecipes() {
  return db.select().from(recipes).orderBy(recipes.name);
}

export async function createRecipe(
  name: string,
  ingredientIds: string[]
): Promise<string> {
  const [recipe] = await db.insert(recipes).values({ name }).returning();

  if (ingredientIds.length > 0) {
    await db.insert(recipeIngredients).values(
      ingredientIds.map((ingredientId) => ({
        recipeId: recipe.id,
        ingredientId,
      }))
    );
  }

  return recipe.id;
}

// ─── Ingredients ─────────────────────────────────────────────────────────────

export async function getAllIngredients() {
  return db.select().from(ingredients).orderBy(ingredients.name);
}

export async function createIngredient(data: {
  name: string;
  group?: string;
  atAldi: boolean;
  location?: number;
  alternativeSupermarket?: string;
}) {
  const [ingredient] = await db.insert(ingredients).values(data).returning();
  return ingredient;
}

// ─── Shopping List ────────────────────────────────────────────────────────────

export async function getShoppingListIngredients(recipeIds: string[]) {
  if (recipeIds.length === 0) return [];

  // Join recipe_ingredients → ingredients for all selected recipes
  const rows = await db
    .select({ ingredient: ingredients })
    .from(recipeIngredients)
    .innerJoin(
      ingredients,
      eq(recipeIngredients.ingredientId, ingredients.id)
    )
    .where(inArray(recipeIngredients.recipeId, recipeIds));

  // Deduplicate by ingredient id
  const seen = new Set<string>();
  const unique = rows
    .map((r) => r.ingredient)
    .filter((ing) => {
      if (seen.has(ing.id)) return false;
      seen.add(ing.id);
      return true;
    });

  return unique;
}
