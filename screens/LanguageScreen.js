import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

const LANGUAGES = [
  { code: 'EN', name: 'English', native: 'English' },
  { code: 'HI', name: 'Hindi', native: 'हिन्दी' },
  { code: 'TE', name: 'Telugu', native: 'తెలుగు' },
  { code: 'TA', name: 'Tamil', native: 'தமிழ்' },
  { code: 'ES', name: 'Spanish', native: 'Español' },
  { code: 'FR', name: 'French', native: 'Français' }
];

export default function LanguageScreen({ navigation }) {
  const { language, setLanguage, t } = useLanguage();

  const handleSelectLanguage = async (code) => {
    await setLanguage(code);
    try {
      await AsyncStorage.setItem('rankcine_onboarding_completed', 'true');
    } catch {
      // Ignored
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.replace('Onboarding');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>{t('choose_language')}</Text>
      </View>

      <FlatList
        data={LANGUAGES}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        keyExtractor={(item) => item.code}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => {
          const isSelected = language === item.code;

          return (
            <TouchableOpacity 
              style={[styles.card, isSelected && styles.cardSelected]} 
              onPress={() => handleSelectLanguage(item.code)}
              activeOpacity={0.8}
            >
              <View style={styles.cardTop}>
                <View style={[styles.squareIndicator, isSelected && styles.squareIndicatorActive]} />
                {isSelected && <Feather name="check" size={14} color="#000000" />}
              </View>
              <Text style={styles.code}>[{item.code}]</Text>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.nativeName}>{item.native}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 24 },
  headerRow: { marginTop: 16, marginBottom: 28 },
  header: { fontSize: 24, fontWeight: '900', letterSpacing: -0.5, color: COLORS.primary },
  card: { width: '48%', borderWidth: 1, borderColor: COLORS.borderLight, backgroundColor: COLORS.surface, padding: 18, marginBottom: 16, position: 'relative' },
  cardSelected: { borderColor: COLORS.primary, borderWidth: 2 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  squareIndicator: { width: 14, height: 14, backgroundColor: COLORS.containerHigh, borderWidth: 1, borderColor: COLORS.borderLight },
  squareIndicatorActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  code: { fontSize: 9, fontWeight: 'bold', color: COLORS.textMuted, marginBottom: 2, fontMono: true },
  name: { fontSize: 16, fontWeight: '900', color: COLORS.primary },
  nativeName: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2, fontWeight: '600' }
});