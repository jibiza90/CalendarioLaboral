"use client";

import { useEffect, useState } from "react";

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage first
    const saved = localStorage.getItem("cl_dark_mode");
    if (saved !== null) {
      setIsDark(saved === "true");
    } else {
      // Check system preference
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    localStorage.setItem("cl_dark_mode", String(isDark));
    
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    }
  }, [isDark, mounted]);

  const toggle = () => setIsDark((prev) => !prev);
  const enable = () => setIsDark(true);
  const disable = () => setIsDark(false);

  return { isDark, toggle, enable, disable, mounted };
}
