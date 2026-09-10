import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { mobileApi } from '../services/mobileApi';
import { useLanguage } from '../context/LanguageContext';

const FAQS = [
  { 
    q: "How does the Rate-to-Earn mechanism work?", 
    a: "Rate-to-Earn rewards users for high-accuracy evaluations across Acting, Visuals, Pacing, and Originality. Your submitted rating vectors are audited by our Gemini AI engine against community consensus. Placing in top percentile ranks (e.g. Top 5% or Top 10%) unlocks sponsor vouchers." 
  },
  { 
    q: "How does Gemini AI calculate my Review Quality Score?", 
    a: "Google Gemini Flash processes qualitative text, audio, and video review submissions. It transcribes spoken media, evaluates narrative coherence, checks against spam/profanity thresholds, and assigns a sentiment score (0–10) and quality score (0–100%)." 
  },
  { 
    q: "When are sponsor reward vouchers distributed?", 
    a: "Percentile leaderboards are recalculated continuously. Once an active sponsor campaign ends or reaches an evaluation milestone, unlocked vouchers automatically appear in your 'My Rewards' archive on your profile tab." 
  },
  { 
    q: "Are my evaluations private?", 
    a: "Yes. Raw submissions are stored in encrypted cloud repositories strictly for AI sentiment synthesis, quality feedback, and accuracy calculation. We do not sell user data to third parties." 
  },
  { 
    q: "Why was my review flagged or hidden by moderation?", 
    a: "Reviews containing profanity, hate speech, automated bot text, unverified copy-pasting, or unrelated media are flagged by automated AI filters or community reports. Repeated infractions lead to account suspension." 
  },
  { 
    q: "How are financial vouchers taxed under Indian laws?", 
    a: "Vouchers and commercial rewards earned through Rank Cine may be subject to Tax Deducted at Source (TDS) under Section 194R of the Income Tax Act, 1961, where applicable." 
  }
];

const CATEGORIES = ['GENERAL', 'REWARDS_ISSUE', 'ACCOUNT', 'BUG_REPORT'];

export default function HelpSupportScreen({ navigation }) {
  const { t } = useLanguage();
  const [openIdx, setOpenIdx] = useState(null);
  const [category, setCategory] = useState('GENERAL');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // TASK 4.2: Authentic error surfacing without masking server failures
  const handleSendMessage = async () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Validation Error', 'Please enter both a subject and a detailed message before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      await mobileApi.post('/users/support-ticket', {
        category,
        subject: subject.trim(),
        message: message.trim()
      });

      Alert.alert(
        'Ticket Submitted', 
        'Your support request has been logged. Our technical team will investigate within 24 hours.'
      );
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error('Support ticket submission error:', err);
      Alert.alert(
        'Submission Failed', 
        err.message || 'Unable to submit your ticket. Please check your network connection or contact support@rankcine.com directly.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('help_support') || 'HELP & SUPPORT'}</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>{t('faq_section_title') || 'FREQUENTLY ASKED QUESTIONS'}</Text>

        <View style={styles.faqList}>
          {FAQS.map((faq, i) => (
            <TouchableOpacity 
              key={i} 
              style={styles.faqCard}
              onPress={() => setOpenIdx(openIdx === i ? null : i)}
              activeOpacity={0.7}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.question}>{faq.q}</Text>
                <Feather name={openIdx === i ? "chevron-up" : "chevron-down"} size={16} color="black" />
              </View>
              {openIdx === i && <Text style={styles.answer}>{faq.a}</Text>}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>{t('contact_support_team') || 'CONTACT SUPPORT TEAM'}</Text>
        
        <View style={styles.contactFormCard}>
          <Text style={styles.formLabel}>{t('select_category') || 'SELECT ISSUE CATEGORY'}</Text>
          <View style={styles.chipRow}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategory(cat)}
                style={[styles.chip, category === cat && styles.chipActive]}
              >
                <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.formLabel}>{t('subject') || 'SUBJECT'}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('subject_placeholder') || 'Brief description of issue...'}
            placeholderTextColor="#777777"
            value={subject}
            onChangeText={setSubject}
          />

          <Text style={styles.formLabel}>{t('detailed_message') || 'DETAILED MESSAGE'}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t('message_placeholder') || 'Describe what happened, including asset IDs or rewards...'}
            placeholderTextColor="#777777"
            multiline
            numberOfLines={4}
            value={message}
            onChangeText={setMessage}
          />

          <TouchableOpacity 
            style={styles.contactBtn} 
            onPress={handleSendMessage}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.contactBtnText}>{t('submit_ticket') || 'SUBMIT SUPPORT TICKET'}</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footerNote}>
          <Feather name="shield" size={14} color="#777777" style={{ marginRight: 6 }} />
          <Text style={styles.footerNoteText}>Rank Cine Support • Grievance Redressal: grievance@rankcine.com</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight, backgroundColor: COLORS.surface },
  headerTitle: { fontSize: 13, fontWeight: '900', letterSpacing: 0.5 },
  sectionTitle: { fontSize: 10, fontWeight: '900', color: COLORS.secondary, letterSpacing: 1, marginBottom: 16 },
  faqList: { gap: 12, marginBottom: 30 },
  faqCard: { borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, padding: 16 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  question: { fontSize: 12, fontWeight: '900', flex: 1, paddingRight: 10, color: '#000000' },
  answer: { fontSize: 11, color: COLORS.textSecondary, lineHeight: 18, marginTop: 12, borderTopWidth: 1, borderTopColor: COLORS.borderLight, paddingTop: 12 },
  contactFormCard: { borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, padding: 20, marginBottom: 20 },
  formLabel: { fontSize: 9, fontWeight: '900', color: '#777777', letterSpacing: 1, marginBottom: 8, marginTop: 12 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  chip: { paddingVertical: 6, paddingHorizontal: 12, borderWidth: 1, borderColor: COLORS.border, backgroundColor: '#f3f3f4' },
  chipActive: { backgroundColor: '#000000', borderColor: '#000000' },
  chipText: { fontSize: 9, fontWeight: '900', color: '#474747' },
  chipTextActive: { color: '#ffffff' },
  input: { borderWidth: 1, borderColor: COLORS.border, padding: 12, fontSize: 12, color: '#000000', backgroundColor: '#ffffff' },
  textArea: { height: 90, textAlignVertical: 'top' },
  contactBtn: { backgroundColor: COLORS.primary, paddingVertical: 14, alignItems: 'center', marginTop: 16 },
  contactBtnText: { color: COLORS.surface, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  footerNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },
  footerNoteText: { fontSize: 9, color: '#777777', fontWeight: '600' }
});