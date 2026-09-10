import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { mobileApi } from '../services/mobileApi';
import { useLanguage } from '../context/LanguageContext';

export default function ReportContentScreen({ route, navigation }) {
  const { t } = useLanguage();
  const { item } = route.params || {};

  const [selectedReason, setSelectedReason] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasons = [
    { key: 'AGE INAPPROPRIATE', labelKey: 'reason_age_inappropriate', label: 'AGE INAPPROPRIATE' },
    { key: 'UNRELATED CONTENT', labelKey: 'reason_unrelated_content', label: 'UNRELATED CONTENT' },
    { key: 'FALSE ADVERTISEMENT / CONTENT', labelKey: 'reason_false_ad', label: 'FALSE ADVERTISEMENT / CONTENT' },
    { key: 'OTHER', labelKey: 'reason_other', label: 'OTHER' }
  ];

  const handleSubmit = async () => {
    if (!selectedReason) {
      Alert.alert('Selection Required', 'Please select a reason for reporting.');
      return;
    }

    try {
      setIsSubmitting(true);
      const formattedReason = selectedReason.replace(/[\s/]+/g, '_').toUpperCase();

      await mobileApi.post('/moderation/report', {
        sourceType: 'MEDIA_ITEM',
        sourceId: item?.id || 'unknown-asset-id',
        flagReason: formattedReason
      });

      Alert.alert(
        'Report Submitted', 
        'Our moderation team will review this media asset shortly.', 
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );

    } catch (error) {
      console.error('Report submission failed:', error);
      Alert.alert('Error', error.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setSelectedReason(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} disabled={isSubmitting}>
          <Feather name="x" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('report_content') || 'REPORT CONTENT'}</Text>
        <TouchableOpacity onPress={handleClear} disabled={isSubmitting}>
          <Text style={styles.clearBtn}>{t('clear') || 'CLEAR'}</Text>
        </TouchableOpacity>
      </View>

      <View style={{ padding: 24, flex: 1 }}>
        <Text style={styles.headline}>{t('report_media_headline') || 'Report Media Asset'}</Text>
        <Text style={styles.subtext}>
          {t('report_media_subtext') || `Please select the reason that best describes your concern regarding '${item?.title || 'this content'}'. Our moderation team will audit it.`}
        </Text>

        <View style={styles.optionsBlock}>
          {reasons.map((r) => (
            <TouchableOpacity 
              key={r.key} 
              style={[
                styles.optionRow, 
                selectedReason === r.key && styles.optionRowSelected
              ]}
              onPress={() => setSelectedReason(r.key)}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              <Text style={[styles.optionText, selectedReason === r.key && styles.optionTextSelected]}>
                {t(r.labelKey) || r.label}
              </Text>
              <View style={[styles.circleOuter, selectedReason === r.key && styles.circleSelected]}>
                {selectedReason === r.key && <View style={styles.circleInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.submitBtn}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={COLORS.primary} size="small" />
            ) : (
              <>
                <Text style={styles.submitBtnText}>{t('submit_report') || 'SUBMIT REPORT'}</Text>
                <Feather name="arrow-right" size={16} color={COLORS.primary} />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
            disabled={isSubmitting}
          >
            <Text style={styles.cancelBtnText}>{t('cancel') || 'CANCEL'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background }, 
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight, backgroundColor: COLORS.surface },
  headerTitle: { fontSize: 13, fontWeight: '900' },
  clearBtn: { fontSize: 10, fontWeight: '900', color: COLORS.textMuted },
  headline: { fontSize: 18, fontWeight: '900', marginBottom: 12, color: COLORS.primary },
  subtext: { fontSize: 11, color: COLORS.textSecondary, lineHeight: 18, marginBottom: 24, fontWeight: '500' },
  optionsBlock: { gap: 12, marginBottom: 30 },
  optionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: COLORS.borderLight, backgroundColor: COLORS.surface, padding: 16, borderRadius: 2 },
  optionRowSelected: { borderColor: COLORS.primary }, 
  optionText: { fontSize: 11, fontWeight: 'bold', color: COLORS.textSecondary },
  optionTextSelected: { color: COLORS.primary, fontWeight: '900' }, 
  circleOuter: { width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: COLORS.textMuted, justifyContent: 'center', alignItems: 'center' },
  circleSelected: { borderColor: COLORS.primary },
  circleInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },
  actions: { gap: 12 },
  submitBtn: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.primary, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  submitBtnText: { color: COLORS.primary, fontSize: 12, fontWeight: '900' },
  cancelBtn: { backgroundColor: '#000000', paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.primary },
  cancelBtnText: { color: COLORS.surface, fontSize: 12, fontWeight: '900' }
});