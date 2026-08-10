"use client";

import { useRef, useState } from "react";
import { Mic } from "lucide-react";

type SpeechRecognitionEventLike = {
  results: ArrayLike<{ 0: { transcript: string } }>;
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

export function VoiceInputButton({
  onTranscript,
}: {
  onTranscript?: (transcript: string) => void;
}) {
  const [listening, setListening] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const transcriptRef = useRef("");

  function applyTranscript(transcript: string) {
    if (onTranscript) {
      onTranscript(transcript);
      return;
    }

    const input = buttonRef.current
      ?.closest("label")
      ?.querySelector<HTMLInputElement>('input:not([type="hidden"])');
    if (!input) return;
    const valueSetter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )?.set;
    valueSetter?.call(input, transcript);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function toggleRecording() {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    const browserWindow = window as typeof window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const Recognition =
      browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition;
    if (!Recognition) return;

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      transcriptRef.current = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? "")
        .join(" ")
        .trim();
    };
    recognition.onend = () => {
      if (transcriptRef.current) applyTranscript(transcriptRef.current);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    transcriptRef.current = "";
    setListening(true);
    recognition.start();
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={toggleRecording}
      aria-label={listening ? "Stop voice input" : "Enter with your voice"}
      title={listening ? "Stop listening" : "Enter with your voice"}
      className={`flex size-8 shrink-0 items-center justify-center bg-transparent transition-colors ${
        listening ? "text-red-600" : "text-carbon-500 hover:text-carbon-900"
      }`}
    >
      <Mic aria-hidden="true" className="size-4.5" />
    </button>
  );
}
