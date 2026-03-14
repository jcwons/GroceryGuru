"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ShoppingList from "@/components/ShoppingList";
import type { Ingredient } from "@/drizzle/schema";

type GroupedIngredients = Record<string, Ingredient[]>;

function ShoppingListContent() {
  const searchParams = useSearchParams();
  const recipeIds = searchParams.get("recipes") ?? "";

  const [grouped, setGrouped] = useState<GroupedIngredients>({});
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!recipeIds) return;

    fetch(`/api/shopping-list?recipes=${recipeIds}`)
      .then((r) => r.json())
      .then((data) => {
        setGrouped(data.grouped ?? {});
        setAllIngredients(data.ingredients ?? []);
      })
      .finally(() => setLoading(false));
  }, [recipeIds]);

  if (loading) {
    return <p className="text-gray-400 text-center mt-12">Building your list…</p>;
  }

  if (allIngredients.length === 0) {
    return (
      <p className="text-gray-400 text-center mt-12">
        No ingredients found for the selected recipes.
      </p>
    );
  }

  return <ShoppingList grouped={grouped} allIngredients={allIngredients} />;
}

export default function ShoppingListPage() {
  return (
    <Suspense fallback={<p className="text-gray-400 text-center mt-12">Loading…</p>}>
      <ShoppingListContent />
    </Suspense>
  );
}
