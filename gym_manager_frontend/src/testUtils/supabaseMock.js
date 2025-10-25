const createQuery = (table, data = [], error = null) => {
  // Chainable minimal query builder supporting .select, .eq, .order, .range, and terminal await
  const state = {
    table,
    data: Array.isArray(data) ? data : [],
    error,
    filters: [],
    orderBy: null,
    ascending: true,
    range: null,
    single: false,
    maybe: false,
  };

  const builder = {
    select: (_cols, _opts) => builder,
    eq: (k, v) => {
      state.filters.push({ k, v });
      return builder;
    },
    order: (col, { ascending } = {}) => {
      state.orderBy = col;
      state.ascending = ascending !== false;
      return builder;
    },
    range: (from, to) => {
      state.range = [from, to];
      return builder;
    },
    single: () => {
      state.single = true;
      return builder;
    },
    maybeSingle: () => {
      state.maybe = true;
      return builder;
    },
    insert: (payload) => {
      // Return payload in an array as Supabase does with .select().single()
      const arr = Array.isArray(payload) ? payload : [payload];
      state.data = arr.map((r, i) => ({ id: r.id ?? i + 1, ...r }));
      return builder;
    },
    update: (patch) => {
      // Apply shallow patch to first matching item for tests
      if (state.data.length) {
        state.data = state.data.map((r) => ({ ...r, ...patch }));
      }
      return builder;
    },
    delete: () => {
      // Simulate deletion success
      state.data = [];
      return builder;
    },
    then: (resolve) => {
      // Compute filtered/sorted/ranged result
      let out = [...state.data];
      state.filters.forEach(({ k, v }) => {
        out = out.filter((row) => row[k] === v);
      });
      if (state.orderBy) {
        out.sort((a, b) => {
          const av = a[state.orderBy];
          const bv = b[state.orderBy];
          if (av === bv) return 0;
          return (av > bv ? 1 : -1) * (state.ascending ? 1 : -1);
        });
      }
      if (state.range) {
        const [from, to] = state.range;
        out = out.slice(from, to + 1);
      }

      const res = state.single
        ? { data: out[0] ?? null, error: state.error }
        : { data: out, error: state.error, count: out.length };

      resolve(res);
    },
    selectReturn: () => builder, // no-op helper for clarity
  };

  // Supabase style chaining: .insert(...).select().single()
  const chained = new Proxy(builder, {
    get(target, prop) {
      if (prop === 'select') {
        return (_cols, _opts) => target;
      }
      if (prop === 'selectReturn') return builder.selectReturn;
      return target[prop];
    },
  });

  return chained;
};

export function createSupabaseMock({ seed = {} } = {}) {
  // Seed can define tables: { memberships: [...], classes: [...], bookings: [...] }
  const db = {
    memberships: seed.memberships || [],
    classes: seed.classes || [],
    bookings: seed.bookings || [],
    profiles: seed.profiles || [],
    trainers: seed.trainers || [],
  };

  return {
    // Database API
    from: (table) => {
      const data = db[table] || [];
      return createQuery(table, data);
    },

    // Auth API subset used by the app
    auth: {
      _session: seed.session || null,
      _user: seed.user || null,

      getSession: async () => ({ data: { session: seed.session || null }, error: null }),
      getUser: async () => ({ data: { user: seed.user || null }, error: null }),
      onAuthStateChange: (cb) => {
        // Minimal subscription mock
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
      signInWithPassword: async ({ email, password }) => {
        // Simple happy path mock
        const user = { id: 'user-1', email };
        const session = { user };
        return { data: { session, user }, error: null };
      },
      signUp: async ({ email, password, options }) => {
        return { data: { user: { id: 'user-2', email }, session: null }, error: null };
      },
      resetPasswordForEmail: async (_email, _opts) => ({ data: {}, error: null }),
      updateUser: async (_payload) => ({ data: { user: seed.user || { id: 'user-1' } }, error: null }),
      signOut: async () => ({ error: null }),
    },
  };
}
