import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

export default function LegalModal({ visible, title, onClose }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('PRIVACY');

  const displayTitle = title ? title.toUpperCase() : (t('terms_privacy_title') || 'TERMS & PRIVACY POLICY');

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Feather name="x" size={20} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>{displayTitle}</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.tabBar}>
          <TouchableOpacity 
            style={[styles.tabItem, activeTab === 'PRIVACY' && styles.tabItemActive]}
            onPress={() => setActiveTab('PRIVACY')}
          >
            <Text style={[styles.tabText, activeTab === 'PRIVACY' && styles.tabTextActive]}>
              {t('privacy_policy_tab') || 'PRIVACY POLICY (DPDP 2023)'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabItem, activeTab === 'TERMS' && styles.tabItemActive]}
            onPress={() => setActiveTab('TERMS')}
          >
            <Text style={[styles.tabText, activeTab === 'TERMS' && styles.tabTextActive]}>
              {t('terms_of_service_tab') || 'TERMS OF SERVICE'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
          <Text style={styles.effectiveDate}>
            {t('legal_compliance_header') || 'COMPLIANCE: INDIA DIGITAL PERSONAL DATA PROTECTION ACT 2023 • IT ACT 2000'}
          </Text>
          
          {activeTab === 'PRIVACY' ? (
            <Text style={styles.legalBody}>
{`1. DATA FIDUCIARY IDENTIFICATION
Rank Cine Technologies Private Limited ("Rank Cine", "We", "Us") operates as the Data Fiduciary under the Digital Personal Data Protection (DPDP) Act, 2023, and Information Technology Act, 2000.

2. CATEGORIES OF PERSONAL DATA COLLECTED
We collect personal data necessary for content discovery, multimodal review evaluation, and Rate-to-Earn reward processing:
• Identity & Contact: Full Name, Email Address, Verified Mobile Phone Number, Date of Birth, Gender, Address.
• Biometrics & Multimodal Content: Spoken Audio Review Recordings, Video Review Clips, Text Evaluations.
• Technical & Device Identifiers: Device IP Address, Hardware OS version, Geo-location indicators.

3. PURPOSE OF PROCESSING & CONSENT
By registering on Rank Cine, you provide explicit, free, specific, informed consent to process data for:
• Synthesizing narrative summaries and sentiment scores via Google Gemini AI models.
• Calculating accuracy percentiles and disbursing commercial sponsor reward vouchers.
• Detecting fraud, automated bot activity, and profanity infractions.

4. DATA PRINCIPAL RIGHTS (DPDP ACT 2023)
Under Indian law, you hold the following statutory rights:
• Right to Access: Request a summary of personal data processed by Rank Cine.
• Right to Correction & Erasure: Update inaccurate details or request account erasure.
• Right of Grievance Redressal: Seek immediate redressal for privacy concerns.
• Right to Nominate: Nominate any individual to exercise rights in event of incapacity.

5. DATA RETENTION & THIRD-PARTY PROCESSORS
Raw audio and video review recordings are stored in encrypted cloud repositories and shared with Google Cloud AI APIs solely for processing transcription and sentiment metrics. Data is retained for as long as your account remains active.

6. GRIEVANCE REDRESSAL OFFICER
In compliance with Rule 3(2) of Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021:
Grievance Officer: Legal & Compliance Department
Email: grievance@rankcine.com
Address: Rank Cine Technologies Pvt. Ltd., Tech Park Road, Bengaluru, Karnataka - 560103, India.`}
            </Text>
          ) : (
            <Text style={styles.legalBody}>
{`1. PLATFORM LICENSE & ACCOUNT INTEGRITY
Rank Cine grants you a limited, non-transferable, revocable license to access content, submit reviews, and participate in Rate-to-Earn campaigns. You must be at least 18 years of age or access the app under parental supervision.

2. RATE-TO-EARN & SPONSOR INCENTIVES
• Percentile thresholds are determined dynamically by AI consensus algorithms.
• Commercial vouchers are subject to sponsor availability and statutory tax deductions (TDS under Section 194R of the Income Tax Act, 1961) where applicable.
• Any attempt to manipulate ratings using automated scripts, bots, multiple fake accounts, or collusive networks will lead to instant account termination and voucher forfeiture.

3. USER-GENERATED CONTENT & INTELLECTUAL PROPERTY
By submitting text, audio, or video reviews, you grant Rank Cine a perpetual, worldwide, royalty-free license to transcribe, summarize, host, and display the content to creators and platform users.

4. PROHIBITED CONDUCT
Users shall not upload content that is grossly harmful, harassing, defamatory, obscene, invasive of privacy, infringing of copyright, or threatening the unity, integrity, defence, or security of India.

5. GOVERNING LAW & JURISDICTION
These Terms shall be governed by and construed in accordance with the laws of the Republic of India. Courts at Bengaluru, Karnataka, India shall have exclusive jurisdiction over all disputes.`}
            </Text>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.acceptBtn} onPress={onClose}>
            <Text style={styles.acceptBtnText}>
              {t('understand_accept_policies') || 'I UNDERSTAND & ACCEPT POLICIES'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  title: { fontSize: 13, fontWeight: '900', letterSpacing: 1 },
  closeBtn: { padding: 4 },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.borderLight, backgroundColor: '#f3f3f4' },
  tabItem: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabItemActive: { borderBottomColor: '#000000', backgroundColor: '#ffffff' },
  tabText: { fontSize: 9, fontWeight: '900', color: '#777777', letterSpacing: 0.5 },
  tabTextActive: { color: '#000000' },
  effectiveDate: { fontSize: 9, fontWeight: '900', color: COLORS.secondary, marginBottom: 16, letterSpacing: 0.5 },
  legalBody: { fontSize: 11, color: COLORS.textSecondary, lineHeight: 20, fontWeight: '500' },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: COLORS.borderLight },
  acceptBtn: { backgroundColor: COLORS.primary, paddingVertical: 16, alignItems: 'center' },
  acceptBtnText: { color: COLORS.surface, fontSize: 11, fontWeight: '900', letterSpacing: 1 }
});