"use client";

import { useSemillaMetrics } from "../hooks/useSemillaMetrics";
import { useSemillaCharts } from "../hooks/useSemillaCharts";
import { useSemillaActivity } from "../hooks/useSemillaActivity";
import { SectionErrorBoundary } from "../components/SectionErrorBoundary";

// ─── Skeleton ────────────────────────────────────────────────────────────────
function Skeleton({ width = "100%", height = "32px" }: { width?: string; height?: string }) {
  return (
    <div
      style={{
        width,
        height,
        background: "var(--color-background-secondary)",
        borderRadius: "var(--border-radius-md)",
        animation: "pulse 1.5s ease-in-out infinite",
      }}
    />
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  delta,
  deltaType,
  accentColor,
  loading,
  error,
}: {
  label: string;
  value: number | string;
  delta: number;
  deltaType?: "absoluto" | "porcentual";
  accentColor: string;
  loading: boolean;
  error: string | null;
}) {
  const isUp = delta >= 0;
  const deltaLabel = deltaType === "porcentual"
    ? `${isUp ? "+" : ""}${delta}%`
    : `${isUp ? "+" : ""}${delta.toLocaleString("es-CO")}`;

  return (
    <div
      style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-lg)",
        padding: "14px 16px",
        borderTop: `3px solid ${accentColor}`,
      }}
    >
      <p style={{ fontSize: 11, color: "var(--color-text-secondary)", margin: "0 0 6px" }}>
        {label}
      </p>
      {loading ? (
        <Skeleton height="28px" width="80%" />
      ) : error ? (
        <p style={{ fontSize: 13, color: "var(--color-text-danger)", margin: 0 }}>
          Error al cargar
        </p>
      ) : (
        <>
          <p
            style={{
              fontSize: 26,
              fontWeight: 600,
              margin: "0 0 4px",
              fontFamily: "monospace",
              color: "var(--color-text-primary)",
            }}
          >
            {typeof value === "number" ? value.toLocaleString("es-CO") : value}
          </p>
          <p
            style={{
              fontSize: 11,
              margin: 0,
              color: isUp ? "var(--color-text-success)" : "var(--color-text-danger)",
            }}
          >
            {isUp ? "▲" : "▼"} {deltaLabel} este mes
          </p>
        </>
      )}
    </div>
  );
}

// ─── Activity Feed ────────────────────────────────────────────────────────────
function ActivityFeed() {
  const { events, loading, error } = useSemillaActivity(8);

  if (loading) return <Skeleton height="160px" />;
  if (error) return <p style={{ fontSize: 13, color: "var(--color-text-danger)" }}>{error}</p>;

  return (
    <div>
      {events.map((evt) => (
        <div
          key={evt.id}
          style={{
            display: "flex",
            gap: 10,
            padding: "8px 0",
            borderBottom: "0.5px solid var(--color-border-tertiary)",
          }}
        >
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, margin: "0 0 2px", color: "var(--color-text-primary)" }}>
              {evt.titulo} — {evt.descripcion}
            </p>
            <p style={{ fontSize: 10, margin: 0, color: "var(--color-text-secondary)", fontFamily: "monospace" }}>
              {new Date(evt.fecha).toLocaleString("es-CO")}
              {evt.metadata?.departamento ? ` · ${evt.metadata.departamento}` : ""}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Dashboard Page ──────────────────────────────────────────────────────────
export default function DashboardPage() {
  const metrics = useSemillaMetrics();
  const { data: charts, loading: chartsLoading } = useSemillaCharts();

  return (
    <div style={{ fontFamily: "sans-serif", padding: "24px", maxWidth: 1200, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 4px" }}>Panel SEMILLA</h1>
        <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: 0, fontFamily: "monospace" }}>
          SUPERADMIN · Datos en tiempo real
        </p>
      </div>

      {/* KPIs */}
      <SectionErrorBoundary section="Métricas principales">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 10, marginBottom: 20 }}>
          <KpiCard
            label="Campesinos registrados"
            value={metrics.campesinos.total}
            delta={metrics.campesinos.deltaMensual}
            accentColor="#4caf7d"
            loading={metrics.loading}
            error={metrics.error}
          />
          <KpiCard
            label="Organizaciones activas"
            value={metrics.organizaciones.total}
            delta={metrics.organizaciones.deltaMensual}
            accentColor="#378add"
            loading={metrics.loading}
            error={metrics.error}
          />
          <KpiCard
            label="Predios registrados"
            value={metrics.predios.total}
            delta={metrics.predios.deltaMensual}
            accentColor="#ef9f27"
            loading={metrics.loading}
            error={metrics.error}
          />
          <KpiCard
            label="Hectáreas totales"
            value={
              metrics.hectareas.total >= 1000
                ? `${(metrics.hectareas.total / 1000).toFixed(0)}K ha`
                : `${metrics.hectareas.total} ha`
            }
            delta={metrics.hectareas.deltaMensual}
            deltaType={metrics.hectareas.tipoDelta}
            accentColor="#1d9e75"
            loading={metrics.loading}
            error={metrics.error}
          />
        </div>
      </SectionErrorBoundary>

      {/* Cobertura departamental */}
      <SectionErrorBoundary section="Cobertura departamental">
        <div
          style={{
            background: "var(--color-background-primary)",
            border: "0.5px solid var(--color-border-tertiary)",
            borderRadius: "var(--border-radius-lg)",
            padding: 16,
            marginBottom: 20,
          }}
        >
          <p style={{ fontSize: 12, fontWeight: 500, margin: "0 0 12px" }}>
            Predios por departamento
          </p>
          {chartsLoading ? (
            <Skeleton height="120px" />
          ) : (
            charts?.coberturaDepartamental.slice(0, 6).map((d) => {
              const max = charts.coberturaDepartamental[0]?.total ?? 1;
              const pct = Math.round((d.total / max) * 100);
              return (
                <div key={d.departamento} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: "var(--color-text-secondary)", minWidth: 90 }}>
                    {d.departamento}
                  </span>
                  <div style={{ flex: 1, background: "var(--color-background-secondary)", borderRadius: 3, height: 6, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: "#4caf7d", borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--color-text-secondary)", minWidth: 40, textAlign: "right" }}>
                    {d.total.toLocaleString("es-CO")}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </SectionErrorBoundary>

      {/* Actividad reciente */}
      <SectionErrorBoundary section="Actividad reciente">
        <div
          style={{
            background: "var(--color-background-primary)",
            border: "0.5px solid var(--color-border-tertiary)",
            borderRadius: "var(--border-radius-lg)",
            padding: 16,
          }}
        >
          <p style={{ fontSize: 12, fontWeight: 500, margin: "0 0 12px" }}>
            Actividad reciente
          </p>
          <ActivityFeed />
        </div>
      </SectionErrorBoundary>

    </div>
  );
}
