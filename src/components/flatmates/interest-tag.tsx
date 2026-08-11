import { cn } from "@/lib/utils";

// Small display polish for the interests already present in the demo data —
// falls back to the plain label for anything not in the list, so new
// interests never need a matching code change.
export const INTEREST_EMOJI: Record<string, string> = {
  Music: "🎵",
  Running: "🏃",
  Coffee: "☕",
  Cycling: "🚴",
  Cooking: "🍳",
  Podcasts: "🎧",
  Reading: "📖",
  Football: "⚽",
  Gaming: "🎮",
  Hiking: "🥾",
  Yoga: "🧘",
  Brunch: "🥐",
  Photography: "📷",
  Travel: "✈️",
};

export function InterestTag({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const emoji = INTEREST_EMOJI[label];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-black/[0.055] px-2.5 py-1 text-xs whitespace-nowrap text-black/70",
        className,
      )}
    >
      {emoji ? <span aria-hidden="true">{emoji}</span> : null} {label}
    </span>
  );
}
