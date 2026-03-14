import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ingredients } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, group, atAldi, location, alternativeSupermarket } = body as {
      name: string;
      group?: string;
      atAldi: boolean;
      location?: number;
      alternativeSupermarket?: string;
    };

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const [updated] = await db
      .update(ingredients)
      .set({
        name: name.trim(),
        group: group || null,
        atAldi,
        location: location ?? null,
        alternativeSupermarket: !atAldi ? (alternativeSupermarket || null) : null,
      })
      .where(eq(ingredients.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Ingredient not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update ingredient" }, { status: 500 });
  }
}
