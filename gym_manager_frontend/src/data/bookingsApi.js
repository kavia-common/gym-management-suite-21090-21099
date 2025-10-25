import { supabase } from "../lib/supabaseClient";

/**
 * PUBLIC_INTERFACE
 * bookingsApi provides CRUD operations for the "bookings" table.
 */
export const bookingsApi = {
  // PUBLIC_INTERFACE
  async list({ limit = 10, offset = 0, orderBy = "created_at", ascending = false, filters = {} } = {}) {
    /** Lists bookings with pagination and optional filters. */
    let query = supabase.from("bookings").select("*", { count: "exact" });
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
    /** Retrieves a booking by id. */
    const { data, error } = await supabase.from("bookings").select("*").eq("id", id).single();
    return { data, error };
  },

  // PUBLIC_INTERFACE
  async create(payload) {
    /** Inserts a new booking. */
    const { data, error } = await supabase.from("bookings").insert(payload).select().single();
    return { data, error };
  },

  // PUBLIC_INTERFACE
  async update(id, patch) {
    /** Updates a booking by id. */
    const { data, error } = await supabase.from("bookings").update(patch).eq("id", id).select().single();
    return { data, error };
  },

  // PUBLIC_INTERFACE
  async remove(id) {
    /** Deletes a booking by id. */
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    return { error };
  },
};
