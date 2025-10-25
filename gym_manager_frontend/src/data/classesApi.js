import { supabase } from "../lib/supabaseClient";

/**
 * PUBLIC_INTERFACE
 * classesApi provides CRUD operations for the "classes" table.
 */
export const classesApi = {
  // PUBLIC_INTERFACE
  async list({ limit = 10, offset = 0, orderBy = "start_time", ascending = true, filters = {} } = {}) {
    /** Lists classes with pagination and optional filters. */
    let query = supabase.from("classes").select("*", { count: "exact" });
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        query = query.eq(k, v);
      }
    });
    if (orderBy) query = query.order(orderBy, { ascending });
    if (limit != null && offset != null) query = query.range(offset, offset + limit - 1);
    const { data, error, count } = await query;
    return { data: data || [], error, count: count ?? null };
  },

  // PUBLIC_INTERFACE
  async getById(id) {
    /** Retrieves a single class by id. */
    const { data, error } = await supabase.from("classes").select("*").eq("id", id).single();
    return { data, error };
  },

  // PUBLIC_INTERFACE
  async create(payload) {
    /** Inserts a new class. */
    const { data, error } = await supabase.from("classes").insert(payload).select().single();
    return { data, error };
  },

  // PUBLIC_INTERFACE
  async update(id, patch) {
    /** Updates a class by id. */
    const { data, error } = await supabase.from("classes").update(patch).eq("id", id).select().single();
    return { data, error };
  },

  // PUBLIC_INTERFACE
  async remove(id) {
    /** Deletes a class by id. */
    const { error } = await supabase.from("classes").delete().eq("id", id);
    return { error };
  },
};
