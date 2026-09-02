"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { heroContainer, heroRise } from "./hero-motion";

const HEADLINE_LINES = ["Find a home that fits", "the way you live."];
const LAUNCH_AT = new Date(
  process.env.NEXT_PUBLIC_LAUNCH_DATE ?? "2026-11-01T00:00:00+02:00",
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
        <ComingSoonReveal />
        <div
          className="mt-5 grid grid-cols-4 gap-2 sm:gap-5"
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
            <div key={label} className="min-w-16 sm:min-w-20">
              <CountdownValue value={value} />
              <span className="font-bricolage mt-2 block text-[0.58rem] font-medium tracking-[0.14em] text-white uppercase sm:text-[0.65rem]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ComingSoonReveal() {
  const messages = ["Coming soon", "Stay tuned"] as const;
  const [messageIndex, setMessageIndex] = useState(0);
  const advanceMessage = useCallback(
    () => setMessageIndex((current) => (current + 1) % messages.length),
    [messages.length],
  );

  return (
    <div className="relative mx-auto w-[clamp(15rem,32vw,24rem)] py-1 text-center">
      <span className="sr-only">Coming soon. Stay tuned.</span>
      <div
        className="flex h-[clamp(4.5rem,8vw,7rem)] items-center justify-center"
        aria-hidden="true"
      >
        <AnimatePresence mode="wait">
          <HandwrittenLine
            key={messages[messageIndex]}
            text={messages[messageIndex]}
            onFinished={advanceMessage}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}

function HandwrittenLine({
  text,
  onFinished,
}: {
  text: string;
  onFinished: () => void;
}) {
  useEffect(() => {
    const timeout = window.setTimeout(onFinished, 5_000);

    return () => window.clearTimeout(timeout);
  }, [onFinished]);

  return (
    <motion.span
      className="font-bricolage block pb-2 text-[clamp(1.25rem,2.4vw,1.8rem)] leading-[1.2] font-normal tracking-[-0.025em] whitespace-nowrap text-white"
      initial={{ clipPath: "inset(0 100% 0 0)" }}
      animate={{ clipPath: "inset(0 0% 0 0)" }}
      exit={{ clipPath: "inset(0 100% 0 0)" }}
      transition={{ duration: 1.25, ease: [0.45, 0, 0.55, 1] }}
    >
      {text}
    </motion.span>
  );
}

function CountdownValue({ value }: { value: number }) {
  return (
    <span className="font-bricolage flex h-14 items-center justify-center text-4xl leading-none font-semibold tracking-[-0.06em] text-white tabular-nums sm:h-16 sm:text-5xl">
      {String(value).padStart(2, "0")}
    </span>
  );
}
