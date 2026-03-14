import type { Ingredient } from "@/drizzle/schema";

type GroupedIngredients = Record<string, Ingredient[]>;

export function groupIngredientsBySupermarket(
  ingredients: Ingredient[]
): GroupedIngredients {
  return ingredients.reduce<GroupedIngredients>((acc, ing) => {
    const store = ing.atAldi
      ? "ALDI"
      : (ing.alternativeSupermarket ?? "Other");

    if (!acc[store]) acc[store] = [];
    acc[store].push(ing);
    return acc;
  }, {});
}

export function buildWhatsAppMessage(ingredients: Ingredient[]): string {
  const grouped = groupIngredientsBySupermarket(ingredients);

  const lines: string[] = ["🛒 Grocery List", ""];

  for (const [store, items] of Object.entries(grouped)) {
    lines.push(store);
    for (const item of items) {
      lines.push(`- ${item.name}`);
    }
    lines.push("");
  }

  return lines.join("\n").trim();
}

export function getWhatsAppShareUrl(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
