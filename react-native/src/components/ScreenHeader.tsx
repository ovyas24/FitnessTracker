import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors, th, type Theme } from '../theme/colors';

interface Props {
  theme: Theme;
  onThemeToggle: () => void;
}

export default function ScreenHeader({ theme, onThemeToggle }: Props) {
  const t = th(theme);
  const accent = Colors.accent;

  return (
    <View style={styles.container}>
      {/* Top control row */}
      <View style={styles.controlRow}>
        {/* Back button */}
        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: t.pillBg }]}>
          <Svg width={10} height={16} viewBox="0 0 10 16">
            <Path d="M8 2 L2 8 L8 14" stroke={t.ink} strokeWidth={1.8}
              fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>

        {/* Period pill */}
        <View style={[styles.periodPill, { backgroundColor: t.pillBg }]}>
          <View style={styles.accentDot} />
          <Text style={[styles.periodText, { color: t.ink }]}>LAST 90 DAYS</Text>
          <Svg width={8} height={8} viewBox="0 0 8 8">
            <Path d="M1 2 L4 6 L7 2" stroke={t.ink} strokeWidth={1.5}
              fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </View>

        {/* Add / theme toggle button */}
        <TouchableOpacity
          onPress={onThemeToggle}
          style={[styles.iconBtn, { backgroundColor: t.ink }]}
        >
          <Svg width={14} height={14} viewBox="0 0 14 14">
            <Path d="M7 2 L7 12 M2 7 L12 7" stroke={t.surface} strokeWidth={2} strokeLinecap="round" />
          </Svg>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={[styles.eyebrow, { color: t.ink2 }]}>MODULE C · BODY METRICS</Text>
      <Text style={[styles.title, { color: t.ink }]}>Your body,{'\n'}this quarter.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 4,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
  },
  accentDot: {
    width: 6,
    height: 6,
    backgroundColor: '#D8FF3D',
    borderRadius: 99,
  },
  periodText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 38,
    fontWeight: '700',
    letterSpacing: -1.5,
    lineHeight: 42,
  },
  // Used inside iconBtn for theme toggle icon
  surface: {},
});

// Expose surface color helper for icon inside dark button
ScreenHeader.displayName = 'ScreenHeader';
