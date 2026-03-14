"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Recipe } from "@/drizzle/schema";

export default function RecipesPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/recipes")
      .then((r) => r.json())
      .then(setRecipes)
      .finally(() => setLoading(false));
  }, []);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleGenerate() {
    if (selected.size === 0) return;
    const ids = [...selected].join(",");
    router.push(`/shopping-list?recipes=${ids}`);
  }

  if (loading) {
    return <p className="text-gray-400 text-center mt-12">Loading recipes…</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold">Select Recipes</h2>

      <input
        type="search"
        placeholder="Search recipes…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-transparent text-base focus:outline-none focus:ring-2 focus:ring-green-400"
      />

      {recipes.length === 0 ? (
        <p className="text-gray-400 text-center mt-8">
          No recipes yet.{" "}
          <a href="/add-recipe" className="underline text-blue-500">
            Add one!
          </a>
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {recipes
            .filter((r) =>
              r.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((recipe) => (
            <li key={recipe.id}>
              <label className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-slate-700 active:bg-gray-50 dark:active:bg-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-green-500"
                  checked={selected.has(recipe.id)}
                  onChange={() => toggle(recipe.id)}
                />
                <span className="text-base">{recipe.name}</span>
              </label>
            </li>
            ))}
        </ul>
      )}

      <button
        onClick={handleGenerate}
        disabled={selected.size === 0}
        className="mt-auto w-full py-4 rounded-xl bg-green-500 text-white font-semibold text-base active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Generate Shopping List ({selected.size})
      </button>
    </div>
  );
}
