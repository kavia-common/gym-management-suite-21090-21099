import { supabase } from "../lib/supabaseClient";

/**
 * PUBLIC_INTERFACE
 * membershipsApi provides CRUD operations for the "memberships" table with RLS in mind.
 * All operations rely on the caller's current auth session. Errors are propagated back to the caller.
 */
export const membershipsApi = {
  // PUBLIC_INTERFACE
  async list({ limit = 10, offset = 0, orderBy = "created_at", ascending = false, filters = {} } = {}) {
    /** Lists memberships rows with basic pagination (limit/offset). Respects RLS. */
    let query = supabase.from("memberships").select("*", { count: "exact" });
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        query = query.eq(k, v);
      }
    });
    if (orderBy) {
      query = query.order(orderBy, { ascending });
    }
    if (limit != null && offset != null) {
      query = query.range(offset, offset + limit - 1);
    }
    const { data, error, count } = await query;
    return { data: data || [], error, count: count ?? null };
  },

  // PUBLIC_INTERFACE
  async getById(id) {
    /** Retrieves a single membership by id. */
    const { data, error } = await supabase.from("memberships").select("*").eq("id", id).single();
    return { data, error };
  },

  // PUBLIC_INTERFACE
  async create(payload) {
    /** Inserts a new membership row. */
    const { data, error } = await supabase.from("memberships").insert(payload).select().single();
    return { data, error };
  },

  // PUBLIC_INTERFACE
  async update(id, patch) {
    /** Updates a membership row by id. */
    const { data, error } = await supabase.from("memberships").update(patch).eq("id", id).select().single();
    return { data, error };
  },

  // PUBLIC_INTERFACE
  async remove(id) {
    /** Deletes a membership row by id. */
    const { error } = await supabase.from("memberships").delete().eq("id", id);
    return { error };
  },
};
