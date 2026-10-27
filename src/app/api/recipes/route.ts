import { NextRequest, NextResponse } from "next/server";
import { generatePersonalizedRecipes, DEFAULT_CLINICAL_RECIPES } from "@/lib/recipes";

export const maxDuration = 45;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const directives =
      body.directives ||
      "Physical activity of minimum 150 minutes moderate intensity per week recommended. Drink plenty of water. Reduce excessive simple carbohydrate intake such as white breads, pastas, and white rice. Incorporate dark leafy greens and lean proteins.";
    const preferences = body.preferences || "";

    const recipes = await generatePersonalizedRecipes(directives, preferences);

    return NextResponse.json({
      success: true,
      recipes: recipes && recipes.length > 0 ? recipes : DEFAULT_CLINICAL_RECIPES,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.warn("Recipes route error, falling back to curated clinical recipes:", error);
    return NextResponse.json({
      success: true,
      recipes: DEFAULT_CLINICAL_RECIPES,
      fallback: true,
    });
  }
}
