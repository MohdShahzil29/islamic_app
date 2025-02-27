import { StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { fontStyles } from '../../src/styles/fonts';

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
        const response = await axios.get(`http://192.168.37.77:5000/api/surahs/getbyId/${id}`);
        setSurah(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch surah details');
        setLoading(false);
      }
    };
    fetchSurah();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007aff" />
        <Text style={styles.loaderText}>Loading Surah...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!surah) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>Surah not found</Text>
      </View>
    );
  }

  // Get header title based on selected language
  const getTitle = () => {
    if (language === 'ar') return surah.nameArabic;
    if (language === 'en') return surah.nameEnglish;
    return surah.nameUrdu;
  };

  // Insert newline before each verse marker (e.g., "1:2")
  const getFormattedDetails = () => {
    const detailsText =
      language === 'ar'
        ? surah.detailsArabi
        : language === 'en'
        ? surah.detailsEnglish
        : surah.detailsUrdu;
    return detailsText.replace(/(\d+:\d+)/g, '\n$1');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text
          style={[
            language === 'ar' ? styles.nameArabic : language === 'ur' ? styles.nameUrdu : styles.nameEnglish,
          ]}
        >
          {getTitle()}
        </Text>
      </View>

      {/* Info Card */}
      <View style={styles.card}>
        <Text style={styles.cardText}>Chapter: {surah.chapterNumber}</Text>
        <Text style={styles.cardText}>Revelation: {surah.revelationType}</Text>
        <Text style={styles.cardText}>Place: {surah.place}</Text>
        <Text style={styles.cardText}>Verses: {surah.totalVerses}</Text>
      </View>

      {/* Language Switcher */}
      <View style={styles.languageContainer}>
        <TouchableOpacity
          onPress={() => setLanguage('ar')}
          style={[styles.languageButton, language === 'ar' && styles.activeButton]}
        >
          <Text style={[styles.languageText, language === 'ar' && styles.activeText]}>
            عربی
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setLanguage('en')}
          style={[styles.languageButton, language === 'en' && styles.activeButton]}
        >
          <Text style={[styles.languageText, language === 'en' && styles.activeText]}>
            English
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setLanguage('ur')}
          style={[styles.languageButton, language === 'ur' && styles.activeButton]}
        >
          <Text style={[styles.languageText, language === 'ur' && styles.activeText]}>
            اردو
          </Text>
        </TouchableOpacity>
      </View>

      {/* Details Card */}
      <View style={styles.textCard}>
        <Text
          style={[
            language === 'ar' ? styles.arabicContent : language === 'ur' ? styles.urduContent : styles.englishContent,
          ]}
        >
          {getFormattedDetails()}
        </Text>
      </View>

      {/* Tafseer Section */}
      <View style={styles.textCard}>
        <Text style={styles.sectionTitle}>Tafseer</Text>
        <Text
          style={[
            language === 'ar' ? styles.arabicContent : language === 'ur' ? styles.urduContent : styles.englishContent,
          ]}
        >
          {surah.tafseer}
        </Text>
      </View>
    </ScrollView>
  );
};

export default SurahDetails;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 18,
    color: '#333',
  },
  errorText: {
    fontSize: 18,
    color: '#ff3b30',
  },
  headerContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  arabicContent: {
    ...fontStyles.arabicText,
    marginBottom: 20,
  },
  urduContent: {
    ...fontStyles.urduText,
    marginBottom: 20,
  },
  englishContent: {
    ...fontStyles.englishText,
    marginBottom: 20,
  },
  nameArabic: {
    ...fontStyles.arabicText,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  nameUrdu: {
    ...fontStyles.urduText,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  nameEnglish: {
    ...fontStyles.englishText,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  languageButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#eee',
    borderRadius: 25,
  },
  activeButton: {
    backgroundColor: '#007aff',
  },
  languageText: {
    fontSize: 16,
    color: '#555',
  },
  activeText: {
    color: '#fff',
    fontWeight: '600',
  },
  textCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#007aff',
    marginBottom: 10,
  },
});
