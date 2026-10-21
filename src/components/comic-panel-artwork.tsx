import type { Work } from "@/lib/works";

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result = Math.imul(result ^ value.charCodeAt(index), 16777619);
  }
  return result >>> 0;
}

/** Original, locally rendered panel art. It needs no stock-image API or remote assets. */
export function ComicPanelArtwork({
  work,
  caption,
  index,
}: {
  work: Work;
  caption: string;
  index: number;
}) {
  const seed = hash(`${work.slug}-${index}`);
  const setting = `${work.title} ${caption}`.toLowerCase();
  const night = /night|moon|ghost|dark|star|space|dream/.test(setting);
  const transit = /train|metro|bus|station|platform|tram|local/.test(setting);
  const nature = /garden|flower|tree|forest|kite|rain|river|sea|field|mountain/.test(setting);
  const city = /city|mumbai|harbor|street|roof|rooftop|building|balcony|blackout/.test(setting);
  const sport = /match|team|run|race|cricket|football|kabaddi|game|court/.test(setting);
  const colors = night
    ? ["#18223d", "#556b9c", "#f1cf84", "#ef866e"]
    : nature
      ? ["#b7d8cd", "#4f927e", "#f1c878", "#e8835e"]
      : transit
        ? ["#8bc1ca", "#315a72", "#f2c771", "#e2765f"]
        : sport
          ? ["#95c6d5", "#3c8d72", "#f5d27b", "#e96e56"]
          : ["#f0c9a0", "#71568f", "#f2d16b", "#e97868"];
  const bgId = `comic-bg-${work.slug}-${index}`.replace(/[^a-zA-Z0-9_-]/g, "-");
  const left = 130 + (seed % 110);
  const right = 550 - (seed % 90);
  const person = (x: number, color: string, flip = false) => (
    <g transform={`translate(${x} 0) ${flip ? "scale(-1 1) translate(-100 0)" : ""}`}>
      <path
        d="M39 216 Q12 252 22 302 L83 302 Q94 253 66 216Z"
        fill={color}
        stroke="#27243a"
        strokeWidth="5"
      />
      <path
        d="M39 296 L31 349 M68 296 L78 349"
        stroke="#27243a"
        strokeWidth="13"
        strokeLinecap="round"
      />
      <circle cx="53" cy="185" r="32" fill="#efbd92" stroke="#27243a" strokeWidth="5" />
      <path
        d="M22 184 Q20 142 54 146 Q88 143 85 185 L71 168 L58 176 L43 164 L29 190Z"
        fill={color}
        stroke="#27243a"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <ellipse cx="43" cy="188" rx="4" ry="7" fill="#29263a" />
      <ellipse cx="63" cy="188" rx="4" ry="7" fill="#29263a" />
      <path
        d="M47 204 Q54 209 61 203"
        fill="none"
        stroke="#a75053"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M29 231 L5 260 M75 230 L100 252"
        stroke="#27243a"
        strokeWidth="11"
        strokeLinecap="round"
      />
    </g>
  );

  return (
    <svg
      viewBox="0 0 720 380"
      role="img"
      aria-label={`Original comic illustration, panel ${index + 1}: ${caption}`}
      xmlns="http://www.w3.org/2000/svg"
      className="comic-panel-art"
    >
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={colors[0]} />
          <stop offset="1" stopColor={colors[1]} />
        </linearGradient>
      </defs>
      <rect width="720" height="380" fill={`url(#${bgId})`} />
      {night ? (
        <>
          <circle cx="570" cy="82" r="49" fill={colors[2]} />
          <circle cx="588" cy="67" r="48" fill={colors[1]} />
          {Array.from({ length: 16 }, (_, i) => (
            <path
              key={i}
              d={`M${30 + ((seed + i * 67) % 640)} ${28 + ((i * 41) % 118)} l4 -10 4 10 10 4 -10 4 -4 10 -4 -10 -10 -4Z`}
              fill="#fff4d9"
              opacity=".85"
            />
          ))}
        </>
      ) : transit ? (
        <>
          <path d="M0 225H720V335H0Z" fill="#263e54" opacity=".6" />
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <rect
                x={30 + i * 138}
                y={98 + (i % 2) * 20}
                width="104"
                height="120"
                rx="5"
                fill="#304d62"
              />
              <rect
                x={42 + i * 138}
                y={111 + (i % 2) * 20}
                width="78"
                height="66"
                fill="#f2cf88"
                opacity=".78"
              />
            </g>
          ))}
          <path d="M0 274H720" stroke="#f2cf88" strokeWidth="5" opacity=".8" />
        </>
      ) : nature ? (
        <>
          <circle cx="574" cy="78" r="45" fill={colors[2]} />
          <path d="M0 280 Q150 190 315 275 T720 258 V380H0Z" fill="#3c765e" opacity=".78" />
          <path d="M0 316 Q190 260 360 318 T720 300 V380H0Z" fill="#294d45" opacity=".6" />
          {[70, 630].map((x) => (
            <g key={x}>
              <path d={`M${x} 270v-105`} stroke="#654839" strokeWidth="18" />
              <circle cx={x} cy="155" r="58" fill="#3d8a68" />
              <circle cx={x - 20} cy="143" r="35" fill="#62a77a" />
            </g>
          ))}
        </>
      ) : city ? (
        <>
          <circle cx="590" cy="70" r="34" fill={colors[2]} opacity=".9" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g key={i}>
              <path
                d={`M${i * 128 - 10} ${190 + (i % 3) * 24}h112v150H${i * 128 - 10}Z`}
                fill={i % 2 ? "#3b4663" : "#34435b"}
                stroke="#26334c"
                strokeWidth="5"
              />
              {[0, 1, 2, 3].map((j) => (
                <rect
                  key={j}
                  x={i * 128 + 8 + (j % 2) * 43}
                  y={209 + (i % 3) * 24 + Math.floor(j / 2) * 42}
                  width="20"
                  height="24"
                  rx="2"
                  fill={j % 3 === 0 ? colors[2] : "#a4c8d0"}
                  opacity=".85"
                />
              ))}
            </g>
          ))}
          <path d="M0 330 Q170 302 345 331 T720 320V380H0Z" fill="#26384c" />
        </>
      ) : (
        <>
          <path
            d="M0 255 L95 173 170 236 290 120 390 236 501 161 620 246 720 195V380H0Z"
            fill="#6a5b83"
            opacity=".35"
          />
          <circle cx="586" cy="76" r="40" fill={colors[2]} />
          <path d="M0 305 Q160 277 325 306 T720 295 V380H0Z" fill="#34495a" opacity=".65" />
        </>
      )}
      {transit ? (
        <g>
          <rect
            x="18"
            y="226"
            width="684"
            height="96"
            rx="26"
            fill="#e9c46e"
            stroke="#26344c"
            strokeWidth="8"
          />
          <path d="M35 254H685" stroke="#425e78" strokeWidth="5" />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={i}
              x={62 + i * 125}
              y="240"
              width="88"
              height="50"
              rx="7"
              fill="#a7d7d5"
              stroke="#26344c"
              strokeWidth="5"
            />
          ))}
          <circle cx="110" cy="324" r="14" fill="#252c3b" />
          <circle cx="606" cy="324" r="14" fill="#252c3b" />
        </g>
      ) : null}
      {/lantern|candle|signal/.test(setting) ? (
        <g transform={`translate(${330 + (seed % 50)} 145)`}>
          <circle r="54" fill={colors[2]} opacity=".2" />
          <path
            d="M-28 -22L0 -43 28 -22 22 25 0 39 -22 25Z"
            fill="#f0bd68"
            stroke="#543d52"
            strokeWidth="5"
          />
          <path d="M-20 -9H20M-14 10H14M0 -42V-62" stroke="#543d52" strokeWidth="4" />
          <path
            d="M-49 -27L-36 -18M47 -32L34 -20M-42 27L-32 18M45 25L34 18"
            stroke="#fff2bd"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </g>
      ) : null}
      {/drone|ship|spaceship|orbit/.test(setting) ? (
        <g transform={`translate(${350 + (seed % 34)} 100)`}>
          <path
            d="M-62 12Q-26 -24 36 -12L61 8 32 22 -34 20Z"
            fill="#e3d7bb"
            stroke="#27334a"
            strokeWidth="5"
          />
          <circle cx="4" cy="3" r="9" fill="#62c1d1" stroke="#27334a" strokeWidth="4" />
          <path
            d="M-38 24L-62 37M40 21L61 34"
            stroke="#f1a35e"
            strokeWidth="7"
            strokeLinecap="round"
          />
        </g>
      ) : null}
      {/seed|flower|leaf|root|tree|banyan/.test(setting) ? (
        <g transform={`translate(${344 + (seed % 38)} 256)`}>
          <path d="M0 49Q-4 4 1 -20" fill="none" stroke="#624e3a" strokeWidth="8" />
          <path
            d="M0 3Q-47 -5 -40 -37Q-5 -35 0 3M2 -8Q22 -51 48 -38Q40 -8 2 -8M0 -22Q-15 -58 3 -75Q24 -51 0 -22Z"
            fill="#61a87d"
            stroke="#275c4c"
            strokeWidth="4"
          />
        </g>
      ) : null}
      {person(left, colors[3])}
      {person(right, colors[2], true)}
      {index % 3 === 1 ? (
        <path
          d={`M${left + 45} 145 Q${left + 72} 105 ${left + 95} 143`}
          fill="none"
          stroke="#27243a"
          strokeWidth="6"
          strokeLinecap="round"
        />
      ) : null}
      <path d="M0 367H720" stroke="#fff4df" strokeOpacity=".75" strokeWidth="4" />
      <path
        d={`M${24 + (seed % 30)} 28h76`}
        stroke="#fff4df"
        strokeWidth="5"
        strokeLinecap="round"
        opacity=".65"
      />
    </svg>
  );
}
