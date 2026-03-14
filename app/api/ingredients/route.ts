import { NextResponse } from "next/server";
import { getAllIngredients, createIngredient } from "@/lib/queries";

export async function GET() {
  try {
    const data = await getAllIngredients();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch ingredients" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, group, atAldi = false, location, alternativeSupermarket } =
      body as {
        name: string;
        group?: string;
        atAldi: boolean;
        location?: number;
        alternativeSupermarket?: string;
      };

    if (!name?.trim()) {
      return NextResponse.json({ error: "Ingredient name is required" }, { status: 400 });
    }

    const ingredient = await createIngredient({
      name: name.trim(),
      group,
      atAldi,
      location,
      alternativeSupermarket,
    });

    return NextResponse.json(ingredient, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create ingredient" }, { status: 500 });
  }
}
