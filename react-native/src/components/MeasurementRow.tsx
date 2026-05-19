import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors, th, type Theme } from '../theme/colors';
import type { Measurement } from '../data/measurements';
import Spark from './Spark';

interface Props {
  measurement: Measurement;
  theme: Theme;
  onPress: () => void;
  isLast?: boolean;
}

export default function MeasurementRow({ measurement, theme, onPress, isLast }: Props) {
  const t = th(theme);
  const accent = Colors.accent;
  const coral = Colors.coral;

  const data = measurement.history['3M'];
  const delta = data[data.length - 1].v - data[0].v;
  const current = data[data.length - 1].v;
  const positive = measurement.lowerIsBetter ? delta < 0 : delta > 0;
  const chipBg    = positive ? accent : 'rgba(255,90,77,0.12)';
  const chipColor = positive ? '#0B0B0B' : coral;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.row, !isLast && { borderBottomWidth: 1, borderBottomColor: t.sep }]}
      activeOpacity={0.7}
    >
      {/* Name + eyebrow */}
      <View style={{ flex: 1 }}>
        <Text style={[styles.name, { color: t.ink }]}>{measurement.name}</Text>
        <Text style={[styles.eyebrow, { color: t.ink2 }]}>{measurement.eyebrow}</Text>
      </View>

      {/* Mini sparkline */}
      <Spark data={data} color={positive ? t.ink : coral} w={64} h={22} />

      {/* Value + delta */}
      <View style={styles.right}>
        <Text style={[styles.value, { color: t.ink }]}>
          {current.toFixed(1)}
          <Text style={[styles.unit, { color: t.ink2 }]}> {measurement.unit}</Text>
        </Text>
        <View style={[styles.chip, { backgroundColor: chipBg }]}>
          <Svg
            width={7} height={7} viewBox="0 0 8 8"
            style={{ transform: [{ rotate: delta < 0 ? '180deg' : '0deg' }] }}
          >
            <Path
              d="M4 1.5 L4 6.5 M1.5 4 L4 1.5 L6.5 4"
              stroke={chipColor} strokeWidth={1.4} fill="none"
              strokeLinecap="round" strokeLinejoin="round"
            />
          </Svg>
          <Text style={[styles.chipText, { color: chipColor }]}>
            {delta > 0 ? '+' : ''}{delta.toFixed(1)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  right: {
    minWidth: 70,
    alignItems: 'flex-end',
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 22,
  },
  unit: {
    fontSize: 11,
    fontWeight: '500',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 99,
    marginTop: 4,
  },
  chipText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
