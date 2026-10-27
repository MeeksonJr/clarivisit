"use client";

import React, { useState } from "react";
import { RecipeItem } from "@/types/visit";
import {
  X,
  Clock,
  Flame,
  ShieldCheck,
  Check,
  Copy,
  ChefHat,
  Utensils,
  Sparkles,
} from "lucide-react";

interface RecipeModalProps {
  recipe: RecipeItem | null;
  onClose: () => void;
  onAddToGroceryList?: (items: string[]) => void;
}

export function RecipeModal({ recipe, onClose, onAddToGroceryList }: RecipeModalProps) {
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!recipe) return null;

  const toggleIngredient = (idx: number) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const copyIngredients = () => {
    const text = [
      `🛒 Shopping List for ${recipe.title}:`,
      ...recipe.ingredients.map((ing) => `• ${ing.amount} ${ing.item}`),
    ].join("\n");

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddAllToGrocery = () => {
    if (onAddToGroceryList) {
      onAddToGroceryList(recipe.ingredients.map((i) => `${i.amount} ${i.item}`));
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/60 dark:bg-slate-950/40">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                {recipe.mealType}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {recipe.glycemicIndex.toUpperCase()} GI
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                <Clock className="w-3 h-3 text-slate-400" />
                {recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins total
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
              {recipe.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {recipe.description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors shrink-0"
            title="Close recipe"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Clinician Rationale Box */}
          <div className="p-4 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200/70 dark:border-teal-900/50 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <div className="font-bold text-teal-950 dark:text-teal-200 uppercase tracking-wider text-[10px]">
                Doctor Directive Alignment
              </div>
              <p className="text-teal-900 dark:text-teal-300 leading-relaxed font-medium">
                {recipe.clinicianRationale}
              </p>
            </div>
          </div>

          {/* Macro Breakdown Grid */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Nutritional Profile per Serving ({recipe.servings} serving{recipe.servings > 1 ? "s" : ""})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
                <div className="text-lg font-black text-slate-900 dark:text-white">
                  {recipe.calories}
                </div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase">Calories</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
                <div className="text-lg font-black text-teal-600 dark:text-teal-400">
                  {recipe.macros.proteinGrams}g
                </div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase">Protein</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
                <div className="text-lg font-black text-sky-600 dark:text-sky-400">
                  {recipe.macros.netCarbsGrams}g
                </div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase">Net Carbs</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
                <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  {recipe.macros.fiberGrams}g
                </div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase">Fiber</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center col-span-2 sm:col-span-1">
                <div className="text-lg font-black text-amber-600 dark:text-amber-400">
                  {recipe.macros.fatGrams}g
                </div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase">Healthy Fat</div>
              </div>
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-teal-500" />
                Ingredients ({recipe.ingredients.length})
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyIngredients}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy List</span>
                    </>
                  )}
                </button>
                {onAddToGroceryList && (
                  <button
                    onClick={handleAddAllToGrocery}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 hover:bg-teal-100 transition-colors"
                  >
                    {addedNotice ? (
                      <>
                        <Check className="w-3 h-3 text-teal-600" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3" />
                        <span>Add All</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {recipe.ingredients.map((ing, idx) => {
                const isChecked = !!checkedIngredients[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleIngredient(idx)}
                    className={`p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer select-none transition-all ${
                      isChecked
                        ? "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-500/50"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        isChecked
                          ? "bg-teal-600 border-teal-600 text-white"
                          : "border-slate-300 dark:border-slate-700"
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className={`font-semibold ${
                          isChecked
                            ? "line-through text-slate-400"
                            : "text-slate-900 dark:text-white"
                        }`}
                      >
                        {ing.item}
                      </span>
                      <span className="text-[11px] text-slate-400 ml-1.5 font-normal">
                        ({ing.amount})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Instructions Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <ChefHat className="w-3.5 h-3.5 text-teal-500" />
              Step-by-Step Preparation
            </h3>
            <div className="space-y-2.5 text-xs">
              {recipe.instructions.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3"
                >
                  <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tag Pills */}
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
            {recipe.tags?.map((t, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end bg-slate-50/60 dark:bg-slate-950/40">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 transition-colors shadow-xs"
          >
            Done Cooking
          </button>
        </div>
      </div>
    </div>
  );
}
