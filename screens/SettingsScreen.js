import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { COLORS, THEME_PRESETS, useTheme } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

export default function SettingsScreen({ navigation }) {
  const { t } = useLanguage();
  const { theme, highContrast, activePreset, setPreset, toggleHighContrast, resetToDefault } = useTheme();

  const [aiFormattingEnabled, setAiFormattingEnabled] = useState(true);
  const [deviceTimezone, setDeviceTimezone] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedAIFormat = await AsyncStorage.getItem('rankcine_ai_formatting_enabled');
        if (storedAIFormat !== null) {
          setAiFormattingEnabled(storedAIFormat === 'true');
        }
        
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Auto (System)';
        setDeviceTimezone(tz);
      } catch (err) {
        console.warn('Failed to load settings:', err);
      }
    };

    loadSettings();
  }, []);

  const handleToggleAIFormatting = async (val) => {
    try {
      setAiFormattingEnabled(val);
      await AsyncStorage.setItem('rankcine_ai_formatting_enabled', String(val));
    } catch (err) {
      Alert.alert('Error', 'Failed to save formatting preference.');
    }
  };

  const handleConfirmReset = () => {
    Alert.alert(
      'Reset Theme',
      'Reset interface color tokens back to the default Architectural Wireframe monochromatic palette?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: resetToDefault 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.headerRow, { borderBottomColor: theme.borderLight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={20} color={theme.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.primary }]}>SETTINGS & PREFERENCES</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* SECTION 1: INTERFACE THEMING */}
        <Text style={[styles.sectionTitle, { color: theme.secondary }]}>INTERFACE THEME TOKENS</Text>

        <View style={[styles.card, { borderColor: theme.border, borderWidth: highContrast ? 2 : 1 }]}>
          <Text style={styles.cardHeader}>SELECT ACCENT PROFILE</Text>
          <View style={styles.presetGrid}>
            {Object.values(THEME_PRESETS).map((p) => {
              const isActive = activePreset === p.id && !highContrast;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.presetButton,
                    { borderColor: p.border },
                    isActive && styles.presetButtonActive
                  ]}
                  onPress={() => setPreset(p.id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.colorPreview, { backgroundColor: p.primary }]} />
                  <Text style={[styles.presetText, isActive && styles.presetTextActive]}>
                    {p.name.toUpperCase()}
                  </Text>
                  {isActive && <Feather name="check" size={14} color="#ffffff" />}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* High Contrast Toggle */}
          <View style={styles.toggleRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.toggleTitle}>High-Contrast Accessibility Mode</Text>
              <Text style={styles.toggleSubtitle}>
                Applies bold 2px borders, stark black/white contrast, and high-legibility typography for visual impairment.
              </Text>
            </View>
            <Switch
              value={highContrast}
              onValueChange={toggleHighContrast}
              trackColor={{ false: '#e0e0e0', true: '#000000' }}
              thumbColor="#ffffff"
            />
          </View>

          {/* Reset To Default Button */}
          <TouchableOpacity 
            style={[styles.resetButton, { borderColor: theme.primary }]}
            onPress={handleConfirmReset}
          >
            <Feather name="rotate-ccw" size={12} color={theme.primary} />
            <Text style={[styles.resetButtonText, { color: theme.primary }]}>RESET TO BLUEPRINT DEFAULT</Text>
          </TouchableOpacity>
        </View>

        {/* SECTION 2: AI REVIEW SYNTHESIS & SAFETY */}
        <Text style={[styles.sectionTitle, { color: theme.secondary }]}>AI AUDIT ENGINE & PRIVACY</Text>

        <View style={[styles.card, { borderColor: theme.border, borderWidth: highContrast ? 2 : 1 }]}>
          <View style={styles.toggleRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.toggleTitle}>AI Narrative Synthesis Formatting</Text>
              <Text style={styles.toggleSubtitle}>
                Automatically structure qualitative reviews into cohesive architectural critiques. Disable to preserve purely raw user inputs.
              </Text>
            </View>
            <Switch
              value={aiFormattingEnabled}
              onValueChange={handleToggleAIFormatting}
              trackColor={{ false: '#e0e0e0', true: '#000000' }}
              thumbColor="#ffffff"
            />
          </View>

          {/* Safety Invariance Banner */}
          <View style={styles.safetyBanner}>
            <Feather name="shield" size={14} color="#000000" style={{ marginTop: 1 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.safetyTitle}>PLATFORM SAFETY INVARIANCE GUARANTEE</Text>
              <Text style={styles.safetyText}>
                Turning off AI narrative formatting only disables stylistic rewriting. Automated safety checks (profanity, personal attacks, toxicity, and spam filtering) remain 100% active on all submissions.
              </Text>
            </View>
          </View>
        </View>

        {/* SECTION 3: LOCALIZATION & TIMEZONE */}
        <Text style={[styles.sectionTitle, { color: theme.secondary }]}>SYSTEM LOCALIZATION</Text>

        <View style={[styles.card, { borderColor: theme.border }]}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Device Timezone</Text>
            <Text style={styles.infoValue}>{deviceTimezone}</Text>
          </View>
          <Text style={styles.timezoneNote}>
            All review availability dates, consensus deadlines, and voucher release times are automatically translated to your device's current timezone.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight, backgroundColor: COLORS.surface },
  headerTitle: { fontSize: 13, fontWeight: '900', letterSpacing: 0.5 },
  content: { padding: 24, paddingBottom: 40 },
  sectionTitle: { fontSize: 9, fontWeight: '900', letterSpacing: 1, marginBottom: 10, marginTop: 10 },
  card: { borderWidth: 1, borderColor: '#000000', backgroundColor: '#ffffff', padding: 18, marginBottom: 24 },
  cardHeader: { fontSize: 10, fontWeight: '900', color: '#777777', letterSpacing: 0.5, marginBottom: 12 },
  presetGrid: { gap: 8, marginBottom: 16 },
  presetButton: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderColor: '#c6c6c6', backgroundColor: '#f3f3f4', gap: 10 },
  presetButtonActive: { backgroundColor: '#000000', borderColor: '#000000' },
  colorPreview: { width: 14, height: 14, borderWidth: 1, borderColor: '#ffffff' },
  presetText: { fontSize: 10, fontWeight: '900', color: '#000000', flex: 1, letterSpacing: 0.5 },
  presetTextActive: { color: '#ffffff' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#f3f3f4' },
  toggleTitle: { fontSize: 11, fontWeight: '900', color: '#000000', marginBottom: 2 },
  toggleSubtitle: { fontSize: 9, color: '#5e5e5e', lineHeight: 14 },
  resetButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1, borderColor: '#000000', paddingVertical: 10, marginTop: 12, backgroundColor: '#f3f3f4' },
  resetButtonText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  safetyBanner: { flexDirection: 'row', gap: 10, backgroundColor: '#f3f3f4', borderWidth: 1, borderColor: '#c6c6c6', padding: 12, marginTop: 8 },
  safetyTitle: { fontSize: 8, fontWeight: '900', color: '#000000', letterSpacing: 0.5, marginBottom: 2 },
  safetyText: { fontSize: 9, color: '#474747', lineHeight: 14 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  infoLabel: { fontSize: 11, fontWeight: 'bold', color: '#000000' },
  infoValue: { fontSize: 11, fontMono: true, fontWeight: 'bold', color: '#5e5e5e' },
  timezoneNote: { fontSize: 9, color: '#777777', lineHeight: 14, fontStyle: 'italic' }
});