import type { Work } from "@/lib/works";

const palettes = [
  ["#182b2a", "#d8b477", "#b85c43", "#f1e5c9"],
  ["#31233d", "#d9b8a2", "#9c5a68", "#f3e8d5"],
  ["#24364a", "#e0c58c", "#b36c47", "#f4ead7"],
  ["#493125", "#d7aa67", "#8d473d", "#f0dfc2"],
  ["#263c31", "#c9b47b", "#77927b", "#eee4cf"],
  ["#3a2930", "#d8a58d", "#a66b4d", "#f1e2d0"],
] as const;

const artDirections = {
  mystery: [
    ["#202c35", "#d3b276", "#81545c", "#eee5d3"],
    ["#29343a", "#c5a77b", "#6e5651", "#e8e0d0"],
  ],
  horror: [
    ["#1e2425", "#b8a477", "#67514d", "#ddd5c4"],
    ["#2c2928", "#c0a06f", "#744f4a", "#e5dac8"],
  ],
  nature: [
    ["#263b31", "#c4b47c", "#819378", "#eee5d1"],
    ["#304238", "#d0bd83", "#84958a", "#eee7d9"],
  ],
  romance: [
    ["#412c37", "#d7ad93", "#a96670", "#f2e5d9"],
    ["#49313a", "#dfb698", "#a97870", "#f1e4d7"],
  ],
  myth: [
    ["#352d2a", "#dfbf78", "#a66643", "#f1e3c7"],
    ["#40342d", "#d5b878", "#9a6547", "#eee0c5"],
  ],
  adventure: [
    ["#263a40", "#d0b37c", "#8b6950", "#eee2ca"],
    ["#2e4140", "#cdb782", "#926e55", "#f0e5d0"],
  ],
  anime: [
    ["#172947", "#e9b75f", "#d95e6a", "#f9e3b2"],
    ["#35274f", "#f2c66d", "#6aa9b7", "#f4e1c8"],
  ],
  science: [
    ["#242c3a", "#c0ab79", "#5f7c7d", "#e8e2d2"],
    ["#2c3340", "#c5ae7c", "#688381", "#e8e1d1"],
  ],
  sports: [
    ["#193b3d", "#e0bd78", "#c66f43", "#f2e7d1"],
    ["#263951", "#d8ba78", "#b75f4b", "#f3ead8"],
  ],
  poetry: [
    ["#3a3932", "#d5c69a", "#87917d", "#f0e9d8"],
    ["#464237", "#d1c19a", "#899486", "#f3eddf"],
  ],
  quiet: [
    ["#343a36", "#cdbb91", "#8b7965", "#eee5d3"],
    ["#3d413b", "#d5c39a", "#8d8170", "#f0e7d8"],
  ],
} as const;

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
  const fallbackPalette = palettes[seed % palettes.length];
  const title = work.title.toLowerCase();
  const genres = (work.genres ?? []).join(" ").toLowerCase();
  const mystery = /mystery|thriller|horror|gothic|ghost|haunt|dark|secret|shadow/.test(
    title + " " + genres,
  );
  const horror = /horror|haunt|ghost|vampire|monster|dark|grave|dead|macabre/.test(
    title + " " + genres,
  );
  const nature = /garden|flower|forest|river|sea|ocean|bird|tree|rain|moon|star|nature/.test(
    title + " " + genres,
  );
  const romance = /love|heart|magi|marriage|letter|belong|romance/.test(title + " " + genres);
  const myth = /myth|persephone|orpheus|prometheus|odin|isis|rama|osiris|gods|goddess/.test(
    title + " " + genres,
  );
  const science = /science fiction|sci.fi|space|robot|machine|future|planet|cosmic/.test(
    title + " " + genres,
  );
  const sports = /sports|cricket|football|kabaddi|race|marathon|rowing|run|match/.test(
    title + " " + genres,
  );
  const anime = /anime|manga|manhwa|isekai/.test(title + " " + genres);
  const adventure = /adventure|journey|voyage|travel|quest|expedition|island/.test(
    title + " " + genres,
  );
  const poetry = work.shelf === "poem" || /poetry|poem|verse/.test(title + " " + genres);
  const cx = 110 + (seed % 55);
  const cy = 105 + ((seed >>> 7) % 60);
  const marathi = work.language === "Marathi";
  const hindiPeepal = work.language === "Hindi" && /पीपल/.test(work.title);
  const hindiTea = work.language === "Hindi" && /चाय|केतली/.test(work.title);
  const direction = marathi
    ? "regional"
    : hindiPeepal
      ? "nature"
      : hindiTea
        ? "quiet"
        : horror
          ? "horror"
          : mystery
            ? "mystery"
            : science
              ? "science"
              : sports
                ? "sports"
                : anime
                  ? "anime"
                  : romance
                    ? "romance"
                    : myth
                      ? "myth"
                      : adventure
                        ? "adventure"
                        : nature
                          ? "nature"
                          : poetry
                            ? "poetry"
                            : "quiet";
  const directionPalettes = artDirections[direction as keyof typeof artDirections];
  const palette = directionPalettes
    ? directionPalettes[(seed >>> 3) % directionPalettes.length]
    : fallbackPalette;
  const motif = marathi
    ? "marathi-wada"
    : hindiPeepal
      ? "hindi-peepal"
      : hindiTea
        ? "hindi-tea"
        : anime
          ? "anime"
          : direction;
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
      <rect
        x="17"
        y="17"
        width="286"
        height="366"
        rx="2"
        fill="none"
        stroke={palette[1]}
        strokeOpacity=".7"
      />
      <circle cx={cx} cy={cy} r={48 + (seed % 27)} fill={palette[1]} fillOpacity=".16" />
      {motif === "anime" ? (
        <>
          <path
            d="M34 310L78 190L118 252L170 133L226 239L263 178L294 310Z"
            fill={palette[2]}
            fillOpacity=".72"
            stroke={palette[1]}
            strokeWidth="2"
          />
          <circle cx="234" cy="102" r="34" fill={palette[1]} fillOpacity=".9" />
          <path
            d={`M${cx - 50} 322Q${cx - 72} 250 ${cx - 31} 215L${cx - 7} 196L${cx + 20} 214Q${cx + 58} 258 ${cx + 43} 322Z`}
            fill={palette[0]}
            stroke={palette[1]}
            strokeWidth="3"
          />
          <circle cx={cx} cy="178" r="31" fill="#efbd92" stroke={palette[1]} strokeWidth="3" />
          <path
            d={`M${cx - 31} 175Q${cx - 32} 132 ${cx + 5} 137L${cx + 36} 157L${cx + 23} 166L${cx + 4} 154L${cx - 9} 170L${cx - 27} 163Z`}
            fill={palette[1]}
            stroke={palette[0]}
            strokeWidth="3"
          />
          <ellipse cx={cx - 10} cy="180" rx="4" ry="7" fill="#26253a" />
          <ellipse cx={cx + 11} cy="180" rx="4" ry="7" fill="#26253a" />
          <path d="M35 325Q150 300 284 325" fill="none" stroke={palette[1]} strokeWidth="2" />
        </>
      ) : motif === "marathi-wada" ? (
        <>
          <path
            d="M42 318V180L160 118L278 180V318Z"
            fill={palette[0]}
            stroke={palette[1]}
            strokeWidth="2"
          />
          <path
            d="M95 318V244Q95 204 160 204Q225 204 225 244V318Z"
            fill={palette[2]}
            stroke={palette[1]}
            strokeWidth="2"
          />
          <path d="M64 184H256M80 168H240" stroke={palette[1]} strokeWidth="3" />
          <path
            d="M55 90L45 112M105 66L95 92M215 76L205 102M265 105L255 128"
            stroke={palette[3]}
            strokeOpacity=".65"
            strokeWidth="2"
          />
          <path
            d="M28 332Q110 310 160 330T292 330"
            fill="none"
            stroke={palette[1]}
            strokeWidth="2"
          />
        </>
      ) : motif === "hindi-peepal" ? (
        <>
          <path
            d="M158 320Q174 260 158 205Q146 165 112 136M163 222Q192 173 229 147M157 252Q116 219 78 214"
            fill="none"
            stroke={palette[1]}
            strokeWidth="11"
            strokeLinecap="round"
          />
          <circle cx="107" cy="133" r="34" fill={palette[2]} />
          <circle cx="153" cy="120" r="42" fill={palette[1]} fillOpacity=".82" />
          <circle cx="207" cy="142" r="36" fill={palette[2]} />
          <circle cx="86" cy="203" r="29" fill={palette[1]} fillOpacity=".8" />
          <path d="M36 326Q160 298 284 326" fill="none" stroke={palette[1]} strokeWidth="2" />
          <path
            d="M122 322L112 342M160 320L160 346M198 322L208 342"
            stroke={palette[3]}
            strokeWidth="2"
          />
        </>
      ) : motif === "hindi-tea" ? (
        <>
          <path
            d="M42 297H278M58 297L78 323H250L270 297"
            fill={palette[0]}
            stroke={palette[1]}
            strokeWidth="2"
          />
          <path d="M83 272H236L225 296H94Z" fill={palette[2]} stroke={palette[1]} strokeWidth="2" />
          <path
            d="M112 251Q112 225 139 225H183Q210 225 210 251L201 272H121Z"
            fill={palette[1]}
            stroke={palette[3]}
            strokeWidth="2"
          />
          <path
            d="M210 237Q248 232 243 256Q240 270 207 263"
            fill="none"
            stroke={palette[1]}
            strokeWidth="7"
          />
          <path
            d="M138 210Q128 194 140 181M164 211Q153 190 166 172M188 211Q178 194 190 183"
            fill="none"
            stroke={palette[3]}
            strokeOpacity=".8"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M38 340Q94 326 150 340T282 340"
            fill="none"
            stroke={palette[1]}
            strokeWidth="2"
          />
        </>
      ) : motif === "mystery" ? (
        <>
          <path
            d={`M40 305 L40 185 L85 135 L130 185 L130 305 Z`}
            fill={palette[0]}
            stroke={palette[1]}
            strokeWidth="2"
          />
          <path d="M62 305V220Q85 185 108 220V305" fill={palette[2]} />
          <circle cx={cx + 45} cy={cy - 18} r="18" fill={palette[3]} fillOpacity=".9" />
          <path d="M25 330 Q120 290 295 330" fill="none" stroke={palette[1]} strokeWidth="2" />
        </>
      ) : motif === "horror" ? (
        <>
          <circle cx="224" cy="137" r="32" fill={palette[3]} fillOpacity=".88" />
          <path
            d="M20 306L72 244L104 273L145 204L199 276L236 230L300 309V337H20Z"
            fill={palette[0]}
            stroke={palette[1]}
            strokeOpacity=".82"
            strokeWidth="2"
          />
          <path
            d="M110 305V263L136 245L162 263V305M126 305V276H145V305"
            fill={palette[2]}
            stroke={palette[1]}
            strokeWidth="1.5"
          />
          <path d="M34 333Q160 316 286 333" fill="none" stroke={palette[1]} strokeWidth="2" />
        </>
      ) : motif === "nature" ? (
        <>
          <path
            d={`M${cx} 315 Q${cx - 40} 230 ${cx - 10} 160 Q${cx + 20} 225 ${cx} 315`}
            fill={palette[2]}
          />
          <path
            d={`M${cx} 300 Q${cx + 12} 220 ${cx + 65} 185 Q${cx + 70} 255 ${cx} 300`}
            fill={palette[1]}
          />
          <path
            d={`M${cx} 310 Q${cx - 68} 265 ${cx - 75} 205 Q${cx - 12} 222 ${cx} 310`}
            fill={palette[3]}
            fillOpacity=".78"
          />
          <path d="M35 335 Q160 300 285 335" fill="none" stroke={palette[1]} strokeWidth="2" />
        </>
      ) : motif === "romance" ? (
        <>
          <path
            d={`M${cx} 292 C${cx - 80} 230 ${cx - 55} 165 ${cx} 205 C${cx + 55} 165 ${cx + 80} 230 ${cx} 292Z`}
            fill={palette[2]}
            stroke={palette[1]}
            strokeWidth="2"
          />
          <circle cx={cx} cy={cy} r="72" fill="none" stroke={palette[1]} strokeOpacity=".65" />
          <path d="M65 325 Q160 290 255 325" fill="none" stroke={palette[1]} strokeWidth="2" />
        </>
      ) : motif === "myth" ? (
        <>
          <circle cx={cx} cy={cy} r="62" fill="none" stroke={palette[1]} strokeWidth="3" />
          <circle
            cx={cx}
            cy={cy}
            r="42"
            fill="none"
            stroke={palette[1]}
            strokeOpacity=".75"
            strokeWidth="1.5"
          />
          <path
            d={`M${cx} 130 L${cx + 20} 205 L${cx} 280 L${cx - 20} 205 Z`}
            fill={palette[2]}
            stroke={palette[1]}
            strokeWidth="2"
          />
          <path d="M45 320 L160 285 L275 320" fill="none" stroke={palette[1]} strokeWidth="2" />
        </>
      ) : motif === "science" ? (
        <>
          <circle
            cx={cx}
            cy={cy + 6}
            r="44"
            fill={palette[2]}
            fillOpacity=".8"
            stroke={palette[1]}
            strokeWidth="2"
          />
          <ellipse
            cx={cx}
            cy={cy + 6}
            rx="82"
            ry="25"
            fill="none"
            stroke={palette[1]}
            strokeWidth="2"
            transform={`rotate(-22 ${cx} ${cy + 6})`}
          />
          <circle cx={cx + 58} cy={cy - 17} r="5" fill={palette[3]} />
          <path d="M40 310H280M62 322H258" stroke={palette[1]} strokeOpacity=".75" />
        </>
      ) : motif === "adventure" ? (
        <>
          <path
            d="M20 306L92 198L136 251L192 151L300 306Z"
            fill={palette[2]}
            stroke={palette[1]}
            strokeWidth="2"
          />
          <path
            d="M143 238L192 151L228 207L204 198L192 215L180 191Z"
            fill={palette[3]}
            fillOpacity=".86"
          />
          <path
            d="M98 306Q150 278 160 249Q173 278 226 306"
            fill="none"
            stroke={palette[1]}
            strokeWidth="4"
          />
          <path d="M30 326Q155 305 290 326" fill="none" stroke={palette[1]} strokeWidth="2" />
        </>
      ) : motif === "poetry" ? (
        <>
          <path
            d="M74 274Q96 255 119 270L160 295L201 270Q224 255 246 274V188Q220 170 198 184L160 205L122 184Q100 170 74 188Z"
            fill={palette[3]}
            fillOpacity=".16"
            stroke={palette[1]}
            strokeWidth="2"
          />
          <path
            d="M160 205V295M96 204H124M96 218H130M196 204H224M190 218H224"
            stroke={palette[1]}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M55 322Q160 292 265 322" fill="none" stroke={palette[1]} strokeWidth="2" />
        </>
      ) : (
        <>
          <path
            d={`M${cx - 65} 300 Q${cx - 40} 190 ${cx} 165 Q${cx + 45} 210 ${cx + 65} 300Z`}
            fill={palette[2]}
            fillOpacity=".9"
          />
          <path
            d={`M${cx - 38} 300 Q${cx - 18} 230 ${cx} 218 Q${cx + 22} 245 ${cx + 38} 300Z`}
            fill={palette[1]}
          />
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
        PRAMANIX SHELF · {motif.toUpperCase()}
      </text>
    </svg>
  );
}
