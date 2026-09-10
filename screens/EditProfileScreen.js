import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Modal, BackHandler, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { mobileApi } from '../services/mobileApi';

const MONTHS = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
const DAYS = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
const YEARS = Array.from({ length: 100 }, (_, i) => (2026 - i).toString());

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

const SUPPORTED_LANGUAGES = [
  { code: 'EN', name: 'English' },
  { code: 'HI', name: 'Hindi' },
  { code: 'TE', name: 'Telugu' },
  { code: 'TA', name: 'Tamil' },
  { code: 'KN', name: 'Kannada' },
  { code: 'ML', name: 'Malayalam' },
  { code: 'BN', name: 'Bengali' },
  { code: 'MR', name: 'Marathi' },
  { code: 'GU', name: 'Gujarati' },
  { code: 'PA', name: 'Punjabi' }
];

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

export default function EditProfileScreen({ navigation }) {
  const [isDirty, setIsDirty] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [selectedLanguages, setSelectedLanguages] = useState(['EN']);

  const [form, setForm] = useState({
    fullName: '', phone: '', email: '', 
    month: '', day: '', year: '', 
    street: '', addressLine2: '', city: '', state: '', country: 'India', 
    gender: ''
  });

  const availableStates = STATES_BY_COUNTRY[form.country] || ['General Region', 'Other'];

  const handleInput = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const toggleLanguage = (code) => {
    if (selectedLanguages.includes(code)) {
      if (selectedLanguages.length === 1) {
        Alert.alert('Required', 'At least one language must remain selected.');
        return;
      }
      setSelectedLanguages(prev => prev.filter(item => item !== code));
    } else {
      setSelectedLanguages(prev => [...prev, code]);
    }
    setIsDirty(true);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await mobileApi.get('/users/me');
        const langString = data.profile?.languagePreferred || 'EN';
        const initialLangs = langString.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);

        setSelectedLanguages(initialLangs.length > 0 ? initialLangs : ['EN']);

        let monthVal = '';
        let dayVal = '';
        let yearVal = '';

        if (data.profile?.dob) {
          const dobParts = String(data.profile.dob).split('T')[0].split('-');
          if (dobParts.length === 3) {
            yearVal = dobParts[0];
            const mIdx = parseInt(dobParts[1], 10) - 1;
            monthVal = MONTHS[mIdx] || '';
            dayVal = parseInt(dobParts[2], 10).toString();
          }
        }

        setForm({
          fullName: data.profile?.fullName || '',
          email: data.email || '',
          phone: data.id || '', 
          gender: data.profile?.gender || '',
          month: monthVal,
          day: dayVal,
          year: yearVal,
          street: data.profile?.address?.street || '',
          addressLine2: data.profile?.address?.line2 || '',
          city: data.profile?.address?.city || '',
          state: data.profile?.address?.state || '',
          country: data.profile?.address?.country || 'India'
        });
      } catch (err) {
        Alert.alert('Error', 'Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (isDirty) {
        setShowWarningModal(true);
        return true; 
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [isDirty]);

  const handleHeaderBack = () => {
    if (isDirty) setShowWarningModal(true);
    else navigation.goBack();
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const dobPayload = (form.year && form.month && form.day) 
        ? { month: form.month, day: form.day, year: form.year } 
        : undefined;

      await mobileApi.patch('/users/me', {
        fullName: form.fullName.trim(),
        languagePreferred: selectedLanguages.join(', '),
        dob: dobPayload,
        gender: form.gender || undefined,
        address: {
          street: form.street.trim(),
          line2: form.addressLine2.trim() || undefined,
          city: form.city.trim(),
          state: form.state.trim(),
          country: form.country.trim()
        }
      });

      setIsDirty(false);
      Alert.alert('Success', 'Profile metadata updated.');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={handleHeaderBack}>
          <Feather name="arrow-left" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EDIT PROFILE</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.label}>FULL NAME</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter full name" 
          placeholderTextColor={COLORS.textMuted} 
          value={form.fullName} 
          onChangeText={(v) => handleInput('fullName', v)} 
        />

        <Text style={styles.label}>PHONE NUMBER</Text>
        <View style={styles.row}>
          <TextInput style={[styles.input, { flex: 1, marginBottom: 0 }]} editable={false} value={form.phone} />
          <TouchableOpacity style={styles.otpBtn}><Text style={styles.otpBtnText}>VERIFIED</Text></TouchableOpacity>
        </View>

        <Text style={styles.label}>EMAIL</Text>
        <View style={styles.row}>
          <TextInput style={[styles.input, { flex: 1, marginBottom: 0 }]} editable={false} value={form.email} />
          <TouchableOpacity style={styles.otpBtn}><Text style={styles.otpBtnText}>VERIFIED</Text></TouchableOpacity>
        </View>

        <Text style={styles.label}>DATE OF BIRTH</Text>
        <View style={styles.dobRow}>
          <View style={{ flex: 1.2 }}>
            <Text style={styles.subLabel}>MONTH</Text>
            <BlueprintPicker placeholder="MONTH" options={MONTHS} value={form.month} onSelect={(v) => handleInput('month', v)} />
          </View>
          <View style={{ flex: 0.7 }}>
            <Text style={styles.subLabel}>DAY</Text>
            <BlueprintPicker placeholder="DAY" options={DAYS} value={form.day} onSelect={(v) => handleInput('day', v)} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.subLabel}>YEAR</Text>
            <BlueprintPicker placeholder="YEAR" options={YEARS} value={form.year} onSelect={(v) => handleInput('year', v)} />
          </View>
        </View>

        <Text style={styles.label}>COUNTRY</Text>
        <BlueprintPicker 
          placeholder="Select Country" 
          options={COUNTRIES} 
          value={form.country} 
          onSelect={(c) => { handleInput('country', c); handleInput('state', ''); }} 
        />

        <View style={styles.dobRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>STATE / PROVINCE</Text>
            <BlueprintPicker 
              placeholder="Select State" 
              options={availableStates} 
              value={form.state} 
              onSelect={(s) => handleInput('state', s)} 
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>CITY</Text>
            <TextInput style={styles.input} placeholder="City" placeholderTextColor={COLORS.textMuted} value={form.city} onChangeText={(v) => handleInput('city', v)}/>
          </View>
        </View>

        <Text style={styles.label}>STREET ADDRESS</Text>
        <TextInput style={styles.input} placeholder="Street address" placeholderTextColor={COLORS.textMuted} value={form.street} onChangeText={(v) => handleInput('street', v)}/>

        <Text style={styles.label}>ADDRESS LINE 2 (OPTIONAL)</Text>
        <TextInput style={styles.input} placeholder="Apt, Suite, Unit" placeholderTextColor={COLORS.textMuted} value={form.addressLine2} onChangeText={(v) => handleInput('addressLine2', v)}/>

        <Text style={styles.label}>LANGUAGES KNOWN</Text>
        <TouchableOpacity 
          style={styles.selectLanguageBox} 
          onPress={() => setShowLanguageModal(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.selectLanguageText}>Select More Language</Text>
          <Feather name="chevron-down" size={16} color={COLORS.primary} />
        </TouchableOpacity>

        <View style={styles.chipsContainer}>
          {selectedLanguages.map(code => (
            <TouchableOpacity 
              key={code} 
              style={styles.langChip} 
              onPress={() => toggleLanguage(code)}
            >
              <Text style={styles.langChipText}>{code}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>GENDER (OPTIONAL)</Text>
        <View style={styles.genderBox}>
          <TouchableOpacity onPress={() => handleInput('gender', 'MALE')}>
            <Text style={[styles.genderText, form.gender === 'MALE' && { fontWeight: '900', color: COLORS.primary }]}>MALE</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity onPress={() => handleInput('gender', 'FEMALE')}>
            <Text style={[styles.genderText, form.gender === 'FEMALE' && { fontWeight: '900', color: COLORS.primary }]}>FEMALE</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity onPress={() => handleInput('gender', 'OTHER')}>
            <Text style={[styles.genderText, form.gender === 'OTHER' && { fontWeight: '900', color: COLORS.primary }]}>OTHER</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.saveBtn, !isDirty && { opacity: 0.5 }]} onPress={handleSave} disabled={saving || !isDirty}>
          <Text style={styles.saveBtnText}>{saving ? 'SAVING...' : 'SAVE PROFILE'}</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Multi-Select Language Modal */}
      <Modal visible={showLanguageModal} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.pickerOverlay} activeOpacity={1} onPress={() => setShowLanguageModal(false)}>
          <View style={styles.pickerCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>SELECT LANGUAGES KNOWN</Text>
              <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                <Feather name="x" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={SUPPORTED_LANGUAGES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => {
                const isSelected = selectedLanguages.includes(item.code);
                return (
                  <TouchableOpacity 
                    style={[styles.pickerOption, isSelected && { backgroundColor: COLORS.containerLow }]} 
                    onPress={() => toggleLanguage(item.code)}
                  >
                    <Text style={[styles.pickerOptionText, isSelected && { fontWeight: '900', color: COLORS.primary }]}>
                      {item.name} ({item.code})
                    </Text>
                    {isSelected && <Feather name="check" size={16} color={COLORS.primary} />}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Discard Changes Warning Modal */}
      <Modal visible={showWarningModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.warningCard}>
            <View style={styles.warningHeaderLine} />
            <TouchableOpacity style={styles.closeWarning} onPress={() => setShowWarningModal(false)}>
              <Feather name="x" size={20} color={COLORS.primary} />
            </TouchableOpacity>

            <Text style={styles.warningTitle}>CHANGES MADE WILL NOT BE SAVED</Text>
            <Text style={styles.warningSub}>DO YOU WANT TO DISCARD CHANGES AND EXIT?</Text>

            <View style={styles.warningActions}>
              <TouchableOpacity style={styles.yesBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.yesText}>DISCARD</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.noBtn} onPress={() => setShowWarningModal(false)}>
                <Text style={styles.noText}>KEEP EDITING</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight, backgroundColor: COLORS.surface },
  headerTitle: { fontSize: 13, fontWeight: '900', color: COLORS.primary },
  
  label: { fontSize: 9, fontWeight: '900', marginBottom: 6, marginTop: 14, textTransform: 'uppercase', color: COLORS.textSecondary, letterSpacing: 0.5 },
  subLabel: { fontSize: 8, fontWeight: '900', marginBottom: 4, textAlign: 'center', color: COLORS.textSecondary, letterSpacing: 0.5 },
  input: { borderWidth: 1, borderColor: COLORS.primary, backgroundColor: COLORS.surface, padding: 12, fontSize: 12, fontWeight: 'bold', color: COLORS.primary, marginBottom: 4 },
  row: { flexDirection: 'row', gap: 8, alignItems: 'stretch' },
  otpBtn: { borderWidth: 1, borderColor: COLORS.borderLight, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 12, backgroundColor: COLORS.containerLow },
  otpBtnText: { fontSize: 9, fontWeight: '900', textAlign: 'center', color: COLORS.textMuted },
  dobRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  
  pickerBtn: { borderWidth: 1, borderColor: COLORS.primary, padding: 12, backgroundColor: COLORS.surface, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  pickerBtnText: { fontSize: 11, fontWeight: 'bold', color: COLORS.primary },
  
  selectLanguageBox: { 
    borderWidth: 1, 
    borderColor: COLORS.primary, 
    backgroundColor: COLORS.surface, 
    padding: 14, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 6 
  },
  selectLanguageText: { fontSize: 13, color: COLORS.primary, fontWeight: '500' },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  langChip: { borderWidth: 1, borderColor: COLORS.primary, paddingHorizontal: 10, paddingVertical: 2, backgroundColor: COLORS.surface },
  langChipText: { fontSize: 10, fontWeight: '900', color: COLORS.primary },

  pickerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 30 },
  pickerCard: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.primary, maxHeight: 360 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  modalHeaderTitle: { fontSize: 11, fontWeight: '900', color: COLORS.primary },
  pickerOption: { padding: 14, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pickerOptionText: { fontSize: 11, fontWeight: '600', color: COLORS.textSecondary },

  genderBox: { borderWidth: 1, borderColor: COLORS.primary, paddingVertical: 2, marginBottom: 24, backgroundColor: COLORS.surface },
  genderText: { fontSize: 11, paddingVertical: 10, paddingHorizontal: 16, color: COLORS.textSecondary, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: COLORS.borderLight },

  saveBtn: { backgroundColor: COLORS.primary, paddingVertical: 16, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: COLORS.surface, fontSize: 12, fontWeight: '900', letterSpacing: 1 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  warningCard: { backgroundColor: COLORS.surface, width: '100%', padding: 28, alignItems: 'center', paddingTop: 40, position: 'relative', borderWidth: 1, borderColor: COLORS.primary },
  warningHeaderLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 3, backgroundColor: COLORS.primary },
  closeWarning: { position: 'absolute', top: 12, right: 12 },
  warningTitle: { fontSize: 14, fontWeight: '900', textAlign: 'center', marginBottom: 12, color: COLORS.primary },
  warningSub: { fontSize: 11, fontWeight: '600', textAlign: 'center', marginBottom: 24, color: COLORS.textSecondary },
  warningActions: { flexDirection: 'row', gap: 12, width: '100%' },
  yesBtn: { flex: 1, backgroundColor: COLORS.primary, paddingVertical: 14, alignItems: 'center' },
  yesText: { color: COLORS.surface, fontSize: 11, fontWeight: '900' },
  noBtn: { flex: 1, backgroundColor: '#ffffff', paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.primary },
  noText: { color: COLORS.primary, fontSize: 11, fontWeight: '900' }
});