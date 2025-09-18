import { useEffect } from "react";

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady() {
  useEffect(() => {
    window.frameworkReady?.();
  }, []); // ✅ only runs once on mount
}
