"use client";

import { useEffect, useRef, ReactNode } from "react";

type Animation = "fade-up" | "fade-left" | "fade-right" | "scale-in";

interface Props {
  children: ReactNode;
  /** Extra Tailwind / CSS classes applied to the wrapper div */
  className?: string;
  /** Delay in milliseconds before the animation starts (for staggering) */
  delay?: number;
  /** Which enter animation to use */
  animation?: Animation;
  /** IntersectionObserver threshold (0–1). Defaults to 0.12 */
  threshold?: number;
}

/**
 * Wraps children in a div that animates into view when it enters the viewport.
 * Uses IntersectionObserver — no layout shift, no forced repaints.
 */
export default function AnimateOnScroll({
  children,
  className = "",
  delay = 0,
  animation = "fade-up",
  threshold = 0.12,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.animationDelay = `${delay}ms`;
          el.classList.add("animate-in");
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold]);

  return (
    <div ref={ref} className={`anim-${animation} ${className}`}>
      {children}
    </div>
  );
}
