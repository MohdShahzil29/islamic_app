import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import GestureRecognizer from 'react-native-swipe-gestures';
import { Audio } from 'expo-av';
import { useTheme } from '@/src/context/ThemeContext';
import { fontStyles } from '@/src/styles/fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

// Define TypeScript types for the audio data.
interface AudioAyah {
  number: number;
  audio: string;
  audioSecondary: string[];
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
}

interface AudioSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  ayahs: AudioAyah[];
}

interface QuranAudioData {
  surahs: AudioSurah[];
}

const QuranAudio: React.FC = () => {
  const { isDarkMode, theme } = useTheme();
  const [data, setData] = useState<QuranAudioData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentSurahIndex, setCurrentSurahIndex] = useState<number>(0);
  const [currentAyahIndex, setCurrentAyahIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get<QuranAudioData>(
        'http://api.alquran.cloud/v1/quran/ar.alafasy'
      );
      if (response.data && response.data.data) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching Quran audio data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const loadSavedIndices = async () => {
      try {
        const savedSurahIndex = await AsyncStorage.getItem('currentSurahIndex');
        const savedAyahIndex = await AsyncStorage.getItem('currentAyahIndex');
        if (savedSurahIndex !== null) {
          setCurrentSurahIndex(parseInt(savedSurahIndex, 10));
        }
        if (savedAyahIndex !== null) {
          setCurrentAyahIndex(parseInt(savedAyahIndex, 10));
        }
      } catch (error) {
        console.error('Error loading saved indices:', error);
      }
    };

    fetchData();
    loadSavedIndices();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    const saveIndices = async () => {
      try {
        await AsyncStorage.setItem('currentSurahIndex', currentSurahIndex.toString());
        if (currentAyahIndex !== null) {
          await AsyncStorage.setItem('currentAyahIndex', currentAyahIndex.toString());
        } else {
          await AsyncStorage.removeItem('currentAyahIndex');
        }
      } catch (error) {
        console.error('Error saving indices:', error);
      }
    };

    saveIndices();
  }, [currentSurahIndex, currentAyahIndex]);

  const onSwipeLeft = () => {
    if (data && currentSurahIndex < data.surahs.length - 1) {
      setCurrentSurahIndex(currentSurahIndex + 1);
      setCurrentAyahIndex(null);
    }
  };

  const onSwipeRight = () => {
    if (data && currentSurahIndex > 0) {
      setCurrentSurahIndex(currentSurahIndex - 1);
      setCurrentAyahIndex(null);
    }
  };

  const playAyahAudio = useCallback(
    async (ayahIndex: number, audioUrl: string) => {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      setCurrentAyahIndex(ayahIndex);
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
        (status) => {
          if (status.didJustFinish && status.isLoaded) {
            if (data) {
              const currentSurah = data.surahs[currentSurahIndex];
              const nextIndex = ayahIndex + 1;
              if (nextIndex < currentSurah.ayahs.length) {
                playAyahAudio(nextIndex, currentSurah.ayahs[nextIndex].audio);
              } else {
                setCurrentAyahIndex(null);
                setIsPlaying(false);
              }
            }
          }
        }
      );
      setSound(newSound);
      setIsPlaying(true);
    },
    [data, currentSurahIndex, sound]
  );

  const togglePlayPause = async (ayahIndex: number, audioUrl: string) => {
    if (currentAyahIndex === ayahIndex) {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      }
    } else {
      await playAyahAudio(ayahIndex, audioUrl);
    }
  };

  const currentSurah = data ? data.surahs[currentSurahIndex] : null;

  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: isDarkMode ? '#121212' : '#FDF6E3',
          padding: width * 0.05,
          justifyContent: 'center',
          alignItems: 'center',
        },
        header: {
          fontSize: width * 0.07,
          color: isDarkMode ? '#E0E0E0' : '#333',
          textAlign: 'center',
          fontFamily: fontStyles.urduText.fontFamily,
          marginBottom: height * 0.02,
          backgroundColor: isDarkMode ? '#333' : '#FFF8DC',
          padding: 10,
          borderRadius: 10,
          borderColor: '#B08B57',
          borderWidth: 2,
        },
        surahInfo: {
          fontSize: width * 0.05,
          color: isDarkMode ? '#E0E0E0' : '#333',
          textAlign: 'center',
          fontFamily: fontStyles.englishText.fontFamily,
          marginBottom: height * 0.02,
        },
        ayahContainer: {
          marginBottom: height * 0.02,
          padding: 10,
          borderRadius: 8,
          backgroundColor: isDarkMode ? '#333' : '#fff',
          shadowColor: isDarkMode ? '#000' : '#ccc',
          shadowOpacity: 0.5,
          shadowRadius: 5,
          elevation: 3,
          width: '100%',
          borderColor: '#B08B57',
          borderWidth: 2,
        },
        ayahText: {
          fontSize: width * 0.06,
          color: isDarkMode ? '#E0E0E0' : '#333',
          textAlign: 'right',
          lineHeight: width * 0.08,
          fontFamily: fontStyles.arabicText.fontFamily,
          writingDirection: 'rtl',
          marginBottom: 10,
        },
        playButton: {
          backgroundColor: isDarkMode ? '#66B2FF' : '#B08B57',
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 5,
          alignSelf: 'flex-end',
        },
        playButtonText: {
          color: '#fff',
          fontSize: 16,
          fontFamily: fontStyles.englishText.fontFamily,
        },
      }),
    [isDarkMode, theme]
  );

  return (
    <GestureRecognizer
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
      style={{ flex: 1 }}
    >
      <View style={dynamicStyles.container}>
        {loading ? (
          <ActivityIndicator size="large" color={isDarkMode ? '#66B2FF' : '#B08B57'} />
        ) : (
          currentSurah && (
            <>
              <Text style={dynamicStyles.header}>
                {`${currentSurah.name} (${currentSurah.number})`}
              </Text>
              <Text style={dynamicStyles.surahInfo}>
                {currentSurah.englishNameTranslation}
              </Text>
              <ScrollView style={{ width: '100%' }}>
                {currentSurah.ayahs.map((ayah, index) => (
                  <View key={ayah.number} style={dynamicStyles.ayahContainer}>
                    <Text style={dynamicStyles.ayahText}>{ayah.text}</Text>
                    <TouchableOpacity
                      style={dynamicStyles.playButton}
                      onPress={() => togglePlayPause(index, ayah.audio)}
                    >
                      <Text style={dynamicStyles.playButtonText}>
                        {currentAyahIndex === index
                          ? isPlaying
                            ? 'Pause Audio'
                            : 'Resume Audio'
                          : 'Play Audio'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </>
          )
        )}
      </View>
    </GestureRecognizer>
  );
};

export default QuranAudio;
