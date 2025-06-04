
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  // themePreference stores the user's choice: 'light', 'dark', or 'system'.
  const [themePreference, setThemePreference] = React.useState<"light" | "dark" | "system">("system");
  // activeTheme stores the theme actually applied to the page: 'light' or 'dark'.
  const [activeTheme, setActiveTheme] = React.useState<"light" | "dark">("light"); // Default to light for SSR
  const [isMounted, setIsMounted] = React.useState(false);

  // Effect to run once on client mount
  React.useEffect(() => {
    setIsMounted(true);
    // Load user's preference from localStorage. If not set, 'system' remains the default.
    const storedPreference = localStorage.getItem("acontafacil-theme-preference") as "light" | "dark" | "system" | null;
    if (storedPreference && ["light", "dark", "system"].includes(storedPreference)) {
      setThemePreference(storedPreference);
    }
    // The theme application logic is in the next effect, which depends on themePreference and isMounted.
  }, []);

  // Effect to apply the theme to the DOM and update activeTheme state
  React.useEffect(() => {
    if (!isMounted) return; // Ensure this only runs on the client after mount

    let currentThemeToApply: "light" | "dark";
    if (themePreference === "system") {
      currentThemeToApply = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      currentThemeToApply = themePreference;
    }
    
    setActiveTheme(currentThemeToApply); // Update state for UI (e.g., icon)
    document.documentElement.classList.toggle("dark", currentThemeToApply === "dark");
    localStorage.setItem("acontafacil-theme-preference", themePreference); // Persist the user's preference

    // If the preference is "system", set up a listener for OS-level theme changes
    if (themePreference === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        const newSystemTheme = e.matches ? "dark" : "light";
        setActiveTheme(newSystemTheme);
        document.documentElement.classList.toggle("dark", newSystemTheme === "dark");
      };
      mediaQuery.addEventListener("change", handleChange);
      // Cleanup listener on component unmount or if preference changes
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [themePreference, isMounted]);

  const toggleTheme = () => {
    setThemePreference(prev => {
      if (prev === "system") {
        // If current preference is system, determine actual system theme and switch to the opposite explicit theme
        const systemIsCurrentlyDark = isMounted && window.matchMedia("(prefers-color-scheme: dark)").matches;
        return systemIsCurrentlyDark ? "light" : "dark";
      }
      // If explicit 'light' or 'dark', switch to the other
      return prev === "dark" ? "light" : "dark";
    });
  };
  
  if (!isMounted) {
    // Render a placeholder button during SSR and before client-side mount.
    // This avoids calling window-dependent logic too early and prevents hydration mismatches.
    // The icon shown here (Moon) is a static default; it will update after mount.
    return (
      <Button variant="ghost" size="icon" disabled aria-label="Toggle theme">
        <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={`Switch to ${activeTheme === 'dark' ? 'light' : 'dark'} mode`}>
      {activeTheme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
