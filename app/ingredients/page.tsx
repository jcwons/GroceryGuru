"use client";

import { useEffect, useState } from "react";
import type { Ingredient } from "@/drizzle/schema";
import IngredientForm, {
  ingredientToFormValues,
  type IngredientFormValues,
} from "@/components/IngredientForm";

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/ingredients")
      .then((r) => r.json())
      .then(setIngredients)
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(values: IngredientFormValues) {
    const res = await fetch("/api/ingredients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name.trim(),
        group: values.group || undefined,
        atAldi: values.atAldi,
        location: values.location ? Number(values.location) : undefined,
        alternativeSupermarket: !values.atAldi
          ? values.alternativeSupermarket || undefined
          : undefined,
      }),
    });

    if (!res.ok) throw new Error("Failed to save");

    const created: Ingredient = await res.json();
    setIngredients((prev) =>
      [...prev, created].sort((a, b) => a.name.localeCompare(b.name))
    );
    setShowAddForm(false);
  }

  async function handleEdit(id: string, values: IngredientFormValues) {
    const res = await fetch(`/api/ingredients/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name.trim(),
        group: values.group || undefined,
        atAldi: values.atAldi,
        location: values.location ? Number(values.location) : undefined,
        alternativeSupermarket: !values.atAldi
          ? values.alternativeSupermarket || undefined
          : undefined,
      }),
    });

    if (!res.ok) throw new Error("Failed to update");

    const updated: Ingredient = await res.json();
    setIngredients((prev) =>
      prev
        .map((ing) => (ing.id === id ? updated : ing))
        .sort((a, b) => a.name.localeCompare(b.name))
    );
    setEditingId(null);
  }

  if (loading) {
    return <p className="text-gray-400 text-center mt-12">Loading ingredients…</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Ingredients</h2>
        <button
          onClick={() => {
            setShowAddForm((v) => !v);
            setEditingId(null);
          }}
          className="px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-medium"
        >
          {showAddForm ? "Cancel" : "+ New"}
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="p-4 rounded-xl border border-gray-200 dark:border-slate-700">
          <IngredientForm
            onSave={handleAdd}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* Ingredient list */}
      {ingredients.length === 0 ? (
        <p className="text-gray-400 text-center mt-8">No ingredients yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {ingredients.map((ing) =>
            editingId === ing.id ? (
              // Inline edit form
              <li
                key={ing.id}
                className="p-4 rounded-xl border border-green-300 dark:border-green-700"
              >
                <IngredientForm
                  initial={ingredientToFormValues(ing)}
                  onSave={(values) => handleEdit(ing.id, values)}
                  onCancel={() => setEditingId(null)}
                  saveLabel="Update Ingredient"
                />
              </li>
            ) : (
              // Normal row
              <li
                key={ing.id}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-slate-700"
              >
                <div>
                  <p className="font-medium">{ing.name}</p>
                  {ing.group && (
                    <p className="text-xs text-gray-400">{ing.group}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300">
                    {ing.atAldi ? "ALDI" : (ing.alternativeSupermarket ?? "—")}
                  </span>
                  <button
                    onClick={() => {
                      setEditingId(ing.id);
                      setShowAddForm(false);
                    }}
                    aria-label={`Edit ${ing.name}`}
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    ✏️
                  </button>
                </div>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}
