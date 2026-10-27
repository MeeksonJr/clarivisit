"use client";

import React, { useState, useEffect } from "react";
import { getStoredVisits, saveVisit } from "@/lib/storage";
import { ParsedVisitRecord, RecipeItem } from "@/types/visit";
import { DEFAULT_CLINICAL_RECIPES } from "@/lib/recipes";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeModal } from "@/components/RecipeModal";
import {
  Apple,
  Dumbbell,
  ShoppingCart,
  ChefHat,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Plus,
  RefreshCw,
  Flame,
  ShieldCheck,
  Check,
  Calendar,
} from "lucide-react";
import Link from "next/link";

export default function LifestyleNutritionPage() {
  const [visits, setVisits] = useState<ParsedVisitRecord[]>([]);
  const [activeVisit, setActiveVisit] = useState<ParsedVisitRecord | null>(null);
  const [recipes, setRecipes] = useState<RecipeItem[]>(DEFAULT_CLINICAL_RECIPES);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeItem | null>(null);
  const [addedGroceryItems, setAddedGroceryItems] = useState<string[]>([]);
  const [checkedGroceries, setCheckedGroceries] = useState<Record<string, boolean>>({});
  const [completedWorkouts, setCompletedWorkouts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const stored = getStoredVisits();
    setVisits(stored);
    if (stored.length > 0) {
      const latest = stored[0];
      setActiveVisit(latest);
      if (latest.lifestyle?.recipes && latest.lifestyle.recipes.length > 0) {
        setRecipes(latest.lifestyle.recipes);
      } else {
        setRecipes(DEFAULT_CLINICAL_RECIPES);
      }
    }
  }, []);

  const handleGenerateCustom = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customPrompt.trim() && !activeVisit?.lifestyle?.doctorDirectivesRaw) return;

    setIsGenerating(true);
    setGenerationError("");

    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          directives:
            activeVisit?.lifestyle?.doctorDirectivesRaw ||
            "Reduce simple carbohydrates, incorporate leafy greens, lean proteins, and low-glycemic foods.",
          preferences: customPrompt.trim(),
        }),
      });

      const data = await res.json();
      if (data.recipes && Array.isArray(data.recipes) && data.recipes.length > 0) {
        setRecipes(data.recipes);

        // Persist to the active visit in localStorage
        if (activeVisit) {
          const updated: ParsedVisitRecord = {
            ...activeVisit,
            lifestyle: {
              ...activeVisit.lifestyle,
              recipes: data.recipes,
            },
          };
          setActiveVisit(updated);
          saveVisit(updated);
        }
        setCustomPrompt("");
      } else {
        setGenerationError("Could not generate recipes for that specific request. Restored clinical recommendations.");
      }
    } catch (err: unknown) {
      console.error("Recipe generation failed:", err);
      setGenerationError("AI recipe service was busy. Displaying clinical standard recipes.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleResetToClinicalDefault = () => {
    setRecipes(DEFAULT_CLINICAL_RECIPES);
    if (activeVisit) {
      const updated: ParsedVisitRecord = {
        ...activeVisit,
        lifestyle: {
          ...activeVisit.lifestyle,
          recipes: DEFAULT_CLINICAL_RECIPES,
        },
      };
      setActiveVisit(updated);
      saveVisit(updated);
    }
  };

  const handleAddToGroceryList = (newItems: string[]) => {
    setAddedGroceryItems((prev) => {
      const unique = Array.from(new Set([...prev, ...newItems]));
      return unique;
    });
  };

  const toggleGroceryItem = (itemKey: string) => {
    setCheckedGroceries((prev) => ({
      ...prev,
      [itemKey]: !prev[itemKey],
    }));
  };

  const toggleWorkout = (dayTitle: string) => {
    setCompletedWorkouts((prev) => ({
      ...prev,
      [dayTitle]: !prev[dayTitle],
    }));
  };

  if (visits.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-3 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800">
        <Apple className="w-10 h-10 text-slate-400" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Lifestyle Prescriptions Yet</h2>
        <p className="text-xs text-slate-500 max-w-sm">
          Upload an After-Visit Summary to turn doctor instructions into grocery shopping lists, healthy carb swaps, and weekly exercise schedules.
        </p>
        <Link
          href="/dashboard"
          className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500"
        >
          Upload Visit Summary
        </Link>
      </div>
    );
  }

  const lifestyle = activeVisit?.lifestyle;

  // Filter recipes
  const filteredRecipes = recipes.filter((rec) => {
    const matchesSearch =
      searchQuery === "" ||
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeFilter === "all") return true;
    if (activeFilter === "dinner") return rec.mealType === "dinner";
    if (activeFilter === "lunch") return rec.mealType === "lunch";
    if (activeFilter === "breakfast") return rec.mealType === "breakfast";
    if (activeFilter === "quick") return rec.prepTimeMinutes + rec.cookTimeMinutes <= 20;
    if (activeFilter === "plant-based")
      return rec.tags.some((t) => t.toLowerCase().includes("plant") || t.toLowerCase().includes("vegetarian"));

    return true;
  });

  return (
    <div className="space-y-8">
      {/* Page Title & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Clinical Lifestyle Protocol
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
              Visit from {activeVisit?.visitDate}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Nutrition, Recipes & Activity Plan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Chef-crafted meals, carb alternatives, and exercise regimens tailored to {activeVisit?.providerName}'s directives.
          </p>
        </div>

        {visits.length > 1 && (
          <select
            value={activeVisit?.id}
            onChange={(e) => {
              const selected = visits.find((v) => v.id === e.target.value);
              if (selected) {
                setActiveVisit(selected);
                setRecipes(selected.lifestyle?.recipes || DEFAULT_CLINICAL_RECIPES);
              }
            }}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
          >
            {visits.map((v) => (
              <option key={v.id} value={v.id}>
                {v.visitDate} — {v.providerName}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Primary Target Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {lifestyle?.weeklyExerciseTargetMinutes || 150} min
            </div>
            <span className="text-xs text-slate-500 font-medium">Weekly Cardio Target</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
            <Apple className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              Low-Glycemic
            </div>
            <span className="text-xs text-slate-500 font-medium">Carb Strategy</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              Whole Foods
            </div>
            <span className="text-xs text-slate-500 font-medium">Dietary Standard</span>
          </div>
        </div>
      </div>

      {/* Clinician Instructions Banner */}
      <div className="p-5 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200/70 dark:border-teal-900/50 space-y-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span className="text-[10px] uppercase font-bold text-teal-800 dark:text-teal-300 tracking-wider">
            Physician Directives from Discharge Paperwork
          </span>
        </div>
        <p className="text-xs sm:text-sm text-teal-950 dark:text-teal-100 font-medium leading-relaxed italic">
          "{lifestyle?.doctorDirectivesRaw || "Physical activity of minimum 150 minutes moderate intensity per week recommended. Drink plenty of water. Reduce excessive simple carbohydrate intake such as white breads, pastas, and white rice. Incorporate dark leafy greens and lean proteins."}"
        </p>
      </div>

      {/* ============================================================== */}
      {/* SECTION: DOCTOR-COMPLIANT RECIPE GENERATOR & GALLERY           */}
      {/* ============================================================== */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Doctor-Compliant Recipe Generator
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Chef-crafted meals that strictly swap simple carbs and follow your doctor's dietary orders.
            </p>
          </div>

          <button
            onClick={handleResetToClinicalDefault}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors self-start sm:self-auto"
            title="Reset to the 5 baseline clinical recipes"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>
        </div>

        {/* AI Prompt Input Bar */}
        <form
          onSubmit={handleGenerateCustom}
          className="glass-panel p-2.5 sm:p-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shadow-xs"
        >
          <div className="flex-1 flex items-center gap-2 px-3 py-1.5">
            <Sparkles className="w-4 h-4 text-teal-500 shrink-0" />
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Ask Chef AI (e.g. '15-minute quick lunches', 'kid-friendly dinners', 'vegetarian with lentils')..."
              className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
              disabled={isGenerating}
            />
          </div>

          <button
            type="submit"
            disabled={isGenerating || !customPrompt.trim()}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shrink-0 shadow-xs"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Crafting Recipes...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Meals</span>
              </>
            )}
          </button>
        </form>

        {generationError && (
          <p className="text-xs text-amber-600 dark:text-amber-400">{generationError}</p>
        )}

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: "all", label: "All Recipes" },
              { id: "dinner", label: "Dinners" },
              { id: "lunch", label: "Lunches" },
              { id: "breakfast", label: "Breakfasts" },
              { id: "quick", label: "Quick (<20m)" },
              { id: "plant-based", label: "Plant-Based" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  activeFilter === f.id
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onOpen={(rec) => setSelectedRecipe(rec)}
            />
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center p-8 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-2">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No recipes matched your search filter.
            </p>
            <button
              onClick={() => {
                setActiveFilter("all");
                setSearchQuery("");
              }}
              className="text-xs font-semibold text-teal-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* SECTION: CARB SWAP MATRIX & GROCERY LIST                       */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Carbohydrate & Food Swaps */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Apple className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Carbohydrate & Food Swaps
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Replace fast-digesting refined starches with nutrient-dense complex fiber to stabilize blood sugar.
          </p>

          <div className="space-y-3">
            {lifestyle?.mealSwaps?.map((swap, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="line-through text-slate-400 font-medium">{swap.avoid}</span>
                  <span className="font-bold text-teal-700 dark:text-teal-300">
                    {swap.alternative}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{swap.benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor-Prescribed Grocery List */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Interactive Grocery Checklist
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Click to cross off</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Produce */}
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300">Produce & Greens:</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {lifestyle?.groceryList?.produce?.map((p, i) => {
                  const key = `prod-${p}`;
                  const isChecked = !!checkedGroceries[key];
                  return (
                    <button
                      key={i}
                      onClick={() => toggleGroceryItem(key)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                        isChecked
                          ? "bg-slate-100 dark:bg-slate-800 line-through text-slate-400"
                          : "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100"
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 text-slate-400" />}
                      <span>{p}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Proteins */}
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300">Lean Proteins:</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {lifestyle?.groceryList?.proteins?.map((pr, i) => {
                  const key = `prot-${pr}`;
                  const isChecked = !!checkedGroceries[key];
                  return (
                    <button
                      key={i}
                      onClick={() => toggleGroceryItem(key)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                        isChecked
                          ? "bg-slate-100 dark:bg-slate-800 line-through text-slate-400"
                          : "bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 hover:bg-sky-100"
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 text-slate-400" />}
                      <span>{pr}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Whole Grains */}
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300">Whole Grains:</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {lifestyle?.groceryList?.wholeGrains?.map((wg, i) => {
                  const key = `grain-${wg}`;
                  const isChecked = !!checkedGroceries[key];
                  return (
                    <button
                      key={i}
                      onClick={() => toggleGroceryItem(key)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                        isChecked
                          ? "bg-slate-100 dark:bg-slate-800 line-through text-slate-400"
                          : "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 hover:bg-amber-100"
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 text-slate-400" />}
                      <span>{wg}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Added From Recipes */}
            {addedGroceryItems.length > 0 && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="font-bold text-teal-700 dark:text-teal-300 flex items-center gap-1.5">
                  <ChefHat className="w-3.5 h-3.5" />
                  Added from Chef Recipes:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {addedGroceryItems.map((item, idx) => {
                    const key = `added-${item}-${idx}`;
                    const isChecked = !!checkedGroceries[key];
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleGroceryItem(key)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                          isChecked
                            ? "bg-slate-100 dark:bg-slate-800 line-through text-slate-400"
                            : "bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 hover:bg-teal-100"
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 text-slate-400" />}
                        <span>{item}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION: 5-DAY WEEKLY WORKOUT SCHEDULE                         */}
      {/* ============================================================== */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Weekly Exercise Regimen (150-Minute Target)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Designed for steady aerobic conditioning
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {lifestyle?.weeklyWorkoutPlan?.map((w, idx) => {
            const isDone = !!completedWorkouts[w.dayTitle];
            return (
              <div
                key={idx}
                onClick={() => toggleWorkout(w.dayTitle)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer select-none space-y-2 ${
                  isDone
                    ? "bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-500/50 hover:shadow-md"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-teal-700 dark:text-teal-300">
                    {w.activityType}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      isDone
                        ? "bg-teal-600 border-teal-600 text-white"
                        : "border-slate-300 dark:border-slate-700"
                    }`}
                  >
                    {isDone && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>

                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {w.dayTitle}
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {w.description}
                </p>

                <div className="pt-2 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{w.durationMinutes} minutes</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recipe Modal */}
      <RecipeModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        onAddToGroceryList={handleAddToGroceryList}
      />
    </div>
  );
}
