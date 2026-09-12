import React, { useState, useEffect } from 'react';
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
  { country: 'India', code: '+91', iso: 'IN', placeholder: 'e.g. 98765 43210' },
  { country: 'United States', code: '+1', iso: 'US', placeholder: 'e.g. 555-019-2834' },
  { country: 'United Kingdom', code: '+44', iso: 'GB', placeholder: 'e.g. 7911 123456' },
  { country: 'Australia', code: '+61', iso: 'AU', placeholder: 'e.g. 412 345 678' },
  { country: 'United Arab Emirates', code: '+971', iso: 'AE', placeholder: 'e.g. 50 123 4567' },
  { country: 'Germany', code: '+49', iso: 'DE', placeholder: 'e.g. 151 23456789' },
  { country: 'France', code: '+33', iso: 'FR', placeholder: 'e.g. 6 12 34 56 78' },
  { country: 'Singapore', code: '+65', iso: 'SG', placeholder: 'e.g. 9123 4567' },
  { country: 'Japan', code: '+81', iso: 'JP', placeholder: 'e.g. 90 1234 5678' },
  { country: 'South Korea', code: '+82', iso: 'KR', placeholder: 'e.g. 10 1234 5678' },
  { country: 'Spain', code: '+34', iso: 'ES', placeholder: 'e.g. 612 34 56 78' },
  { country: 'Saudi Arabia', code: '+966', iso: 'SA', placeholder: 'e.g. 50 123 4567' }
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

const formatPhoneDigits = (rawText, dialCode) => {
  const digits = rawText.replace(/\D/g, '');
  if (dialCode === '+1') {
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }
  if (dialCode === '+91') {
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)} ${digits.slice(5, 10)}`;
  }
  return digits;
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

export default function RegisterScreen({ route, navigation }) {
  const { t } = useLanguage();
  const { prefilledPhone } = route.params || {};

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [otp, setOtp] = useState('');
  
  const [dobMonth, setDobMonth] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [dobYear, setDobYear] = useState('');

  // Subtask 3.4: Landmark field & structured address
  const [street, setStreet] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [stateProv, setStateProv] = useState('');
  const [country, setCountry] = useState('India');

  const [languages, setLanguages] = useState(['English']);
  const [langInput, setLanguagesInput] = useState('');
  const [gender, setGender] = useState('');

  // Subtask 3.4: Accordion expand/collapse states
  const [showDobWhy, setShowDobWhy] = useState(false);
  const [showAddressWhy, setShowAddressWhy] = useState(false);

  // Subtask 3.3: Inline validation touched states
  const [touched, setTouched] = useState({});

  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [error, setError] = useState('');
  const [showDialModal, setShowDialModal] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const availableStates = STATES_BY_COUNTRY[country] || ['General Region', 'Other'];
  const selectedCountryObj = COUNTRY_DIAL_CODES.find(c => c.code === countryCode) || COUNTRY_DIAL_CODES[0];

  // Subtask 3.3: Consume auto-prefilled phone number
  useEffect(() => {
    if (prefilledPhone) {
      const trimmed = prefilledPhone.trim();
      const matched = COUNTRY_DIAL_CODES.find(c => trimmed.startsWith(c.code));
      if (matched) {
        setCountryCode(matched.code);
        const rawDigits = trimmed.replace(matched.code, '').replace(/\D/g, '');
        setPhoneDigits(formatPhoneDigits(rawDigits, matched.code));
      } else {
        setPhoneDigits(formatPhoneDigits(trimmed.replace(/\D/g, ''), countryCode));
      }
    }
  }, [prefilledPhone]);

  const getCleanPhone = () => {
    const raw = phoneDigits.replace(/\D/g, '');
    return `${countryCode}${raw}`;
  };

  const handlePhoneChange = (text) => {
    setPhoneDigits(formatPhoneDigits(text, countryCode));
  };

  const markTouched = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSendOtp = async () => {
    if (!phoneDigits.trim()) {
      Alert.alert('Required', 'Please enter your mobile phone number.');
      return;
    }

    try {
      setSendingOtp(true);
      setError('');
      const fullPhone = getCleanPhone();

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
    markTouched('fullName');
    markTouched('username');
    markTouched('email');
    markTouched('phone');
    markTouched('otp');

    if (!fullName.trim() || !username.trim() || !email.trim() || !phoneDigits.trim()) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (!otp.trim()) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    if (!confirmationResult) {
      setError('Please request an SMS verification code first.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const fullPhone = getCleanPhone();
      const { idToken } = await confirmPhoneOtp(confirmationResult, otp);

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
          landmark: landmark.trim() || undefined,
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
      setError(err.message || 'Failed to create profile. Account may already exist.');
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);

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
        
        {/* Subtask 3.4: Top Mandatory Fields Notice */}
        <View style={styles.mandatoryNotice}>
          <Feather name="info" size={13} color="#000000" />
          <Text style={styles.mandatoryNoticeText}>
            {t('mandatory_fields_notice') || 'Fields marked with a red asterisk (*) are required.'}
          </Text>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Text style={styles.label}>
          {t('full_name') || 'FULL NAME'} <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput 
          style={[styles.input, touched.fullName && !fullName.trim() && styles.inputError]} 
          placeholder="e.g. Sarah Liao" 
          placeholderTextColor={COLORS.textMuted} 
          value={fullName} 
          onChangeText={setFullName}
          onBlur={() => markTouched('fullName')}
        />

        <Text style={styles.label}>
          {t('username_handle') || 'USERNAME (@HANDLE)'} <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput 
          style={[styles.input, touched.username && !username.trim() && styles.inputError]} 
          placeholder="e.g. sarah_design" 
          placeholderTextColor={COLORS.textMuted} 
          value={username} 
          onChangeText={setUsername} 
          autoCapitalize="none"
          onBlur={() => markTouched('username')}
        />

        <Text style={styles.label}>
          {t('email') || 'EMAIL ADDRESS'} <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput 
          style={[styles.input, touched.email && (!email.trim() || !isValidEmail(email)) && styles.inputError]} 
          placeholder="sarah@gmail.com" 
          placeholderTextColor={COLORS.textMuted} 
          value={email} 
          onChangeText={setEmail} 
          autoCapitalize="none" 
          keyboardType="email-address"
          onBlur={() => markTouched('email')}
        />

        <Text style={styles.label}>
          {t('phone_number') || 'PHONE NUMBER'} <Text style={styles.asterisk}>*</Text>
        </Text>
        <View style={styles.phoneInputRow}>
          <TouchableOpacity 
            style={styles.dialCodeBtn}
            onPress={() => setShowDialModal(true)}
          >
            <Text style={styles.dialCodeText}>{countryCode}</Text>
            <Feather name="chevron-down" size={12} color="#000000" />
          </TouchableOpacity>

          <TextInput 
            style={[styles.phoneInput, touched.phone && !phoneDigits.trim() && styles.inputError]} 
            placeholder={selectedCountryObj.placeholder} 
            placeholderTextColor={COLORS.textMuted} 
            value={phoneDigits} 
            onChangeText={handlePhoneChange} 
            keyboardType="phone-pad" 
            onBlur={() => markTouched('phone')}
          />

          <TouchableOpacity style={styles.otpBtn} onPress={handleSendOtp} disabled={sendingOtp}>
            <Text style={styles.otpBtnText}>{sendingOtp ? 'SENDING...' : 'SEND OTP'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>
          {t('otp_label') || 'VERIFICATION OTP'} <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput 
          style={[styles.input, touched.otp && !otp.trim() && styles.inputError]} 
          placeholder="6-digit verification code" 
          placeholderTextColor={COLORS.textMuted} 
          value={otp} 
          onChangeText={setOtp} 
          keyboardType="number-pad" 
          onBlur={() => markTouched('otp')}
        />

        {/* Subtask 3.4: Date of Birth Section with Accordion */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.label}>{t('date_of_birth') || 'DATE OF BIRTH'}</Text>
          <TouchableOpacity onPress={() => setShowDobWhy(!showDobWhy)} style={styles.whyToggle}>
            <Feather name="help-circle" size={11} color="#5e5e5e" />
            <Text style={styles.whyToggleText}>{t('why_needed') || '[ Why is this needed? ]'}</Text>
          </TouchableOpacity>
        </View>

        {showDobWhy && (
          <View style={styles.whyCard}>
            <Text style={styles.whyCardText}>
              {t('dob_explanation') || 'Required to filter content age ratings (ALL, 13+, 16+, 18+) and comply with statutory verification under the Digital Personal Data Protection (DPDP) Act 2023.'}
            </Text>
          </View>
        )}

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

        {/* Subtask 3.4: Structured Address Card with Accordion & Landmark */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.label}>{t('address_details') || 'PHYSICAL ADDRESS'}</Text>
          <TouchableOpacity onPress={() => setShowAddressWhy(!showAddressWhy)} style={styles.whyToggle}>
            <Feather name="help-circle" size={11} color="#5e5e5e" />
            <Text style={styles.whyToggleText}>{t('why_needed') || '[ Why is this needed? ]'}</Text>
          </TouchableOpacity>
        </View>

        {showAddressWhy && (
          <View style={styles.whyCard}>
            <Text style={styles.whyCardText}>
              {t('address_explanation') || 'Required for regional audience consensus modeling and statutory compliance (TDS Section 194R under the Income Tax Act) when issuing Rate-to-Earn sponsor vouchers.'}
            </Text>
          </View>
        )}

        <View style={styles.structuredAddressCard}>
          <Text style={styles.subLabel}>{t('country') || 'COUNTRY'}</Text>
          <BlueprintPicker 
            placeholder={t('select_country') || 'Select Country'} 
            options={COUNTRIES} 
            value={country} 
            onSelect={(c) => { setCountry(c); setStateProv(''); }} 
          />

          <View style={styles.multiRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.subLabel}>{t('state_province') || 'STATE / PROVINCE'}</Text>
              <BlueprintPicker 
                placeholder={t('select_state') || 'Select State'} 
                options={availableStates} 
                value={stateProv} 
                onSelect={setStateProv} 
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.subLabel}>{t('city') || 'CITY'}</Text>
              <TextInput 
                style={styles.input} 
                placeholder="e.g. Bengaluru" 
                placeholderTextColor={COLORS.textMuted} 
                value={city} 
                onChangeText={setCity} 
              />
            </View>
          </View>

          <Text style={styles.subLabel}>{t('street_address') || 'STREET ADDRESS'}</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g. 124 Structural Grid Ave" 
            placeholderTextColor={COLORS.textMuted} 
            value={street} 
            onChangeText={setStreet} 
          />
          
          <Text style={styles.subLabel}>{t('address_line_2') || 'ADDRESS LINE 2 (OPTIONAL)'}</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g. Apt 4B, Tower 2" 
            placeholderTextColor={COLORS.textMuted} 
            value={addressLine2} 
            onChangeText={setAddressLine2} 
          />

          <Text style={styles.subLabel}>{t('landmark_optional') || 'LANDMARK (OPTIONAL)'}</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g. Near Metro Station / Opposite Central Park" 
            placeholderTextColor={COLORS.textMuted} 
            value={landmark} 
            onChangeText={setLandmark} 
          />
        </View>

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

        {/* Subtask 3.4: "Doesn't want to disclose" Gender Option */}
        <Text style={styles.label}>{t('gender_optional') || 'GENDER (OPTIONAL)'}</Text>
        <View style={styles.genderBox}>
          <TouchableOpacity onPress={() => setGender('MALE')} style={styles.genderOption}>
            <Text style={[styles.genderText, gender === 'MALE' && styles.genderTextActive]}>
              {t('male') || 'MALE'}
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity onPress={() => setGender('FEMALE')} style={styles.genderOption}>
            <Text style={[styles.genderText, gender === 'FEMALE' && styles.genderTextActive]}>
              {t('female') || 'FEMALE'}
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity onPress={() => setGender('PREFER_NOT_TO_DISCLOSE')} style={styles.genderOption}>
            <Text style={[styles.genderText, gender === 'PREFER_NOT_TO_DISCLOSE' && styles.genderTextActive]}>
              {t('gender_undisclosed') || "DOESN'T WANT TO DISCLOSE"}
            </Text>
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

      {/* Country Dial Code Picker */}
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
  mandatoryNotice: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#f3f3f4', borderWidth: 1, borderColor: '#c6c6c6', padding: 10, marginBottom: 16 },
  mandatoryNoticeText: { fontSize: 10, fontMono: true, color: '#000000', fontWeight: 'bold' },
  asterisk: { color: COLORS.danger, fontWeight: '900' },
  errorBox: { backgroundColor: '#ffebee', borderWidth: 1, borderColor: '#ffcdd2', padding: 12, marginBottom: 16 },
  errorText: { color: '#c62828', fontSize: 11, fontWeight: 'bold' },
  label: { fontSize: 9, fontWeight: '900', marginBottom: 6, marginTop: 14, color: COLORS.textSecondary, textTransform: 'uppercase' },
  subLabel: { fontSize: 8, fontWeight: '900', marginBottom: 4, color: COLORS.textSecondary, letterSpacing: 0.5 },
  input: { borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, padding: 12, fontSize: 12, fontWeight: 'bold', marginBottom: 6 },
  inputError: { borderColor: COLORS.danger, borderWidth: 1.5 },
  phoneInputRow: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  dialCodeBtn: { borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 10, backgroundColor: '#f3f3f4', flexDirection: 'row', alignItems: 'center', gap: 4 },
  dialCodeText: { fontSize: 11, fontMono: true, fontWeight: 'bold' },
  phoneInput: { flex: 1, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, padding: 12, fontSize: 12, fontWeight: 'bold' },
  otpBtn: { borderWidth: 1, borderColor: '#000000', paddingHorizontal: 12, justifyContent: 'center', backgroundColor: '#f3f3f4' },
  otpBtnText: { fontSize: 8, fontWeight: '900', textAlign: 'center' },
  dobRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  multiRow: { flexDirection: 'row', gap: 10 },
  pickerBtn: { borderWidth: 1, borderColor: COLORS.border, padding: 12, backgroundColor: COLORS.surface, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  pickerBtnText: { fontSize: 11, fontWeight: 'bold', color: COLORS.primary },
  pickerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 30 },
  pickerCard: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.primary, maxHeight: 300 },
  pickerOption: { padding: 14, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  pickerOptionText: { fontSize: 11, fontWeight: '600', color: COLORS.textSecondary },

  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 14, marginBottom: 6 },
  whyToggle: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  whyToggleText: { fontSize: 9, color: '#5e5e5e', fontWeight: 'bold' },
  whyCard: { backgroundColor: '#f3f3f4', borderWidth: 1, borderColor: '#c6c6c6', padding: 10, marginBottom: 8 },
  whyCardText: { fontSize: 9, color: '#474747', lineHeight: 14 },
  structuredAddressCard: { borderWidth: 1, borderColor: '#c6c6c6', backgroundColor: '#fafafa', padding: 14, marginBottom: 10 },

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