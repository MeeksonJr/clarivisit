import { createClient, SupabaseClient } from "@supabase/supabase-js";

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

/**
 * Retrieves the active Supabase URL and Anon Key exclusively from environment variables.
 */
export function getSupabaseConfig(): SupabaseConfig | null {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (envUrl && envKey && !envUrl.includes("placeholder") && !envKey.includes("placeholder")) {
    return { url: envUrl, anonKey: envKey };
  }

  return null;
}

// Auto-purge any legacy credentials stored in browser localStorage
if (typeof window !== "undefined") {
  try {
    localStorage.removeItem("clarivisit_supabase_custom_config_v1");
  } catch {
    // ignore
  }
}

export function isSupabaseConfigured(): boolean {
  const cfg = getSupabaseConfig();
  return Boolean(cfg && cfg.url && cfg.anonKey);
}

let supabaseInstance: SupabaseClient | null = null;

/**
 * Returns the Supabase client singleton, or null if credentials are not configured.
 */
export function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  const cfg = getSupabaseConfig();
  if (!cfg) return null;

  try {
    supabaseInstance = createClient(cfg.url, cfg.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    return supabaseInstance;
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
    return null;
  }
}
