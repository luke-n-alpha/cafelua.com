export type LegacyMidiNote = {
    startSec: number;
    endSec: number;
    note: number;
    velocity: number;
    channel: number;
};

type TempoEvent = {
    tick: number;
    mpqn: number;
};

type NoteTick = {
    startTick: number;
    endTick: number;
    note: number;
    velocity: number;
    channel: number;
};

const DEFAULT_MPQN = 500000;

const readString = (view: DataView, offset: number, length: number): string => {
    const chars: string[] = [];
    for (let i = 0; i < length; i += 1) {
        chars.push(String.fromCharCode(view.getUint8(offset + i)));
    }
    return chars.join('');
};

const readVarLen = (view: DataView, offsetRef: { value: number }): number => {
    let value = 0;
    for (let i = 0; i < 4; i += 1) {
        const byte = view.getUint8(offsetRef.value);
        offsetRef.value += 1;
        value = (value << 7) | (byte & 0x7f);
        if ((byte & 0x80) === 0) return value;
    }
    return value;
};

const buildTickToSeconds = (division: number, tempoEvents: TempoEvent[]) => {
    const tempos = [...tempoEvents]
        .filter((t) => t.tick >= 0 && t.mpqn > 0)
        .sort((a, b) => a.tick - b.tick);

    if (tempos.length === 0 || tempos[0].tick !== 0) {
        tempos.unshift({ tick: 0, mpqn: DEFAULT_MPQN });
    }

    const deduped: TempoEvent[] = [];
    for (const tempo of tempos) {
        const last = deduped[deduped.length - 1];
        if (last && last.tick === tempo.tick) {
            last.mpqn = tempo.mpqn;
        } else {
            deduped.push({ ...tempo });
        }
    }

    const segments = deduped.map((tempo, index) => {
        const startTick = tempo.tick;
        const mpqn = tempo.mpqn;
        const endTick = index + 1 < deduped.length ? deduped[index + 1].tick : Number.POSITIVE_INFINITY;
        return { startTick, endTick, mpqn };
    });

    return (tick: number): number => {
        let seconds = 0;
        for (const seg of segments) {
            if (tick <= seg.startTick) break;

            const segEnd = Math.min(tick, seg.endTick);
            const deltaTicks = segEnd - seg.startTick;
            if (deltaTicks > 0) {
                seconds += (deltaTicks * seg.mpqn) / (division * 1_000_000);
            }

            if (tick < seg.endTick) break;
        }
        return seconds;
    };
};

export const parseLegacyMidiNotes = (buffer: ArrayBuffer): { notes: LegacyMidiNote[]; durationSec: number } | null => {
    const view = new DataView(buffer);
    const offsetRef = { value: 0 };

    const headerId = readString(view, offsetRef.value, 4);
    offsetRef.value += 4;
    if (headerId !== 'MThd') return null;

    const headerLen = view.getUint32(offsetRef.value, false);
    offsetRef.value += 4;
    if (headerLen < 6) return null;

    offsetRef.value += 2; // format
    const trackCount = view.getUint16(offsetRef.value, false);
    offsetRef.value += 2;
    const division = view.getUint16(offsetRef.value, false);
    offsetRef.value += 2;

    if (division === 0 || division & 0x8000) return null;

    // Skip any extra header bytes.
    offsetRef.value += headerLen - 6;

    const tempoEvents: TempoEvent[] = [{ tick: 0, mpqn: DEFAULT_MPQN }];
    const notesTicks: NoteTick[] = [];
    let lastTickOverall = 0;

    for (let trackIndex = 0; trackIndex < trackCount; trackIndex += 1) {
        if (offsetRef.value + 8 > view.byteLength) break;

        const trackId = readString(view, offsetRef.value, 4);
        offsetRef.value += 4;
        if (trackId !== 'MTrk') return null;

        const trackLen = view.getUint32(offsetRef.value, false);
        offsetRef.value += 4;
        const trackEnd = Math.min(view.byteLength, offsetRef.value + trackLen);

        let tick = 0;
        let runningStatus = 0;
        const activeNotes = new Map<string, { startTick: number; velocity: number }>();

        while (offsetRef.value < trackEnd) {
            const delta = readVarLen(view, offsetRef);
            tick += delta;
            lastTickOverall = Math.max(lastTickOverall, tick);

            if (offsetRef.value >= trackEnd) break;

            let status = view.getUint8(offsetRef.value);
            offsetRef.value += 1;

            if (status < 0x80) {
                // Running status: the current byte is actually data.
                offsetRef.value -= 1;
                status = runningStatus;
            } else {
                runningStatus = status;
            }

            if (status === 0xff) {
                if (offsetRef.value >= trackEnd) break;
                const metaType = view.getUint8(offsetRef.value);
                offsetRef.value += 1;
                const len = readVarLen(view, offsetRef);
                if (metaType === 0x51 && len === 3 && offsetRef.value + 3 <= trackEnd) {
                    const mpqn = (view.getUint8(offsetRef.value) << 16)
                        | (view.getUint8(offsetRef.value + 1) << 8)
                        | view.getUint8(offsetRef.value + 2);
                    tempoEvents.push({ tick, mpqn });
                    offsetRef.value += 3;
                } else {
                    offsetRef.value = Math.min(trackEnd, offsetRef.value + len);
                }
                continue;
            }

            if (status === 0xf0 || status === 0xf7) {
                const len = readVarLen(view, offsetRef);
                offsetRef.value = Math.min(trackEnd, offsetRef.value + len);
                continue;
            }

            const eventType = status & 0xf0;
            const channel = status & 0x0f;

            const readDataByte = () => {
                if (offsetRef.value >= trackEnd) return 0;
                const b = view.getUint8(offsetRef.value);
                offsetRef.value += 1;
                return b;
            };

            if (eventType === 0x80 || eventType === 0x90) {
                const note = readDataByte();
                const vel = readDataByte();
                const key = `${channel}-${note}`;

                const isNoteOn = eventType === 0x90 && vel > 0;
                if (isNoteOn) {
                    const existing = activeNotes.get(key);
                    if (existing) {
                        notesTicks.push({
                            startTick: existing.startTick,
                            endTick: tick,
                            note,
                            velocity: existing.velocity,
                            channel
                        });
                    }
                    activeNotes.set(key, { startTick: tick, velocity: vel / 127 });
                } else {
                    const existing = activeNotes.get(key);
                    if (existing) {
                        notesTicks.push({
                            startTick: existing.startTick,
                            endTick: tick,
                            note,
                            velocity: existing.velocity,
                            channel
                        });
                        activeNotes.delete(key);
                    }
                }
                continue;
            }

            if (eventType === 0xc0 || eventType === 0xd0) {
                // Program change / channel pressure: 1 data byte
                readDataByte();
                continue;
            }

            if (eventType === 0xa0 || eventType === 0xb0 || eventType === 0xe0) {
                // Poly pressure / control change / pitch bend: 2 data bytes
                readDataByte();
                readDataByte();
                continue;
            }

            // Unknown or unsupported event - try to skip 2 bytes safely.
            readDataByte();
            readDataByte();
        }

        // Close any stuck notes at end-of-track.
        for (const [key, existing] of activeNotes.entries()) {
            const [channelStr, noteStr] = key.split('-');
            const note = Number(noteStr);
            const channel = Number(channelStr);
            notesTicks.push({
                startTick: existing.startTick,
                endTick: tick,
                note: Number.isFinite(note) ? note : 0,
                velocity: existing.velocity,
                channel: Number.isFinite(channel) ? channel : 0
            });
        }

        offsetRef.value = trackEnd;
    }

    const tickToSeconds = buildTickToSeconds(division, tempoEvents);
    const notes = notesTicks
        .filter((n) => n.endTick > n.startTick)
        .map((n) => ({
            startSec: tickToSeconds(n.startTick),
            endSec: tickToSeconds(n.endTick),
            note: n.note,
            velocity: n.velocity,
            channel: n.channel
        }))
        .filter((n) => n.endSec - n.startSec >= 0.03)
        .sort((a, b) => a.startSec - b.startSec);

    const durationSec = tickToSeconds(lastTickOverall);
    return { notes, durationSec };
};

const midiNoteToFrequency = (note: number): number => {
    return 440 * Math.pow(2, (note - 69) / 12);
};

export class LegacyMidiSynthPlayer {
    private context: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private schedulerTimer: number | null = null;
    private endTimer: number | null = null;
    private playbackStartTime = 0;
    private scheduledIndex = 0;
    private notes: LegacyMidiNote[] = [];
    private isPlaying = false;
    private oscillators = new Set<OscillatorNode>();
    private onEnded: (() => void) | null = null;

    getIsPlaying(): boolean {
        return this.isPlaying;
    }

    private clearTimers() {
        if (this.schedulerTimer !== null) {
            window.clearInterval(this.schedulerTimer);
            this.schedulerTimer = null;
        }
        if (this.endTimer !== null) {
            window.clearTimeout(this.endTimer);
            this.endTimer = null;
        }
    }

    private getAudioContextConstructor(): typeof AudioContext | null {
        if (typeof window === 'undefined') return null;
        return window.AudioContext || ((window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext ?? null);
    }

    private async ensureAudioContext(): Promise<AudioContext | null> {
        const Ctor = this.getAudioContextConstructor();
        if (!Ctor) return null;

        if (!this.context) {
            this.context = new Ctor();
        }

        if (!this.masterGain) {
            this.masterGain = this.context.createGain();
            this.masterGain.connect(this.context.destination);
        }

        if (this.context.state === 'suspended') {
            await this.context.resume();
        }

        return this.context;
    }

    async start(src: string, options?: { volume?: number; onEnded?: () => void }): Promise<boolean> {
        this.stop();
        this.onEnded = options?.onEnded ?? null;

        let context: AudioContext | null = null;
        try {
            context = await this.ensureAudioContext();
        } catch {
            return false;
        }
        if (!context || !this.masterGain) return false;

        let parsed: { notes: LegacyMidiNote[]; durationSec: number } | null = null;
        try {
            const response = await fetch(src);
            if (!response.ok) return false;
            const buffer = await response.arrayBuffer();
            parsed = parseLegacyMidiNotes(buffer);
        } catch {
            return false;
        }
        if (!parsed || parsed.notes.length === 0) return false;

        const volume = Math.min(1, Math.max(0, options?.volume ?? 0.35));
        this.masterGain.gain.setValueAtTime(volume, context.currentTime);

        this.notes = parsed.notes;
        this.scheduledIndex = 0;
        this.playbackStartTime = context.currentTime + 0.15;
        this.isPlaying = true;

        const scheduleAheadSec = 1.0;
        const scheduleIntervalMs = 80;

        const schedule = () => {
            if (!this.context || !this.masterGain) return;
            const now = this.context.currentTime;
            const windowEnd = now + scheduleAheadSec;

            while (this.scheduledIndex < this.notes.length) {
                const note = this.notes[this.scheduledIndex];
                const startAt = this.playbackStartTime + note.startSec;
                if (startAt > windowEnd) break;

                this.scheduleNote(note);
                this.scheduledIndex += 1;
            }

            if (this.scheduledIndex >= this.notes.length && this.schedulerTimer !== null) {
                window.clearInterval(this.schedulerTimer);
                this.schedulerTimer = null;
            }
        };

        this.schedulerTimer = window.setInterval(schedule, scheduleIntervalMs);
        schedule();

        const endAt = this.playbackStartTime + parsed.durationSec + 0.25;
        const msUntilEnd = Math.max(0, (endAt - context.currentTime) * 1000);
        this.endTimer = window.setTimeout(() => {
            this.isPlaying = false;
            this.clearTimers();
            this.onEnded?.();
        }, msUntilEnd);

        return true;
    }

    private scheduleNote(note: LegacyMidiNote) {
        if (!this.context || !this.masterGain) return;

        // Skip drums (channel 10 in GM).
        if (note.channel === 9) return;

        const startAt = this.playbackStartTime + note.startSec;
        const endAt = this.playbackStartTime + note.endSec;
        if (endAt <= startAt) return;

        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        const waveform: OscillatorType = note.channel % 3 === 0 ? 'triangle' : note.channel % 3 === 1 ? 'sine' : 'square';
        osc.type = waveform;
        osc.frequency.setValueAtTime(midiNoteToFrequency(note.note), startAt);

        const peak = Math.min(0.22, 0.04 + note.velocity * 0.18);
        const attack = 0.01;
        const release = 0.04;
        const holdAt = Math.max(startAt + attack, endAt - release);

        gain.gain.setValueAtTime(0, startAt);
        gain.gain.linearRampToValueAtTime(peak, startAt + attack);
        gain.gain.setValueAtTime(peak, holdAt);
        gain.gain.linearRampToValueAtTime(0, endAt);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.onended = () => {
            this.oscillators.delete(osc);
            try {
                gain.disconnect();
            } catch {
                // ignore
            }
        };

        try {
            osc.start(startAt);
            osc.stop(endAt + 0.02);
            this.oscillators.add(osc);
        } catch {
            // ignore scheduling errors
        }
    }

    stop() {
        this.clearTimers();
        this.isPlaying = false;
        this.onEnded = null;
        this.notes = [];
        this.scheduledIndex = 0;

        for (const osc of this.oscillators) {
            try {
                osc.stop();
            } catch {
                // ignore
            }
        }
        this.oscillators.clear();
    }
}
