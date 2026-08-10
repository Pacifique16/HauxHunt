"use client";

import { useRef, useState } from "react";
import { Mic, Search } from "lucide-react";

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

export function SearchQueryField({ defaultValue }: { defaultValue: string }) {
  const [listening, setListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const transcriptRef = useRef("");

  function clearLocationSource() {
    const form = inputRef.current?.form;
    const source = form?.elements.namedItem("source");
    if (source instanceof HTMLInputElement) source.value = "";
  }

  function toggleVoiceSearch() {
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
      if (transcriptRef.current && inputRef.current) {
        inputRef.current.value = transcriptRef.current;
        clearLocationSource();
      }
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    transcriptRef.current = "";
    setListening(true);
    recognition.start();
  }

  return (
    <>
      <button
        type="submit"
        aria-label="Search"
        className="text-carbon-500 hover:text-carbon-900 shrink-0 transition-colors"
      >
        <Search aria-hidden="true" className="size-5" />
      </button>
      <input
        ref={inputRef}
        name="q"
        defaultValue={defaultValue}
        data-no-auto-submit="true"
        data-submit-when-empty="true"
        data-clear-field="source"
        placeholder="2 bedrooms in Kigali under USD 800"
        className="catalogue-filter-control min-w-0 flex-1 bg-transparent text-sm outline-none"
      />
      <button
        type="button"
        onClick={toggleVoiceSearch}
        aria-label={listening ? "Stop voice search" : "Start voice search"}
        title={listening ? "Stop listening" : "Search by voice"}
        className={`flex size-9 shrink-0 items-center justify-center bg-transparent transition-colors ${
          listening ? "text-red-600" : "text-carbon-500 hover:text-carbon-900"
        }`}
      >
        <Mic aria-hidden="true" className="size-5" />
      </button>
    </>
  );
}
