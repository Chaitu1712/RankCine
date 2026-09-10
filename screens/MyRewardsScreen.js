import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { mobileApi } from '../services/mobileApi';

export default function MyRewardsScreen({ navigation }) {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedVoucherModal, setSelectedVoucherModal] = useState(null);
  const [selectedType, setSelectedType] = useState('ALL');
  const [claimStatus, setClaimStatus] = useState('ALL');
  const [copiedCode, setCopiedCode] = useState(false);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const data = await mobileApi.get('/campaigns/my-rewards');
      
      const formatted = (data || []).map(r => ({
        id: r.id || r.rewardId,
        rewardId: r.rewardId || r.id,
        title: r.title,
        sponsor: r.sponsorName,
        description: r.description,
        voucherCode: r.voucherCode || `RC-CODE-${r.id.substring(0, 6).toUpperCase()}`,
        date: new Date(r.unlockedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase(),
        claimed: r.isClaimed === true,
        type: 'VOUCHER'
      }));

      setRewards(formatted);
    } catch (err) {
      console.error('Failed to load rewards:', err);
      Alert.alert('Network Error', 'Failed to fetch reward ledger from server.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRewards();
  };

  const handleClaimVoucher = async (item) => {
    try {
      await mobileApi.patch(`/campaigns/rewards/${item.rewardId}/claim`);
      setRewards(prev => prev.map(r => r.rewardId === item.rewardId ? { ...r, claimed: true } : r));
      Alert.alert('Voucher Redeemed', `Your voucher code '${item.voucherCode}' has been marked as redeemed.`);
      setSelectedVoucherModal(null);
    } catch (err) {
      Alert.alert('Claim Error', err.message || 'Failed to claim voucher.');
    }
  };

  const handleCopyCode = (code) => {
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
    Alert.alert('Code Copied', `Voucher code '${code}' copied to clipboard.`);
  };

  const filteredRewards = rewards.filter(item => {
    const matchesType = selectedType === 'ALL' || item.type === selectedType;
    const matchesClaim = claimStatus === 'ALL' || 
      (claimStatus === 'CLAIMED' && item.claimed) || 
      (claimStatus === 'UNCLAIMED' && !item.claimed);
    
    return matchesType && matchesClaim;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} disabled={loading}>
          <Feather name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MY REWARDS</Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={styles.subBar}>
        <Text style={styles.archiveLabel}>UNLOCKED VOUCHERS ({filteredRewards.length})</Text>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilterModal(true)}>
          <Feather name="filter" size={12} color="black" style={{ marginRight: 4 }} />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>SYNCING REWARD LEDGER...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredRewards}
          keyExtractor={(item) => item.id}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={{ padding: 24, paddingBottom: 80 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card} 
              activeOpacity={0.8}
              onPress={() => {
                setSelectedVoucherModal(item);
                setCopiedCode(false);
              }}
            >
              <View style={styles.thumbnail}>
                <Feather name="gift" size={24} color="#000000" />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.badge}>[{item.type}]</Text>
                </View>
                <Text style={styles.cardDate}>WON: {item.date}</Text>
                <View style={styles.cardBottom}>
                  <Text style={styles.voucherText}>SPONSOR: {item.sponsor.toUpperCase()}</Text>
                  <Text style={[styles.statusTag, item.claimed ? styles.claimedTag : styles.unclaimedTag]}>
                    {item.claimed ? 'REDEEMED' : 'UNCLAIMED'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Feather name="award" size={32} color="#777777" style={{ marginBottom: 12 }} />
              <Text style={{ textAlign: 'center', color: COLORS.textMuted, fontWeight: 'bold', fontSize: 12 }}>
                No won vouchers in your ledger.
              </Text>
              <Text style={{ textAlign: 'center', color: '#8c8c8c', fontSize: 10, marginTop: 4 }}>
                Rate content and land on the 0.5 consensus mode peak to win lucky draw sponsor rewards.
              </Text>
            </View>
          }
        />
      )}

      {/* VOUCHER DETAILS & REDEMPTION MODAL */}
      {selectedVoucherModal && (
        <Modal visible={true} transparent={true} animationType="fade">
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSelectedVoucherModal(null)}>
            <View style={styles.voucherModalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>REWARD VOUCHER</Text>
                <TouchableOpacity onPress={() => setSelectedVoucherModal(null)}>
                  <Feather name="x" size={18} color="#000000" />
                </TouchableOpacity>
              </View>

              <Text style={styles.vTitle}>{selectedVoucherModal.title}</Text>
              <Text style={styles.vSponsor}>Issued by {selectedVoucherModal.sponsor}</Text>

              {/* Tap to copy code container */}
              <TouchableOpacity 
                style={styles.codeBox} 
                onPress={() => handleCopyCode(selectedVoucherModal.voucherCode)}
                activeOpacity={0.8}
              >
                <Text style={styles.codeLabel}>VOUCHER REDEMPTION CODE (TAP TO COPY)</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={styles.codeText}>{selectedVoucherModal.voucherCode}</Text>
                  <Feather name={copiedCode ? "check" : "copy"} size={16} color="#000000" />
                </View>
              </TouchableOpacity>

              <Text style={styles.vDesc}>
                {selectedVoucherModal.description || 'Present or apply this alphanumeric code on the sponsor platform to claim your reward.'}
              </Text>

              {!selectedVoucherModal.claimed ? (
                <TouchableOpacity 
                  style={styles.claimBtn} 
                  onPress={() => handleClaimVoucher(selectedVoucherModal)}
                >
                  <Text style={styles.claimBtnText}>MARK AS REDEEMED</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.redeemedBox}>
                  <Text style={styles.redeemedText}>VOUCHER REDEEMED</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* FILTER MODAL */}
      <Modal visible={showFilterModal} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowFilterModal(false)}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>FILTER REWARDS</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}><Feather name="x" size={18} color="#000000" /></TouchableOpacity>
            </View>

            <View style={{ gap: 12, marginBottom: 16 }}>
              <Text style={styles.filterSectionTitle}>VOUCHER STATUS</Text>
              {[
                { id: 'ALL', label: 'All Vouchers' },
                { id: 'UNCLAIMED', label: 'Unclaimed Only' },
                { id: 'CLAIMED', label: 'Redeemed Only' }
              ].map(st => (
                <TouchableOpacity key={st.id} style={styles.filterRow} onPress={() => setClaimStatus(st.id)}>
                  <Text style={[styles.filterLabel, claimStatus === st.id && { fontWeight: '900', color: '#000000' }]}>{st.label}</Text>
                  <View style={styles.radioOuter}>
                    {claimStatus === st.id && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.applyBtn} onPress={() => setShowFilterModal(false)}>
              <Text style={styles.applyBtnText}>APPLY FILTERS</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 10, fontWeight: 'bold', color: COLORS.textMuted, letterSpacing: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight, backgroundColor: COLORS.surface },
  headerTitle: { fontSize: 13, fontWeight: '900' },
  subBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16 },
  archiveLabel: { fontSize: 10, fontWeight: '900', borderBottomWidth: 2, borderBottomColor: COLORS.primary, paddingBottom: 2 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.primary, backgroundColor: COLORS.surface, paddingVertical: 6, paddingHorizontal: 12 },
  filterText: { fontSize: 10, fontWeight: 'bold' },
  card: { flexDirection: 'row', borderWidth: 1, borderColor: COLORS.primary, backgroundColor: COLORS.surface, padding: 14, marginBottom: 14, gap: 14 },
  thumbnail: { width: 56, height: 56, backgroundColor: COLORS.containerHigh, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#c6c6c6' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 12, fontWeight: '900', flex: 1, marginRight: 8, color: '#000000' },
  badge: { fontSize: 8, fontStyle: 'italic', fontWeight: 'bold', color: COLORS.textSecondary },
  cardDate: { fontSize: 8, color: COLORS.textMuted, marginTop: 3, marginBottom: 6, fontMono: true },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  voucherText: { fontSize: 9, fontWeight: '900', color: COLORS.primary },
  statusTag: { fontSize: 7, fontWeight: '900', paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1 },
  claimedTag: { backgroundColor: COLORS.containerLow, borderColor: COLORS.primary, color: COLORS.primary },
  unclaimedTag: { backgroundColor: '#166534', borderColor: '#166534', color: '#ffffff' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#000000', padding: 20 },
  voucherModalCard: { backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#000000', padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#e8e8e8', paddingBottom: 10, marginBottom: 14 },
  modalTitle: { fontSize: 11, fontWeight: '900', color: '#000000', letterSpacing: 0.5 },
  vTitle: { fontSize: 15, fontWeight: '900', color: '#000000', marginBottom: 2 },
  vSponsor: { fontSize: 10, fontWeight: 'bold', color: '#777777', marginBottom: 16 },
  codeBox: { borderWidth: 1, borderColor: '#000000', backgroundColor: '#f3f3f4', padding: 14, alignItems: 'center', marginBottom: 14 },
  codeLabel: { fontSize: 8, fontWeight: '900', color: '#777777', letterSpacing: 1, marginBottom: 6 },
  codeText: { fontSize: 16, fontWeight: '900', color: '#000000', fontMono: true },
  vDesc: { fontSize: 10, color: '#474747', lineHeight: 16, marginBottom: 20, textAlign: 'center' },
  claimBtn: { backgroundColor: '#000000', paddingVertical: 14, alignItems: 'center' },
  claimBtnText: { color: '#ffffff', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  redeemedBox: { backgroundColor: '#f3f3f4', paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: '#c6c6c6' },
  redeemedText: { color: '#777777', fontSize: 10, fontWeight: '900' },

  filterSectionTitle: { fontSize: 9, fontWeight: '900', color: COLORS.secondary, letterSpacing: 1, marginBottom: 10 },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  filterLabel: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },
  radioOuter: { width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: '#000000', justifyContent: 'center', alignItems: 'center' },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#000000' },
  applyBtn: { backgroundColor: COLORS.primary, paddingVertical: 12, alignItems: 'center', marginTop: 10 },
  applyBtnText: { color: COLORS.surface, fontSize: 11, fontWeight: 'bold', letterSpacing: 1 }
});