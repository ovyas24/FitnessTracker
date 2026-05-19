import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors, th, type Theme } from '../theme/colors';

const TABS = [
  {
    id: 'train', label: 'Train',
    icon: (c: string) => (
      <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
        <Path d="M2 11 L4 11 M6 7 L6 15 M9 5 L9 17 M13 5 L13 17 M16 7 L16 15 M18 11 L20 11"
          stroke={c} strokeWidth={1.8} strokeLinecap="round" />
      </Svg>
    ),
  },
  {
    id: 'eat', label: 'Eat',
    icon: (c: string) => (
      <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
        <Circle cx={11} cy={11} r={8} stroke={c} strokeWidth={1.8} />
        <Path d="M11 4 L11 11 L16 14" stroke={c} strokeWidth={1.8} strokeLinecap="round" />
      </Svg>
    ),
  },
  {
    id: 'body', label: 'Body', active: true,
    icon: (c: string) => (
      <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
        <Circle cx={11} cy={5} r={2.5} stroke={c} strokeWidth={1.8} />
        <Path d="M11 8 L11 14 M11 14 L7 19 M11 14 L15 19 M7 11 L15 11"
          stroke={c} strokeWidth={1.8} strokeLinecap="round" />
      </Svg>
    ),
  },
  {
    id: 'you', label: 'You',
    icon: (c: string) => (
      <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
        <Circle cx={11} cy={7} r={3.5} stroke={c} strokeWidth={1.8} />
        <Path d="M3 19 C3 14.5 6.5 12 11 12 C15.5 12 19 14.5 19 19"
          stroke={c} strokeWidth={1.8} strokeLinecap="round" />
      </Svg>
    ),
  },
];

export default function TabBar({ theme }: { theme: Theme }) {
  const t = th(theme);

  return (
    <View style={[
      styles.bar,
      {
        backgroundColor: t.tabBar,
        borderColor: t.tabBorder,
        shadowColor: theme === 'dark' ? '#000' : '#000',
        shadowOpacity: theme === 'dark' ? 0.4 : 0.06,
      },
    ]}>
      {TABS.map(tab => {
        const iconColor = tab.active ? t.ink : t.ink2;
        return (
          <TouchableOpacity key={tab.id} style={styles.tab} activeOpacity={0.7}>
            {tab.active && <View style={styles.activeBar} />}
            {tab.icon(iconColor)}
            <Text style={[styles.label, { color: iconColor }]}>{tab.label.toUpperCase()}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 18,
    flexDirection: 'row',
    borderRadius: 28,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 20,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
  },
  activeBar: {
    width: 28,
    height: 3,
    backgroundColor: '#D8FF3D',
    borderRadius: 99,
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
