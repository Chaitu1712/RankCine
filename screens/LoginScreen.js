import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { mobileApi } from '../services/mobileApi';
import { sendPhoneOtp, confirmPhoneOtp } from '../services/firebaseAuth';
import LegalModal from '../components/LegalModal';
import { useLanguage } from '../context/LanguageContext';

const COUNTRY_DIAL_CODES = [
  { country: 'India', code: '+91', iso: 'IN' },
  { country: 'United States', code: '+1', iso: 'US' },
  { country: 'United Kingdom', code: '+44', iso: 'GB' },
  { country: 'Australia', code: '+61', iso: 'AU' },
  { country: 'United Arab Emirates', code: '+971', iso: 'AE' },
  { country: 'Germany', code: '+49', iso: 'DE' },
  { country: 'France', code: '+33', iso: 'FR' },
  { country: 'Singapore', code: '+65', iso: 'SG' },
  { country: 'Japan', code: '+81', iso: 'JP' },
  { country: 'South Korea', code: '+82', iso: 'KR' },
  { country: 'Spain', code: '+34', iso: 'ES' },
  { country: 'Saudi Arabia', code: '+966', iso: 'SA' }
];

export default function LoginScreen({ route, navigation }) {
  const { t } = useLanguage();
  const { pendingReview } = route.params || {};

  const [selectedDialCode, setSelectedDialCode] = useState('+91');
  const [phoneInput, setPhoneInput] = useState('');
  const [otp, setOtp] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showLegal, setShowLegal] = useState(false);
  const [showDialModal, setShowDialModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  // Stores the Firebase confirmation session object
  const [confirmationResult, setConfirmationResult] = useState(null);

  const getFormattedPhone = () => {
    return `${selectedDialCode}${phoneInput.trim()}`.replace(/\s+/g, '');
  };

  // Step 1: Request SMS verification code through native Firebase
  const handleSendOtp = async () => {
    if (!phoneInput.trim()) {
      Alert.alert('Required', 'Please enter your mobile phone number.');
      return;
    }

    try {
      setSendingOtp(true);
      const fullPhone = getFormattedPhone();
      
      const confirmation = await sendPhoneOtp(fullPhone);
      setConfirmationResult(confirmation);

      Alert.alert('OTP Dispatched', `Verification code sent to ${fullPhone}`);
    } catch (err) {
      console.error('Firebase Phone Auth Error:', err);
      Alert.alert('SMS Error', err.message || 'Failed to dispatch verification code via Firebase.');
    } finally {
      setSendingOtp(false);
    }
  };

  // Step 2: Confirm OTP with Firebase, obtain ID Token, authenticate with Backend
  const handleLogin = async () => {
    if (!acceptedTerms) {
      Alert.alert('Terms Required', 'You must accept the Terms of Service & Privacy Policy to continue.');
      return;
    }

    if (!phoneInput.trim()) {
      Alert.alert('Required', 'Please enter your mobile phone number.');
      return;
    }

    if (!otp.trim()) {
      Alert.alert('Required', 'Please enter the 6-digit verification code.');
      return;
    }

    if (!confirmationResult) {
      Alert.alert('Required', 'Please request an OTP code before authenticating.');
      return;
    }

    try {
      setLoading(true);

      const fullPhone = getFormattedPhone();

      // 1. Verify OTP with Firebase and receive signed JWT
      const { idToken } = await confirmPhoneOtp(confirmationResult, otp);

      // 2. Exchange Firebase Token for RankCine User Session on Backend
      const res = await mobileApi.post('/auth/otp/verify', {
        phoneNumber: fullPhone,
        firebaseIdToken: idToken,
      });

      await mobileApi.setAuth(res.token, res);

      // 3. JIT submission if user evaluated prior to login
      if (pendingReview && pendingReview.item?.id) {
        try {
          const formData = new FormData();
          formData.append('mediaItemId', pendingReview.item.id);
          formData.append('rawTextInput', pendingReview.feedback || 'High quality structural layout.');
          formData.append('parameterScores', JSON.stringify(pendingReview.parameterScores || []));

          const reviewRes = await mobileApi.upload('/reviews/submit', formData);
          navigation.replace('ReviewSubmitted', { reviewData: reviewRes });
          return;
        } catch (submitErr) {
          console.error('Pending review submission failed:', submitErr);
        }
      }

      navigation.replace('Main');
    } catch (err) {
      console.error('Login Failed:', err);
      Alert.alert('Authentication Failed', err.message || 'Invalid verification code or account error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.brandHeader}>
          <Text style={styles.brandTitle}>Rank Cine</Text>
          <Text style={styles.brandSubtitle}>{t('consumer_auth') || 'CONSUMER ACCESS PORTAL'}</Text>
        </View>

        {pendingReview && (
          <View style={styles.pendingNotice}>
            <Feather name="info" size={14} color="#000000" />
            <Text style={styles.pendingNoticeText}>
              Authenticate to finalize and submit your evaluation for "{pendingReview.item?.title}".
            </Text>
          </View>
        )}

        <View style={styles.formCard}>
          <Text style={styles.label}>MOBILE PHONE NUMBER</Text>
          <View style={styles.phoneInputRow}>
            <TouchableOpacity 
              style={styles.dialCodeBtn}
              onPress={() => setShowDialModal(true)}
            >
              <Text style={styles.dialCodeText}>{selectedDialCode}</Text>
              <Feather name="chevron-down" size={12} color="#000000" />
            </TouchableOpacity>

            <TextInput 
              style={styles.phoneInput} 
              placeholder="9876543210" 
              placeholderTextColor={COLORS.textMuted}
              keyboardType="phone-pad"
              value={phoneInput}
              onChangeText={setPhoneInput}
            />

            <TouchableOpacity style={styles.otpBtn} onPress={handleSendOtp} disabled={sendingOtp}>
              <Text style={styles.otpBtnText}>{sendingOtp ? 'SENDING...' : 'SEND OTP'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>{t('otp_label') || 'VERIFICATION OTP'}</Text>
          <TextInput 
            style={styles.input} 
            placeholder="6-digit verification code" 
            placeholderTextColor={COLORS.textMuted}
            secureTextEntry
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
          />

          <View style={styles.termsRow}>
            <TouchableOpacity 
              style={[styles.checkbox, acceptedTerms && styles.checkboxActive]}
              onPress={() => setAcceptedTerms(!acceptedTerms)}
            >
              {acceptedTerms && <Feather name="check" size={12} color="white" />}
            </TouchableOpacity>
            <Text style={styles.termsText}>
              {t('accept_terms_prefix') || 'I accept the '}
              <Text style={styles.termsLink} onPress={() => setShowLegal(true)}>
                {t('terms_link') || 'Terms of Service & Privacy Policy'}
              </Text>
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.loginBtn} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.surface} size="small" />
            ) : (
              <Text style={styles.loginBtnText}>{t('login_button') || 'AUTHENTICATE'} ►</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.registerLink} 
          onPress={() => navigation.navigate('Register', { pendingReview })}
        >
          <Text style={styles.registerText}>{t('new_user_register') || 'New consumer? Create an account here.'}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* COUNTRY DIAL CODE MODAL */}
      <Modal visible={showDialModal} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowDialModal(false)}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>SELECT REGION DIAL CODE</Text>
              <TouchableOpacity onPress={() => setShowDialModal(false)}>
                <Feather name="x" size={18} color="#000000" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={COUNTRY_DIAL_CODES}
              keyExtractor={(item) => item.code + item.iso}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dialOption}
                  onPress={() => {
                    setSelectedDialCode(item.code);
                    setShowDialModal(false);
                  }}
                >
                  <Text style={styles.dialCountryText}>{item.country} ({item.iso})</Text>
                  <Text style={styles.dialCodeNumber}>{item.code}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <LegalModal visible={showLegal} title="Terms of Service" onClose={() => setShowLegal(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  brandHeader: { alignItems: 'center', marginTop: 24, marginBottom: 24 },
  brandTitle: { fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  brandSubtitle: { fontSize: 10, fontWeight: '900', color: COLORS.secondary, letterSpacing: 2, marginTop: 4 },
  pendingNotice: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, backgroundColor: COLORS.containerLow, borderWidth: 1, borderColor: '#c6c6c6', marginBottom: 16 },
  pendingNoticeText: { fontSize: 11, fontWeight: 'bold', color: '#000000', flex: 1 },
  formCard: { borderWidth: 1, borderColor: '#000000', backgroundColor: COLORS.surface, padding: 20, marginBottom: 24 },
  label: { fontSize: 9, fontWeight: '900', marginBottom: 6, marginTop: 12, letterSpacing: 0.5 },
  input: { borderWidth: 1, borderColor: COLORS.border, padding: 12, fontSize: 12, fontWeight: 'bold', marginBottom: 4, backgroundColor: '#ffffff' },
  phoneInputRow: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  dialCodeBtn: { borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 10, backgroundColor: '#f3f3f4', flexDirection: 'row', alignItems: 'center', gap: 4 },
  dialCodeText: { fontSize: 11, fontMono: true, fontWeight: 'bold' },
  phoneInput: { flex: 1, borderWidth: 1, borderColor: COLORS.border, padding: 12, fontSize: 12, fontWeight: 'bold', backgroundColor: '#ffffff' },
  otpBtn: { borderWidth: 1, borderColor: '#000000', paddingHorizontal: 12, justifyContent: 'center', backgroundColor: '#f3f3f4' },
  otpBtnText: { fontSize: 8, fontWeight: '900', textAlign: 'center' },
  termsRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16, marginBottom: 20 },
  checkbox: { width: 18, height: 18, borderWidth: 1, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  checkboxActive: { backgroundColor: COLORS.primary },
  termsText: { fontSize: 10, color: COLORS.textSecondary, flex: 1 },
  termsLink: { fontWeight: 'bold', color: COLORS.primary, textDecorationLine: 'underline' },
  loginBtn: { backgroundColor: COLORS.primary, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  loginBtnText: { color: COLORS.surface, fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  registerLink: { alignItems: 'center' },
  registerText: { fontSize: 10, fontWeight: '900', color: COLORS.secondary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#000000', padding: 20, maxHeight: 420 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#e8e8e8', paddingBottom: 12, marginBottom: 8 },
  modalTitle: { fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },
  dialOption: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f3f4' },
  dialCountryText: { fontSize: 11, fontWeight: 'bold', color: '#000000' },
  dialCodeNumber: { fontSize: 11, fontMono: true, fontWeight: 'bold', color: '#5e5e5e' }
});