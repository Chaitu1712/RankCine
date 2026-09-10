/**
 * RankCine Media Recording Studio (v2 Roadmap)
 * Status: Staged for v2 multimodal rollout (Direct binary audio/video reaction reviews).
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function MediaRecordScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="x" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MEDIA RECORDING STUDIO (V2)</Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconBox}>
          <Feather name="video" size={48} color="#777777" />
        </View>
        <Text style={styles.title}>MULTIMODAL STUDIO</Text>
        <Text style={styles.subtext}>
          Live audio/video reaction recording is staged for Rank Cine v2. Please submit evaluations via the Text Audit Engine in v1.
        </Text>

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>RETURN TO RATING CANVAS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#222222' },
  headerTitle: { color: 'white', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  iconBox: { width: 80, height: 80, borderWidth: 1, borderColor: '#333333', backgroundColor: '#111111', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { color: 'white', fontSize: 16, fontWeight: '900', letterSpacing: 1, marginBottom: 8 },
  subtext: { color: '#888888', fontSize: 12, textAlign: 'center', lineHeight: 20, marginBottom: 28 },
  backBtn: { backgroundColor: '#ffffff', paddingVertical: 14, paddingHorizontal: 24 },
  backBtnText: { color: '#000000', fontSize: 11, fontWeight: '900', letterSpacing: 1 }
});