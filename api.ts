// SEMILLA — cliente base de API
// Contrato de autenticación: Authorization: Bearer <token>

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export async function semillaFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("semilla_token") : null;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    // Token expirado o inválido — limpiar sesión y redirigir
    localStorage.removeItem("semilla_token");
    localStorage.removeItem("semilla_user");
    window.location.href = "/login";
    throw new ApiError(401, "Sesión expirada");
  }

  if (!res.ok) {
    throw new ApiError(res.status, `Error ${res.status} en ${path}`);
  }

  return res.json();
}
