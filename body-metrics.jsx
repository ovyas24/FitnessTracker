// Body Metrics — main screen
// Premium athletic design, Whoop/Strava energy

// ───────── Sample data (realistic 12-week recomp journey) ─────────

function genHistory(start, end, weeks, noiseAmp = 0.4) {
  // Produce 1W, 1M, 3M, 6M, 1Y slices with weekly resolution + monotonic drift + noise
  function series(n, sIdx, eIdx) {
    const arr = [];
    for (let i = 0; i < n; i++) {
      const t = sIdx + (eIdx - sIdx) * (i / (n - 1));
      const base = start + (end - start) * (t / weeks);
      const noise = Math.sin(t * 0.7 + sIdx) * noiseAmp + Math.cos(t * 1.3) * noiseAmp * 0.6;
      arr.push({ v: +(base + noise).toFixed(1), t });
    }
    return arr;
  }
  function label(s, units) {
    return s.map((p) => {
      const wksAgo = weeks - p.t;
      let l;
      if (units === 'D') {
        const days = Math.round(wksAgo * 7);
        l = days === 0 ? 'NOW' : `-${days}D`;
      } else if (units === 'W') {
        l = wksAgo < 0.5 ? 'NOW' : `-${Math.round(wksAgo)}W`;
      } else {
        const m = wksAgo / 4.33;
        l = m < 0.5 ? 'NOW' : `-${Math.round(m)}M`;
      }
      return { ...p, l };
    });
  }
  const oneW = label(series(7,  weeks - 1,  weeks),  'D');
  const oneM = label(series(8,  weeks - 4.33,  weeks),  'W');
  const threeM = label(series(12, weeks - 13, weeks), 'W');
  const sixM = label(series(12, weeks - 26, weeks), 'M');
  const oneY = label(series(12, 0,           weeks), 'M');
  return { '1W': oneW, '1M': oneM, '3M': threeM, '6M': sixM, '1Y': oneY };
}

const MEASUREMENTS = [
  {
    id: 'weight', name: 'Weight', unit: 'kg', eyebrow: 'BODY MASS',
    current: 76.4, lowerIsBetter: true,
    history: genHistory(81.2, 76.4, 52, 0.5),
  },
  {
    id: 'bodyfat', name: 'Body Fat', unit: '%', eyebrow: 'COMPOSITION',
    current: 14.2, lowerIsBetter: true,
    history: genHistory(18.4, 14.2, 52, 0.3),
  },
  {
    id: 'chest', name: 'Chest', unit: 'cm', eyebrow: 'CIRCUMFERENCE',
    current: 102.5, lowerIsBetter: false,
    history: genHistory(100.2, 102.5, 52, 0.25),
  },
  {
    id: 'arm-l', name: 'Arm (Left)', unit: 'cm', eyebrow: 'CIRCUMFERENCE',
    current: 39.2, lowerIsBetter: false,
    history: genHistory(37.6, 39.2, 52, 0.15),
  },
  {
    id: 'arm-r', name: 'Arm (Right)', unit: 'cm', eyebrow: 'CIRCUMFERENCE',
    current: 39.4, lowerIsBetter: false,
    history: genHistory(37.8, 39.4, 52, 0.15),
  },
  {
    id: 'waist', name: 'Waist', unit: 'cm', eyebrow: 'CIRCUMFERENCE',
    current: 81.0, lowerIsBetter: true,
    history: genHistory(86.4, 81.0, 52, 0.3),
  },
  {
    id: 'hips', name: 'Hips', unit: 'cm', eyebrow: 'CIRCUMFERENCE',
    current: 96.5, lowerIsBetter: true,
    history: genHistory(98.2, 96.5, 52, 0.2),
  },
  {
    id: 'back', name: 'Back', unit: 'cm', eyebrow: 'WIDTH',
    current: 48.2, lowerIsBetter: false,
    history: genHistory(46.6, 48.2, 52, 0.15),
  },
  {
    id: 'glutes', name: 'Glutes', unit: 'cm', eyebrow: 'CIRCUMFERENCE',
    current: 98.8, lowerIsBetter: false,
    history: genHistory(96.2, 98.8, 52, 0.2),
  },
];

const byId = (id) => MEASUREMENTS.find(m => m.id === id);

// ───────── Mini sparkline (for cards / list rows) ─────────
function Spark({ data, color = '#0B0B0B', w = 80, h = 28, accent = false }) {
  const ys = data.map(d => d.v);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const pad = 2;
  const xFor = i => pad + (i / (data.length - 1)) * (w - pad * 2);
  const yFor = v => pad + (1 - (v - minY) / Math.max(0.0001, maxY - minY)) * (h - pad * 2);
  const path = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(d.v)}`).join(' ');
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <path d={path} fill="none" stroke={color} strokeWidth={accent ? 2 : 1.6} strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={xFor(data.length - 1)} cy={yFor(data[data.length - 1].v)} r="2.5" fill={color}/>
    </svg>
  );
}

// ───────── Metric Card (top summary cards) ─────────
function MetricCard({ measurement, theme, accentCard = false, onClick }) {
  const ink = theme === 'dark' ? '#FAFAFA' : '#0B0B0B';
  const ink2 = theme === 'dark' ? 'rgba(255,255,255,0.55)' : 'rgba(11,11,11,0.55)';
  const surface = theme === 'dark' ? '#161616' : '#FFFFFF';
  const accent = '#D8FF3D';
  const coral = '#FF5A4D';

  const data = measurement.history['3M'];
  const start = data[0].v;
  const current = data[data.length - 1].v;
  const delta = current - start;
  const positive = measurement.lowerIsBetter ? delta < 0 : delta > 0;

  const bg = accentCard ? accent : surface;
  const fg = accentCard ? '#0B0B0B' : ink;
  const fg2 = accentCard ? 'rgba(11,11,11,0.6)' : ink2;
  const sparkColor = accentCard ? '#0B0B0B' : (positive ? ink : coral);
  const chipBg = accentCard ? 'rgba(11,11,11,0.85)' : (positive ? ink : 'rgba(255,90,77,0.12)');
  const chipColor = accentCard ? accent : (positive ? (theme === 'dark' ? '#0B0B0B' : '#FAFAFA') : coral);

  return (
    <button onClick={onClick} style={{
      flex: 1, background: bg,
      border: 'none', cursor: 'pointer', textAlign: 'left',
      borderRadius: 20, padding: '16px 16px 14px',
      display: 'flex', flexDirection: 'column', gap: 8,
      minHeight: 130, position: 'relative', overflow: 'hidden',
      fontFamily: "'Space Grotesk', system-ui",
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: 1.2, color: fg2,
          textTransform: 'uppercase',
        }}>{measurement.eyebrow}</span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 3,
          padding: '3px 7px', borderRadius: 99,
          background: chipBg, color: chipColor,
          fontSize: 10, fontWeight: 700, letterSpacing: 0.3,
          fontVariantNumeric: 'tabular-nums',
        }}>
          <svg width="8" height="8" viewBox="0 0 8 8" style={{ transform: delta < 0 ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            <path d="M4 1.5 L4 6.5 M1.5 4 L4 1.5 L6.5 4" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {delta > 0 ? '+' : ''}{delta.toFixed(1)}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{
          fontSize: 36, fontWeight: 700, color: fg,
          fontVariantNumeric: 'tabular-nums', letterSpacing: -1, lineHeight: 1,
        }}>{current.toFixed(1)}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: fg2 }}>{measurement.unit}</span>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: fg2, letterSpacing: 0.3 }}>
          {measurement.name.toUpperCase()}
        </span>
        <Spark data={data} color={sparkColor} accent />
      </div>
    </button>
  );
}

// ───────── Measurement list row ─────────
function MeasurementRow({ measurement, theme, onClick, isLast }) {
  const ink = theme === 'dark' ? '#FAFAFA' : '#0B0B0B';
  const ink2 = theme === 'dark' ? 'rgba(255,255,255,0.55)' : 'rgba(11,11,11,0.55)';
  const sep = theme === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(11,11,11,0.06)';
  const accent = '#D8FF3D';
  const coral = '#FF5A4D';

  const data = measurement.history['3M'];
  const start = data[0].v;
  const current = data[data.length - 1].v;
  const delta = current - start;
  const positive = measurement.lowerIsBetter ? delta < 0 : delta > 0;
  const chipBg = positive ? accent : 'rgba(255,90,77,0.12)';
  const chipColor = positive ? '#0B0B0B' : coral;

  return (
    <button onClick={onClick} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 0', background: 'transparent', border: 'none',
      borderBottom: isLast ? 'none' : `1px solid ${sep}`,
      cursor: 'pointer', textAlign: 'left',
      fontFamily: "'Space Grotesk', system-ui",
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: ink, marginBottom: 2 }}>{measurement.name}</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: ink2, letterSpacing: 0.4 }}>
          {measurement.eyebrow}
        </div>
      </div>
      <Spark data={data} color={positive ? ink : coral} w={64} h={22} />
      <div style={{ minWidth: 70, textAlign: 'right' }}>
        <div style={{
          fontSize: 18, fontWeight: 700, color: ink,
          fontVariantNumeric: 'tabular-nums', letterSpacing: -0.3, lineHeight: 1,
        }}>
          {current.toFixed(1)}<span style={{ fontSize: 11, color: ink2, marginLeft: 2, fontWeight: 500 }}>{measurement.unit}</span>
        </div>
        <div style={{ marginTop: 6, display: 'flex', justifyContent: 'flex-end' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 2,
            padding: '2px 6px', borderRadius: 99,
            background: chipBg, color: chipColor,
            fontSize: 10, fontWeight: 700, letterSpacing: 0.2,
            fontVariantNumeric: 'tabular-nums',
          }}>
            <svg width="7" height="7" viewBox="0 0 8 8" style={{ transform: delta < 0 ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              <path d="M4 1.5 L4 6.5 M1.5 4 L4 1.5 L6.5 4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {delta > 0 ? '+' : ''}{delta.toFixed(1)}
          </span>
        </div>
      </div>
    </button>
  );
}

// ───────── Custom Header ─────────
function ScreenHeader({ theme }) {
  const ink = theme === 'dark' ? '#FAFAFA' : '#0B0B0B';
  const ink2 = theme === 'dark' ? 'rgba(255,255,255,0.55)' : 'rgba(11,11,11,0.55)';

  return (
    <div style={{ padding: '14px 20px 4px', fontFamily: "'Space Grotesk', system-ui" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        {/* Back glyph */}
        <button style={{
          width: 38, height: 38, borderRadius: 99, border: 'none', cursor: 'pointer',
          background: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(11,11,11,0.05)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: ink,
        }}>
          <svg width="10" height="16" viewBox="0 0 10 16"><path d="M8 2 L2 8 L8 14" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        {/* Period indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 14px', borderRadius: 99,
          background: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(11,11,11,0.05)',
          fontSize: 12, fontWeight: 700, letterSpacing: 0.5, color: ink,
        }}>
          <span style={{ width: 6, height: 6, background: '#D8FF3D', borderRadius: 99 }} />
          LAST 90 DAYS
          <svg width="8" height="8" viewBox="0 0 8 8" style={{ marginLeft: 2 }}><path d="M1 2 L4 6 L7 2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        {/* Add measurement */}
        <button style={{
          width: 38, height: 38, borderRadius: 99, border: 'none', cursor: 'pointer',
          background: theme === 'dark' ? '#FAFAFA' : '#0B0B0B',
          color: theme === 'dark' ? '#0B0B0B' : '#FAFAFA',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 2 L7 12 M2 7 L12 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>

      {/* Eyebrow + title */}
      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: 1.6, color: ink2,
        textTransform: 'uppercase', marginBottom: 4,
      }}>Module C · Body Metrics</div>
      <h1 style={{
        margin: 0, fontSize: 40, fontWeight: 700, color: ink,
        letterSpacing: -1.5, lineHeight: 1,
      }}>Your body,<br/>this quarter.</h1>
    </div>
  );
}

// ───────── Front/Back toggle ─────────
function SideToggle({ side, onSideChange, theme }) {
  const ink = theme === 'dark' ? '#FAFAFA' : '#0B0B0B';
  const trackBg = theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(11,11,11,0.05)';

  return (
    <div style={{
      display: 'inline-flex', padding: 3, borderRadius: 99,
      background: trackBg, fontFamily: "'Space Grotesk', system-ui",
    }}>
      {['front', 'back'].map(s => (
        <button key={s} onClick={() => onSideChange(s)}
                style={{
                  padding: '7px 16px', borderRadius: 99, border: 'none', cursor: 'pointer',
                  background: s === side ? ink : 'transparent',
                  color: s === side ? (theme === 'dark' ? '#0B0B0B' : '#FAFAFA') : ink,
                  fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
                  textTransform: 'uppercase',
                  transition: 'background 160ms, color 160ms',
                }}>{s}</button>
      ))}
    </div>
  );
}

// ───────── Tab bar ─────────
function TabBar({ theme }) {
  const ink = theme === 'dark' ? '#FAFAFA' : '#0B0B0B';
  const ink2 = theme === 'dark' ? 'rgba(255,255,255,0.45)' : 'rgba(11,11,11,0.4)';
  const surface = theme === 'dark' ? 'rgba(20,20,20,0.85)' : 'rgba(255,255,255,0.85)';

  const tabs = [
    { id: 'train', label: 'Train', icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M2 11 L4 11 M6 7 L6 15 M9 5 L9 17 M13 5 L13 17 M16 7 L16 15 M18 11 L20 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
    )},
    { id: 'eat', label: 'Eat', icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8"/><path d="M11 4 L11 11 L16 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
    )},
    { id: 'body', label: 'Body', active: true, icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.8"/><path d="M11 8 L11 14 M11 14 L7 19 M11 14 L15 19 M7 11 L15 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
    )},
    { id: 'you', label: 'You', icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.8"/><path d="M3 19 C3 14.5 6.5 12 11 12 C15.5 12 19 14.5 19 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
    )},
  ];

  return (
    <div style={{
      position: 'absolute', left: 14, right: 14, bottom: 18, zIndex: 20,
      background: surface,
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      border: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(11,11,11,0.06)',
      borderRadius: 28, padding: '10px 8px',
      display: 'flex', justifyContent: 'space-around',
      boxShadow: theme === 'dark' ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.06)',
      fontFamily: "'Space Grotesk', system-ui",
    }}>
      {tabs.map(t => (
        <button key={t.id} style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          padding: '4px 0', background: 'transparent', border: 'none', cursor: 'pointer',
          color: t.active ? ink : ink2,
        }}>
          {t.active && <div style={{ width: 28, height: 3, background: '#D8FF3D', borderRadius: 99, marginBottom: 4 }} />}
          {t.icon}
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// ───────── Main screen ─────────
function BodyMetricsScreen({ theme }) {
  const [side, setSide] = React.useState('front');
  const [activeId, setActiveId] = React.useState('chest');
  const [sheetId, setSheetId] = React.useState(null);

  const ink = theme === 'dark' ? '#FAFAFA' : '#0B0B0B';
  const ink2 = theme === 'dark' ? 'rgba(255,255,255,0.55)' : 'rgba(11,11,11,0.55)';
  const bg = theme === 'dark' ? '#0B0B0B' : '#F1EFEB';
  const surface = theme === 'dark' ? '#161616' : '#FFFFFF';
  const sep = theme === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(11,11,11,0.06)';

  // The list excludes the two "card" metrics (weight, bodyfat)
  const listIds = side === 'front' ? ['chest', 'arm-l', 'arm-r', 'waist', 'hips'] : ['back', 'arm-l', 'arm-r', 'glutes'];
  const listMeasurements = listIds.map(byId);

  const activeM = byId(activeId);

  return (
    <div style={{
      background: bg, minHeight: '100%', position: 'relative',
      paddingBottom: 110,
    }}>
      <ScreenHeader theme={theme} />

      {/* Top metric cards */}
      <div style={{ display: 'flex', gap: 10, padding: '14px 20px 0' }}>
        <MetricCard measurement={byId('weight')} theme={theme} accentCard onClick={() => setSheetId('weight')} />
        <MetricCard measurement={byId('bodyfat')} theme={theme} onClick={() => setSheetId('bodyfat')} />
      </div>

      {/* Body view section */}
      <div style={{
        margin: '18px 14px 0', background: surface, borderRadius: 24, padding: '18px 14px 12px',
        fontFamily: "'Space Grotesk', system-ui",
      }}>
        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6px', marginBottom: 6 }}>
          <div>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: 1.4, color: ink2,
              textTransform: 'uppercase', marginBottom: 2,
            }}>PROJECTION</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: ink, letterSpacing: -0.3 }}>
              Tap a point
            </div>
          </div>
          <SideToggle side={side} onSideChange={(s) => { setSide(s); setActiveId(s === 'front' ? 'chest' : 'back'); }} theme={theme} />
        </div>

        {/* The body */}
        <HumanBody side={side} activeId={activeId}
                   onSelect={(id) => {
                     // Tapping a pin: if it's already active, open the sheet; otherwise activate it.
                     if (id === activeId) {
                       setSheetId(id);
                     } else {
                       setActiveId(id);
                     }
                   }}
                   theme={theme} />

        {/* Active stat preview (below body) */}
        {activeM && (
          <button onClick={() => setSheetId(activeId)}
                  style={{
                    width: '100%', marginTop: 4,
                    background: theme === 'dark' ? 'rgba(216,255,61,0.08)' : 'rgba(11,11,11,0.04)',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    borderRadius: 16, padding: '12px 14px',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}>
            <div style={{
              width: 36, height: 36, borderRadius: 12, background: '#D8FF3D',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0B0B0B',
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 12 L6 8 L9 11 L14 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: 1.2, color: ink2,
                textTransform: 'uppercase', marginBottom: 1,
              }}>SELECTED · {activeM.eyebrow}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: ink, letterSpacing: -0.2 }}>
                {activeM.name} · {activeM.current.toFixed(1)} {activeM.unit}
              </div>
            </div>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: 0.8,
              padding: '6px 10px', borderRadius: 99,
              background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : '#0B0B0B',
              color: '#FAFAFA',
            }}>VIEW →</div>
          </button>
        )}
      </div>

      {/* Measurement list */}
      <div style={{ margin: '20px 20px 0', fontFamily: "'Space Grotesk', system-ui" }}>
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          marginBottom: 4, padding: '0 4px',
        }}>
          <div>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: 1.4, color: ink2,
              textTransform: 'uppercase', marginBottom: 2,
            }}>{side === 'front' ? 'FRONT' : 'BACK'} MEASUREMENTS</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: ink, letterSpacing: -0.3 }}>
              All sites
            </div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: ink2 }}>
            UPDATED 2D AGO
          </div>
        </div>
        <div>
          {listMeasurements.map((m, i) => (
            <MeasurementRow key={m.id} measurement={m} theme={theme}
                            onClick={() => setSheetId(m.id)}
                            isLast={i === listMeasurements.length - 1} />
          ))}
        </div>
      </div>

      {/* Coaching note */}
      <div style={{
        margin: '20px 20px 0',
        background: theme === 'dark' ? '#161616' : '#0B0B0B',
        color: '#FAFAFA',
        borderRadius: 20, padding: '18px 18px',
        fontFamily: "'Space Grotesk', system-ui",
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: 99,
          background: 'radial-gradient(circle, rgba(216,255,61,0.25), transparent 70%)',
        }} />
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: 1.4, color: '#D8FF3D',
          textTransform: 'uppercase', marginBottom: 8, position: 'relative',
        }}>● SIGNAL · 90D RECAP</div>
        <div style={{
          fontSize: 18, fontWeight: 700, letterSpacing: -0.3, lineHeight: 1.25,
          marginBottom: 12, position: 'relative',
        }}>
          Lean mass up, waist down. <span style={{ color: '#D8FF3D' }}>Textbook recomp.</span>
        </div>
        <div style={{
          fontSize: 13, fontWeight: 500, lineHeight: 1.5,
          color: 'rgba(255,255,255,0.7)', position: 'relative',
        }}>
          Your chest and arms are trending up while waist is down 5.4 cm. Hold protein at 1.8 g/kg and the current lifting volume to keep the curve.
        </div>
      </div>

      {/* Tab bar */}
      <TabBar theme={theme} />

      {/* Sheet */}
      {sheetId && (
        <MeasurementSheet measurement={byId(sheetId)} theme={theme} onClose={() => setSheetId(null)} />
      )}
    </div>
  );
}

window.BodyMetricsScreen = BodyMetricsScreen;
window.MEASUREMENTS = MEASUREMENTS;
