"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import comingSoon from "@/assets/images/coming-soon.png";
import { heroContainer, heroRise } from "./hero-motion";

const HEADLINE_LINES = ["Find a home that fits", "the way you live."];
const LAUNCH_AT = new Date(
  process.env.NEXT_PUBLIC_LAUNCH_DATE ?? "2026-10-01T00:00:00+02:00",
).getTime();

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const EMPTY_COUNTDOWN: Countdown = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

function getCountdown(): Countdown {
  const remaining = Math.max(0, LAUNCH_AT - Date.now());

  return {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining / 3_600_000) % 24),
    minutes: Math.floor((remaining / 60_000) % 60),
    seconds: Math.floor((remaining / 1_000) % 60),
  };
}

export function HeroStatement() {
  const [countdown, setCountdown] = useState(EMPTY_COUNTDOWN);

  useEffect(() => {
    const updateCountdown = () => setCountdown(getCountdown());

    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1_000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={heroContainer}
      className="mx-auto flex flex-col items-center"
    >
      <h1 className="font-bricolage text-fg max-w-[16ch] text-[clamp(3rem,5.4vw,5rem)] leading-[0.98] font-normal tracking-[-0.045em] text-balance">
        {HEADLINE_LINES.map((line) => (
          <motion.span key={line} variants={heroRise} className="block">
            <span>{line}</span>
          </motion.span>
        ))}
      </h1>
      <motion.div variants={heroRise} className="mt-6">
        <Image
          src={comingSoon}
          alt="Coming soon"
          className="h-auto w-[clamp(10rem,20vw,16rem)] object-contain"
        />
        <div
          className="mt-5 grid grid-cols-4 gap-2 sm:gap-3"
          aria-label="Time remaining until HauxHunt launches"
        >
          {(
            [
              ["Days", countdown.days],
              ["Hours", countdown.hours],
              ["Minutes", countdown.minutes],
              ["Seconds", countdown.seconds],
            ] as const
          ).map(([label, value]) => (
            <div
              key={label}
              className="min-w-16 border border-white/15 bg-black/20 px-2 py-2.5 backdrop-blur-sm sm:min-w-20 sm:px-3"
            >
              <span className="font-bricolage block text-2xl leading-none font-medium tracking-[-0.04em] text-white tabular-nums sm:text-3xl">
                {String(value).padStart(2, "0")}
              </span>
              <span className="mt-1 block text-[0.58rem] font-medium tracking-[0.14em] text-white/50 uppercase sm:text-[0.65rem]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
