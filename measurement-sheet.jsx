// MeasurementSheet — bottom sheet with line chart showing historical progress
// for a single measurement (chest, arm, waist, hips, etc.)

const RANGES = ['1W', '1M', '3M', '6M', '1Y'];

function MeasurementSheet({ measurement, theme = 'light', onClose }) {
  const [range, setRange] = React.useState('3M');
  if (!measurement) return null;

  const ink = theme === 'dark' ? '#FAFAFA' : '#0B0B0B';
  const ink2 = theme === 'dark' ? 'rgba(255,255,255,0.55)' : 'rgba(11,11,11,0.55)';
  const surface = theme === 'dark' ? '#161616' : '#FFFFFF';
  const line = theme === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(11,11,11,0.08)';
  const accent = '#D8FF3D';
  const onAccent = '#0B0B0B';
  const coral = '#FF5A4D';

  // Pick the right data slice based on range
  const data = measurement.history[range] || measurement.history['3M'];

  // Chart geometry
  const W = 340, H = 180, padL = 8, padR = 8, padT = 16, padB = 28;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const ys = data.map(d => d.v);
  const minY = Math.min(...ys) - (Math.max(...ys) - Math.min(...ys)) * 0.25;
  const maxY = Math.max(...ys) + (Math.max(...ys) - Math.min(...ys)) * 0.15;
  const xFor = (i) => padL + (i / (data.length - 1)) * innerW;
  const yFor = (v) => padT + (1 - (v - minY) / (maxY - minY)) * innerH;
  const path = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(d.v)}`).join(' ');
  const areaPath = `${path} L ${xFor(data.length - 1)} ${padT + innerH} L ${xFor(0)} ${padT + innerH} Z`;

  // current value + delta (period delta)
  const current = data[data.length - 1].v;
  const start = data[0].v;
  const delta = current - start;
  const positive = measurement.lowerIsBetter ? delta < 0 : delta > 0;
  const deltaColor = positive ? '#0B0B0B' : coral;
  const deltaBg = positive ? accent : 'rgba(255,90,77,0.15)';
  const deltaText = `${delta > 0 ? '+' : ''}${delta.toFixed(1)} ${measurement.unit}`;

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose}
           style={{
             position: 'absolute', inset: 0, zIndex: 30,
             background: 'rgba(0,0,0,0.4)',
             backdropFilter: 'blur(2px)',
             WebkitBackdropFilter: 'blur(2px)',
             animation: 'sheetFade 240ms ease-out',
           }} />
      {/* Sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 31,
        background: surface,
        borderRadius: '28px 28px 0 0',
        padding: '12px 20px 40px',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.18)',
        animation: 'sheetUp 320ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}>
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 14 }}>
          <div style={{
            width: 40, height: 5, borderRadius: 99,
            background: theme === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(11,11,11,0.18)',
          }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: 1.4,
              color: ink2, fontFamily: "'Space Grotesk', system-ui",
              marginBottom: 6, textTransform: 'uppercase',
            }}>
              {measurement.eyebrow}
            </div>
            <div style={{
              fontSize: 28, fontWeight: 700, color: ink,
              fontFamily: "'Space Grotesk', system-ui", letterSpacing: -0.5,
              lineHeight: 1,
            }}>{measurement.name}</div>
          </div>
          <button onClick={onClose}
                  style={{
                    width: 36, height: 36, borderRadius: 99,
                    background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(11,11,11,0.06)',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: ink,
                  }}>
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 2 L10 10 M10 2 L2 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Current value */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
          <span style={{
            fontSize: 56, fontWeight: 700, color: ink,
            fontFamily: "'Space Grotesk', system-ui",
            letterSpacing: -2, lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}>{current.toFixed(1)}</span>
          <span style={{
            fontSize: 18, fontWeight: 500, color: ink2,
            fontFamily: "'Space Grotesk', system-ui",
          }}>{measurement.unit}</span>
        </div>

        {/* Delta chip + range label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '4px 10px', borderRadius: 99,
            background: deltaBg,
            color: deltaColor,
            fontSize: 12, fontWeight: 700,
            fontFamily: "'Space Grotesk', system-ui",
            letterSpacing: 0.2,
            fontVariantNumeric: 'tabular-nums',
          }}>
            <svg width="10" height="10" viewBox="0 0 10 10" style={{ transform: delta < 0 ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              <path d="M5 2 L5 8 M2 5 L5 2 L8 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {deltaText}
          </span>
          <span style={{
            fontSize: 12, fontWeight: 600, color: ink2,
            fontFamily: "'Space Grotesk', system-ui",
            letterSpacing: 0.5, textTransform: 'uppercase',
          }}>vs {range} ago</span>
        </div>

        {/* Chart */}
        <div style={{ position: 'relative' }}>
          <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
            <defs>
              <linearGradient id={`area-${measurement.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
                <stop offset="100%" stopColor={accent} stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Horizontal gridlines */}
            {[0, 0.33, 0.66, 1].map(t => {
              const y = padT + t * innerH;
              return <line key={t} x1={padL} y1={y} x2={W - padR} y2={y} stroke={line} strokeWidth="1" />;
            })}
            {/* Area */}
            <path d={areaPath} fill={`url(#area-${measurement.id})`} />
            {/* Line */}
            <path d={path} fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {/* Inactive dots */}
            {data.map((d, i) => (
              <circle key={i} cx={xFor(i)} cy={yFor(d.v)} r="2.5"
                      fill={surface} stroke={accent} strokeWidth="1.5" />
            ))}
            {/* Last (current) dot — emphasized */}
            <circle cx={xFor(data.length - 1)} cy={yFor(data[data.length - 1].v)} r="6"
                    fill={accent} stroke={surface} strokeWidth="3" />
            <circle cx={xFor(data.length - 1)} cy={yFor(data[data.length - 1].v)} r="11"
                    fill="none" stroke={accent} strokeOpacity="0.35" strokeWidth="1" />
            {/* X axis labels */}
            {data.map((d, i) => {
              if (data.length > 12) {
                // sparse labels
                if (i % Math.ceil(data.length / 6) !== 0 && i !== data.length - 1) return null;
              } else {
                if (data.length > 6 && i % 2 !== 0 && i !== data.length - 1) return null;
              }
              return (
                <text key={i} x={xFor(i)} y={H - 8} textAnchor="middle"
                      fontSize="9" fontWeight="600" letterSpacing="0.8"
                      fontFamily="'Space Grotesk', system-ui"
                      fill={ink2}>{d.l}</text>
              );
            })}
          </svg>
        </div>

        {/* Range tabs */}
        <div style={{
          display: 'flex', gap: 4, padding: 4, marginTop: 14, marginBottom: 18,
          background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(11,11,11,0.045)',
          borderRadius: 14,
        }}>
          {RANGES.map(r => (
            <button key={r} onClick={() => setRange(r)}
                    style={{
                      flex: 1, height: 34, borderRadius: 10, border: 'none', cursor: 'pointer',
                      background: r === range ? (theme === 'dark' ? '#FAFAFA' : '#0B0B0B') : 'transparent',
                      color: r === range ? (theme === 'dark' ? '#0B0B0B' : '#FAFAFA') : ink,
                      fontFamily: "'Space Grotesk', system-ui",
                      fontWeight: 700, fontSize: 13, letterSpacing: 0.5,
                      transition: 'background 160ms, color 160ms',
                    }}>{r}</button>
          ))}
        </div>

        {/* Stat row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1,
          background: line, borderRadius: 16, overflow: 'hidden',
          marginBottom: 18,
        }}>
          {[
            { label: 'LOW', value: Math.min(...ys).toFixed(1) },
            { label: 'AVG', value: (ys.reduce((a,b)=>a+b,0)/ys.length).toFixed(1) },
            { label: 'HIGH', value: Math.max(...ys).toFixed(1) },
          ].map(s => (
            <div key={s.label} style={{
              background: surface, padding: '14px 10px', textAlign: 'center',
            }}>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: 1.2, color: ink2,
                fontFamily: "'Space Grotesk', system-ui",
                marginBottom: 4,
              }}>{s.label}</div>
              <div style={{
                fontSize: 20, fontWeight: 700, color: ink,
                fontFamily: "'Space Grotesk', system-ui",
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: -0.5,
              }}>{s.value}<span style={{ fontSize: 11, color: ink2, marginLeft: 2 }}>{measurement.unit}</span></div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button style={{
          width: '100%', height: 54, borderRadius: 16, border: 'none', cursor: 'pointer',
          background: theme === 'dark' ? accent : '#0B0B0B',
          color: theme === 'dark' ? onAccent : '#FAFAFA',
          fontFamily: "'Space Grotesk', system-ui",
          fontWeight: 700, fontSize: 15, letterSpacing: 0.5,
          textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 2 L7 12 M2 7 L12 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          Log new entry
        </button>
      </div>
    </>
  );
}

window.MeasurementSheet = MeasurementSheet;
