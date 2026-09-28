import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

import { useThemeColor } from '@/components/Themed';
import { Fonts } from '@/constants/Fonts';

type Props = {
  id: string;
  accent: string;
};

function Bar({ w, h = 5, color, opacity = 1 }: { w: number; h?: number; color: string; opacity?: number }) {
  return <View style={{ width: w, height: h, borderRadius: h / 2, backgroundColor: color, opacity }} />;
}

function Pill({ color, opacity = 1, dashed = false }: { color: string; opacity?: number; dashed?: boolean }) {
  return (
    <View
      style={[
        styles.pill,
        dashed
          ? { borderWidth: 1.5, borderStyle: 'dashed', borderColor: color }
          : { backgroundColor: color, opacity },
      ]}>
      {!dashed && <Bar w={22} h={4} color="#fff" />}
    </View>
  );
}

function Mountains({ children }: { children?: ReactNode }) {
  return (
    <LinearGradient colors={['#3B2A8C', '#F0785A']} style={styles.scene}>
      <View style={styles.sun} />
      <View style={[styles.triangle, { left: 4, borderBottomColor: '#1F1A5E' }]} />
      <View style={[styles.triangle, { left: 30, borderBottomColor: '#2C2478' }]} />
      {children}
    </LinearGradient>
  );
}

// dibujo simple para cada componente; a los que no tienen uno propio les toca la barra genérica
function drawing(id: string, c: string, line: string): ReactNode {
  switch (id) {
    case 'view':
      return <View style={[styles.dashedBox, { borderColor: c, backgroundColor: `${c}22` }]} />;
    case 'safeareaview':
      return (
        <View style={[styles.phone, { borderColor: c, backgroundColor: `${c}33` }]}>
          <Bar w={14} h={4} color={c} />
        </View>
      );
    case 'scrollview':
      return (
        <View style={styles.row}>
          <View style={{ gap: 5 }}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={[styles.block, { backgroundColor: `${c}55` }]} />
            ))}
          </View>
          <Bar w={4} h={34} color={c} />
        </View>
      );
    case 'keyboardavoidingview':
      return (
        <View style={{ gap: 6, alignItems: 'center' }}>
          <View style={[styles.input, { borderColor: c }]} />
          {[0, 1].map((r) => (
            <View key={r} style={styles.row}>
              {[0, 1, 2, 3, 4, 5].map((k) => (
                <View key={k} style={[styles.key, { backgroundColor: line }]} />
              ))}
            </View>
          ))}
        </View>
      );
    case 'text':
      return (
        <View style={styles.row}>
          <Text style={[styles.aa, { color: c }]}>Aa</Text>
          <View style={{ gap: 5 }}>
            <Bar w={20} color={line} />
            <Bar w={14} color={line} />
          </View>
        </View>
      );
    case 'image':
      return <Mountains />;
    case 'imagebackground':
      return (
        <Mountains>
          <View style={styles.overlayBar}>
            <Bar w={30} h={4} color="#fff" />
          </View>
        </Mountains>
      );
    case 'statusbar':
      return (
        <View style={styles.statusBar}>
          <Bar w={12} h={4} color={c} />
          <View style={styles.row}>
            <View style={[styles.dot, { backgroundColor: c }]} />
            <View style={[styles.dot, { backgroundColor: c }]} />
            <View style={[styles.battery, { borderColor: c }]} />
          </View>
        </View>
      );
    case 'textinput':
      return (
        <View style={[styles.input, { borderColor: c, width: 54, height: 22, paddingLeft: 8 }]}>
          <Bar w={2} h={11} color={c} />
        </View>
      );
    case 'switch':
      return (
        <View style={[styles.switchTrack, { backgroundColor: c }]}>
          <View style={styles.knob} />
        </View>
      );
    case 'button':
    case 'pressable':
      return <Pill color={c} />;
    case 'touchableopacity':
      return (
        <View style={{ gap: 6 }}>
          <Pill color={c} />
          <Pill color={c} opacity={0.35} />
        </View>
      );
    case 'touchablehighlight':
      return (
        <View>
          <Pill color={c} />
          <View style={styles.highlight} />
        </View>
      );
    case 'touchablewithoutfeedback':
      return <Pill color={c} dashed />;
    case 'flatlist':
    case 'sectionlist':
      return (
        <View style={{ gap: 6 }}>
          {id === 'sectionlist' && <Bar w={22} h={4} color={c} />}
          {[0, 1, 2].map((i) => (
            <View key={i} style={styles.row}>
              <View style={[styles.dot, { backgroundColor: c }]} />
              <Bar w={36} color={line} />
            </View>
          ))}
        </View>
      );
    case 'modal':
      return (
        <View style={styles.modalBg}>
          <View style={[styles.modalCard, { borderColor: c, backgroundColor: `${c}33` }]}>
            <Bar w={24} h={4} color={c} />
          </View>
        </View>
      );
    case 'activityindicator':
      return <View style={[styles.spinner, { borderColor: `${c}33`, borderTopColor: c }]} />;
    case 'refreshcontrol':
      return (
        <View style={{ alignItems: 'center', gap: 6 }}>
          <View style={[styles.refreshCircle, { borderColor: c }]}>
            <Ionicons name="arrow-down" size={12} color={c} />
          </View>
          <Bar w={34} color={line} />
        </View>
      );
    default:
      return <Bar w={30} color={c} />;
  }
}

export default function ComponentThumbnail({ id, accent }: Props) {
  const surfaceAlt = useThemeColor({}, 'surfaceAlt');
  const border = useThemeColor({}, 'border');
  const muted = useThemeColor({}, 'textMuted');

  return (
    <View style={[styles.box, { backgroundColor: surfaceAlt, borderColor: border }]}>
      {drawing(id, accent, `${muted}88`)}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 76,
    height: 64,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pill: { width: 50, height: 20, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  dashedBox: { width: 52, height: 38, borderRadius: 6, borderWidth: 1.5, borderStyle: 'dashed' },
  phone: { width: 38, height: 46, borderRadius: 8, borderWidth: 1.5, alignItems: 'center', paddingTop: 3 },
  block: { width: 36, height: 9, borderRadius: 4 },
  input: { width: 54, height: 12, borderRadius: 6, borderWidth: 1.5, justifyContent: 'center' },
  key: { width: 6, height: 6, borderRadius: 2 },
  aa: { fontFamily: Fonts.bold, fontSize: 24 },
  scene: { width: '100%', height: '100%', justifyContent: 'flex-end' },
  sun: { position: 'absolute', top: 8, right: 10, width: 12, height: 12, borderRadius: 6, backgroundColor: '#FFC48A' },
  triangle: {
    position: 'absolute',
    bottom: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  overlayBar: { position: 'absolute', left: 8, bottom: 8 },
  statusBar: { width: 56, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dot: { width: 7, height: 7, borderRadius: 3.5 },
  battery: { width: 14, height: 8, borderRadius: 2, borderWidth: 1.5 },
  switchTrack: { width: 42, height: 24, borderRadius: 12, padding: 3, alignItems: 'flex-end' },
  knob: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#fff' },
  highlight: { position: 'absolute', left: 0, top: 0, width: 25, height: 20, borderTopLeftRadius: 8, borderBottomLeftRadius: 8, backgroundColor: 'rgba(255,255,255,0.28)' },
  modalBg: { width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'flex-end', alignItems: 'center' },
  modalCard: { width: 54, height: 30, borderTopLeftRadius: 10, borderTopRightRadius: 10, borderWidth: 1.5, borderBottomWidth: 0, alignItems: 'center', paddingTop: 8 },
  spinner: { width: 30, height: 30, borderRadius: 15, borderWidth: 3 },
  refreshCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
});
