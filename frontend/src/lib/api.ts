// export const API_BASE =
//   process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
//   "http://localhost:5001/api";

// let accessToken: string | null = null;
// let refreshPromise: Promise<string | null> | null = null;

// export function setAccessToken(token: string | null) {
//   accessToken = token;
// }

// export function getAccessToken() {
//   return accessToken;
// }

// export class ApiError extends Error {
//   status: number;
//   constructor(message: string, status: number) {
//     super(message);
//     this.status = status;
//   }
// }

// async function doRefresh(): Promise<string | null> {
//   try {
//     const res = await fetch(`${API_BASE}/auth/refresh`, {
//       method: "POST",
//       credentials: "include",
//     });
//     if (!res.ok) return null;
//     const json = await res.json();
//     const token = json?.data?.accessToken ?? null;
//     accessToken = token;
//     return token;
//   } catch {
//     return null;
//   }
// }

// interface RequestOptions {
//   method?: string;
//   body?: unknown;
//   isForm?: boolean;
//   skipAuth?: boolean;
//   query?: Record<string, string | number | boolean | undefined>;
// }

// function buildQuery(query?: RequestOptions["query"]) {
//   if (!query) return "";
//   const params = new URLSearchParams();
//   Object.entries(query).forEach(([k, v]) => {
//     if (v !== undefined && v !== "") params.set(k, String(v));
//   });
//   const qs = params.toString();
//   return qs ? `?${qs}` : "";
// }

// async function request<T>(path: string, opts: RequestOptions = {}, retried = false): Promise<T> {
//   const headers: Record<string, string> = {};
//   if (!opts.isForm) headers["Content-Type"] = "application/json";
//   if (!opts.skipAuth && accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

//   const res = await fetch(`${API_BASE}${path}${buildQuery(opts.query)}`, {
//     method: opts.method || "GET",
//     headers,
//     credentials: "include",
//     body: opts.body
//       ? opts.isForm
//         ? (opts.body as FormData)
//         : JSON.stringify(opts.body)
//       : undefined,
//   });

//   if (res.status === 401 && !opts.skipAuth && !retried) {
//     if (!refreshPromise) {
//       refreshPromise = doRefresh().finally(() => {
//         refreshPromise = null;
//       });
//     }
//     const newToken = await refreshPromise;
//     if (newToken) {
//       return request<T>(path, opts, true);
//     }
//   }

//   let json: unknown = null;
//   try {
//     json = await res.json();
//   } catch {
//     // no body
//   }

//   if (!res.ok) {
//     const message =
//       (json as { message?: string })?.message || `Request failed (${res.status})`;
//     throw new ApiError(message, res.status);
//   }

//   return (json as { data: T })?.data as T;
// }

// export const api = {
//   get: <T>(path: string, query?: RequestOptions["query"]) =>
//     request<T>(path, { method: "GET", query }),
//   post: <T>(path: string, body?: unknown, opts: Partial<RequestOptions> = {}) =>
//     request<T>(path, { method: "POST", body, ...opts }),
//   patch: <T>(path: string, body?: unknown, opts: Partial<RequestOptions> = {}) =>
//     request<T>(path, { method: "PATCH", body, ...opts }),
//   delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
//   refresh: doRefresh,
// };

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:5000/api";

// The backend serves uploaded files (e.g. question images) from its root,
// not under /api — strip the /api suffix to get the right base for them.
export const ASSET_BASE = API_BASE.replace(/\/api$/, "");

export function assetUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//.test(path)) return path;
  return `${ASSET_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}

let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function doRefresh(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return null;
    const json = await res.json();
    const token = json?.data?.accessToken ?? null;
    accessToken = token;
    return token;
  } catch {
    return null;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  isForm?: boolean;
  skipAuth?: boolean;
  query?: Record<string, string | number | boolean | undefined>;
}

function buildQuery(query?: RequestOptions["query"]) {
  if (!query) return "";
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== "") params.set(k, String(v));
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

async function request<T>(
  path: string,
  opts: RequestOptions = {},
  retried = false,
): Promise<T> {
  const headers: Record<string, string> = {};
  if (!opts.isForm) headers["Content-Type"] = "application/json";
  if (!opts.skipAuth && accessToken)
    headers["Authorization"] = `Bearer ${accessToken}`;

  const res = await fetch(`${API_BASE}${path}${buildQuery(opts.query)}`, {
    method: opts.method || "GET",
    headers,
    credentials: "include",
    body: opts.body
      ? opts.isForm
        ? (opts.body as FormData)
        : JSON.stringify(opts.body)
      : undefined,
  });

  if (res.status === 401 && !opts.skipAuth && !retried) {
    if (!refreshPromise) {
      refreshPromise = doRefresh().finally(() => {
        refreshPromise = null;
      });
    }
    const newToken = await refreshPromise;
    if (newToken) {
      return request<T>(path, opts, true);
    }
  }

  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    // no body
  }

  if (!res.ok) {
    const message =
      (json as { message?: string })?.message ||
      `Request failed (${res.status})`;
    throw new ApiError(message, res.status);
  }

  return (json as { data: T })?.data as T;
}

export const api = {
  get: <T>(path: string, query?: RequestOptions["query"]) =>
    request<T>(path, { method: "GET", query }),
  post: <T>(path: string, body?: unknown, opts: Partial<RequestOptions> = {}) =>
    request<T>(path, { method: "POST", body, ...opts }),
  patch: <T>(
    path: string,
    body?: unknown,
    opts: Partial<RequestOptions> = {},
  ) => request<T>(path, { method: "PATCH", body, ...opts }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  refresh: doRefresh,
  uploadImage: async (path: string, file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return request<{ url: string }>(path, {
      method: "POST",
      body: formData,
      isForm: true,
    });
  },
};