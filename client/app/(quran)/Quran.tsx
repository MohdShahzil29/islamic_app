import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Dimensions, Button } from 'react-native';
import axios from 'axios';
import GestureRecognizer from 'react-native-swipe-gestures';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const [fontSize, setFontSize] = useState<number>(width * 0.06); // Initial font size
  const { isDarkMode, theme } = useTheme();

  // Load the last saved page when the component mounts.
  useEffect(() => {
    const loadPage = async () => {
      try {
        const savedPage = await AsyncStorage.getItem('lastPage');
        if (savedPage) {
          setPage(parseInt(savedPage, 10));
        }
      } catch (error) {
        console.error('Error loading saved page:', error);
      }
    };
    loadPage();
  }, []);

  // Save the current page every time it changes.
  useEffect(() => {
    const savePage = async () => {
      try {
        await AsyncStorage.setItem('lastPage', page.toString());
      } catch (error) {
        console.error('Error saving page:', error);
      }
    };
    savePage();
  }, [page]);

  const fetchPage = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api.alquran.cloud/v1/page/${pageNumber}/quran-uthmani`);
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

  const zoomIn = () => {
    setFontSize(prevSize => Math.min(prevSize * 1.2, width * 0.1)); // Limit maximum size
  };

  const zoomOut = () => {
    setFontSize(prevSize => Math.max(prevSize * 0.8, width * 0.04)); // Limit minimum size
  };

  // Combine all ayahs into a single paragraph.
  const combinedAyahs = pageData ? pageData.ayahs.map(ayah => ayah.text).join('  ') : '';
  // Extract the surah name from the first ayah of the page.
  const surahName = pageData && pageData.ayahs.length > 0 ? pageData.ayahs[0].surah.name : '';

  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: isDarkMode ? theme.background : '#FDF6E3', // Soft parchment-like background in light mode.
          padding: width * 0.05,
          justifyContent: 'center',
          alignItems: 'center',
        },
        scrollContainer: {
          paddingVertical: height * 0.02,
          paddingHorizontal: width * 0.03,
          width: '100%',
        },
        surahName: {
          fontSize: width * 0.07,
          color: theme.text,
          textAlign: 'center',
          fontFamily: 'Para', 
          marginBottom: height * 0.02,
        },
        paraText: {
          fontSize: fontSize,
          color: theme.text,
          textAlign: 'right',      
          lineHeight: fontSize * 1.33,  
          fontFamily: 'Para',      
          writingDirection: 'rtl', 
        },
        pageNumber: {
          fontSize: width * 0.045,
          color: isDarkMode ? '#66B2FF' : '#007BFF',
          marginTop: height * 0.02,
          fontWeight: 'bold',
        },
        buttonContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: height * 0.02,
          gap: 40
        },
      }),
    [theme, isDarkMode, fontSize]
  );

  return (
    <GestureRecognizer onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight} style={{ flex: 1 }}>
      <View style={dynamicStyles.container}>
        {loading ? (
          <ActivityIndicator size="large" color={isDarkMode ? '#66B2FF' : '#007BFF'} />
        ) : (
          <>
            {/* Display the surah name from the API */}
            <Text style={dynamicStyles.surahName}>{surahName}</Text>
            <ScrollView contentContainerStyle={dynamicStyles.scrollContainer}>
              <Text style={dynamicStyles.paraText}>
                {combinedAyahs}
              </Text>
            </ScrollView>
            <View style={dynamicStyles.buttonContainer}>
              <Button title="Zoom In" onPress={zoomIn} />
              <Button title="Zoom Out" onPress={zoomOut} />
            </View>
          </>
        )}
        <Text style={dynamicStyles.pageNumber}>صفحہ {page}</Text>
      </View>
    </GestureRecognizer>
  );
};

export default Quran;
