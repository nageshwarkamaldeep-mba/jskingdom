export default function CastleIllustration() {
  return (
    <svg
      viewBox="0 0 600 470"
      className="h-auto w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
      role="img"
      aria-label="A glowing fantasy castle at night"
    >
      <defs>
        <linearGradient id="ck-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#141a2b" />
          <stop offset="45%" stopColor="#1d2336" />
          <stop offset="72%" stopColor="#3b2b33" />
          <stop offset="100%" stopColor="#5a3a2c" />
        </linearGradient>
        <linearGradient id="ck-stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a59a86" />
          <stop offset="100%" stopColor="#6a6152" />
        </linearGradient>
        <linearGradient id="ck-stone-dark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a7f6b" />
          <stop offset="100%" stopColor="#514a3e" />
        </linearGradient>
        <linearGradient id="ck-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a4523a" />
          <stop offset="100%" stopColor="#5f2c1f" />
        </linearGradient>
        <linearGradient id="ck-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2f5334" />
          <stop offset="100%" stopColor="#122417" />
        </linearGradient>
        <radialGradient id="ck-moon-glow">
          <stop offset="0%" stopColor="#fff3c4" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#ffe6a0" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ffe6a0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ck-window-glow">
          <stop offset="0%" stopColor="#ffe9a8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffd76a" stopOpacity="0" />
        </radialGradient>
        <clipPath id="ck-scene">
          <rect width="600" height="470" rx="28" />
        </clipPath>
      </defs>

      <g clipPath="url(#ck-scene)">
        <rect width="600" height="470" fill="url(#ck-sky)" />

        <circle cx="474" cy="86" r="90" fill="url(#ck-moon-glow)" />
        <circle cx="474" cy="86" r="30" fill="#f8ecc4" />
        <circle cx="464" cy="78" r="6" fill="#e7d49a" opacity="0.6" />
        <circle cx="484" cy="94" r="4" fill="#e7d49a" opacity="0.5" />

        {[
          [60, 60, 1.6],
          [120, 110, 1.2],
          [180, 50, 1.4],
          [250, 90, 1],
          [330, 44, 1.5],
          [390, 110, 1.1],
          [540, 160, 1.3],
          [80, 180, 1],
          [560, 40, 1.4],
          [430, 60, 1.2],
          [300, 130, 0.9],
          [150, 160, 1.1],
        ].map(([x, y, r], index) => (
          <circle
            key={index}
            cx={x}
            cy={y}
            r={r}
            fill="#f6e6b4"
            opacity={0.5 + (index % 3) * 0.15}
          />
        ))}

        <path
          d="M0 330 L70 260 L130 320 L200 240 L280 330 L350 270 L430 330 L510 250 L600 320 L600 470 L0 470 Z"
          fill="#1b2a2a"
          opacity="0.85"
        />
        <path
          d="M0 360 L90 300 L160 355 L250 290 L340 360 L430 305 L520 360 L600 310 L600 470 L0 470 Z"
          fill="#16241d"
        />

        <path
          d="M0 380 Q150 345 300 378 T600 372 L600 470 L0 470 Z"
          fill="url(#ck-ground)"
        />
        <path
          d="M0 408 Q160 382 300 404 T600 400 L600 470 L0 470 Z"
          fill="#0f1c13"
          opacity="0.7"
        />

        <ellipse cx="300" cy="372" rx="180" ry="26" fill="#000000" opacity="0.3" />

        <g>
          <rect x="196" y="248" width="48" height="118" fill="url(#ck-stone-dark)" />
          <rect x="356" y="248" width="48" height="118" fill="url(#ck-stone-dark)" />
          <rect x="246" y="218" width="108" height="150" fill="url(#ck-stone)" />

          <rect x="246" y="204" width="108" height="18" fill="url(#ck-stone-dark)" />
          {[250, 270, 290, 310, 330].map((x) => (
            <rect key={x} x={x} y="194" width="10" height="14" fill="#7d7361" />
          ))}

          <polygon points="196,248 220,182 244,248" fill="url(#ck-roof)" />
          <polygon points="356,248 380,182 404,248" fill="url(#ck-roof)" />
          <polygon points="246,218 300,128 354,218" fill="url(#ck-roof)" />
          <polygon points="246,218 300,128 300,218" fill="#000000" opacity="0.12" />

          <path
            d="M282 366 L282 318 Q300 296 318 318 L318 366 Z"
            fill="#241a12"
          />
          <path
            d="M288 366 L288 322 Q300 306 312 322 L312 366 Z"
            fill="#0f0b07"
          />
          <path d="M300 312 L300 366" stroke="#5a4a35" strokeWidth="1" opacity="0.6" />

          <rect x="268" y="258" width="14" height="26" rx="7" fill="#ffd76a" opacity="0.85" />
          <rect x="318" y="258" width="14" height="26" rx="7" fill="#ffd76a" opacity="0.85" />
          <rect x="210" y="276" width="9" height="18" rx="4.5" fill="#ffd76a" opacity="0.75" />
          <rect x="381" y="276" width="9" height="18" rx="4.5" fill="#ffd76a" opacity="0.75" />

          <circle cx="275" cy="270" r="26" fill="url(#ck-window-glow)" opacity="0.5" />
          <circle cx="325" cy="270" r="26" fill="url(#ck-window-glow)" opacity="0.5" />

          <rect x="244" y="330" width="112" height="8" fill="#000000" opacity="0.16" />
          <rect x="244" y="352" width="112" height="6" fill="#000000" opacity="0.12" />

          <g style={{ animation: 'float-slow 5s ease-in-out infinite' }}>
            <line x1="220" y1="182" x2="220" y2="140" stroke="#3a2a18" strokeWidth="3" />
            <polygon points="220,140 254,147 220,158" fill="#b6423a" />
          </g>
          <g
            style={{
              animation: 'float-slow 6s ease-in-out infinite',
              animationDelay: '0.6s',
            }}
          >
            <line x1="380" y1="182" x2="380" y2="140" stroke="#3a2a18" strokeWidth="3" />
            <polygon points="380,140 414,147 380,158" fill="#b6423a" />
          </g>
          <g
            style={{
              animation: 'float-slow 4.5s ease-in-out infinite',
              animationDelay: '0.3s',
            }}
          >
            <line x1="300" y1="128" x2="300" y2="76" stroke="#3a2a18" strokeWidth="3" />
            <polygon points="300,76 342,85 300,98" fill="#e3bd5f" />
          </g>
        </g>

        <g opacity="0.9">
          {[
            [110, 400, 1],
            [148, 416, 0.8],
            [470, 402, 1.1],
            [510, 420, 0.9],
            [74, 430, 0.7],
            [540, 440, 0.75],
          ].map(([x, y, s], index) => (
            <g key={index} transform={`translate(${x} ${y}) scale(${s})`}>
              <rect x="-2" y="-16" width="4" height="16" fill="#3a2a18" />
              <polygon points="0,-58 -16,-24 16,-24" fill="#24492b" />
              <polygon points="0,-46 -13,-20 13,-20" fill="#2f5a34" />
              <polygon points="0,-36 -10,-14 10,-14" fill="#3a6b3d" />
            </g>
          ))}
        </g>

        <path
          d="M258 370 Q300 356 342 370"
          stroke="#c9b27a"
          strokeWidth="10"
          fill="none"
          opacity="0.35"
        />
        <path
          d="M258 370 Q300 356 342 370"
          stroke="#e3cf9c"
          strokeWidth="3"
          fill="none"
          opacity="0.4"
        />

        <circle cx="238" cy="352" r="14" fill="#ff9a3c" opacity="0.18" />
        <circle cx="362" cy="352" r="14" fill="#ff9a3c" opacity="0.18" />
        <circle cx="238" cy="352" r="3.5" fill="#ffb457" />
        <circle cx="362" cy="352" r="3.5" fill="#ffb457" />

        {[
          [200, 200, 2],
          [400, 180, 1.6],
          [160, 300, 1.4],
          [440, 300, 1.8],
          [280, 150, 1.2],
          [330, 240, 1.5],
        ].map(([x, y, r], index) => (
          <circle
            key={index}
            cx={x}
            cy={y}
            r={r}
            fill="#ffe9a8"
            opacity="0.7"
            style={{
              animation: `float-slow ${4 + index}s ease-in-out infinite`,
              animationDelay: `${index * 0.4}s`,
            }}
          />
        ))}

        <rect width="600" height="470" fill="url(#ck-sky)" opacity="0.06" />
      </g>
    </svg>
  )
}
