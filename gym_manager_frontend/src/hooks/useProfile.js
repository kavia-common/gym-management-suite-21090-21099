import { useCallback, useEffect, useState } from "react";
import { profilesApi } from "../data/profilesApi";

/**
 * PUBLIC_INTERFACE
 * useProfile fetches and updates the current user's profile row (profiles table).
 */
export function useProfile(autoLoad = true) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(!!autoLoad);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: err } = await profilesApi.getCurrentProfile();
      if (err) throw err;
      setProfile(data);
    } catch (e) {
      setError(e?.message || "Failed to load profile.");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const save = useCallback(async (patch) => {
    const { data, error: err } = await profilesApi.upsertProfile(patch);
    if (err) throw err;
    setProfile(data);
    return data;
  }, []);

  useEffect(() => {
    if (autoLoad) load();
  }, [autoLoad, load]);

  return { data: profile, loading, error, refresh: load, save };
}
