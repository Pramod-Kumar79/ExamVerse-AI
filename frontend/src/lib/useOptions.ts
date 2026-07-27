"use client";

import { useEffect, useState } from "react";
import { api } from "./api";

function extractList<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (raw && typeof raw === "object") {
    for (const value of Object.values(raw as Record<string, unknown>)) {
      if (Array.isArray(value)) return value as T[];
    }
  }
  return [];
}

export function useOptions<T extends object>(
  endpoint: string,
  toOption: (item: T) => { value: string; label: string },
) {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .get<unknown>(endpoint)
      .then((res) => {
        if (!active) return;
        const list = extractList<T>(res);
        setItems(list);
        setOptions(list.map(toOption));
      })
      .catch(() => {
        if (active) {
          setItems([]);
          setOptions([]);
        }
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  return { options, items, loading };
}
