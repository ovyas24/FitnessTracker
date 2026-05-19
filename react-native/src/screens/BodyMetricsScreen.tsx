import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';

import { Colors, th, type Theme } from '../theme/colors';
import { MEASUREMENTS, byId } from '../data/measurements';
import ScreenHeader from '../components/ScreenHeader';
import MetricCard from '../components/MetricCard';
import HumanBody from '../components/HumanBody';
import MeasurementRow from '../components/MeasurementRow';
import MeasurementSheet from '../components/MeasurementSheet';
import TabBar from '../components/TabBar';

const FRONT_LIST = ['chest', 'arm-l', 'arm-r', 'waist', 'hips'];
const BACK_LIST  = ['back', 'arm-l', 'arm-r', 'glutes'];

interface Props {
  theme: Theme;
  onThemeToggle: () => void;
}

export default function BodyMetricsScreen({ theme, onThemeToggle }: Props) {
  const [side, setSide]     = useState<'front' | 'back'>('front');
  const [activeId, setActiveId] = useState('chest');
  const [sheetId, setSheetId]   = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const t = th(theme);
  const accent = Colors.accent;
  const coral  = Colors.coral;

  const listIds = side === 'front' ? FRONT_LIST : BACK_LIST;
  const activeM = byId(activeId);
  const sheetM  = sheetId ? byId(sheetId) : null;

  const handlePinSelect = (id: string) => {
    if (id === activeId) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setSheetId(id);
    } else {
      Haptics.selectionAsync();
      setActiveId(id);
    }
  };

  const handleSideChange = (s: 'front' | 'back') => {
    Haptics.selectionAsync();
    setSide(s);
    setActiveId(s === 'front' ? 'chest' : 'back');
  };

  return (
    <View style={[styles.root, { backgroundColor: t.bg }]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ScreenHeader theme={theme} onThemeToggle={onThemeToggle} />

        {/* Top metric cards */}
        <View style={styles.cardRow}>
          <MetricCard
            measurement={MEASUREMENTS[0]}
            theme={theme}
            accentCard
            onPress={() => setSheetId('weight')}
          />
          <MetricCard
            measurement={MEASUREMENTS[1]}
            theme={theme}
            onPress={() => setSheetId('bodyfat')}
          />
        </View>

        {/* Body projection card */}
        <View style={[styles.card, { backgroundColor: t.surface }]}>
          {/* Section header + side toggle */}
          <View style={styles.projectionHeader}>
            <View>
              <Text style={[styles.projectionEyebrow, { color: t.ink2 }]}>PROJECTION</Text>
              <Text style={[styles.projectionTitle, { color: t.ink }]}>Tap a point</Text>
            </View>
            {/* Front / Back toggle */}
            <View style={[styles.toggle, { backgroundColor: t.pillBg }]}>
              {(['front', 'back'] as const).map(s => (
                <TouchableOpacity
                  key={s}
                  onPress={() => handleSideChange(s)}
                  style={[
                    styles.toggleBtn,
                    s === side && { backgroundColor: t.ink },
                  ]}
                >
                  <Text style={[
                    styles.toggleLabel,
                    { color: s === side ? (theme === 'dark' ? '#0B0B0B' : '#FAFAFA') : t.ink },
                  ]}>
                    {s.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Human body SVG */}
          <HumanBody
            side={side}
            activeId={activeId}
            onSelect={handlePinSelect}
            theme={theme}
          />

          {/* Active stat preview bar */}
          {activeM && (
            <TouchableOpacity
              onPress={() => { setSheetId(activeId); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
              style={[styles.previewBar, { backgroundColor: theme === 'dark' ? 'rgba(216,255,61,0.08)' : 'rgba(11,11,11,0.04)' }]}
            >
              <View style={styles.previewIcon}>
                <Svg width={16} height={16} viewBox="0 0 16 16">
                  <Path d="M2 12 L6 8 L9 11 L14 4" stroke="#0B0B0B"
                    strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.previewEyebrow, { color: t.ink2 }]}>
                  SELECTED · {activeM.eyebrow}
                </Text>
                <Text style={[styles.previewName, { color: t.ink }]}>
                  {activeM.name} · {activeM.current.toFixed(1)} {activeM.unit}
                </Text>
              </View>
              <View style={[styles.viewBtn, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : '#0B0B0B' }]}>
                <Text style={styles.viewBtnText}>VIEW →</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Measurement list */}
        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <View>
              <Text style={[styles.listEyebrow, { color: t.ink2 }]}>
                {side === 'front' ? 'FRONT' : 'BACK'} MEASUREMENTS
              </Text>
              <Text style={[styles.listTitle, { color: t.ink }]}>All sites</Text>
            </View>
            <Text style={[styles.updatedText, { color: t.ink2 }]}>UPDATED 2D AGO</Text>
          </View>
          {listIds.map((id, i) => {
            const m = byId(id);
            if (!m) return null;
            return (
              <MeasurementRow
                key={id}
                measurement={m}
                theme={theme}
                onPress={() => setSheetId(id)}
                isLast={i === listIds.length - 1}
              />
            );
          })}
        </View>

        {/* Coaching signal card */}
        <View style={[styles.coachCard, { backgroundColor: t.coachBg }]}>
          {/* Glow blob — rendered as a simple View with borderRadius */}
          <View style={styles.coachGlow} />
          <Text style={styles.coachEyebrow}>● SIGNAL · 90D RECAP</Text>
          <Text style={styles.coachHeadline}>
            Lean mass up, waist down.{' '}
            <Text style={{ color: accent }}>Textbook recomp.</Text>
          </Text>
          <Text style={styles.coachBody}>
            Your chest and arms are trending up while waist is down 5.4 cm.
            Hold protein at 1.8 g/kg and the current lifting volume to keep the curve.
          </Text>
        </View>
      </ScrollView>

      {/* Tab bar (absolutely positioned) */}
      <TabBar theme={theme} />

      {/* Measurement detail sheet */}
      {sheetM && (
        <MeasurementSheet
          measurement={sheetM}
          theme={theme}
          onClose={() => setSheetId(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  cardRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 14,
  },

  card: {
    margin: 14,
    marginTop: 18,
    borderRadius: 24,
    padding: 18,
    paddingBottom: 12,
  },

  projectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    marginBottom: 6,
  },
  projectionEyebrow: {
    fontSize: 10, fontWeight: '700', letterSpacing: 1.4,
    textTransform: 'uppercase', marginBottom: 2,
  },
  projectionTitle: {
    fontSize: 16, fontWeight: '700', letterSpacing: -0.3,
  },

  toggle: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 99,
  },
  toggleBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 99,
  },
  toggleLabel: {
    fontSize: 12, fontWeight: '700', letterSpacing: 0.5,
  },

  previewBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    padding: 12,
    marginTop: 4,
  },
  previewIcon: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: '#D8FF3D',
    alignItems: 'center', justifyContent: 'center',
  },
  previewEyebrow: {
    fontSize: 10, fontWeight: '700', letterSpacing: 1.2,
    textTransform: 'uppercase', marginBottom: 1,
  },
  previewName: {
    fontSize: 15, fontWeight: '700', letterSpacing: -0.2,
  },
  viewBtn: {
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 99,
  },
  viewBtnText: {
    fontSize: 11, fontWeight: '700', letterSpacing: 0.8, color: '#FAFAFA',
  },

  listSection: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  listEyebrow: {
    fontSize: 10, fontWeight: '700', letterSpacing: 1.4,
    textTransform: 'uppercase', marginBottom: 2,
  },
  listTitle: {
    fontSize: 18, fontWeight: '700', letterSpacing: -0.3,
  },
  updatedText: {
    fontSize: 11, fontWeight: '700', letterSpacing: 0.5,
  },

  coachCard: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 18,
    overflow: 'hidden',
  },
  coachGlow: {
    position: 'absolute',
    top: -20, right: -20,
    width: 120, height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(216,255,61,0.20)',
  },
  coachEyebrow: {
    fontSize: 10, fontWeight: '700', letterSpacing: 1.4,
    color: '#D8FF3D', textTransform: 'uppercase', marginBottom: 8,
  },
  coachHeadline: {
    fontSize: 18, fontWeight: '700', letterSpacing: -0.3,
    lineHeight: 24, color: '#FAFAFA', marginBottom: 12,
  },
  coachBody: {
    fontSize: 13, fontWeight: '500', lineHeight: 20,
    color: 'rgba(255,255,255,0.7)',
  },
});
