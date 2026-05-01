"use client";

import { useEffect } from "react";

export default function ThemeApplier() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme-color");
    if (savedTheme) {
      document.documentElement.style.setProperty('--bg-color', savedTheme);
    }
  }, []);

  return null;
}
