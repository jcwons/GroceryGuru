"use client";

/**
 * RecipeList — standalone component for recipe selection.
 * Used by /app/recipes/page.tsx.
 */

import type { Recipe } from "@/drizzle/schema";

interface Props {
  recipes: Recipe[];
  selected: Set<string>;
  onToggle: (id: string) => void;
}

export default function RecipeList({ recipes, selected, onToggle }: Props) {
  if (recipes.length === 0) {
    return (
      <p className="text-gray-400 text-center mt-8">
        No recipes yet.{" "}
        <a href="/add-recipe" className="underline text-blue-500">
          Add one!
        </a>
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {recipes.map((recipe) => (
        <li key={recipe.id}>
          <label className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-slate-700 active:bg-gray-50 dark:active:bg-slate-800 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 accent-green-500"
              checked={selected.has(recipe.id)}
              onChange={() => onToggle(recipe.id)}
            />
            <span className="text-base">{recipe.name}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}
