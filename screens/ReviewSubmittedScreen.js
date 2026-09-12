import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

export default function ReviewSubmittedScreen({ route, navigation }) {
  const { t } = useLanguage();
  const { reviewData } = route.params || {};

  const [showQualityTooltip, setShowQualityTooltip] = useState(false);

  const ratingScore = reviewData?.sentimentScore 
    ? Number(reviewData.sentimentScore).toFixed(1) 
    : '8.5';

  const rawQuality = reviewData?.aiQualityScore;
  const qualityScore = rawQuality 
    ? (rawQuality > 10 ? (rawQuality / 10).toFixed(1) : Number(rawQuality).toFixed(1))
    : '9.0';

  const narrativeText = reviewData?.aiFormattedOutput || 
    reviewData?.rawTextInput ||
    "This cinematic endeavor demonstrates a remarkable mastery of atmospheric storytelling. The technical execution and thematic resonance achieve a high standard of quality.";

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Rank Cine Review Audit:\n\n"${narrativeText}"\n\nRating Score: ${ratingScore}/10 | Text Review Quality: ${qualityScore}/10`,
      });
    } catch (error) {
      console.error('Sharing failed:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        
        <Text style={styles.sectionHeader}>{t('submission_analytics') || 'SUBMISSION ANALYTICS'}</Text>
        
        {/* Dynamic AI Scores */}
        <View style={styles.scoresRow}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>{t('sentiment_rating') || 'SENTIMENT RATING'}</Text>
            <Text style={styles.scoreNum}>{ratingScore}</Text>
          </View>
          
          {/* Subtask 3.4: Rebranded to TEXT REVIEW QUALITY with Tooltip */}
          <View style={styles.scoreCard}>
            <View style={styles.qualityLabelRow}>
              <Text style={styles.scoreLabel}>{t('text_review_quality') || 'TEXT REVIEW QUALITY'}</Text>
              <TouchableOpacity onPress={() => setShowQualityTooltip(true)} style={{ padding: 2 }}>
                <Feather name="help-circle" size={11} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={styles.scoreNum}>{qualityScore}</Text>
          </View>
        </View>

        {/* Subtask 3.4: Stripped vendor AI branding */}
        <Text style={styles.sectionHeader}>{t('ai_audit_synthesis') || 'AI AUDIT SYNTHESIS'}</Text>
        <View style={styles.aiCard}>
          <Text style={styles.aiText}>
            "{narrativeText}"
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Main')}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>{t('return_to_feed') || 'RETURN TO FEED'} ►</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={handleShare}
          activeOpacity={0.8}
        >
          <Feather name="share-2" size={14} color={COLORS.primary} style={{ marginRight: 6 }} />
          <Text style={styles.secondaryButtonText}>{t('share_audit') || 'SHARE AUDIT'}</Text>
        </TouchableOpacity>

      </View>

      {/* Subtask 3.4: Quality Tooltip Modal */}
      {showQualityTooltip && (
        <Modal visible={true} transparent={true} animationType="fade">
          <TouchableOpacity 
            style={styles.tooltipOverlay} 
            activeOpacity={1} 
            onPress={() => setShowQualityTooltip(false)}
          >
            <View style={styles.tooltipCard}>
              <View style={styles.tooltipHeader}>
                <Text style={styles.tooltipTitle}>{t('text_review_quality') || 'TEXT REVIEW QUALITY'}</Text>
                <TouchableOpacity onPress={() => setShowQualityTooltip(false)}>
                  <Feather name="x" size={16} color="#000000" />
                </TouchableOpacity>
              </View>
              <Text style={styles.tooltipBody}>
                {t('text_review_quality_desc') || 'Scored from 0 to 100 based on qualitative substance, reasoning, articulation, and constructive technical critique.'}
              </Text>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  main: { flex: 1, justifyContent: 'center', padding: 30 },
  sectionHeader: { fontSize: 10, fontWeight: '900', color: COLORS.secondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  scoresRow: { flexDirection: 'row', gap: 16, marginBottom: 30 },
  scoreCard: { flex: 1, borderWidth: 1.5, borderColor: COLORS.primary, backgroundColor: COLORS.surface, padding: 18, alignItems: 'center' },
  qualityLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  scoreLabel: { fontSize: 8, fontWeight: '900', color: COLORS.textMuted, letterSpacing: 0.5, textAlign: 'center' },
  scoreNum: { fontSize: 32, fontWeight: '900', color: COLORS.primary },
  aiCard: { borderWidth: 1.5, borderColor: COLORS.primary, padding: 20, backgroundColor: COLORS.surface, marginBottom: 40 },
  aiText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 22, fontStyle: 'italic', fontWeight: '500' },
  primaryButton: { backgroundColor: COLORS.primary, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  primaryButtonText: { color: COLORS.surface, fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  secondaryButton: { borderWidth: 1.5, borderColor: COLORS.primary, paddingVertical: 16, alignItems: 'center', backgroundColor: COLORS.surface, flexDirection: 'row', justifyContent: 'center' },
  secondaryButtonText: { color: COLORS.primary, fontSize: 12, fontWeight: '900', letterSpacing: 1 },

  tooltipOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 30 },
  tooltipCard: { backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#000000', padding: 20, width: '100%' },
  tooltipHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#e8e8e8', paddingBottom: 8, marginBottom: 10 },
  tooltipTitle: { fontSize: 11, fontWeight: '900', color: '#000000', letterSpacing: 0.5 },
  tooltipBody: { fontSize: 11, color: '#474747', lineHeight: 18 }
});