import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { mobileApi } from '../services/mobileApi';

export default function LeaderboardRewardsScreen({ route, navigation }) {
  const { item } = route.params || { item: { id: "m-1", title: "Ethereal Geometry" } };
  
  const [activeTab, setActiveTab] = useState('CONSENSUS');
  const [consensusData, setConsensusData] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchConsensusAndRewards = async () => {
    try {
      setLoading(true);
      const mediaId = item?.id || 'm-1';

      const [consensusRes, campaignRes] = await Promise.all([
        mobileApi.get(`/campaigns/consensus/${mediaId}`).catch(() => null),
        mobileApi.get(`/campaigns?id=${mediaId}`).catch(() => [])
      ]);

      setConsensusData(consensusRes);
      setCampaigns(Array.isArray(campaignRes) ? campaignRes : []);
    } catch (err) {
      console.error('Failed to load consensus & rewards:', err);
      Alert.alert('Error', 'Failed to fetch consensus data from server.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchConsensusAndRewards();
  }, [item?.id]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchConsensusAndRewards();
  };

  const binsList = consensusData?.bins || [];
  const modeBin = consensusData?.modeBin ?? 7.5;
  const userBin = consensusData?.userBin;
  const maxUserCount = Math.max(...binsList.map(b => b.userCount), 1);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} disabled={loading}>
          <Feather name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CONSENSUS & REWARDS</Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={{ padding: 24, flex: 1 }}>
        <Text style={styles.movieTitle} numberOfLines={1}>{(item?.title || 'ASSET TITLE').toUpperCase()}</Text>

        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'CONSENSUS' && styles.activeTab]}
            onPress={() => setActiveTab('CONSENSUS')}
          >
            <Text style={[styles.tabText, activeTab === 'CONSENSUS' && styles.activeTabText]}>CONSENSUS</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'REWARDS' && styles.activeTab]}
            onPress={() => setActiveTab('REWARDS')}
          >
            <Text style={[styles.tabText, activeTab === 'REWARDS' && styles.activeTabText]}>LUCKY DRAW REWARDS</Text>
          </TouchableOpacity>
        </View>

        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>CALCULATING 0.5 CONSENSUS BINS...</Text>
          </View>
        ) : activeTab === 'CONSENSUS' ? (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            <View style={styles.modeCard}>
              <View style={styles.modeIconBox}>
                <FontAwesome5 name="crown" size={16} color="#ffffff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.modeLabel}>CURRENT CONSENSUS MODE PEAK</Text>
                <Text style={styles.modeValue}>
                  {modeBin.toFixed(1)} <Text style={{ fontSize: 11, color: '#777777' }}>/ 10.0</Text>
                </Text>
              </View>
              {consensusData?.userInWinningPool ? (
                <View style={styles.winningBadge}>
                  <Text style={styles.winningBadgeText}>IN DRAW POOL</Text>
                </View>
              ) : null}
            </View>

            <Text style={styles.tableHeaderTitle}>CROWD RATING DISTRIBUTION (0.0 – 10.0)</Text>
            
            <View style={styles.histogramContainer}>
              <View style={styles.histogramBars}>
                {binsList.map((b) => {
                  const heightPct = (b.userCount / maxUserCount) * 100;
                  const isUser = userBin === b.bin;
                  const isPeak = b.bin === modeBin;

                  return (
                    <View key={b.bin} style={styles.barCol}>
                      <View style={styles.barTrack}>
                        <View 
                          style={[
                            styles.barFill, 
                            { height: `${Math.max(heightPct, 6)}%` },
                            isPeak && styles.peakBar,
                            isUser && styles.userBar
                          ]} 
                        />
                      </View>
                      <Text style={[styles.barLabel, (isPeak || isUser) && { color: '#000000', fontWeight: '900' }]}>
                        {b.bin % 1 === 0 ? b.bin : ''}
                      </Text>
                    </View>
                  );
                })}
              </View>

              <View style={styles.histogramLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendBox, { backgroundColor: '#000000' }]} />
                  <Text style={styles.legendText}>Consensus Peak</Text>
                </View>
                {userBin !== undefined && (
                  <View style={styles.legendItem}>
                    <View style={[styles.legendBox, { backgroundColor: '#5e5e5e' }]} />
                    <Text style={styles.legendText}>Your Rating ({userBin.toFixed(1)})</Text>
                  </View>
                )}
              </View>
            </View>

            <Text style={styles.tableHeaderTitle}>TOP CONSENSUS RANKINGS</Text>
            {binsList.filter(b => b.userCount > 0).map((b) => (
              <View key={b.bin} style={[styles.tableRow, b.isMode && styles.tableRowHighlight]}>
                <View style={[styles.rankBadge, b.isMode && { backgroundColor: '#000000' }]}>
                  <Text style={[styles.rankNum, b.isMode && { color: '#ffffff' }]}>#{b.rank}</Text>
                </View>
                <View style={{ flex: 1, paddingHorizontal: 12 }}>
                  <Text style={styles.rowUser}>{b.bin.toFixed(1)} Rating Bucket</Text>
                  <Text style={styles.rowPercentile}>
                    {b.userCount} Evaluators • {b.percentile}th Percentile Tier
                  </Text>
                </View>
                <Text style={styles.rowScore}>{b.userCount} votes</Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <FlatList
            data={campaigns}
            keyExtractor={(c) => c.id}
            refreshing={refreshing}
            onRefresh={onRefresh}
            renderItem={({ item: camp }) => {
              const targetTierText = camp.maxPercentile && camp.maxPercentile < 100
                ? `${camp.minPercentile}th – ${camp.maxPercentile}th Percentile`
                : `≥ ${camp.minPercentile}th Percentile`;

              const isFinished = camp.status === 'FINISHED';

              return (
                <View style={styles.rewardsPanel}>
                  <View style={styles.sponsorBadgeRow}>
                    <Text style={styles.sponsorBadge}>SPONSOR: {camp.sponsorName.toUpperCase()}</Text>
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      <Text style={[styles.percentileBadge, isFinished && { color: '#166534' }]}>
                        {isFinished ? 'DRAW CONCLUDED' : `${camp.winnerCount || 5} WINNERS`}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.rewardsHeadline}>{camp.title}</Text>
                  <Text style={styles.rewardsDesc}>
                    {camp.description || `Submit your evaluation to land inside the ${targetTierText} consensus bracket to qualify for the lucky draw.`}
                  </Text>

                  {isFinished && camp.winningConsensusBin && (
                    <View style={styles.finishedNoticeBox}>
                      <Feather name="check-circle" size={12} color="#166534" />
                      <Text style={styles.finishedNoticeText}>
                        Winning Consensus Mode Bin: <Text style={{ fontWeight: '900' }}>{Number(camp.winningConsensusBin).toFixed(1)}/10.0</Text>
                      </Text>
                    </View>
                  )}
                  
                  <View style={styles.budgetRow}>
                    <Text style={styles.budgetText}>TARGET: <Text style={{ color: COLORS.primary }}>{targetTierText}</Text></Text>
                    <Text style={styles.budgetText}>BUDGET: <Text style={{ color: COLORS.primary }}>{camp.totalBudget || '$5,000'}</Text></Text>
                  </View>

                  <TouchableOpacity 
                    style={styles.inspectRewardsBtn} 
                    onPress={() => navigation.navigate('MyRewards')}
                  >
                    <Text style={styles.inspectRewardsBtnText}>View Won Vouchers in My Rewards →</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
            ListEmptyComponent={
              <View style={styles.rewardsPanel}>
                <Text style={styles.rewardsHeadline}>No Active Sponsor Campaigns</Text>
                <Text style={styles.rewardsDesc}>
                  Sponsor lucky draw reward pools attached to this asset will appear here.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 10, fontWeight: 'bold', color: COLORS.textMuted, letterSpacing: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight, backgroundColor: COLORS.surface },
  headerTitle: { fontSize: 13, fontWeight: '900' },
  movieTitle: { fontSize: 16, fontWeight: '900', marginBottom: 16, color: COLORS.primary },
  tabContainer: { flexDirection: 'row', backgroundColor: COLORS.containerHigh, borderWidth: 1, borderColor: COLORS.primary, padding: 2, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center' },
  activeTab: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 10, fontWeight: '900', color: COLORS.primary },
  activeTabText: { color: COLORS.surface },
  
  modeCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#000000', backgroundColor: '#ffffff', padding: 14, marginBottom: 20 },
  modeIconBox: { width: 36, height: 36, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' },
  modeLabel: { fontSize: 8, fontWeight: '900', color: '#777777', letterSpacing: 0.5 },
  modeValue: { fontSize: 16, fontWeight: '900', color: '#000000' },
  winningBadge: { backgroundColor: '#166534', paddingHorizontal: 8, paddingVertical: 4 },
  winningBadgeText: { fontSize: 8, fontWeight: '900', color: '#ffffff' },

  histogramContainer: { borderWidth: 1, borderColor: '#000000', backgroundColor: '#ffffff', padding: 16, marginBottom: 24 },
  histogramBars: { flexDirection: 'row', alignItems: 'flex-end', height: 110, gap: 2, borderBottomWidth: 1, borderBottomColor: '#c6c6c6', paddingBottom: 4 },
  barCol: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  barTrack: { width: '100%', height: '88%', justifyContent: 'flex-end', alignItems: 'center' },
  barFill: { width: '80%', backgroundColor: '#e8e8e8' },
  peakBar: { backgroundColor: '#000000' },
  userBar: { backgroundColor: '#5e5e5e', borderWidth: 1, borderColor: '#000000' },
  barLabel: { fontSize: 7, color: '#777777', marginTop: 4, fontMono: true },
  histogramLegend: { flexDirection: 'row', gap: 14, marginTop: 12, justifyContent: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendBox: { width: 8, height: 8 },
  legendText: { fontSize: 9, color: '#474747', fontWeight: 'bold' },

  tableHeaderTitle: { fontSize: 9, fontWeight: '900', color: COLORS.secondary, letterSpacing: 1, marginBottom: 10 },
  tableRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.borderLight, backgroundColor: COLORS.surface, marginBottom: 6, padding: 8 },
  tableRowHighlight: { borderColor: '#000000', backgroundColor: '#f3f3f4' },
  rankBadge: { width: 28, height: 28, backgroundColor: COLORS.containerLow, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.borderLight },
  rankNum: { fontSize: 10, fontWeight: '900', color: COLORS.primary },
  rowUser: { fontSize: 11, fontWeight: 'bold', color: COLORS.primary },
  rowPercentile: { fontSize: 8, fontWeight: 'bold', color: COLORS.textMuted },
  rowScore: { fontSize: 12, fontWeight: '900', paddingRight: 4, color: COLORS.primary },

  rewardsPanel: { borderWidth: 1, borderColor: COLORS.primary, backgroundColor: COLORS.surface, padding: 18, marginBottom: 14 },
  sponsorBadgeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  sponsorBadge: { fontSize: 8, fontWeight: '900', color: COLORS.textMuted },
  percentileBadge: { fontSize: 8, fontWeight: '900', color: COLORS.primary },
  rewardsHeadline: { fontSize: 13, fontWeight: '900', marginBottom: 6, color: COLORS.primary },
  rewardsDesc: { fontSize: 10, color: COLORS.textSecondary, lineHeight: 16, marginBottom: 12 },
  finishedNoticeBox: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#bbf7d0', padding: 8, marginBottom: 12 },
  finishedNoticeText: { fontSize: 9, color: '#166534', fontWeight: 'bold' },
  budgetRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: COLORS.borderLight, paddingTop: 8, marginBottom: 10 },
  budgetText: { fontSize: 8, fontWeight: '900', color: COLORS.textSecondary },
  inspectRewardsBtn: { alignItems: 'center', paddingVertical: 6, borderTopWidth: 1, borderTopColor: '#f3f3f4' },
  inspectRewardsBtnText: { fontSize: 9, fontWeight: 'bold', color: '#000000', textDecorationLine: 'underline' }
});