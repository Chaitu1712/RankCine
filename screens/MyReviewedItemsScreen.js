import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ActivityIndicator, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { mobileApi, resolveMediaUrl, getYouTubeInfo } from '../services/mobileApi';

export default function MyReviewedItemsScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedType, setSelectedType] = useState('ALL');
  const [rewardFilter, setRewardFilter] = useState('ALL'); 

  const fetchReviewedItems = async () => {
    try {
      setLoading(true);
      const token = await mobileApi.getToken();
      if (!token) {
        setIsAuthenticated(false);
        setItems([]);
        return;
      }

      setIsAuthenticated(true);
      const data = await mobileApi.get('/reviews/my-reviews');

      const formatted = (data || []).map((item) => ({
        id: item.id,
        mediaId: item.mediaId,
        title: item.title,
        type: item.mediaType,
        contentUrl: item.contentUrl,
        thumbnailUrl: item.thumbnailUrl,
        format: item.format,
        date: new Date(item.reviewDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase(),
        sentimentScore: item.sentimentScore ? item.sentimentScore.toFixed(1) : '5.0',
        aiQualityScore: item.aiQualityScore || 50,
        rawTextInput: item.rawTextInput,
        aiFormattedOutput: item.aiFormattedOutput,
        rewardWon: item.rewardWon === true,
        hasActiveReward: item.hasActiveReward === true,
        rawItem: {
          id: item.mediaId,
          title: item.title,
          mediaType: item.mediaType,
          contentUrl: item.contentUrl,
          aiOverallRating: item.aiOverallRating
        }
      }));

      setItems(formatted);
    } catch (err) {
      console.error('Failed to load reviewed items:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchReviewedItems();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchReviewedItems();
  };

  const handleBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('Profile');
  };

  const filteredItems = items.filter(item => {
    const matchesType = selectedType === 'ALL' || item.type === selectedType;
    const matchesReward = rewardFilter === 'ALL' || 
      (rewardFilter === 'WON' && item.rewardWon) || 
      (rewardFilter === 'NOT_WON' && !item.rewardWon);
    
    return matchesType && matchesReward;
  });

  // Guest State View (matches ProfileScreen style)
  if (!loading && !isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleBack}>
            <Feather name="arrow-left" size={20} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>MY REVIEWED ITEMS</Text>
          <View style={{ width: 20 }} />
        </View>

        <View style={styles.unauthContainer}>
          <View style={styles.unauthIconBox}>
            <Feather name="file-text" size={36} color="#ffffff" />
          </View>
          <Text style={styles.unauthTitle}>GUEST CONSUMER</Text>
          <Text style={styles.unauthSub}>
            Sign in to view your evaluation archive, consensus mode benchmarks, and unlocked sponsor rewards.
          </Text>
          <TouchableOpacity 
            style={styles.signInButton} 
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.signInButtonText}>LOG IN ►</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderCard = ({ item }) => {
    const mediaUrl = resolveMediaUrl(item.contentUrl);
    const ytInfo = getYouTubeInfo(mediaUrl);

    let displayThumbnail = null;
    if (ytInfo.isYoutube) {
      displayThumbnail = ytInfo.thumbnailUrl;
    } else if (item.thumbnailUrl) {
      displayThumbnail = resolveMediaUrl(item.thumbnailUrl);
    } else if (item.type === 'POSTER' && mediaUrl) {
      displayThumbnail = mediaUrl;
    }

    return (
      <TouchableOpacity 
        style={[styles.card, item.rewardWon && styles.cardHighlight]}
        onPress={() => navigation.navigate('LeaderboardRewards', { item: item.rawItem })}
        activeOpacity={0.8}
      >
        <View style={styles.thumbnail}>
          {displayThumbnail ? (
            <Image source={{ uri: displayThumbnail }} style={styles.thumbnailImg} resizeMode="cover" />
          ) : (
            <Feather 
              name={item.format === 'VIDEO' ? 'video' : item.format === 'AUDIO' ? 'mic' : 'file-text'} 
              size={24} 
              color="#000000" 
            />
          )}
        </View>

        <View style={{ flex: 1 }}>
          <View style={styles.cardTop}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.badge}>[{item.format}]</Text>
          </View>
          
          <Text style={styles.cardDate}>EVALUATED ON {item.date}</Text>

          <Text style={styles.reviewSnippet} numberOfLines={2}>
            "{item.rawTextInput || item.aiFormattedOutput || 'Verified evaluation vector submitted.'}"
          </Text>
          
          <View style={styles.cardBottom}>
            <Text style={styles.cardScore}>
              SENTIMENT: <Text style={{ color: '#000000' }}>{item.sentimentScore}/10</Text>
            </Text>
            {item.rewardWon ? (
              <View style={styles.rewardTag}>
                <Feather name="award" size={10} color="#ffffff" />
                <Text style={styles.rewardTagText}>REWARD UNLOCKED</Text>
              </View>
            ) : (
              <Text style={styles.detailsLink}>View Consensus →</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={handleBack} disabled={loading}>
          <Feather name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MY REVIEWED ITEMS</Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={styles.subBar}>
        <Text style={styles.archiveLabel}>AUDIT HISTORY ({filteredItems.length})</Text>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilterModal(true)}>
          <Feather name="filter" size={12} color="black" style={{ marginRight: 4 }} />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>SYNCING REVIEW ARCHIVE...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={{ padding: 20, paddingBottom: 80 }}
          renderItem={renderCard}
          ListEmptyComponent={
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Feather name="inbox" size={32} color="#777777" style={{ marginBottom: 12 }} />
              <Text style={{ textAlign: 'center', color: COLORS.textMuted, fontWeight: 'bold', fontSize: 12 }}>
                No evaluations found in your archive.
              </Text>
              <Text style={{ textAlign: 'center', color: '#8c8c8c', fontSize: 10, marginTop: 4 }}>
                Rate media on the discovery feed to build your evaluation ledger.
              </Text>
            </View>
          }
        />
      )}

      {/* Multi-Filter Modal */}
      <Modal visible={showFilterModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowFilterModal(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Feather name="x" size={20} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>FILTER REVIEWS</Text>
            <TouchableOpacity onPress={() => { setSelectedType('ALL'); setRewardFilter('ALL'); }}>
              <Text style={styles.clearText}>Reset</Text>
            </TouchableOpacity>
          </View>

          <View style={{ padding: 24, flex: 1 }}>
            <Text style={styles.filterSectionTitle}>CONTENT TYPE</Text>
            {['ALL', 'TRAILER', 'POSTER', 'SONG', 'PODCAST', 'ARTICLE'].map(type => (
              <TouchableOpacity key={type} style={styles.filterRow} onPress={() => setSelectedType(type)}>
                <Text style={styles.filterLabel}>{type === 'ALL' ? 'All Types' : `${type}s`}</Text>
                <View style={styles.radioOuter}>
                  {selectedType === type && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            ))}

            <View style={{ height: 24 }} />

            <Text style={styles.filterSectionTitle}>REWARD STATUS</Text>
            {[
              { id: 'ALL', label: 'All Reviews' },
              { id: 'WON', label: 'Reward Vouchers Unlocked Only' },
              { id: 'NOT_WON', label: 'No Rewards' }
            ].map(status => (
              <TouchableOpacity key={status.id} style={styles.filterRow} onPress={() => setRewardFilter(status.id)}>
                <Text style={styles.filterLabel}>{status.label}</Text>
                <View style={styles.radioOuter}>
                  {rewardFilter === status.id && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.applyBtn} onPress={() => setShowFilterModal(false)}>
              <Text style={styles.applyBtnText}>APPLY FILTERS</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
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
  subBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 14 },
  archiveLabel: { fontSize: 10, fontWeight: '900', borderBottomWidth: 2, borderBottomColor: COLORS.primary, paddingBottom: 2 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.primary, backgroundColor: COLORS.surface, paddingVertical: 5, paddingHorizontal: 10 },
  filterText: { fontSize: 10, fontWeight: 'bold' },
  card: { flexDirection: 'row', borderWidth: 1, borderColor: '#c6c6c6', backgroundColor: COLORS.surface, padding: 14, marginBottom: 12, gap: 12 },
  cardHighlight: { borderColor: '#000000', borderWidth: 1.5, backgroundColor: '#fdfdfd' },
  thumbnail: { width: 60, height: 60, backgroundColor: COLORS.containerHigh, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e8e8e8', overflow: 'hidden' },
  thumbnailImg: { width: '100%', height: '100%' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 12, fontWeight: '900', flex: 1, marginRight: 6, color: '#000000' },
  badge: { fontSize: 8, fontStyle: 'italic', fontWeight: '900', color: COLORS.textSecondary, borderWidth: 1, borderColor: '#c6c6c6', paddingHorizontal: 4, paddingVertical: 1 },
  cardDate: { fontSize: 8, color: COLORS.textMuted, marginTop: 2, marginBottom: 4, fontMono: true },
  reviewSnippet: { fontSize: 10, color: '#474747', fontStyle: 'italic', marginBottom: 8, lineHeight: 14 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardScore: { fontSize: 9, fontWeight: '900', color: '#777777' },
  rewardTag: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#166534', paddingHorizontal: 6, paddingVertical: 2 },
  rewardTagText: { fontSize: 7, fontWeight: '900', color: '#ffffff' },
  detailsLink: { fontSize: 9, color: '#000000', fontWeight: 'bold', textDecorationLine: 'underline' },

  unauthContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  unauthIconBox: { width: 72, height: 72, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  unauthTitle: { fontSize: 16, fontWeight: '900', color: '#000000', letterSpacing: 1, marginBottom: 8 },
  unauthSub: { fontSize: 12, color: '#5e5e5e', textAlign: 'center', lineHeight: 18, marginBottom: 28 },
  signInButton: { backgroundColor: '#000000', paddingVertical: 16, paddingHorizontal: 36 },
  signInButtonText: { color: '#ffffff', fontSize: 12, fontWeight: '900', letterSpacing: 1 },

  modalContainer: { flex: 1, backgroundColor: COLORS.surface },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  modalTitle: { fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  clearText: { fontSize: 11, fontWeight: 'bold', color: COLORS.textMuted },
  filterSectionTitle: { fontSize: 9, fontWeight: '900', color: COLORS.secondary, letterSpacing: 1, marginBottom: 12 },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  filterLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
  radioOuter: { width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: '#000000', justifyContent: 'center', alignItems: 'center' },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#000000' },
  modalFooter: { padding: 20, borderTopWidth: 1, borderTopColor: COLORS.borderLight },
  applyBtn: { backgroundColor: COLORS.primary, paddingVertical: 14, alignItems: 'center' },
  applyBtnText: { color: COLORS.surface, fontSize: 11, fontWeight: 'bold', letterSpacing: 1 }
});