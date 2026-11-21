"use client";
import { useCallback, useEffect, useState } from "react";

export const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
let cache = { token: null, exp: 0 };

export const clearToken = () => (cache = { token: null, exp: 0 });

// JWT for protected Express routes, generated from the BetterAuth session
export async function getToken() {
  if (cache.token && Date.now() < cache.exp) return cache.token;
  const r = await fetch("/api/token", { credentials: "include", cache: "no-store" });
  if (!r.ok) throw new Error("Please sign in to continue");
  const { token } = await r.json();
  cache = { token, exp: Date.now() + 50 * 60 * 1000 };
  return token;
}

export async function api(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) headers.Authorization = `Bearer ${await getToken()}`;
  const res = await fetch(`${API}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined, cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.message || "Something went wrong"), { code: data.code, status: res.status });
  return data;
}

// Small data hook: const { data, loading, error, reload } = useFetch("/tuitions/mine/list")
export function useFetch(path, { auth = true, enabled = true } = {}) {
  const [state, setState] = useState({ data: null, loading: enabled, error: null });
  const load = useCallback(async () => {
    if (!enabled || !path) return;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      setState({ data: await api(path, { auth }), loading: false, error: null });
    } catch (e) {
      setState({ data: null, loading: false, error: e.message });
    }
  }, [path, auth, enabled]);
  useEffect(() => { load(); }, [load]);
  return { ...state, reload: load, setData: (d) => setState((s) => ({ ...s, data: d })) };
}
