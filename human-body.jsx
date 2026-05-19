// HumanBody — hybrid silhouette + subtle muscle zones + tappable measurement pins
// Pins: chest, arm-left, arm-right, waist, hips (front view); back, glutes (back view)

const BodyConst = {
  W: 320,
  H: 460,
};

function HumanBody({ side = 'front', activeId, onSelect, theme = 'light' }) {
  const ink = theme === 'dark' ? '#FAFAFA' : '#0B0B0B';
  const skin = theme === 'dark' ? '#1C1C1C' : '#EAE8E2';
  const skinEdge = theme === 'dark' ? '#2A2A2A' : '#D9D7D0';
  const zone = theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(11,11,11,0.045)';
  const zoneActive = '#D8FF3D';
  const grid = theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(11,11,11,0.05)';

  // Pin positions (front) — aligned with the new athletic silhouette
  const pinsFront = [
    { id: 'chest', x: 160, y: 172, label: 'CHEST' },
    { id: 'arm-l', x: 72,  y: 210, label: 'ARM' },
    { id: 'arm-r', x: 248, y: 210, label: 'ARM' },
    { id: 'waist', x: 160, y: 248, label: 'WAIST' },
    { id: 'hips',  x: 160, y: 304, label: 'HIPS' },
  ];
  const pinsBack = [
    { id: 'back',   x: 160, y: 188, label: 'BACK' },
    { id: 'glutes', x: 160, y: 306, label: 'GLUTES' },
    { id: 'arm-l',  x: 72,  y: 210, label: 'ARM' },
    { id: 'arm-r',  x: 248, y: 210, label: 'ARM' },
  ];
  const pins = side === 'front' ? pinsFront : pinsBack;

  // Muscle zone paths — overlay shaded regions on the silhouette
  // Coordinated with the new athletic body shape.
  const zonesFront = {
    chest:   "M 122 150 Q 160 144 198 150 L 198 196 Q 160 204 122 196 Z",
    'arm-l': "M 68 178 Q 60 200 72 232 L 90 230 Q 96 204 96 180 Z",
    'arm-r': "M 252 178 Q 260 200 248 232 L 230 230 Q 224 204 224 180 Z",
    waist:   "M 108 226 Q 160 234 212 226 L 210 268 Q 160 274 110 268 Z",
    hips:    "M 104 280 Q 160 288 216 280 L 216 326 Q 160 332 104 326 Z",
  };
  const zonesBack = {
    back:    "M 110 152 Q 160 146 210 152 L 214 232 Q 160 240 106 232 Z",
    glutes:  "M 104 282 Q 160 290 216 282 L 214 332 Q 160 340 106 332 Z",
    'arm-l': "M 68 178 Q 60 200 72 232 L 90 230 Q 96 204 96 180 Z",
    'arm-r': "M 252 178 Q 260 200 248 232 L 230 230 Q 224 204 224 180 Z",
  };
  const zones = side === 'front' ? zonesFront : zonesBack;

  // Silhouette path — sleek athletic male V-taper figure
  // Center x = 160. Drawn from top of head, clockwise.
  const silhouette = `
    M 160 40
    C 175 40 185 52 185 66
    C 185 80 178 90 170 96
    L 168 106
    C 196 108 224 122 246 142
    C 254 150 258 162 254 174
    C 252 182 246 188 240 188
    L 238 200
    C 242 220 240 250 234 274
    L 228 296
    C 226 308 224 318 222 326
    L 220 332
    C 218 336 214 336 211 334
    L 206 330
    C 204 322 204 312 206 302
    L 210 280
    C 212 260 210 232 206 214
    L 200 218
    C 196 224 192 230 188 234
    L 184 250
    C 182 262 184 274 188 284
    C 192 296 200 308 208 322
    C 212 332 214 344 214 358
    L 210 400
    C 208 422 204 440 200 454
    L 196 462
    C 194 466 188 466 184 462
    L 180 458
    C 176 442 172 422 170 400
    L 168 358
    L 164 354
    L 160 354
    L 156 354
    L 152 358
    L 150 400
    C 148 422 144 442 140 458
    L 136 462
    C 132 466 126 466 124 462
    L 120 454
    C 116 440 112 422 110 400
    L 106 358
    C 106 344 108 332 112 322
    C 120 308 128 296 132 284
    C 136 274 138 262 136 250
    L 132 234
    C 128 230 124 224 120 218
    L 114 214
    C 110 232 108 260 110 280
    L 114 302
    C 116 312 116 322 114 330
    L 109 334
    C 106 336 102 336 100 332
    L 98 326
    C 96 318 94 308 92 296
    L 86 274
    C 80 250 78 220 82 200
    L 80 188
    C 74 188 68 182 66 174
    C 62 162 66 150 74 142
    C 96 122 124 108 152 106
    L 150 96
    C 142 90 135 80 135 66
    C 135 52 145 40 160 40
    Z
  `;

  return (
    <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
      <svg width="100%" viewBox={`0 0 ${BodyConst.W} ${BodyConst.H}`} style={{ display: 'block', maxWidth: 360, overflow: 'visible' }}>
        <defs>
          {/* Subtle inner shading on the silhouette */}
          <linearGradient id="silGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"  stopColor={skin} />
            <stop offset="100%" stopColor={theme === 'dark' ? '#0F0F0F' : '#DDDAD2'} />
          </linearGradient>
          <radialGradient id="bodyGlow" cx="50%" cy="40%" r="60%">
            <stop offset="0%"  stopColor={theme === 'dark' ? 'rgba(216,255,61,0.10)' : 'rgba(11,11,11,0.04)'} />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          {/* center axis pattern */}
          <pattern id="bgGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke={grid} strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* Technical grid background */}
        <rect width={BodyConst.W} height={BodyConst.H} fill="url(#bgGrid)" />

        {/* Center axis line */}
        <line x1={BodyConst.W/2} y1="20" x2={BodyConst.W/2} y2={BodyConst.H - 20}
              stroke={theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(11,11,11,0.06)'}
              strokeWidth="1" strokeDasharray="2 4" />

        {/* Anatomical tick marks (measurement reference) */}
        {[
          { y: 68,  l: 'C1' },
          { y: 172, l: 'T4' },
          { y: 248, l: 'L3' },
          { y: 304, l: 'S2' },
          { y: 400, l: 'KN' },
          { y: 458, l: 'AN' },
        ].map(({y, l}) => (
          <g key={y}>
            <line x1="22" y1={y} x2="30" y2={y} stroke={theme === 'dark' ? 'rgba(255,255,255,0.22)' : 'rgba(11,11,11,0.26)'} strokeWidth="1"/>
            <text x="8" y={y+3} fontSize="8" fill={theme === 'dark' ? 'rgba(255,255,255,0.35)' : 'rgba(11,11,11,0.4)'}
                  fontFamily="'Space Grotesk', system-ui" fontWeight="700" letterSpacing="0.8">
              {l}
            </text>
          </g>
        ))}

        {/* Background glow under the body */}
        <ellipse cx={BodyConst.W/2} cy="240" rx="120" ry="200" fill="url(#bodyGlow)" />

        {/* Silhouette */}
        <path d={silhouette} fill="url(#silGrad)" stroke={skinEdge} strokeWidth="1" />

        {/* Active zone fill (lime highlight) */}
        {activeId && zones[activeId] && (
          <>
            <path d={zones[activeId]} fill={zoneActive} fillOpacity="0.35" />
            <path d={zones[activeId]} fill="none" stroke={zoneActive} strokeWidth="2" />
          </>
        )}

        {/* Center line indicator — horizontal reference for active pin */}
        {activeId && (
          <line x1="20" y1={pins.find(p => p.id === activeId)?.y || 0}
                x2="300" y2={pins.find(p => p.id === activeId)?.y || 0}
                stroke={zoneActive} strokeOpacity="0.5" strokeWidth="1" strokeDasharray="3 4" />
        )}

        {/* Pins */}
        {pins.map(p => {
          const isActive = p.id === activeId;
          // alternating side of label
          const labelOnRight = p.x > 160 || p.id === 'chest' || p.id === 'waist' || p.id === 'hips' || p.id === 'back' || p.id === 'glutes';
          return (
            <g key={p.id} style={{ cursor: 'pointer' }} onClick={() => onSelect && onSelect(p.id)}>
              {/* Connector line from pin to body edge */}
              <line
                x1={p.x} y1={p.y}
                x2={labelOnRight ? p.x + 60 : p.x - 60}
                y2={p.y}
                stroke={isActive ? zoneActive : (theme === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(11,11,11,0.28)')}
                strokeWidth={isActive ? 1.5 : 1}
              />
              {/* Outer ring */}
              <circle cx={p.x} cy={p.y} r={isActive ? 11 : 7}
                      fill={isActive ? zoneActive : (theme === 'dark' ? '#0B0B0B' : '#FFFFFF')}
                      stroke={isActive ? zoneActive : ink}
                      strokeWidth={isActive ? 0 : 1.5}
                      style={{ transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)' }} />
              {/* Inner dot */}
              <circle cx={p.x} cy={p.y} r={isActive ? 3 : 2.5} fill={isActive ? '#0B0B0B' : ink} />
              {/* Active outer halo */}
              {isActive && (
                <circle cx={p.x} cy={p.y} r="18"
                        fill="none" stroke={zoneActive} strokeOpacity="0.4" strokeWidth="1" />
              )}
              {/* Label */}
              <g transform={`translate(${labelOnRight ? p.x + 64 : p.x - 64}, ${p.y})`}>
                <text textAnchor={labelOnRight ? 'start' : 'end'}
                      y="3"
                      fontSize="9"
                      fontFamily="'Space Grotesk', system-ui"
                      fontWeight="700"
                      letterSpacing="1.2"
                      fill={isActive ? ink : (theme === 'dark' ? 'rgba(255,255,255,0.55)' : 'rgba(11,11,11,0.55)')}>
                  {p.label}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

window.HumanBody = HumanBody;
