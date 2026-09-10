import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  Image, 
  Modal, 
  useWindowDimensions, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as ScreenOrientation from 'expo-screen-orientation';
import { COLORS } from '../constants/theme';
import { mobileApi, resolveMediaUrl, getYouTubeInfo } from '../services/mobileApi';
import { useLanguage } from '../context/LanguageContext';

const NativeVideoPlayer = ({ url, height }) => {
  const player = useVideoPlayer(url, (p) => { p.loop = false; });
  return <VideoView style={[styles.playerMedia, { height }]} player={player} allowsFullscreen={true} contentFit="contain" />;
};

const YouTubePlayerView = ({ videoId, height, onFullscreen }) => (
  <View style={{ width: '100%', height, backgroundColor: '#000000' }}>
    <YoutubePlayer height={height} play={false} videoId={videoId} onFullScreenChange={onFullscreen} />
  </View>
);

// TASK 4.1: Native Audio Player for Songs & Podcasts
const NativeAudioPlayer = ({ url, title, height }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const player = useVideoPlayer(url, (p) => {
    p.loop = false;
  });

  useEffect(() => {
    const sub = player.addListener('playingChange', (event) => {
      setIsPlaying(event.isPlaying);
    });

    return () => {
      sub.remove();
      try {
        player.pause();
      } catch {
        // Ignored on teardown
      }
    };
  }, [player]);

  const togglePlay = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  return (
    <View style={[styles.audioContainer, { height }]}>
      <View style={styles.audioIconWrapper}>
        <Feather name="disc" size={38} color="#ffffff" />
      </View>

      <Text style={styles.audioTitleText} numberOfLines={1}>{title || 'Audio Stream'}</Text>
      <Text style={styles.audioSubText}>HIGH FIDELITY AUDIO STREAM</Text>

      <TouchableOpacity 
        style={styles.audioPlayButton} 
        onPress={togglePlay}
        activeOpacity={0.8}
      >
        <Feather name={isPlaying ? "pause" : "play"} size={16} color="#000000" />
        <Text style={styles.audioPlayButtonText}>{isPlaying ? 'PAUSE AUDIO' : 'PLAY AUDIO'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const NativeSlider = ({ label, initialValue, onFinalChange }) => {
  const [displayValue, setDisplayValue] = useState(initialValue);
  return (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderLabelRow}>
        <Text style={styles.sliderLabel}>{label.toUpperCase()}</Text>
        <Text style={styles.sliderValue}>Value: {displayValue}</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={0} 
        maximumValue={10} 
        step={1} 
        value={initialValue}
        onValueChange={setDisplayValue} 
        onSlidingComplete={onFinalChange} 
        minimumTrackTintColor={COLORS.primary} 
        maximumTrackTintColor={COLORS.textMuted} 
        thumbTintColor={COLORS.primary}
      />
    </View>
  );
};

export default function RateContentScreen({ route, navigation }) {
  const { t, language } = useLanguage();
  const { item } = route.params || { item: null };
  const { width } = useWindowDimensions();
  
  const isTablet = width >= 768;
  const contentMaxWidth = isTablet ? 800 : '100%';
  const videoHeight = isTablet ? 450 : (width - 48) * (9 / 16);

  const [paramsList, setParamsList] = useState([]);
  const [scores, setScores] = useState({});
  const [feedback, setFeedback] = useState('');
  
  const [checkingPrevious, setCheckingPrevious] = useState(true); 
  const [loadingParams, setLoadingParams] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  useEffect(() => {
    if (!item?.id) return;

    const verifyPreviousSubmission = async () => {
      try {
        const token = await mobileApi.getToken();
        if (!token) {
          setCheckingPrevious(false);
          return;
        }

        setCheckingPrevious(true);
        const res = await mobileApi.get(`/reviews/check/${item.id}`);

        if (res.hasReviewed && res.review) {
          navigation.replace('ReviewSubmitted', { reviewData: res.review });
          return;
        }
      } catch (err) {
        console.error('Check review status skipped:', err);
      } finally {
        setCheckingPrevious(false);
      }
    };

    verifyPreviousSubmission();
  }, [item?.id]);

  useEffect(() => {
    if (!item?.id) return;
    const fetchParams = async () => {
      try {
        const data = await mobileApi.get(`/media/${item.id}/parameters`);
        setParamsList(data || []);
        
        const initScores = {};
        (data || []).forEach(p => { initScores[p.id] = 5; });
        setScores(initScores);
      } catch (err) {
        console.error('Failed to fetch parameters', err);
      } finally {
        setLoadingParams(false);
      }
    };
    fetchParams();
  }, [item?.id]);

  const handleYouTubeFullscreen = async (isFullscreen) => {
    if (isFullscreen) {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    } else {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }
  };

  const handleScoreChange = (paramId, value) => {
    setScores(prev => ({ ...prev, [paramId]: value }));
  };

  const handleSubmit = async () => {
    if (!item?.id) return;

    const parameterScores = Object.keys(scores).map(key => ({
      parameterId: key,
      score: scores[key]
    }));

    const reviewDraft = {
      item,
      parameterScores,
      feedback: feedback || 'High quality structural layout and composition.'
    };

    const token = await mobileApi.getToken();
    if (!token) {
      navigation.navigate('Login', { pendingReview: reviewDraft });
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('mediaItemId', item.id);
      formData.append('rawTextInput', reviewDraft.feedback);
      formData.append('parameterScores', JSON.stringify(parameterScores));

      const res = await mobileApi.upload('/reviews/submit', formData);
      navigation.replace('ReviewSubmitted', { reviewData: res });

    } catch (error) {
      Alert.alert('Submission Error', error.message || 'Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // TASK 4.1: Render active player based on asset media type
  const renderActivePlayer = () => {
    const type = (item?.mediaType || '').toUpperCase();
    const mediaUrl = resolveMediaUrl(item?.contentUrl);
    const ytInfo = getYouTubeInfo(mediaUrl);

    if (type === 'POSTER' && mediaUrl) {
      return (
        <TouchableOpacity style={[styles.playerMedia, { height: videoHeight }]} onPress={() => setImageModalVisible(true)} activeOpacity={0.9}>
          <Image source={{ uri: mediaUrl }} style={[styles.playerMedia, {height: videoHeight}]} resizeMode="contain" />
          <View style={styles.expandIcon}><Feather name="maximize-2" size={16} color="white" /></View>
        </TouchableOpacity>
      );
    } else if (ytInfo.isYoutube) {
      return <YouTubePlayerView videoId={ytInfo.videoId} height={videoHeight} onFullscreen={handleYouTubeFullscreen} />;
    } else if ((type === 'SONG' || type === 'PODCAST') && mediaUrl) {
      return <NativeAudioPlayer url={mediaUrl} title={item?.title} height={videoHeight} />;
    } else if (mediaUrl) {
      return <NativeVideoPlayer url={mediaUrl} height={videoHeight} />;
    }

    return (
      <View style={[styles.fallbackPlayer, { height: videoHeight }]}>
        <Text style={styles.canvasText}>{item?.title || 'MEDIA CANVAS'}</Text>
      </View>
    );
  };

  if (checkingPrevious) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.checkingText}>{t('verifying_audit')}</Text>
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ padding: 24, textAlign: 'center' }}>No media item selected.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} disabled={isSubmitting}>
          <Feather name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('rate_content')}</Text>
        <Feather name="more-vertical" size={20} color="black" />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView contentContainerStyle={{ alignItems: 'center', flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={{ width: '100%', maxWidth: contentMaxWidth, padding: 24 }}>
            
            <View style={[styles.playerCanvas, { height: videoHeight }]}>
              {renderActivePlayer()}
            </View>

            <Text style={styles.sectionHeader}>{t('parameters')}</Text>

            {loadingParams ? (
              <ActivityIndicator size="small" color={COLORS.primary} style={{ marginBottom: 24 }} />
            ) : (
              <View style={styles.slidersBlock}>
                {paramsList.length > 0 ? paramsList.map((param) => {
                  const localizedLabel = param.translations?.[language.toLowerCase()] || t(param.parameter_name) || param.parameter_name;
                  return (
                    <NativeSlider 
                      key={param.id} 
                      label={localizedLabel} 
                      initialValue={scores[param.id] || 5} 
                      onFinalChange={(val) => handleScoreChange(param.id, val)} 
                    />
                  );
                }) : (
                  <Text style={{ fontSize: 11, color: COLORS.textMuted, fontStyle: 'italic', marginBottom: 24 }}>
                    No dynamic parameters configured for this asset.
                  </Text>
                )}
              </View>
            )}

            {/* TASK 4.3: Polished Text Audit Engine Canvas */}
            <View style={styles.inputContainer}>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>{t('ai_formatting_on')}</Text>
                <Text style={styles.modeLabel}>TEXT AUDIT ENGINE</Text>
              </View>

              <TextInput
                multiline
                numberOfLines={4}
                value={feedback}
                onChangeText={setFeedback}
                placeholder="Provide qualitative critique across pacing, visual tone, or acoustic composition..."
                placeholderTextColor={COLORS.textMuted}
                style={styles.textInput}
                editable={!isSubmitting}
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <ActivityIndicator size="small" color={COLORS.primary} />
                  <Text style={styles.submitButtonText}>{t('processing_ai')}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.submitButtonText}>{t('submit_review')}</Text>
                  <Feather name="arrow-right" size={16} color={COLORS.primary} />
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.reportButton} onPress={() => navigation.navigate('ReportContent', { item })} disabled={isSubmitting}>
              <Feather name="alert-triangle" size={16} color={COLORS.surface} />
              <Text style={styles.reportText}>{t('report_content')}</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal 
        visible={imageModalVisible} 
        transparent={false} 
        animationType="fade" 
        onRequestClose={async () => {
          setImageModalVisible(false);
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        }}
        onShow={async () => {
          await ScreenOrientation.unlockAsync();
        }}
      >
        <View style={styles.fullScreenImageContainer}>
          <TouchableOpacity 
            style={styles.closeFullScreenBtn} 
            onPress={async () => {
              setImageModalVisible(false);
              await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            }}
          >
            <Feather name="x" size={28} color="white" />
          </TouchableOpacity>
          <Image source={{ uri: resolveMediaUrl(item?.contentUrl) }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  checkingText: { marginTop: 12, fontSize: 10, fontWeight: '900', color: COLORS.textMuted, letterSpacing: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight, backgroundColor: COLORS.surface },
  headerTitle: { fontSize: 14, fontWeight: '900' },
  playerCanvas: { width: '100%', backgroundColor: '#000000', borderWidth: 1, borderColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 20, overflow: 'hidden' },
  playerMedia: { width: '100%', backgroundColor: '#000000' },
  expandIcon: { position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', padding: 6, borderRadius: 4 },
  fallbackPlayer: { width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.containerHigh },
  canvasText: { fontSize: 12, fontWeight: 'bold', color: COLORS.textSecondary },

  // Audio Player Styles
  audioContainer: { width: '100%', backgroundColor: '#111111', justifyContent: 'center', alignItems: 'center', padding: 20 },
  audioIconWrapper: { width: 64, height: 64, borderWidth: 1, borderColor: '#333333', backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  audioTitleText: { fontSize: 14, fontWeight: '900', color: '#ffffff', letterSpacing: 0.5, marginBottom: 2, textAlign: 'center' },
  audioStatus: { fontSize: 9, fontMono: true, fontWeight: 'bold', color: '#777777', letterSpacing: 1, marginBottom: 16 },
  audioPlayButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#ffffff', paddingVertical: 10, paddingHorizontal: 20, borderWidth: 1, borderColor: '#ffffff' },
  audioPlayButtonText: { fontSize: 11, fontWeight: '900', color: '#000000', letterSpacing: 1 },

  sectionHeader: { fontSize: 13, fontWeight: '900', letterSpacing: 0.5, borderBottomWidth: 1, borderBottomColor: COLORS.primary, paddingBottom: 4, marginBottom: 20 },
  slidersBlock: { gap: 16, marginBottom: 24 },
  sliderContainer: { width: '100%', marginBottom: 10 },
  sliderLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 0, paddingHorizontal: 4 },
  sliderLabel: { fontSize: 11, fontWeight: '900' },
  sliderValue: { fontSize: 11, color: COLORS.textSecondary, fontWeight: 'bold' },
  slider: { width: '100%', height: 40 },
  inputContainer: { borderWidth: 1, borderColor: COLORS.primary, padding: 12, marginBottom: 24, backgroundColor: COLORS.surface },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statusLabel: { fontSize: 9, fontWeight: '900', color: COLORS.primary },
  modeLabel: { fontSize: 8, fontWeight: '900', color: COLORS.textSecondary, letterSpacing: 0.5 },
  textInput: { fontSize: 12, color: COLORS.primary, height: 100, textAlignVertical: 'top' },
  submitButton: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.primary, paddingVertical: 14, alignItems: 'center', marginBottom: 12, flexDirection: 'row', justifyContent: 'center', gap: 8 },
  submitButtonText: { color: COLORS.primary, fontSize: 12, fontWeight: '900' },
  reportButton: { backgroundColor: COLORS.danger, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.primary, flexDirection: 'row', justifyContent: 'center', gap: 8 },
  reportText: { fontSize: 12, fontWeight: '900', color: COLORS.surface },
  fullScreenImageContainer: { flex: 1, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' },
  closeFullScreenBtn: { position: 'absolute', top: 40, right: 24, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 20 }
});