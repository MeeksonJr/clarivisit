"use client";

import React from "react";
import { RecipeItem } from "@/types/visit";
import { Clock, Flame, ShieldCheck, ChevronRight, Utensils } from "lucide-react";

interface RecipeCardProps {
  recipe: RecipeItem;
  onOpen: (recipe: RecipeItem) => void;
}

export function RecipeCard({ recipe, onOpen }: RecipeCardProps) {
  return (
    <div
      onClick={() => onOpen(recipe)}
      className="group glass-panel rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 hover:border-teal-500/60 dark:hover:border-teal-400/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between cursor-pointer"
    >
      <div className="space-y-3.5">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
              {recipe.mealType}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {recipe.glycemicIndex.toUpperCase()} GI
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {recipe.prepTimeMinutes + recipe.cookTimeMinutes}m
            </span>
            <span>•</span>
            <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-bold">
              <Flame className="w-3 h-3" />
              {recipe.calories} kcal
            </span>
          </div>
        </div>

        {/* Title and Description */}
        <div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-snug">
            {recipe.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>
        </div>

        {/* Clinician Rationale snippet */}
        <div className="p-3 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/50 dark:border-teal-900/40 text-[11px] text-teal-900 dark:text-teal-200 flex items-start gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <p className="line-clamp-2 font-medium">
            <strong className="font-bold text-teal-950 dark:text-teal-200">Doctor Fit: </strong>
            {recipe.clinicianRationale}
          </p>
        </div>

        {/* Macro Pill Highlights */}
        <div className="grid grid-cols-4 gap-1.5 text-center pt-1">
          <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
            <div className="text-xs font-black text-teal-600 dark:text-teal-400">
              {recipe.macros.proteinGrams}g
            </div>
            <div className="text-[9px] font-semibold text-slate-400 uppercase">Protein</div>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
            <div className="text-xs font-black text-sky-600 dark:text-sky-400">
              {recipe.macros.netCarbsGrams}g
            </div>
            <div className="text-[9px] font-semibold text-slate-400 uppercase">Carbs</div>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
            <div className="text-xs font-black text-emerald-600 dark:text-emerald-400">
              {recipe.macros.fiberGrams}g
            </div>
            <div className="text-[9px] font-semibold text-slate-400 uppercase">Fiber</div>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
            <div className="text-xs font-black text-amber-600 dark:text-amber-400">
              {recipe.macros.fatGrams}g
            </div>
            <div className="text-[9px] font-semibold text-slate-400 uppercase">Fat</div>
          </div>
        </div>
      </div>

      {/* Footer / Action */}
      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-teal-600 dark:text-teal-400 group-hover:text-teal-500">
        <span className="flex items-center gap-1.5">
          <Utensils className="w-3.5 h-3.5" />
          <span>{recipe.ingredients.length} ingredients</span>
        </span>
        <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          <span>Cook Recipe</span>
          <ChevronRight className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
}
