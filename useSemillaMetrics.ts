import { useState, useEffect, useCallback } from "react";
import { semillaFetch } from "../lib/api";
import type {
  DashboardSummaryResponse,
  SemillaMetrics,
} from "../types/dashboard";

const REFRESH_INTERVAL_MS = 60_000; // 60 segundos

export function useSemillaMetrics(): SemillaMetrics {
  const [data, setData] = useState<DashboardSummaryResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setError(null);
      const res = await semillaFetch<DashboardSummaryResponse>(
        "/api/v1/dashboard/summary"
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
    fetchMetrics();
    const interval = setInterval(fetchMetrics, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  return {
    campesinos: data?.campesinos ?? { total: 0, deltaMensual: 0 },
    organizaciones: data?.organizaciones ?? { total: 0, deltaMensual: 0 },
    predios: data?.predios ?? { total: 0, deltaMensual: 0 },
    hectareas: data?.hectareas ?? {
      total: 0,
      deltaMensual: 0,
      unidad: "ha",
      tipoDelta: "absoluto",
    },
    loading,
    error,
    refetch: fetchMetrics,
  };
}
