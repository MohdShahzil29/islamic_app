import { StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { fontStyles } from '../../src/styles/fonts';
import { useTheme } from "@/src/context/ThemeContext";

const { width } = Dimensions.get("window");

interface Surah {
  _id: string;
  chapterNumber: number;
  nameArabic: string;
  nameEnglish: string;
  nameUrdu: string;
  englishMeaning: string;
  revelationType: string;
  place: string;
  totalVerses: number;
  detailsArabi: string;
  detailsEnglish: string;
  detailsUrdu: string;
  tafseer: string;
}

const SurahDetails: React.FC = () => {
  const [surah, setSurah] = useState<Surah | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'ar' | 'en' | 'ur'>('ar');
  const route = useRoute();
  const { id } = route.params as { id: string };

  const { theme, isDarkMode } = useTheme();

  // Helper function to choose the correct font for each language
  const getFontFamilyForLanguage = (lang: 'ar' | 'en' | 'ur') => {
    if (lang === 'ar') return 'NotoNaskhArabic';
    if (lang === 'ur') return 'NotoNastaliqUrdu';
    return 'Roboto';
  };

  useEffect(() => {
    const fetchSurah = async () => {
      try {
        if (!id) {
          setError('No Surah ID provided');
          setLoading(false);
          return;
        }
        const response = await axios.get(`https://islamic-app-mf8e.onrender.com/api/surahs/getbyId/${id}`);
        setSurah(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch surah details');
        setLoading(false);
      }
    };
    fetchSurah();
  }, [id]);

  const getTitle = () => {
    if (language === 'ar') return surah?.nameArabic;
    if (language === 'en') return surah?.nameEnglish;
    return surah?.nameUrdu;
  };

  // Insert newline before each verse marker (e.g., "1:2")
  const getFormattedDetails = () => {
    const detailsText =
      language === 'ar'
        ? surah?.detailsArabi || ""
        : language === 'en'
        ? surah?.detailsEnglish || ""
        : surah?.detailsUrdu || "";
    return detailsText.replace(/(\d+:\d+)/g, '\n$1');
  };

  const dynamicStyles = useMemo(() => StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: theme.background,
      padding: width * 0.04,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
    },
    loaderText: {
      marginTop: width * 0.025,
      fontSize: width * 0.045,
      color: theme.text,
    },
    errorText: {
      fontSize: width * 0.045,
      color: '#ff3b30',
    },
    headerContainer: {
      marginBottom: width * 0.08,
      alignItems: 'center',
    },
    arabicContent: {
      ...fontStyles.arabicText,
      marginBottom: width * 0.05,
      color: theme.text,
    },
    urduContent: {
      ...fontStyles.urduText,
      marginBottom: width * 0.05,
      color: theme.text,
    },
    englishContent: {
      ...fontStyles.englishText,
      marginBottom: width * 0.05,
      color: theme.text,
    },
    nameArabic: {
      ...fontStyles.arabicText,
      fontSize: width * 0.07,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: width * 0.03,
      color: theme.text,
    },
    nameUrdu: {
      ...fontStyles.urduText,
      fontSize: width * 0.06,
      textAlign: 'center',
      marginBottom: width * 0.03,
      color: theme.text,
    },
    nameEnglish: {
      ...fontStyles.englishText,
      fontSize: width * 0.055,
      fontWeight: '500',
      textAlign: 'center',
      marginBottom: width * 0.04,
      color: theme.text,
    },
    card: {
      width: '100%',
      backgroundColor: theme.card,
      padding: width * 0.05,
      borderRadius: width * 0.04,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: width * 0.02 },
      shadowOpacity: 0.1,
      shadowRadius: width * 0.02,
      elevation: 5,
      marginBottom: width * 0.05,
    },
    cardText: {
      fontSize: width * 0.045,
      color: theme.text,
      marginBottom: width * 0.02,
    },
    languageContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: width * 0.05,
    },
    languageButton: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: width * 0.03,
      marginHorizontal: width * 0.015,
      backgroundColor: isDarkMode ? theme.card : '#eee',
      borderRadius: width * 0.06,
    },
    activeButton: {
      backgroundColor: '#007aff',
    },
    languageText: {
      fontSize: width * 0.045,
      color: isDarkMode ? theme.text : '#555',
    },
    activeText: {
      color: '#fff',
      fontWeight: '600',
    },
    textCard: {
      width: '100%',
      backgroundColor: theme.card,
      padding: width * 0.05,
      borderRadius: width * 0.04,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: width * 0.02 },
      shadowOpacity: 0.1,
      shadowRadius: width * 0.02,
      elevation: 5,
      marginBottom: width * 0.05,
    },
    sectionTitle: {
      fontSize: width * 0.06,
      fontWeight: '600',
      color: isDarkMode ? "#80BFFF" : "#007aff",
      marginBottom: width * 0.03,
    },
  }), [theme, isDarkMode, width]);

  if (loading) {
    return (
      <View style={dynamicStyles.loaderContainer}>
        <ActivityIndicator size="large" color="#007aff" />
        <Text style={dynamicStyles.loaderText}>Loading Surah...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={dynamicStyles.loaderContainer}>
        <Text style={dynamicStyles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!surah) {
    return (
      <View style={dynamicStyles.loaderContainer}>
        <Text style={dynamicStyles.errorText}>Surah not found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={dynamicStyles.container}>
      {/* Header Section */}
      <View style={dynamicStyles.headerContainer}>
        <Text
          style={[
            language === 'ar'
              ? dynamicStyles.nameArabic
              : language === 'ur'
              ? dynamicStyles.nameUrdu
              : dynamicStyles.nameEnglish,
          ]}
        >
          {getTitle()}
        </Text>
      </View>

      {/* Info Card */}
      <View style={dynamicStyles.card}>
        <Text style={dynamicStyles.cardText}>Chapter: {surah.chapterNumber}</Text>
        <Text style={dynamicStyles.cardText}>Revelation: {surah.revelationType}</Text>
        <Text style={dynamicStyles.cardText}>Place: {surah.place}</Text>
        <Text style={dynamicStyles.cardText}>Verses: {surah.totalVerses}</Text>
      </View>

      {/* Language Switcher */}
      <View style={dynamicStyles.languageContainer}>
        <TouchableOpacity
          onPress={() => setLanguage('ar')}
          style={[dynamicStyles.languageButton, language === 'ar' && dynamicStyles.activeButton]}
        >
          <Text style={[dynamicStyles.languageText, language === 'ar' && dynamicStyles.activeText]}>
            عربی
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setLanguage('en')}
          style={[dynamicStyles.languageButton, language === 'en' && dynamicStyles.activeButton]}
        >
          <Text style={[dynamicStyles.languageText, language === 'en' && dynamicStyles.activeText]}>
            English
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setLanguage('ur')}
          style={[dynamicStyles.languageButton, language === 'ur' && dynamicStyles.activeButton]}
        >
          <Text style={[dynamicStyles.languageText, language === 'ur' && dynamicStyles.activeText]}>
            اردو
          </Text>
        </TouchableOpacity>
      </View>

      {/* Details Card */}
      <View style={dynamicStyles.textCard}>
        <Text
          style={[
            language === 'ar'
              ? dynamicStyles.arabicContent
              : language === 'ur'
              ? dynamicStyles.urduContent
              : dynamicStyles.englishContent,
          ]}
        >
          {getFormattedDetails()}
        </Text>
      </View>

      {/* Tafseer Section */}
      <View style={dynamicStyles.textCard}>
        <Text style={dynamicStyles.sectionTitle}>Explanation</Text>
        <Text
          style={[
            language === 'ar'
              ? dynamicStyles.arabicContent
              : language === 'ur'
              ? dynamicStyles.urduContent
              : dynamicStyles.englishContent,
          ]}
        >
          {surah.tafseer}
        </Text>
      </View>
    </ScrollView>
  );
};

export default SurahDetails;
