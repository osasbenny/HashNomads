"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [light, setLight] = useState(false);
  useEffect(() => {
    setLight(document.documentElement.dataset.theme === "light");
    const sync = (event: StorageEvent) => {
      if (event.key !== "hashnomads-theme") return;
      const next = event.newValue === "light";
      document.documentElement.dataset.theme = next ? "light" : "dark";
      setLight(next);
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label="Light theme"
      role="switch"
      aria-checked={light}
      title={light ? "Switch to dark theme" : "Switch to light theme"}
      onClick={() => {
        const next = !light;
        document.documentElement.dataset.theme = next ? "light" : "dark";
        setLight(next);
        try {
          localStorage.setItem("hashnomads-theme", next ? "light" : "dark");
        } catch {}
      }}
    >
      {light ? (
        <Moon size={19} aria-hidden="true" />
      ) : (
        <Sun size={19} aria-hidden="true" />
      )}
    </button>
  );
}
