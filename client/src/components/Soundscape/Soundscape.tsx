import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

type TrackId = "none" | "calm" | "white";

type TrackDefinition = {
  id: TrackId;
  label: string;
  src?: string;
};

const TRACKS: TrackDefinition[] = [
  { id: "none", label: "靜音" },
  { id: "calm", label: "輕音樂", src: "/Music/light_music.mp3" },
  { id: "white", label: "白噪音", src: "/Music/White_noise.mp3" }
];

export default function Soundscape() {
  const [selected, setSelected] = useState<TrackId>("none");
  const [volume, setVolume] = useState(0.45);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.crossOrigin = "anonymous";
    audio.preload = "auto";
    audio.loop = true;
    audio.volume = volume;
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
  }, [volume]);

  const applyTrack = useCallback((trackId: TrackId) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (trackId === "none") {
      audio.pause();
      audio.currentTime = 0;
      return;
    }
    const src = TRACKS.find(t => t.id === trackId)?.src;
    if (!src) return;
    if (audio.src !== src) {
      audio.src = src;
      audio.load();
    }
    audio.loop = true;
    audio.play().catch(() => {
      /* playback can be blocked; user can retry */
    });
  }, []);

  useEffect(() => {
    applyTrack(selected);
  }, [selected, applyTrack]);

  const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as TrackId;
    setSelected(value);
    applyTrack(value);
  };

  return (
    <div className="soundscape">
      <div className="soundscape__info">
        <strong>舒心背景聲</strong>
        <span>使用預設輕音樂或白噪音，陪你專注。</span>
      </div>
      <div className="soundscape__controls">
        <select value={selected} onChange={handleSelect}>
          {TRACKS.map(track => (
            <option key={track.id} value={track.id}>{track.label}</option>
          ))}
        </select>
        <label className="soundscape__volume">
          音量
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </label>
      </div>
      <audio ref={audioRef} />
    </div>
  );
}
