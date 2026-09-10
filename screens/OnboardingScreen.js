import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  { id: '1', titleKey: 'onboarding_title_1', descKey: 'onboarding_desc_1', title: 'Unlock Elite Rewards', desc: 'Join a community of top-tier reviewers and earn exclusive access to premium architectural assets. Your precision pays off.' },
  { id: '2', titleKey: 'onboarding_title_2', descKey: 'onboarding_desc_2', title: 'Your Reward Portfolio', desc: 'Track your progress and archived earnings. A chronological ledger of your accuracy milestones and exclusive rewards.' },
  { id: '3', titleKey: 'onboarding_title_3', descKey: 'onboarding_desc_3', title: 'Rate for Rewards', desc: 'Every accurate rating brings you closer to unlocking new system tiers and sponsor-backed rewards. Quality feedback is your currency.' },
  { id: '4', titleKey: 'onboarding_title_4', descKey: 'onboarding_desc_4', title: 'Elite Percentile Rank', desc: 'Reach the top 5% of community accuracy to unlock the most prestigious project rewards. Our sponsors value your architectural precision.' },
  { id: '5', titleKey: 'onboarding_title_5', descKey: 'onboarding_desc_5', title: 'Start Your Reward Journey', desc: 'Your workspace is synchronized. High-accuracy reviews are the key to building your professional asset library. Begin your first project.' }
];

export default function OnboardingScreen({ navigation }) {
  const { t } = useLanguage();
  const [currentIdx, setCurrentIdx] = useState(0);
  const flatListRef = useRef(null);

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('rankcine_onboarding_completed', 'true');
    } catch {
      // Ignored
    }
    navigation.replace('Main');
  };

  const handleNext = () => {
    if (currentIdx < SLIDES.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIdx + 1 });
      setCurrentIdx(currentIdx + 1);
    } else {
      completeOnboarding();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={completeOnboarding}>
        <Text style={styles.skipText}>{t('skip') || 'SKIP'}</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIdx(index);
        }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.placeholderBox}>
              <Text style={styles.placeholderText}>ARCHITECTURAL BLUEPRINT</Text>
            </View>
            <Text style={styles.title}>{t(item.titleKey) || item.title}</Text>
            <Text style={styles.desc}>{t(item.descKey) || item.desc}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.indicator, currentIdx === i && styles.activeIndicator]} />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentIdx === SLIDES.length - 1 ? (t('get_started') || 'GET STARTED') : (t('next') || 'NEXT')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  skipButton: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
  skipText: { fontSize: 12, fontWeight: 'bold', color: COLORS.textMuted, textTransform: 'uppercase' },
  slide: { width: width, padding: 30, justifyContent: 'center', flex: 1 },
  placeholderBox: { width: '100%', height: height * 0.35, borderWidth: 1, borderColor: COLORS.borderLight, backgroundColor: COLORS.containerLow, justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
  placeholderText: { fontSize: 10, fontWeight: 'bold', color: COLORS.textMuted, letterSpacing: 1 },
  title: { fontSize: 28, fontWeight: 'bold', letterSpacing: -0.5, color: COLORS.primary },
  desc: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22, marginTop: 15 },
  footer: { paddingHorizontal: 30, paddingBottom: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  indicatorContainer: { flexDirection: 'row', gap: 6 },
  indicator: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.borderLight },
  activeIndicator: { backgroundColor: COLORS.primary, width: 12 },
  button: { backgroundColor: COLORS.primary, paddingVertical: 14, paddingHorizontal: 24, borderRadius: 2 },
  buttonText: { color: COLORS.surface, fontSize: 12, fontWeight: 'bold', letterSpacing: 1 }
});