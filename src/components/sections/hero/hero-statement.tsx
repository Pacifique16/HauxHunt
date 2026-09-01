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
  const [countdown, setCountdown] = useState({
    current: EMPTY_COUNTDOWN,
    previous: EMPTY_COUNTDOWN,
  });

  useEffect(() => {
    const updateCountdown = () =>
      setCountdown(({ current }) => ({
        current: getCountdown(),
        previous: current,
      }));

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
              ["Days", countdown.current.days, countdown.previous.days],
              ["Hours", countdown.current.hours, countdown.previous.hours],
              [
                "Minutes",
                countdown.current.minutes,
                countdown.previous.minutes,
              ],
              [
                "Seconds",
                countdown.current.seconds,
                countdown.previous.seconds,
              ],
            ] as const
          ).map(([label, value, previousValue]) => (
            <div
              key={label}
              className="min-w-16 [perspective:500px] sm:min-w-20"
            >
              <CountdownFlapValue
                label={label}
                value={value}
                previousValue={previousValue}
              />
              <span className="mt-2 block text-[0.58rem] font-medium tracking-[0.14em] text-white/50 uppercase sm:text-[0.65rem]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function CountdownFlapValue({
  label,
  value,
  previousValue,
}: {
  label: string;
  value: number;
  previousValue: number;
}) {
  const digitCount = Math.max(
    2,
    String(value).length,
    String(previousValue).length,
  );
  const currentDigits = String(value).padStart(digitCount, "0").split("");
  const previousDigits = String(previousValue)
    .padStart(digitCount, "0")
    .split("");

  return (
    <span
      className="countdown-flap-number font-bricolage relative flex h-14 overflow-hidden rounded-lg bg-[#1b191d] text-4xl leading-none font-semibold tracking-[-0.06em] text-white tabular-nums shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:h-16 sm:text-5xl"
      aria-label={currentDigits.join("")}
    >
      {currentDigits.map((digit, index) => {
        const previousDigit = previousDigits[index];

        return (
          <span key={`${label}-${index}`} className="countdown-flap-digit">
            <span key={`${label}-${index}-${digit}`} aria-hidden="true">
              <span className="countdown-flap-reduced-current">{digit}</span>
              <span className="countdown-flap-static countdown-flap-static--current">
                {digit}
              </span>
              <span className="countdown-flap-sheet">{previousDigit}</span>
            </span>
          </span>
        );
      })}
    </span>
  );
}
