import { useState } from "react";
import { Play, Pause, Mic } from "lucide-react";

export interface AudioEpisode {
  speaker: string;
  exam: string;
  role: string;
  /** Omit until a real recording is available - the player shows an honest "coming soon" state instead of a broken/fake audio src. */
  src?: string;
}

function Episode({ episode }: { episode: AudioEpisode }) {
  const [playing, setPlaying] = useState(false);
  const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null);

  const toggle = () => {
    if (!episode.src) return;
    if (!audioEl) return;
    if (playing) {
      audioEl.pause();
    } else {
      audioEl.play();
    }
    setPlaying(!playing);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-5 border-[1px] border-border bg-card">
      <div className="flex items-center gap-4 min-w-0">
        <button
          type="button"
          onClick={toggle}
          disabled={!episode.src}
          aria-label={episode.src ? (playing ? `Pause ${episode.speaker}` : `Play ${episode.speaker}`) : `${episode.speaker} recording coming soon`}
          className="w-11 h-11 rounded-full border-[1px] border-border flex items-center justify-center flex-shrink-0 text-primary hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {playing ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
        </button>
        <div className="flex-grow min-w-0">
          <p className="font-semibold text-sm">{episode.speaker}</p>
          <p className="font-mono text-xs uppercase tracking-widest text-secondary">{episode.role}</p>
        </div>
      </div>
      <div className="flex items-center justify-between sm:flex-col sm:items-end sm:text-right sm:flex-shrink-0 pl-[60px] sm:pl-0">
        <span className="font-mono text-xs uppercase tracking-widest text-accent sm:mb-1">{episode.exam}</span>
        {!episode.src && (
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Recording coming soon
          </span>
        )}
      </div>
      {episode.src && (
        <audio ref={setAudioEl} src={episode.src} onEnded={() => setPlaying(false)} className="hidden" />
      )}
    </div>
  );
}

/** "Listen from Experienced Individuals" - honest empty state until real recordings exist. */
export function AudioSeries({ episodes }: { episodes: AudioEpisode[] }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <Mic size={16} className="text-accent" strokeWidth={1.5} aria-hidden="true" />
        <h4 className="font-mono text-xs uppercase tracking-widest text-secondary">
          Listen from Experienced Individuals
        </h4>
      </div>
      <div className="space-y-3">
        {episodes.map((ep, i) => (
          <Episode key={i} episode={ep} />
        ))}
      </div>
    </div>
  );
}
