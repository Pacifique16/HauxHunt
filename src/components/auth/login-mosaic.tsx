"use client";

import { useEffect, useRef, useState } from "react";

type CardTone = "dark" | "green" | "lime" | "white";
type CardPhase = "entering" | "visible" | "exiting";

type MosaicCard = {
  id: number;
  position: number;
  tone: CardTone;
  label: string;
  title: string;
  phase: CardPhase;
  version: number;
};

const INITIAL_CARDS: MosaicCard[] = [
  {
    id: 0,
    position: 3,
    tone: "lime",
    label: "HauxHunt",
    title: "Find your fit.",
    phase: "entering",
    version: 0,
  },
  {
    id: 1,
    position: 10,
    tone: "green",
    label: "Discover",
    title: "Search less.",
    phase: "entering",
    version: 0,
  },
  {
    id: 2,
    position: 13,
    tone: "white",
    label: "Your shortlist",
    title: "Save. Compare.",
    phase: "entering",
    version: 0,
  },
  {
    id: 3,
    position: 16,
    tone: "lime",
    label: "Trusted listings",
    title: "Move sooner.",
    phase: "entering",
    version: 0,
  },
  {
    id: 4,
    position: 19,
    tone: "dark",
    label: "24/7 access",
    title: "Welcome home.",
    phase: "entering",
    version: 0,
  },
];

export function LoginMosaic() {
  const [cards, setCards] = useState(INITIAL_CARDS);
  const replacementStep = useRef(0);

  useEffect(() => {
    const timeouts: number[] = [];

    const rotateCard = () => {
      const targetId = replacementStep.current % 5;
      replacementStep.current += 1;

      setCards((current) =>
        current.map((card) =>
          card.id === targetId ? { ...card, phase: "exiting" } : card,
        ),
      );

      timeouts.push(
        window.setTimeout(() => {
          setCards((current) =>
            current.map((card) => {
              if (card.id !== targetId) return card;

              if (card.id === 0) {
                const showOriginalMessage = card.title === "See what fits.";
                return {
                  ...card,
                  position: 3,
                  tone: showOriginalMessage ? "lime" : "white",
                  label: showOriginalMessage ? "HauxHunt" : "Explore",
                  title: showOriginalMessage
                    ? "Find your fit."
                    : "See what fits.",
                  phase: "entering",
                  version: card.version + 1,
                };
              }

              if (card.id === 1) {
                const showOriginalMessage =
                  card.title === "Know before you go.";
                return {
                  ...card,
                  position: 10,
                  tone: "green",
                  label: showOriginalMessage ? "Discover" : "Clear details",
                  title: showOriginalMessage
                    ? "Search less."
                    : "Know before you go.",
                  phase: "entering",
                  version: card.version + 1,
                };
              }

              if (card.id === 2) {
                const showOriginalMessage =
                  card.title === "Keep favourites close.";
                return {
                  ...card,
                  position: 13,
                  tone: "white",
                  label: showOriginalMessage ? "Your shortlist" : "Saved homes",
                  title: showOriginalMessage
                    ? "Save. Compare."
                    : "Keep favourites close.",
                  phase: "entering",
                  version: card.version + 1,
                };
              }

              if (card.id === 3) {
                const showOriginalMessage = card.title === "Move with clarity.";
                return {
                  ...card,
                  position: 16,
                  tone: "lime",
                  label: showOriginalMessage
                    ? "Trusted listings"
                    : "Better choices",
                  title: showOriginalMessage
                    ? "Move sooner."
                    : "Move with clarity.",
                  phase: "entering",
                  version: card.version + 1,
                };
              }

              const showOriginalMessage =
                card.title === "Start somewhere good.";
              return {
                ...card,
                position: 19,
                tone: "dark",
                label: showOriginalMessage ? "24/7 access" : "Your next move",
                title: showOriginalMessage
                  ? "Welcome home."
                  : "Start somewhere good.",
                phase: "entering",
                version: card.version + 1,
              };
            }),
          );
        }, 700),
      );

      timeouts.push(
        window.setTimeout(() => {
          setCards((current) =>
            current.map((card) =>
              card.id === targetId ? { ...card, phase: "visible" } : card,
            ),
          );
        }, 1550),
      );
    };

    const interval = window.setInterval(rotateCard, 4200);

    return () => {
      window.clearInterval(interval);
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, []);

  return (
    <section
      aria-label="HauxHunt property showcase"
      className="relative hidden min-h-0 grid-cols-5 grid-rows-4 gap-1 overflow-hidden rounded-[1.75rem] bg-[#0a0a0a] p-2 lg:grid"
    >
      <svg aria-hidden="true" className="absolute size-0">
        <defs>
          <clipPath id="login-mosaic-grid" clipPathUnits="objectBoundingBox">
            {Array.from({ length: 20 }, (_, index) => {
              const row = Math.floor(index / 5);
              const column = index % 5;
              return (
                <rect
                  key={index}
                  x={column * 0.2008}
                  y={row * 0.251}
                  width="0.1968"
                  height="0.247"
                  rx="0.018"
                  ry="0.022"
                />
              );
            })}
          </clipPath>
        </defs>
      </svg>
      <video
        aria-hidden="true"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)] rounded-[1.25rem] object-cover"
        style={{ clipPath: "url(#login-mosaic-grid)" }}
      >
        <source src="/videos/hauxhunt-login.mp4" type="video/mp4" />
      </video>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-2 bg-black/10"
        style={{ clipPath: "url(#login-mosaic-grid)" }}
      />

      {Array.from({ length: 20 }, (_, position) => {
        const card = cards.find((item) => item.position === position);
        return (
          <div
            key={position}
            className="relative z-10 min-h-0 overflow-hidden rounded-[1.25rem]"
          >
            {card ? (
              <MessageCard key={`${card.id}-${card.version}`} card={card} />
            ) : null}
          </div>
        );
      })}
    </section>
  );
}

function MessageCard({ card }: { card: MosaicCard }) {
  const toneClass =
    card.tone === "lime"
      ? "bg-[#d9ff35] text-black"
      : card.tone === "green"
        ? "bg-[#00f58a] text-black"
        : card.tone === "white"
          ? "bg-white text-black"
          : "bg-[#151515] text-white";
  const phaseClass =
    card.phase === "exiting"
      ? "login-mosaic-message-exit"
      : card.phase === "entering"
        ? "login-mosaic-message-enter"
        : "";
  const delay =
    card.phase === "entering"
      ? card.version === 0
        ? 500 + card.id * 700
        : 80
      : 0;

  return (
    <article
      className={`absolute inset-0 p-4 xl:p-5 ${toneClass} ${phaseClass}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex h-full flex-col justify-between">
        <span className="font-bricolage text-[0.6rem] font-medium tracking-[0.1em] uppercase opacity-45 xl:text-xs">
          {card.label}
        </span>
        <h2 className="font-bricolage text-lg leading-none font-medium tracking-[-0.04em] xl:text-2xl">
          {card.title}
        </h2>
      </div>
    </article>
  );
}
