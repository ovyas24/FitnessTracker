import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import type { DataPoint } from '../data/measurements';

interface Props {
  data: DataPoint[];
  color?: string;
  w?: number;
  h?: number;
}

export default function Spark({ data, color = '#0B0B0B', w = 80, h = 28 }: Props) {
  const ys = data.map(d => d.v);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const range = Math.max(0.0001, maxY - minY);
  const pad = 2;

  const xFor = (i: number) => pad + (i / (data.length - 1)) * (w - pad * 2);
  const yFor = (v: number) => pad + (1 - (v - minY) / range) * (h - pad * 2);

  const d = data
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(pt.v)}`)
    .join(' ');

  return (
    <Svg width={w} height={h}>
      <Path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle
        cx={xFor(data.length - 1)}
        cy={yFor(data[data.length - 1].v)}
        r={2.5}
        fill={color}
      />
    </Svg>
  );
}
