// CONTRATO RECOMENDADO SEMILLA - DASHBOARD
// Definido por GPT, implementado por Claude

export interface DashboardSummaryResponse {
  success: boolean;
  data: {
    campesinos: { total: number; deltaMensual: number };
    organizaciones: { total: number; deltaMensual: number };
    predios: { total: number; deltaMensual: number };
    hectareas: {
      total: number;
      deltaMensual: number;
      unidad: "ha";
      tipoDelta: "absoluto" | "porcentual";
    };
  };
  timestamp: string;
}

export interface DashboardChartsResponse {
  success: boolean;
  data: {
    registrosMensuales: Array<{
      mes: string; // "2024-01"
      campesinos: number;
      organizaciones: number;
      predios: number;
    }>;
    tiposOrganizacion: Array<{
      tipo: string;
      total: number;
      porcentaje: number;
    }>;
    coberturaDepartamental: Array<{
      departamento: string;
      total: number;
    }>;
  };
  timestamp: string;
}

export interface DashboardActivityResponse {
  success: boolean;
  data: Array<{
    id: string;
    tipo: string;
    titulo: string;
    descripcion: string;
    fecha: string;
    metadata?: {
      entidadId?: string;
      entidadTipo?: string;
      departamento?: string;
    };
  }>;
  timestamp: string;
}

export type SemillaMetrics = {
  campesinos: { total: number; deltaMensual: number };
  organizaciones: { total: number; deltaMensual: number };
  predios: { total: number; deltaMensual: number };
  hectareas: {
    total: number;
    deltaMensual: number;
    unidad: "ha";
    tipoDelta: "absoluto" | "porcentual";
  };
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};
