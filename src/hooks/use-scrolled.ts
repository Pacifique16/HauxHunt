"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether the page has moved past a threshold near the top.
 *
 * Implemented with an `IntersectionObserver` watching a zero-width sentinel
 * rather than a `scroll` listener. The observer fires only on the two
 * transitions that matter instead of on every scroll frame, so the nav costs
 * nothing while the user is actually scrolling — which is exactly when the
 * main thread is busiest.
 *
 * Returns the sentinel ref alongside the state; render it as the first element
 * in document flow.
 */
export function useScrolled(threshold = 40) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [threshold]);

  return { scrolled, sentinelRef, threshold };
}
