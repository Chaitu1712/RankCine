import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, Modal, RefreshControl, ActivityIndicator, useWindowDimensions, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Fuse from 'fuse.js';
import { COLORS } from '../constants/theme';
import { mobileApi, resolveMediaUrl, getYouTubeInfo } from '../services/mobileApi';
import { useLanguage } from '../context/LanguageContext';

const SORT_OPTIONS = ['Newest First', 'Highest Rated', 'Most Rewards'];
const FILTER_TYPES = ['TRAILER', 'POSTER', 'SONG', 'PODCAST', 'ARTICLE'];

const FUSE_OPTIONS = {
  keys: [
    { name: 'title', weight: 0.5 },
    { name: 'producer.companyName', weight: 0.3 },
    { name: 'mediaType', weight: 0.2 }
  ],
  threshold: 0.35,
  distance: 100,
  minMatchCharLength: 2,
  includeScore: true,
  ignoreLocation: true
};

export default function DiscoverScreen({ navigation }) {
  const { t } = useLanguage();
  const { width } = useWindowDimensions();
  const flatListRef = useRef(null);

  const isTablet = width >= 768;
  const numColumns = isTablet ? (width >= 1024 ? 3 : 2) : 1;

  const [feedItems, setFeedItems] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedSort, setSelectedSort] = useState('Newest First');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [notifModalVisible, setNotifModalVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [isSuspended, setIsSuspended] = useState(false);
  const [suspensionMessage, setSuspensionMessage] = useState('');

  const syncNotifications = async () => {
    try {
      const token = await mobileApi.getToken();
      setIsAuthenticated(!!token);
      if (token) {
        const rewardsData = await mobileApi.get('/campaigns/my-rewards').catch(() => []);
        setNotifications(rewardsData || []);
      } else {
        setNotifications([]);
      }
    } catch {
      // Ignored
    }
  };

  // TASK 5.2: Refresh notification vouchers whenever screen is focused
  useFocusEffect(
    useCallback(() => {
      syncNotifications();
    }, [])
  );

  const fetchDiscoveryFeed = async () => {
    try {
      setLoading(true);
      
      const token = await mobileApi.getToken();
      setIsAuthenticated(!!token);

      const typeParam = selectedTypes.length > 0 ? selectedTypes.join(',') : '';
      const feedPromise = mobileApi.get(`/media/feed?types=${typeParam}&sortBy=${selectedSort}&limit=10`);
      const rewardsPromise = token ? mobileApi.get('/campaigns/my-rewards').catch(() => []) : Promise.resolve([]);

      const [data, rewardsData] = await Promise.all([feedPromise, rewardsPromise]);
      
      const items = Array.isArray(data) ? data : (data?.items || []);
      setFeedItems(items);
      setNextCursor(data?.nextCursor || null);
      setHasMore(Boolean(data?.hasMore));
      setNotifications(rewardsData || []);
      setIsSuspended(false);
    } catch (err) {
      if (err.message && err.message.includes('suspended')) {
        setIsSuspended(true);
        setSuspensionMessage(err.message);
      } else {
        console.error('Failed to fetch discovery feed:', err);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore || !nextCursor || loading) return;

    try {
      setLoadingMore(true);
      const typeParam = selectedTypes.length > 0 ? selectedTypes.join(',') : '';
      const data = await mobileApi.get(`/media/feed?types=${typeParam}&sortBy=${selectedSort}&limit=10&cursor=${encodeURIComponent(nextCursor)}`);

      const newItems = Array.isArray(data) ? data : (data?.items || []);
      setFeedItems(prev => [...prev, ...newItems]);
      setNextCursor(data?.nextCursor || null);
      setHasMore(Boolean(data?.hasMore));
    } catch (err) {
      console.error('Failed to fetch next feed page:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchDiscoveryFeed();
  }, [selectedSort, selectedTypes]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDiscoveryFeed();
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@rankcine.com?subject=Account%20Suspension%20Appeal');
  };

  const handleLogout = async () => {
    await mobileApi.clearAuth();
    setIsAuthenticated(false);
    setNotifications([]);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Language' }],
    });
  };

  const toggleTypeFilter = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const fuse = useMemo(() => {
    return new Fuse(feedItems, FUSE_OPTIONS);
  }, [feedItems]);

  const filteredItems = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return feedItems;

    const results = fuse.search(trimmedQuery);
    return results.map(res => res.item);
  }, [searchQuery, feedItems, fuse]);

  const unreadRewardsCount = notifications.filter(n => !n.isClaimed).length;

  const renderCard = ({ item }) => {
    const isTrailer = item.mediaType === 'TRAILER';
    const isSong = item.mediaType === 'SONG';
    const isPoster = item.mediaType === 'POSTER';
    const hasReward = item.rewards_on_mediaItem && item.rewards_on_mediaItem.length > 0;
    const mediaUrl = resolveMediaUrl(item.contentUrl);
    const ytInfo = getYouTubeInfo(mediaUrl);

    let displayThumbnail = null;
    if (ytInfo.isYoutube) {
      displayThumbnail = ytInfo.thumbnailUrl;
    } else if (item.aiEvaluation?.thumbnailUrl) {
      displayThumbnail = resolveMediaUrl(item.aiEvaluation.thumbnailUrl);
    } else if (isPoster && mediaUrl) {
      displayThumbnail = mediaUrl;
    }

    return (
      <TouchableOpacity 
        style={[styles.card, { flex: 1 / numColumns }]}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('RateContent', { item })}
      >
        <View style={styles.thumbnailContainer}>
          {displayThumbnail ? (
            <Image source={{ uri: displayThumbnail }} style={styles.thumbnailImg} resizeMode="cover" />
          ) : (
            <View style={styles.fallbackThumbnail}>
              {isTrailer && <Feather name="video" size={32} color={COLORS.primary} />}
              {isSong && <Feather name="music" size={32} color={COLORS.primary} />}
              {isPoster && <Feather name="image" size={32} color={COLORS.primary} />}
            </View>
          )}

          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{item.mediaType}</Text>
          </View>

          {hasReward && (
            <View style={styles.rewardBadge}>
              <Feather name="award" size={10} color="#ffffff" />
              <Text style={styles.rewardBadgeText}>{t('consensus_draw')}</Text>
            </View>
          )}
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.cardStudio} numberOfLines={1}>BY {item.producer?.companyName || 'AXIOM STUDIO'}</Text>

          <View style={styles.cardFooter}>
            <View style={styles.scoreBlock}>
              <Text style={styles.scoreLabel}>{t('ai_pre_score')}</Text>
              <Text style={styles.scoreVal}>{item.aiOverallRating || '8.5'}<Text style={{ fontSize: 10, color: '#777777' }}>/10</Text></Text>
            </View>
            <View style={styles.rateBtn}>
              <Text style={styles.rateBtnText}>{t('rate')}</Text>
              <Feather name="arrow-right" size={12} color="#000000" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isSuspended) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.suspendedContainer}>
          <View style={styles.suspendedIconBox}>
            <Feather name="slash" size={40} color="#ffffff" />
          </View>

          <Text style={styles.suspendedTitle}>{t('account_suspended')}</Text>
          <View style={styles.suspendedLine} />

          <Text style={styles.suspendedBody}>
            {suspensionMessage || "Your consumer account has been restricted following moderation infractions."}
          </Text>

          <View style={styles.suspendedActions}>
            <TouchableOpacity style={styles.emailSupportBtn} onPress={handleContactSupport}>
              <Feather name="mail" size={16} color="#ffffff" />
              <Text style={styles.emailSupportBtnText}>{t('email_support_team')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutBtnText}>{t('log_out')}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.suspendedHelpText}>
            Support contact: support@rankcine.com • Ref: NODE_RESTRICTED
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>RANK CINE</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.headerBtn, styles.bellBtn]} 
            onPress={() => setNotifModalVisible(true)}
          >
            <Feather name="bell" size={16} color="#000000" />
            {isAuthenticated && unreadRewardsCount > 0 && (
              <View style={styles.badgeIndicator}>
                <Text style={styles.badgeText}>{unreadRewardsCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={() => setFilterModalVisible(true)}>
            <Feather name="filter" size={16} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={() => setSortModalVisible(true)}>
            <Feather name="arrow-down" size={16} color="#000000" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchBar}>
        <Feather name="search" size={14} color="#777777" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('search_placeholder')}
          placeholderTextColor="#777777"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Feather name="x" size={14} color="#777777" />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#000000" size="large" />
          <Text style={styles.loadingText}>{t('syncing_stream')}</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={filteredItems}
          key={numColumns}
          numColumns={numColumns}
          keyExtractor={(item) => item.id}
          renderItem={renderCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          onScroll={(e) => {
            const offset = e.nativeEvent.contentOffset.y;
            setShowScrollTop(offset > 300);
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#000000" />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="inbox" size={36} color="#777777" style={{ marginBottom: 12 }} />
              <Text style={styles.emptyTitle}>{t('no_content_matched')}</Text>
              <Text style={styles.emptySub}>{t('no_content_sub')}</Text>
            </View>
          }
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#000000" />
                <Text style={styles.footerLoaderText}>STREAMING CONTENT NODES...</Text>
              </View>
            ) : null
          }
        />
      )}

      {showScrollTop && (
        <TouchableOpacity 
          style={styles.scrollTopFab} 
          onPress={() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true })}
        >
          <Feather name="arrow-up" size={16} color="#ffffff" />
        </TouchableOpacity>
      )}

      {/* TASK 5.2: In-App Lucky Draw Winner Notifications Modal */}
      <Modal visible={notifModalVisible} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setNotifModalVisible(false)}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Feather name="bell" size={16} color="#000000" />
                <Text style={styles.modalTitle}>{t('system_notifications')}</Text>
              </View>
              <TouchableOpacity onPress={() => setNotifModalVisible(false)}>
                <Feather name="x" size={18} color="#000000" />
              </TouchableOpacity>
            </View>

            <View style={{ maxHeight: 320, paddingVertical: 4 }}>
              {!isAuthenticated ? (
                <View style={{ padding: 24, alignItems: 'center' }}>
                  <Feather name="user" size={28} color="#777777" style={{ marginBottom: 8 }} />
                  <Text style={{ fontSize: 12, fontWeight: '900', color: '#000000', marginBottom: 4 }}>GUEST MODE</Text>
                  <Text style={{ fontSize: 10, color: '#777777', textAlign: 'center', marginBottom: 16 }}>
                    Log in or evaluate content to receive consensus lucky draw notifications and win vouchers.
                  </Text>
                  <TouchableOpacity 
                    style={styles.loginModalBtn}
                    onPress={() => {
                      setNotifModalVisible(false);
                      navigation.navigate('Login');
                    }}
                  >
                    <Text style={styles.loginModalBtnText}>{t('login_button')} ►</Text>
                  </TouchableOpacity>
                </View>
              ) : notifications.length > 0 ? (
                notifications.map((n, i) => (
                  <TouchableOpacity 
                    key={i} 
                    style={styles.notifCard}
                    onPress={() => {
                      setNotifModalVisible(false);
                      navigation.navigate('MyRewards');
                    }}
                  >
                    <View style={styles.notifBadge}>
                      <Feather name="award" size={14} color="#000000" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.notifTitle}>{t('reward_won')}: {n.title.toUpperCase()}</Text>
                      <Text style={styles.notifSub}>
                        Sponsor: {n.sponsorName} • Code: {n.voucherCode}
                      </Text>
                      <Text style={styles.notifDate}>
                        {new Date(n.unlockedAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={{ padding: 24, alignItems: 'center' }}>
                  <Feather name="check-circle" size={24} color="#777777" style={{ marginBottom: 8 }} />
                  <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#777777' }}>{t('all_caught_up')}</Text>
                  <Text style={{ fontSize: 9, color: '#8c8c8c', textAlign: 'center', marginTop: 4 }}>
                    {t('no_notifications_sub')}
                  </Text>
                </View>
              )}
            </View>

            {isAuthenticated && (
              <TouchableOpacity 
                style={styles.applyBtn} 
                onPress={() => {
                  setNotifModalVisible(false);
                  navigation.navigate('MyRewards');
                }}
              >
                <Text style={styles.applyBtnText}>{t('view_all_rewards')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Filter Modal */}
      <Modal visible={filterModalVisible} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setFilterModalVisible(false)}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('filter_media_types')}</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Feather name="x" size={18} color="#000000" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              {FILTER_TYPES.map(type => {
                const active = selectedTypes.includes(type);
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.filterChip, active && styles.filterChipActive]}
                    onPress={() => toggleTypeFilter(type)}
                  >
                    <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{type}</Text>
                    {active && <Feather name="check" size={14} color="#ffffff" />}
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity style={styles.applyBtn} onPress={() => setFilterModalVisible(false)}>
              <Text style={styles.applyBtnText}>{t('apply_filters')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Sort Modal */}
      <Modal visible={sortModalVisible} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSortModalVisible(false)}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('sort_discovery_feed')}</Text>
              <TouchableOpacity onPress={() => setSortModalVisible(false)}>
                <Feather name="x" size={18} color="#000000" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              {SORT_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.sortRow, selectedSort === opt && styles.sortRowActive]}
                  onPress={() => { setSelectedSort(opt); setSortModalVisible(false); }}
                >
                  <Text style={[styles.sortRowText, selectedSort === opt && { fontWeight: '900', color: '#000000' }]}>
                    {opt}
                  </Text>
                  {selectedSort === opt && <Feather name="check" size={14} color="#000000" />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight, backgroundColor: COLORS.surface },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#000000', letterSpacing: 0.5 },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerBtn: { borderWidth: 1, borderColor: '#000000', padding: 8, backgroundColor: '#ffffff' },
  bellBtn: { position: 'relative' },
  badgeIndicator: { position: 'absolute', top: -4, right: -4, backgroundColor: '#000000', width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ffffff' },
  badgeText: { fontSize: 8, color: '#ffffff', fontWeight: '900' },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#c6c6c6', backgroundColor: '#ffffff', marginHorizontal: 20, marginTop: 14, marginBottom: 8, paddingHorizontal: 12, paddingVertical: 10 },
  searchInput: { flex: 1, fontSize: 12, color: '#000000', fontWeight: 'bold' },
  listContainer: { padding: 14, gap: 14 },
  card: { borderWidth: 1, borderColor: '#c6c6c6', backgroundColor: '#ffffff', margin: 6, overflow: 'hidden' },
  thumbnailContainer: { height: 170, backgroundColor: '#000000', position: 'relative' },
  thumbnailImg: { width: '100%', height: '100%' },
  fallbackThumbnail: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e8e8e8' },
  typeBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: '#000000', paddingHorizontal: 8, paddingVertical: 3 },
  typeBadgeText: { fontSize: 9, fontWeight: '900', color: '#ffffff', letterSpacing: 0.5 },
  rewardBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: '#166534', flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3 },
  rewardBadgeText: { fontSize: 8, fontWeight: '900', color: '#ffffff', letterSpacing: 0.5 },
  cardInfo: { padding: 14 },
  cardTitle: { fontSize: 14, fontWeight: '900', color: '#000000', marginBottom: 2 },
  cardStudio: { fontSize: 9, fontWeight: 'bold', color: '#777777', letterSpacing: 0.5, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f3f3f4', paddingTop: 10 },
  scoreBlock: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  scoreLabel: { fontSize: 8, fontWeight: '900', color: '#777777' },
  scoreVal: { fontSize: 13, fontWeight: '900', color: '#000000' },
  rateBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: '#000000', paddingHorizontal: 10, paddingVertical: 4, backgroundColor: '#f3f3f4' },
  rateBtnText: { fontSize: 9, fontWeight: '900', color: '#000000' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 10, fontWeight: '900', color: '#777777', letterSpacing: 1 },
  emptyContainer: { padding: 40, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 13, fontWeight: '900', color: '#000000', marginBottom: 4 },
  emptySub: { fontSize: 11, color: '#777777', textAlign: 'center' },
  scrollTopFab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#000000', width: 42, height: 42, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#c6c6c6' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#000000', padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#e8e8e8', paddingBottom: 12, marginBottom: 14 },
  modalTitle: { fontSize: 11, fontWeight: '900', color: '#000000', letterSpacing: 0.5 },
  modalBody: { gap: 8, marginBottom: 16 },
  filterChip: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#c6c6c6', padding: 12, backgroundColor: '#f3f3f4' },
  filterChipActive: { backgroundColor: '#000000', borderColor: '#000000' },
  filterChipText: { fontSize: 11, fontWeight: '900', color: '#474747' },
  filterChipTextActive: { color: '#ffffff' },
  applyBtn: { backgroundColor: '#000000', paddingVertical: 12, alignItems: 'center', marginTop: 8 },
  applyBtnText: { color: '#ffffff', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  sortRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f3f4' },
  sortRowActive: { backgroundColor: '#f3f3f4', paddingHorizontal: 6 },
  sortRowText: { fontSize: 12, color: '#474747', fontWeight: '600' },

  notifCard: { flexDirection: 'row', gap: 12, padding: 12, borderWidth: 1, borderColor: '#c6c6c6', backgroundColor: '#f3f3f4', marginBottom: 8 },
  notifBadge: { width: 28, height: 28, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#000000' },
  notifTitle: { fontSize: 10, fontWeight: '900', color: '#000000' },
  notifSub: { fontSize: 9, color: '#474747', marginTop: 2, fontWeight: '600' },
  notifDate: { fontSize: 8, color: '#777777', marginTop: 2, fontMono: true },

  loginModalBtn: { backgroundColor: '#000000', paddingVertical: 12, paddingHorizontal: 28, marginTop: 6 },
  loginModalBtnText: { color: '#ffffff', fontSize: 11, fontWeight: '900', letterSpacing: 1 },

  suspendedContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: '#ffffff' },
  suspendedIconBox: { width: 72, height: 72, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  suspendedTitle: { fontSize: 18, fontWeight: '900', color: '#000000', letterSpacing: 1, textAlign: 'center' },
  suspendedLine: { width: 40, height: 3, backgroundColor: '#000000', marginVertical: 14 },
  suspendedBody: { fontSize: 12, color: '#474747', lineHeight: 20, textAlign: 'center', fontWeight: '500', marginBottom: 32 },
  suspendedActions: { width: '100%', gap: 12, marginBottom: 24 },
  emailSupportBtn: { backgroundColor: '#000000', paddingVertical: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  emailSupportBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  logoutBtn: { borderWidth: 1, borderColor: '#000000', paddingVertical: 14, alignItems: 'center', backgroundColor: '#ffffff' },
  logoutBtnText: { color: '#000000', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  suspendedHelpText: { fontSize: 9, fontMono: true, color: '#777777', textAlign: 'center' },

  footerLoader: { paddingVertical: 20, alignItems: 'center', gap: 6 },
  footerLoaderText: { fontSize: 9, fontMono: true, fontWeight: '900', color: '#777777', letterSpacing: 0.5 }
});