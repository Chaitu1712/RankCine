import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { mobileApi } from '../services/mobileApi';
import { sendPhoneOtp, confirmPhoneOtp } from '../services/firebaseAuth';
import { useLanguage } from '../context/LanguageContext';

const MONTHS = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
const DAYS = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
const YEARS = Array.from({ length: 100 }, (_, i) => (2026 - i).toString());

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

const COUNTRIES = [
  'India', 'United States', 'United Kingdom', 'Canada', 'Australia', 
  'Germany', 'France', 'Singapore', 'United Arab Emirates', 'Other'
];

const STATES_BY_COUNTRY = {
  India: [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
  ],
  'United States': [
    'California', 'New York', 'Texas', 'Florida', 'Illinois', 'Washington', 
    'Massachusetts', 'Georgia', 'North Carolina', 'Other State'
  ]
};

const BlueprintPicker = ({ placeholder, options, value, onSelect }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity 
        style={styles.pickerBtn} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.pickerBtnText, !value && { color: COLORS.textMuted }]}>
          {value || placeholder}
        </Text>
        <Feather name="chevron-down" size={14} color={COLORS.primary} />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.pickerOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.pickerCard}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.pickerOption} 
                  onPress={() => { onSelect(item); setModalVisible(false); }}
                >
                  <Text style={[styles.pickerOptionText, value === item && { fontWeight: '900', color: COLORS.primary }]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default function RegisterScreen({ navigation }) {
  const { t } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [otp, setOtp] = useState('');
  
  const [dobMonth, setDobMonth] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [dobYear, setDobYear] = useState('');

  const [street, setStreet] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [stateProv, setStateProv] = useState('');
  const [country, setCountry] = useState('India');

  const [languages, setLanguages] = useState(['English']);
  const [langInput, setLanguagesInput] = useState('');
  const [gender, setGender] = useState('');

  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [error, setError] = useState('');
  const [showDialModal, setShowDialModal] = useState(false);

  // Stores Firebase confirmation session
  const [confirmationResult, setConfirmationResult] = useState(null);

  const availableStates = STATES_BY_COUNTRY[country] || ['General Region', 'Other'];

  const getFormattedPhone = () => {
    return `${countryCode}${phoneDigits.trim()}`.replace(/\s+/g, '');
  };

  const handleSendOtp = async () => {
    if (!phoneDigits.trim()) {
      Alert.alert('Required', 'Please enter your mobile phone number.');
      return;
    }

    try {
      setSendingOtp(true);
      setError('');
      const fullPhone = getFormattedPhone();

      const confirmation = await sendPhoneOtp(fullPhone);
      setConfirmationResult(confirmation);

      Alert.alert('OTP Sent', `Verification code dispatched to ${fullPhone}`);
    } catch (err) {
      console.error('Firebase Phone Auth Error:', err);
      Alert.alert('SMS Error', err.message || 'Failed to dispatch verification OTP.');
    } finally {
      setSendingOtp(false);
    }
  };

  const addLanguage = () => {
    if (langInput.trim() && !languages.includes(langInput.trim())) {
      setLanguages([...languages, langInput.trim()]);
      setLanguagesInput('');
    }
  };

  const removeLanguage = (lang) => {
    if (languages.length > 1) {
      setLanguages(languages.filter(l => l !== lang));
    }
  };

  const handleRegister = async () => {
    if (!fullName.trim() || !username.trim() || !email.trim() || !phoneDigits.trim()) {
      setError('Full Name, Username, Email, and Phone Number are required.');
      return;
    }

    if (!otp.trim()) {
      setError('Please enter the 6-digit verification OTP code.');
      return;
    }

    if (!confirmationResult) {
      setError('Please request an SMS verification code first.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const fullPhone = getFormattedPhone();

      // 1. Confirm OTP with Firebase and receive signed JWT
      const { idToken } = await confirmPhoneOtp(confirmationResult, otp);

      // 2. Submit verified profile to backend
      const payload = {
        fullName: fullName.trim(),
        username: username.trim(),
        email: email.trim().toLowerCase(),
        phoneNumber: fullPhone,
        firebaseIdToken: idToken,
        dob: (dobMonth && dobDay && dobYear) ? { month: dobMonth, day: dobDay, year: dobYear } : undefined,
        address: { 
          street: street.trim(), 
          line2: addressLine2.trim(), 
          city: city.trim(), 
          state: stateProv.trim(), 
          country: country.trim() 
        },
        languagesKnown: languages,
        gender: gender || undefined
      };

      const res = await mobileApi.post('/auth/register/consumer', payload);
      await mobileApi.setAuth(res.token, res);
      navigation.replace('Main');
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.message || 'Failed to create profile. Invalid OTP or account already exists.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('create_consumer_profile') || 'CREATE CONSUMER PROFILE'}</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Text style={styles.label}>{t('full_name') || 'FULL NAME'} *</Text>
        <TextInput style={styles.input} placeholder="e.g. Sarah Liao" placeholderTextColor={COLORS.textMuted} value={fullName} onChangeText={setFullName} />

        <Text style={styles.label}>{t('username_handle') || 'USERNAME (@HANDLE)'} *</Text>
        <TextInput style={styles.input} placeholder="e.g. sarah_design" placeholderTextColor={COLORS.textMuted} value={username} onChangeText={setUsername} autoCapitalize="none" />

        <Text style={styles.label}>{t('email') || 'EMAIL ADDRESS'} *</Text>
        <TextInput style={styles.input} placeholder="sarah@gmail.com" placeholderTextColor={COLORS.textMuted} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />

        <Text style={styles.label}>{t('phone_number') || 'PHONE NUMBER'} *</Text>
        <View style={styles.phoneInputRow}>
          <TouchableOpacity 
            style={styles.dialCodeBtn}
            onPress={() => setShowDialModal(true)}
          >
            <Text style={styles.dialCodeText}>{countryCode}</Text>
            <Feather name="chevron-down" size={12} color="#000000" />
          </TouchableOpacity>

          <TextInput 
            style={styles.phoneInput} 
            placeholder="9876543210" 
            placeholderTextColor={COLORS.textMuted} 
            value={phoneDigits} 
            onChangeText={setPhoneDigits} 
            keyboardType="phone-pad" 
          />

          <TouchableOpacity style={styles.otpBtn} onPress={handleSendOtp} disabled={sendingOtp}>
            <Text style={styles.otpBtnText}>{sendingOtp ? 'SENDING...' : 'SEND OTP'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>{t('otp_label') || 'VERIFICATION OTP'} *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="6-digit verification code" 
          placeholderTextColor={COLORS.textMuted} 
          value={otp} 
          onChangeText={setOtp} 
          keyboardType="number-pad" 
        />

        <Text style={styles.label}>{t('date_of_birth') || 'DATE OF BIRTH'}</Text>
        <View style={styles.dobRow}>
          <View style={{ flex: 1.2 }}>
            <Text style={styles.subLabel}>{t('month') || 'MONTH'}</Text>
            <BlueprintPicker placeholder="JANUARY" options={MONTHS} value={dobMonth} onSelect={setDobMonth} />
          </View>
          <View style={{ flex: 0.7 }}>
            <Text style={styles.subLabel}>{t('day') || 'DAY'}</Text>
            <BlueprintPicker placeholder="1" options={DAYS} value={dobDay} onSelect={setDobDay} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.subLabel}>{t('year') || 'YEAR'}</Text>
            <BlueprintPicker placeholder="1998" options={YEARS} value={dobYear} onSelect={setDobYear} />
          </View>
        </View>

        <Text style={styles.label}>{t('country') || 'COUNTRY'}</Text>
        <BlueprintPicker 
          placeholder={t('select_country') || 'Select Country'} 
          options={COUNTRIES} 
          value={country} 
          onSelect={(c) => { setCountry(c); setStateProv(''); }} 
        />

        <View style={styles.multiRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>{t('state_province') || 'STATE / PROVINCE'}</Text>
            <BlueprintPicker 
              placeholder={t('select_state') || 'Select State'} 
              options={availableStates} 
              value={stateProv} 
              onSelect={setStateProv} 
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>{t('city') || 'CITY'}</Text>
            <TextInput style={styles.input} placeholder="e.g. Bengaluru" placeholderTextColor={COLORS.textMuted} value={city} onChangeText={setCity} />
          </View>
        </View>

        <Text style={styles.label}>{t('street_address') || 'STREET ADDRESS'}</Text>
        <TextInput style={styles.input} placeholder="124 Structural Grid Ave" placeholderTextColor={COLORS.textMuted} value={street} onChangeText={setStreet} />
        
        <Text style={styles.label}>{t('address_line_2') || 'ADDRESS LINE 2 (OPTIONAL)'}</Text>
        <TextInput style={styles.input} placeholder="Apt 4B" placeholderTextColor={COLORS.textMuted} value={addressLine2} onChangeText={setAddressLine2} />

        <Text style={styles.label}>{t('languages_known') || 'LANGUAGES KNOWN'}</Text>
        <View style={styles.langRow}>
          <TextInput 
            style={[styles.input, { flex: 1, marginBottom: 0 }]} 
            placeholder="Add language (e.g. Hindi, Spanish)" 
            placeholderTextColor={COLORS.textMuted}
            value={langInput}
            onChangeText={setLanguagesInput}
            onSubmitEditing={addLanguage}
          />
          <TouchableOpacity style={styles.addBtn} onPress={addLanguage}>
            <Text style={styles.addBtnText}>+ ADD</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.chipContainer}>
          {languages.map((lang) => (
            <View key={lang} style={styles.chip}>
              <Text style={styles.chipText}>{lang.toUpperCase()}</Text>
              <TouchableOpacity onPress={() => removeLanguage(lang)}>
                <Feather name="x" size={12} color="black" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Text style={styles.label}>{t('gender_optional') || 'GENDER (OPTIONAL)'}</Text>
        <View style={styles.genderBox}>
          <TouchableOpacity onPress={() => setGender('MALE')} style={styles.genderOption}>
            <Text style={[styles.genderText, gender === 'MALE' && styles.genderTextActive]}>{t('male') || 'MALE'}</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity onPress={() => setGender('FEMALE')} style={styles.genderOption}>
            <Text style={[styles.genderText, gender === 'FEMALE' && styles.genderTextActive]}>{t('female') || 'FEMALE'}</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity onPress={() => setGender('OTHER')} style={styles.genderOption}>
            <Text style={[styles.genderText, gender === 'OTHER' && styles.genderTextActive]}>{t('other') || 'OTHER'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleRegister} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={COLORS.surface} size="small" />
          ) : (
            <Text style={styles.submitBtnText}>{t('complete_profile_button') || 'COMPLETE PROFILE ►'}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* DIAL CODE PICKER MODAL */}
      <Modal visible={showDialModal} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.pickerOverlay} activeOpacity={1} onPress={() => setShowDialModal(false)}>
          <View style={styles.pickerCard}>
            <FlatList
              data={COUNTRY_DIAL_CODES}
              keyExtractor={(item) => item.code + item.iso}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.pickerOption} 
                  onPress={() => { setCountryCode(item.code); setShowDialModal(false); }}
                >
                  <Text style={styles.pickerOptionText}>{item.country} ({item.iso}) - {item.code}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight, backgroundColor: COLORS.surface },
  headerTitle: { fontSize: 13, fontWeight: '900', letterSpacing: 0.5 },
  errorBox: { backgroundColor: '#ffebee', borderWidth: 1, borderColor: '#ffcdd2', padding: 12, marginBottom: 16 },
  errorText: { color: '#c62828', fontSize: 11, fontWeight: 'bold' },
  label: { fontSize: 9, fontWeight: '900', marginBottom: 6, marginTop: 14, color: COLORS.textSecondary, textTransform: 'uppercase' },
  subLabel: { fontSize: 8, fontWeight: '900', marginBottom: 4, textAlign: 'center', color: COLORS.textSecondary, letterSpacing: 0.5 },
  input: { borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, padding: 12, fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  phoneInputRow: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  dialCodeBtn: { borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 10, backgroundColor: '#f3f3f4', flexDirection: 'row', alignItems: 'center', gap: 4 },
  dialCodeText: { fontSize: 11, fontMono: true, fontWeight: 'bold' },
  phoneInput: { flex: 1, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, padding: 12, fontSize: 12, fontWeight: 'bold' },
  otpBtn: { borderWidth: 1, borderColor: '#000000', paddingHorizontal: 12, justifyContent: 'center', backgroundColor: '#f3f3f4' },
  otpBtnText: { fontSize: 8, fontWeight: '900', textAlign: 'center' },
  dobRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  multiRow: { flexDirection: 'row', gap: 10 },
  pickerBtn: { borderWidth: 1, borderColor: COLORS.border, padding: 12, backgroundColor: COLORS.surface, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  pickerBtnText: { fontSize: 11, fontWeight: 'bold', color: COLORS.primary },
  pickerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 30 },
  pickerCard: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.primary, maxHeight: 300 },
  pickerOption: { padding: 14, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  pickerOptionText: { fontSize: 11, fontWeight: '600', color: COLORS.textSecondary },
  langRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  addBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 16, justifyContent: 'center' },
  addBtnText: { color: COLORS.surface, fontSize: 10, fontWeight: '900' },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, paddingVertical: 6, paddingHorizontal: 12 },
  chipText: { fontSize: 10, fontWeight: '900' },
  genderBox: { borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, marginBottom: 16 },
  genderOption: { paddingVertical: 12, paddingHorizontal: 16 },
  genderText: { fontSize: 11, color: COLORS.textMuted, fontWeight: 'bold' },
  genderTextActive: { color: COLORS.primary, fontWeight: '900' },
  divider: { height: 1, backgroundColor: COLORS.borderLight },
  submitBtn: { backgroundColor: COLORS.primary, paddingVertical: 18, alignItems: 'center', marginTop: 12, flexDirection: 'row', justifyContent: 'center' },
  submitBtnText: { color: COLORS.surface, fontSize: 12, fontWeight: '900', letterSpacing: 1 }
});