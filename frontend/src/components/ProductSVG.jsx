export function LaptopSVG({ size = 160 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lid" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c8c8d4" /><stop offset="40%" stopColor="#a0a0b8" /><stop offset="100%" stopColor="#6a6a80" />
        </linearGradient>
        <linearGradient id="screen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a0e3f" /><stop offset="50%" stopColor="#0d0826" /><stop offset="100%" stopColor="#060418" />
        </linearGradient>
        <linearGradient id="wallpaper" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a2fcc" /><stop offset="100%" stopColor="#1a0e3f" />
        </linearGradient>
        <linearGradient id="base" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b8b8c8" /><stop offset="50%" stopColor="#9898ac" /><stop offset="100%" stopColor="#787890" />
        </linearGradient>
        <linearGradient id="key" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8888a0" /><stop offset="100%" stopColor="#6a6a80" />
        </linearGradient>
        <radialGradient id="glare" cx="30%" cy="20%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25"/><stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="screenGlow" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#7c5cfc" stopOpacity="0.4"/><stop offset="100%" stopColor="#7c5cfc" stopOpacity="0"/>
        </radialGradient>
        <filter id="lapShadow"><feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000" floodOpacity="0.5"/></filter>
        <filter id="screenBloom"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>

      {/* Drop shadow */}
      <ellipse cx="100" cy="185" rx="70" ry="8" fill="#000" opacity="0.3"/>

      {/* Lid body */}
      <rect x="22" y="18" width="156" height="108" rx="8" fill="url(#lid)" filter="url(#lapShadow)"/>
      {/* Lid glare */}
      <rect x="22" y="18" width="156" height="108" rx="8" fill="url(#glare)"/>
      {/* Lid edge line */}
      <rect x="22" y="120" width="156" height="3" rx="0" fill="#7a7a90"/>

      {/* Screen bezel */}
      <rect x="28" y="24" width="144" height="96" rx="4" fill="#111120"/>
      {/* Screen */}
      <rect x="32" y="28" width="136" height="88" rx="2" fill="url(#screen)"/>
      {/* Wallpaper */}
      <rect x="32" y="28" width="136" height="88" rx="2" fill="url(#wallpaper)" opacity="0.6"/>
      {/* Screen glow bloom */}
      <rect x="32" y="28" width="136" height="88" rx="2" fill="url(#screenGlow)"/>
      {/* Screen content */}
      <rect x="42" y="38" width="54" height="7" rx="3" fill="#9b7dff" opacity="0.8"/>
      <rect x="42" y="50" width="116" height="3" rx="1.5" fill="#fff" opacity="0.18"/>
      <rect x="42" y="57" width="96" height="3" rx="1.5" fill="#fff" opacity="0.14"/>
      <rect x="42" y="64" width="108" height="3" rx="1.5" fill="#fff" opacity="0.12"/>
      <rect x="42" y="71" width="78" height="3" rx="1.5" fill="#fff" opacity="0.10"/>
      {/* Taskbar */}
      <rect x="32" y="104" width="136" height="12" rx="0" fill="#0a0818" opacity="0.7"/>
      <circle cx="40" cy="110" r="3" fill="#ff5f57" opacity="0.8"/>
      <circle cx="50" cy="110" r="3" fill="#febc2e" opacity="0.8"/>
      <circle cx="60" cy="110" r="3" fill="#28c840" opacity="0.8"/>
      {/* Dock icons */}
      {[80,92,104,116,128].map((x,i) => (
        <rect key={i} x={x} y="106" width="8" height="8" rx="2" fill="#7c5cfc" opacity={0.3+i*0.06}/>
      ))}
      {/* Screen glare highlight */}
      <path d="M34 30 L80 30 L60 70 L32 60Z" fill="#fff" opacity="0.03"/>
      {/* Camera */}
      <circle cx="100" cy="26" r="2" fill="#222230"/>
      <circle cx="100" cy="26" r="1" fill="#444460"/>

      {/* Base */}
      <path d="M14 126 L186 126 L180 148 L20 148Z" fill="url(#base)"/>
      {/* Hinge */}
      <rect x="22" y="123" width="156" height="5" rx="1" fill="#888898"/>
      {/* Keyboard area */}
      <rect x="20" y="128" width="160" height="18" rx="2" fill="url(#base)"/>
      {/* Keys */}
      {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => (
        <rect key={`k1_${i}`} x={25+i*12} y={130} width={10} height={7} rx={1.5} fill="url(#key)" opacity={0.85}/>
      ))}
      {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
        <rect key={`k2_${i}`} x={29+i*12} y={139} width={10} height={4} rx={1.5} fill="url(#key)" opacity={0.85}/>
      ))}
      {/* Trackpad */}
      <rect x="80" y="140" width="40" height="6" rx="3" fill="#8888a0" opacity="0.6"/>
      {/* Base bottom edge */}
      <path d="M14 148 L186 148 L182 152 L18 152Z" fill="#6a6a80"/>
      {/* Base glare */}
      <path d="M14 126 L90 126 L80 148 L14 148Z" fill="#fff" opacity="0.05"/>
    </svg>
  );
}

export function HeadphonesSVG({ size = 160 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="cup" cx="35%" cy="25%" r="65%">
          <stop offset="0%" stopColor="#d8d8e8"/><stop offset="50%" stopColor="#b0b0c4"/><stop offset="100%" stopColor="#808098"/>
        </radialGradient>
        <radialGradient id="cushion" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#3a3a50"/><stop offset="100%" stopColor="#1a1a2e"/>
        </radialGradient>
        <linearGradient id="band" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c8c8d8"/><stop offset="100%" stopColor="#8888a0"/>
        </linearGradient>
        <linearGradient id="bandPad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3a3a50"/><stop offset="100%" stopColor="#282838"/>
        </linearGradient>
        <filter id="hpShadow"><feDropShadow dx="2" dy="8" stdDeviation="8" floodColor="#000" floodOpacity="0.45"/></filter>
        <filter id="cupGlow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>

      <ellipse cx="100" cy="190" rx="60" ry="6" fill="#000" opacity="0.25"/>

      {/* Headband arc */}
      <path d="M34 105 Q32 38 100 32 Q168 38 166 105" stroke="url(#band)" strokeWidth="14" strokeLinecap="round" fill="none" filter="url(#hpShadow)"/>
      {/* Band padding */}
      <path d="M54 90 Q52 52 100 46 Q148 52 146 90" stroke="url(#bandPad)" strokeWidth="8" strokeLinecap="round" fill="none"/>
      {/* Band stitching */}
      <path d="M58 88 Q56 54 100 48 Q144 54 142 88" stroke="#fff" strokeWidth="1" strokeDasharray="4 6" strokeLinecap="round" fill="none" opacity="0.2"/>

      {/* LEFT CUP */}
      {/* Cup housing */}
      <ellipse cx="34" cy="112" rx="24" ry="28" fill="url(#cup)" filter="url(#hpShadow)"/>
      {/* Cup front face */}
      <ellipse cx="34" cy="112" rx="22" ry="26" fill="url(#cup)"/>
      {/* Cup glare */}
      <ellipse cx="27" cy="100" rx="8" ry="6" fill="#fff" opacity="0.2"/>
      {/* Cushion ring */}
      <ellipse cx="34" cy="112" rx="18" ry="22" fill="url(#cushion)"/>
      <ellipse cx="34" cy="112" rx="14" ry="18" fill="#0f0f20"/>
      {/* Speaker mesh */}
      <ellipse cx="34" cy="112" rx="10" ry="12" fill="#1a1a30"/>
      {[[-4,-4],[0,-6],[4,-4],[-6,0],[6,0],[-4,4],[0,6],[4,4]].map(([dx,dy],i) => (
        <circle key={i} cx={34+dx} cy={112+dy} r="1.2" fill="#333350" opacity="0.8"/>
      ))}
      {/* Logo dot */}
      <circle cx="34" cy="112" r="3" fill="#9b7dff" opacity="0.5" filter="url(#cupGlow)"/>
      <circle cx="34" cy="112" r="1.5" fill="#c4b0ff" opacity="0.8"/>

      {/* RIGHT CUP */}
      <ellipse cx="166" cy="112" rx="24" ry="28" fill="url(#cup)" filter="url(#hpShadow)"/>
      <ellipse cx="166" cy="112" rx="22" ry="26" fill="url(#cup)"/>
      <ellipse cx="159" cy="100" rx="8" ry="6" fill="#fff" opacity="0.2"/>
      <ellipse cx="166" cy="112" rx="18" ry="22" fill="url(#cushion)"/>
      <ellipse cx="166" cy="112" rx="14" ry="18" fill="#0f0f20"/>
      <ellipse cx="166" cy="112" rx="10" ry="12" fill="#1a1a30"/>
      {[[-4,-4],[0,-6],[4,-4],[-6,0],[6,0],[-4,4],[0,6],[4,4]].map(([dx,dy],i) => (
        <circle key={i} cx={166+dx} cy={112+dy} r="1.2" fill="#333350" opacity="0.8"/>
      ))}
      <circle cx="166" cy="112" r="3" fill="#9b7dff" opacity="0.5" filter="url(#cupGlow)"/>
      <circle cx="166" cy="112" r="1.5" fill="#c4b0ff" opacity="0.8"/>

      {/* Left adjustment bar */}
      <rect x="26" y="78" width="16" height="30" rx="4" fill="#c0c0d0"/>
      <rect x="28" y="80" width="12" height="26" rx="3" fill="#9090a8"/>
      {[84,90,96].map(y => <rect key={y} x="29" y={y} width="10" height="2" rx="1" fill="#fff" opacity="0.3"/>)}

      {/* Right adjustment bar */}
      <rect x="158" y="78" width="16" height="30" rx="4" fill="#c0c0d0"/>
      <rect x="160" y="80" width="12" height="26" rx="3" fill="#9090a8"/>
      {[84,90,96].map(y => <rect key={y} x="161" y={y} width="10" height="2" rx="1" fill="#fff" opacity="0.3"/>)}

      {/* Cable */}
      <path d="M42 136 Q50 162 64 168" stroke="#606078" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <circle cx="64" cy="169" r="5" fill="#484860"/>
      <circle cx="64" cy="169" r="2.5" fill="#282838"/>
    </svg>
  );
}

export function WatchSVG({ size = 160 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wband" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2a2a3e"/><stop offset="50%" stopColor="#1a1a2e"/><stop offset="100%" stopColor="#111122"/>
        </linearGradient>
        <linearGradient id="wcase" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c0c0d4"/><stop offset="40%" stopColor="#9898b0"/><stop offset="100%" stopColor="#707084"/>
        </linearGradient>
        <radialGradient id="wscreen" cx="35%" cy="25%" r="70%">
          <stop offset="0%" stopColor="#1a1040"/><stop offset="70%" stopColor="#0a0820"/><stop offset="100%" stopColor="#050410"/>
        </radialGradient>
        <linearGradient id="ringR" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff4444"/><stop offset="100%" stopColor="#ff8800"/>
        </linearGradient>
        <linearGradient id="ringG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00d4ff"/><stop offset="100%" stopColor="#0088ff"/>
        </linearGradient>
        <filter id="watchShadow"><feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#000" floodOpacity="0.55"/></filter>
        <filter id="screenGlowW"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>

      <ellipse cx="100" cy="192" rx="52" ry="6" fill="#000" opacity="0.3"/>

      {/* Band top */}
      <rect x="64" y="8" width="72" height="54" rx="10" fill="url(#wband)" filter="url(#watchShadow)"/>
      <rect x="68" y="10" width="64" height="50" rx="8" fill="#222236"/>
      {[14,20,26,32,38,44,50,56].map(y => (
        <rect key={y} x="70" y={y} width="60" height="3" rx="1.5" fill="#fff" opacity="0.04"/>
      ))}
      {/* Band buckle */}
      <rect x="88" y="30" width="24" height="10" rx="3" fill="#444458"/>
      <rect x="90" y="32" width="20" height="6" rx="2" fill="#333348"/>
      <circle cx="100" cy="35" r="2" fill="#666680"/>

      {/* Band bottom */}
      <rect x="64" y="138" width="72" height="54" rx="10" fill="url(#wband)" filter="url(#watchShadow)"/>
      <rect x="68" y="140" width="64" height="50" rx="8" fill="#222236"/>
      {[142,148,154,160,166,172,178,184].map(y => (
        <rect key={y} x="70" y={y} width="60" height="3" rx="1.5" fill="#fff" opacity="0.04"/>
      ))}
      {/* Holes */}
      {[146,154,162].map(y => <circle key={y} cx="100" cy={y} r="2.5" fill="#111122"/>)}

      {/* Watch case */}
      <rect x="36" y="56" width="128" height="88" rx="28" fill="url(#wcase)" filter="url(#watchShadow)"/>
      {/* Case glare */}
      <rect x="36" y="56" width="128" height="88" rx="28" fill="#fff" opacity="0.06"/>
      <path d="M42 62 L100 58 L90 80 L40 72Z" fill="#fff" opacity="0.08"/>

      {/* Screen bezel */}
      <rect x="42" y="62" width="116" height="76" rx="22" fill="#111120"/>
      {/* Screen */}
      <rect x="46" y="66" width="108" height="68" rx="18" fill="url(#wscreen)"/>
      {/* Screen glow */}
      <rect x="46" y="66" width="108" height="68" rx="18" fill="#7c5cfc" opacity="0.08" filter="url(#screenGlowW)"/>

      {/* Time */}
      <text x="100" y="92" textAnchor="middle" fill="#ffffff" fontSize="22" fontWeight="800" fontFamily="system-ui,sans-serif" letterSpacing="-1.5">10:09</text>
      {/* Date */}
      <text x="100" y="106" textAnchor="middle" fill="#9b7dff" fontSize="9" fontWeight="600" fontFamily="system-ui,sans-serif" letterSpacing="1">MON  NOV 15</text>

      {/* Activity rings */}
      {/* Outer ring (Move) */}
      <circle cx="100" cy="118" r="14" stroke="#2a1a40" strokeWidth="4" fill="none"/>
      <circle cx="100" cy="118" r="14" stroke="url(#ringR)" strokeWidth="4" fill="none"
        strokeDasharray="62 26" strokeLinecap="round" transform="rotate(-90 100 118)"/>
      {/* Inner ring (Stand) */}
      <circle cx="100" cy="118" r="8" stroke="#1a2a30" strokeWidth="3.5" fill="none"/>
      <circle cx="100" cy="118" r="8" stroke="url(#ringG)" strokeWidth="3.5" fill="none"
        strokeDasharray="36 14" strokeLinecap="round" transform="rotate(-90 100 118)"/>

      {/* Crown button */}
      <rect x="163" y="76" width="8" height="22" rx="4" fill="url(#wcase)"/>
      <rect x="164" y="78" width="6" height="18" rx="3" fill="#8888a0"/>
      {[81,87,93].map(y => <rect key={y} x="164" y={y} width="6" height="2" rx="1" fill="#fff" opacity="0.25"/>)}

      {/* Side button */}
      <rect x="163" y="104" width="8" height="14" rx="4" fill="url(#wcase)"/>
      <rect x="164" y="105" width="6" height="12" rx="3" fill="#8888a0"/>
    </svg>
  );
}

export function TabletSVG({ size = 160 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tbody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b8b8cc"/><stop offset="50%" stopColor="#9898b0"/><stop offset="100%" stopColor="#707088"/>
        </linearGradient>
        <radialGradient id="tscreen" cx="30%" cy="20%" r="70%">
          <stop offset="0%" stopColor="#1e1050"/><stop offset="60%" stopColor="#0e0828"/><stop offset="100%" stopColor="#060418"/>
        </radialGradient>
        <radialGradient id="tglow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#7c5cfc" stopOpacity="0.25"/><stop offset="100%" stopColor="#7c5cfc" stopOpacity="0"/>
        </radialGradient>
        <filter id="tabShadow"><feDropShadow dx="4" dy="10" stdDeviation="12" floodColor="#000" floodOpacity="0.5"/></filter>
      </defs>

      <ellipse cx="100" cy="193" rx="68" ry="6" fill="#000" opacity="0.25"/>

      {/* Body */}
      <rect x="22" y="10" width="156" height="178" rx="14" fill="url(#tbody)" filter="url(#tabShadow)"/>
      <rect x="24" y="12" width="152" height="174" rx="12" fill="#111120"/>
      <rect x="28" y="16" width="144" height="166" rx="10" fill="url(#tscreen)"/>
      {/* Screen glow */}
      <rect x="28" y="16" width="144" height="166" rx="10" fill="url(#tglow)"/>
      {/* Camera */}
      <circle cx="100" cy="20" r="4" fill="#0a0818"/>
      <circle cx="100" cy="20" r="2.5" fill="#141430"/>
      <circle cx="100" cy="20" r="1.2" fill="#222240"/>
      <circle cx="101.5" cy="18.5" r="0.8" fill="#fff" opacity="0.4"/>
      {/* Status bar */}
      <rect x="34" y="28" width="30" height="4" rx="2" fill="#9b7dff" opacity="0.5"/>
      <rect x="150" y="28" width="16" height="4" rx="2" fill="#fff" opacity="0.12"/>
      {/* Hero card */}
      <rect x="34" y="38" width="132" height="60" rx="8" fill="#1a1240" opacity="0.8"/>
      <rect x="34" y="38" width="132" height="60" rx="8" fill="#7c5cfc" opacity="0.08"/>
      <rect x="42" y="48" width="60" height="8" rx="4" fill="#9b7dff" opacity="0.6"/>
      <rect x="42" y="60" width="114" height="3.5" rx="1.75" fill="#fff" opacity="0.15"/>
      <rect x="42" y="67" width="96" height="3.5" rx="1.75" fill="#fff" opacity="0.12"/>
      <rect x="42" y="74" width="76" height="3.5" rx="1.75" fill="#fff" opacity="0.10"/>
      <rect x="42" y="84" width="48" height="10" rx="5" fill="#7c5cfc" opacity="0.7"/>
      <text x="66" y="93" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="600" fontFamily="sans-serif">Shop Now →</text>
      {/* App grid */}
      {[[34,108],[82,108],[130,108],[34,148],[82,148],[130,148]].map(([x,y],i) => (
        <g key={i}>
          <rect x={x} y={y} width="40" height="32" rx="6" fill="#1a1240" opacity={0.6+i*0.05}/>
          <rect x={x+4} y={y+4} width="32" height="14" rx="3" fill="#7c5cfc" opacity={0.15+i*0.04}/>
          <rect x={x+4} y={y+22} width="20" height="3" rx="1.5" fill="#fff" opacity="0.12"/>
          <rect x={x+4} y={y+27} width="28" height="2.5" rx="1.25" fill="#fff" opacity="0.08"/>
        </g>
      ))}
      {/* Home indicator */}
      <rect x="76" y="175" width="48" height="5" rx="2.5" fill="#fff" opacity="0.15"/>
      {/* Body glare */}
      <path d="M24 14 L100 12 L95 30 L24 28Z" fill="#fff" opacity="0.04"/>
    </svg>
  );
}

export function PhoneSVG({ size = 160 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pbody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b0b0c8"/><stop offset="50%" stopColor="#9090a8"/><stop offset="100%" stopColor="#686880"/>
        </linearGradient>
        <radialGradient id="pscreen" cx="30%" cy="15%" r="75%">
          <stop offset="0%" stopColor="#1e1050"/><stop offset="55%" stopColor="#0e0828"/><stop offset="100%" stopColor="#06041a"/>
        </radialGradient>
        <radialGradient id="camBlur" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2a2040"/><stop offset="60%" stopColor="#1a1030"/><stop offset="100%" stopColor="#0a0818"/>
        </radialGradient>
        <filter id="phoneShadow"><feDropShadow dx="4" dy="12" stdDeviation="14" floodColor="#000" floodOpacity="0.55"/></filter>
      </defs>

      <ellipse cx="100" cy="194" rx="52" ry="5" fill="#000" opacity="0.3"/>

      {/* Body */}
      <rect x="38" y="8" width="124" height="184" rx="24" fill="url(#pbody)" filter="url(#phoneShadow)"/>
      {/* Screen area */}
      <rect x="40" y="10" width="120" height="180" rx="22" fill="#111120"/>
      <rect x="44" y="14" width="112" height="172" rx="18" fill="url(#pscreen)"/>
      {/* Dynamic island */}
      <rect x="72" y="22" width="56" height="15" rx="7.5" fill="#08060e"/>
      <circle cx="116" cy="29.5" r="5" fill="#0f0c1c"/>
      <circle cx="116" cy="29.5" r="3" fill="#181428"/>
      <circle cx="117.5" cy="28" r="1" fill="#fff" opacity="0.3"/>
      {/* Wallpaper gradient layer */}
      <rect x="44" y="14" width="112" height="172" rx="18" fill="#7c5cfc" opacity="0.06"/>
      {/* App icons row 1 */}
      {[50,74,98,122].map((x,i) => (
        <g key={`r1_${i}`}>
          <rect x={x} y={50} width="20" height="20" rx="5" fill="#7c5cfc" opacity={0.12+i*0.06}/>
          <rect x={x+2} y={52} width="16" height="16" rx="4" fill="#9b7dff" opacity={0.1+i*0.04}/>
        </g>
      ))}
      {/* App icons row 2 */}
      {[50,74,98,122].map((x,i) => (
        <g key={`r2_${i}`}>
          <rect x={x} y={78} width="20" height="20" rx="5" fill="#5b8fff" opacity={0.1+i*0.04}/>
        </g>
      ))}
      {/* App icons row 3 */}
      {[50,74,98,122].map((x,i) => (
        <g key={`r3_${i}`}>
          <rect x={x} y={106} width="20" height="20" rx="5" fill="#ff5b8f" opacity={0.08+i*0.03}/>
        </g>
      ))}
      {/* Widget */}
      <rect x="50" y="134" width="100" height="36" rx="10" fill="#1a1240" opacity="0.7"/>
      <rect x="56" y="140" width="40" height="6" rx="3" fill="#9b7dff" opacity="0.5"/>
      <rect x="56" y="150" width="60" height="3" rx="1.5" fill="#fff" opacity="0.1"/>
      <rect x="56" y="156" width="44" height="3" rx="1.5" fill="#fff" opacity="0.08"/>
      {/* Dock */}
      <rect x="50" y="174" width="100" height="8" rx="4" fill="#fff" opacity="0.05"/>
      {[54,78,102,126].map((x,i) => (
        <rect key={i} x={x} y={175} width="16" height="6" rx="3" fill="#7c5cfc" opacity="0.18"/>
      ))}
      {/* Home indicator */}
      <rect x="74" y="175" width="52" height="5" rx="2.5" fill="#fff" opacity="0.18"/>
      {/* Side buttons */}
      <rect x="162" y="52" width="6" height="32" rx="3" fill="url(#pbody)"/>
      <rect x="163" y="54" width="4" height="28" rx="2" fill="#808098"/>
      <rect x="32" y="50" width="6" height="20" rx="3" fill="url(#pbody)"/>
      <rect x="32" y="74" width="6" height="20" rx="3" fill="url(#pbody)"/>
      {/* Body glare */}
      <path d="M40 12 L100 10 L96 28 L42 24Z" fill="#fff" opacity="0.05"/>
      {/* Camera module bump */}
      <rect x="118" y="16" width="32" height="28" rx="8" fill="#0c0a1e" opacity="0.4"/>
      <circle cx="128" cy="25" r="6" fill="url(#camBlur)"/>
      <circle cx="128" cy="25" r="4" fill="#0a0818"/>
      <circle cx="128" cy="25" r="2" fill="#141428"/>
      <circle cx="129.5" cy="23.5" r="1" fill="#fff" opacity="0.4"/>
      <circle cx="140" cy="25" r="4.5" fill="url(#camBlur)"/>
      <circle cx="140" cy="25" r="3" fill="#0a0818"/>
      <circle cx="141" cy="24" r="0.8" fill="#fff" opacity="0.3"/>
    </svg>
  );
}

export function CameraSVG({ size = 160 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cbody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3a3a50"/><stop offset="50%" stopColor="#282838"/><stop offset="100%" stopColor="#181828"/>
        </linearGradient>
        <radialGradient id="clens" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#2a2060"/><stop offset="40%" stopColor="#151030"/><stop offset="70%" stopColor="#080618"/><stop offset="100%" stopColor="#020208"/>
        </radialGradient>
        <radialGradient id="lensGlass" cx="30%" cy="25%" r="50%">
          <stop offset="0%" stopColor="#4040a0" stopOpacity="0.6"/><stop offset="60%" stopColor="#1a1840" stopOpacity="0.3"/><stop offset="100%" stopColor="#080618" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="chump" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a4a60"/><stop offset="100%" stopColor="#2a2a3e"/>
        </linearGradient>
        <filter id="camShadow"><feDropShadow dx="2" dy="10" stdDeviation="12" floodColor="#000" floodOpacity="0.6"/></filter>
      </defs>

      <ellipse cx="100" cy="190" rx="72" ry="8" fill="#000" opacity="0.3"/>

      {/* Body */}
      <rect x="14" y="50" width="172" height="112" rx="16" fill="url(#cbody)" filter="url(#camShadow)"/>
      {/* Hump */}
      <rect x="48" y="28" width="80" height="28" rx="10" fill="url(#chump)"/>
      <rect x="52" y="32" width="72" height="22" rx="8" fill="url(#cbody)"/>
      {/* Mode dial */}
      <circle cx="148" cy="42" r="18" fill="#222232"/>
      <circle cx="148" cy="42" r="14" fill="#2a2a3e"/>
      {[0,45,90,135,180,225,270,315].map((deg,i) => (
        <circle key={i} cx={148+11*Math.cos(deg*Math.PI/180)} cy={42+11*Math.sin(deg*Math.PI/180)} r="2" fill="#444460" opacity="0.8"/>
      ))}
      <text x="148" y="45" textAnchor="middle" fill="#9b7dff" fontSize="8" fontWeight="700" fontFamily="sans-serif">M</text>
      {/* Shutter button */}
      <circle cx="68" cy="40" r="16" fill="#3a3a50"/>
      <circle cx="68" cy="40" r="12" fill="#2a2a3e"/>
      <circle cx="68" cy="40" r="8" fill="#ff4444" opacity="0.8"/>
      <circle cx="65" cy="37" r="3" fill="#fff" opacity="0.2"/>
      {/* Flash hotshoe */}
      <rect x="82" y="30" width="40" height="8" rx="2" fill="#1a1a28"/>
      <rect x="84" y="32" width="36" height="4" rx="1" fill="#222234"/>
      {/* Body texture */}
      <rect x="14" y="50" width="172" height="112" rx="16" fill="url(#cbody)" opacity="0.3"/>
      {/* Grip */}
      <rect x="14" y="50" width="30" height="112" rx="16" fill="#111118"/>
      {[60,72,84,96,108,120,132,144].map(y => (
        <rect key={y} x="16" y={y} width="8" height="4" rx="2" fill="#ffffff" opacity="0.04"/>
      ))}
      {/* LENS ASSEMBLY */}
      <circle cx="108" cy="106" r="56" fill="#111118"/>
      <circle cx="108" cy="106" r="52" fill="#0d0d18" stroke="#333348" strokeWidth="1.5"/>
      <circle cx="108" cy="106" r="46" fill="#0a0a14" stroke="#222234" strokeWidth="1"/>
      <circle cx="108" cy="106" r="38" fill="url(#clens)"/>
      <circle cx="108" cy="106" r="32" fill="#060610"/>
      <circle cx="108" cy="106" r="26" fill="#0c0c20"/>
      <circle cx="108" cy="106" r="20" fill="#080818"/>
      <circle cx="108" cy="106" r="14" fill="#0e0e28"/>
      <circle cx="108" cy="106" r="8" fill="#141428"/>
      <circle cx="108" cy="106" r="4" fill="#1e1e3e"/>
      {/* Lens glass reflection */}
      <circle cx="108" cy="106" r="38" fill="url(#lensGlass)"/>
      {/* Lens glare */}
      <ellipse cx="94" cy="92" rx="10" ry="8" fill="#fff" opacity="0.07"/>
      <ellipse cx="94" cy="92" rx="4" ry="3" fill="#fff" opacity="0.10"/>
      {/* Flash */}
      <circle cx="168" cy="66" r="11" fill="#111118"/>
      <circle cx="168" cy="66" r="8" fill="#f59e0b" opacity="0.35"/>
      <circle cx="168" cy="66" r="5" fill="#fcd34d" opacity="0.5"/>
      <circle cx="168" cy="66" r="2.5" fill="#fef08a" opacity="0.7"/>
      {/* LCD screen */}
      <rect x="152" y="88" width="24" height="18" rx="3" fill="#0a0a18"/>
      <rect x="154" y="90" width="20" height="14" rx="2" fill="#0e1c28"/>
      <text x="164" y="100" textAnchor="middle" fill="#00ff88" fontSize="5" fontFamily="monospace" opacity="0.8">1/200</text>
    </svg>
  );
}

export function MouseSVG({ size = 160 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="mbody" cx="35%" cy="20%" r="70%">
          <stop offset="0%" stopColor="#d8d8ec"/><stop offset="50%" stopColor="#b0b0c8"/><stop offset="100%" stopColor="#787890"/>
        </radialGradient>
        <radialGradient id="mscroll" cx="50%" cy="20%" r="60%">
          <stop offset="0%" stopColor="#606078"/><stop offset="100%" stopColor="#303040"/>
        </radialGradient>
        <linearGradient id="mline" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#111120"/><stop offset="100%" stopColor="#080810"/>
        </linearGradient>
        <filter id="mouseShadow"><feDropShadow dx="2" dy="12" stdDeviation="14" floodColor="#000" floodOpacity="0.55"/></filter>
      </defs>

      <ellipse cx="100" cy="190" rx="60" ry="8" fill="#000" opacity="0.3"/>

      {/* Body */}
      <path d="M100 16 C68 16 46 42 46 78 C46 120 62 156 100 164 C138 156 154 120 154 78 C154 42 132 16 100 16Z"
        fill="url(#mbody)" filter="url(#mouseShadow)"/>
      {/* Body sheen */}
      <path d="M100 18 C70 18 50 44 50 78 C50 118 64 154 100 162 C136 154 150 118 150 78 C150 44 130 18 100 18Z"
        fill="url(#mbody)"/>
      {/* Left glare */}
      <path d="M58 42 C52 54 50 66 52 78 L72 64 L68 38Z" fill="#fff" opacity="0.12"/>
      {/* Split line */}
      <path d="M100 18 C100 18 100 88 100 96" stroke="url(#mline)" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Left click zone */}
      <path d="M100 18 C70 18 50 44 50 78 L100 80Z" fill="#fff" opacity="0.03"/>
      {/* Left button crease */}
      <path d="M72 16 C66 22 56 34 52 52" stroke="#8888a0" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5"/>
      {/* Right button crease */}
      <path d="M128 16 C134 22 144 34 148 52" stroke="#8888a0" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5"/>
      {/* Scroll wheel housing */}
      <rect x="88" y="32" width="24" height="52" rx="12" fill="#111120"/>
      {/* Scroll wheel */}
      <rect x="90" y="34" width="20" height="48" rx="10" fill="url(#mscroll)"/>
      {[38,44,50,56,62,68,74].map(y => (
        <rect key={y} x="91" y={y} width="18" height="3.5" rx="1.75" fill="#fff" opacity="0.08"/>
      ))}
      {/* Scroll wheel glow */}
      <rect x="91" y="48" width="18" height="12" rx="6" fill="#9b7dff" opacity="0.2"/>
      {/* DPI dots */}
      {[-6,0,6].map((dx,i) => (
        <circle key={i} cx={100+dx} cy="96" r="2.5" fill={i === 1 ? "#9b7dff" : "#333348"} opacity={i===1?0.9:0.6}/>
      ))}
      {/* Logo */}
      <ellipse cx="100" cy="130" rx="12" ry="6" fill="#222234" opacity="0.6"/>
      <text x="100" y="133" textAnchor="middle" fill="#9b7dff" fontSize="5" fontWeight="700" fontFamily="sans-serif" opacity="0.7">CARTLY</text>
      {/* USB-C */}
      <rect x="84" y="154" width="32" height="10" rx="5" fill="#111120"/>
      <rect x="86" y="156" width="28" height="6" rx="3" fill="#1a1a2e"/>
      <rect x="88" y="158" width="24" height="2" rx="1" fill="#9b7dff" opacity="0.3"/>
      {/* Side grips */}
      {[68,78,88,98].map(y => (
        <rect key={y} x="46" y={y} width="6" height="7" rx="3" fill="#9898b0" opacity="0.35"/>
      ))}
      {[68,78,88,98].map(y => (
        <rect key={y} x="148" y={y} width="6" height="7" rx="3" fill="#9898b0" opacity="0.35"/>
      ))}
    </svg>
  );
}

export function EarbudsSVG({ size = 160 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ecase" cx="30%" cy="20%" r="70%">
          <stop offset="0%" stopColor="#d0d0e4"/><stop offset="50%" stopColor="#a8a8c0"/><stop offset="100%" stopColor="#787890"/>
        </radialGradient>
        <radialGradient id="einner" cx="40%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#2a2040"/><stop offset="100%" stopColor="#0f0c22"/>
        </radialGradient>
        <radialGradient id="ebud" cx="35%" cy="25%" r="60%">
          <stop offset="0%" stopColor="#e8e8f8"/><stop offset="60%" stopColor="#c0c0d8"/><stop offset="100%" stopColor="#909098"/>
        </radialGradient>
        <filter id="budShadow"><feDropShadow dx="1" dy="6" stdDeviation="6" floodColor="#000" floodOpacity="0.4"/></filter>
        <filter id="caseShadow"><feDropShadow dx="2" dy="10" stdDeviation="12" floodColor="#000" floodOpacity="0.5"/></filter>
      </defs>

      <ellipse cx="100" cy="192" rx="68" ry="6" fill="#000" opacity="0.25"/>

      {/* Case body */}
      <rect x="18" y="68" width="164" height="104" rx="30" fill="url(#ecase)" filter="url(#caseShadow)"/>
      <rect x="20" y="70" width="160" height="100" rx="28" fill="#c8c8dc"/>
      {/* Case lid seam */}
      <rect x="20" y="96" width="160" height="4" rx="2" fill="#aaaabc"/>
      <rect x="20" y="96" width="160" height="2" rx="1" fill="#fff" opacity="0.3"/>
      {/* Case hinge dots */}
      {[88,100,112].map(x => <circle key={x} cx={x} cy="98" r="2" fill="#9090a8"/>)}
      {/* Case glare */}
      <path d="M22 72 L100 70 L96 86 L22 84Z" fill="#fff" opacity="0.12"/>

      {/* LEFT BUD WELL */}
      <circle cx="60" cy="124" r="32" fill="url(#einner)"/>
      <circle cx="60" cy="124" r="26" fill="#181428"/>
      <circle cx="60" cy="124" r="20" fill="#100e20"/>
      {/* Left bud in well */}
      <ellipse cx="60" cy="116" rx="14" ry="18" fill="url(#ebud)" filter="url(#budShadow)"/>
      <ellipse cx="60" cy="116" rx="12" ry="16" fill="#d8d8ec"/>
      <ellipse cx="60" cy="120" rx="10" ry="8" fill="#b0b0c8" opacity="0.6"/>
      <circle cx="60" cy="114" r="5" fill="#0f0c22" opacity="0.7"/>
      <circle cx="60" cy="114" r="3" fill="#1a1632"/>
      <circle cx="60" cy="114" r="1.5" fill="#9b7dff" opacity="0.6"/>
      <rect x="56" y="130" width="8" height="14" rx="4" fill="url(#ebud)"/>
      <rect x="57" y="132" width="6" height="10" rx="3" fill="#c8c8e0"/>
      {/* Glare on left bud */}
      <ellipse cx="55" cy="110" rx="4" ry="3" fill="#fff" opacity="0.25"/>

      {/* RIGHT BUD WELL */}
      <circle cx="140" cy="124" r="32" fill="url(#einner)"/>
      <circle cx="140" cy="124" r="26" fill="#181428"/>
      <circle cx="140" cy="124" r="20" fill="#100e20"/>
      {/* Right bud */}
      <ellipse cx="140" cy="116" rx="14" ry="18" fill="url(#ebud)" filter="url(#budShadow)"/>
      <ellipse cx="140" cy="116" rx="12" ry="16" fill="#d8d8ec"/>
      <ellipse cx="140" cy="120" rx="10" ry="8" fill="#b0b0c8" opacity="0.6"/>
      <circle cx="140" cy="114" r="5" fill="#0f0c22" opacity="0.7"/>
      <circle cx="140" cy="114" r="3" fill="#1a1632"/>
      <circle cx="140" cy="114" r="1.5" fill="#9b7dff" opacity="0.6"/>
      <rect x="136" y="130" width="8" height="14" rx="4" fill="url(#ebud)"/>
      <rect x="137" y="132" width="6" height="10" rx="3" fill="#c8c8e0"/>
      <ellipse cx="135" cy="110" rx="4" ry="3" fill="#fff" opacity="0.25"/>

      {/* Lightning connector */}
      <rect x="88" y="158" width="24" height="8" rx="4" fill="#aaaabc"/>
      <rect x="90" y="160" width="20" height="4" rx="2" fill="#9898b0"/>
      {/* Charging LED */}
      <circle cx="100" cy="158" r="4" fill="#0d0c18"/>
      <circle cx="100" cy="158" r="2.5" fill="#22c55e" opacity="0.9"/>
      <circle cx="100" cy="158" r="1.2" fill="#86efac"/>

      {/* Left bud floating above */}
      <ellipse cx="36" cy="36" rx="18" ry="24" fill="url(#ebud)" filter="url(#budShadow)"/>
      <ellipse cx="36" cy="36" rx="16" ry="22" fill="#e0e0f4"/>
      <ellipse cx="36" cy="42" rx="13" ry="10" fill="#b8b8d0" opacity="0.6"/>
      <circle cx="36" cy="34" r="7" fill="#0f0c22" opacity="0.65"/>
      <circle cx="36" cy="34" r="4.5" fill="#1a1632"/>
      <circle cx="36" cy="34" r="2.2" fill="#9b7dff" opacity="0.7"/>
      <rect x="31" y="14" width="10" height="18" rx="5" fill="url(#ebud)"/>
      <rect x="33" y="16" width="6" height="14" rx="3" fill="#d0d0e8"/>
      <ellipse cx="32" cy="30" rx="5" ry="4" fill="#fff" opacity="0.2"/>

      {/* Right bud floating */}
      <ellipse cx="164" cy="36" rx="18" ry="24" fill="url(#ebud)" filter="url(#budShadow)"/>
      <ellipse cx="164" cy="36" rx="16" ry="22" fill="#e0e0f4"/>
      <ellipse cx="164" cy="42" rx="13" ry="10" fill="#b8b8d0" opacity="0.6"/>
      <circle cx="164" cy="34" r="7" fill="#0f0c22" opacity="0.65"/>
      <circle cx="164" cy="34" r="4.5" fill="#1a1632"/>
      <circle cx="164" cy="34" r="2.2" fill="#9b7dff" opacity="0.7"/>
      <rect x="159" y="14" width="10" height="18" rx="5" fill="url(#ebud)"/>
      <rect x="161" y="16" width="6" height="14" rx="3" fill="#d0d0e8"/>
      <ellipse cx="160" cy="30" rx="5" ry="4" fill="#fff" opacity="0.2"/>
    </svg>
  );
}

export function GadgetSVG({ size = 160 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gboard" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a2a1a"/><stop offset="100%" stopColor="#0a160a"/>
        </linearGradient>
        <linearGradient id="gchip" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9b7dff"/><stop offset="100%" stopColor="#5b3fd4"/>
        </linearGradient>
        <filter id="gadShadow"><feDropShadow dx="2" dy="8" stdDeviation="10" floodColor="#000" floodOpacity="0.5"/></filter>
      </defs>
      <ellipse cx="100" cy="188" rx="66" ry="7" fill="#000" opacity="0.25"/>
      <rect x="22" y="22" width="156" height="156" rx="16" fill="url(#gboard)" filter="url(#gadShadow)"/>
      <rect x="24" y="24" width="152" height="152" rx="14" fill="#0e1e0e" stroke="#1a3a1a" strokeWidth="1"/>
      {/* Circuit traces */}
      {[[30,100],[170,100],[100,30],[100,170]].map(([x,y],i) => (
        <line key={i} x1={i<2?30:x} y1={i<2?y:30} x2={i<2?170:x} y2={i<2?y:170} stroke="#1a4a1a" strokeWidth="1" opacity="0.5"/>
      ))}
      <rect x="52" y="52" width="96" height="96" rx="10" fill="url(#gchip)"/>
      <rect x="56" y="56" width="88" height="88" rx="8" fill="#0a0818"/>
      <rect x="60" y="60" width="80" height="80" rx="6" fill="#0e0c24"/>
      <text x="100" y="98" textAnchor="middle" fill="#9b7dff" fontSize="11" fontWeight="800" fontFamily="monospace" opacity="0.9">CARTLY</text>
      <text x="100" y="112" textAnchor="middle" fill="#5b3fd4" fontSize="7" fontFamily="monospace" opacity="0.7">v2.0</text>
      {[52,64,76,88].map(x => <rect key={x} x={x} y={44} width={8} height={8} rx={2} fill="#22c55e" opacity={0.5}/>)}
      {[52,64,76,88].map(x => <rect key={x} x={x} y={148} width={8} height={8} rx={2} fill="#22c55e" opacity={0.5}/>)}
      {[52,64,76,88].map(y => <rect key={y} x={44} y={y} width={8} height={8} rx={2} fill="#22c55e" opacity={0.5}/>)}
      {[52,64,76,88].map(y => <rect key={y} x={148} y={y} width={8} height={8} rx={2} fill="#22c55e" opacity={0.5}/>)}
    </svg>
  );
}

export function getProductSVG(name = "", category = "", size = 140) {
  const n = (name + " " + category).toLowerCase();
  if (/macbook|zenbook|laptop|notebook|rog |vivobook|thinkpad|inspiron|ideapad/.test(n)) return <LaptopSVG size={size} />;
  if (/airpod|earbuds?|tws|buds/.test(n))                                               return <EarbudsSVG size={size} />;
  if (/watch/.test(n))                                                                   return <WatchSVG size={size} />;
  if (/galaxy\s*s\d|iphone|pixel \d|oneplus|redmi|poco|realme|smartphone/.test(n))      return <PhoneSVG size={size} />;
  if (/headphone|wh-|bose|soundlink|over.ear|studio/.test(n))                           return <HeadphonesSVG size={size} />;
  if (/ipad|galaxy\s*tab|tab s|tablet/.test(n))                                         return <TabletSVG size={size} />;
  if (/camera|alpha|eos|nikon|fuji|mirrorless/.test(n))                                 return <CameraSVG size={size} />;
  if (/mouse/.test(n))                                                                   return <MouseSVG size={size} />;
  if (/phone|mobile/.test(n))                                                            return <PhoneSVG size={size} />;
  if (/laptop/.test(n))   return <LaptopSVG size={size} />;
  if (/audio/.test(n))    return <HeadphonesSVG size={size} />;
  if (/wearable/.test(n)) return <WatchSVG size={size} />;
  if (/tablet/.test(n))   return <TabletSVG size={size} />;
  if (/camera/.test(n))   return <CameraSVG size={size} />;
  if (/mobile|smartphone/.test(n)) return <PhoneSVG size={size} />;
  return <GadgetSVG size={size} />;
}
