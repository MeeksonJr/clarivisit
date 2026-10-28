import { createClient, SupabaseClient } from "@supabase/supabase-js";

const CUSTOM_SUPABASE_CONFIG_KEY = "clarivisit_supabase_custom_config_v1";

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

/**
 * Retrieves the active Supabase URL and Anon Key.
 * Checks Next.js environment variables first, then falls back to browser-stored custom config.
 */
export function getSupabaseConfig(): SupabaseConfig | null {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (envUrl && envKey && !envUrl.includes("placeholder") && !envKey.includes("placeholder")) {
    return { url: envUrl, anonKey: envKey };
  }

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(CUSTOM_SUPABASE_CONFIG_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.url && parsed.anonKey) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
  }

  return null;
}

export function saveCustomSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    CUSTOM_SUPABASE_CONFIG_KEY,
    JSON.stringify({ url: url.trim(), anonKey: anonKey.trim() })
  );
  // Invalidate cached client
  supabaseInstance = null;
  window.dispatchEvent(new Event("clarivisit_supabase_config_change"));
}

export function clearCustomSupabaseConfig(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CUSTOM_SUPABASE_CONFIG_KEY);
  supabaseInstance = null;
  window.dispatchEvent(new Event("clarivisit_supabase_config_change"));
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
