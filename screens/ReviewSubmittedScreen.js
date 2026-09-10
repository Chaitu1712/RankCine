import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function ReviewSubmittedScreen({ route, navigation }) {
  
  const { reviewData } = route.params || {};

  const ratingScore = reviewData?.sentimentScore 
    ? Number(reviewData.sentimentScore).toFixed(1) 
    : '8.5';

  const qualityScore = reviewData?.aiQualityScore 
    ? (reviewData.aiQualityScore > 10 ? (reviewData.aiQualityScore / 10).toFixed(1) : Number(reviewData.aiQualityScore).toFixed(1))
    : '9.0';

  const narrativeText = reviewData?.aiFormattedOutput || 
    "This cinematic endeavor demonstrates a remarkable mastery of atmospheric storytelling. While the pacing in the second act exhibits a deliberate deceleration, the overall technical execution and thematic resonance achieve a high standard of quality.";

  
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Rank Cine AI Audit Synthesis:\n\n"${narrativeText}"\n\nRating Score: ${ratingScore}/10 | Quality Index: ${qualityScore}/10`,
      });
    } catch (error) {
      console.error('Sharing failed:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        
        {/* Section Title */}
        <Text style={styles.sectionHeader}>SUBMISSION ANALYTICS</Text>
        
        {/* Dynamic AI Scores */}
        <View style={styles.scoresRow}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>RATING</Text>
            <Text style={styles.scoreNum}>{ratingScore}</Text>
          </View>
          
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>QUALITY</Text>
            <Text style={styles.scoreNum}>{qualityScore}</Text>
          </View>
        </View>

        {/* Gemini AI Narrative Output */}
        <Text style={styles.sectionHeader}>AI SYNTHESIZED REVIEW OUTPUT</Text>
        <View style={styles.aiCard}>
          <Text style={styles.aiText}>
            "{narrativeText}"
          </Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Main')}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>RETURN TO FEED ►</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={handleShare}
          activeOpacity={0.8}
        >
          <Feather name="share-2" size={14} color={COLORS.primary} style={{ marginRight: 6 }} />
          <Text style={styles.secondaryButtonText}>SHARE AUDIT</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  main: { flex: 1, justifyContent: 'center', padding: 30 },
  sectionHeader: { fontSize: 10, fontWeight: '900', color: COLORS.secondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  scoresRow: { flexDirection: 'row', gap: 16, marginBottom: 30 },
  scoreCard: { flex: 1, borderWidth: 1.5, borderColor: COLORS.primary, backgroundColor: COLORS.surface, padding: 20, alignItems: 'center' },
  scoreLabel: { fontSize: 9, fontWeight: '900', color: COLORS.textMuted, marginBottom: 4 },
  scoreNum: { fontSize: 32, fontWeight: '900', color: COLORS.primary },
  aiCard: { borderWidth: 1.5, borderColor: COLORS.primary, padding: 20, backgroundColor: COLORS.surface, marginBottom: 40 },
  aiText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 22, fontStyle: 'italic', fontWeight: '500' },
  primaryButton: { backgroundColor: COLORS.primary, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  primaryButtonText: { color: COLORS.surface, fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  secondaryButton: { borderWidth: 1.5, borderColor: COLORS.primary, paddingVertical: 16, alignItems: 'center', backgroundColor: COLORS.surface, flexDirection: 'row', justifyContent: 'center' },
  secondaryButtonText: { color: COLORS.primary, fontSize: 12, fontWeight: '900', letterSpacing: 1 }
});