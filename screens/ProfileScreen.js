import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, useTheme } from '../constants/theme';
import { mobileApi, resolveMediaUrl } from '../services/mobileApi';
import { useLanguage } from '../context/LanguageContext';

export default function ProfileScreen({ navigation }) {
  const { t } = useLanguage();
  const { theme, highContrast } = useTheme();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = await mobileApi.getToken();
      if (!token) {
        setIsAuthenticated(false);
        setProfile(null);
        return;
      }

      setIsAuthenticated(true);
      const data = await mobileApi.get('/users/me');
      setProfile(data);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProfile();
    });
    return unsubscribe;
  }, [navigation]);

  const handleSelectAvatar = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'Permission to access photo gallery is required to upload profile pictures.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      uploadAvatarAsset(asset);
    }
  };

  const uploadAvatarAsset = async (asset) => {
    try {
      setUploadingAvatar(true);

      const fileName = asset.fileName || `avatar_${Date.now()}.jpg`;
      const fileType = asset.mimeType || 'image/jpeg';
      const fileUri = Platform.OS === 'ios' ? asset.uri.replace('file://', '') : asset.uri;

      const formData = new FormData();
      formData.append('avatar', {
        uri: fileUri,
        name: fileName,
        type: fileType,
      });

      const res = await mobileApi.upload('/users/me/avatar', formData);
      
      if (res && res.avatarUrl) {
        setProfile(prev => prev ? {
          ...prev,
          profile: { ...prev.profile, avatarUrl: res.avatarUrl }
        } : prev);
      }

      await fetchProfile();
      Alert.alert('Photo Updated', 'Your profile picture has been updated successfully.');
    } catch (err) {
      console.error('Avatar upload failed:', err);
      Alert.alert('Upload Error', err.message || 'Failed to upload profile picture.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleLogout = async () => {
    await mobileApi.clearAuth();
    setIsAuthenticated(false);
    setProfile(null);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Language' }],
    });
  };

  const rawAvatarUrl = profile?.profile?.avatarUrl;
  const avatarSource = rawAvatarUrl ? resolveMediaUrl(rawAvatarUrl) : null;

  const displayName = profile?.profile?.fullName || 'Consumer User';
  const displayHandle = profile?.profile?.username ? `@${profile.profile.username}` : (profile?.email || '@user');
  const reviewCount = profile?.profile?.totalReviewsCount ?? 0;
  
  const accuracyPercentile = Number(profile?.profile?.accuracyPercentile || 0);
  const clampedPercentile = Math.min(Math.max(accuracyPercentile, 0), 100);

  const getTierLabel = (pct) => {
    if (pct >= 95) return 'TIER 1 • ELITE AUDITOR (TOP 5%)';
    if (pct >= 90) return 'TIER 2 • TOP 10% CONSENSUS';
    if (pct >= 75) return 'TIER 3 • ACCURACY VERIFIED';
    return 'TIER 4 • COMMUNITY AUDITOR';
  };

  if (!loading && !isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.unauthContainer}>
          <View style={styles.unauthIconBox}>
            <Feather name="user" size={36} color="#ffffff" />
          </View>
          <Text style={styles.unauthTitle}>GUEST CONSUMER</Text>
          <Text style={styles.unauthSub}>
            Sign in to track your review archive, unlock consensus sponsor vouchers, and manage your account.
          </Text>
          <TouchableOpacity 
            style={styles.signInButton} 
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.signInButtonText}>{t('login_button')} ►</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.headerRow, { borderBottomColor: theme.borderLight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={20} color={theme.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.primary }]}>{t('tab_profile') || 'CONSUMER AUDIT PROFILE'}</Text>
        
        {/* Subtask 3.1: Header gear icon navigates directly to Settings */}
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Feather name="sliders" size={20} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.mainContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.profileBox, { borderColor: theme.primary }]}>
          <View style={styles.avatar}>
            {uploadingAvatar ? (
              <ActivityIndicator color={theme.primary} size="small" />
            ) : avatarSource ? (
              <Image 
                key={avatarSource}
                source={{ uri: avatarSource }} 
                style={styles.avatarImg}
                onError={(e) => console.warn('Avatar image load failed:', e.nativeEvent.error)}
              />
            ) : (
              <Text style={[styles.avatarInitial, { color: theme.primary }]}>
                {displayName.charAt(0).toUpperCase()}
              </Text>
            )}
            <TouchableOpacity style={styles.editPen} onPress={handleSelectAvatar} disabled={uploadingAvatar}>
              <Feather name="edit-2" size={12} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.username, { color: theme.primary }]}>{displayName.toUpperCase()}</Text>
        <Text style={styles.handle}>{displayHandle.toLowerCase()}</Text>

        {/* 2-COLUMN METRICS MATRIX */}
        <View style={styles.metricsMatrix}>
          <View style={[styles.metricCard, { borderWidth: highContrast ? 2 : 1 }]}>
            <Text style={styles.metricCardLabel}>{t('total_reviewed') || 'TOTAL AUDITED'}</Text>
            <Text style={styles.metricCardNum}>{loading ? '...' : reviewCount}</Text>
          </View>
          <View style={[styles.metricCard, { borderWidth: highContrast ? 2 : 1 }]}>
            <Text style={styles.metricCardLabel}>ACCURACY INDEX</Text>
            <Text style={styles.metricCardNum}>{loading ? '...' : `${accuracyPercentile.toFixed(1)}%`}</Text>
          </View>
        </View>

        {/* ACCURACY PERCENTILE GAUGE */}
        <View style={[styles.gaugeContainer, { borderWidth: highContrast ? 2 : 1 }]}>
          <View style={styles.gaugeHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Feather name="crosshair" size={12} color="#000000" />
              <Text style={styles.gaugeTitle}>CONSENSUS ACCURACY BRACKET</Text>
            </View>
            <Text style={styles.gaugeTierText}>{getTierLabel(clampedPercentile)}</Text>
          </View>

          <View style={styles.gaugeTrack}>
            <View style={[styles.gaugeFill, { width: `${clampedPercentile}%` }]} />
            <View style={[styles.targetThresholdMarker, { left: '90%' }]} />
          </View>

          <View style={styles.gaugeScaleLabels}>
            <Text style={styles.scaleLabel}>0%</Text>
            <Text style={styles.scaleLabel}>50%</Text>
            <Text style={[styles.scaleLabel, { color: '#000000', fontWeight: '900' }]}>90% (DRAW TIER)</Text>
            <Text style={styles.scaleLabel}>100%</Text>
          </View>

          <Text style={styles.gaugeFootnote}>
            Evaluated against 0.5 consensus mode vectors across verified peer reviews.
          </Text>
        </View>

        <Text style={styles.menuTitle}>{t('account_settings') || 'ACCOUNT LEDGERS & CONFIG'}</Text>
        
        <View style={[styles.menuList, { borderWidth: highContrast ? 2 : 1 }]}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('Ratings')}
          >
            <View style={styles.menuLeft}>
              <Feather name="file-text" size={16} color="black" />
              <Text style={[styles.menuText, { color: theme.primary }]}>{t('my_reviewed_items') || 'My Reviewed Items'}</Text>
            </View>
            <Feather name="chevron-right" size={16} color="black" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('MyRewards')}
          >
            <View style={styles.menuLeft}>
              <Feather name="award" size={16} color="black" />
              <Text style={[styles.menuText, { color: theme.primary }]}>{t('my_rewards') || 'My Rewards & Vouchers'}</Text>
            </View>
            <Feather name="chevron-right" size={16} color="black" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <View style={styles.menuLeft}>
              <Feather name="user-check" size={16} color="black" />
              <Text style={[styles.menuText, { color: theme.primary }]}>{t('edit_profile') || 'Edit Profile Details'}</Text>
            </View>
            <Feather name="chevron-right" size={16} color="black" />
          </TouchableOpacity>

          {/* Subtask 3.1: Settings & Preferences Option */}
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('Settings')}
          >
            <View style={styles.menuLeft}>
              <Feather name="sliders" size={16} color="black" />
              <Text style={[styles.menuText, { color: theme.primary }]}>Settings & UI Preferences</Text>
            </View>
            <Feather name="chevron-right" size={16} color="black" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('Language')}
          >
            <View style={styles.menuLeft}>
              <Feather name="globe" size={16} color="black" />
              <Text style={[styles.menuText, { color: theme.primary }]}>{t('choose_language') || 'Interface Language'}</Text>
            </View>
            <Feather name="chevron-right" size={16} color="black" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('HelpSupport')}
          >
            <View style={styles.menuLeft}>
              <Feather name="help-circle" size={16} color="black" />
              <Text style={[styles.menuText, { color: theme.primary }]}>{t('help_support') || 'Help & Support Desk'}</Text>
            </View>
            <Feather name="chevron-right" size={16} color="black" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={handleLogout}
          >
            <View style={styles.menuLeft}>
              <Feather name="log-out" size={16} color="black" />
              <Text style={[styles.menuText, { color: theme.primary }]}>{t('log_out') || 'Log Out Session'}</Text>
            </View>
            <Feather name="chevron-right" size={16} color="black" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight, backgroundColor: COLORS.surface },
  headerTitle: { fontSize: 12, fontWeight: '900', letterSpacing: 0.5 },
  mainContent: { padding: 24, alignItems: 'center', paddingBottom: 40 },
  profileBox: { borderWidth: 1, borderColor: COLORS.primary, padding: 6, backgroundColor: COLORS.surface, marginBottom: 14 },
  avatar: { width: 84, height: 80, backgroundColor: COLORS.containerHigh, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  avatarImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  avatarInitial: { fontSize: 32, fontWeight: '900', color: COLORS.primary },
  editPen: { position: 'absolute', bottom: -4, right: -4, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.primary, padding: 4 },
  username: { fontSize: 16, fontWeight: '900', marginBottom: 2, color: COLORS.primary, letterSpacing: 0.5 },
  handle: { fontSize: 11, color: COLORS.textMuted, marginBottom: 20, fontWeight: '600', fontMono: true },
  
  metricsMatrix: { width: '100%', flexDirection: 'row', gap: 12, marginBottom: 12 },
  metricCard: { flex: 1, borderWidth: 1, borderColor: '#c6c6c6', backgroundColor: '#ffffff', padding: 16, alignItems: 'center' },
  metricCardLabel: { fontSize: 9, fontWeight: '900', color: '#777777', marginBottom: 6, letterSpacing: 0.5 },
  metricCardNum: { fontSize: 24, fontWeight: '900', color: '#000000' },

  gaugeContainer: { width: '100%', borderWidth: 1, borderColor: '#000000', backgroundColor: '#ffffff', padding: 16, marginBottom: 28 },
  gaugeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 4 },
  gaugeTitle: { fontSize: 9, fontWeight: '900', color: '#000000', letterSpacing: 0.5 },
  gaugeTierText: { fontSize: 9, fontWeight: '900', color: '#5e5e5e', fontMono: true },
  gaugeTrack: { height: 10, backgroundColor: '#f3f3f4', borderWidth: 1, borderColor: '#c6c6c6', position: 'relative', overflow: 'hidden', marginBottom: 6 },
  gaugeFill: { height: '100%', backgroundColor: '#000000' },
  targetThresholdMarker: { position: 'absolute', top: 0, bottom: 0, width: 2, backgroundColor: '#777777' },
  gaugeScaleLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  scaleLabel: { fontSize: 8, fontMono: true, color: '#777777' },
  gaugeFootnote: { fontSize: 8, color: '#777777', borderTopWidth: 1, borderTopColor: '#f3f3f4', paddingTop: 6, fontStyle: 'italic' },

  menuTitle: { alignSelf: 'flex-start', fontSize: 10, fontWeight: '900', color: COLORS.textSecondary, marginBottom: 10, letterSpacing: 0.5 },
  menuList: { width: '100%', borderWidth: 1, borderColor: '#c6c6c6', backgroundColor: COLORS.surface },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuText: { fontSize: 12, fontWeight: 'bold', color: COLORS.primary },

  unauthContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  unauthIconBox: { width: 72, height: 72, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  unauthTitle: { fontSize: 16, fontWeight: '900', color: '#000000', letterSpacing: 1, marginBottom: 8 },
  unauthSub: { fontSize: 12, color: '#5e5e5e', textAlign: 'center', lineHeight: 18, marginBottom: 28 },
  signInButton: { backgroundColor: '#000000', paddingVertical: 16, paddingHorizontal: 36 },
  signInButtonText: { color: '#ffffff', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
});