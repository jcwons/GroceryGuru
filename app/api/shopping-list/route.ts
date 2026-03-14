import { NextResponse } from "next/server";
import { getShoppingListIngredients } from "@/lib/queries";
import { groupIngredientsBySupermarket } from "@/lib/whatsapp";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const recipesParam = searchParams.get("recipes");

    if (!recipesParam) {
      return NextResponse.json({ error: "recipes query param is required" }, { status: 400 });
    }

    const recipeIds = recipesParam.split(",").filter(Boolean);
    const ingredients = await getShoppingListIngredients(recipeIds);
    const grouped = groupIngredientsBySupermarket(ingredients);

    return NextResponse.json({ ingredients, grouped });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch shopping list" }, { status: 500 });
  }
}
