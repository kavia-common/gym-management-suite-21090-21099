import { supabase } from "../lib/supabaseClient";

/**
 * PUBLIC_INTERFACE
 * trainersApi provides CRUD operations for the "trainers" table.
 */
export const trainersApi = {
  // PUBLIC_INTERFACE
  async list({ limit = 10, offset = 0, orderBy = "name", ascending = true, filters = {} } = {}) {
    /** Lists trainers with pagination and optional filters. */
    let query = supabase.from("trainers").select("*", { count: "exact" });
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") query = query.eq(k, v);
    });
    if (orderBy) query = query.order(orderBy, { ascending });
    if (limit != null && offset != null) query = query.range(offset, offset + limit - 1);
    const { data, error, count } = await query;
    return { data: data || [], error, count: count ?? null };
  },

  // PUBLIC_INTERFACE
  async getById(id) {
    /** Retrieves a trainer by id. */
    const { data, error } = await supabase.from("trainers").select("*").eq("id", id).single();
    return { data, error };
  },

  // PUBLIC_INTERFACE
  async create(payload) {
    /** Inserts a new trainer. */
    const { data, error } = await supabase.from("trainers").insert(payload).select().single();
    return { data, error };
  },

  // PUBLIC_INTERFACE
  async update(id, patch) {
    /** Updates a trainer by id. */
    const { data, error } = await supabase.from("trainers").update(patch).eq("id", id).select().single();
    return { data, error };
  },

  // PUBLIC_INTERFACE
  async remove(id) {
    /** Deletes a trainer by id. */
    const { error } = await supabase.from("trainers").delete().eq("id", id);
    return { error };
  },
};
