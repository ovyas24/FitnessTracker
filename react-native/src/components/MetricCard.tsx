import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors, th, type Theme } from '../theme/colors';
import type { Measurement } from '../data/measurements';
import Spark from './Spark';

interface Props {
  measurement: Measurement;
  theme: Theme;
  accentCard?: boolean;
  onPress: () => void;
}

export default function MetricCard({ measurement, theme, accentCard = false, onPress }: Props) {
  const t = th(theme);
  const accent = Colors.accent;
  const coral = Colors.coral;

  const data = measurement.history['3M'];
  const start = data[0].v;
  const current = data[data.length - 1].v;
  const delta = current - start;
  const positive = measurement.lowerIsBetter ? delta < 0 : delta > 0;

  const bg         = accentCard ? accent : t.surface;
  const fg         = accentCard ? '#0B0B0B' : t.ink;
  const fg2        = accentCard ? 'rgba(11,11,11,0.6)' : t.ink2;
  const sparkColor = accentCard ? '#0B0B0B' : (positive ? t.ink : coral);
  const chipBg     = accentCard ? 'rgba(11,11,11,0.85)' : (positive ? t.ink : 'rgba(255,90,77,0.12)');
  const chipColor  = accentCard
    ? accent
    : (positive ? (theme === 'dark' ? '#0B0B0B' : '#FAFAFA') : coral);

  return (
    <TouchableOpacity onPress={onPress} style={[styles.card, { backgroundColor: bg }]} activeOpacity={0.82}>
      {/* Top row: eyebrow + delta chip */}
      <View style={styles.topRow}>
        <Text style={[styles.eyebrow, { color: fg2 }]}>{measurement.eyebrow}</Text>
        <View style={[styles.chip, { backgroundColor: chipBg }]}>
          <Svg
            width={8} height={8} viewBox="0 0 8 8"
            style={{ transform: [{ rotate: delta < 0 ? '180deg' : '0deg' }] }}
          >
            <Path
              d="M4 1.5 L4 6.5 M1.5 4 L4 1.5 L6.5 4"
              stroke={chipColor} strokeWidth={1.2} fill="none"
              strokeLinecap="round" strokeLinejoin="round"
            />
          </Svg>
          <Text style={[styles.chipText, { color: chipColor }]}>
            {delta > 0 ? '+' : ''}{delta.toFixed(1)}
          </Text>
        </View>
      </View>

      {/* Value */}
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: fg }]}>{current.toFixed(1)}</Text>
        <Text style={[styles.unit, { color: fg2 }]}>{measurement.unit}</Text>
      </View>

      <View style={{ flex: 1 }} />

      {/* Bottom row: name + sparkline */}
      <View style={styles.bottomRow}>
        <Text style={[styles.nameLabel, { color: fg2 }]}>
          {measurement.name.toUpperCase()}
        </Text>
        <Spark data={data} color={sparkColor} w={80} h={28} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    paddingBottom: 14,
    minHeight: 130,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 99,
  },
  chipText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  value: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 40,
  },
  unit: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  nameLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
