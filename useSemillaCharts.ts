import { useState, useEffect, useCallback } from "react";
import { semillaFetch } from "../lib/api";
import type { DashboardChartsResponse } from "../types/dashboard";

type ChartsState = {
  data: DashboardChartsResponse["data"] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useSemillaCharts(): ChartsState {
  const [data, setData] = useState<DashboardChartsResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharts = useCallback(async () => {
    try {
      setError(null);
      const res = await semillaFetch<DashboardChartsResponse>(
        "/api/v1/dashboard/charts"
      );
      if (res.success) setData(res.data);
      else setError("El servidor devolvió success: false");
    } catch (err: any) {
      if (err?.status !== 401) setError(err.message ?? "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCharts();
  }, [fetchCharts]);

  return { data, loading, error, refetch: fetchCharts };
}
