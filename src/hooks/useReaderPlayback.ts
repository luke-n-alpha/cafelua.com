"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { LibraryLocale } from "@/data/library/libraryCopy";
import type { MeasuredReaderPage } from "@/lib/library-dom-pagination";

export type AutoTurnState = "stopped" | "running" | "paused";
export type SpeechState = "unsupported" | "idle" | "speaking" | "paused";

const AUTO_TURN_SECONDS_KEY = "cafelua_reader_auto_turn_seconds";
const SPEECH_RATE_KEY = "cafelua_reader_speech_rate";
const SPEECH_VOICE_KEY = "cafelua_reader_speech_voice";

export const MIN_AUTO_TURN_SECONDS = 3;
export const MAX_AUTO_TURN_SECONDS = 120;

export function clampAutoTurnSeconds(value: number) {
  if (!Number.isFinite(value)) return 15;
  return Math.min(MAX_AUTO_TURN_SECONDS, Math.max(MIN_AUTO_TURN_SECONDS, Math.round(value)));
}

export function readerPagesToText(pages: MeasuredReaderPage[]) {
  if (typeof document === "undefined") return "";
  const parser = new DOMParser();
  return pages
    .map((page) => {
      const parsed = parser.parseFromString(page.html, "text/html");
      parsed.body
        .querySelectorAll("h1,h2,h3,h4,h5,h6,p,li,blockquote,figcaption,td,th,br")
        .forEach((element) => element.append(" "));
      return (
        parsed.body.textContent
          ?.replace(/\s+/gu, " ")
          .replace(/\s+([,.;:!?])/gu, "$1")
          .trim() ?? ""
      );
    })
    .filter(Boolean)
    .join("\n");
}

function readNumberSetting(key: string, fallback: number) {
  try {
    const value = Number(window.localStorage.getItem(key));
    return Number.isFinite(value) && value > 0 ? value : fallback;
  } catch {
    return fallback;
  }
}

function saveSetting(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Reader controls still work when storage is blocked.
  }
}

export function useReaderPlayback({
  pages,
  pageIndex,
  pageStep,
  totalPages,
  locale,
  onAdvance,
}: {
  pages: MeasuredReaderPage[];
  pageIndex: number;
  pageStep: number;
  totalPages: number;
  locale: LibraryLocale;
  onAdvance: () => void;
}) {
  const [autoTurnState, setAutoTurnState] = useState<AutoTurnState>("stopped");
  const [autoTurnSeconds, setAutoTurnSecondsState] = useState(15);
  const [speechState, setSpeechState] = useState<SpeechState>("idle");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURIState] = useState("");
  const [speechRate, setSpeechRateState] = useState(1);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const speechGenerationRef = useRef(0);
  const continuousSpeechRef = useRef(false);
  const speechAdvancePendingRef = useRef(false);
  const onAdvanceRef = useRef(onAdvance);
  const speakCurrentPageRef = useRef<() => void>(() => undefined);
  const pageText = useMemo(() => readerPagesToText(pages), [pages]);
  const pageKey = `${pageIndex}:${pageStep}:${totalPages}`;
  const atLastPage = totalPages === 0 || pageIndex + pageStep >= totalPages;
  const speechSupported =
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window;

  useEffect(() => {
    onAdvanceRef.current = onAdvance;
  }, [onAdvance]);

  useEffect(() => {
    const syncVisibility = () => setIsPageVisible(document.visibilityState !== "hidden");
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, []);

  useEffect(() => {
    setAutoTurnSecondsState(
      clampAutoTurnSeconds(readNumberSetting(AUTO_TURN_SECONDS_KEY, 15)),
    );
    setSpeechRateState(
      Math.min(2, Math.max(0.6, readNumberSetting(SPEECH_RATE_KEY, 1))),
    );
    try {
      setVoiceURIState(window.localStorage.getItem(SPEECH_VOICE_KEY) ?? "");
    } catch {
      // Use the language-matched default voice.
    }
  }, []);

  useEffect(() => {
    if (!speechSupported) {
      setSpeechState("unsupported");
      return;
    }
    const synth = window.speechSynthesis;
    const refreshVoices = () => setVoices(synth.getVoices());
    refreshVoices();
    synth.addEventListener("voiceschanged", refreshVoices);
    return () => synth.removeEventListener("voiceschanged", refreshVoices);
  }, [speechSupported]);

  const localeVoices = useMemo(() => {
    const languagePrefix = locale === "ko" ? "ko" : "en";
    return voices.filter((voice) => voice.lang.toLowerCase().startsWith(languagePrefix));
  }, [locale, voices]);
  const selectedVoice = useMemo(
    () => localeVoices.find((voice) => voice.voiceURI === voiceURI) ?? localeVoices[0],
    [localeVoices, voiceURI],
  );

  const stopSpeech = useCallback(() => {
    continuousSpeechRef.current = false;
    speechAdvancePendingRef.current = false;
    speechGenerationRef.current += 1;
    if (speechSupported) window.speechSynthesis.cancel();
    setSpeechState(speechSupported ? "idle" : "unsupported");
  }, [speechSupported]);

  const speakCurrentPage = useCallback(
    () => {
      if (!speechSupported || !pageText) return;
      const synth = window.speechSynthesis;
      const generation = speechGenerationRef.current + 1;
      speechGenerationRef.current = generation;
      continuousSpeechRef.current = true;
      speechAdvancePendingRef.current = false;
      setAutoTurnState("stopped");
      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(pageText);
      utterance.lang = locale === "ko" ? "ko-KR" : "en-US";
      utterance.rate = speechRate;
      if (selectedVoice) utterance.voice = selectedVoice;
      utterance.onstart = () => {
        if (speechGenerationRef.current === generation) setSpeechState("speaking");
      };
      utterance.onend = () => {
        if (speechGenerationRef.current !== generation) return;
        setSpeechState("idle");
        if (atLastPage) {
          continuousSpeechRef.current = false;
          return;
        }
        speechAdvancePendingRef.current = true;
        onAdvanceRef.current();
      };
      utterance.onerror = () => {
        if (speechGenerationRef.current !== generation) return;
        continuousSpeechRef.current = false;
        setSpeechState("idle");
      };
      setSpeechState("speaking");
      synth.speak(utterance);
    }, [atLastPage, locale, pageText, selectedVoice, speechRate, speechSupported],
  );

  const pauseSpeech = useCallback(() => {
    if (!speechSupported || speechState !== "speaking") return;
    window.speechSynthesis.pause();
    setSpeechState("paused");
  }, [speechState, speechSupported]);

  const resumeSpeech = useCallback(() => {
    if (!speechSupported || speechState !== "paused") return;
    window.speechSynthesis.resume();
    setSpeechState("speaking");
  }, [speechState, speechSupported]);

  useEffect(() => {
    speakCurrentPageRef.current = speakCurrentPage;
  }, [speakCurrentPage]);

  const setAutoTurnSeconds = useCallback((seconds: number) => {
    const next = clampAutoTurnSeconds(seconds);
    setAutoTurnSecondsState(next);
    saveSetting(AUTO_TURN_SECONDS_KEY, String(next));
  }, []);

  const setSpeechRate = useCallback((rate: number) => {
    const next = Math.min(2, Math.max(0.6, Number(rate.toFixed(1))));
    setSpeechRateState(next);
    saveSetting(SPEECH_RATE_KEY, String(next));
  }, []);

  const setVoiceURI = useCallback((uri: string) => {
    setVoiceURIState(uri);
    saveSetting(SPEECH_VOICE_KEY, uri);
  }, []);

  const startAutoTurn = useCallback(() => {
    stopSpeech();
    setAutoTurnState("running");
  }, [stopSpeech]);

  useEffect(() => {
    if (autoTurnState !== "running" || atLastPage) return;
    if (speechState === "speaking" || speechState === "paused") return;
    if (!isPageVisible) return;
    const timer = window.setTimeout(() => onAdvanceRef.current(), autoTurnSeconds * 1000);
    return () => window.clearTimeout(timer);
  }, [atLastPage, autoTurnSeconds, autoTurnState, isPageVisible, pageKey, speechState]);

  useEffect(() => {
    if (atLastPage && autoTurnState === "running") {
      setAutoTurnState("stopped");
    }
  }, [atLastPage, autoTurnState]);

  useEffect(() => {
    if (!speechSupported) return;
    const shouldContinue =
      continuousSpeechRef.current && speechAdvancePendingRef.current;
    speechAdvancePendingRef.current = false;
    speechGenerationRef.current += 1;
    window.speechSynthesis.cancel();
    setSpeechState("idle");
    if (shouldContinue && pageText) {
      const timer = window.setTimeout(() => speakCurrentPageRef.current(), 0);
      return () => window.clearTimeout(timer);
    }
    continuousSpeechRef.current = false;
  }, [atLastPage, pageKey, pageText, speechSupported]);

  useEffect(
    () => () => {
      speechGenerationRef.current += 1;
      if (speechSupported) window.speechSynthesis.cancel();
    },
    [speechSupported],
  );

  return {
    autoTurnState,
    autoTurnSeconds,
    setAutoTurnSeconds,
    startAutoTurn,
    pauseAutoTurn: () => setAutoTurnState("paused"),
    stopAutoTurn: () => setAutoTurnState("stopped"),
    speechState,
    speechSupported,
    voices: localeVoices,
    voiceURI: localeVoices.some((voice) => voice.voiceURI === voiceURI) ? voiceURI : "",
    setVoiceURI,
    speechRate,
    setSpeechRate,
    speakCurrentPage,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    pageHasText: Boolean(pageText),
    atLastPage,
  };
}
