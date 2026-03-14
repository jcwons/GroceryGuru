"use client";

import { useState } from "react";
import IngredientItem from "@/components/IngredientItem";
import { buildWhatsAppMessage, getWhatsAppShareUrl } from "@/lib/whatsapp";
import type { Ingredient } from "@/drizzle/schema";

type GroupedIngredients = Record<string, Ingredient[]>;

interface Props {
  grouped: GroupedIngredients;
  allIngredients: Ingredient[];
}

export default function ShoppingList({ grouped, allIngredients }: Props) {
  // Track removed ingredient ids locally
  const [removed, setRemoved] = useState<Set<string>>(new Set());

  function removeIngredient(id: string) {
    setRemoved((prev) => new Set([...prev, id]));
  }

  // Filter out removed items from each group
  const visibleGrouped = Object.fromEntries(
    Object.entries(grouped)
      .map(([store, items]) => [store, items.filter((i) => !removed.has(i.id))])
      .filter(([, items]) => items.length > 0)
  );

  const visibleIngredients = allIngredients.filter((i) => !removed.has(i.id));

  const shareMessage = buildWhatsAppMessage(visibleIngredients);
  const shareUrl = getWhatsAppShareUrl(shareMessage);

  if (visibleIngredients.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 mt-12">
        <p className="text-gray-400">All items checked off!</p>
        <a href="/recipes" className="text-blue-500 underline text-sm">
          ← Back to recipes
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Shopping List</h2>
        <span className="text-sm text-gray-400">{visibleIngredients.length} items</span>
      </div>

      {/* Grouped by supermarket */}
      {Object.entries(visibleGrouped).map(([store, items]) => (
        <section key={store}>
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            {store}
          </h3>
          <ul className="flex flex-col gap-2">
            {items.map((ing) => (
              <IngredientItem
                key={ing.id}
                ingredient={ing}
                onRemove={removeIngredient}
              />
            ))}
          </ul>
        </section>
      ))}

      {/* WhatsApp share */}
      <a
        href={shareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-[#25D366] text-white font-semibold text-base active:scale-95 transition-transform"
      >
        <span>Share via WhatsApp</span>
        <span>📤</span>
      </a>

      <a href="/recipes" className="text-center text-sm text-blue-500 underline">
        ← Back to recipes
      </a>
    </div>
  );
}
