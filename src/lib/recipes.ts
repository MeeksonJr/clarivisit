import { RecipeItem, LifestylePrescription } from "@/types/visit";
import { GoogleGenAI } from "@google/genai";

const apiKey = (process.env.GEMINI_API_KEY || "").trim();
const rapidApiKey = (process.env.RAPIDAPI_KEY || "").trim();

export const DEFAULT_CLINICAL_RECIPES: RecipeItem[] = [
  {
    id: "rec-1",
    title: "Mediterranean Wild Salmon & Warm Quinoa Bowl",
    description:
      "Pan-seared wild salmon over fluffy lemon-herb quinoa, sautéed garlic baby spinach, cherry tomatoes, and avocado slices.",
    clinicianRationale:
      "Directly replaces white rice with low-glycemic quinoa, delivers heart-healthy omega-3s, and incorporates leafy greens without added sugars.",
    mealType: "dinner",
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    servings: 2,
    calories: 460,
    macros: {
      proteinGrams: 38,
      netCarbsGrams: 28,
      fiberGrams: 8,
      fatGrams: 18,
    },
    glycemicIndex: "low",
    tags: ["Low-Glycemic", "High-Fiber", "Heart-Healthy", "Doctor-Recommended"],
    ingredients: [
      { item: "Wild salmon fillets", amount: "2 (6 oz each)", category: "protein" },
      { item: "Organic tri-color quinoa", amount: "1 cup cooked", category: "grain" },
      { item: "Baby spinach", amount: "4 cups raw", category: "produce" },
      { item: "Hass avocado", amount: "1 ripe, sliced", category: "produce" },
      { item: "Cherry tomatoes", amount: "1 cup halved", category: "produce" },
      { item: "Extra virgin olive oil", amount: "1 tbsp", category: "pantry" },
      { item: "Fresh lemon & minced garlic", amount: "1 lemon, 2 cloves garlic", category: "produce" },
    ],
    instructions: [
      "Rinse quinoa and simmer in 2 cups of water for 15 minutes until light and fluffy; fluff with fork and fold in lemon juice.",
      "Heat olive oil in a skillet over medium heat. Sauté minced garlic for 30 seconds, then fold in baby spinach until just wilted. Set aside.",
      "Season salmon with black pepper, paprika, and a pinch of sea salt. Sear in the skillet for 4-5 minutes per side until flaky.",
      "Assemble bowl: Layer warm quinoa, garlic spinach, halved cherry tomatoes, and sliced avocado. Crown with the warm salmon fillet.",
    ],
  },
  {
    id: "rec-2",
    title: "Tuscan Garlic Herb Chicken & Sautéed Kale",
    description:
      "Tender grilled chicken breast with sun-dried tomatoes, wilted lacinato kale, and roasted pine nuts.",
    clinicianRationale:
      "Lean poultry avoids saturated fats, while kale provides potent sulforaphane and magnesium to support cardiovascular health.",
    mealType: "dinner",
    prepTimeMinutes: 10,
    cookTimeMinutes: 18,
    servings: 2,
    calories: 410,
    macros: {
      proteinGrams: 44,
      netCarbsGrams: 14,
      fiberGrams: 6,
      fatGrams: 16,
    },
    glycemicIndex: "low",
    tags: ["High-Protein", "Zero Simple Carbs", "Keto-Friendly"],
    ingredients: [
      { item: "Boneless skinless chicken breast", amount: "2 large breasts", category: "protein" },
      { item: "Lacinato kale (stems removed)", amount: "1 large bunch, chopped", category: "produce" },
      { item: "Sun-dried tomatoes in olive oil", amount: "1/4 cup chopped", category: "pantry" },
      { item: "Pine nuts or slivered almonds", amount: "2 tbsp toasted", category: "pantry" },
      { item: "Italian herb blend & garlic", amount: "1 tbsp herbs, 2 cloves garlic", category: "produce" },
    ],
    instructions: [
      "Pound chicken breasts to even thickness. Rub with Italian herbs, black pepper, and 1 tsp olive oil.",
      "Grill or sear in a hot cast-iron skillet for 6 minutes per side until internal temperature reaches 165°F. Rest for 5 minutes.",
      "In the same pan, toss in chopped kale, sun-dried tomatoes, and minced garlic with a splash of water. Sauté for 4 minutes until tender-crisp.",
      "Slice chicken diagonally and serve over the warm bed of Tuscan greens, garnished with toasted pine nuts.",
    ],
  },
  {
    id: "rec-3",
    title: "Chickpea & Basil Pesto High-Fiber Pasta",
    description:
      "100% chickpea rotini tossed with homemade walnut-basil pesto, grilled asparagus, and steamed broccoli florets.",
    clinicianRationale:
      "Substitutes white flour pasta with chickpea pasta, doubling the protein and tripling dietary fiber to prevent blood glucose spikes.",
    mealType: "dinner",
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    servings: 2,
    calories: 430,
    macros: {
      proteinGrams: 24,
      netCarbsGrams: 34,
      fiberGrams: 13,
      fatGrams: 17,
    },
    glycemicIndex: "low",
    tags: ["Plant-Based", "Carb-Swap", "High-Fiber", "Quick (20 min)"],
    ingredients: [
      { item: "Chickpea rotini pasta (e.g. Banza)", amount: "6 oz dry", category: "grain" },
      { item: "Fresh basil pesto (olive oil base)", amount: "3 tbsp", category: "pantry" },
      { item: "Broccoli florets", amount: "2 cups bite-sized", category: "produce" },
      { item: "Asparagus spears", amount: "1 bunch, cut into 2-inch pieces", category: "produce" },
      { item: "Nutritional yeast or shaved parmesan", amount: "2 tbsp", category: "pantry" },
    ],
    instructions: [
      "Bring a pot of salted water to a rolling boil. Cook chickpea pasta for 7-8 minutes until al dente.",
      "During the last 2 minutes of pasta boiling, drop in the broccoli florets and asparagus spears to blanch together.",
      "Drain thoroughly, saving 2 tablespoons of starchy pasta water.",
      "Toss hot pasta and vegetables immediately with basil pesto and reserved water. Sprinkle with parmesan or nutritional yeast.",
    ],
  },
  {
    id: "rec-4",
    title: "Avocado & Poached Egg Power Toast on Ezekiel Grain",
    description:
      "Sprouted 100% whole grain toast topped with mashed avocado, microgreens, chia seeds, and two soft-poached eggs.",
    clinicianRationale:
      "Eliminates refined white bread. Sprouted grains deliver low-glycemic sustained carbs paired with healthy fats and morning protein.",
    mealType: "breakfast",
    prepTimeMinutes: 5,
    cookTimeMinutes: 5,
    servings: 1,
    calories: 360,
    macros: {
      proteinGrams: 20,
      netCarbsGrams: 18,
      fiberGrams: 9,
      fatGrams: 22,
    },
    glycemicIndex: "low",
    tags: ["Fast Breakfast", "Low-Glycemic", "Vegetarian"],
    ingredients: [
      { item: "Sprouted grain bread (e.g. Ezekiel 4:9)", amount: "2 slices toasted", category: "grain" },
      { item: "Pasture-raised eggs", amount: "2 large", category: "protein" },
      { item: "Ripe avocado", amount: "1/2 avocado, mashed", category: "produce" },
      { item: "Arugula or microgreens", amount: "1/2 cup", category: "produce" },
      { item: "Chia seeds & red pepper flakes", amount: "1 tsp each", category: "pantry" },
    ],
    instructions: [
      "Toast sprouted grain bread until crispy.",
      "Poach or softly boil 2 eggs for 4-5 minutes until whites are firm and yolks remain jammy.",
      "Mash avocado with a squeeze of fresh lemon juice, pinch of sea salt, and black pepper. Spread generously over warm toast.",
      "Top with fresh arugula, crown with the eggs, and sprinkle chia seeds and red pepper flakes.",
    ],
  },
  {
    id: "rec-5",
    title: "Zesty Lime Cilantro Turkey & Black Bean Lettuce Wraps",
    description:
      "Lean ground turkey sautéed with cumin, lime, and black beans, wrapped in crisp Romaine lettuce leaves with salsa verde.",
    clinicianRationale:
      "Replaces white flour tortillas with crisp Romaine lettuce boats. Black beans supply soluble fiber to naturally balance cholesterol.",
    mealType: "lunch",
    prepTimeMinutes: 10,
    cookTimeMinutes: 12,
    servings: 2,
    calories: 380,
    macros: {
      proteinGrams: 36,
      netCarbsGrams: 22,
      fiberGrams: 9,
      fatGrams: 12,
    },
    glycemicIndex: "low",
    tags: ["Low-Carb Wrap", "Meal-Prep Friendly", "Lean-Protein"],
    ingredients: [
      { item: "93% Lean ground turkey", amount: "12 oz", category: "protein" },
      { item: "Romaine lettuce hearts", amount: "8 whole leaves", category: "produce" },
      { item: "Organic black beans", amount: "1 cup rinsed & drained", category: "grain" },
      { item: "Salsa verde", amount: "1/2 cup", category: "produce" },
      { item: "Cumin, chili powder & fresh lime", amount: "1 tsp each, 1 lime", category: "produce" },
    ],
    instructions: [
      "Brown ground turkey in a skillet over medium-high heat with cumin, chili powder, and minced garlic until fully cooked.",
      "Fold in rinsed black beans, salsa verde, and fresh lime juice. Simmer on low for 3-4 minutes to meld flavors.",
      "Wash and pat dry crisp Romaine lettuce leaves.",
      "Spoon turkey-bean mixture into lettuce boats. Garnish with chopped fresh cilantro and a dab of Greek yogurt if desired.",
    ],
  },
];

export async function generatePersonalizedRecipes(
  lifestyleDirectives: string,
  userPreferences: string = ""
): Promise<RecipeItem[]> {
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are an expert culinary medicine chef and clinical registered dietitian.
The patient was given these specific instructions by their physician during their after-visit summary:
"${lifestyleDirectives}"

User preferences: "${userPreferences || "Nutritious, fast prep, everyday grocery store ingredients"}"

TASK:
Generate 4-5 delicious, gourmet, easy-to-cook recipes that strictly enforce the physician's dietary instructions (e.g., low-glycemic, swap simple carbohydrates like white bread/pasta/rice for quinoa/cauliflower/chickpea pasta, incorporate dark leafy greens, lean proteins, zero deep-fried foods).

Return STRICTLY a JSON array matching this structure (no markdown fences, pure JSON array):
[
  {
    "id": "rec-custom-1",
    "title": "Recipe Title",
    "description": "Short appetizing description",
    "clinicianRationale": "Why this specifically benefits the patient's clinic directives",
    "mealType": "dinner" | "lunch" | "breakfast" | "snack",
    "prepTimeMinutes": 10,
    "cookTimeMinutes": 15,
    "servings": 2,
    "calories": 420,
    "macros": {
      "proteinGrams": 35,
      "netCarbsGrams": 24,
      "fiberGrams": 8,
      "fatGrams": 14
    },
    "glycemicIndex": "low",
    "tags": ["Low-Glycemic", "High-Fiber", "Quick"],
    "ingredients": [
      { "item": "Ingredient name", "amount": "quantity", "category": "produce" | "protein" | "grain" | "pantry" }
    ],
    "instructions": [
      "Step 1...",
      "Step 2..."
    ]
  }
]`;

  try {
    const res = await ai.models.generateContent({
      model: "gemini-flash-lite-latest",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = (res.text || "[]").trim();
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_CLINICAL_RECIPES;
  } catch (e) {
    console.warn("AI recipe generation error, falling back to curated clinical recipes:", e);
    return DEFAULT_CLINICAL_RECIPES;
  }
}
