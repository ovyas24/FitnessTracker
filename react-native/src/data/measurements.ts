export interface DataPoint {
  v: number;
  t: number;
  l: string;
}

export type RangeKey = '1W' | '1M' | '3M' | '6M' | '1Y';

export interface Measurement {
  id: string;
  name: string;
  unit: string;
  eyebrow: string;
  current: number;
  lowerIsBetter: boolean;
  history: Record<RangeKey, DataPoint[]>;
}

function genHistory(
  start: number,
  end: number,
  weeks: number,
  noiseAmp = 0.4,
): Record<RangeKey, DataPoint[]> {
  function series(n: number, sIdx: number, eIdx: number) {
    const arr: { v: number; t: number }[] = [];
    for (let i = 0; i < n; i++) {
      const t = sIdx + (eIdx - sIdx) * (i / (n - 1));
      const base = start + (end - start) * (t / weeks);
      const noise =
        Math.sin(t * 0.7 + sIdx) * noiseAmp + Math.cos(t * 1.3) * noiseAmp * 0.6;
      arr.push({ v: parseFloat((base + noise).toFixed(1)), t });
    }
    return arr;
  }

  function labelPoints(s: { v: number; t: number }[], units: string): DataPoint[] {
    return s.map(p => {
      const wksAgo = weeks - p.t;
      let l: string;
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

  return {
    '1W': labelPoints(series(7, weeks - 1, weeks), 'D'),
    '1M': labelPoints(series(8, weeks - 4.33, weeks), 'W'),
    '3M': labelPoints(series(12, weeks - 13, weeks), 'W'),
    '6M': labelPoints(series(12, weeks - 26, weeks), 'M'),
    '1Y': labelPoints(series(12, 0, weeks), 'M'),
  };
}

export const MEASUREMENTS: Measurement[] = [
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

export const byId = (id: string): Measurement | undefined =>
  MEASUREMENTS.find(m => m.id === id);
