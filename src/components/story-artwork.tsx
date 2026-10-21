import type { Work } from "@/lib/works";

const palettes = [
  ["#182b2a", "#d8b477", "#b85c43", "#f1e5c9"],
  ["#31233d", "#d9b8a2", "#9c5a68", "#f3e8d5"],
  ["#24364a", "#e0c58c", "#b36c47", "#f4ead7"],
  ["#493125", "#d7aa67", "#8d473d", "#f0dfc2"],
  ["#263c31", "#c9b47b", "#77927b", "#eee4cf"],
  ["#3a2930", "#d8a58d", "#a66b4d", "#f1e2d0"],
] as const;

function hashText(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** A locally rendered, story-specific editorial cover. No remote image service or generic stock art. */
export function StoryArtwork({ work, className = "" }: { work: Work; className?: string }) {
  const seed = hashText(work.slug);
  const palette = palettes[seed % palettes.length];
  const title = work.title.toLowerCase();
  const genres = (work.genres ?? []).join(" ").toLowerCase();
  const mystery = /mystery|thriller|horror|gothic|ghost|haunt|dark|secret|shadow/.test(
    title + " " + genres,
  );
  const nature = /garden|flower|forest|river|sea|ocean|bird|tree|rain|moon|star/.test(title);
  const romance = /love|heart|magi|marriage|letter|belong|romance/.test(title + " " + genres);
  const myth = /myth|persephone|orpheus|prometheus|odin|isis|rama|osiris|gods|goddess/.test(
    title + " " + genres,
  );
  const cx = 110 + (seed % 55);
  const cy = 105 + ((seed >>> 7) % 60);
  const motif = mystery ? "mystery" : nature ? "nature" : romance ? "romance" : myth ? "myth" : "quiet";
  const label = `Illustrated cover artwork for ${work.title}`;

  if (work.coverImage) {
    return (
      <img
        className={`story-artwork ${className}`}
        src={work.coverImage}
        alt={`Cover artwork for ${work.title}`}
        loading="lazy"
        decoding="async"
      />
    );
  }

  return (
    <svg
      className={`story-artwork ${className}`}
      viewBox="0 0 320 400"
      role="img"
      aria-label={label}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`paper-${work.slug}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={palette[0]} />
          <stop offset="100%" stopColor={palette[2]} />
        </linearGradient>
        <pattern id={`grain-${work.slug}`} width="13" height="13" patternUnits="userSpaceOnUse">
          <path d="M1 4h2M8 10h1" stroke={palette[3]} strokeOpacity=".12" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="320" height="400" fill={`url(#paper-${work.slug})`} />
      <rect width="320" height="400" fill={`url(#grain-${work.slug})`} />
      <rect x="17" y="17" width="286" height="366" rx="2" fill="none" stroke={palette[1]} strokeOpacity=".7" />
      <circle cx={cx} cy={cy} r={48 + (seed % 27)} fill={palette[1]} fillOpacity=".16" />
      {motif === "mystery" ? (
        <>
          <path d={`M40 305 L40 185 L85 135 L130 185 L130 305 Z`} fill={palette[0]} stroke={palette[1]} strokeWidth="2" />
          <path d="M62 305V220Q85 185 108 220V305" fill={palette[2]} />
          <circle cx={cx + 45} cy={cy - 18} r="18" fill={palette[3]} fillOpacity=".9" />
          <path d="M25 330 Q120 290 295 330" fill="none" stroke={palette[1]} strokeWidth="2" />
        </>
      ) : motif === "nature" ? (
        <>
          <path d={`M${cx} 315 Q${cx - 40} 230 ${cx - 10} 160 Q${cx + 20} 225 ${cx} 315`} fill={palette[2]} />
          <path d={`M${cx} 300 Q${cx + 12} 220 ${cx + 65} 185 Q${cx + 70} 255 ${cx} 300`} fill={palette[1]} />
          <path d={`M${cx} 310 Q${cx - 68} 265 ${cx - 75} 205 Q${cx - 12} 222 ${cx} 310`} fill={palette[3]} fillOpacity=".78" />
          <path d="M35 335 Q160 300 285 335" fill="none" stroke={palette[1]} strokeWidth="2" />
        </>
      ) : motif === "romance" ? (
        <>
          <path d={`M${cx} 292 C${cx - 80} 230 ${cx - 55} 165 ${cx} 205 C${cx + 55} 165 ${cx + 80} 230 ${cx} 292Z`} fill={palette[2]} stroke={palette[1]} strokeWidth="2" />
          <circle cx={cx} cy={cy} r="72" fill="none" stroke={palette[1]} strokeOpacity=".65" />
          <path d="M65 325 Q160 290 255 325" fill="none" stroke={palette[1]} strokeWidth="2" />
        </>
      ) : motif === "myth" ? (
        <>
          <circle cx={cx} cy={cy} r="62" fill="none" stroke={palette[1]} strokeWidth="3" />
          <circle cx={cx} cy={cy} r="42" fill="none" stroke={palette[1]} strokeOpacity=".75" strokeWidth="1.5" />
          <path d={`M${cx} 130 L${cx + 20} 205 L${cx} 280 L${cx - 20} 205 Z`} fill={palette[2]} stroke={palette[1]} strokeWidth="2" />
          <path d="M45 320 L160 285 L275 320" fill="none" stroke={palette[1]} strokeWidth="2" />
        </>
      ) : (
        <>
          <path d={`M${cx - 65} 300 Q${cx - 40} 190 ${cx} 165 Q${cx + 45} 210 ${cx + 65} 300Z`} fill={palette[2]} fillOpacity=".9" />
          <path d={`M${cx - 38} 300 Q${cx - 18} 230 ${cx} 218 Q${cx + 22} 245 ${cx + 38} 300Z`} fill={palette[1]} />
          <circle cx={cx} cy={cy - 8} r="15" fill={palette[3]} />
          <path d="M42 330 Q160 305 278 330" fill="none" stroke={palette[1]} strokeWidth="2" />
        </>
      )}
      {Array.from({ length: 5 }, (_, index) => (
        <circle
          key={index}
          cx={32 + ((seed + index * 47) % 256)}
          cy={42 + ((seed >>> (index + 1)) % 110)}
          r={1.5 + (index % 2)}
          fill={palette[3]}
          fillOpacity=".72"
        />
      ))}
      <path d="M36 345H284" stroke={palette[1]} strokeOpacity=".65" />
      <text x="160" y="363" textAnchor="middle" fill={palette[3]} fontSize="8" letterSpacing="2.4">
        READING ROOM · {motif.toUpperCase()}
      </text>
    </svg>
  );
}
