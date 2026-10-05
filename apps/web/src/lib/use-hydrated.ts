"use client";
import { useEffect, useState } from "react";
// Keep submit controls inert until their client handlers are attached.
export function useHydrated() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready;
}
