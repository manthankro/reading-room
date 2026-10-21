import { useEffect, useRef, useState } from "react";
import { Pause, Play, Square, Volume2, VolumeX } from "lucide-react";
import { ambientTracks } from "@/lib/ambient-tracks";

const SETTINGS_KEY = "reading-room-ambient-settings";
type SavedSettings = { trackId: string; volume: number };

function readSettings(): SavedSettings {
  try {
    const value = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? "null") as Partial<SavedSettings> | null;
    const trackId = ambientTracks.some((track) => track.id === value?.trackId) ? value!.trackId! : "rain";
    const volume = typeof value?.volume === "number" ? Math.max(0, Math.min(1, value.volume)) : 0.25;
    return { trackId, volume };
  } catch {
    return { trackId: "rain", volume: 0.25 };
  }
}

export function AmbientPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [trackId, setTrackId] = useState("rain");
  const [volume, setVolume] = useState(0.25);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selected = ambientTracks.find((track) => track.id === trackId) ?? ambientTracks[0]!;

  useEffect(() => {
    const saved = readSettings();
    setTrackId(saved.trackId);
    setVolume(saved.volume);
    if (audioRef.current) audioRef.current.volume = saved.volume;
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ trackId, volume } satisfies SavedSettings));
    } catch {
      // Audio continues to work when browser storage is unavailable.
    }
  }, [ready, trackId, volume]);

  useEffect(() => {
    const player = audioRef.current;
    return () => {
      if (!player) return;
      player.pause();
      player.removeAttribute("src");
      player.load();
    };
  }, []);

  async function playTrack(nextTrackId = trackId) {
    const player = audioRef.current;
    const track = ambientTracks.find((item) => item.id === nextTrackId);
    if (!player || !track) return;
    setError("");
    player.volume = volume;
    if (player.dataset.track !== track.id) {
      player.src = track.src;
      player.dataset.track = track.id;
      player.loop = true;
      player.load();
    }
    try {
      await player.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
      setError("This sound could not play on this device. Choose another sound or try again.");
    }
  }

  function pause() {
    audioRef.current?.pause();
    setPlaying(false);
  }

  function stop() {
    const player = audioRef.current;
    if (player) {
      player.pause();
      player.currentTime = 0;
    }
    setPlaying(false);
  }

  function changeTrack(nextTrackId: string) {
    const wasPlaying = !audioRef.current?.paused;
    setTrackId(nextTrackId);
    setError("");
    if (wasPlaying) void playTrack(nextTrackId);
  }

  return (
    <section className="ambient-panel" aria-label="Ambient sounds">
      <details>
        <summary className="ambient-summary">
          <span className="ambient-summary-icon" aria-hidden="true">♫</span>
          <span>Ambient sounds</span>
          <span className="ambient-current">{playing ? `Playing · ${selected.label}` : "Optional background sound"}</span>
        </summary>
        <div className="ambient-controls">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <label className="block">
              <span className="kicker">Choose a sound</span>
              <select className="select-field mt-2" value={trackId} onChange={(event) => changeTrack(event.target.value)}>
                {ambientTracks.map((track) => <option key={track.id} value={track.id}>{track.label}</option>)}
              </select>
              <span className="sub mt-1 block text-xs">{selected.mood}</span>
            </label>
            <div className="flex gap-2">
              {playing ? (
                <button type="button" className="btn btn-quiet" onClick={pause} aria-label="Pause ambient sound">
                  <Pause className="size-4" aria-hidden /> Pause
                </button>
              ) : (
                <button type="button" className="btn btn-solid" onClick={() => void playTrack()} aria-label={`Play ${selected.label}`}>
                  <Play className="size-4" aria-hidden /> Play
                </button>
              )}
              <button type="button" className="btn btn-quiet" onClick={stop} aria-label="Stop ambient sound">
                <Square className="size-4" aria-hidden /> Stop
              </button>
            </div>
          </div>
          <label className="ambient-volume mt-4 flex items-center gap-3">
            {volume === 0 ? <VolumeX className="size-4" aria-hidden /> : <Volume2 className="size-4" aria-hidden />}
            <span className="text-sm">Volume</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              aria-label="Ambient sound volume"
              onChange={(event) => {
                const nextVolume = Number(event.target.value);
                setVolume(nextVolume);
                if (audioRef.current) audioRef.current.volume = nextVolume;
              }}
              className="min-w-0 flex-1 accent-[var(--color-accent)]"
            />
            <output className="w-9 text-right text-xs tabular-nums">{Math.round(volume * 100)}%</output>
          </label>
          <p className="ambient-attribution mt-3 text-xs sub">
            Recording: <a href={selected.source} target="_blank" rel="noreferrer">{selected.author}</a> · {selected.license}
          </p>
          {error ? <p role="alert" className="mt-3 text-sm text-red-800">{error}</p> : null}
          <p className="sr-only" aria-live="polite">{playing ? `${selected.label} is playing` : "Ambient sound is stopped"}</p>
        </div>
      </details>
      <audio ref={audioRef} preload="none" onEnded={() => setPlaying(false)} onError={() => {
        if (audioRef.current?.currentSrc) {
          setPlaying(false);
          setError("This sound could not be loaded. Choose another sound or try again.");
        }
      }} />
    </section>
  );
}
