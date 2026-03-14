"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Ingredient } from "@/drizzle/schema";
import IngredientForm, { type IngredientFormValues } from "@/components/IngredientForm";

export default function AddRecipePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [showNewIngredientForm, setShowNewIngredientForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/ingredients")
      .then((r) => r.json())
      .then(setIngredients);
  }, []);

  function toggleIngredient(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleAddNewIngredient(values: IngredientFormValues) {
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

    if (!res.ok) throw new Error("Failed to save ingredient");

    const created: Ingredient = await res.json();
    setIngredients((prev) =>
      [...prev, created].sort((a, b) => a.name.localeCompare(b.name))
    );
    setSelectedIds((prev) => new Set([...prev, created.id]));
    setShowNewIngredientForm(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError("Recipe name is required.");

    setSaving(true);
    setError("");

    const res = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), ingredientIds: [...selectedIds] }),
    });

    setSaving(false);

    if (res.ok) {
      router.push("/recipes");
    } else {
      setError("Failed to save recipe. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold">Add Recipe</h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Recipe name */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Recipe name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Pasta Bolognese"
          className="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-transparent text-base focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      {/* Ingredient selection */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Ingredients ({selectedIds.size} selected)
        </span>

        <input
          type="search"
          placeholder="Search ingredients…"
          value={ingredientSearch}
          onChange={(e) => setIngredientSearch(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-transparent text-base focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <ul className="flex flex-col gap-1 max-h-64 overflow-y-auto pr-1">
          {ingredients
            .filter((ing) =>
              ing.name.toLowerCase().includes(ingredientSearch.toLowerCase())
            )
            .map((ing) => (
            <li key={ing.id}>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-green-500"
                  checked={selectedIds.has(ing.id)}
                  onChange={() => toggleIngredient(ing.id)}
                />
                <span>{ing.name}</span>
                {ing.atAldi && (
                  <span className="ml-auto text-xs text-gray-400">ALDI</span>
                )}
              </label>
            </li>
            ))}
        </ul>
      </div>

      {/* Add new ingredient */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            New ingredient
          </span>
          <button
            type="button"
            onClick={() => setShowNewIngredientForm((v) => !v)}
            className="text-sm text-green-600 dark:text-green-400 font-medium"
          >
            {showNewIngredientForm ? "Cancel" : "+ Add new"}
          </button>
        </div>

        {showNewIngredientForm && (
          <div className="p-4 rounded-xl border border-gray-200 dark:border-slate-700">
            <IngredientForm
              onSave={handleAddNewIngredient}
              onCancel={() => setShowNewIngredientForm(false)}
              saveLabel="Add Ingredient"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full py-4 rounded-xl bg-green-500 text-white font-semibold text-base active:scale-95 transition-transform disabled:opacity-40"
      >
        {saving ? "Saving…" : "Save Recipe"}
      </button>
    </form>
  );
}
