import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, Modal, Animated,
  ScrollView, StyleSheet, useWindowDimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Svg, {
  Path, Circle, Line, Text as SvgText, Defs, LinearGradient, Stop,
} from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Colors, th, type Theme } from '../theme/colors';
import type { Measurement, RangeKey } from '../data/measurements';

const RANGES: RangeKey[] = ['1W', '1M', '3M', '6M', '1Y'];

// Chart layout constants
const CW = 320, CH = 180, PAD_L = 8, PAD_R = 8, PAD_T = 16, PAD_B = 28;
const INNER_W = CW - PAD_L - PAD_R;
const INNER_H = CH - PAD_T - PAD_B;

interface Props {
  measurement: Measurement;
  theme: Theme;
  onClose: () => void;
}

export default function MeasurementSheet({ measurement, theme, onClose }: Props) {
  const [range, setRange] = React.useState<RangeKey>('3M');
  const slideAnim = useRef(new Animated.Value(900)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const { width: screenW } = useWindowDimensions();

  const t = th(theme);
  const accent = Colors.accent;
  const coral  = Colors.coral;

  useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 0, damping: 22, stiffness: 220, useNativeDriver: true }),
      Animated.timing(fadeAnim,  { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 900, duration: 260, useNativeDriver: true }),
      Animated.timing(fadeAnim,  { toValue: 0,   duration: 200, useNativeDriver: true }),
    ]).start(onClose);
  };

  // Data slice
  const data = measurement.history[range] || measurement.history['3M'];
  const ys = data.map(d => d.v);
  const minY = Math.min(...ys) - (Math.max(...ys) - Math.min(...ys)) * 0.25;
  const maxY = Math.max(...ys) + (Math.max(...ys) - Math.min(...ys)) * 0.15;
  const xFor = (i: number) => PAD_L + (i / (data.length - 1)) * INNER_W;
  const yFor = (v: number) => PAD_T + (1 - (v - minY) / (maxY - minY)) * INNER_H;

  const linePath  = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(d.v)}`).join(' ');
  const areaPath  = `${linePath} L ${xFor(data.length - 1)} ${PAD_T + INNER_H} L ${xFor(0)} ${PAD_T + INNER_H} Z`;

  const current  = data[data.length - 1].v;
  const start    = data[0].v;
  const delta    = current - start;
  const positive = measurement.lowerIsBetter ? delta < 0 : delta > 0;

  const deltaColor = positive ? '#0B0B0B' : coral;
  const deltaBg    = positive ? accent : 'rgba(255,90,77,0.15)';
  const deltaText  = `${delta > 0 ? '+' : ''}${delta.toFixed(1)} ${measurement.unit}`;

  const chartW = Math.min(screenW - 40, CW);
  const lineColor = theme === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(11,11,11,0.08)';

  const lowVal  = Math.min(...ys).toFixed(1);
  const avgVal  = (ys.reduce((a, b) => a + b, 0) / ys.length).toFixed(1);
  const highVal = Math.max(...ys).toFixed(1);

  return (
    <Modal transparent visible animationType="none" onRequestClose={handleClose}>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View style={[StyleSheet.absoluteFillObject, styles.backdrop, { opacity: fadeAnim }]} />
      </TouchableWithoutFeedback>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          { backgroundColor: t.surface, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Drag handle */}
        <View style={styles.handleRow}>
          <View style={[styles.handle, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(11,11,11,0.18)' }]} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <View>
              <Text style={[styles.sheetEyebrow, { color: t.ink2 }]}>{measurement.eyebrow}</Text>
              <Text style={[styles.sheetTitle, { color: t.ink }]}>{measurement.name}</Text>
            </View>
            <TouchableOpacity onPress={handleClose}
              style={[styles.closeBtn, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(11,11,11,0.06)' }]}>
              <Svg width={12} height={12} viewBox="0 0 12 12">
                <Path d="M2 2 L10 10 M10 2 L2 10" stroke={t.ink} strokeWidth={1.8} strokeLinecap="round" />
              </Svg>
            </TouchableOpacity>
          </View>

          {/* Current value */}
          <View style={styles.currentRow}>
            <Text style={[styles.currentValue, { color: t.ink }]}>{current.toFixed(1)}</Text>
            <Text style={[styles.currentUnit, { color: t.ink2 }]}>{measurement.unit}</Text>
          </View>

          {/* Delta chip */}
          <View style={styles.deltaRow}>
            <View style={[styles.deltaChip, { backgroundColor: deltaBg }]}>
              <Svg width={10} height={10} viewBox="0 0 10 10"
                style={{ transform: [{ rotate: delta < 0 ? '180deg' : '0deg' }] }}>
                <Path d="M5 2 L5 8 M2 5 L5 2 L8 5" stroke={deltaColor}
                  strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <Text style={[styles.deltaText, { color: deltaColor }]}>{deltaText}</Text>
            </View>
            <Text style={[styles.vsText, { color: t.ink2 }]}>vs {range} ago</Text>
          </View>

          {/* Chart */}
          <View style={{ alignItems: 'center', marginTop: 4 }}>
            <Svg width={chartW} height={CH} viewBox={`0 0 ${CW} ${CH}`}>
              <Defs>
                <LinearGradient id={`area-${measurement.id}`} x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor={accent} stopOpacity={0.35} />
                  <Stop offset="100%" stopColor={accent} stopOpacity={0} />
                </LinearGradient>
              </Defs>
              {/* Gridlines */}
              {[0, 0.33, 0.66, 1].map(t => {
                const y = PAD_T + t * INNER_H;
                return <Line key={t} x1={PAD_L} y1={y} x2={CW - PAD_R} y2={y}
                  stroke={lineColor} strokeWidth={1} />;
              })}
              {/* Area fill */}
              <Path d={areaPath} fill={`url(#area-${measurement.id})`} />
              {/* Line */}
              <Path d={linePath} fill="none" stroke={accent} strokeWidth={3}
                strokeLinecap="round" strokeLinejoin="round" />
              {/* Dots */}
              {data.map((d, i) => (
                <Circle key={i} cx={xFor(i)} cy={yFor(d.v)} r={2.5}
                  fill={t.surface} stroke={accent} strokeWidth={1.5} />
              ))}
              {/* Last dot (current) emphasized */}
              <Circle cx={xFor(data.length - 1)} cy={yFor(data[data.length - 1].v)} r={6}
                fill={accent} stroke={t.surface} strokeWidth={3} />
              <Circle cx={xFor(data.length - 1)} cy={yFor(data[data.length - 1].v)} r={11}
                fill="none" stroke={accent} strokeOpacity={0.35} strokeWidth={1} />
              {/* X labels */}
              {data.map((d, i) => {
                if (data.length > 6 && i % 2 !== 0 && i !== data.length - 1) return null;
                return (
                  <SvgText key={i} x={xFor(i)} y={CH - 8} textAnchor="middle"
                    fontSize={9} fontWeight="600" letterSpacing={0.8} fill={t.ink2}>
                    {d.l}
                  </SvgText>
                );
              })}
            </Svg>
          </View>

          {/* Range tabs */}
          <View style={[styles.rangeTabs, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(11,11,11,0.045)' }]}>
            {RANGES.map(r => (
              <TouchableOpacity
                key={r}
                style={[
                  styles.rangeTab,
                  r === range && { backgroundColor: theme === 'dark' ? '#FAFAFA' : '#0B0B0B' },
                ]}
                onPress={() => { setRange(r); Haptics.selectionAsync(); }}
              >
                <Text style={[
                  styles.rangeLabel,
                  { color: r === range ? (theme === 'dark' ? '#0B0B0B' : '#FAFAFA') : t.ink },
                ]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Stats: low / avg / high */}
          <View style={[styles.statsRow, { borderColor: lineColor }]}>
            {[
              { label: 'LOW',  value: lowVal },
              { label: 'AVG',  value: avgVal },
              { label: 'HIGH', value: highVal },
            ].map((s, i) => (
              <View key={s.label} style={[
                styles.statCell,
                { backgroundColor: t.surface },
                i > 0 && { borderLeftWidth: 1, borderLeftColor: lineColor },
              ]}>
                <Text style={[styles.statLabel, { color: t.ink2 }]}>{s.label}</Text>
                <Text style={[styles.statValue, { color: t.ink }]}>
                  {s.value}
                  <Text style={[styles.statUnit, { color: t.ink2 }]}> {measurement.unit}</Text>
                </Text>
              </View>
            ))}
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={[styles.cta, { backgroundColor: theme === 'dark' ? accent : '#0B0B0B' }]}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
          >
            <Svg width={14} height={14} viewBox="0 0 14 14">
              <Path d="M7 2 L7 12 M2 7 L12 7"
                stroke={theme === 'dark' ? '#0B0B0B' : '#FAFAFA'}
                strokeWidth={2} strokeLinecap="round" />
            </Svg>
            <Text style={[styles.ctaText, { color: theme === 'dark' ? '#0B0B0B' : '#FAFAFA' }]}>
              LOG NEW ENTRY
            </Text>
          </TouchableOpacity>

          <View style={{ height: 20 }} />
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 34,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.18,
    shadowRadius: 40,
    elevation: 20,
  },
  handleRow: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  handle: {
    width: 40, height: 5, borderRadius: 99,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sheetEyebrow: {
    fontSize: 11, fontWeight: '700', letterSpacing: 1.4,
    textTransform: 'uppercase', marginBottom: 6,
  },
  sheetTitle: {
    fontSize: 28, fontWeight: '700', letterSpacing: -0.5, lineHeight: 30,
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 99,
    alignItems: 'center', justifyContent: 'center',
  },
  currentRow: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginBottom: 4,
  },
  currentValue: {
    fontSize: 56, fontWeight: '700', letterSpacing: -2, lineHeight: 58,
  },
  currentUnit: {
    fontSize: 18, fontWeight: '500', marginBottom: 6,
  },
  deltaRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18,
  },
  deltaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99,
  },
  deltaText: {
    fontSize: 12, fontWeight: '700', letterSpacing: 0.2,
  },
  vsText: {
    fontSize: 12, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase',
  },
  rangeTabs: {
    flexDirection: 'row', gap: 4, padding: 4,
    marginTop: 14, marginBottom: 18, borderRadius: 14,
  },
  rangeTab: {
    flex: 1, height: 34, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  rangeLabel: {
    fontSize: 13, fontWeight: '700', letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    borderWidth: 1, borderRadius: 16,
    overflow: 'hidden', marginBottom: 18,
  },
  statCell: {
    flex: 1, paddingVertical: 14, paddingHorizontal: 10, alignItems: 'center',
  },
  statLabel: {
    fontSize: 10, fontWeight: '700', letterSpacing: 1.2,
    textTransform: 'uppercase', marginBottom: 4,
  },
  statValue: {
    fontSize: 20, fontWeight: '700', letterSpacing: -0.5,
  },
  statUnit: {
    fontSize: 11, fontWeight: '400',
  },
  cta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, height: 54, borderRadius: 16,
  },
  ctaText: {
    fontSize: 15, fontWeight: '700', letterSpacing: 0.5,
  },
});
