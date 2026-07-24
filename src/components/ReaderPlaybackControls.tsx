"use client";

import { useState } from "react";
import {
  Pause,
  Play,
  Settings2,
  Square,
  Timer,
  Volume2,
} from "lucide-react";

import type { LibraryLocale } from "@/data/library/libraryCopy";
import type { MeasuredReaderPage } from "@/lib/library-dom-pagination";
import {
  MAX_AUTO_TURN_SECONDS,
  MIN_AUTO_TURN_SECONDS,
  useReaderPlayback,
} from "@/hooks/useReaderPlayback";

type PlaybackCopy = {
  settings: string;
  autoTurn: string;
  seconds: string;
  start: string;
  pause: string;
  resume: string;
  stop: string;
  readAloud: string;
  voice: string;
  defaultVoice: string;
  rate: string;
  unsupported: string;
  noText: string;
  autoRunning: string;
  autoPaused: string;
  speechRunning: string;
  speechPaused: string;
};

export default function ReaderPlaybackControls({
  pages,
  pageIndex,
  pageStep,
  totalPages,
  locale,
  copy,
  onAdvance,
}: {
  pages: MeasuredReaderPage[];
  pageIndex: number;
  pageStep: number;
  totalPages: number;
  locale: LibraryLocale;
  copy: PlaybackCopy;
  onAdvance: () => void;
}) {
  const [panelOpen, setPanelOpen] = useState(false);
  const playback = useReaderPlayback({
    pages,
    pageIndex,
    pageStep,
    totalPages,
    locale,
    onAdvance,
  });

  const autoTitle =
    playback.autoTurnState === "running"
      ? copy.autoRunning
      : playback.autoTurnState === "paused"
        ? copy.autoPaused
        : copy.autoTurn;
  const speechTitle =
    playback.speechState === "speaking"
      ? copy.speechRunning
      : playback.speechState === "paused"
        ? copy.speechPaused
        : copy.readAloud;

  const toggleAutoTurn = () => {
    if (playback.autoTurnState === "running") playback.pauseAutoTurn();
    else playback.startAutoTurn();
  };

  const toggleSpeech = () => {
    if (playback.speechState === "speaking") playback.pauseSpeech();
    else if (playback.speechState === "paused") playback.resumeSpeech();
    else playback.speakCurrentPage();
  };

  return (
    <div className={`library-playback-controls ${panelOpen ? "open" : ""}`}>
      <button
        type="button"
        className={playback.autoTurnState === "running" ? "active" : ""}
        onClick={toggleAutoTurn}
        aria-label={autoTitle}
        title={autoTitle}
        aria-pressed={playback.autoTurnState === "running"}
        disabled={playback.atLastPage}
      >
        {playback.autoTurnState === "running" ? <Pause size={16} /> : <Timer size={16} />}
      </button>
      <button
        type="button"
        className={playback.speechState === "speaking" ? "active" : ""}
        onClick={toggleSpeech}
        aria-label={speechTitle}
        title={speechTitle}
        aria-pressed={playback.speechState === "speaking"}
        disabled={!playback.speechSupported || !playback.pageHasText}
      >
        {playback.speechState === "speaking" ? <Pause size={16} /> : <Volume2 size={16} />}
      </button>
      <button
        type="button"
        onClick={() => setPanelOpen((open) => !open)}
        aria-label={copy.settings}
        title={copy.settings}
        aria-expanded={panelOpen}
        aria-controls="library-playback-panel"
      >
        <Settings2 size={16} />
      </button>

      {panelOpen && (
        <section
          id="library-playback-panel"
          className="library-playback-panel"
          aria-label={copy.settings}
        >
          <div className="library-playback-section">
            <div className="library-playback-heading">
              <Timer size={16} />
              <strong>{copy.autoTurn}</strong>
            </div>
            <label className="library-playback-seconds">
              <input
                type="number"
                min={MIN_AUTO_TURN_SECONDS}
                max={MAX_AUTO_TURN_SECONDS}
                value={playback.autoTurnSeconds}
                onChange={(event) => playback.setAutoTurnSeconds(Number(event.target.value))}
                aria-label={copy.autoTurn}
              />
              <span>{copy.seconds}</span>
            </label>
            <div className="library-playback-actions">
              <button type="button" onClick={playback.startAutoTurn} disabled={playback.atLastPage}>
                <Play size={14} /> {copy.start}
              </button>
              <button type="button" onClick={playback.pauseAutoTurn} disabled={playback.autoTurnState !== "running"}>
                <Pause size={14} /> {copy.pause}
              </button>
              <button type="button" onClick={playback.stopAutoTurn} disabled={playback.autoTurnState === "stopped"}>
                <Square size={13} /> {copy.stop}
              </button>
            </div>
          </div>

          <div className="library-playback-section">
            <div className="library-playback-heading">
              <Volume2 size={16} />
              <strong>{copy.readAloud}</strong>
            </div>
            {!playback.speechSupported ? (
              <p className="library-playback-message">{copy.unsupported}</p>
            ) : !playback.pageHasText ? (
              <p className="library-playback-message">{copy.noText}</p>
            ) : (
              <>
                <label>
                  <span>{copy.voice}</span>
                  <select
                    value={playback.voiceURI}
                    onChange={(event) => playback.setVoiceURI(event.target.value)}
                  >
                    <option value="">{copy.defaultVoice}</option>
                    {playback.voices.map((voice) => (
                      <option key={voice.voiceURI} value={voice.voiceURI}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>{copy.rate}: {playback.speechRate.toFixed(1)}×</span>
                  <input
                    type="range"
                    min="0.6"
                    max="2"
                    step="0.1"
                    value={playback.speechRate}
                    onChange={(event) => playback.setSpeechRate(Number(event.target.value))}
                  />
                </label>
                <div className="library-playback-actions">
                  <button type="button" onClick={toggleSpeech}>
                    {playback.speechState === "speaking" ? <Pause size={14} /> : <Play size={14} />}
                    {playback.speechState === "speaking"
                      ? copy.pause
                      : playback.speechState === "paused"
                        ? copy.resume
                        : copy.start}
                  </button>
                  <button type="button" onClick={playback.stopSpeech} disabled={playback.speechState === "idle"}>
                    <Square size={13} /> {copy.stop}
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
