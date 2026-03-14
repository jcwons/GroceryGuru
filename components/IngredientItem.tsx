"use client";

/**
 * IngredientItem
 *
 * Renders a single ingredient row with swipe-to-remove support.
 * Swipe gesture is stubbed out and ready to be wired to Framer Motion.
 *
 * To add Framer Motion swipe:
 *   1. Wrap the inner div with <motion.div drag="x" onDragEnd={...} />
 *   2. Animate x offset and opacity on removal
 */

import type { Ingredient } from "@/drizzle/schema";

interface Props {
  ingredient: Ingredient;
  onRemove: (id: string) => void;
}

export default function IngredientItem({ ingredient, onRemove }: Props) {
  return (
    // TODO: Replace with <motion.div> for swipe gesture support
    <li className="relative flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
      <span className="text-base">{ingredient.name}</span>

      {/* Remove button — visible tap target; will be hidden behind swipe gesture */}
      <button
        onClick={() => onRemove(ingredient.id)}
        aria-label={`Remove ${ingredient.name}`}
        className="ml-4 text-gray-300 dark:text-slate-600 hover:text-red-400 active:text-red-500 transition-colors text-xl leading-none"
      >
        ×
      </button>
    </li>
  );
}
