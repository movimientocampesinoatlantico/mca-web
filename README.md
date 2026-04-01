# SEMILLA — Integración Dashboard

## Estructura

```
semilla-dashboard-integration/
├── lib/
│   └── api.ts                    ← cliente base con JWT Bearer
├── types/
│   └── dashboard.ts              ← contratos TypeScript (definidos por GPT)
├── hooks/
│   ├── useSemillaMetrics.ts      ← GET /api/v1/dashboard/summary
│   ├── useSemillaCharts.ts       ← GET /api/v1/dashboard/charts
│   └── useSemillaActivity.ts     ← GET /api/v1/dashboard/activity
├── components/
│   └── SectionErrorBoundary.tsx  ← error boundary por sección
└── app/dashboard/
    └── page.tsx                  ← página completa integrada
```

## Setup

1. Copiar archivos al proyecto Next.js existente
2. Agregar variable de entorno:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```
3. Asegurarse de que el JWT se guarda en `localStorage` con la key `semilla_token` al hacer login

## Autenticación

Todas las llamadas usan:
```
Authorization: Bearer <token>
```
Si el backend responde `401`, la sesión se limpia automáticamente y redirige a `/login`.

## Refresh automático

- `useSemillaMetrics` → refresca cada **60 segundos**
- `useSemillaActivity` → refresca cada **30 segundos**
- `useSemillaCharts` → solo carga al montar (datos menos volátiles)

## Error handling

Cada sección del dashboard tiene su propio `SectionErrorBoundary`.
Si una sección falla, el resto del dashboard continúa funcionando.

## Validación del contrato (verificar con GPT)

```bash
# 1. Endpoint summary — debe responder 200 con token válido
curl -H "Authorization: Bearer <token>" http://localhost:4000/api/v1/dashboard/summary

# 2. Con token inválido — debe responder 401
curl -H "Authorization: Bearer token_invalido" http://localhost:4000/api/v1/dashboard/summary

# 3. Charts
curl -H "Authorization: Bearer <token>" http://localhost:4000/api/v1/dashboard/charts

# 4. Activity
curl -H "Authorization: Bearer <token>" http://localhost:4000/api/v1/dashboard/activity?limit=10
```
