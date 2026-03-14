import { NextResponse } from "next/server";
import { getAllRecipes, createRecipe } from "@/lib/queries";

export async function GET() {
  try {
    const data = await getAllRecipes();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, ingredientIds = [] } = body as {
      name: string;
      ingredientIds: string[];
    };

    if (!name?.trim()) {
      return NextResponse.json({ error: "Recipe name is required" }, { status: 400 });
    }

    const id = await createRecipe(name.trim(), ingredientIds);
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create recipe" }, { status: 500 });
  }
}
