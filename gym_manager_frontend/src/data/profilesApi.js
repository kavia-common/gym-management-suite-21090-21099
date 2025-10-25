import { supabase } from "../lib/supabaseClient";

/**
 * PUBLIC_INTERFACE
 * profilesApi provides helpers to fetch and update the current user's profile.
 */
export const profilesApi = {
  // PUBLIC_INTERFACE
  async getCurrentProfile() {
    /** Returns the current user's profile row from the "profiles" table if present. */
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) return { data: null, error: userError };
    if (!user) return { data: null, error: new Error("Not authenticated") };
    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    return { data: data || null, error };
  },

  // PUBLIC_INTERFACE
  async upsertProfile(patch) {
    /** Upserts current user's profile row using patch fields. */
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) return { data: null, error: userError };
    if (!user) return { data: null, error: new Error("Not authenticated") };
    const payload = { id: user.id, ...patch, updated_at: new Date().toISOString() };
    const { data, error } = await supabase.from("profiles").upsert(payload).select().single();
    return { data, error };
  },
};
