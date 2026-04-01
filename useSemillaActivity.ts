import { useState, useEffect, useCallback } from "react";
import { semillaFetch } from "../lib/api";
import type { DashboardActivityResponse } from "../types/dashboard";

type ActivityItem = DashboardActivityResponse["data"][number];

type ActivityState = {
  events: ActivityItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useSemillaActivity(limit = 10): ActivityState {
  const [events, setEvents] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivity = useCallback(async () => {
    try {
      setError(null);
      const res = await semillaFetch<DashboardActivityResponse>(
        `/api/v1/dashboard/activity?limit=${limit}`
      );
      if (res.success) setEvents(res.data);
      else setError("El servidor devolvió success: false");
    } catch (err: any) {
      if (err?.status !== 401) setError(err.message ?? "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchActivity();
    const interval = setInterval(fetchActivity, 30_000); // cada 30s
    return () => clearInterval(interval);
  }, [fetchActivity]);

  return { events, loading, error, refetch: fetchActivity };
}
