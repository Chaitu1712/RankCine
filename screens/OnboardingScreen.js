import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  useWindowDimensions,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { COLORS, useTheme } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

const MONO_FONT = Platform.OS === 'ios' ? 'Menlo' : 'monospace';

export default function OnboardingScreen({ navigation }) {
  const { t } = useLanguage();
  const { theme, highContrast } = useTheme();
  const { width } = useWindowDimensions();
  const flatListRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleFinishOnboarding = async () => {
    try {
      await AsyncStorage.setItem('rankcine_onboarding_completed', 'true');
      navigation.replace('Main');
    } catch (err) {
      navigation.replace('Main');
    }
  };

  const handleNext = () => {
    if (currentIndex < 4) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      handleFinishOnboarding();
    }
  };

  /* -------------------------------------------------------------------------- */
  /* SLIDE 1: REWARD JOURNEY (Engage • Rank • Earn)                             */
  /* -------------------------------------------------------------------------- */
  const renderSlide1 = () => (
    <View style={[styles.slideCard, { borderColor: theme.border, borderWidth: highContrast ? 2 : 1 }]}>
      <View style={styles.slideHeaderBadgeRow}>
        <View style={styles.tagBadge}>
          <Text style={styles.tagBadgeText}>ROADMAP</Text>
        </View>
        <Text style={styles.stepCounterText}>01 / 05</Text>
      </View>

      <Text style={[styles.slideTitle, { color: theme.primary }]}>START YOUR REWARD JOURNEY</Text>
      <Text style={styles.slideSubtitle}>Engage • Rank • Earn</Text>

      <View style={styles.stepFlowContainer}>
        {[
          { num: '01', title: 'Watch Content', desc: 'Explore trailers, songs & podcasts.', icon: 'play' },
          { num: '02', title: 'Rank & Review', desc: 'Share qualitative critique on technical vectors.', icon: 'star' },
          { num: '03', title: 'Earn Accuracy Points', desc: 'Match 0.5 consensus mode peaks.', icon: 'trending-up' },
          { num: '04', title: 'Unlock Sponsor Rewards', desc: 'Win exclusive merchant & cinema vouchers.', icon: 'award' },
          { num: '05', title: 'Be Heard', desc: 'Real peer opinions powering transparent rankings.', icon: 'users' },
        ].map((step, idx) => (
          <View key={step.num} style={styles.stepRow}>
            <View style={[styles.stepNumBox, { backgroundColor: theme.primary }]}>
              <Text style={styles.stepNumText}>{step.num}</Text>
            </View>
            <View style={styles.stepContent}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Feather name={step.icon} size={11} color={theme.primary} />
                <Text style={[styles.stepTitle, { color: theme.primary }]}>{step.title}</Text>
              </View>
              <Text style={styles.stepDesc}>{step.desc}</Text>
            </View>
            {idx < 4 && <View style={[styles.stepConnectorLine, { backgroundColor: theme.borderLight }]} />}
          </View>
        ))}
      </View>
    </View>
  );

  /* -------------------------------------------------------------------------- */
  /* SLIDE 2: REWARD PORTFOLIO (Progress & Milestones)                         */
  /* -------------------------------------------------------------------------- */
  const renderSlide2 = () => (
    <View style={[styles.slideCard, { borderColor: theme.border, borderWidth: highContrast ? 2 : 1 }]}>
      <View style={styles.slideHeaderBadgeRow}>
        <View style={styles.tagBadge}>
          <Text style={styles.tagBadgeText}>PORTFOLIO</Text>
        </View>
        <Text style={styles.stepCounterText}>02 / 05</Text>
      </View>

      <Text style={[styles.slideTitle, { color: theme.primary }]}>YOUR REWARD PORTFOLIO</Text>
      <Text style={styles.slideSubtitle}>Chronological accuracy ledger & milestone earnings.</Text>

      <View style={[styles.blueprintBox, { borderColor: theme.border }]}>
        <View style={styles.metricRow}>
          <View>
            <Text style={styles.boxMiniLabel}>ACCRUED ACCURACY</Text>
            <Text style={[styles.boxBigNumber, { color: theme.primary }]}>
              2,480 <Text style={{ fontSize: 11 }}>PTS</Text>
            </Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>LEVEL 2 • RISING RANKER</Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '48%', backgroundColor: theme.primary }]} />
        </View>
        <Text style={styles.progressLabel}>480 / 1,000 PTS TO LEVEL 3</Text>
      </View>

      <Text style={styles.subSectionHeader}>MILESTONE JOURNEY</Text>
      <View style={styles.milestoneGrid}>
        {[
          { label: 'Start', status: 'COMPLETED', date: 'Joined RankCine' },
          { label: 'First 10', status: 'COMPLETED', date: 'Earned 500 Pts' },
          { label: 'Top 10%', status: 'IN PROGRESS', date: 'Consensus Tier' },
          { label: 'Elite 5%', status: 'LOCKED', date: 'Unlock Perks' },
        ].map((m, i) => (
          <View key={i} style={[styles.milestonePill, m.status === 'COMPLETED' && styles.milestoneDone]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Feather 
                name={m.status === 'COMPLETED' ? 'check-circle' : m.status === 'IN PROGRESS' ? 'clock' : 'lock'} 
                size={10} 
                color={m.status === 'COMPLETED' ? '#ffffff' : '#555555'} 
              />
              <Text style={[styles.milestoneLabel, m.status === 'COMPLETED' && { color: '#ffffff' }]}>
                {m.label.toUpperCase()}
              </Text>
            </View>
            <Text style={[styles.milestoneSub, m.status === 'COMPLETED' && { color: '#cccccc' }]}>{m.date}</Text>
          </View>
        ))}
      </View>

      <View style={styles.teaserCard}>
        <Feather name="gift" size={14} color="#000000" />
        <Text style={styles.teaserText}>
          Next Milestone: Unlock exclusive sponsor merchandise & screening vouchers.
        </Text>
      </View>
    </View>
  );

  /* -------------------------------------------------------------------------- */
  /* SLIDE 3: RATE FOR REWARDS (Currency of Quality)                           */
  /* -------------------------------------------------------------------------- */
  const renderSlide3 = () => (
    <View style={[styles.slideCard, { borderColor: theme.border, borderWidth: highContrast ? 2 : 1 }]}>
      <View style={styles.slideHeaderBadgeRow}>
        <View style={styles.tagBadge}>
          <Text style={styles.tagBadgeText}>CONSENSUS ENGINE</Text>
        </View>
        <Text style={styles.stepCounterText}>03 / 05</Text>
      </View>

      <Text style={[styles.slideTitle, { color: theme.primary }]}>RATE FOR REWARDS</Text>
      <Text style={styles.slideSubtitle}>Quality feedback is your currency.</Text>

      <View style={styles.chainRow}>
        {['Rate Content', 'Earn Accuracy', 'Level Up', 'Win Vouchers'].map((step, idx) => (
          <View key={step} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.chainStep}>
              <View style={[styles.chainCircle, { backgroundColor: theme.primary }]}>
                <Text style={styles.chainCircleText}>{idx + 1}</Text>
              </View>
              <Text style={styles.chainText}>{step}</Text>
            </View>
            {idx < 3 && <Feather name="arrow-right" size={10} color="#777777" style={{ marginHorizontal: 2 }} />}
          </View>
        ))}
      </View>

      <Text style={styles.subSectionHeader}>COMMUNITY REWARD TIERS</Text>
      <View style={styles.tiersGrid}>
        {[
          { tier: 'Explorer', pts: '0–500 pts', badge: 'Tier 1' },
          { tier: 'Supporter', pts: '501–2,000 pts', badge: 'Tier 2' },
          { tier: 'Super Ranker', pts: '2,001–5,000 pts', badge: 'Tier 3' },
          { tier: 'Legend', pts: '5,001+ pts', badge: 'Tier 4' },
        ].map((t) => (
          <View key={t.tier} style={styles.tierBox}>
            <Text style={styles.tierBadge}>{t.badge}</Text>
            <Text style={styles.tierName}>{t.tier.toUpperCase()}</Text>
            <Text style={styles.tierPts}>{t.pts}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.subSectionHeader}>WHAT YOU UNLOCK</Text>
      <View style={styles.chipRow}>
        {['Movie Tickets & Passes', 'Sponsor Vouchers', 'Brand Discounts', 'Exclusive Screening Invites'].map(p => (
          <View key={p} style={styles.perkChip}>
            <Feather name="check" size={10} color="#000000" />
            <Text style={styles.perkChipText}>{p}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  /* -------------------------------------------------------------------------- */
  /* SLIDE 4: ELITE PERCENTILE RANK (Top 5% Consensus)                         */
  /* -------------------------------------------------------------------------- */
  const renderSlide4 = () => (
    <View style={[styles.slideCard, { borderColor: theme.border, borderWidth: highContrast ? 2 : 1 }]}>
      <View style={styles.slideHeaderBadgeRow}>
        <View style={styles.tagBadge}>
          <Text style={styles.tagBadgeText}>PERFORMANCE MATRIX</Text>
        </View>
        <Text style={styles.stepCounterText}>04 / 05</Text>
      </View>

      <Text style={[styles.slideTitle, { color: theme.primary }]}>ELITE PERCENTILE RANK</Text>
      <Text style={styles.slideSubtitle}>Reach the top 5% of community consensus accuracy.</Text>

      <View style={[styles.heroBadgeBox, { backgroundColor: theme.primary }]}>
        <View style={styles.top5Circle}>
          <Text style={styles.top5Text}>TOP</Text>
          <Text style={styles.top5Number}>5%</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.heroBadgeTitle}>ELITE CONSENSUS TIER</Text>
          <Text style={styles.heroBadgeDesc}>
            Evaluations aligning with the 0.5 mathematical crowd mode unlock the highest sponsor reward pools.
          </Text>
        </View>
      </View>

      <Text style={styles.subSectionHeader}>AUDIENCE ACCURACY BENCHMARKS</Text>
      <View style={styles.benchmarkContainer}>
        {[
          { label: 'Elite Tier', pct: 95, highlight: true },
          { label: 'Top 10%', pct: 72, highlight: false },
          { label: 'Top 25%', pct: 50, highlight: false },
          { label: 'Median Community', pct: 20, highlight: false },
        ].map((b) => (
          <View key={b.label} style={styles.benchmarkRow}>
            <Text style={[styles.benchmarkLabel, b.highlight && { fontWeight: '900', color: '#000000' }]}>
              {b.label}
            </Text>
            <View style={styles.benchmarkTrack}>
              <View style={[styles.benchmarkFill, { width: `${b.pct}%`, backgroundColor: b.highlight ? '#000000' : '#888888' }]} />
            </View>
            <Text style={styles.benchmarkPct}>{b.pct}%</Text>
          </View>
        ))}
      </View>

      <View style={styles.impactGrid}>
        <View style={styles.impactCol}>
          <Feather name="shield" size={13} color="#000000" />
          <Text style={styles.impactTitle}>Trusted Opinion</Text>
          <Text style={styles.impactDesc}>Ratings carry 10x consensus weight.</Text>
        </View>
        <View style={styles.impactCol}>
          <Feather name="award" size={13} color="#000000" />
          <Text style={styles.impactTitle}>Draw Priority</Text>
          <Text style={styles.impactDesc}>First in line for sponsor vouchers.</Text>
        </View>
      </View>
    </View>
  );

  /* -------------------------------------------------------------------------- */
  /* SLIDE 5: GO BEYOND THE BASICS (Direct Studio Engagement)                  */
  /* -------------------------------------------------------------------------- */
  const renderSlide5 = () => (
    <View style={[styles.slideCard, { borderColor: theme.border, borderWidth: highContrast ? 2 : 1 }]}>
      <View style={styles.slideHeaderBadgeRow}>
        <View style={styles.tagBadge}>
          <Text style={styles.tagBadgeText}>DIRECTORIAL ACCESS</Text>
        </View>
        <Text style={styles.stepCounterText}>05 / 05</Text>
      </View>

      <Text style={[styles.slideTitle, { color: theme.primary }]}>GO BEYOND THE BASICS</Text>
      <Text style={styles.slideSubtitle}>
        Where top rankers unlock direct creator and commercial rewards.
      </Text>

      <View style={styles.featuresList}>
        {[
          { 
            icon: 'award', 
            title: 'Exclusive Vouchers & Merch', 
            desc: 'Redeem verified alphanumeric codes with cinema and merchant sponsors.' 
          },
          { 
            icon: 'message-square', 
            title: 'Direct Creator Feedback', 
            desc: 'Your qualitative critiques are inspected directly by filmmakers & audio producers.' 
          },
          { 
            icon: 'check-circle', 
            title: 'Unique Podium Badges', 
            desc: 'Gain verified community standing and display your consensus accuracy percentile.' 
          },
          { 
            icon: 'unlock', 
            title: 'Early Screening Access', 
            desc: 'Be the first to evaluate unreleased promotional drops and test media.' 
          }
        ].map((f) => (
          <View key={f.title} style={styles.featureItem}>
            <View style={[styles.featureIconBox, { backgroundColor: theme.primary }]}>
              <Feather name={f.icon} size={14} color="#ffffff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.featureTitle, { color: theme.primary }]}>{f.title.toUpperCase()}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.syncNoticeBox}>
        <Feather name="cpu" size={13} color="#000000" />
        <Text style={styles.syncNoticeText}>
          Workspace ready: Evaluator ledger and 0.5 consensus frequency active.
        </Text>
      </View>
    </View>
  );

  const slides = [
    { id: '1', render: renderSlide1 },
    { id: '2', render: renderSlide2 },
    { id: '3', render: renderSlide3 },
    { id: '4', render: renderSlide4 },
    { id: '5', render: renderSlide5 },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      
      {/* Top Header Bar */}
      <View style={[styles.headerBar, { borderBottomColor: theme.borderLight }]}>
        <View>
          <Text style={[styles.brandTitle, { color: theme.primary }]}>RANK CINE</Text>
          <Text style={styles.brandMotto}>WATCH. RANK. BE HEARD.</Text>
        </View>

        <TouchableOpacity onPress={handleFinishOnboarding} style={styles.skipButton}>
          <Text style={[styles.skipButtonText, { color: theme.secondary }]}>SKIP</Text>
        </TouchableOpacity>
      </View>

      {/* Paged Horizontal Carousel */}
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slideWrapper, { width }]}>
            {item.render()}
          </View>
        )}
      />

      {/* Bottom Navigation Controls */}
      <View style={[styles.footerBar, { borderTopColor: theme.borderLight, backgroundColor: theme.surface }]}>
        
        {/* Pagination Pill Indicators */}
        <View style={styles.dotsContainer}>
          {slides.map((_, idx) => (
            <View 
              key={idx} 
              style={[
                styles.dot, 
                { backgroundColor: currentIndex === idx ? theme.primary : '#d1d5db' },
                currentIndex === idx && styles.dotActive
              ]} 
            />
          ))}
        </View>

        {/* Action Button (Next vs Get Started) */}
        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: theme.primary }]} 
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.actionBtnText}>
            {currentIndex === 4 ? 'BEGIN REWARD JOURNEY ►' : 'NEXT ►'}
          </Text>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  headerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#e8e8e8' },
  brandTitle: { fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
  brandMotto: { fontSize: 8, fontFamily: MONO_FONT, fontWeight: 'bold', color: '#777777', letterSpacing: 1, marginTop: 1 },
  skipButton: { paddingVertical: 6, paddingHorizontal: 10, borderWidth: 1, borderColor: '#c6c6c6' },
  skipButtonText: { fontSize: 9, fontFamily: MONO_FONT, fontWeight: '900', letterSpacing: 1 },

  slideWrapper: { padding: 20, justifyContent: 'center' },
  slideCard: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#000000', padding: 20, minHeight: 460 },
  slideHeaderBadgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  tagBadge: { backgroundColor: '#000000', paddingHorizontal: 6, paddingVertical: 2 },
  tagBadgeText: { fontSize: 8, fontFamily: MONO_FONT, fontWeight: '900', color: '#ffffff', letterSpacing: 0.5 },
  stepCounterText: { fontSize: 10, fontFamily: MONO_FONT, fontWeight: 'bold', color: '#777777' },

  slideTitle: { fontSize: 18, fontWeight: '900', letterSpacing: -0.5, marginBottom: 2 },
  slideSubtitle: { fontSize: 11, color: '#555555', marginBottom: 16, fontWeight: '500' },
  subSectionHeader: { fontSize: 9, fontFamily: MONO_FONT, fontWeight: '900', color: '#777777', letterSpacing: 1, marginTop: 12, marginBottom: 8 },

  // Slide 1 Styles
  stepFlowContainer: { marginTop: 4 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10, position: 'relative' },
  stepNumBox: { width: 22, height: 22, justifyContent: 'center', alignItems: 'center', marginRight: 12, marginTop: 2 },
  stepNumText: { color: '#ffffff', fontSize: 9, fontFamily: MONO_FONT, fontWeight: '900' },
  stepContent: { flex: 1 },
  stepTitle: { fontSize: 12, fontWeight: '900' },
  stepDesc: { fontSize: 10, color: '#5e5e5e', marginTop: 1, lineHeight: 14 },
  stepConnectorLine: { position: 'absolute', left: 10, top: 24, bottom: -10, width: 1 },

  // Slide 2 Styles
  blueprintBox: { borderWidth: 1, borderColor: '#000000', backgroundColor: '#f9f9f9', padding: 14, marginBottom: 10 },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  boxMiniLabel: { fontSize: 8, fontFamily: MONO_FONT, fontWeight: '900', color: '#777777' },
  boxBigNumber: { fontSize: 22, fontWeight: '900', marginTop: 1 },
  levelBadge: { backgroundColor: '#000000', paddingHorizontal: 8, paddingVertical: 3 },
  levelBadgeText: { color: '#ffffff', fontSize: 8, fontFamily: MONO_FONT, fontWeight: '900' },
  progressTrack: { height: 6, backgroundColor: '#e5e7eb', width: '100%', marginBottom: 4 },
  progressFill: { height: '100%' },
  progressLabel: { fontSize: 8, fontFamily: MONO_FONT, color: '#666666', textAlign: 'right' },
  milestoneGrid: { flexDirection: 'row', gap: 6, marginBottom: 10 },
  milestonePill: { flex: 1, borderWidth: 1, borderColor: '#c6c6c6', padding: 8, backgroundColor: '#f3f3f4' },
  milestoneDone: { backgroundColor: '#000000', borderColor: '#000000' },
  milestoneLabel: { fontSize: 8, fontWeight: '900', color: '#000000' },
  milestoneSub: { fontSize: 7, fontFamily: MONO_FONT, color: '#777777', marginTop: 2 },
  teaserCard: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#c6c6c6', padding: 10, backgroundColor: '#ffffff' },
  teaserText: { fontSize: 9, color: '#333333', fontWeight: 'bold', flex: 1 },

  // Slide 3 Styles
  chainRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8, paddingHorizontal: 4 },
  chainStep: { alignItems: 'center', width: 62 },
  chainCircle: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  chainCircleText: { color: '#ffffff', fontSize: 10, fontFamily: MONO_FONT, fontWeight: '900' },
  chainText: { fontSize: 8, fontWeight: '900', textAlign: 'center', color: '#000000' },
  tiersGrid: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  tierBox: { flex: 1, borderWidth: 1, borderColor: '#c6c6c6', padding: 8, backgroundColor: '#f9f9f9' },
  tierBadge: { fontSize: 7, fontFamily: MONO_FONT, color: '#777777', fontWeight: 'bold' },
  tierName: { fontSize: 9, fontWeight: '900', color: '#000000', marginVertical: 2 },
  tierPts: { fontSize: 7, fontFamily: MONO_FONT, color: '#555555' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  perkChip: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: '#000000', paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#ffffff' },
  perkChipText: { fontSize: 8, fontWeight: '900', color: '#000000' },

  // Slide 4 Styles
  heroBadgeBox: { padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  top5Circle: { width: 48, height: 48, borderWidth: 1, borderColor: '#ffffff', justifyContent: 'center', alignItems: 'center' },
  top5Text: { fontSize: 8, fontFamily: MONO_FONT, fontWeight: '900', color: '#ffffff' },
  top5Number: { fontSize: 16, fontWeight: '900', color: '#ffffff' },
  heroBadgeTitle: { fontSize: 11, fontWeight: '900', color: '#ffffff', letterSpacing: 0.5 },
  heroBadgeDesc: { fontSize: 9, color: '#cccccc', lineHeight: 13, marginTop: 2 },
  benchmarkContainer: { borderWidth: 1, borderColor: '#c6c6c6', padding: 10, backgroundColor: '#f9f9f9', marginBottom: 10 },
  benchmarkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  benchmarkLabel: { width: 90, fontSize: 8, color: '#555555', fontFamily: MONO_FONT },
  benchmarkTrack: { flex: 1, height: 5, backgroundColor: '#e5e7eb', marginHorizontal: 8 },
  benchmarkFill: { height: '100%' },
  benchmarkPct: { width: 28, fontSize: 8, fontFamily: MONO_FONT, textAlign: 'right', fontWeight: 'bold' },
  impactGrid: { flexDirection: 'row', gap: 10 },
  impactCol: { flex: 1, borderWidth: 1, borderColor: '#c6c6c6', padding: 8, backgroundColor: '#ffffff' },
  impactTitle: { fontSize: 9, fontWeight: '900', color: '#000000', marginTop: 4 },
  impactDesc: { fontSize: 8, color: '#5e5e5e', marginTop: 1 },

  // Slide 5 Styles
  featuresList: { gap: 8, marginBottom: 12 },
  featureItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderWidth: 1, borderColor: '#e5e7eb', padding: 10, backgroundColor: '#fcfcfc' },
  featureIconBox: { width: 24, height: 24, justifyContent: 'center', alignItems: 'center', marginTop: 1 },
  featureTitle: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  featureDesc: { fontSize: 9, color: '#5e5e5e', marginTop: 1, lineHeight: 13 },
  syncNoticeBox: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#000000', padding: 10, backgroundColor: '#f3f3f4' },
  syncNoticeText: { fontSize: 9, fontFamily: MONO_FONT, color: '#000000', fontWeight: 'bold', flex: 1 },

  // Footer & Navigation
  footerBar: { paddingHorizontal: 24, paddingVertical: 18, borderTopWidth: 1, borderTopColor: '#e8e8e8', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dotsContainer: { flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#d1d5db' },
  dotActive: { width: 18, borderRadius: 3 },
  actionBtn: { paddingVertical: 12, paddingHorizontal: 20 },
  actionBtnText: { color: '#ffffff', fontSize: 11, fontFamily: MONO_FONT, fontWeight: '900', letterSpacing: 1 }
});