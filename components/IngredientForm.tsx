"use client";

import { useState } from "react";
import type { Ingredient } from "@/drizzle/schema";

const SUPERMARKETS = ["REWE", "EDEKA", "Lidl", "Netto", "Other"];

export interface IngredientFormValues {
  name: string;
  group: string;
  atAldi: boolean;
  location: string;
  alternativeSupermarket: string;
}

interface Props {
  /** Pre-fill the form for editing. Leave undefined for a blank "add" form. */
  initial?: Partial<IngredientFormValues>;
  onSave: (values: IngredientFormValues) => Promise<void>;
  onCancel: () => void;
  saveLabel?: string;
}

export default function IngredientForm({
  initial,
  onSave,
  onCancel,
  saveLabel = "Save Ingredient",
}: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [group, setGroup] = useState(initial?.group ?? "");
  const [atAldi, setAtAldi] = useState(initial?.atAldi ?? false);
  const [location, setLocation] = useState(initial?.location ?? "");
  const [alternativeSupermarket, setAlternativeSupermarket] = useState(
    initial?.alternativeSupermarket ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!name.trim()) return setError("Name is required.");

    setSaving(true);
    setError("");

    try {
      await onSave({ name, group, atAldi, location, alternativeSupermarket });
    } catch {
      setError("Failed to save. Is the ingredient name unique?");
    } finally {
      setSaving(false);
    }
  }

  const inputCls =
    "w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-transparent text-base focus:outline-none focus:ring-2 focus:ring-green-400";

  return (
    <div className="flex flex-col gap-3">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <input
        type="text"
        placeholder="Name *"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={inputCls}
        autoFocus
      />

      <input
        type="text"
        placeholder="Group (e.g. Dairy)"
        value={group}
        onChange={(e) => setGroup(e.target.value)}
        className={inputCls}
      />

      <label className="flex items-center gap-3 cursor-pointer py-1">
        <input
          type="checkbox"
          checked={atAldi}
          onChange={(e) => setAtAldi(e.target.checked)}
          className="w-5 h-5 accent-green-500"
        />
        <span>Available at ALDI</span>
      </label>

      {!atAldi && (
        <select
          value={alternativeSupermarket}
          onChange={(e) => setAlternativeSupermarket(e.target.value)}
          className={inputCls}
        >
          <option value="">Select supermarket…</option>
          {SUPERMARKETS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      )}

      <input
        type="number"
        placeholder="Aisle / location (optional)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className={inputCls}
      />

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex-1 py-3 rounded-xl bg-green-500 text-white font-semibold active:scale-95 transition-transform disabled:opacity-40"
        >
          {saving ? "Saving…" : saveLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-3 rounded-xl border border-gray-300 dark:border-slate-600 text-sm font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/** Converts a DB Ingredient into IngredientFormValues for pre-filling an edit form. */
export function ingredientToFormValues(ing: Ingredient): IngredientFormValues {
  return {
    name: ing.name,
    group: ing.group ?? "",
    atAldi: ing.atAldi,
    location: ing.location?.toString() ?? "",
    alternativeSupermarket: ing.alternativeSupermarket ?? "",
  };
}
