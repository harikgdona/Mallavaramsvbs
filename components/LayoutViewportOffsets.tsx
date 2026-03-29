"use client";

import { useEffect } from "react";

const TOP_ID = "site-desktop-top-header";
const MOBILE_ID = "site-mobile-nav-bar-top";

/**
 * Sets --section-viewport-offset-desktop / --section-viewport-offset-mobile on <html>
 * from measured header heights so .min-h-app-section matches the real browser chrome.
 * Falls back to :root values in globals.css when an element is hidden (0 height).
 * Mobile uses the top bar row only (not the expanded menu).
 */
export function LayoutViewportOffsets() {
  useEffect(() => {
    const root = document.documentElement;

    const apply = () => {
      const topEl = document.getElementById(TOP_ID);
      const mobEl = document.getElementById(MOBILE_ID);
      const topH = topEl?.getBoundingClientRect().height ?? 0;
      const mobH = mobEl?.getBoundingClientRect().height ?? 0;

      if (topH > 0) root.style.setProperty("--section-viewport-offset-desktop", `${topH}px`);
      else root.style.removeProperty("--section-viewport-offset-desktop");

      if (mobH > 0) root.style.setProperty("--section-viewport-offset-mobile", `${mobH}px`);
      else root.style.removeProperty("--section-viewport-offset-mobile");
    };

    apply();

    const ro = new ResizeObserver(apply);
    const topEl = document.getElementById(TOP_ID);
    const mobEl = document.getElementById(MOBILE_ID);
    if (topEl) ro.observe(topEl);
    if (mobEl) ro.observe(mobEl);

    window.addEventListener("resize", apply);
    const mq = window.matchMedia("(min-width:768px)");
    mq.addEventListener("change", apply);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply);
      mq.removeEventListener("change", apply);
      root.style.removeProperty("--section-viewport-offset-desktop");
      root.style.removeProperty("--section-viewport-offset-mobile");
    };
  }, []);

  return null;
}
