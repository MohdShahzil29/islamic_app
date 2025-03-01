import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import axios from 'axios';
import GestureRecognizer from 'react-native-swipe-gestures';
import { useTheme } from '@/src/context/ThemeContext';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
}

interface Ayah {
  number: number;
  text: string;
  surah: Surah;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
}

interface PageData {
  number: number;
  ayahs: Ayah[];
}

const { width, height } = Dimensions.get('window');

const Quran: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { isDarkMode, toggleTheme, theme } = useTheme();

  const fetchPage = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://api.alquran.cloud/v1/page/${pageNumber}/en.asad`);
      if (response.data && response.data.data) {
        setPageData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching page data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPage(page);
  }, [page]);

  const onSwipeLeft = () => {
    if (page < 604) setPage(page + 1);
  };

  const onSwipeRight = () => {
    if (page > 1) setPage(page - 1);
  };
  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.background,
          padding: width * 0.05,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 10
        },
        scrollContainer: {
          paddingVertical: height * 0.02,
          width: '100%',
        },
        ayahContainer: {
          backgroundColor: theme.card,
          borderRadius: 10,
          padding: width * 0.04,
          marginBottom: height * 0.02,
          // Adjust shadow based on the theme
          shadowColor: isDarkMode ? '#fff' : '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 5,
        },
        ayahText: {
          fontSize: width * 0.05,
          color: theme.text,
          textAlign: 'left',
          fontFamily: 'Helvetica',
        },
        ayahInfo: {
          fontSize: width * 0.04,
          color: theme.text,
          textAlign: 'left',
          marginTop: height * 0.01,
        },
        pageNumber: {
          fontSize: width * 0.045,
          color: isDarkMode ? '#66B2FF' : '#007BFF',
          marginTop: height * 0.02,
          fontWeight: 'bold',
        },
        toggleText: {
          color: theme.text,
          fontSize: width * 0.04,
          marginTop: height * 0.02,
        },
      }),
    [theme, isDarkMode]
  );

  return (
    <GestureRecognizer onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight} style={{ flex: 1 }}>
      <View style={dynamicStyles.container}>
        {loading ? (
          <ActivityIndicator size="large" color={isDarkMode ? '#66B2FF' : '#007BFF'} />
        ) : (
          <ScrollView contentContainerStyle={dynamicStyles.scrollContainer}>
            {pageData &&
              pageData.ayahs.map((ayah) => (
                <View key={ayah.number} style={dynamicStyles.ayahContainer}>
                  <Text style={dynamicStyles.ayahText}>{ayah.text}</Text>
                  <Text style={dynamicStyles.ayahInfo}>
                    Surah: {ayah.surah.englishName} (Ayah {ayah.numberInSurah})
                  </Text>
                </View>
              ))}
          </ScrollView>
        )}
        <Text style={dynamicStyles.pageNumber}>Page {page}</Text>
        {/* A simple button to toggle the theme */}
        {/* <TouchableOpacity onPress={toggleTheme}>
          <Text style={dynamicStyles.toggleText}>Toggle Theme</Text>
        </TouchableOpacity> */}
      </View>
    </GestureRecognizer>
  );
};

export default Quran;
