"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

/** A cinematic property film with restrained scroll depth on desktop. */
export function HeroAtmosphere() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "4%"]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.16, 1.12]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
    >
      <motion.div
        style={
          reducedMotion ? { scale: 1.14 } : { y: photoY, scale: photoScale }
        }
        className="hero-photo-motion absolute inset-x-0 -inset-y-[4%] overflow-hidden"
      >
        <video
          aria-hidden="true"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/hero-home.webp"
          className="hero-photo absolute inset-0 h-full w-full object-cover object-center motion-reduce:hidden"
        >
          <source src="/videos/hauxhunt-hero.mp4" type="video/mp4" />
        </video>
        <Image
          src="/images/hero-home.webp"
          alt="A contemporary long-term rental home at dusk"
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          className="hero-photo hidden object-cover object-center motion-reduce:block"
        />
      </motion.div>

      <div aria-hidden="true" className="hero-atmosphere absolute inset-0" />
      <div aria-hidden="true" className="hero-bloom absolute inset-0" />
    </div>
  );
}
